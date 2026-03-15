/**
 * populate-ipr.mjs
 *
 * Uses the Firebase ADMIN SDK (bypasses Firestore security rules).
 * Reads credentials from .env / .env.local in the project root.
 *
 * Usage:
 *   node scripts/populate-ipr.mjs
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
                // Strip surrounding quotes and handle escaped newlines
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
const { Timestamp, FieldValue } = admin.firestore;

console.log(`\n🔌  Connected to Firebase project: ${process.env.FIREBASE_PROJECT_ID}`);

// ── Seed data helpers ─────────────────────────────────────────────────────────

const PATENT_TYPES = ["design", "patent", "copyright", "trademark"];
const IPR_STATUSES = ["filed", "granted", "published"];
const COUNTRIES = ["India", "USA", "UK", "Germany", "Japan", "Australia"];
const APPROVAL_STATUSES = ["pending", "approved", "rejected"];

const SAMPLE_TITLES = [
    "Smart Irrigation System Using IoT Sensors",
    "AI-Driven Diagnostic Tool for Early Disease Detection",
    "Blockchain-Based Academic Record Verification",
    "Energy-Efficient Routing Protocol for Wireless Sensor Networks",
    "Renewable Energy Storage Using Nano-composite Materials",
    "Automated Sign Language Recognition Using Deep Learning",
    "Hybrid Cryptography Framework for Cloud Security",
    "Wearable Health Monitoring System with Real-time Alerts",
    "Machine Learning Model for Credit Risk Assessment",
    "Sustainable Packaging Solution from Agricultural Waste",
    "Advanced Water Purification Using Nano-filtration Membranes",
    "Low-Power Edge Computing Framework for Healthcare IoT",
];

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pastTs = (yearsBack = 3) =>
    Timestamp.fromMillis(Date.now() - Math.floor(Math.random() * yearsBack * 365 * 24 * 60 * 60 * 1000));
const genAppNo = () =>
    `IN${new Date().getFullYear() - Math.floor(Math.random() * 5)}${String(Math.floor(Math.random() * 900000) + 100000)}`;

// ── Step 1: Delete all IPR documents ────────────────────────────────────────

async function clearCollection(colName) {
    console.log(`\n🗑  Deleting all documents in "${colName}"…`);

    const snap = await db.collection(colName).get();
    if (snap.empty) {
        console.log("   Collection is already empty.");
        return;
    }

    // Batch-delete in chunks of 500
    let batch = db.batch();
    let count = 0;

    for (const docSnap of snap.docs) {
        batch.delete(docSnap.ref);
        count++;
        if (count % 500 === 0) {
            await batch.commit();
            batch = db.batch();
        }
    }
    if (count % 500 !== 0) await batch.commit();

    console.log(`   ✅ Deleted ${count} document(s).`);
}

// ── Step 2: Fetch users with role "user" ─────────────────────────────────────

async function getFacultyUsers() {
    console.log('\n👥  Fetching users where user_role === "user"…');

    const snap = await db.collection("users")
        .where("user_role", "==", "user")
        .get();

    console.log(`   Found ${snap.docs.length} user(s).`);
    return snap.docs.map((d) => ({ id: d.id, ref: d.ref, data: d.data() }));
}

// ── Step 3: Seed IPR records ──────────────────────────────────────────────────

async function seedIPR(users) {
    if (!users.length) {
        console.log('\n⚠  No users with role "user" — nothing to seed.');
        return;
    }

    console.log("\n📝  Seeding IPR records…");

    const titles = [...SAMPLE_TITLES].sort(() => Math.random() - 0.5);
    let titleIdx = 0;

    let batch = db.batch();
    let opCount = 0;
    let totalSeed = 0;

    for (const user of users) {
        const numRecords = Math.floor(Math.random() * 3) + 1;   // 1–3 per user

        for (let i = 0; i < numRecords; i++) {
            const iprId = randomUUID();
            const iprRef = db.collection("ipr").doc(iprId);
            const now = Timestamp.now();
            const createdAt = pastTs(3);

            const title = titles[titleIdx % titles.length];
            const approvalStatus = pick(APPROVAL_STATUSES);
            titleIdx++;

            const iprData = {
                id: iprId,

                // Core references
                faculty_ref: user.ref,
                created_by: user.ref,
                updated_by: user.ref,

                // IPR fields
                application_no: genAppNo(),
                title,
                inventors: [user.ref],
                applicants: [user.data.name ?? "Unknown Faculty"],
                country: pick(COUNTRIES),
                patent_type: pick(PATENT_TYPES),
                status: pick(IPR_STATUSES),

                // Optional
                published_date: Math.random() > 0.4 ? pastTs(2) : null,
                sources: [],

                // Approval workflow
                approval_status: approvalStatus,
                approval_action_by: approvalStatus !== "pending" ? user.ref : null,
                action_at: approvalStatus !== "pending" ? pastTs(1) : null,

                // Flags & timestamps
                is_active: true,
                created_at: createdAt,
                updated_at: now,
            };

            batch.set(iprRef, iprData);
            opCount++;
            totalSeed++;

            if (opCount % 500 === 0) {
                await batch.commit();
                batch = db.batch();
                console.log(`   … committed ${totalSeed} so far`);
            }
        }
    }

    if (opCount % 500 !== 0) await batch.commit();

    console.log(`\n✅  Seeded ${totalSeed} IPR record(s) across ${users.length} user(s).`);
    console.log("\n   Summary:");
    for (const u of users) {
        console.log(`   • ${u.data.name ?? u.id} (${u.data.faculty ?? "—"})`);
    }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
    console.log("🔥  Firebase IPR Populate Script  (Admin SDK)");
    console.log("=============================================");

    await clearCollection("ipr");
    const users = await getFacultyUsers();
    await seedIPR(users);

    console.log("\n🎉  Done! Check your Firestore console.\n");
    process.exit(0);
}

main().catch((err) => {
    console.error("\n❌  Script failed:", err.message ?? err);
    process.exit(1);
});
