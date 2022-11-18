import { assert, describe, it, beforeEach } from 'vitest';
import { exec, existsSync, getAbsolutePath, pkgVersion, semverGreaterThan } from '../src/utils.js';
//@ts-ignore - since only available from node 17
import pkgJson from '../package.json' assert { type: 'json' };
import { dirname, join, resolve } from 'path';
import { homedir } from 'os';

describe('semverGreaterThan', () => {
  it('returns expected bool', () => {
    assert.ok(semverGreaterThan('v1.4.4', 'v.1.4.3'));
    assert.notOk(semverGreaterThan('v1.4.3', 'v.1.4.4'));
    assert.notOk(semverGreaterThan('v1.4.4', 'v1.4.4'));
  });
});

describe('pkgJson', () => {
  it('matches asserted import value', () => {
    assert.equal(pkgVersion, `v${pkgJson.version}`);
  });

  it('cli.js --version, also works from random directory', async () => {
    const cliPathAbs = getAbsolutePath('../cli.js', import.meta.url);
    const cmd = `node ${cliPathAbs} --version`;
    const { stdout } = await exec(cmd, { cwd: homedir(), env: { ...process.env } });
    assert.equal(pkgVersion, `${stdout.trim()}`);
  });
});

const testCertFolder = 'tstCertFolder';
const cmd = `node ${join(dirname(import.meta.url), '../cli.js').replace(/^file:/, '')}`;
const rmTestDir = async () => await exec(`rm -rf ${testCertFolder}`, {});

describe('cli', () => {
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
