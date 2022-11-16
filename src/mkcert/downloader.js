import axios from "axios";
import { writeFile } from "../utils.js";

const request = axios.create();

export class Downloader {
  constructor() {}

  /**
   * @param {string} downloadUrl
   * @param {string} savedPath
   */
  async download(downloadUrl, savedPath) {
    console.log("Downloading the mkcert executable from %s", downloadUrl);

    const { data } = await request.get(downloadUrl, { responseType: "arraybuffer" });
    await writeFile(savedPath, data);

    console.log("The mkcert has been saved to %s", savedPath);
  }
}
