/**
 * populate-books.mjs
 *
 * Uses the Firebase ADMIN SDK (bypasses Firestore security rules).
 * Reads credentials from .env / .env.local in the project root.
 *
 * Usage:
 *   node scripts/populate-books.mjs
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

const BOOK_TITLES = [
    "Fundamentals of Deep Learning: Designing Next-Generation Machine Intelligence",
    "Cloud-Native Architecture: Designing Resilient Distributed Systems",
    "Cybersecurity Essentials for the Modern Enterprise",
    "Data Science with Python: Advanced Analytics and Visualization",
    "Embedded Systems Programming with ARM Cortex-M",
    "Quantum Computing: From Linear Algebra to Physical Realizations",
    "Algorithms for Big Data: Theory and Practice",
    "Compiler Design: Principles, Techniques, and Tools",
    "Modern Operating Systems: Concepts and Design",
    "Database Systems: The Complete Book",
    "Computer Networks: A Systems Approach",
    "Artificial Intelligence: A Modern Synthesis",
];

const PUBLISHERS = [
    "Springer Nature", "CRC Press", "O'Reilly Media",
    "Pearson Education", "McGraw-Hill", "MIT Press",
    "Wiley-IEEE Press", "Morgan Kaufmann", "Packt Publishing",
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pastTs = (yearsBack = 3) =>
    Timestamp.fromMillis(Date.now() - Math.floor(Math.random() * yearsBack * 365 * 24 * 60 * 60 * 1000));
const randomDate = (yearsBack = 5) => {
    const d = new Date(Date.now() - Math.floor(Math.random() * yearsBack * 365 * 24 * 60 * 60 * 1000));
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};
const randomISBN13 = () => {
    const prefix = Math.random() > 0.5 ? "978" : "979";
    const group = Math.floor(Math.random() * 10);
    const pub = String(Math.floor(Math.random() * 900000) + 100000);
    const title = String(Math.floor(Math.random() * 9000) + 1000);
    return `${prefix}-${group}-${pub}-${title}-X`;
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

async function seedBooks(users) {
    if (!users.length) { console.log('\n⚠  No users — nothing to seed.'); return; }
    console.log("\n📝  Seeding Book records…");

    const titles = [...BOOK_TITLES].sort(() => Math.random() - 0.5);
    let titleIdx = 0;
    let batch = db.batch();
    let opCount = 0;
    let totalSeed = 0;

    for (const user of users) {
        const numRecords = Math.floor(Math.random() * 2) + 1; // 1–2 per user

        for (let i = 0; i < numRecords; i++) {
            const id = randomUUID();
            const ref = db.collection("books").doc(id);
            const createdAt = pastTs(5);
            const approvalStatus = pick(APPROVAL_STATUSES);
            const title = titles[titleIdx % titles.length];
            titleIdx++;

            const data = {
                id,
                author: user.ref,
                title_of_book: title,
                date_of_publication: randomDate(5),
                ISBN_number: randomISBN13(),
                publisher_name: pick(PUBLISHERS),
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
    console.log(`\n✅  Seeded ${totalSeed} Book record(s) across ${users.length} user(s).`);
}

async function main() {
    console.log("🔥  Firebase Books Populate Script  (Admin SDK)");
    console.log("===============================================");
    await clearCollection("books");
    const users = await getFacultyUsers();
    await seedBooks(users);
    console.log("\n🎉  Done! Check your Firestore console.\n");
    process.exit(0);
}

main().catch((err) => {
    console.error("\n❌  Script failed:", err.message ?? err);
    process.exit(1);
});
