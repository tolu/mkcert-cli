import { assert, describe, it, beforeEach } from 'vitest';
import { existsSync, getAbsolutePath, pkgVersion, semverGreaterThan } from '../src/utils.js';
//@ts-ignore - since only available from node 17
import pkgJson from '../package.json' assert { type: 'json' };
import { dirname, join, resolve } from 'path';
import { homedir } from 'os';
import { execa, execaNode } from 'execa';

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
    const { stdout } = await execaNode(cliPathAbs, ['--version'], { cwd: homedir(), env: { ...process.env } });
    assert.equal(pkgVersion, `${stdout}`);
  });
});

const testCertFolder = 'tstCertFolder';
const cliJSFilePath = getAbsolutePath('../cli.js', import.meta.url);
const rmTestDir = async () => await execa(`rm`, ['-rf', testCertFolder]);

describe('cli', () => {
  beforeEach(async () => {
    await rmTestDir();
  });

  it('"--outDir, -o" sets output dir', async () => {
    await execaNode(cliJSFilePath, ['-v', '--outDir', testCertFolder]);
    assert.ok(existsSync(`./${testCertFolder}/dev.key`));
    assert.ok(existsSync(`./${testCertFolder}/dev.cert`));
    await rmTestDir();
    await execaNode(cliJSFilePath, ['-v', '-o', testCertFolder]);
    assert.ok(existsSync(`./${testCertFolder}/dev.key`));
    assert.ok(existsSync(`./${testCertFolder}/dev.cert`));
  });

  it('"--host" sets custom host', async () => {
    const { stdout } = await execaNode(cliJSFilePath, ['--host', 'mkcert-online.com', '--host', 'mkcert2-online.com', '-o', testCertFolder, '-d']);
    assert.include(stdout, 'mkcert-online.com');
    assert.include(stdout, 'mkcert2-online.com');
  });
  it.todo('"--keyFile, -k" sets key filename', async () => {});
  it.todo('"--certFile, -c" sets cert filename', async () => {});
});
