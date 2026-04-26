import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import GelaWindow from './GelaWindow';
import { askFakeAI } from '../services/fakeAiService';

export default function ChatWidget({ forceOpen, setForceOpen }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [menuData, setMenuData] = useState('');
    const [showHint, setShowHint] = useState(false);

    // 🧠 აქ ვინახავთ კონტექსტს, თუ რომელი განყოფილებიდან შემოვიდა კლიენტი
    const [activeCategory, setActiveCategory] = useState(null);

    // 🎯 მენიუს ღილაკიდან გამოძახების ლოგიკა
    useEffect(() => {
        if (forceOpen) {
            setIsOpen(true);
            setShowHint(false);
            // ვინახავთ კატეგორიას (მაგ: "ღვინო"), რომ გელამ იცოდეს რაზე ვსაუბრობთ
            setActiveCategory(forceOpen);
            if (setForceOpen) setForceOpen(false);
        }
    }, [forceOpen, setForceOpen]);

    // 1. მენიუს წამოღება ბაზიდან
    useEffect(() => {
        const fetchMenu = async () => {
            const { data } = await supabase.from('restaurant_info').select('content').single();
            if (data) setMenuData(data.content);
        };
        fetchMenu();
    }, []);

    // 2. პატარა მინიშნების გამოჩენა (შენი ტაიმერები)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isOpen) setShowHint(true);
        }, 5000);

        const hideTimer = setTimeout(() => {
            setShowHint(false);
        }, 12000);

        return () => {
            clearTimeout(timer);
            clearTimeout(hideTimer);
        };
    }, [isOpen]);

    // 3. მესიჯის გაგზავნა (გელას ვაწვდით კონტექსტს)
    const sendMessage = async (question) => {
        const userMessage = { id: Date.now(), text: question, role: 'user' };
        setMessages(prev => [...prev, userMessage]);

        try {
            // 🍷 აი აქ გადაეცემა activeCategory, რომ გელა აღარ დაიბნეს
            const aiResponse = await askFakeAI(question, menuData, activeCategory);
            const botMessage = { id: Date.now() + 1, text: aiResponse, role: 'bot' };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("AI Error:", error);
            const errorMessage = { id: Date.now() + 1, text: "უი, ცოტა დავიბენი... 🍷", role: 'bot' };
            setMessages(prev => [...prev, errorMessage]);
        }
    };

    return (
        <>
            {/* 🍷 CHAT BUTTON (ყველა შენი სპეციფიკური კლასით) */}
            <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4">

                <AnimatePresence>
                    {showHint && !isOpen && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, x: 20 }}
                            animate={{ opacity: 1, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.8, x: 20 }}
                            className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl border border-white/10 text-sm font-medium tracking-wide"
                        >
                            კითხე გელას 🍷
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    onClick={() => {
                        setIsOpen(!isOpen);
                        setShowHint(false);
                        // თუ ხელით ვაღებთ ჩატს, კონტექსტს ვასუფთავებთ
                        if (!isOpen) setActiveCategory(null);
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{
                        scale: isOpen ? 1 : [1, 1.04, 1],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                        times: [0, 0.5, 1]
                    }}
                    className={`relative w-16 h-16 rounded-full shadow-2xl transition-colors duration-500 will-change-transform isolate ${isOpen ? 'bg-slate-800' : 'bg-rose-600'
                        }`}
                    style={{ transformOrigin: 'center center', backfaceVisibility: 'hidden' }}
                >
                    <span className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
                        {isOpen ? (
                            <span className="text-white text-2xl font-light">✕</span>
                        ) : (
                            <span className="text-3xl leading-none" style={{ transform: 'translateZ(0)' }}>
                                🍷
                            </span>
                        )}
                    </span>
                </motion.button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <GelaWindow
                        messages={messages}
                        onSendMessage={sendMessage}
                        onClose={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}