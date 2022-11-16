import { Mkcert } from "./mkcert/mkcert.js";
import { getDefaultHosts } from "./utils.js";

/**
 * @param {string[]=} hosts
 * @param {{force?: boolean, autoUpgrade?: boolean, keyFilePath: string, certFilePath: string }} mkcertOptions
 * @returns
 */
export const createCertificate = async (mkcertOptions, hosts = []) => {
  const mkcert = new Mkcert({
    ...mkcertOptions,
  });

  await mkcert.init();

  const uniqueHosts = Array.from(new Set([...getDefaultHosts(), ...hosts])).filter((item) => !!item);

  const { key, cert } = await mkcert.install(uniqueHosts);

  return { hosts: uniqueHosts, key, cert };
};
