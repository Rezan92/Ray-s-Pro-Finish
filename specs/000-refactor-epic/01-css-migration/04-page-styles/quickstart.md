# Quickstart: CSS Modules Migration (Pages)

This guide describes how to work with the migrated Page components.

## Migration Reference Table

| Component | Old File | New File |
|-----------|----------|----------|
| AboutPage | `AboutPage.css` | `AboutPage.module.css` |
| ContactPage | `ContactPage.css` | `ContactPage.module.css` |
| ServicesPage | `ServicesPage.css` | `ServicesPage.module.css` |
| ProjectsPage | `ProjectsPage.css` | `ProjectsPage.module.css` |
| EstimatorPage | `EstimatorPage.css` | `EstimatorPage.module.css` |

## Notes
- Pages now use scoped classes for their top-level containers.
- Global layout classes (like `.container`) may still be used in Mixed Usage patterns if applicable.
