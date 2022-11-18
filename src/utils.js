import { homedir, networkInterfaces } from 'os';

import { exec as cp_exec } from 'child_process';
import { promisify } from 'util';
import { dirname, join, resolve } from 'path';
import { existsSync, readFileSync } from 'fs';
import { chmod, mkdir, writeFile as fsWriteFile } from 'fs/promises';

export { existsSync } from 'fs';
export { readFile } from 'fs/promises';

import semver from 'semver-compare';

const getLocalV4Ips = () => {
  const interfaceDict = networkInterfaces();
  const addresses = [];
  for (const key in interfaceDict) {
    const interfaces = interfaceDict[key];
    if (interfaces) {
      for (const item of interfaces) {
        /** @type {*} */
        const family = item.family;
        if (family === 'IPv4' || family === 4) {
          addresses.push(item.address);
        }
      }
    }
  }

  return addresses;
};

export const getDefaultHosts = () => {
  return ['localhost', ...getLocalV4Ips()];
};

/**
 * @param {string} cmd
 * @param {import("child_process").ExecOptions} options
 * @returns
 */
export const exec = async (cmd, options) => {
  return await promisify(cp_exec)(cmd, options);
};

export const DATA_DIR = join(homedir(), '.mkcert-cli');
/**
 * @param {string} path
 * @param {string=} baseDir
 * @returns {string}
 */
export const resolvePath = (path, baseDir = DATA_DIR) => {
  return resolve(baseDir, path);
};

/**
 * @param {string=} path
 * @returns {`"${string}"`}
 */
export const wrapInQuotes = (path) => {
  return `"${path}"`;
};

/**
 * @param {string} filePath
 * @param {string | Uint8Array} data
 */
export const writeFile = async (filePath, data) => {
  if (!existsSync(filePath)) {
    await mkdir(dirname(filePath), { recursive: true });
    console.log('Created directory: ', dirname(filePath));
  }
  await fsWriteFile(filePath, data);
  await chmod(filePath, 0o777);
};

/**
 * @param {string} newest
 * @param {string} current
 */
export const semverGreaterThan = (newest, current) =>
  semver(newest.replace(/^v\.?/, ''), current.replace(/^v\.?/, '')) > 0;

/**
 * @param {string} filePath
 */
export const ensureDirExist = async (filePath) => {
  if (!existsSync(dirname(filePath))) {
    await mkdir(dirname(filePath));
  }
};

/**
 * Get absolute path from import.meta.url and relative descriptor
 * @param {string} relative
 * @param {string} filePath
 * @returns {string}
 */
export const getAbsolutePath = (relative, filePath) => {
  return new URL(relative, filePath).pathname;
};

export const pkgVersion = (() => {
  const fileUrl = getAbsolutePath('../package.json', import.meta.url);
  try {
    const pkgJson = readFileSync(fileUrl).toString();
    const { version } = JSON.parse(pkgJson || '');
    return `v${version}`;
  } catch {
    /* om nom nom */
  }
})();
