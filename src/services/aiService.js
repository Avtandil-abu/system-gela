export const askAI = async (question, menuData, prevMessages) => {
    try {
        const response = await fetch("/api/ask", { // ლინკი ზუსტად ასე!
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question, menuData, prevMessages })
        });

        const data = await response.json();
        if (!response.ok) return "გელა ცოტას დაისვენებს... 🍷";
        return data.answer;
    } catch (err) {
        return "Gemini connection error.";
    }
};