# Prompt Wrangler

A Chrome extension that detects and anonymizes sensitive data in AI chat prompts.

## What it does

Intercepts prompts sent to ChatGPT, detects sensitive information (emails, phone numbers, credit cards, API keys, social security numbers), and replaces them with placeholders before they reach the server. Alerts users when sensitive data is detected and maintains a history for audit purposes.

## Tech Stack

- React + TypeScript
- Vite
- Chrome Extension Manifest V3
- Context API for state management
- Sass for styling

## Development

```bash
npm install
npm run dev
```

Load the extension in Chrome:
1. Navigate to `chrome://extensions`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist/` folder

## Build

```bash
npm run build
```
