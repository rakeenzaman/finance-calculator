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
npm run build:pages
```

For a root-domain/static host deploy (no repo subpath), use:

```bash
npm run build:custom-domain
```

For publishing to `gh-pages` with a custom domain, use:

```bash
npm run deploy:custom-domain
```

If you move to a custom domain in the future:

- Keep `NEXT_PUBLIC_SITE_URL` as your final domain (for example, `https://calc.yourdomain.com`).
- Set `NEXT_PUBLIC_BASE_PATH` to empty (root deploy).
- Add/update `public/CNAME` with your custom domain when using GitHub Pages.

## Deploy to GitHub Pages (Without Actions)

1. Build using the GitHub Pages command above.
2. Upload the contents of `out/` to your Pages publishing branch/source.
3. In GitHub repo settings, set Pages to serve that published static content.

Or use one command to publish to a `gh-pages` branch:

```bash
npm run deploy:pages
```

This command includes dotfiles and explicitly disables Jekyll so `_next` assets/CSS are served correctly on GitHub Pages.
Open the deployed site at `https://rakeenzaman.github.io/finance-calculator/`.

`public/.nojekyll` is included so `_next/` assets are served correctly.
