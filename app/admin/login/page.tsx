'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Coffee } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePinInput = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError('');
      if (newPin.length === 4) {
        verifyPin(newPin);
      }
    }
  };

  const handlePinDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError('');
  };

  const verifyPin = (enteredPin: string) => {
    setLoading(true);
    setError('');
    setTimeout(() => {
      // PIN requirement: 2002
      if (enteredPin === '2002') {
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'aperitivo_admin_session',
            JSON.stringify({
              type: 'pin',
              email: 'staff@barfranca.it',
              token: 'pin-session-' + Date.now(),
              loginAt: new Date().toISOString(),
            })
          );
        }
        router.push('/admin');
      } else {
        setError('PIN errato.');
        setPin('');
        setLoading(false);
      }
    }, 300);
  };

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl overflow-hidden p-8 space-y-8">
        {/* Minimal Header */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-aperitivo-spritz to-aperitivo-vermilion flex items-center justify-center text-white mx-auto shadow-md shadow-aperitivo-spritz/20">
            <Coffee className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold font-serif text-white tracking-tight">
            Bar Franca Admin
          </h1>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-2.5 bg-rose-950/80 border border-rose-800 rounded-xl text-rose-300 text-xs font-bold text-center animate-fadeIn">
            {error}
          </div>
        )}

        {/* Minimal Keypad */}
        <div className="space-y-6">
          {/* PIN Dots */}
          <div className="flex items-center justify-center gap-4 py-2">
            {[0, 1, 2, 3].map((idx) => (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full border-2 transition-all ${
                  pin.length > idx
                    ? 'bg-aperitivo-spritz border-aperitivo-spritz scale-110 shadow-xs'
                    : 'border-stone-700 bg-stone-950'
                }`}
              />
            ))}
          </div>

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-3">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => handlePinInput(num)}
                disabled={loading}
                className="h-14 rounded-2xl bg-stone-800/90 hover:bg-stone-700 active:bg-stone-600 text-white text-xl font-bold transition-all shadow-2xs active:scale-95"
              >
                {num}
              </button>
            ))}
            <div />
            <button
              type="button"
              onClick={() => handlePinInput('0')}
              disabled={loading}
              className="h-14 rounded-2xl bg-stone-800/90 hover:bg-stone-700 active:bg-stone-600 text-white text-xl font-bold transition-all shadow-2xs active:scale-95"
            >
              0
            </button>
            <button
              type="button"
              onClick={handlePinDelete}
              disabled={loading}
              className="h-14 rounded-2xl bg-stone-950 hover:bg-stone-800 text-stone-400 hover:text-white text-xs font-bold transition-all active:scale-95"
            >
              Cancella
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
