import https from 'https';
import { pkgVersion } from './utils.js';

const defaultHeaders = {
  Accept: 'application/json, text/plain, */*',
  ['User-Agent']: `mkcert-cli/${pkgVersion}`,
};
const MAX_REDIRECTS = 4;

// https://github.com/axios/axios/blob/main/lib/adapters/http.js#L335
/**
 * @param {string} url
 * @param {Record<string, string>} customHeaders
 * @param {'json' | 'arrayBuffer'} responseType
 * @returns {Promise<any>}
 */
export const request = async (url, customHeaders = {}, responseType = 'json', _redirect = 0) => {
  const headers = { ...defaultHeaders, ...customHeaders };
  return new Promise((resolve) => {
    /** @type {Uint8Array[]} */
    const responseBuffer = [];
    https.get(url, { headers }, async (res) => {
      const { headers: resHeaders, statusCode, statusMessage } = res;

      // Handle redirects (very naively)
      if (statusCode && resHeaders.location && 300 <= statusCode && statusCode <= 399) {
        if (_redirect > MAX_REDIRECTS) {
          throw new Error(`Too many redirects (${MAX_REDIRECTS}). Final url: ${url}`);
        }
        const response = await request(resHeaders.location, customHeaders, responseType, _redirect++);
        resolve(response);
      }

      res.on('data', (chunk) => {
        responseBuffer.push(chunk);
        if (url.includes('/download/')) {
          console.log('on(data): ', chunk);
        }
      });
      res.on('end', () => {
        const arrayBuffer = Buffer.concat(responseBuffer);
        switch (responseType) {
          case 'json': {
            return resolve(JSON.parse(arrayBuffer.toString()));
          }
          case 'arrayBuffer': {
            return resolve(arrayBuffer);
          }
        }
      });
    });
  });
};
