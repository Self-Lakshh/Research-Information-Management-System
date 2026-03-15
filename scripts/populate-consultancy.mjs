/**
 * populate-consultancy.mjs
 *
 * Uses the Firebase ADMIN SDK (bypasses Firestore security rules).
 * Reads credentials from .env / .env.local in the project root.
 *
 * Usage:
 *   node scripts/populate-consultancy.mjs
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
const PROJECT_STATUSES = ["ongoing", "completed"];

const PROJECT_TITLES = [
    "AI-Powered Predictive Maintenance for Manufacturing Equipment",
    "Blockchain-Based Supply Chain Transparency Platform",
    "Smart Traffic Management System Using Computer Vision",
    "IoT-Enabled Precision Agriculture Advisory System",
    "Cybersecurity Vulnerability Assessment Framework",
    "Natural Language Processing for Legal Document Analysis",
    "Cloud Migration Strategy for Legacy Enterprise Systems",
    "Machine Learning Pipeline for Financial Fraud Detection",
    "Real-Time Air Quality Monitoring and Prediction System",
    "Automated Inventory Optimization Using Reinforcement Learning",
    "Digital Twin Development for Smart Factory Operations",
    "Drone-Based Infrastructure Inspection Using Deep Learning",
];

const ORGANIZATIONS = [
    "Tata Consultancy Services", "Infosys Limited",
    "Wipro Technologies", "HCL Technologies",
    "Tech Mahindra", "L&T Technology Services",
    "Mahindra Electric", "Bosch India",
    "ABB India", "Siemens India",
    "Reliance Industries", "ISRO",
];

const INSTITUTIONS = [
    "IIT Bombay", "IIT Delhi", "IIT Madras",
    "NIT Trichy", "BITS Pilani", "VIT Vellore",
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pastTs = (yearsBack = 3) =>
    Timestamp.fromMillis(Date.now() - Math.floor(Math.random() * yearsBack * 365 * 24 * 60 * 60 * 1000));
const randomDate = (yearsBack = 3) => {
    const d = new Date(Date.now() - Math.floor(Math.random() * yearsBack * 365 * 24 * 60 * 60 * 1000));
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const randomAmount = () => Math.floor(Math.random() * 4900000 + 100000); // 1L – 50L
const randomDuration = () => `${Math.floor(Math.random() * 24) + 6} months`;

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

async function seedConsultancy(users) {
    if (!users.length) { console.log('\n⚠  No users — nothing to seed.'); return; }
    console.log("\n📝  Seeding Consultancy Project records…");

    const titles = [...PROJECT_TITLES].sort(() => Math.random() - 0.5);
    let titleIdx = 0;
    let batch = db.batch();
    let opCount = 0;
    let totalSeed = 0;

    for (const user of users) {
        const numRecords = Math.floor(Math.random() * 2) + 1; // 1–2 per user

        for (let i = 0; i < numRecords; i++) {
            const id = randomUUID();
            const ref = db.collection("consultancy_projects").doc(id);
            const createdAt = pastTs(4);
            const approvalStatus = pick(APPROVAL_STATUSES);
            const title = titles[titleIdx % titles.length];
            titleIdx++;

            // Optionally pick a co-investigator from other users  
            const coInv = users.filter(u => u.id !== user.id);
            const coInvRefs = coInv.length > 0 ? [pick(coInv).ref] : [];

            const data = {
                id,
                project_title: title,
                amount: randomAmount(),
                organization: pick(ORGANIZATIONS),
                organization_url: `https://www.${pick(ORGANIZATIONS).toLowerCase().replace(/\s+/g, "")}.com`,
                principal_investigator_ref: user.ref,
                co_investigators_refs: coInvRefs,
                institution: pick(INSTITUTIONS),
                duration: randomDuration(),
                grant_date: randomDate(3),
                status: pick(PROJECT_STATUSES),
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
    console.log(`\n✅  Seeded ${totalSeed} Consultancy record(s) across ${users.length} user(s).`);
}

async function main() {
    console.log("🔥  Firebase Consultancy Populate Script  (Admin SDK)");
    console.log("=======================================================");
    await clearCollection("consultancy_projects");
    const users = await getFacultyUsers();
    await seedConsultancy(users);
    console.log("\n🎉  Done! Check your Firestore console.\n");
    process.exit(0);
}

main().catch((err) => {
    console.error("\n❌  Script failed:", err.message ?? err);
    process.exit(1);
});
