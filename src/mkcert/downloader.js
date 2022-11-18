import { writeFile } from '../utils.js';
import { request } from '../request.js';

export class Downloader {
  constructor() {}

  /**
   * @param {string} downloadUrl
   * @param {string} savedPath
   */
  async download(downloadUrl, savedPath) {
    console.log('Downloading the mkcert executable from %s', downloadUrl);

    const data = await request(downloadUrl, {}, 'arrayBuffer');

    await writeFile(savedPath, data);

    console.log('The mkcert has been saved to %s', savedPath);
  }
}
