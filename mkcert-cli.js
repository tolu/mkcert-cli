#!/usr/bin/env node
import { join } from "path";
import { existsSync } from "fs";
import { mkdir, rmdir } from "fs/promises";
import minimist from "minimist";
import pc from "picocolors";

console.log(`
${pc.green(`Running ${pc.bold("mkcert-cli")}
  in ${pc.yellow(process.cwd())}`)}
`);
const defaultOutDir = join(process.env.HOME, ".mkcert-cli", "certs");
const argv = minimist(process.argv.slice(2));

// During dev
await rmdir(defaultOutDir);

const { outDir = defaultOutDir, host } = argv;

console.log(`${pc.bold("With options:")}
  - outDir: ${pc.green(outDir)}
  - hosts: ${pc.green(JSON.stringify(host))}
`);

if (!existsSync(outDir)) {
	await mkdir(outDir, { recursive: true });
}

console.log(`
🎉 Created "${pc.magenta("dev.cert")}" and "${pc.magenta("dev.key")}"
  in ${pc.yellow(outDir)}
`);
