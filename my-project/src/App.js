import React, { useState, useEffect, useLayoutEffect } from 'react';
import './styles/App.css'; // import ไฟล์ CSS จากโฟลเดอร์ styles
import CounterBox from './components/CounterBox'; // import จากโฟลเดอร์ components
import BackgroundAnimation from './components/BackgroundAnimation'; // import จากโฟลเดอร์ components

const App = () => {
  // --- State เช็คความพร้อมของ Tailwind ---
  const [isReady, setIsReady] = useState(false);

  useLayoutEffect(() => {
    const checkTailwind = () => {
      if (window.tailwind) setIsReady(true);
      else setTimeout(checkTailwind, 10);
    };
    checkTailwind();
  }, []);

  // --- Logic หลัก ---
  const [maleCount, setMaleCount] = useState(() => {
    try { const saved = localStorage.getItem('maleCount'); return saved ? parseInt(saved) : 0; } catch (e) { return 0; }
  });
  const [femaleCount, setFemaleCount] = useState(() => {
    try { const saved = localStorage.getItem('femaleCount'); return saved ? parseInt(saved) : 0; } catch (e) { return 0; }
  });
  const [history, setHistory] = useState(() => {
    try { const saved = localStorage.getItem('visitorHistory'); return saved ? JSON.parse(saved) : []; } catch (e) { return []; }
  });
  const [showModal, setShowModal] = useState(false);
  const [modalConfig, setModalConfig] = useState({ title: '', message: '', onConfirm: null });

  useEffect(() => {
    try { localStorage.setItem('maleCount', maleCount); localStorage.setItem('femaleCount', femaleCount); } catch (e) {}
  }, [maleCount, femaleCount]);

  const updateCount = (gender, amount) => {
    if (gender === 'male') setMaleCount(prev => Math.max(0, prev + amount));
    else setFemaleCount(prev => Math.max(0, prev + amount));
  };

  const resetCount = () => {
    setModalConfig({
      title: 'RESET COUNTER',
      message: 'ยืนยันการรีเซ็ตจำนวนผู้ใช้บริการทั้งหมดเป็น 0 หรือไม่?',
      onConfirm: () => { setMaleCount(0); setFemaleCount(0); }
    });
    setShowModal(true);
  };

  const saveRecord = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dateString = now.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
    const newRecord = { id: Date.now(), male: maleCount, female: femaleCount, total: maleCount + femaleCount, time: timeString, date: dateString };
    const updatedHistory = [newRecord, ...history].slice(0, 50);
    setHistory(updatedHistory);
    try { localStorage.setItem('visitorHistory', JSON.stringify(updatedHistory)); } catch (e) {}
  };

  const clearHistory = () => {
    setModalConfig({
      title: 'CLEAR HISTORY',
      message: 'ลบประวัติการบันทึกทั้งหมดใช่หรือไม่?',
      onConfirm: () => { setHistory([]); try { localStorage.removeItem('visitorHistory'); } catch (e) {} }
    });
    setShowModal(true);
  };

  // --- Render หน้าจอ ---
  return (
    <>
      {!isReady && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: '#1a1a1a', color: '#fff', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999, fontFamily: 'sans-serif', letterSpacing: '2px' }}>
          LOADING SYSTEM...
        </div>
      )}

      <div 
        className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-center p-4 font-['Kanit'] text-white relative overflow-hidden"
        style={{ visibility: isReady ? 'visible' : 'hidden' }} 
      >
        <BackgroundAnimation />

        <div className="w-full max-w-2xl relative z-10">
          <div className="scoreboard-frame p-6 mb-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>

            <header className="internal-header">
              <h1 className="text-white text-5xl font-['Teko'] text-center uppercase tracking-wider">SERVICE COUNTER</h1>
              <p className="text-slate-400 text-center text-xs tracking-[0.2em] mb-6">MALE & FEMALE MONITORING SYSTEM</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <CounterBox label="MALE (ชาย)" count={maleCount} colorClass="status-negative" gender="male" updateCount={updateCount} />
              <CounterBox label="FEMALE (หญิง)" count={femaleCount} colorClass="status-positive" gender="female" updateCount={updateCount} />
            </div>

            <div className="border-t border-slate-700 pt-6 mt-2">
              <div className="text-center mb-4">
                 <span className="text-yellow-500 font-['Teko'] text-2xl tracking-widest">TOTAL: {maleCount + femaleCount}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={resetCount} className="control-btn bg-slate-800 hover:bg-slate-700 text-white py-3 rounded-lg font-bold uppercase text-sm border-b-4 border-black tracking-wider transition-all">
                  Reset <div className="text-[10px] opacity-70 font-light">ล้างค่า</div>
                </button>
                <button onClick={saveRecord} className="control-btn bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg font-bold uppercase text-sm border-b-4 border-emerald-900 tracking-wider transition-all">
                  Save Log <div className="text-[10px] opacity-70 font-light">บันทึกข้อมูล</div>
                </button>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-xl p-4 text-slate-300 shadow-lg relative z-20 bg-[#1a1a1a]/80">
            <div className="flex justify-between items-end mb-3 border-b border-slate-700 pb-2">
              <h2 className="text-xl font-bold label-text text-yellow-400">VISITOR LOGS <span className="text-xs text-slate-500 ml-2 font-sans">(ประวัติ)</span></h2>
              <button onClick={clearHistory} className="text-xs text-slate-500 hover:text-red-400 underline">Clear All</button>
            </div>
            <div className="overflow-hidden">
              <div className="grid grid-cols-4 text-[10px] md:text-xs text-slate-500 font-bold mb-2 uppercase tracking-wider text-center">
                <div>DateTime</div><div>Male</div><div>Female</div><div>Total</div>
              </div>
              <ul className="log-container h-48 overflow-y-auto space-y-2 pr-1">
                {history.map(record => (
                  <li key={record.id} className="bg-slate-800/50 rounded p-2 grid grid-cols-4 items-center text-center border-l-2 border-blue-500 animate-highlight">
                    <div className="flex flex-col"><span className="text-white font-mono text-[10px] md:text-sm">{record.time}</span><span className="text-[9px] text-slate-400">{record.date}</span></div>
                    <div className="font-['Orbitron'] text-blue-400 text-lg">{record.male}</div>
                    <div className="font-['Orbitron'] text-red-400 text-lg">{record.female}</div>
                    <div className="font-['Orbitron'] text-yellow-400 text-xl font-bold">{record.total}</div>
                  </li>
                ))}
                 {history.length === 0 && <li className="text-center text-slate-600 text-sm py-4 italic">ยังไม่มีข้อมูลการบันทึก</li>}
              </ul>
            </div>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-slate-800 border border-slate-600 p-6 rounded-xl max-w-xs w-full shadow-2xl relative z-50">
              <h3 className="text-xl font-bold text-white mb-2 font-['Teko'] tracking-wide text-center uppercase">{modalConfig.title}</h3>
              <p className="text-slate-300 mb-6 text-center text-sm">{modalConfig.message}</p>
              <div className="flex space-x-3">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2 rounded bg-slate-700 text-white hover:bg-slate-600 text-sm font-bold">ยกเลิก</button>
                <button onClick={() => { modalConfig.onConfirm(); setShowModal(false); }} className="flex-1 py-2 rounded bg-red-600 text-white hover:bg-red-500 text-sm font-bold">ยืนยัน</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default App;