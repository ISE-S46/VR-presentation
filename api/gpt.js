import OpenAI from "openai";

const openai = new OpenAI();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed. Please use POST." });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are the ETC (Enabling Technology Collaboratory) assistant. Keep answers helpful, concise, and friendly." },
        { role: "user", content: message }
      ],
      temperature: 0.7, // Adjust for creativity (0.0 to 2.0)
    });

    const reply = completion.choices[0].message.content;

    res.status(200).json({ reply });

  } catch (error) {
    console.error("GPT generation failed:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}