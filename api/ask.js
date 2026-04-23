// api/ai/ask.js (გახსოვდეს, ეს ფაილი არ არის src-ში!)

export default async function handler(req, res) {
    // 1. ვამოწმებთ, რომ მოთხოვნა არის POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { question, menuData, prevMessages } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // API გასაღებს Vercel-ის პანელიდან ავიღებთ

    // API გასაღების შემოწმება
    if (!GEMINI_API_KEY) {
        return res.status(500).json({ error: 'Gemini API key is missing. Add it to Vercel environment variables.' });
    }

    // 2. ვამზადებთ მენიუს "ჭკვიან" ფილტრაციას, რომ ლიმიტს არ გადავაცილოთ
    let relevantContext = "";
    try {
        const data = typeof menuData === 'string' ? JSON.parse(menuData) : menuData;
        const q = question.toLowerCase();

        // საკვანძო სიტყვების ძებნა
        if (q.includes("ღვინო") || q.includes("სასმელი") || q.includes("wine") || q.includes("drink")) {
            relevantContext += `ღვინო და სასმელები: ${data["ღვინო"] || ""} ${data["სასმელები"] || ""}`;
        }
        if (q.includes("ხორცი") || q.includes("მწვადი") || q.includes("meat") || q.includes("steak")) {
            relevantContext += `ხორცეული: ${data["ხორცეული"] || ""}`;
        }
        if (q.includes("ფასი") || q.includes("რა ღირს") || q.includes("price") || q.includes("cost")) {
            relevantContext = String(menuData).substring(0, 2500); // ფასებზე ცოტა მეტს ვაძლევთ
        }

        // ყოველთვის ვამატებთ ზოგად ინფორმაციას
        relevantContext += ` ზოგადი ინფო: ${data["ზოგადი ინფო"] || ""}`;
    } catch (e) {
        relevantContext = String(menuData).substring(0, 1500);
    }

    // 3. საუბრის ისტორიის მომზადება (ბოლო 3 მესიჯი)
    const chatHistory = (prevMessages || []).slice(-3).map(m =>
        `${m.role === 'user' ? 'სტუმარი' : 'გელა'}: ${m.text}`
    ).join('\n');

    // 4. სისტემური ინსტრუქციის მომზადება
    const systemInstruction = `
    შენ ხარ გელა - GE-MRIELI-ს ენაწყლიანი, თბილი და სტუმართმოყვარე ქართველი მასპინძელი და სომელიე. 
    შენი შემქმნელია ავთანდილი (Avtandil).

    აქ არის ინფორმაცია რესტორნიდან (მენიუ და ფასები):
    === მენიუს მონაცემები ===
    ${relevantContext}
    === მენიუს დასასრული ===

    აქ არის წინა საუბრის ისტორია:
    ${chatHistory}

    ინსტრუქცია:
    1. უპასუხე იმ ენაზე, რომელზეც სტუმარი გეკითხება (ქართული, ინგლისური, რუსული და ა.შ.).
    2. პასუხი გაეცი ქართველი მასპინძლის სტილში: თბილად, მეგობრულად, ცოტა იუმორით, მაგრამ მოკლედ და კონკრეტულად.
    3. თუ მენიუზე გეკითხებიან, გამოიყენე მხოლოდ მოწოდებული მონაცემები. 
    4. თუ ზოგად კერძზე გკითხეს (მაგ: ბაჟე, ხინკალი), გამოიყენე შენი AI ცოდნა და მოუყევი ვრცლად და გემრიელად, თუნდაც ეს მენიუში არ ეწეროს.
    5. თუ ფასი შეიცვალა ბაზაში, ყოველთვის ახალი ფასი უთხარი.
    6. არ ახსენო სიტყვები: "JSON", "მონაცემები", "სისტემა", "მოდელი".
  `;

    // 5. მოთხოვნის გაგზავნა Google AI Studio (Gemini)-ში
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const payload = {
        contents: [{ parts: [{ text: systemInstruction + `\n\nსტუმარი: ${question}` }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini Error:", data);
            return res.status(response.status).json({ error: 'Gemini connection error.' });
        }

        // 6. Gemini-ს პასუხის ამოღება და გამოგზავნა
        const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "უი, ცოტა დავიბენი... აბა თავიდან მითხარი? 🍷";
        return res.status(200).json({ answer: aiResponse });

    } catch (error) {
        console.error("Fetch Error:", error);
        return res.status(500).json({ error: 'Internal Server Error.' });
    }
}