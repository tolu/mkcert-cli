#!/usr/bin/env node
//@ts-check
import { homedir } from "os";
import { join } from "path";
import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import minimist from "minimist";
import pc from "picocolors";
import mkcert from "vite-plugin-mkcert";

/**
 * Init, read variables and create folders
 */
const defaultOutDir = join(homedir(), ".mkcert-cli", "certs");
const argv = minimist(process.argv.slice(2));
const cwd = process.cwd();

const outDir = argv.outDir ? join(cwd, argv.outDir) : defaultOutDir;
const hosts = argv.host
	? Array.isArray(argv.host)
		? argv.host
		: [argv.host]
	: [];
const certFilePath = join(outDir, argv.cert ?? "dev.cert");
const keyFilePath = join(outDir, argv.key ?? "dev.key");

console.log(`
Running ${pc.green(`${pc.bold("mkcert-cli")}`)}
  in ${pc.yellow(cwd)}
`);

console.log(`${pc.bold("With options:")}
  - ${pc.blue("outDir")}: ${pc.yellow(outDir)}
  - ${pc.blue("host")}: ${JSON.stringify(hosts)}
`);

if (!existsSync(outDir)) {
	await mkdir(outDir, { recursive: true });
}

/**
 * Create certificates
 */
if (existsSync(certFilePath) && existsSync(keyFilePath)) {
  console.log(`🎉 Files "${pc.magenta("dev.cert")}" and "${pc.magenta(
		"dev.key",
	)}" already exist
  in ${pc.yellow(outDir)}`);
}
else {
	try {
		/** @type { any } */
		const { config: installMkCert } = mkcert();
		const {
			server: { https: { key, cert } },
		} = await installMkCert({});
		console.log("Writing cert files...");
		await writeFile(keyFilePath, key, { encoding: "utf-8" });
		await writeFile(certFilePath, cert, { encoding: "utf-8" });
	} catch (writeErr) {
		console.error(writeErr.toString());
		process.exit(1);
	}

	console.log(`🎉 Created "${pc.magenta("dev.cert")}" and "${pc.magenta(
		"dev.key",
	)}"
  in ${pc.yellow(outDir)}`);
}
