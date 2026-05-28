import React from 'react';
import { AgentNode, ProviderHealth } from '../types';
import { cn } from '../lib/utils';
import { BrainCircuit, Route, Shield, Network, Cpu, Database, AlertOctagon, Flame } from 'lucide-react';

export function TopologyMap({ agents, providers, onTriggerFailure }: { agents: AgentNode[], providers?: ProviderHealth[], onTriggerFailure?: (agentId?: string) => void }) {
  
  const getIcon = (type: string) => {
    switch (type) {
      case 'supervisor': return <BrainCircuit className="w-5 h-5 text-purple-400" />;
      case 'routing': return <Route className="w-5 h-5 text-blue-400" />;
      case 'security': return <Shield className="w-5 h-5 text-yellow-400" />;
      case 'monitoring': return <Network className="w-5 h-5 text-cyan-400" />;
      case 'worker': return <Cpu className="w-5 h-5 text-green-400" />;
      case 'memory': return <Database className="w-5 h-5 text-pink-400" />;
      default: return <Cpu className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
     switch (status) {
       case 'active': return 'bg-cyan-500/20 border-cyan-500/50 shadow-[0_0_10px_rgba(0,255,255,0.3)]';
       case 'processing': return 'bg-green-500/20 border-green-500/50 shadow-[0_0_10px_rgba(0,255,102,0.3)]';
       case 'recovering': return 'bg-yellow-500/20 border-yellow-500/50 animate-pulse';
       case 'failed': return 'bg-red-500/20 border-red-500/50 shadow-[0_0_15px_rgba(255,51,51,0.5)]';
       case 'idle': return 'bg-gray-700/20 border-gray-600/50 opacity-70';
       default: return 'bg-gray-800 border-gray-600';
     }
  };

  return (
    <div className="glass-panel rounded-lg p-4 h-[400px] flex flex-col">
      <div className="flex items-center justify-between mb-4">
         <h2 className="text-sm font-mono tracking-widest text-[#00f3ff] uppercase flex items-center gap-2">
            <Network className="w-4 h-4"/> Agent Topology DAG
         </h2>
         <div className="flex items-center gap-4">
           {onTriggerFailure && (
             <button 
               onClick={() => onTriggerFailure()}
               className="flex items-center gap-2 px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded text-[10px] font-mono tracking-widest uppercase transition-colors"
             >
               <AlertOctagon className="w-3 h-3" />
               Simulate Failure
             </button>
           )}
           <div className="text-[10px] font-mono text-gray-500 hidden sm:block">LIVE WEBSOCKET // K8S PODS</div>
         </div>
      </div>
      
      <div className="relative flex-1 bg-black/40 rounded-md border border-[var(--color-cyber-border)] overflow-hidden">
         {/* Background Grid */}
         <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMWgyMHYyMEgxem0xIDFoMTh2MThIMnoiIGZpbGw9IiMwMDUwNTAiIGZpbGwtb3BhY2l0eT0iMC4yIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=')]"></div>
         
         {/* Agents */}
         {agents.map((agent) => {
           const hasChaosProvider = agent.type === 'routing' && providers?.some(p => p.status !== 'online');
           const isChaosAgent = agent.status === 'failed' || agent.load === 100 || hasChaosProvider;

           return (
           <div 
             key={agent.id}
             className={cn(
               "group absolute transform -translate-x-1/2 -translate-y-1/2 p-2 rounded-lg border backdrop-blur-md flex flex-col items-center justify-center gap-1 transition-all duration-500 cursor-pointer hover:scale-110",
               getStatusColor(agent.status),
               isChaosAgent && "ring-2 ring-red-500 ring-offset-2 ring-offset-transparent shadow-[0_0_20px_rgba(255,0,0,0.6)]"
             )}
             style={{ left: `${agent.x}%`, top: `${agent.y}%`, width: '120px' }}
           >
              {isChaosAgent && (
                <div className="absolute -top-3 -right-3 z-10 animate-bounce">
                  <div className="bg-red-500/90 text-red-100 p-1 rounded border border-red-400 shadow-[0_0_10px_rgba(255,0,0,0.5)] flex items-center justify-center">
                    <Flame className="w-4 h-4" />
                  </div>
                </div>
              )}
              <div className="flex items-center justify-center w-full gap-2 relative">
                 {getIcon(agent.type)}
                 <div className="w-2 h-2 rounded-full bg-current absolute top-0 -right-1 animate-ping opacity-50" style={{ color: agent.status === 'failed' ? 'red' : 'inherit'}}></div>
              </div>
              <span className="text-[10px] font-mono text-white text-center leading-tight mt-1">{agent.label}</span>
              
              {/* Individual Attack Button */}
              {onTriggerFailure && (
                 <button
                   onClick={(e) => { e.stopPropagation(); onTriggerFailure(agent.id); }}
                   className="absolute -top-3 -left-3 bg-red-500/80 hover:bg-red-400 text-white rounded p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                   title="Simulate Pod Crash"
                 >
                   <AlertOctagon className="w-3 h-3" />
                 </button>
              )}

              {/* Load Bar */}
              <div className="w-full h-1 bg-gray-900 rounded-full mt-1 overflow-hidden relative">
                 <div 
                   className={cn("h-full transition-all duration-300", agent.load > 85 ? 'bg-red-500' : 'bg-cyan-500')} 
                   style={{ width: `${agent.load}%` }}
                 />
              </div>
              {hasChaosProvider && (
                 <div className="text-[8px] font-mono text-red-400 mt-1 uppercase tracking-wider animate-pulse">
                   Provider Error
                 </div>
              )}
              {agent.load === 100 && (
                 <div className="text-[8px] font-mono text-orange-400 mt-1 uppercase tracking-wider animate-pulse">
                   OOM Warning
                 </div>
              )}
           </div>
         )})}
         
         {/* Simulated SVGs connections could go here, omitting for simplicity/responsiveness */}
      </div>
    </div>
  );
}
