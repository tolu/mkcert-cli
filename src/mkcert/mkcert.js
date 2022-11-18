import { execa } from 'execa';
import pc from 'picocolors';
import { existsSync, readFile, resolvePath, wrapInQuotes, semverGreaterThan, ensureDirExist } from '../utils.js';

import { Downloader } from './downloader.js';
import { GithubSource } from './source.js';

export class Mkcert {
  force;
  autoUpgrade;
  mkcertSavedPath;
  source;

  KEY_FILE_PATH;
  CERT_FILE_PATH;

  /**
   *
   * @param {{ force?: boolean, autoUpgrade?: boolean, keyFilePath: string, certFilePath: string }} options
   */
  constructor(options) {
    const { force, autoUpgrade, keyFilePath, certFilePath } = options;

    // TODO: allow override
    this.KEY_FILE_PATH = keyFilePath;
    this.CERT_FILE_PATH = certFilePath;

    this.force = force ?? false;
    this.autoUpgrade = autoUpgrade ?? false;

    this.source = new GithubSource();

    this.mkcertSavedPath = resolvePath(process.platform === 'win32' ? 'mkcert.exe' : 'mkcert');
  }

  async getMkcertBinary() {
    return this.checkMkcert() ? this.mkcertSavedPath : undefined;
  }

  /**
   * Check if mkcert exists
   */
  checkMkcert() {
    return existsSync(this.mkcertSavedPath);
  }

  async getCertificate() {
    const key = await readFile(this.KEY_FILE_PATH);
    const cert = await readFile(this.CERT_FILE_PATH);

    return {
      key,
      cert,
    };
  }

  /**
   * @param {string[]} hosts
   */
  async createCertificate(hosts) {
    const names = hosts.join(' ');

    const mkcertBinary = await this.getMkcertBinary();

    if (!mkcertBinary) {
      throw new Error(`Mkcert does not exist, unable to generate certificate for ${names}`);
    }

    await ensureDirExist(this.KEY_FILE_PATH);
    await ensureDirExist(this.CERT_FILE_PATH);

    await execa(mkcertBinary, ['-install', '-key-file', this.KEY_FILE_PATH, '-cert-file', this.CERT_FILE_PATH, ...hosts], {
      env: {
        ...process.env,
        JAVA_HOME: undefined,
      },
      // TODO: enabled when --verbose
      // stdout: process.stdout,
      // stderr: process.stderr
    });
  }

  getCurrentMkcertVersion = async () => {
    const mkcertBinary = await this.getMkcertBinary();

    if (!mkcertBinary) {
      console.error('Mkcert does not exist, unable to get current version...');
      return null;
    }

    const { stdout } = await execa(mkcertBinary, ['--version'], {
      env: {
        ...process.env,
        JAVA_HOME: undefined,
      },
    });
    return stdout;
  };

  async init() {
    if (!this.checkMkcert()) {
      await this.initMkcert();
    } else if (this.autoUpgrade) {
      await this.upgradeMkcert();
    }
    console.log(`${pc.green('mkcert')}@${await this.getCurrentMkcertVersion()}\n`);
  }

  async getSourceInfo() {
    const sourceInfo = await this.source.getSourceInfo();

    if (!sourceInfo) {
      console.error('Failed to request mkcert information, please check your network');
      return undefined;
    }

    return sourceInfo;
  }
  async initMkcert() {
    const sourceInfo = await this.getSourceInfo();

    console.log('The mkcert does not exist, download it now');

    if (!sourceInfo) {
      console.error('Can not obtain download information of mkcert, init skipped');
      return;
    }

    await this.downloadMkcert(sourceInfo.downloadUrl, this.mkcertSavedPath);
  }

  async upgradeMkcert() {
    const sourceInfo = await this.getSourceInfo();

    if (!sourceInfo) {
      console.error('Can not obtain download information of mkcert, update skipped');
      return;
    }

    const current = await this.getCurrentMkcertVersion();
    const shouldUpgrade = !current || semverGreaterThan(sourceInfo.version, current);
    if (shouldUpgrade) {
      console.log(`Upgrade mkcert: ${current} => ${sourceInfo.version}\n`);
      await this.downloadMkcert(sourceInfo.downloadUrl, this.mkcertSavedPath);
    } else {
      console.log(`Already using latest:`);
    }
  }

  /**
   *
   * @param {string} sourceUrl
   * @param {string} distPath
   */
  async downloadMkcert(sourceUrl, distPath) {
    const downloader = new Downloader();
    await downloader.download(sourceUrl, distPath);
  }

  /**
   * @param {string[]} hosts
   */
  async renew(hosts) {
    if (this.force || !(existsSync(this.CERT_FILE_PATH) && existsSync(this.KEY_FILE_PATH))) {
      await this.createCertificate(hosts);
    }
  }

  /**
   * Get certificates
   *
   * @param {string[]} hosts host collection
   * @returns certificates
   */
  async install(hosts) {
    await this.renew(hosts);
    return await this.getCertificate();
  }
}
