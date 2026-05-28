import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email);
    } else {
      setError('Please enter both email and password.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      
      <div className="glass-panel w-full max-w-md p-8 rounded-xl border border-[#00f3ff]/30 shadow-2xl shadow-[#00f3ff]/10 relative z-10 flex flex-col items-center bg-black/60 backdrop-blur-md">
        <div className="w-16 h-16 rounded-full bg-[#00f3ff]/10 border border-[#00f3ff]/30 flex items-center justify-center mb-6">
          <Shield className="w-8 h-8 text-[#00f3ff]" />
        </div>
        
        <h2 className="text-2xl font-mono tracking-widest text-[#00f3ff] uppercase text-center glow-text-blue mb-1">
          HERMES RESILIENCE-X
        </h2>
        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-8">
          Enterprise Resilience Orchestrator
        </p>

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-xs font-mono p-3 rounded text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Agent Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operative@swarm.local"
                className="w-full bg-black/50 border border-gray-800 focus:border-[#00f3ff] rounded-lg py-3 pl-10 pr-4 text-sm font-mono text-gray-200 focus:outline-none transition-colors placeholder:text-gray-700"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">Passcode</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/50 border border-gray-800 focus:border-[#00f3ff] rounded-lg py-3 pl-10 pr-4 text-sm font-mono text-gray-200 focus:outline-none transition-colors placeholder:text-gray-700"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-4 flex items-center justify-center gap-3 bg-[#00f3ff]/20 hover:bg-[#00f3ff]/30 text-[#00f3ff] border border-[#00f3ff]/50 py-3 rounded-lg text-sm font-mono uppercase tracking-widest transition-colors h-12"
          >
            Authenticate
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
