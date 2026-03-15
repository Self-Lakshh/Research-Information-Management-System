/**
 * populate-phd-students.mjs
 * Usage: node scripts/populate-phd-students.mjs
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
        if (!existsSync(p)) continue;
        for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
            const t = line.trim();
            if (!t || t.startsWith("#")) continue;
            const eq = t.indexOf("=");
            if (eq === -1) continue;
            const key = t.slice(0, eq).trim();
            const val = t.slice(eq + 1).trim().replace(/^["']|["']$/g, "").replace(/\\n/g, "\n");
            if (!(key in process.env)) process.env[key] = val;
        }
        return;
    }
}
loadEnv();

const req = ["FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"];
const miss = req.filter(k => !process.env[k]);
if (miss.length) { console.error("❌  Missing env vars:", miss.join(", ")); process.exit(1); }

import admin from "firebase-admin";
admin.initializeApp({ credential: admin.credential.cert({ projectId: process.env.FIREBASE_PROJECT_ID, clientEmail: process.env.FIREBASE_CLIENT_EMAIL, privateKey: process.env.FIREBASE_PRIVATE_KEY }) });
const db = admin.firestore();
const { Timestamp } = admin.firestore;
console.log(`\n🔌  Connected: ${process.env.FIREBASE_PROJECT_ID}`);

const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const pastTs = (y = 3) => Timestamp.fromMillis(Date.now() - Math.floor(Math.random() * y * 365 * 86400000));
const STATUSES = ["pending", "approved", "rejected"];
const SUPERVISORS = ["Principal Supervisor", "Co-Supervisor", "Joint Supervisor"];
const STREAMS = ["Computer Science & Engineering", "Information Technology", "Electronics & Communication", "Data Science & AI", "Mechanical Engineering", "Applied Mathematics"];
const NAMES = ["Aarav Sharma", "Priya Nair", "Rahul Gupta", "Deepa Menon", "Arjun Patel", "Sneha Iyer", "Karan Malhotra", "Divya Krishnan", "Rohan Desai", "Ananya Reddy", "Vikram Singh", "Nisha Joshi"];
const enrollment = () => `PHD${new Date().getFullYear() - Math.floor(Math.random() * 5)}${String(Math.floor(Math.random() * 9000) + 1000)}`;

async function clearCollection(col) {
    const snap = await db.collection(col).get();
    if (snap.empty) return;
    let batch = db.batch(); let c = 0;
    for (const d of snap.docs) { batch.delete(d.ref); if (++c % 500 === 0) { await batch.commit(); batch = db.batch(); } }
    if (c % 500 !== 0) await batch.commit();
    console.log(`   ✅ Deleted ${c} docs from ${col}`);
}

async function main() {
    console.log("🔥  PhD Students Populate Script");
    await clearCollection("phd_students");
    const snap = await db.collection("users").where("user_role", "==", "user").get();
    const users = snap.docs.map(d => ({ id: d.id, ref: d.ref, data: d.data() }));
    console.log(`   Found ${users.length} user(s)`);
    if (!users.length) { console.log("⚠  No users."); process.exit(0); }

    let batch = db.batch(); let ops = 0; let total = 0;
    const names = [...NAMES].sort(() => Math.random() - 0.5);
    let ni = 0;
    for (const user of users) {
        const n = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < n; i++) {
            const id = randomUUID();
            const status = pick(STATUSES);
            const studentName = names[ni++ % names.length];
            batch.set(db.collection("phd_students").doc(id), {
                id, name: studentName, name_of_student: studentName,
                faculty_ref: user.ref, supervisor_type: pick(SUPERVISORS),
                enrollment_number: enrollment(), phd_stream: pick(STREAMS), sources: [],
                approval_status: status, approval_action_by: status !== "pending" ? user.ref : null,
                action_at: status !== "pending" ? pastTs(1) : null,
                is_active: true, created_by: user.ref, updated_by: user.ref,
                created_at: pastTs(5), updated_at: Timestamp.now(),
            });
            if (++ops % 500 === 0) { await batch.commit(); batch = db.batch(); }
            total++;
        }
    }
    if (ops % 500 !== 0) await batch.commit();
    console.log(`\n✅  Seeded ${total} PhD Student records.\n🎉  Done!\n`);
    process.exit(0);
}
main().catch(err => { console.error("❌  Script failed:", err.message); process.exit(1); });
