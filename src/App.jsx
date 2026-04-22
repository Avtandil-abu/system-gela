import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatWidget from './components/ChatWidget';
import Admin from './components/Admin';
import gelaLogo from './assets/gela-clean-final.png';

function App() {
  return (
    <Router>
      <div className="h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-rose-500/30 overflow-hidden relative flex flex-col">

        {/* ფონის დეკორაციები */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-rose-900/10 blur-[120px]"></div>
          <div className="absolute bottom-[0%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[120px]"></div>
        </div>

        <Routes>
          <Route path="/" element={
            <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 text-center">

              <header className="animate-in fade-in zoom-in duration-1000 flex flex-col items-center pt-2">

                {/* გელას მასკოტი - უფრო კომპაქტური */}
                <div className="relative flex flex-col items-center mb-2">
                  <img
                    src={gelaLogo}
                    alt="Gela Mascot"
                    className="w-32 md:w-48 h-auto animate-float drop-shadow-[0_10px_30px_rgba(255,255,255,0.05)]"
                  />

                  <div className="mt-[-10px] flex flex-col items-center">
                    <h2 className="text-2xl md:text-3xl font-black tracking-[0.2em] text-white uppercase">
                      SYSTEM GELA
                    </h2>
                    <p className="text-[8px] md:text-[10px] font-bold tracking-[0.4em] text-slate-400 uppercase mt-1">
                      შენი პირადი სომელიე
                    </p>
                  </div>
                </div>

                {/* მთავარი სახელი: GE-MRIELI */}
                <h1 className="text-5xl md:text-7xl font-black text-white mt-4 mb-4 tracking-tighter uppercase">
                  GE-<span className="text-rose-600">MRIELI</span>
                </h1>

                <p className="max-w-xl mx-auto text-lg md:text-xl text-slate-400 font-light leading-relaxed mb-6">
                  პერსონალური AI ასისტენტი თქვენი რესტორნისთვის. <br />
                  <span className="text-slate-500 font-normal">დასვით კითხვა და მიიღეთ მყისიერი პასუხი.</span>
                </p>

                <button
                  onClick={() => window.location.href = '/admin'}
                  className="px-8 py-4 bg-white text-slate-900 rounded-full font-black hover:scale-105 active:scale-95 transition-all shadow-xl cursor-pointer uppercase tracking-widest"
                >
                  ადმინ პანელში შესვლა
                </button>
              </header>

              <ChatWidget />

              {/* ფუტერი - მინიმალური დაშორებით */}
              <footer className="mt-auto pb-4 text-slate-600 text-[9px] tracking-[0.3em] uppercase pointer-events-none opacity-40">
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