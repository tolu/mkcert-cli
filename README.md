# mkcert-cli

Simple CLI wrapper for [`vite-plugin-mkcert`](https://github.com/liuweiGL/vite-plugin-mkcert) to use outside of a `vite` context.

## Quick start

Create locally trusted development certificates in default folder `$HOME/.mkcert-cli/certs`

```sh
> npx -y mkcert-cli

# => Created "dev.cert" and "dev.key" in $HOME/.mkcert-cli/certs
```

## Options

### `--outDir`

Explicitly define output directory for files

```sh

> npx -y mkcert-cli --outDir .

# => Created "dev.cert" and "dev.key" in ./

```

### `--cert` & `--key`

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

## Thanks

- [vite-plugin-mkcert](https://github.com/liuweiGL/vite-plugin-mkcert)
- [mkcert](https://github.com/FiloSottile/mkcert)
