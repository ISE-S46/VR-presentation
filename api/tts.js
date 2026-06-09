import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
const openai = apiKey ? new OpenAI({ apiKey }) : null;
const MODEL_VOICE = "marin";
const SUPPORTED_FORMATS = new Set(["mp3", "wav", "opus", "aac", "flac", "pcm"]);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed. Please use POST." });
  }

  try {
    const { text, format = "wav", speed } = req.body;
    const normalizedFormat = String(format).toLowerCase();

    if (!openai) {
      return res.status(503).json({
        error: "OpenAI API key is not configured. Set OPENAI_API_KEY in .env.",
      });
    }

    if (!text?.trim()) {
      return res.status(400).json({ error: "Text is required" });
    }

    if (!SUPPORTED_FORMATS.has(normalizedFormat)) {
      return res.status(400).json({ error: "Unsupported audio format" });
    }

    // Parse speed parameter (between 0.5 and 1.5)
    let speechSpeed = 0.9;
    if (speed !== undefined) {
      const parsed = parseFloat(speed);
      if (!isNaN(parsed) && parsed >= 0.5 && parsed <= 1.5) {
        speechSpeed = parsed;
      }
    }

    const audio = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: MODEL_VOICE,
      input: text.trim().slice(0, 3800),
      instructions: `Speak in a warm and natural human tone with gentle expressiveness.
      Add small variations in pitch and rhythm to sound alive.
      Keep the delivery smooth, clear, and stable, at a calm and unhurried pace.`,
      speed: speechSpeed,
      response_format: normalizedFormat,
    });

    const buffer = Buffer.from(await audio.arrayBuffer());

    const contentType = normalizedFormat === "mp3" ? "audio/mpeg" : `audio/${normalizedFormat}`;
    res.setHeader("Content-Type", contentType);

    res.send(buffer);

  } catch (error) {
    console.error("TTS generation failed:", error);
    res.status(500).json({ error: "Unable to generate speech right now." });
  }
}
