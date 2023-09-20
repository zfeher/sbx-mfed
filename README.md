# Module Federation Sandbox

## Prefixed approach

Relevant folders are:

```text
host-next    : uses remote1, remote3
remote1      : uses remote2 + expose stuff
remote2      : expose stuff
remote3      : uses remote2 + expose stuff
```

Relevant files:

```text
remote2/tailwind-prefixer-loader.js
remote*/remoteEntry/*
remote*/config/**
host-next/next.config.js
```

## Init

```bash
# from repo root issue:
cd host-next && pnpm i && cd ../remote1 && pnpm i && cd ../remote2-next && pnpm i && cd ../remote2 && pnpm i && cd ../remote3 && pnpm i && cd ..
```

## Production

```bash
# We need 4 terminals for this or other clever solution
# We start from repo root for each:

# step 1: start build + start remote2 + wait for ready started server
cd remote2
pnpm build && pnpm start

# step 2: start build + start remote1 + wait for ready started server
cd remote1
pnpm build && pnpm start

# step 3: start build + start remote3 + wait for ready started server
cd remote3
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

# step 1: start build + start remote2
cd remote2
pnpm dev

# step 2: start build + start remote1
cd remote1
pnpm dev

# step 3: start build + start remote3
cd remote3
pnpm dev

# step 4: start build + start host-next
cd host-next
pnpm dev

# step 5: open http://localhost:3000 in your browser of choice and ignore/close the hydration error for now ;)
```
