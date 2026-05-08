export function useGPT() {
  const fetchGPTResponse = async (userMessage) => {
    try {
      const res = await fetch('/api/gpt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) throw new Error('Failed to fetch response from GPT');

      const data = await res.json();
      return data.reply;

    } catch (error) {
      console.error(error);
      return "Sorry, I'm having trouble connecting to my servers right now. Please try again later.";
    }
  };

  const transcribeAudio = async (audioBlob) => {
    const formData = new FormData();
    formData.append("audio", audioBlob, "recording.webm");

    const res = await fetch("/api/stt", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("STT request failed");

    const data = await res.json();
    return data.transcript;
  };

  return { fetchGPTResponse, transcribeAudio };
}