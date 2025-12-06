# Prompt Wrangler

Chrome extension that detects and anonymizes sensitive data in AI chat prompts.

## Tech Stack

React + TypeScript + Vite + Sass + Chrome Extension Manifest V3

## Commands

```bash
npm install              # Install dependencies
npm run dev              # Start dev server
npm run build            # Production build
npm run lint             # Run ESLint + stylelint
npm run lint:fix         # Auto-fix linting issues
npm run format           # Format with Prettier
npm run type-check       # TypeScript type checking
npm run test             # Run tests
```

## Development

Build and load in Chrome:
1. `npm run build`
2. Open `chrome://extensions`
3. Enable "Developer mode"
4. Click "Load unpacked" → select `dist/` folder
