// src/services/aiService.js (ამ ფაილს ვანაცვლებთ მთლიანად)

export const askAI = async (question, menuData, prevMessages) => {
    const url = "/api/ai/ask"; // მოთხოვნას ვუგზავნით ჩვენს ბექენდს

    const payload = {
        question: question,
        menuData: menuData,
        prevMessages: prevMessages
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Backend Error Details:", data);
            return data.error || "გელა ცოტას დაისვენებს და 1 წუთში მოდი. 🍷";
        }

        // ვაბრუნებთ ბექენდიდან მოსულ პასუხს
        return data.answer;

    } catch (err) {
        console.error("Fetch Error:", err);
        return "ინტერნეტის ხარვეზია... 🍷";
    }
};