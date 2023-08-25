# Module Federation Sandbox

## Prefixed approach

Relevant folders are:

```text
host-next    : uses remote1, remote3
remote1-next : uses remote2 + expose stuff
remote2-next : uses remote2 + expose stuff
remote3-next : expose stuff
```

Relevant files:

```text
remote2-next/tailwind-prefixer-loader.js
remote*-next/remoteEntry/*
*/next.config.js
```

## Init

```bash
# from repo root issue:
cd host-next && pnpm i && cd ../remote1-next && pnpm i && cd ../remote2-next && pnpm i && cd ../remote3-next && pnpm i && cd ..
```

## Production

```bash
# We need 4 terminals for this or other clever solution
# We start from repo root for each:

# step 1: start build + start remote2-next + wait for ready started server
cd remote2-next
pnpm build && pnpm start

# step 2: start build + start remote1-next + wait for ready started server
cd remote1-next
pnpm build && pnpm start

# step 3: start build + start remote3-next + wait for ready started server
cd remote3-next
pnpm build && pnpm start

# step 4: start build + start host-next
cd host-next
pnpm build && pnpm start

# step 5: open http://localhost:3000 in your browser of choice
```

## Development

```bash
# We need 4 terminals for this or other clever solution
# We start from repo root for each:

# step 1: start build + start remote2-next
cd remote2-next
pnpm dev

# step 2: start build + start remote1-next
cd remote1-next
pnpm dev

# step 3: start build + start remote3-next
cd remote3-next
pnpm dev

# step 4: start build + start host-next
cd host-next
pnpm dev

# step 5: open http://localhost:3000 in your browser of choice and ignore/close the hydration error for now ;)
```
