
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatWidget from './components/ChatWidget';
import Admin from './components/Admin';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-rose-500/30 overflow-x-hidden">

        {/* ფონის დეკორაციები (რომელიც არ უშლის ხელს კლიკებს) */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-rose-900/10 blur-[120px]"></div>
          <div className="absolute bottom-[0%] -right-[10%] w-[40%] h-[40%] rounded-full bg-blue-900/10 blur-[120px]"></div>
        </div>

        <Routes>
          {/* მთავარი გვერდი */}
          <Route path="/" element={
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 text-center">

              <header className="animate-in fade-in zoom-in duration-1000">
                {/* სისტემის სახელი - დიდი ასოებით და გამოკვეთილად */}
                <div className="inline-block px-6 py-2 mb-8 text-sm font-black tracking-[0.3em] uppercase border-2 rounded-full border-rose-500 text-rose-500 bg-rose-500/5 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
                  სისტემა გელა • 2026
                </div>

                <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter">
                  GEL<span className="text-rose-600">MRIELI</span>
                </h1>

                <p className="max-w-2xl mx-auto text-xl text-slate-400 font-light leading-relaxed mb-12">
                  პერსონალური AI ასისტენტი თქვენი რესტორნისთვის. <br />
                  <span className="text-slate-500">დასვით კითხვა ნებისმიერ ენაზე და მიიღეთ მყისიერი პასუხი.</span>
                </p>

                {/* აქ დავამატე ერთი ლამაზი ღილაკი, რომ საიტი ცარიელი არ ჩანდეს */}
                <button
                  onClick={() => window.location.href = '/admin'}
                  className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:scale-105 transition-transform shadow-xl"
                >
                  ადმინ პანელში შესვლა
                </button>
              </header>

              {/* აი აქ არის ჩვენი ჩატი! ისევ თავის "ღილაკიან" ფორმაში */}
              <ChatWidget />

              <footer className="fixed bottom-8 text-slate-600 text-xs tracking-widest uppercase">
                &copy; 2026 Advanced AI Hospitality Solutions
              </footer>
            </div>
          } />

          {/* ადმინ პანელი */}
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;