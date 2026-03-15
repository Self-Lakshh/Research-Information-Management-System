/**
 * populate-all.mjs
 *
 * Runs all per-domain seed scripts in sequence.
 * Uses the Firebase ADMIN SDK.
 *
 * Usage:
 *   node scripts/populate-all.mjs
 *
 * To seed only specific domains, run the individual scripts:
 *   node scripts/populate-ipr.mjs
 *   node scripts/populate-journals.mjs
 *   node scripts/populate-conferences.mjs
 *   node scripts/populate-books.mjs
 *   node scripts/populate-awards.mjs
 *   node scripts/populate-consultancy.mjs
 *   node scripts/populate-phd-students.mjs
 *   node scripts/populate-others.mjs
 */

import { execSync } from "child_process";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));

const SCRIPTS = [
    "populate-ipr.mjs",
    "populate-journals.mjs",
    "populate-conferences.mjs",
    "populate-books.mjs",
    "populate-awards.mjs",
    "populate-consultancy.mjs",
    "populate-phd-students.mjs",
    "populate-others.mjs",
];

console.log("🚀  populate-all.mjs — Seeding ALL domains\n");
console.log("===========================================\n");

let success = 0;
let failed = 0;

for (const script of SCRIPTS) {
    const scriptPath = resolve(__dir, script);
    console.log(`\n▶  Running: ${script}`);
    console.log("─".repeat(60));
    try {
        execSync(`node "${scriptPath}"`, { stdio: "inherit" });
        success++;
    } catch (err) {
        console.error(`\n❌  ${script} failed with exit code ${err.status}`);
        failed++;
    }
}

console.log("\n===========================================");
console.log(`\n✅  Completed: ${success}/${SCRIPTS.length} scripts succeeded`);
if (failed > 0) {
    console.log(`❌  Failed:    ${failed}/${SCRIPTS.length} scripts failed`);
}
console.log("\n🎉  All done! Check your Firestore console.\n");
process.exit(failed > 0 ? 1 : 0);
