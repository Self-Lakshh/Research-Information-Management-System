/**
 * populate-conferences.mjs
 *
 * Uses the Firebase ADMIN SDK (bypasses Firestore security rules).
 * Reads credentials from .env / .env.local in the project root.
 *
 * Usage:
 *   node scripts/populate-conferences.mjs
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dir, "..");

function loadEnv() {
    for (const name of [".env.local", ".env"]) {
        const p = resolve(ROOT, name);
        if (existsSync(p)) {
            console.log(`   Reading env from: ${name}`);
            for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
                const t = line.trim();
                if (!t || t.startsWith("#")) continue;
                const eq = t.indexOf("=");
                if (eq === -1) continue;
                const key = t.slice(0, eq).trim();
                const val = t.slice(eq + 1).trim()
                    .replace(/^["']|["']$/g, "")
                    .replace(/\\n/g, "\n");
                if (!(key in process.env)) process.env[key] = val;
            }
            return;
        }
    }
    console.warn("   ⚠  No .env / .env.local file found.");
}

loadEnv();

const required = ["FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
    console.error("\n❌  Missing env vars:", missing.join(", "));
    process.exit(1);
}

import admin from "firebase-admin";

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY,
    }),
});

const db = admin.firestore();
const { Timestamp } = admin.firestore;

console.log(`\n🔌  Connected to Firebase project: ${process.env.FIREBASE_PROJECT_ID}`);

// ── Data Helpers ──────────────────────────────────────────────────────────────

const APPROVAL_STATUSES = ["pending", "approved", "rejected"];
const ORIGINS = ["National", "International"];
const PUBLISHERS = [
    "Springer", "IEEE", "ACM", "Elsevier", "Wiley",
    "Taylor & Francis", "IGI Global", "IOS Press",
];

const PAPER_TITLES = [
    "Real-Time Object Detection Using YOLOv8 for Autonomous Vehicles",
    "Blockchain-Based Voting System for Transparent Elections",
    "Multimodal Emotion Recognition Using Transformer Architectures",
    "Edge Computing for Latency-Critical Industrial IoT Applications",
    "Privacy-Preserving Machine Learning with Differential Privacy",
    "Smart Grid Optimization Using Multi-Agent Reinforcement Learning",
    "Securing VANET Communications with Lightweight Cryptography",
    "Automated Code Review with Large Language Models",
    "Hybrid Cloud Architecture for Scalable Big Data Processing",
    "Deep Reinforcement Learning for Dynamic Resource Allocation",
    "Fault-Tolerant Consensus in Blockchain Networks",
    "Generative Adversarial Networks for Synthetic Medical Data",
];

const CONFERENCE_NAMES = [
    "International Conference on Machine Learning (ICML)",
    "IEEE International Conference on Computer Vision (ICCV)",
    "ACM Conference on Computer and Communications Security",
    "International Joint Conference on Artificial Intelligence (IJCAI)",
    "IEEE/ACM International Symposium on Information Technology",
    "National Conference on Advanced Computing Technologies",
    "International Conference on Data Mining and Knowledge Discovery",
    "Annual Conference on Neural Information Processing Systems (NeurIPS)",
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pastTs = (yearsBack = 3) =>
    Timestamp.fromMillis(Date.now() - Math.floor(Math.random() * yearsBack * 365 * 24 * 60 * 60 * 1000));
const randomYear = (yearsBack = 5) =>
    String(new Date().getFullYear() - Math.floor(Math.random() * yearsBack));
const randomISBN = () =>
    `978-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 9)}-${Math.floor(Math.random() * 9)}`;

async function clearCollection(colName) {
    console.log(`\n🗑  Deleting all documents in "${colName}"…`);
    const snap = await db.collection(colName).get();
    if (snap.empty) { console.log("   Collection is already empty."); return; }
    let batch = db.batch();
    let count = 0;
    for (const docSnap of snap.docs) {
        batch.delete(docSnap.ref);
        count++;
        if (count % 500 === 0) { await batch.commit(); batch = db.batch(); }
    }
    if (count % 500 !== 0) await batch.commit();
    console.log(`   ✅ Deleted ${count} document(s).`);
}

async function getFacultyUsers() {
    console.log('\n👥  Fetching users where user_role === "user"…');
    const snap = await db.collection("users").where("user_role", "==", "user").get();
    console.log(`   Found ${snap.docs.length} user(s).`);
    return snap.docs.map((d) => ({ id: d.id, ref: d.ref, data: d.data() }));
}

async function seedConferences(users) {
    if (!users.length) { console.log('\n⚠  No users — nothing to seed.'); return; }
    console.log("\n📝  Seeding Conference records…");

    const titles = [...PAPER_TITLES].sort(() => Math.random() - 0.5);
    let titleIdx = 0;
    let batch = db.batch();
    let opCount = 0;
    let totalSeed = 0;

    for (const user of users) {
        const numRecords = Math.floor(Math.random() * 3) + 1; // 1–3

        for (let i = 0; i < numRecords; i++) {
            const id = randomUUID();
            const ref = db.collection("conferences").doc(id);
            const createdAt = pastTs(4);
            const approvalStatus = pick(APPROVAL_STATUSES);
            const year = randomYear(5);
            const title = titles[titleIdx % titles.length];
            titleIdx++;

            const data = {
                id,
                authors: [user.ref],
                title_of_paper: title,
                title_of_proceedings_of_conference: `Proceedings of ${pick(CONFERENCE_NAMES).split("(")[0].trim()} ${year}`,
                name_of_conference: pick(CONFERENCE_NAMES),
                origin: pick(ORIGINS),
                year_of_publication: year,
                isbn_issn_number: randomISBN(),
                name_of_publisher: pick(PUBLISHERS),
                sources: [],

                approval_status: approvalStatus,
                approval_action_by: approvalStatus !== "pending" ? user.ref : null,
                action_at: approvalStatus !== "pending" ? pastTs(1) : null,

                is_active: true,
                created_by: user.ref,
                updated_by: user.ref,
                created_at: createdAt,
                updated_at: Timestamp.now(),
            };

            batch.set(ref, data);
            opCount++;
            totalSeed++;
            if (opCount % 500 === 0) {
                await batch.commit(); batch = db.batch();
                console.log(`   … committed ${totalSeed} so far`);
            }
        }
    }

    if (opCount % 500 !== 0) await batch.commit();
    console.log(`\n✅  Seeded ${totalSeed} Conference record(s) across ${users.length} user(s).`);
}

async function main() {
    console.log("🔥  Firebase Conference Populate Script  (Admin SDK)");
    console.log("====================================================");
    await clearCollection("conferences");
    const users = await getFacultyUsers();
    await seedConferences(users);
    console.log("\n🎉  Done! Check your Firestore console.\n");
    process.exit(0);
}

main().catch((err) => {
    console.error("\n❌  Script failed:", err.message ?? err);
    process.exit(1);
});
