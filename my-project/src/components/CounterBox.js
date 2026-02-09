import React from 'react';

const CounterBox = ({ label, count, colorClass, gender, updateCount }) => {
  return (
    <div className="flex flex-col items-center">
      <span className={`text-xs font-bold label-text mb-2 tracking-widest ${colorClass === 'status-negative' ? 'text-blue-400' : 'text-red-400'}`}>
        {label}
      </span>
      <div className="tv-screen-container scale-90 md:scale-100">
        <div className="tv-flicker-overlay"></div>
        <div className={`digital-display ${count > 0 ? colorClass : 'status-zero'} text-6xl md:text-7xl select-none`}>
          {count}
        </div>
      </div>
      <div className="flex gap-2 mt-4 w-full">
        <button 
          onClick={() => updateCount(gender, -1)}
          className="control-btn flex-1 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-bold text-xl border-b-4 border-slate-900"
        >
          -
        </button>
        <button 
          onClick={() => updateCount(gender, 1)}
          className={`control-btn flex-1 ${gender === 'male' ? 'bg-blue-600 border-blue-900' : 'bg-red-600 border-red-900'} text-white py-2 rounded-lg font-bold text-xl border-b-4`}
        >
          +
        </button>
      </div>
    </div>
  );
};

export default CounterBox;