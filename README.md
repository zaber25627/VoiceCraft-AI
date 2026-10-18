# VoiceCraft AI — Starter Kit

## What's included
- `public/index.html`: responsive Premium Dark UI for Bengali, English and Hindi.
- `server.js`: Express backend that calls ElevenLabs TTS; API key stays on the server.
- `.env.example`: environment and voice-ID template.
- `package.json`: Node dependencies.

## Important limitations
- UI voice names (Maya, Tuli, etc.) are example labels. They do not correspond to actual provider voices until you configure real ElevenLabs voice IDs.
- Provider voice availability, language quality, emotion control, and pricing depend on the selected model/account. Test Bengali (Bangladesh) pronunciation before production.
- Browser preview uses the device's built-in speech synthesis and is not an MP3 export.
- The pitch control is a UI placeholder; this ElevenLabs starter backend does not apply pitch shifting.
- History/favorites are stored in the current browser's localStorage. Generated audio object URLs are temporary; long-term audio history requires persistent object storage/database.
- The emotion text tags are best-effort instructions and depend on model support; they do not guarantee a specific emotion.

## Run locally
1. Install Node.js 18 or newer.
2. Copy `public/index.html` into the `public/` folder (already arranged in this kit).
3. Copy `.env.example` to `.env`.
4. Create an ElevenLabs API key and put it in `.env`.
5. In ElevenLabs, select voices that support your intended languages and copy their actual voice IDs into the matching `VOICE_*` variables.
6. In a terminal, run:
   ```bash
   npm install
   npm start
   ```
7. Open `http://localhost:3000`.

## Deploy safely
Deploy the Node server to a backend host (for example, a Node-capable app host). Set environment variables in that host's secret/environment settings. Do not publish `.env` or embed API keys in client-side HTML. Add authentication, per-user quotas/rate limits, billing controls, request logging with no sensitive text, and persistent storage before public launch.

## API contract
`POST /api/tts`
```json
{
  "text": "Hello world",
  "language": "en",
  "voiceId": "en-female-soft",
  "emotion": "natural",
  "speed": 1.0,
  "pitch": 0,
  "format": "mp3"
}
```
Success response: `audio/mpeg` bytes. Errors: JSON `{ "error": "..." }`.
`GET /api/health` reports whether the key is configured and how many voice IDs are mapped; it never returns the key.


## Voice IDs configured in this update
- Bengali: `YyFoWJwI20bOlOPfwy6X`
- English: `3DF5lO2rtqNp6A9emuj0`
- Hindi female: `HBZPYXXu7MHBOUlDZtD6`
- Hindi male: `4tRn1lSkEn13EVTuqb0g`

Only these four IDs were available in the conversation. The API key is intentionally NOT included in this package; add a newly created secret key to Render as `ELEVENLABS_API_KEY`. Voice labels/gender should be verified in the ElevenLabs dashboard.
