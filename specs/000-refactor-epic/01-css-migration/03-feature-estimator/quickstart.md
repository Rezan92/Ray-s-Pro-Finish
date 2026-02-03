# Quickstart: CSS Modules Migration (Estimator)

This guide describes how to work with the migrated Estimator components.

## Migration Reference Table

| Component | Old File (in `styles/`) | New File (in `styles/`) |
|-----------|-------------------------|-------------------------|
| BasementForm | `BasementForm.css` | `BasementForm.module.css` |
| GarageForm | `GarageForm.css` | `GarageForm.module.css` |
| RepairForm | `RepairForm.css` | `RepairForm.module.css` |
| InstallationForm | (Check existence) | `InstallationForm.module.css` |
| PaintingForm | (Check existence) | `PaintingForm.module.css` |

## Notes
- Components import styles from `./styles/[Name].module.css`.
- All form-related classes (`.form-group`, `.checkbox-group`) are now scoped.
