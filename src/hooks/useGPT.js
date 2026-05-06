export function useGPT() {
  const fetchGPTResponse = async (userMessage) => {
    try {
      const res = await fetch('/api/gpt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch response from GPT');
      }

      const data = await res.json();
      return data.reply;

    } catch (error) {
      console.error(error);
      return "Sorry, I'm having trouble connecting to my servers right now. Please try again later.";
    }
  };

  return { fetchGPTResponse };
}