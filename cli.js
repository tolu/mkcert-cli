#!/usr/bin/env node

import { existsSync } from 'fs';

import { mkdir, writeFile } from 'fs/promises';
import minimist from 'minimist';
import pc from 'picocolors';

import { createCertificate } from './src/index.js';
import { DATA_DIR, pkgVersion, resolvePath } from './src/utils.js';

/**
 * Init, read variables and create folders
 */
const defaults = {
  dir: resolvePath('certs', DATA_DIR),
  key: 'dev.key',
  cert: 'dev.cert',
};

const argv = minimist(process.argv.slice(2));
const cwd = process.cwd();

// Print version and exit
if (argv.version) {
  console.log(pkgVersion);
  process.exit();
}

// Display help and exit
if (argv.h || argv.help) {
  console.log(`
  ${pc.bold('Usage')}
    $ npx mkcert-cli <options>

  ${pc.bold('Options')}
    ${pc.blue('--outDir, -o')}    Certificates output dir, defaults to ${pc.bold(defaults.dir)}
    ${pc.blue('--host')}          Add custom host, defaults to ${pc.bold('[localhost, ...IPv4]')}
    ${pc.blue('--keyFile, -k')}   Name of key file, defaults to "${pc.bold(defaults.key)}"
    ${pc.blue('--certFile, -c')}  Name of cert file, defaults to "${pc.bold(defaults.cert)}"
    ${pc.blue('--force, -f')}     Force recreate certificates
    ${pc.blue('--upgrade, -u')}   Upgrade mkcert binary if new version is available
    ${pc.blue('--dryRun, -d')}    Print all parameters without doing anything

  ${pc.bold('Examples')}
    $ npx mkcert-cli --host my-domain.local --host my-other-domain.local --outDir . 
    $ npx mkcert-cli -c myCert.pem -k myKey.key
    $ npx mkcert-cli -fu -o .

  `);
  process.exit();
}

const verbose = argv.v ?? false;

const host = argv.host;
const force = (argv.force || argv.f) ?? false;
const autoUpgrade = (argv.upgrade || argv.u) ?? false;
const outDir = argv.outDir || argv.o ? resolvePath(argv.outDir || argv.o, cwd) : defaults.dir;
const hosts = host ? (Array.isArray(host) ? host : [host]) : [];
const certFile = (argv.c || argv.cert) ?? defaults.cert;
const keyFile = (argv.k || argv.key) ?? defaults.key;
const certFilePath = resolvePath(certFile, outDir);
const keyFilePath = resolvePath(keyFile, outDir);
const dryRun = (argv.d || argv.dryRun) ?? false;

console.log(`\nRunning ${pc.green(`${pc.bold('mkcert-cli')}`)} (${pkgVersion})\n`);

(dryRun || verbose) &&
  console.log(`${pc.bold('With options:')}
  - ${pc.blue('cwd')}: ${pc.yellow(cwd)}
  - ${pc.blue('outDir')}: ${pc.yellow(outDir)}
  - ${pc.blue('hosts')}: ${JSON.stringify(hosts)}
  - ${pc.blue('cert')}: ${certFile}
  - ${pc.blue('key')}: ${keyFile}
  - ${pc.blue('force')}: ${force}
  - ${pc.blue('autoUpgrade')}: ${autoUpgrade}
`);
if (dryRun) {
  process.exit();
}

if (!existsSync(outDir)) {
  await mkdir(outDir, { recursive: true });
}

/**
 * Create certificates
 */
const filesExist = existsSync(certFilePath) && existsSync(keyFilePath);
const writeFiles = force || !filesExist;
if (!writeFiles) {
  console.log(`🎉 Files "${pc.magenta(certFile)}" and "${pc.magenta(keyFile)}" already exist
    in ${pc.yellow(outDir)}`);
  process.exit(0);
}

try {
  const { cert, key } = await createCertificate(
    {
      force,
      autoUpgrade,
      keyFilePath,
      certFilePath,
    },
    hosts
  );
  await writeFile(keyFilePath, key, { encoding: 'utf-8' });
  await writeFile(certFilePath, cert, { encoding: 'utf-8' });
} catch (/** @type {any}*/ writeErr) {
  console.error(writeErr.toString());
  process.exit(1);
}

console.log(`🎉 Created "${pc.magenta(certFile)}" and "${pc.magenta(keyFile)}"
    in ${pc.yellow(outDir)}
`);
