import { assert, describe, it, beforeEach } from 'vitest';
import { exec, existsSync, getAbsolutePath, pkgVersion, semverGreaterThan } from '../src/utils.js';
//@ts-ignore - since only available from node 17
import pkgJson from '../package.json' assert { type: 'json' };
import { dirname, join, resolve } from 'path';
import { homedir } from 'os';

const cliPath = resolve(join(dirname(new URL(import.meta.url).pathname), '../cli.js'));

describe('--dryRun', () => {
  it('more of a debug print session for CI', async () => {
    
    const cmd = `node ${cliPath} --dryRun`;
    console.log('PLEASE READ THIS', {
      cwd: process.cwd(),
      cliPath,
      importURL: import.meta.url,
      filePathURL: new URL('..cli.js', import.meta.url).toString(),
      filePathResolve: resolve('../cli.js'),
      resolveJoinDirname: resolve(join(dirname(import.meta.url), '../cli.js')),
    });
    const { stdout } = await exec(cmd, { cwd: homedir(), env: { ...process.env } });
    console.log(`
    ${stdout}
    `);
  });
});

describe.skip('semverGreaterThan', () => {
  it('returns expected bool', () => {
    assert.ok(semverGreaterThan('v1.4.4', 'v.1.4.3'));
    assert.notOk(semverGreaterThan('v1.4.3', 'v.1.4.4'));
    assert.notOk(semverGreaterThan('v1.4.4', 'v1.4.4'));
  });
});

describe.skip('pkgJson', () => {
  it('matches asserted import value', () => {
    assert.equal(pkgVersion, `v${pkgJson.version}`);
  });

  it('cli.js --version, also works from random directory', async () => {
    const cmd = `node ${cliPath} --version`;
    const { stdout } = await exec(cmd, { cwd: homedir(), env: { ...process.env } });
    assert.equal(pkgVersion, `${stdout.trim()}`);
  });
});

const testCertFolder = 'tstCertFolder';
const cmd = `node ${cliPath}`;
const rmTestDir = async () => await exec(`rm -rf ${testCertFolder}`, {});

describe.skip('cli', () => {
  beforeEach(async () => {
    await rmTestDir();
  });

  it('"--outDir, -o" sets output dir', async () => {
    await exec(`${cmd} --outDir ${testCertFolder}`, {});
    assert.ok(existsSync(`./${testCertFolder}/dev.key`));
    assert.ok(existsSync(`./${testCertFolder}/dev.cert`));
    await rmTestDir();
    await exec(`${cmd} --o ${testCertFolder}`, {});
    assert.ok(existsSync(`./${testCertFolder}/dev.key`));
    assert.ok(existsSync(`./${testCertFolder}/dev.cert`));
  });

  it('"--host" sets custom host', async () => {
    const { stdout: output1 } = await exec(
      `${cmd} --host mkcert-online.com --host mkcert2-online.com -o ${testCertFolder} -d`,
      {},
    );
    assert.ok(output1.includes('mkcert-online.com'), output1);
    assert.ok(output1.includes('mkcert2-online.com'), output1);
  });
  it.todo('"--keyFile, -k" sets key filename', async () => {});
  it.todo('"--certFile, -c" sets cert filename', async () => {});
});
