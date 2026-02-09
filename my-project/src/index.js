import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// โหลด Tailwind CSS ทันทีที่ไฟล์นี้ทำงาน (แก้ปัญหาภาพแตก)
const script = document.createElement('script');
script.src = "https://cdn.tailwindcss.com";
document.head.appendChild(script);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);