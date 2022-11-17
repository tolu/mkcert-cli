import https from "https";

/**
 * @param {string} url
 * @param {Record<string, string>} headers
 * @param {'json' | 'arrayBuffer'} responseType
 * @returns {Promise<any>}
 */
export const request = async (url, headers = {}, responseType = "json") => {
  return new Promise((resolve) => {
    /** @type {Uint8Array[]} */
    const data = [];
    https.get(url, { headers }, (res) => {
      res.on("data", (chunk) => {
        data.push(chunk);
      });
      res.on("end", () => {
        switch (responseType) {
          case "json": {
            resolve(JSON.parse(Buffer.concat(data).toString()));
            return;
          }
          case "arrayBuffer": {
            resolve(Buffer.concat(data));
            return;
          }
        }
      });
    });
  });
};
