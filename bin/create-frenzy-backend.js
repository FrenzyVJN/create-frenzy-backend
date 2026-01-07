#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const projectName = process.argv[2];

if (!projectName) {
    console.error("❌ Please provide a project name");
    process.exit(1);
}

const target = path.join(process.cwd(), projectName);
fs.cpSync(
    new URL("../template", import.meta.url),
    target,
    { recursive: true }
);

console.log("📦 Installing dependencies...");
execSync("npm install", { cwd: target, stdio: "inherit" });

console.log(`
✅ Frenzy Backend ready!

Next steps:
  cd ${projectName}
  cp .env.example .env
  npm run dev
`);
