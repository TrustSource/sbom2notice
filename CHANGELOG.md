# sbom2notice

## Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


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


