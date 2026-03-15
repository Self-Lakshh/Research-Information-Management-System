/**
 * populate-awards.mjs
 *
 * Uses the Firebase ADMIN SDK (bypasses Firestore security rules).
 * Reads credentials from .env / .env.local in the project root.
 *
 * Usage:
 *   node scripts/populate-awards.mjs
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
const COUNTRIES = ["India", "USA", "UK", "Singapore", "Germany", "Australia", "Canada"];

const AWARD_NAMES = [
    "Best Paper Award",
    "Young Researcher Award",
    "Distinguished Faculty Award",
    "Excellence in Research Award",
    "Innovative Technology Award",
    "National Science Academy Fellowship",
    "Teaching Excellence Award",
    "Best PhD Supervisor Award",
    "Outstanding Contribution Award",
    "Research Achievement Award",
];

const AWARD_TITLES = [
    "Contribution to AI & Machine Learning Research",
    "Advancements in Cybersecurity Technologies",
    "Research in Sustainable Computing",
    "Innovation in Healthcare Technology",
    "Excellence in Data Science Education",
    "Pioneering Work in Quantum Computing",
    "Contribution to Open Source Software",
    "Research Leadership in IoT Systems",
];

const INSTITUTIONS = [
    "IEEE Computer Society", "ACM India", "NASSCOM",
    "Department of Science & Technology", "AICTE", "UGC",
    "National Science Academy", "Indian Academy of Sciences",
    "International Federation for Information Processing",
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pastTs = (yearsBack = 3) =>
    Timestamp.fromMillis(Date.now() - Math.floor(Math.random() * yearsBack * 365 * 24 * 60 * 60 * 1000));

const MONTHS = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
const randomMonthYear = (yearsBack = 4) => {
    const y = new Date().getFullYear() - Math.floor(Math.random() * yearsBack);
    return `${pick(MONTHS)} ${y}`;
};

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

async function seedAwards(users) {
    if (!users.length) { console.log('\n⚠  No users — nothing to seed.'); return; }
    console.log("\n📝  Seeding Award records…");

    let batch = db.batch();
    let opCount = 0;
    let totalSeed = 0;

    for (const user of users) {
        const numRecords = Math.floor(Math.random() * 3) + 1; // 1–3 per user

        for (let i = 0; i < numRecords; i++) {
            const id = randomUUID();
            const ref = db.collection("awards").doc(id);
            const createdAt = pastTs(4);
            const approvalStatus = pick(APPROVAL_STATUSES);

            const data = {
                id,
                award_name: pick(AWARD_NAMES),
                title: pick(AWARD_TITLES),
                recipient_ref: user.ref,
                institution_body: pick(INSTITUTIONS),
                country: pick(COUNTRIES),
                month_year: randomMonthYear(4),
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
    console.log(`\n✅  Seeded ${totalSeed} Award record(s) across ${users.length} user(s).`);
}

async function main() {
    console.log("🔥  Firebase Awards Populate Script  (Admin SDK)");
    console.log("================================================");
    await clearCollection("awards");
    const users = await getFacultyUsers();
    await seedAwards(users);
    console.log("\n🎉  Done! Check your Firestore console.\n");
    process.exit(0);
}

main().catch((err) => {
    console.error("\n❌  Script failed:", err.message ?? err);
    process.exit(1);
});
