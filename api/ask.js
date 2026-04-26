export const askFakeAI = async (question, menuData) => {
    try {
        const transToGeo = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=ka&dt=t&q=${encodeURIComponent(question)}`);
        const geoData = await transToGeo.json();
        const translatedQuestion = geoData[0][0][0].toLowerCase();
        const detectedLang = geoData[2] || 'en';

        let response = "";

        // 1. მენიუს დაყოფა უფრო ჭკვიანურად (წერტილით, მძიმით ან ახალი ხაზით)
        const sentences = menuData ? menuData.split(/[.\n,]/).filter(s => s.trim().length > 2) : [];
        const keywords = translatedQuestion.split(" ").filter(w => w.length > 2);

        // ვეძებთ ნებისმიერ დამთხვევას (თუნდაც სიტყვის ნაწილს, მაგ: "სალათ")
        const found = sentences.find(s =>
            keywords.some(k => {
                const baseWord = k.substring(0, k.length - 2); // აშორებს ბოლოებს (სალათ-ები -> სალათ)
                return s.toLowerCase().includes(baseWord.length > 2 ? baseWord : k);
            })
        );

        if (found) {
            response = `რა თქმა უნდა! აი, რა წერია ჩვენს მენიუში: ${found.trim()}. 🍷`;
        } else if (/(მენიუ|ჭამა|ღვინო|ფასი|რესტორანი|გაქვთ|კერძი)/.test(translatedQuestion)) {
            // თუ კონკრეტული ვერ იპოვა, მაგრამ მენიუზეა საუბარი
            response = "ჩვენთან ბევრი გემრიელი რამაა: ხინკალი, მწვადი, სალათები... მენიუში ყველაფერი დეტალურადაა! 🍷";
        } else {
            // ზოგადი კითხვებისთვის ვიკიპედია
            try {
                const wikiRes = await fetch(`https://ka.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(translatedQuestion.trim())}`);
                const wikiData = await wikiRes.json();
                response = wikiData.extract ? wikiData.extract + " 🍷" : "საინტერესო კითხვაა! მაგაზე ერთი ჭიქა ღვინის მერე ვისაუბროთ. 🍷";
            } catch (e) {
                response = "გელა ვარ, სომელიე. მენიუზე მკითხე რამე და ყველაფერს გეტყვი! 🍷";
            }
        }

        const transBack = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=ka&tl=${detectedLang}&dt=t&q=${encodeURIComponent(response)}`);
        const finalData = await transBack.json();
        return finalData[0][0][0];

    } catch (error) {
        return "უი, ცოტა დავიბენი... 🍷";
    }
};