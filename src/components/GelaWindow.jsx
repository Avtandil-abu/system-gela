import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GelaWindow({ messages, onSendMessage, onClose }) {
    const [input, setInput] = useState('');
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        onSendMessage(input);
        setInput('');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-[90vw] md:w-[420px] h-[600px] max-h-[75vh] bg-slate-950/90 backdrop-blur-3xl border border-amber-500/20 rounded-[32px] shadow-[0_20px_60px_rgba(0,0,0,0.7)] z-50 flex flex-col overflow-hidden"
        >
            {/* Header - მოოქროსფრო აქცენტებით */}
            <div className="p-6 border-b border-white/5 bg-gradient-to-r from-amber-500/10 to-transparent flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-xl shadow-lg">
                        🍷
                    </div>
                    <div>
                        <h3 className="font-bold text-amber-100 tracking-tight text-lg leading-none italic">სისტემა გელა</h3>
                        <p className="text-[10px] text-amber-500/60 uppercase tracking-[0.2em] mt-1 font-bold">Sommelier AI</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-amber-500/50 hover:text-amber-400 transition-colors p-2">✕</button>
            </div>

            {/* Messages Area - თბილი ფერები */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[85%] p-4 rounded-2xl text-[15px] leading-relaxed ${msg.role === 'user'
                                ? 'bg-amber-500/10 border border-amber-500/20 text-amber-100 rounded-tr-none'
                                : 'bg-slate-800/40 border border-white/5 text-amber-50/80 rounded-tl-none font-light'
                            }`}>
                            {msg.text}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Input Area - რბილი კონტრასტი */}
            <form onSubmit={handleSubmit} className="p-5 bg-black/20 border-t border-white/5">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="ჰკითხე რამე გელას..."
                        className="w-full bg-slate-900/50 border border-amber-500/10 text-amber-50 pl-5 pr-14 py-4 rounded-2xl outline-none focus:ring-1 ring-amber-500/30 transition-all placeholder:text-slate-600"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="absolute right-2 p-3 text-amber-500 hover:text-amber-400 transition-all disabled:opacity-30"
                    >
                        <svg className="w-6 h-6 rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </form>
        </motion.div>
    );
}