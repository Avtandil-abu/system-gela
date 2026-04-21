import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { askAI } from '../services/aiService';
import { motion, AnimatePresence } from 'framer-motion';
import GelaWindow from './GelaWindow'; // ახალ ფაილს ეხლავე შევქმნით

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [menuData, setMenuData] = useState('');
    const [showHint, setShowHint] = useState(false);

    // 1. მენიუს წამოღება ბაზიდან
    useEffect(() => {
        const fetchMenu = async () => {
            const { data } = await supabase.from('restaurant_info').select('content').single();
            if (data) setMenuData(data.content);
        };
        fetchMenu();
    }, []);

    // 2. პატარა მინიშნების გამოჩენა 5 წამის შემდეგ
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isOpen) setShowHint(true);
        }, 5000); // 5 წამში ამოხტება "კითხე გელას"

        // თუ ჩატი გაიხსნა, მინიშნება ვეღარ გამოჩნდება
        const hideTimer = setTimeout(() => {
            setShowHint(false);
        }, 12000); // 12 წამში გაქრება თავისით

        return () => {
            clearTimeout(timer);
            clearTimeout(hideTimer);
        };
    }, [isOpen]);

    // 3. მესიჯის გაგზავნა
    const sendMessage = async (question) => {
        const userMessage = { id: Date.now(), text: question, role: 'user' };
        setMessages(prev => [...prev, userMessage]);

        try {
            const aiResponse = await askAI(question, menuData, messages);
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
            {/* 🍷 CHAT BUTTON (THE FLOATING WINE GLASS) */}
            <div className="fixed bottom-6 right-6 z-50 flex items-center gap-4">

                {/* ანიმირებული მინიშნება (Tooltip) */}
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

                {/* ანიმირებული ღილაკი (ჭიქა) */}
                <motion.button
                    onClick={() => {
                        setIsOpen(!isOpen);
                        setShowHint(false);
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
                    // დააკვირდი ამ ახალ კლასებს: will-change-transform და isolate
                    className={`relative w-16 h-16 rounded-full shadow-2xl transition-colors duration-500 will-change-transform isolate ${isOpen ? 'bg-slate-800' : 'bg-rose-600'
                        }`}
                    style={{ transformOrigin: 'center center', backfaceVisibility: 'hidden' }}
                >
                    {/* ✕ და 🍷 - ორივე აბსოლუტურად ცენტრშია, რომ ადგილიდან არ დაიძრან */}
                    <span className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
                        {isOpen ? (
                            <span className="text-white text-2xl font-light">✕</span>
                        ) : (
                            // 🍷 აქ ზის როგორც ჩვეულებრივი სიმბოლო, ყოველგვარი motion-ის გარეშე
                            <span className="text-3xl leading-none" style={{ transform: 'translateZ(0)' }}>
                                🍷
                            </span>
                        )}
                    </span>
                </motion.button>
            </div>

            {/* 🖥️ CHAT WINDOW (GELA WINDOW) - დაცული ანიმაციით */}
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