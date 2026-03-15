/**
 * get-ipr.mjs
 * Mirrors getAllIPR() from ipr.ts using the Admin SDK.
 * Usage: node scripts/get-ipr.mjs
 */

import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// ── Load .env ────────────────────────────────────────────────────────────────
const __dir = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dir, "..");

for (const name of [".env.local", ".env"]) {
    const p = resolve(ROOT, name);
    if (existsSync(p)) {
        for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
            const t = line.trim();
            if (!t || t.startsWith("#")) continue;
            const eq = t.indexOf("=");
            if (eq === -1) continue;
            const key = t.slice(0, eq).trim();
            const val = t.slice(eq + 1).trim().replace(/^["']|["']$/g, "").replace(/\\n/g, "\n");
            if (!(key in process.env)) process.env[key] = val;
        }
        break;
    }
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

// ── getAllIPR (mirrors ipr.ts logic exactly) ──────────────────────────────────
async function getAllIPR() {
    const snap = await db.collection("ipr")
        .where("is_active", "==", true)
        .get();

    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ── Pretty-print a single IPR record ─────────────────────────────────────────
function printIPR(ipr, index) {
    const ts = (t) => t?.toDate ? t.toDate().toLocaleDateString("en-IN") : "—";
    const ref = (r) => r?.path ?? "—";

    console.log(`\n┌─ IPR #${index + 1} ${"─".repeat(60)}`);
    console.log(`│  ID             : ${ipr.id}`);
    console.log(`│  Title          : ${ipr.title}`);
    console.log(`│  Application No : ${ipr.application_no}`);
    console.log(`│  Patent Type    : ${ipr.patent_type}`);
    console.log(`│  Status         : ${ipr.status}`);
    console.log(`│  Country        : ${ipr.country}`);
    console.log(`│  Applicants     : ${(ipr.applicants ?? []).join(", ")}`);
    console.log(`│  Inventors      : ${(ipr.inventors ?? []).map(ref).join(", ")}`);
    console.log(`│  Faculty Ref    : ${ref(ipr.faculty_ref)}`);
    console.log(`│  Published Date : ${ts(ipr.published_date)}`);
    console.log(`│  Approval       : ${ipr.approval_status}`);
    console.log(`│  Is Active      : ${ipr.is_active}`);
    console.log(`│  Created At     : ${ts(ipr.created_at)}`);
    console.log(`│  Updated At     : ${ts(ipr.updated_at)}`);
    console.log(`└${"─".repeat(68)}`);
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
    console.log(`\n🔥  getAllIPR — project: ${process.env.FIREBASE_PROJECT_ID}`);
    console.log("=".repeat(70));

    const records = await getAllIPR();

    if (!records.length) {
        console.log("\n⚠  No active IPR records found in the collection.\n");
        process.exit(0);
    }

    console.log(`\n✅  Found ${records.length} active IPR record(s):`);
    records.forEach(printIPR);

    console.log(`\n📊  Total: ${records.length} record(s)\n`);
    process.exit(0);
}

main().catch((err) => {
    console.error("\n❌  Error:", err.message ?? err);
    process.exit(1);
});
