import { request } from '../request.js';

const getPlatformIdentifier = () => {
  switch (process.platform) {
    case 'win32':
      return 'windows-amd64.exe';
    case 'linux':
      return process.arch === 'arm64' ? 'linux-arm64' : process.arch === 'arm' ? 'linux-arm' : 'linux-amd64';
    case 'darwin':
      return 'darwin-amd64';
    default:
      throw new Error('Unsupported platform');
  }
};

const owner = 'FiloSottile';
const repo = 'mkcert';
const fetchLatestRelease = async () => {
  // -H "Authorization: Bearer <YOUR-TOKEN>" \
  /** @type {Promise<{ assets: Array<{name: string, browser_download_url: string}>, tag_name?: string }>} */
  const res = await request(
    `https://api.github.com/repos/${owner}/${repo}/releases/latest`,
    { Accept: 'application/vnd.github+json' },
    'json',
  );
  return res;
};

/**
 * Download mkcert from github.com
 */
export class GithubSource {
  async getSourceInfo() {
    const data = await fetchLatestRelease();
    const platformIdentifier = getPlatformIdentifier();

    const version = data.tag_name;
    const downloadUrl = data.assets.find((item) => item.name.includes(platformIdentifier))?.browser_download_url;

    if (!(version && downloadUrl)) {
      return undefined;
    }

    return {
      downloadUrl,
      version,
    };
  }
}
