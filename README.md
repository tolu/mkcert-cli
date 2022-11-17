<p align="center">

  <a aria-label="NPM version" href="https://www.npmjs.com/package/mkcert-cli">
    <img alt="" src="https://badgen.net/npm/v/mkcert-cli">
  </a>
  
  <a aria-label="Package size" href="https://bundlephobia.com/result?p=mkcert-cli">
    <img alt="" src="https://badgen.net/bundlephobia/minzip/mkcert-cli">
  </a>
  
  <a aria-label="Install size" href="https://packagephobia.com/result?p=mkcert-cli">
    <img alt="" src="https://packagephobia.com/badge?p=mkcert-cli">
  </a>
  
  <a aria-label="License" href="https://github.com/tolu/mkcert-cli/blob/main/LICENSE">
    <img alt="" src="https://badgen.net/npm/license/mkcert-cli">
  </a>
</p>

# mkcert-cli

Node cli wrapper for [`mkcert`][mkcert] based entirely on the fantastic work done in [`vite-plugin-mkcert`][vite-plugin-mkcert].

## Quick start

Create locally trusted development certificates in default folder `$HOME/.mkcert-cli/certs`

```sh
> npx -y mkcert-cli

# => Created "dev.cert" and "dev.key" in $HOME/.mkcert-cli/certs
```

## Options

### `--outDir` or `-o`

Explicitly define output directory for files

```sh

> npx -y mkcert-cli --outDir .

# => Created "dev.cert" and "dev.key" in ./

```

### `--cert` / `-c` & `--key` / `-k`

Set file names, default to `dev.cert` and `dev.key`

```sh

> npx -y mkcert-cli --outDir . --cert localhost.pem --key localhost.key

# => Created "localhost.pem" and "localhost.key" in ./

```

### `--hosts`

Custom hosts, default value is `localhost` + `local ip addrs`.

To pass multiple values, just pass several named args.

```sh

> npx -y mkcert-cli --host localhost --host my-site.local

# => Created "dev.cert" and "dev.key" for ["localhost", "my-site.local"]
```

### Other flags

#### `--help` / `-h`: Display help text

```sh
npx -y mkcert-cli -h
```

#### `-f` / `--force`: Force

Force regenerate certificate files

```sh
npx -y mkcert-cli -f
```

#### `-u` / `--upgrade`: Auto upgrade mkcert bin 

Install latest version of mkcert that's available before generating certificates.

```sh
npx -y mkcert-cli -u
```

## Thanks

- [vite-plugin-mkcert][vite-plugin-mkcert]
- [mkcert][mkcert]


[vite-plugin-mkcert]:https://github.com/liuweiGL/vite-plugin-mkcert
[mkcert]:https://github.com/FiloSottile/mkcert
