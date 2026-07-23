# 🍽️ Forkify - Recipe Search App

> A modern recipe search and bookmarking app built with React and TypeScript. Find recipes, save your favorites, and adjust servings on the fly.

**[🚀 Live Demo](#live-demo)** • **[✨ Features](#features)** • **[🛠 Tech Stack](#tech-stack)** • **[📝 Getting Started](#getting-started)**

## Live Demo

🔗 **[View Live App](https://gentle-pony-096ae6.netlify.app)** - Search recipes, save bookmarks, and explore 50,000+ dishes live!

## 🏆 Performance & Quality

**Lighthouse Audit Results** (Deployed App):
- ⚡ **Performance: 71** - Fast load times and optimized assets
- ♿ **Accessibility: 92** - WCAG compliant with excellent screen reader support
- 📋 **Best Practices: 77** - Modern web standards and security best practices
- 🔍 **SEO: 83** - Optimized for search engine visibility

*Scores measured on live deployment at https://gentle-pony-096ae6.netlify.app*

## ✨ Features

### Core Functionality
- 🔍 **Smart Search** - Find recipes by ingredient or dish name (50,000+ recipes available)
- 📖 **Pagination** - Browse through results with automatic active selection
- 🎯 **Auto-Load** - First matching recipe loads automatically after search
- 👥 **Adjust Servings** - Change servings and ingredient quantities recalculate automatically
- ⭐ **Bookmark Recipes** - Save favorites to local storage (persists across sessions)
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile

### Advanced Features
- ⬆️ **Custom Recipes** - Upload your own recipes (requires Forkify API key)
- 🎨 **Clean UI** - Modern, intuitive design with smooth interactions
- ⚡ **Fast & Lightweight** - Built with Vite for instant load times
- 🔐 **Type-Safe** - Full TypeScript implementation with typed API services

## 🛠 Tech Stack

- **Frontend Framework**: React 19
- **Language**: TypeScript 5.7
- **Build Tool**: Vite 6
- **Styling**: Sass/SCSS
- **Package Manager**: npm
- **API**: Forkify API

## Getting Started

### Prerequisites
- Node.js 16+ and npm installed

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/AlketaNovende/forkify.git
cd forkify

# Install dependencies
npm install

# Start development server
npm run dev
```

The app runs locally at http://localhost:5173 (or another port if 5173 is in use).

### Optional: Enable Custom Recipe Uploads

To upload custom recipes, you'll need a Forkify API key:

1. Copy .env.example to .env
2. Get your free API key from [Forkify API](https://forkify-api.herokuapp.com/v2)
3. Add your key:
   ```bash
   VITE_FORKIFY_API_KEY=your-api-key-here
   ```

## 📦 Build & Deployment

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 📋 Available Scripts

| Command | Description |
|---------|-------------|
| 
pm run dev | Start development server |
| 
pm run build | Build for production |
| 
pm run preview | Preview production build |

## 🎓 Learning & Credits

This project is a modern React/TypeScript rebuild of the popular Forkify course project, originally built with vanilla JavaScript. The rebuild demonstrates modern frontend development practices with:

- Component-based architecture
- Type safety with TypeScript
- API service layer abstraction
- Custom React hooks
- Local state management
- Responsive design with Sass

**Recipe Data**: Powered by the [Forkify API](https://forkify-api.herokuapp.com/v2)
