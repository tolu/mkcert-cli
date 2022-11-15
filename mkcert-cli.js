#!/usr/bin/env node
import { join } from 'path';
import minimist from 'minimist';

console.log('Running mkcert-cli', import.meta.url);

const argv = minimist(process.argv.slice(2))
const { outDir = join(process.env.HOME, '.mkcert-cli', 'certs'), host } = argv;

console.log({
  argv,
  options: { outDir, host }
})