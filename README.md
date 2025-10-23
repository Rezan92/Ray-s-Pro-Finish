# Folder structure
```
RayProFinish
├── public/           # Static assets (images, fonts) handled by the browser
├── src/              # Your main application code
│   ├── api/          # (Optional) For API fetching logic (e.g., Axios/Fetch setup)
│   ├── assets/       # Images, SVGs, etc., imported into your components
│   ├── components/   # Reusable UI components (Button, Input, Modal)
│   │   ├── common/   # (or /ui) Small, truly reusable components
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.module.css
│   │   │   │   └── Button.types.ts
│   │   │   └── ...
│   │   └── layout/   # Components that structure the page (Header, Footer, Sidebar)
│   │       ├── Header.tsx
│   │       └── Footer.tsx
│   ├── hooks/        # Custom React hooks (e.g., useLocalStorage.ts)
│   ├── pages/        # Top-level components for each route (HomePage, AboutPage)
│   │   ├── HomePage/
│   │   │   ├── HomePage.tsx
│   │   │   └── HomePage.module.css
│   │   └── AboutPage.tsx
│   ├── store/        # All your Redux state management
│   │   ├── slices/   # Redux Toolkit slices (e.g., userSlice.ts, cartSlice.ts)
│   │   ├── hooks.ts  # Pre-typed Redux hooks (useAppDispatch, useAppSelector)
│   │   └── store.ts  # The main Redux store configuration
│   ├── styles/       # Global styles, variables (e.g., global.css, theme.ts)
│   ├── types/        # Global TypeScript types (if not defined with components)
│   ├── utils/        # Helper functions (e.g., formatDate.ts, validators.ts)
│   ├── App.tsx       # Main app component (often contains routing)
│   └── main.tsx      # The entry point of your app
├── .gitignore
├── index.html        # The main HTML file
├── package.json
├── tsconfig.json     # TypeScript configuration
└── vite.config.ts    # Vite configuration
```

# Project Design System & Style Guide

This document outlines the core design system for our React project, based on the provided designs. All components should adhere to these rules for color, typography, and spacing to ensure a consistent and professional look.

## 1. Color Palette 🎨

We use CSS variables to manage our color palette. These should be defined in a global stylesheet (e.g., `index.css`).

| Color                                                                 | Role                  | CSS Variable            | Hex Code    |
| --------------------------------------------------------------------- | --------------------- | ----------------------- | ----------- |
| ![#F15A24](https://placehold.co/15x15/F15A24/F15A24.png)                | Primary / Brand       | `--color-primary`       | `#F15A24`   |
| ![#0A142F](https://placehold.co/15x15/0A142F/0A142F.png)                | Brand (Dark)          | `--color-brand-dark`    | `#0A142F`   |
| ![#333333](https://placehold.co/15x15/333333/333333.png)                | Text (Primary)        | `--color-text-primary`  | `#333333`   |
| ![#666666](https://placehold.co/15x15/666666/666666.png)                | Text (Secondary)      | `--color-text-secondary`| `#666666`   |
| ![#FFFFFF](https://placehold.co/15x15/FFFFFF/FFFFFF.png)                | Text (Inverted)       | `--color-text-inverted` | `#FFFFFF`   |
| ![#FFFFFF](https://placehold.co/15x15/FFFFFF/FFFFFF.png)                | Background (Primary)  | `--color-bg-primary`    | `#FFFFFF`   |
| ![#0A142F](https://placehold.co/15x15/0A142F/0A142F.png)                | Background (Secondary)| `--color-bg-secondary`  | `#0A142F`   |
| ![#FAFAFA](https://placehold.co/15x15/FAFAFA/FAFAFA.png)                | Background (Light)    | `--color-bg-light`      | `#FAFAFA`   |
| ![#EAEAEA](https://placehold.co/15x15/EAEAEA/EAEAEA.png)                | Borders               | `--color-border`        | `#EAEAEA`   |

### Utility Colors

| Color                                                                 | Role                  | CSS Variable            | Hex Code    |
| --------------------------------------------------------------------- | --------------------- | ----------------------- | ----------- |
| ![#D93025](https://placehold.co/15x15/D93025/D93025.png)                | Error State           | `--color-error`         | `#D93025`   |
| ![#1E8E3E](https://placehold.co/15x15/1E8E3E/1E8E3E.png)                | Success State         | `--color-success`       | `#1E8E3E`   |

---

## 2. Typography ✒️

We will use two fonts from Google Fonts. They should be imported in `index.html`.

**Font Import (in `index.html`):**
```html
<link rel="preconnect" href="[https://fonts.googleapis.com](https://fonts.googleapis.com)">
<link rel="preconnect" href="[https://fonts.gstatic.com](https://fonts.gstatic.com)" crossorigin>
<link href="[https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&family=Roboto:wght@400;500&display=swap](https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800&family=Roboto:wght@400;500&display=swap)" rel="stylesheet">
```

## 3. Layout & Spacing 📏
### Breakpoints
We are developing Desktop First. Styles should apply to desktop by default, and we will use `max-width` media queries to adjust for smaller screens.

| Name | Max-Width | Media Query |
| :--- | :--- | :--- |
| Large Tablet | 1024px | `@media (max-width: 1024px)` |
| Small Tablet | 768px | `@media (max-width: 768px)` |
| Small Mobile | 640px | `@media (max-width: 640px)` |

### Spacing Scale
All `margin` and `padding` should use our 8px spacing scale for consistency.

| Variable | Value | Visual (Height) |
| :--- | :--- | :--- |
| `--space-xs` | 4px | <div style="width: 100px; height: 4px; background-color: #EAEAEA; border: 1px solid #CCCCCC;"></div> |
| `--space-sm` | 8px | <div style="width: 100px; height: 8px; background-color: #EAEAEA; border: 1px solid #CCCCCC;"></div> |
| `--space-md` | 16px | <div style="width: 100px; height: 16px; background-color: #EAEAEA; border: 1px solid #CCCCCC;"></div> |
| `--space-lg` | 24px | <div style="width: 100px; height: 24px; background-color: #EAEAEA; border: 1px solid #CCCCCC;"></div> |
| `--space-xl` | 32px | <div style="width: 100px; height: 32px; background-color: #EAEAEA; border: 1px solid #CCCCCC;"></div> |
| `--space-xxl` | 64px | <div style="width: 100px; height: 64px; background-color: #EAEAEA; border: 1px solid #CCCCCC;"></div> |

## 4. Border Radius 📐
We use two simple border-radius values for a clean, modern look.

| Variable | Value | Visual Example | Usage |
| :--- | :--- | :--- | :--- |
| `--border-radius-sm` | 4px | <div style="width: 60px; height: 30px; border: 2px solid #F15A24; border-radius: 4px;"></div> | Buttons, small inputs |
| `--border-radius-md` | 8px | <div style="width: 60px; height: 30px; border: 2px solid #F15A24; border-radius: 8px;"></div> | Cards, containers |


## 5. Interactive States (Hover) ✨
<p>Based on the provided component states, here are the hover effects we will implement.</p>

| Component | Default BG | Default Text | Hover BG | Hover Text |
| :--- | :--- | :--- | :--- | :--- |
| **Service Card (Icon)**| ![#FFFFFF](https://placehold.co/15x15/FFFFFF/FFFFFF.png) White | (N/A) | ![#F15A24](https://placehold.co/15x15/F15A24/F15A24.png) Orange | (N/A) |
| **Blog Card (Title)** | (N/A) | ![#0A142F](https://placehold.co/15x15/0A142F/0A142F.png) Dark | (N/A) | ![#F15A24](https://placehold.co/15x15/F15A24/F15A24.png) Orange |
| **Project Card (Info)**| ![#FFFFFF](https://placehold.co/15x15/FFFFFF/FFFFFF.png) White | ![#0A142F](https://placehold.co/15x15/0A142F/0A142F.png) Dark* | ![#F15A24](https://placehold.co/15x15/F15A24/F15A24.png) Orange | ![#FFFFFF](https://placehold.co/15x15/FFFFFF/FFFFFF.png) White |
| **Button: Dark** | ![#0A142F](https://placehold.co/15x15/0A142F/0A142F.png) Dark | (Not specified) | ![#F15A24](https://placehold.co/15x15/F15A24/F15A24.png) Orange | (Not specified) |
| **Button: Orange** | ![#F15A24](https://placehold.co/15x15/F15A24/F15A24.png) Orange | (Not specified) | ![#0A142F](https://placehold.co/15x15/0A142F/0A142F.png) Dark | (Not specified) |
