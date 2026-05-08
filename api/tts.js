import OpenAI from "openai";

const openai = new OpenAI();
const model_voice = "marin";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed. Please use POST." });
  }

  try {
    const { text, format = "wav" } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Text is required" });
    }

    const audio = await openai.audio.speech.create({
      model: "gpt-4o-mini-tts",
      voice: model_voice,
      input: text,
      instructions: `Speak in a warm and natural human tone with gentle expressiveness.
      Add small variations in pitch and rhythm to sound alive.
      Keep the delivery smooth, clear, and stable.`,
      speed: 1.0,
      response_format: format,
    });

    const buffer = Buffer.from(await audio.arrayBuffer());

    const contentType = format === "mp3" ? "audio/mpeg" : `audio/${format}`;
    res.setHeader("Content-Type", contentType);

    res.send(buffer);

  } catch (error) {
    console.error("TTS generation failed:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}