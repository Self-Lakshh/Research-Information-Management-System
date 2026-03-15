/**
 * populate-journals.mjs
 *
 * Uses the Firebase ADMIN SDK (bypasses Firestore security rules).
 * Reads credentials from .env / .env.local in the project root.
 *
 * Usage:
 *   node scripts/populate-journals.mjs
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { randomUUID } from "crypto";

// ── Load .env / .env.local ────────────────────────────────────────────────────

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
    console.warn("   ⚠  No .env / .env.local file found — using process.env directly.");
}

loadEnv();

// ── Validate required Admin SDK vars ─────────────────────────────────────────

const required = ["FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
    console.error("\n❌  Missing env vars:", missing.join(", "));
    console.error("    Add them to your .env file.\n");
    process.exit(1);
}

// ── Initialise firebase-admin ─────────────────────────────────────────────────

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

// ── Seed data helpers ─────────────────────────────────────────────────────────

const APPROVAL_STATUSES = ["pending", "approved", "rejected"];
const JOURNAL_TYPES = ["SCI", "SCIE", "Scopus", "UGC Care", "Other"];

const PAPER_TITLES = [
    "Deep Learning Approaches for Medical Image Segmentation",
    "Federated Learning for Privacy-Preserving Healthcare Analytics",
    "Graph Neural Networks in Knowledge Representation",
    "Transformer Models for Code Synthesis and Bug Detection",
    "Optimizing Distributed Systems with Reinforcement Learning",
    "Adversarial Robustness in Natural Language Processing",
    "Explainable AI for Clinical Decision Support",
    "Multi-Modal Learning for Sentiment Analysis",
    "Quantum Computing Algorithms for Optimization Problems",
    "Secure Multi-Party Computation in Cloud Environments",
    "Edge AI for Real-Time Anomaly Detection in IoT Networks",
    "Sustainable Deep Learning with Sparse Neural Architectures",
];

const JOURNAL_NAMES = [
    "IEEE Transactions on Neural Networks and Learning Systems",
    "Journal of Machine Learning Research",
    "ACM Transactions on Intelligent Systems",
    "Expert Systems with Applications",
    "Pattern Recognition Letters",
    "Computers & Security",
    "Future Generation Computer Systems",
    "Information Sciences",
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pastTs = (yearsBack = 3) =>
    Timestamp.fromMillis(Date.now() - Math.floor(Math.random() * yearsBack * 365 * 24 * 60 * 60 * 1000));
const randomDate = (yearsBack = 3) => {
    const d = new Date(Date.now() - Math.floor(Math.random() * yearsBack * 365 * 24 * 60 * 60 * 1000));
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const randomISSN = () =>
    `${String(Math.floor(Math.random() * 9000) + 1000)}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

// ── Step 1: Clear collection ───────────────────────────────────────────────────

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

// ── Step 2: Fetch faculty users ───────────────────────────────────────────────

async function getFacultyUsers() {
    console.log('\n👥  Fetching users where user_role === "user"…');
    const snap = await db.collection("users").where("user_role", "==", "user").get();
    console.log(`   Found ${snap.docs.length} user(s).`);
    return snap.docs.map((d) => ({ id: d.id, ref: d.ref, data: d.data() }));
}

// ── Step 3: Seed Journals ─────────────────────────────────────────────────────

async function seedJournals(users) {
    if (!users.length) { console.log('\n⚠  No users — nothing to seed.'); return; }
    console.log("\n📝  Seeding Journal records…");

    const titles = [...PAPER_TITLES].sort(() => Math.random() - 0.5);
    let titleIdx = 0;
    let batch = db.batch();
    let opCount = 0;
    let totalSeed = 0;

    for (const user of users) {
        const numRecords = Math.floor(Math.random() * 4) + 1; // 1–4 per user

        for (let i = 0; i < numRecords; i++) {
            const id = randomUUID();
            const ref = db.collection("journals").doc(id);
            const createdAt = pastTs(4);
            const approvalStatus = pick(APPROVAL_STATUSES);
            const title = titles[titleIdx % titles.length];
            titleIdx++;

            const data = {
                id,
                title_of_paper: title,
                authors: [user.ref],
                journal_name: pick(JOURNAL_NAMES),
                journal_type: pick(JOURNAL_TYPES),
                date_of_publication: randomDate(4),
                ISSN_number: randomISSN(),
                web_link: `https://doi.org/10.1000/${Math.floor(Math.random() * 99999)}`,
                sources: [],

                // Approval workflow
                approval_status: approvalStatus,
                approval_action_by: approvalStatus !== "pending" ? user.ref : null,
                action_at: approvalStatus !== "pending" ? pastTs(1) : null,

                // Metadata
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
    console.log(`\n✅  Seeded ${totalSeed} Journal record(s) across ${users.length} user(s).`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
    console.log("🔥  Firebase Journal Populate Script  (Admin SDK)");
    console.log("=================================================");
    await clearCollection("journals");
    const users = await getFacultyUsers();
    await seedJournals(users);
    console.log("\n🎉  Done! Check your Firestore console.\n");
    process.exit(0);
}

main().catch((err) => {
    console.error("\n❌  Script failed:", err.message ?? err);
    process.exit(1);
});
