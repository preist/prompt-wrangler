---
layout: default
title: Prompt Wrangler
---

# Prompt Wrangler

Chrome extension that detects and anonymizes sensitive data in AI chat prompts.

![Prompt Wrangler preview](preview.gif)

## What it does
- Scans your prompts on ChatGPT for sensitive tokens (emails, phone numbers, social security or credit card numbers).
- Anonymizes detected data so you can share prompts safely.
- Works automatically on `chatgpt.com` and `chat.openai.com` once loaded.
- Runs locally in the browser; no data leaves your machine.

## Download
- Get the latest unpacked build from the GitHub release: [Prompt Wrangler v1.0.0](https://github.com/preist/prompt-wrangler/releases/tag/v1.0.0).
- Download `prompt-wrangler-unpacked-extension-v1.0.0.zip`.
- Unzip the file; the folder must contain `manifest.json` at its root.

## Install on Google Chrome (Developer Mode)
1. Open `chrome://extensions` in Chrome.
2. Toggle **Developer mode** (top right).
3. Click **Load unpacked**.
4. Select the unzipped folder that contains `manifest.json`.
5. The extension appears in your list. Pin it from the toolbar if you want quick access.

## Updating
- When a new release is published, download the new `prompt-wrangler-unpacked-extension-<version>.zip`, unzip it, and repeat **Load unpacked** (or click the refresh icon on the existing entry after replacing the folder).

## Source code
- Full source is in [this repository](https://github.com/preist/prompt-wrangler); GitHub provides source archives on the release page if you prefer downloading without `git clone`.

## Privacy & Terms
- [Terms of Service & Privacy Policy](terms.html)
