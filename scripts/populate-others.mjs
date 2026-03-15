/**
 * populate-others.mjs
 * Usage: node scripts/populate-others.mjs
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
const randomDateStr = (y = 3) => { const d = new Date(Date.now() - Math.floor(Math.random() * y * 365 * 86400000)); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; };

const STATUSES = ["pending", "approved", "rejected"];
const EVENT_TYPES = ["FDP", "Seminar", "Workshop", "Keynote Speaker"];
const ROLES = ["Organizer", "Speaker", "Coordinator", "Participant", "Resource Person", "Chairperson"];
const TOPICS = [
    "Advances in Machine Learning & Deep Learning",
    "Cloud Computing and DevOps Practices",
    "Cybersecurity in the Age of AI",
    "Data Science for Business Intelligence",
    "IoT and Embedded Systems Design",
    "Research Methodology and Technical Writing",
    "Natural Language Processing Applications",
    "Blockchain Technology and Applications",
    "Quantum Computing: Foundations and Future",
    "Green Computing and Sustainable Technologies",
    "Computer Vision and Image Processing",
    "High-Performance Computing Architectures",
];
const ORGS = ["IIT Bombay", "NIT Trichy", "IEEE India", "NASSCOM", "AICTE", "DST-India", "VIT Vellore", "BITS Pilani", "Anna University", "Savitribai Phule Pune University"];

async function clearCollection(col) {
    const snap = await db.collection(col).get();
    if (snap.empty) return;
    let batch = db.batch(); let c = 0;
    for (const d of snap.docs) { batch.delete(d.ref); if (++c % 500 === 0) { await batch.commit(); batch = db.batch(); } }
    if (c % 500 !== 0) await batch.commit();
    console.log(`   ✅ Deleted ${c} docs from ${col}`);
}

async function main() {
    console.log("🔥  Other Events Populate Script");
    await clearCollection("other_events");
    const snap = await db.collection("users").where("user_role", "==", "user").get();
    const users = snap.docs.map(d => ({ id: d.id, ref: d.ref, data: d.data() }));
    console.log(`   Found ${users.length} user(s)`);
    if (!users.length) { console.log("⚠  No users."); process.exit(0); }

    let batch = db.batch(); let ops = 0; let total = 0;
    const topics = [...TOPICS].sort(() => Math.random() - 0.5);
    let ti = 0;
    for (const user of users) {
        const n = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < n; i++) {
            const id = randomUUID();
            const status = pick(STATUSES);
            batch.set(db.collection("other_events").doc(id), {
                id, type: pick(EVENT_TYPES), topic_title: topics[ti++ % topics.length],
                organization: pick(ORGS), date: randomDateStr(3),
                role: pick(ROLES), involved_faculty_refs: [user.ref], sources: [],
                approval_status: status, approval_action_by: status !== "pending" ? user.ref : null,
                action_at: status !== "pending" ? pastTs(1) : null,
                is_active: true, created_by: user.ref, updated_by: user.ref,
                created_at: pastTs(4), updated_at: Timestamp.now(),
            });
            if (++ops % 500 === 0) { await batch.commit(); batch = db.batch(); }
            total++;
        }
    }
    if (ops % 500 !== 0) await batch.commit();
    console.log(`\n✅  Seeded ${total} Other Event records.\n🎉  Done!\n`);
    process.exit(0);
}
main().catch(err => { console.error("❌  Script failed:", err.message); process.exit(1); });
