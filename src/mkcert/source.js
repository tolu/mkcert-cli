import { Octokit } from "@octokit/rest";

const getPlatformIdentifier = () => {
  switch (process.platform) {
    case "win32":
      return "windows-amd64.exe";
    case "linux":
      return process.arch === "arm64" ? "linux-arm64" : process.arch === "arm" ? "linux-arm" : "linux-amd64";
    case "darwin":
      return "darwin-amd64";
    default:
      throw new Error("Unsupported platform");
  }
};

/**
 * Download mkcert from github.com
 */
export class GithubSource {
  async getSourceInfo() {
    const octokit = new Octokit();
    const { data } = await octokit.repos.getLatestRelease({
      owner: "FiloSottile",
      repo: "mkcert",
    });
    const platformIdentifier = getPlatformIdentifier();

    /** @type {string | undefined} */
    const version = data.tag_name;
    /** @type {string | undefined} */
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
