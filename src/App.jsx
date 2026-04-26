import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatWidget from './components/ChatWidget';
import Admin from './components/Admin';
import gelaLogo from './assets/gela-clean-final.png';
import { supabase } from './supabaseClient';

function App() {
  const [menuData, setMenuData] = useState({});
  const [openCategory, setOpenCategory] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false); // ჩატის გახსნის სთეითი

  useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await supabase
        .from('restaurant_info')
        .select('content')
        .limit(1);

      if (data && data.length > 0) {
        let rawData = data[0].content;
        setMenuData(typeof rawData === 'string' ? JSON.parse(rawData) : rawData);
      }
    };
    fetchMenu();
  }, []);

  // ფუნქცია, რომელიც ხსნის ჩატს და შესაძლოა კითხვასაც აგზავნის
  const handleAskGela = (category) => {
    setIsChatOpen(true);
    // აქ შეგვიძლია დავამატოთ ლოგიკა, რომ ჩატში ავტომატურად ჩაიწეროს კითხვა
    console.log(`გელას ვეკითხებით ${category}-ზე`);
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-rose-500/30 overflow-y-auto relative flex flex-col">

        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-rose-900/10 blur-[120px]"></div>
          <div className="absolute bottom-[0%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[120px]"></div>
        </div>

        <Routes>
          <Route path="/" element={
            <div className="relative z-10 flex flex-col items-center p-4 text-center">

              <header className="animate-in fade-in zoom-in duration-1000 flex flex-col items-center pt-10 mb-10">
                <div className="relative flex flex-col items-center mb-2">
                  <img src={gelaLogo} alt="Gela Mascot" className="w-32 md:w-40 h-auto animate-float" />
                  <div className="mt-[-10px] flex flex-col items-center text-white uppercase font-black">
                    <h2 className="text-2xl md:text-3xl tracking-[0.2em]">SYSTEM GELA</h2>
                    <p className="text-[8px] md:text-[10px] tracking-[0.4em] text-slate-400 mt-1">შენი პირადი სომელიე</p>
                  </div>
                </div>

                <h1 className="text-5xl md:text-7xl font-black text-white mt-4 mb-4 tracking-tighter uppercase">
                  GE-<span className="text-rose-600">MRIELI</span>
                </h1>

                <p className="max-w-xl mx-auto text-lg md:text-xl text-slate-400 font-light mb-6 px-4 leading-relaxed">
                  AI ასისტენტი თქვენი რესტორნისთვის. <br />
                  <span className="text-slate-500 font-normal text-base italic">აირჩიეთ კატეგორია და გაესაუბრეთ გელას. 🍷</span>
                </p>

                <button
                  onClick={() => window.location.href = '/admin'}
                  className="px-6 py-2 bg-white/5 border border-white/10 text-white rounded-full text-[10px] font-bold hover:bg-white hover:text-slate-900 transition-all uppercase tracking-[0.2em]"
                >
                  ადმინ პანელი
                </button>
              </header>


              {/* 👇 მენიუს კონტეინერი - ახლა უკვე ექვსივე კატეგორიისთვის 👇 */}
              <div className="w-full max-w-2xl mx-auto space-y-4 mb-28 px-4 text-left relative z-20">
                {Object.entries(menuData).length > 0 ? (
                  Object.entries(menuData)
                    .filter(([category]) => category !== "ზოგადი ინფო") // მხოლოდ "ზოგადი ინფო"-ს ვმალავთ
                    .map(([category, items]) => (
                      <div key={category} className="group border border-white/10 rounded-2xl bg-slate-900/40 backdrop-blur-xl transition-all duration-300">

                        <button
                          onClick={() => setOpenCategory(openCategory === category ? null : category)}
                          className="w-full flex justify-between items-center p-5 sm:p-6"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 shadow-inner">
                              🍷
                            </div>
                            <h3 className="text-white font-bold uppercase tracking-[0.15em] text-xs sm:text-sm">
                              {category}
                            </h3>
                          </div>
                          <motion.span
                            animate={{ rotate: openCategory === category ? 180 : 0 }}
                            className="text-rose-500 text-[10px]"
                          >
                            ▼
                          </motion.span>
                        </button>

                        <AnimatePresence>
                          {openCategory === category && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="p-6 pt-0 border-t border-white/5">
                                <p className="text-slate-400 text-sm leading-relaxed mb-6 font-light mt-4 italic">
                                  {items.replace(/[{}""[\]]/g, '')}
                                </p>

                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                                  <p className="text-[9px] text-slate-500 uppercase tracking-widest font-medium">
                                    გელამ იცის ამ კერძების ისტორია
                                  </p>
                                  <button
                                    onClick={() => handleAskGela(category)}
                                    className="w-full sm:w-auto text-[10px] bg-rose-600 text-white px-6 py-2.5 rounded-full hover:bg-rose-500 transition-all font-black uppercase tracking-widest active:scale-95 shadow-lg shadow-rose-900/20"
                                  >
                                    ჰკითხე გელას 🍷
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))
                ) : (
                  <div className="text-center py-20 opacity-40 text-[10px] tracking-[0.4em] uppercase animate-pulse">
                    მენიუ იტვირთება...
                  </div>
                )}
              </div>

              {/* გადავცემთ ჩატს მართვის უფლებას */}
              <ChatWidget forceOpen={isChatOpen} setForceOpen={setIsChatOpen} />

              <footer className="pb-8 text-slate-600 text-[9px] tracking-[0.3em] uppercase opacity-30">
                &copy; 2026 Advanced AI Hospitality Solutions
              </footer>
            </div>
          } />

          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;