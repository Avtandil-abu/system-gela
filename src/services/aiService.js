//  export const askAI = async (question, menuData, history = []) => {

// const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

// // ვამზადებთ ისტორიას, რომ AI-მ იცოდეს რა გვითხრა მანამდე
// const formattedHistory = history.map(msg => ({
//     role: msg.role === 'user' ? 'user' : 'assistant',
//     content: msg.text
// }));

// try {
//     const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
//         method: "POST",
//         headers: {
//             "Authorization": `Bearer ${apiKey}`,
//             "Content-Type": "application/json",
//             "HTTP-Referer": "http://localhost:5173",
//         },
//         body: JSON.stringify({
//             "model": "nousresearch/nous-capybara:free",
//             "messages": [
//                 {
//                     "role": "system",
//                     "content": `შენ ხარ "წისქვილის" რესტორნის მასპინძელი (სომელიე). 
//                         მენიუ: ${menuData}.

//                         შენი ხასიათი:
//                         - იყავი თბილი, ქართული სტუმართმოყვარეობით სავსე 🍷.
//                         - ნუ შემოიფარგლები მხოლოდ ფასით. მოუყევი კერძის გემოზე, არომატზე და ტრადიციაზე.
//                         - თუ უკვე მიესალმე სტუმარს (ნახე ისტორიაში), მეორედ აღარ მიესალმო. 
//                         - თუ ლობიოს ითხოვენ, ურჩიე მჭადი და მჟავე. თუ ხორცს - ღვინო ან აჯიკა.
//                         - პასუხი იყოს ვრცელი და მეგობრული.`
//                 },
//                 ...formattedHistory, // წინა საუბარი
//                 { "role": "user", "content": question } // ახალი კითხვა
//             ]
//         })
//     });

//     const data = await response.json();

//     // აი აქ იყო შეცდომა - დავაზღვიოთ პასუხის წაკითხვა
//     if (data && data.choices && data.choices[0]) {
//         return data.choices[0].message.content;
//     } else if (data.error) {
//         console.error("OpenRouter Error:", data.error);
//         throw new Error(data.error.message || "API Error");
//     } else {
//         throw new Error("Unknown response format");
//     }

// } catch (err) {
//     console.error("AI Service Error:", err);
//     throw err; // გადავცემთ ერორს ChatWidget-ს
// }
//  };

// import { GoogleGenerativeAI } from "@google/generative-ai";

// export const askAI = async (question, menuData, history = []) => {
//     // 1. გამოიყენე შენი Google API Key (შეამოწმე .env ფაილში რა გიწერია)
//     const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     // 2. ისტორიის ფორმატირება Google-ის სტილში
//     const chatHistory = history.map(msg => ({
//         role: msg.role === 'user' ? 'user' : 'model',
//         parts: [{ text: msg.text }],
//     }));

//     try {
//         const chat = model.startChat({
//             history: chatHistory,
//         });

//         // 3. სისტემური ინსტრუქცია (მასპინძლის როლი)
//         const systemPrompt = `შენ ხარ "წისქვილის" მასპინძელი (სომელიე). 
//         მენიუ: ${menuData}.
//         იყავი თბილი, გამოიყენე ემოციები (🍷, 🥘). მოუყევი კერძების გემოზე.
//         თუ უკვე მიესალმე, მეორედ აღარ მიესალმო. პასუხი იყოს ქართულად.`;

//         const result = await chat.sendMessage(`${systemPrompt}\n\nკითხვა: ${question}`);
//         const response = await result.response;
//         return response.text();
//     } catch (err) {
//         console.error("Google AI Error:", err);
//         return "ბოდიში, სტუმარო, ცოტა დავიბენი... 🍷 (კავშირის შეცდომა)";
//     }
// };

// src/services/aiService.js

export const askAI = async (question, menuData) => {
    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

    // პირდაპირი მისამართი v1 ვერსიაზე (არა ბეტაზე)
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-flash-latest:generateContent?key=${apiKey}`;

    const payload = {
        contents: [{
            parts: [{
                text: `შენ ხარ გელა, AI მასპინძელი. მენიუ: ${menuData}. უპასუხე სტუმარს თბილად და მოკლედ მისსავე ენაზე. \n\nკითხვა: ${question}`
            }]
        }]
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.error) {
            console.error("Google-ის ერორი:", data.error);
            return "ბოდიში, კავშირის პრობლემაა... 🍷 (გუგლმა უარი მითხრა)";
        }

        return data.candidates[0].content.parts[0].text;

    } catch (err) {
        console.error("Fetch Error:", err);
        return "ბოდიში, კავშირის პრობლემაა... 🍷 (ინტერნეტის ბრალია)";
    }
};