# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

PIU UCS Maker is a client-side-only React SPA for creating and playing Pump It Up UCS step charts. There is no backend, database, or external API dependency. See `CONTRIBUTING.md` for the canonical dev setup steps.

### Development commands

All commands are defined in `package.json` scripts:

| Command | Purpose |
|---|---|
| `npm run dev` | Start Vite dev server (default port 5173) |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest (jsdom, coverage enabled, watch disabled) |
| `npm run build` | TypeScript check + Vite production build |

### Non-obvious notes

- The project requires **Node.js 24.13.0**. Use `nvm use 24.13.0` (nvm is pre-installed). The update script handles installation of this version.
- Vite dev server runs on port **5173** (not 3000 as stated in `CONTRIBUTING.md`). No port override is configured in `vite.config.ts`.
- `npm run test` runs with `watch: false` and `maxWorkers: 1` by default (set in `vitest.config.ts`), so it exits after a single run.
- Coverage thresholds are set at 80% for statements. Tests currently pass well above that (~98%).
- The `vite.config.ts` has a custom alias for `daisyui` to force JS plugin import resolution for Tailwind CSS v4 compatibility.
- `npm run build` uses base path `/PIUUCSMaker/` (for GitHub Pages deployment); the dev server uses `/`.
