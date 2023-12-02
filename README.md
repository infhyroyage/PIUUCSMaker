# PIUUCSMaker

[![Build and Deploy PIU UCS Maker to GitHub Pages](https://github.com/infhyroyage/PIUUCSMaker/actions/workflows/build-deploy-pages.yaml/badge.svg)](https://github.com/infhyroyage/PIUUCSMaker/actions/workflows/build-deploy-pages.yaml)
![coverage](https://infhyroyage.github.io/PIUUCSMaker/badges.svg)

## Overview

Create and Play Pump It Up UCS Anywhere

## Major Versions

| Name       | Ver.    |
| ---------- | ------- |
| Node.js    | 20.10.0 |
| React      | 18.2.0  |
| Typescript | 5.1.6   |

> [!NOTE]
> All packages except above are maintained by dependabot.

## Development

```bash
# Install
git clone https://github.com/infhyroyage/PIUUCSMaker.git
npm i

# Develop at http://localhost:5173
git checkout -b feature/XXX
npm run dev

# Test & Lint
npm run test
npm run lint

# Check Production Build at http://localhost:4173
npm run build
npm run preview

# Push & Create PR
git commit -m "YYY"
git push origin feature/XXX
```

> [!WARNING]
> Unit tests are incompleted, so please check making ucs actually with http://localhost:3000

## License

MIT
