import React from 'react';
import { Activity, ShieldAlert, Zap, Server, LogOut, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { ProviderHealth } from '../types';

interface HeaderProps {
  providers: ProviderHealth[];
  userEmail: string;
  onLogout: () => void;
}

export function Header({ providers, userEmail, onLogout }: HeaderProps) {
  const activeProvider = providers.find(p => p.active);
  const sysHealth = providers.some(p => p.status === 'offline') ? 'DEGRADED' : 'NOMINAL';

  return (
    <header className="glass-panel p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--color-cyber-border)]">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-10 h-10 rounded bg-[#00f3ff]/10 border border-[#00f3ff]/50 shrink-0">
          <Activity className="w-6 h-6 text-[#00f3ff]" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-widest glow-text-blue uppercase text-[#00f3ff]">HERMES RESILIENCE-X</h1>
          <div className="text-xs font-mono text-gray-400 flex gap-4 mt-1">
            <span className="flex items-center gap-1"><Server className="w-3 h-3" /> TF-GATEWAY-1</span>
            <span className={cn("flex items-center gap-1", sysHealth === 'NOMINAL' ? 'text-green-400' : 'text-red-400')}>
               <ShieldAlert className="w-3 h-3" /> {sysHealth}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-end md:items-center gap-6">
         <div className="flex flex-col items-end md:items-start hidden sm:flex">
            <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Active Route</span>
            <div className="flex items-center gap-2">
               <Zap className={cn("w-4 h-4", activeProvider?.status === 'online' ? 'text-green-400' : 'text-yellow-400')} />
               <span className="font-mono text-sm tracking-wide text-white">{activeProvider?.name || 'ROUTING_ERROR'}</span>
            </div>
         </div>
         
         <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-gray-800 rounded text-xs font-mono">
               <User className="w-4 h-4 text-gray-500" />
               <span className="text-gray-300 hidden sm:block">{userEmail}</span>
            </div>
            
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded text-xs font-mono uppercase tracking-widest transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Disconnect</span>
            </button>
         </div>
      </div>
    </header>
  );
}
