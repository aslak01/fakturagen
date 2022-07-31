# Invoice generator

This invoice generator uses PDF-Lib to generate PDF invoices.

Currently in Norwegian and adapted to a specific client's invoice format, but rewritten to be easily adapted to other languages and invoice formats.

### Backend

For now, private info resides in .env, dummy info presented by default if .env info not present.

An Sqlite backend managed by Prisma and trpc and administrated with a Svelte Kit app are currently WIP.

### Installation:

```bash
Git clone

cd clone

pnpm i

pnpm run dev

localhost:5173
```

(npm or yarn should also work fine)

### Setting up the DB

```bash
npx prisma generate
npx prisma db push
```

If all went well, this should allow you to mess around with the non-PDF parts of the app.
