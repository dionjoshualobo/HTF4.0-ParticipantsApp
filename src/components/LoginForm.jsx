import React from 'react';
import logo from '../../HackToFuture4.0 Assests/htf4Title.png';

export default function LoginForm({ onLogin }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin();
  };

  return (
    <main className="relative z-10 min-h-screen flex items-center justify-center p-6 md:p-12">
      {/* Login Container */}
      <div className="w-full max-w-lg bg-surface border-4 border-black p-8 md:p-12 relative drop-block rounded-3xl z-10">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-10 relative">
          <img 
            alt="Hack to Future Logo" 
            className="h-auto max-w-[280px] relative z-10" 
            src={logo} 
          />
        </div>

        {/* Form */}
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Input Fields */}
          <div className="space-y-6">
            <div className="relative">
              <label className="block font-headline font-black uppercase text-lg mb-1 italic tracking-tight">
                Team ID
              </label>
              <input 
                className="w-full bg-white border-4 border-black px-4 py-3 font-body font-bold text-lg focus:outline-none focus:border-primary transition-colors placeholder:text-outline-variant rounded-xl" 
                placeholder="T-042-ALPHA" 
                type="text" 
              />
            </div>
            <div className="relative">
              <label className="block font-headline font-black uppercase text-lg mb-1 italic tracking-tight">
                Password
              </label>
              <input 
                className="w-full bg-white border-4 border-black px-4 py-3 font-body font-bold text-lg focus:outline-none focus:border-primary transition-colors placeholder:text-outline-variant rounded-xl" 
                placeholder="••••••••" 
                type="password" 
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 pt-4">
            <button 
              className="w-full bg-primary-container text-on-primary-container border-4 border-black py-4 px-6 font-headline font-black text-2xl uppercase italic tracking-wider hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all drop-block active:scale-95 rounded-2xl" 
              type="submit"
            >
              LOGIN!
            </button>
          </div>
        </form>

        {/* Need Help Button */}
        <div className="mt-8 text-center flex justify-center">
          <button 
            className="bg-surface-variant text-on-surface border-4 border-black py-2 px-6 font-headline font-black text-xl uppercase italic tracking-wider hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all drop-block active:scale-95 rounded-xl"
            type="button"
          >
            Need Help?
          </button>
        </div>
      </div>
    </main>
  );
}
