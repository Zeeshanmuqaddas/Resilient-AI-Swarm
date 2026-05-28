import React from 'react';
import { ProviderHealth } from '../types';
import { cn } from '../lib/utils';
import { ServerCrash, CheckCircle2, AlertTriangle } from 'lucide-react';

export function ProviderHealthPanel({ providers }: { providers: ProviderHealth[] }) {
  return (
    <div className="glass-panel rounded-lg p-4 flex flex-col h-full">
       <h2 className="text-sm font-mono tracking-widest text-[#00ff66] uppercase mb-4 glow-text-green">
         LLM Gateway Status
       </h2>
       
       <div className="space-y-3 flex-1 overflow-y-auto pr-2">
         {providers.map((p) => (
           <div 
             key={p.id} 
             className={cn(
               "flex items-center justify-between p-3 rounded border bg-black/40 transition-colors",
               p.active ? "border-[#00f3ff] shadow-[inset_0_0_10px_rgba(0,243,255,0.2)]" : "border-[var(--color-cyber-border)]",
               p.status === 'offline' && "opacity-50 grayscale"
             )}
           >
             <div className="flex items-center gap-3">
                {p.status === 'online' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                {p.status === 'degraded' && <AlertTriangle className="w-4 h-4 text-yellow-400 animate-pulse" />}
                {p.status === 'offline' && <ServerCrash className="w-4 h-4 text-red-500" />}
                
                <div className="flex flex-col">
                  <span className={cn("font-mono text-sm", p.active ? "text-white font-bold" : "text-gray-400")}>
                    {p.name}
                  </span>
                  <span className="text-[10px] text-gray-500 font-mono tracking-wider uppercase">
                    {p.active ? 'Active Primary Route' : (p.status === 'offline' ? 'Fenced/Quarantined' : 'Warm Standby')}
                  </span>
                </div>
             </div>
             
             <div className="flex flex-col items-end gap-1 font-mono text-xs">
                <div className="flex items-center gap-2">
                   <span className="text-gray-500">LATENCY</span>
                   <span className={cn(
                     p.latency < 200 ? 'text-green-400' : p.latency < 500 ? 'text-yellow-400' : 'text-red-400'
                   )}>
                     {p.status === 'offline' ? '---' : `${p.latency}ms`}
                   </span>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-gray-500">SUCCESS</span>
                   <span className={cn(
                     p.successRate > 99 ? 'text-green-400' : 'text-orange-400'
                   )}>
                     {p.status === 'offline' ? '0.0%' : `${p.successRate}%`}
                   </span>
                </div>
             </div>
           </div>
         ))}
       </div>
    </div>
  );
}
