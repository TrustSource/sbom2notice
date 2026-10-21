# sbom2notice

## Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## 1.4.0 - 2026-10-20

### Changed
* require Node.js 26 (`engines`, `.nvmrc`, CI workflows, `@types/node`)
* bump `tailwindcss` and `@tailwindcss/postcss` to 4.3.3, `@playwright/test` to 1.63, `vitest` and `@vitest/coverage-v8` to 4.1.12

### Fixed
* unit tests failing on Node 25+ because Node's built-in `localStorage` shadowed happy-dom's
* `validateSbom` result now narrows by `kind`, fixing type errors in the validator tests
* `module.register()` deprecation warnings on Node 26 from Playwright and Tailwind

### Removed
* `postinstall` hook running `shadcn init -y`, which hangs `pnpm install` on an overwrite prompt with current shadcn

### Security
* resolve `pnpm audit` advisories (85 down to 1) by bumping `next` and `eslint-config-next` to 15.5.27, `handlebars` to 4.7.10, `shadcn` to 4.21.2, `ts-node-client` to 3.4.17, `eslint` to 9.39.5 and `autoprefixer` to 10.6.1
* pin patched transitive dependencies via `pnpm.overrides` (hono, @hono/node-server, @modelcontextprotocol/sdk, body-parser, proxy-addr, fast-uri, ip-address, qs, brace-expansion, @humanfs/node, browserslist, baseline-browser-mapping, sharp, source-map-js)
* restrict existing overrides to same-major `^` ranges; open-ended `>=` targets had pulled in `@babel/core` 8 and `js-yaml` 5


## 1.3.0 - 2026-07-17

### Added
* display application version in the footer

### Security
* resolve all `pnpm audit` advisories by pinning patched transitive dependencies (form-data, hono, ws, vite, ip-address, qs, brace-expansion, js-yaml, @babel/core)
* add `vite` as a direct dev dependency so the `vitest` peer resolves to a patched version


## 1.2.0 - 2026-05-05

### Added
* introduce tests

### Changed
* bump dependencies


