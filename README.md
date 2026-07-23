# Forkify React TypeScript

A recipe search app rebuilt from the original Forkify project with React, TypeScript, Vite, typed API services, local bookmark persistence, pagination, serving controls, and custom recipe uploads.

## Tech Stack

- React 19
- TypeScript
- Vite
- Sass
- Forkify API

## Features

- Search recipes by ingredient or dish name
- View paginated results with active selection state
- Auto-load the first matching recipe after search
- Adjust serving counts with recalculated ingredient quantities
- Save and remove bookmarks in local storage
- Upload custom recipes when a Forkify API key is configured
- Responsive layout for desktop and mobile screens

## Getting Started

```bash
npm install
npm run dev
```

The app runs locally at the URL printed by Vite, usually `http://localhost:5173`.

## Environment Variables

Recipe search works without a key. Custom recipe uploads require a Forkify API key.

1. Copy `.env.example` to `.env`.
2. Set `VITE_FORKIFY_API_KEY` to your API key.

```bash
VITE_FORKIFY_API_KEY=your-forkify-api-key
```

## Scripts

```bash
npm run dev
npm run build
npm run preview
```

`npm run build` runs TypeScript checks and creates a production build in `dist`.
