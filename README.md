# Finance Calculator

Static Next.js finance calculator suite (Roth IRA, Traditional IRA, HYSA, 401(k), mortgage, auto loan).

## Local Development

```bash
npm install
npm run dev
```

## Manual Static Build

This project uses Next.js static export (`output: "export"`) and generates deployable files in `out/`.

For GitHub Pages project URLs like `https://rakeenzaman.github.io/finance-calculator/`, build with:

```bash
NEXT_PUBLIC_SITE_URL="https://rakeenzaman.github.io/finance-calculator" NEXT_PUBLIC_BASE_PATH="/finance-calculator" npm run build
```

For a root-domain/static host deploy (no repo subpath), use:

```bash
NEXT_PUBLIC_SITE_URL="https://your-domain.com" npm run build
```

## Deploy to GitHub Pages (Without Actions)

1. Build using the GitHub Pages command above.
2. Upload the contents of `out/` to your Pages publishing branch/source.
3. In GitHub repo settings, set Pages to serve that published static content.

`public/.nojekyll` is included so `_next/` assets are served correctly.
