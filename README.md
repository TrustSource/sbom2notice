[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/TrustSource/sbom2notice/badge)](https://scorecard.dev/viewer/?uri=github.com/TrustSource/sbom2notice) ![License](https://img.shields.io/badge/License-AGPL%203.0-green)

# sbom2notice

Local-first tool for developers and compliance managers to **convert SBOMs (SPDX / CycloneDX)** into structured `NOTICE` files.

- Runs entirely **in your browser** — no uploads, no servers.
- **GDPR-friendly by design** (suitable for EU/DE companies).
- Drag & drop your SBOM JSON, validate it, and generate a NOTICE skeleton.
- Edit gaps via a built-in **Form Builder** with progress tracking.
- Save drafts locally, reopen anytime, download final NOTICE.

## 🚀 Live Demo

**GitHub Pages:** https://trustsource.github.io/sbom2notice/

## Tech Stack
- [Next.js 15 (App Router)](https://nextjs.org/)
- [React 19](https://react.dev/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [shadcn/ui 4](https://ui.shadcn.com/)
- [i18next](https://www.i18next.com/)
- Local-first persistence (`localStorage`)
- [Vitest](https://vitest.dev/) + [Playwright](https://playwright.dev/) for testing

## Getting Started

Clone the repo and install dependencies:
```bash
git clone https://github.com/TrustSource/sbom2notice.git
cd sbom2notice
pnpm install
```

Run in development mode:
```bash
pnpm dev
```

Build for production:
```bash
pnpm build && pnpm start
```

The app will be available at http://localhost:3000

## Usage

- Open the app in your browser.
- Upload or drag & drop an SBOM file (.json).
- The app validates the file and converts it into a NOTICE skeleton.
- Navigate to /notice to view all saved files.
- Open any NOTICE to:
  - Review or edit fields.
  - Track completion.
  - Export the final NOTICE as **JSON, CSV, or Markdown**.

## Testing

The project ships with two test suites, both grouped under `tests/`:

```
tests/
├── unit/   # Vitest — pure logic (validators, conversion, progress, storage)
└── e2e/    # Playwright — full browser flows (upload, edit, export, navigation)
```

Run them with:

```bash
pnpm test            # unit tests (Vitest)
pnpm test:watch      # unit tests in watch mode
pnpm test:coverage   # unit tests with v8 coverage report

pnpm e2e             # end-to-end tests (Playwright, headless Chromium)
pnpm e2e:ui          # Playwright UI mode for interactive debugging
pnpm e2e:report      # open the last HTML report
```

The Playwright config auto-starts `pnpm dev` on port 3100; no manual server needed.

## Contributing

Contributions, issues, and feature requests are welcome!
Open an issue or submit a pull request.
