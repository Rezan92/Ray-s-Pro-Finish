# Quickstart: CSS Modules Migration (Layout)

This guide describes how to work with the migrated Layout components.

## Migration Reference Table

| Component | Old File | New File |
|-----------|----------|----------|
| App | `App.css` | `App.module.css` (Layout), `index.css` (Globals) |
| Navbar | `Navbar.css` | `Navbar.module.css` |
| TopBar | `TopBar.css` | `TopBar.module.css` |
| PageHeader | `PageHeader.css` | `PageHeader.module.css` |
| Footer | `Footer.css` | `Footer.module.css` |

## New Global Variables
The following variables have been added to `index.css` to support this migration:
- `--color-white-70`: `rgba(255, 255, 255, 0.7)`
- `--color-white-05`: `rgba(255, 255, 255, 0.05)`
- `--color-overlay-dark`: `#040e266b`
