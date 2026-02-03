# Quickstart: CSS Modules Migration

This guide describes how to work with the newly migrated CSS Modules components.

## Development Workflow

### 1. Styling Components
- **File Naming**: Always use `[ComponentName].module.css`.
- **Imports**: Import as `styles` object: `import styles from './[ComponentName].module.css';`.
- **Usage**: Access classes via the object: `<div className={styles.container}>`.

### 2. Mixed Global & Module Classes
When you need to use a global utility class (like `btn` or `dark`) alongside a module class:

```tsx
// CORRECT
<button className={`${styles.button} btn dark`}>

// INCORRECT
<button className={styles.button + ' btn dark'}> // Avoid string concatenation if possible
```

### 3. Using Variables
Do not hardcode colors. Use variables from `index.css`:

```css
/* CORRECT */
.container {
  background-color: var(--bg-primary);
  color: var(--text-main);
}

/* INCORRECT */
.container {
  background-color: #ffffff;
  color: #333;
}
```

## Migration Reference Table

| Component | Old File | New File |
|-----------|----------|----------|
| Button | `Button.css` | `Button.module.css` |
| FloatingAlert | `FloatingAlert.css` | `FloatingAlert.module.css` |
| InfoTooltip | `InfoTooltip.css` | `InfoTooltip.module.css` |
| Logo | `Logo.css` | `Logo.module.css` |
| FeatureCard | `FeatureCard.css` | `FeatureCard.module.css` |
| ProjectCard | `ProjectCard.css` | `ProjectCard.module.css` |
| ServiceCard | `ServiceCard.css` | `ServiceCard.module.css` |
| StatCard | `StatCard.css` | `StatCard.module.css` |
