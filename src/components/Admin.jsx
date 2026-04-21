import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = ["სალათები", "ცხელი კერძები", "ხორცეული", "ცომეული", "ღვინო", "სასმელები", "ზოგადი ინფო"];

export default function Admin() {
    const [session, setSession] = useState(null);
    const [email, setEmail] = useState(localStorage.getItem('adminEmail') || '');
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState(null);
    const [menuData, setMenuData] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => setSession(session));
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (session) {
            const fetchMenu = async () => {
                const { data } = await supabase.from('restaurant_info').select('content').single();
                if (data) {
                    try {
                        setMenuData(JSON.parse(data.content));
                    } catch (e) {
                        setMenuData({ "ზოგადი ინფო": data.content });
                    }
                }
            };
            fetchMenu();
        }
    }, [session]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            setMessage('შეცდომა: არასწორი მონაცემები ❌'); // აქ ქართულად დავაწეროთ
            setTimeout(() => setMessage(''), 3000);
        } else {
            localStorage.setItem('adminEmail', email);
            setSession(data.session);
            setMessage(''); // წარმატებისას ვასუფთავებთ
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setPassword('');
        setActiveTab(null);
    };

    const handleUpdate = async (category) => {
        setLoading(true);
        const { error } = await supabase
            .from('restaurant_info')
            .update({ content: JSON.stringify(menuData) })
            .eq('id', 1);

        if (!error) {
            setMessage(`${category} განახლდა! ✅`);
            setTimeout(() => setMessage(''), 3000);
        }
        setLoading(false);
    };

    // --- 1. ლოგინის გვერდი (არაავტორიზებული) ---
    if (!session) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6">
                {/* უკან დაბრუნების ლინკი */}
                <Link to="/" className="mb-8 text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-2 text-sm font-medium">
                    ← მთავარ გვერდზე დაბრუნება
                </Link>

                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleLogin}
                    className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-white/10 w-full max-w-md shadow-2xl"
                >
                    <h2 className="text-3xl font-black text-rose-500 mb-8 text-center tracking-tighter uppercase">GELA ADMIN</h2>
                    <input
                        type="email" placeholder="ელ-ფოსტა" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-4 mb-4 bg-slate-800/50 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 ring-rose-500 transition-all"
                    />
                    <input
                        type="password" placeholder="პაროლი" value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-4 mb-8 bg-slate-800/50 border border-white/5 rounded-2xl text-white outline-none focus:ring-2 ring-rose-500 transition-all"
                    />
                    <button className="w-full bg-rose-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-rose-500/20 active:scale-95 transition-all">
                        {loading ? 'შედის...' : 'შესვლა'}
                    </button>
                    {message && <p className="mt-4 text-rose-400 text-center text-sm">{message}</p>}
                </motion.form>
            </div>
        );
    }

    // --- 2. მართვის პანელი (ავტორიზებული) ---
    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-300 p-6 md:p-12">
            <div className="max-w-3xl mx-auto">
                <header className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-4">
                        {/* პატარა ღილაკი საიტზე სწრაფად გადასასვლელად */}
                        <Link to="/" className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-full hover:bg-white/10 transition-all text-slate-400">
                            ←
                        </Link>
                        <h1 className="text-4xl font-black text-white tracking-tighter">გელას <span className="text-rose-500">პულტი</span></h1>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-slate-500 hover:text-white transition-colors flex items-center gap-2"
                    >
                        გამოსვლა ✕
                    </button>
                </header>

                <div className="space-y-4">
                    {CATEGORIES.map((cat, index) => (
                        <div key={cat} className="overflow-hidden">
                            <motion.button
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => setActiveTab(activeTab === cat ? null : cat)}
                                className={`w-full flex justify-between items-center p-6 rounded-2xl border transition-all ${activeTab === cat
                                    ? 'bg-rose-500/10 border-rose-500/30 text-white'
                                    : 'bg-slate-900/40 border-white/5 text-slate-400 hover:bg-white/5'
                                    }`}
                            >
                                <span className="text-lg font-bold uppercase tracking-wider">{cat}</span>
                                <motion.span
                                    animate={{ rotate: activeTab === cat ? 180 : 0 }}
                                    className="text-rose-500"
                                >
                                    ▼
                                </motion.span>
                            </motion.button>

                            <AnimatePresence>
                                {activeTab === cat && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="bg-slate-900/20 border-x border-b border-white/5 rounded-b-2xl px-4 pb-6"
                                    >
                                        <textarea
                                            value={menuData[cat] || ''}
                                            onChange={(e) => setMenuData({ ...menuData, [cat]: e.target.value })}
                                            className="w-full h-64 bg-transparent p-4 text-slate-300 outline-none font-mono text-sm leading-relaxed resize-none border-t border-white/5"
                                            placeholder={`${cat}-ს სია...`}
                                        />
                                        <div className="flex justify-between items-center mt-4 px-2">
                                            <span className="text-xs text-slate-600 italic">ბოლოს განახლდა: ახლახანს</span>
                                            <button
                                                onClick={() => handleUpdate(cat)}
                                                className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-rose-500/20 transition-all"
                                            >
                                                {loading ? 'ინახება...' : 'შენახვა'}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>

                {message && !message.includes('შეცდომა') && (
                    <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-green-500 text-white px-8 py-3 rounded-full font-bold shadow-2xl z-50"
                    >
                        {message}
                    </motion.div>
                )}
            </div>
        </div>
    );
}