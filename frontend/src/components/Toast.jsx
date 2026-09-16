import React, { useState, useEffect } from 'react';

let toastCounter = 0;
let addToastFn = null;

export const toast = {
  success: (message) => addToastFn && addToastFn({ id: ++toastCounter, message, type: 'success' }),
  error: (message) => addToastFn && addToastFn({ id: ++toastCounter, message, type: 'error' }),
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    addToastFn = (toastItem) => {
      setToasts((prev) => [...prev, toastItem]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toastItem.id));
      }, 3000);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div 
          key={t.id} 
          className={`px-4 py-3 rounded shadow-lg text-white font-medium transition-all ${t.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
};
