/**
 * VoiceCraft AI starter backend
 * Node.js 18+ / Express. Keep ELEVENLABS_API_KEY on the server only.
 * Configure the voice IDs in .env; placeholder voice names in the UI are not provider IDs.
 */
require("dotenv").config();
const express = require("express");
const path = require("path");
const app = express();
const PORT = Number(process.env.PORT || 3000);

// আপনার ElevenLabs API Key
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || "sk_aaf76d456d75fbf6b254c887de70b60147633618d5d95d63";

app.use(express.json({ limit: "200kb" }));
app.use(express.static(path.join(__dirname, "public")));

const VOICES = {
  "bn-female-soft": (process.env.VOICE_BN_FEMALE_SOFT || "YyFoWJwI20bOlOPfwy6X"),
  "bn-female-bright": process.env.VOICE_BN_FEMALE_BRIGHT,
  "bn-female-pro": process.env.VOICE_BN_FEMALE_PRO,
  "bn-male-warm": process.env.VOICE_BN_MALE_WARM,
  "bn-male-deep": process.env.VOICE_BN_MALE_DEEP,
  "bn-male-pro": process.env.VOICE_BN_MALE_PRO,
  "en-female-soft": (process.env.VOICE_EN_FEMALE_SOFT || "3DF5lO2rtqNp6A9emuj0"),
  "en-female-bright": process.env.VOICE_EN_FEMALE_BRIGHT,
  "en-female-pro": process.env.VOICE_EN_FEMALE_PRO,
  "en-male-warm": process.env.VOICE_EN_MALE_WARM,
  "en-male-deep": process.env.VOICE_EN_MALE_DEEP,
  "en-male-pro": process.env.VOICE_EN_MALE_PRO,
  "hi-female-soft": (process.env.VOICE_HI_FEMALE_SOFT || "HBZPYXXu7MHBOUlDZtD6"),
  "hi-female-bright": process.env.VOICE_HI_FEMALE_BRIGHT,
  "hi-female-pro": process.env.VOICE_HI_FEMALE_PRO,
  "hi-male-warm": (process.env.VOICE_HI_MALE_WARM || "4tRn1lSkEn13EVTuqb0g"),
  "hi-male-deep": process.env.VOICE_HI_MALE_DEEP,
  "hi-male-pro": process.env.VOICE_HI_MALE_PRO
};

const emotionInstructions = {
  natural: "",
  cute: "[warm, sweet, gentle delivery] ",
  professional: "[clear, confident, professional narration] ",
  emotional: "[emotional, heartfelt delivery] ",
  storytelling: "[expressive storytelling, natural pauses] ",
  calm: "[calm, soothing delivery] ",
  cheerful: "[cheerful, bright delivery] "
};

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    provider: "ElevenLabs",
    apiKeyConfigured: Boolean(ELEVENLABS_API_KEY),
    configuredVoices: Object.values(VOICES).filter(Boolean).length
  });
});

app.post("/api/tts", async (req, res) => {
  try {
    const { text, language, voiceId, emotion = "natural", speed = 1, format = "mp3" } = req.body || {};
    
    if (!ELEVENLABS_API_KEY) {
      return res.status(503).json({ error: "ELEVENLABS_API_KEY সেট করা নেই।" });
    }
    if (typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Text is required." });
    }
    if (text.length > 12000) {
      return res.status(413).json({ error: "একবারে সর্বোচ্চ 12,000 অক্ষর পাঠান।" });
    }
    if (!["bn", "en", "hi"].includes(language)) {
      return res.status(400).json({ error: "Unsupported language." });
    }

    const voice = VOICES[voiceId];
    if (!voice) {
      return res.status(400).json({
        error: "এই UI voice-এর জন্য .env-এ আসল provider voice ID বসানো নেই।"
      });
    }

    const safeSpeed = Math.min(1.2, Math.max(0.7, Number(speed) || 1));
    const instruction = emotionInstructions[emotion] ?? "";
    const modelId = process.env.ELEVENLABS_MODEL_ID || "eleven_multilingual_v2";

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice)}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
          "Accept": "audio/mpeg"
        },
        body: JSON.stringify({
          text: instruction + text.trim(),
          model_id: modelId,
          language_code: language,
          voice_settings: {
            stability: emotion === "emotional" || emotion === "storytelling" ? 0.0 : 0.5,
            similarity_boost: 0.75,
            use_speaker_boost: true,
            speed: safeSpeed
          }
        })
      }
    );

    if (!response.ok) {
      const detail = (await response.text()).slice(0, 1200);
      console.error("ElevenLabs error:", response.status, detail);
      return res.status(502).json({
        error: `Voice provider error (${response.status}). API key, voice ID, model and plan check করুন।`
      });
    }

    const audio = Buffer.from(await response.arrayBuffer());
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Length": String(audio.length),
      "Content-Disposition": 'attachment; filename="voicecraft-audio.mp3"',
      "Cache-Control": "no-store"
    });
    res.send(audio);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while generating audio." });
  }
});

app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.listen(PORT, () => console.log(`VoiceCraft AI running at http://localhost:${PORT}`));
