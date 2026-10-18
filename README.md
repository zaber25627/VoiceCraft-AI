# VoiceCraft AI — fixed frontend/backend package

## Files
- `index.html`: GitHub Pages frontend; its Generate Audio request points to `https://voicecraft-ai.onrender.com/api/tts`.
- `server.js`: Express API with CORS enabled for `https://zaber25627.github.io`.
- `public/index.html`: copy of the frontend for deployments where Render serves the page too.
- `package.json`: Node.js dependencies and start command.
- `.env.example`: names of environment variables only; it does not contain a real API key.

## Render setup
1. Upload/commit `server.js`, `package.json`, and `public/index.html` to the backend service repository.
2. Render build command: `npm install`
3. Render start command: `npm start`
4. In Render → Environment, set `ELEVENLABS_API_KEY` to a newly created private ElevenLabs API key. Do not put it in HTML, GitHub, or this ZIP.
5. Set `VOICE_BN_FEMALE_SOFT`, `VOICE_EN_FEMALE_SOFT`, `VOICE_HI_FEMALE_SOFT`, and `VOICE_HI_MALE_WARM` to valid voice IDs from your own ElevenLabs account if the defaults are not valid for your account. Set other `VOICE_*` values only when you have the matching real IDs.
6. Check `https://voicecraft-ai.onrender.com/api/health`. The response shows which UI voice slots are configured.

## GitHub Pages setup
Upload the root `index.html` to the `main` branch at the repository root (or replace the current root `index.html`). GitHub Pages should publish the repository root.

## Important
The UI displays 18 voice choices, but only slots with a real provider Voice ID set in Render can generate audio. The labels such as Maya, Tuli, Olivia, etc. are UI names, not ElevenLabs voice IDs. Configure the missing voice IDs in Render Environment before using those slots.
