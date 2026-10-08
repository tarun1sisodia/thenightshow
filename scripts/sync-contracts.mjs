#!/usr/bin/env node
/**
 * Contract sync process (Architecture.md §6.1).
 *
 * Copies canonical contract sources from `contracts/` into each consuming
 * application. Generated/mirrored copies must be produced by this script,
 * never hand-edited independently.
 *
 * Sync map (extend here when a new canonical source is added):
 *   contracts/enums/vehicle-tiers.ts
 *     -> backend/src/contracts/vehicle-tiers.ts
 *     -> admin/src/contracts/vehicle-tiers.ts
 *     -> react/src/contracts/vehicle-tiers.ts
 */
import { mkdirSync, copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const SYNC_SOURCES = ["enums/vehicle-tiers.ts"];
const CONSUMERS = [
  join("backend", "src", "contracts"),
  join("admin", "src", "contracts"),
  join("react", "src", "contracts"),
];

const HEADER = `// ------------------------------------------------------------------
// GENERATED FILE — DO NOT EDIT.
// Produced by the contract sync process (npm run contracts:sync).
// Canonical source: contracts/${"{source}"}
// ------------------------------------------------------------------
`;

let failures = 0;

for (const source of SYNC_SOURCES) {
  const sourcePath = join(root, "contracts", source);
  let content;
  try {
    content = readFileSync(sourcePath, "utf8");
  } catch (error) {
    console.error(`sync-contracts: missing canonical source ${source}: ${error.message}`);
    failures += 1;
    continue;
  }

  const banner = HEADER.replace("{source}", source);
  const targetFileName = source.split("/").pop();

  for (const consumerDir of CONSUMERS) {
    const targetDir = join(root, consumerDir);
    const targetPath = join(targetDir, targetFileName);
    try {
      mkdirSync(targetDir, { recursive: true });
      writeFileSync(targetPath, banner + content);
      console.log(`sync-contracts: ${relative(root, sourcePath)} -> ${relative(root, targetPath)}`);
    } catch (error) {
      console.error(`sync-contracts: failed to write ${targetPath}: ${error.message}`);
      failures += 1;
    }
  }
}

// Keep the sync output directories tracked even before the first sync.
for (const consumerDir of CONSUMERS) {
  mkdirSync(join(root, consumerDir), { recursive: true });
}

if (failures > 0) {
  console.error(`sync-contracts: ${failures} failure(s)`);
  process.exit(1);
}
console.log("sync-contracts: OK");
