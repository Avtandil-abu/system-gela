// ვამატებთ მესამე პარამეტრს - activeCategory
export const askFakeAI = async (question, menuDataString, activeCategory = null) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const q = question.toLowerCase();

    let lang = "ka";
    if (/[a-zA-Z]/.test(q)) lang = "en";
    else if (/[а-яА-Я]/.test(q)) lang = "ru";

    let menuObj = {};
    try { menuObj = JSON.parse(menuDataString); } catch (e) { menuObj = { "მენიუ": menuDataString }; }

    const keywords = {
        salad: ["სალათ", "salad", "салат", "მწვანილ", "ცეზარ"],
        hot: ["ხარჩო", "ცხელ", "hot", "харчо", "სუპ", "ჩახოხბილი"],
        meat: ["ხინკალ", "ხორც", "meat", "хинкал", "мясо", "მწვადი", "ქაბაბი"], // "რომელი" ამოვაგდეთ!
        wine: ["ღვინ", "დალევ", "wine", "вино", "სასმელ", "საფერავი", "ხვანჭკარა"]
    };

    let foundCategory = null;

    // 1. ჯერ ვამოწმებთ, კითხვაში ხომ არ არის კონკრეტული კატეგორიის სახელი
    if (keywords.salad.some(k => q.includes(k))) foundCategory = "სალათები";
    else if (keywords.hot.some(k => q.includes(k))) foundCategory = "ცხელი კერძები";
    else if (keywords.meat.some(k => q.includes(k))) foundCategory = "ხორცეული";
    else if (keywords.wine.some(k => q.includes(k))) foundCategory = "ღვინო";

    // 2. 🌟 თუ კითხვაში კატეგორია ვერ იპოვა, მაგრამ გვაქვს კონტექსტი (activeCategory)
    if (!foundCategory && activeCategory) {
        foundCategory = activeCategory;
    }

    if (foundCategory && menuObj[foundCategory]) {
        let itemsRaw = menuObj[foundCategory].replace(/[{}""[\]]/g, '').trim();
        const itemsArray = itemsRaw.split(/\.|\n|;|,/).filter(item => item.trim().length > 3);

        // რჩევის ლოგიკა (აქ დავტოვეთ "რომელი")
        const isRecommendation = q.includes("მირჩიე") || q.includes("რომელი") || q.includes("კონკრეტულ");

        if (isRecommendation && itemsArray.length > 0) {
            const recommendation = itemsArray[Math.floor(Math.random() * itemsArray.length)].trim();
            return {
                ka: `ამ კატეგორიიდან საუკეთესო არჩევანია: ${recommendation}. 🍷`,
                en: `From this section, I'd recommend: ${recommendation}. 🍷`,
                ru: `Из этого раздела советую: ${recommendation}. 🍷`
            }[lang];
        }

        return {
            ka: `ამ განყოფილებაში გვაქვს: ${itemsRaw} 🍷`,
            en: `In this section we have: ${itemsRaw} 🍷`,
            ru: `В этом разделе у нас есть: ${itemsRaw} 🍷`
        }[lang];
    }

    return {
        ka: "საინტერესოა! მოდი მენიუს გადავხედოთ და რამე გემრიელი შეგარჩევინოთ. 🍷",
        en: "Let's check the menu together and find something delicious! 🍷",
        ru: "Давайте заглянем в меню и выберем что-нибудь вкусненькое! 🍷"
    }[lang];
};