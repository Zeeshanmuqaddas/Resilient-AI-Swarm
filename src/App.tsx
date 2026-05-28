import React, { useState, useEffect } from 'react';
import { useSystemSimulation } from './hooks/useSystemSimulation';
import { Header } from './components/Header';
import { TopologyMap } from './components/TopologyMap';
import { ProviderHealthPanel } from './components/ProviderHealthPanel';
import { ActivityLog } from './components/ActivityLog';
import { TelemetryCharts } from './components/TelemetryCharts';
import { ChaosLab } from './components/ChaosLab';
import { AgentDirectives } from './components/AgentDirectives';
import { KnowledgeBase } from './components/KnowledgeBase';
import { TaskQueue } from './components/TaskQueue';
import { Login } from './components/Login';
import { Shield } from 'lucide-react';
import { cn } from './lib/utils';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'chaos' | 'directives' | 'knowledge' | 'tasks'>('overview');
  
  const { 
    agents, events, providers, telemetry, 
    triggerAgentFailure, triggerNetworkLatency, 
    triggerApiError, triggerResourceConstraint 
  } = useSystemSimulation();

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    if (storedEmail) {
      setUserEmail(storedEmail);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (email: string) => {
    localStorage.setItem('userEmail', email);
    setUserEmail(email);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    setUserEmail('');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-200">
       <Header providers={providers} userEmail={userEmail} onLogout={handleLogout} />
       
       <div className="flex border-b border-[var(--color-cyber-border)] px-4 bg-black/20 overflow-x-auto">
         <button 
           className={cn("px-6 py-3 font-mono text-xs tracking-widest uppercase border-b-2 transition-colors whitespace-nowrap", activeTab === 'overview' ? 'border-[#00f3ff] text-[#00f3ff]' : 'border-transparent text-gray-500 hover:text-gray-300')} 
           onClick={() => setActiveTab('overview')}
         >
           Global Overview
         </button>
         <button 
           className={cn("px-6 py-3 font-mono text-xs tracking-widest uppercase border-b-2 transition-colors whitespace-nowrap", activeTab === 'chaos' ? 'border-[#ff3333] text-[#ff3333]' : 'border-transparent text-gray-500 hover:text-gray-300')} 
           onClick={() => setActiveTab('chaos')}
         >
           Chaos Lab
         </button>
         <button 
           className={cn("px-6 py-3 font-mono text-xs tracking-widest uppercase border-b-2 transition-colors whitespace-nowrap", activeTab === 'directives' ? 'border-[#bc13fe] text-[#bc13fe]' : 'border-transparent text-gray-500 hover:text-gray-300')} 
           onClick={() => setActiveTab('directives')}
         >
           Agent Directives
         </button>
         <button 
           className={cn("px-6 py-3 font-mono text-xs tracking-widest uppercase border-b-2 transition-colors whitespace-nowrap", activeTab === 'knowledge' ? 'border-[#bc13fe] text-[#bc13fe]' : 'border-transparent text-gray-500 hover:text-gray-300')} 
           onClick={() => setActiveTab('knowledge')}
         >
           Knowledge Base
         </button>
         <button 
           className={cn("px-6 py-3 font-mono text-xs tracking-widest uppercase border-b-2 transition-colors whitespace-nowrap", activeTab === 'tasks' ? 'border-[#00f3ff] text-[#00f3ff]' : 'border-transparent text-gray-500 hover:text-gray-300')} 
           onClick={() => setActiveTab('tasks')}
         >
           Task Queue
         </button>
       </div>
       
       {activeTab === 'overview' && (
         <main className="flex-1 p-4 grid grid-cols-1 xl:grid-cols-12 gap-4 auto-rows-max overflow-y-auto w-full">
            {/* Left Column - Topology & Security */}
            <div className="xl:col-span-5 flex flex-col gap-4">
               <TopologyMap agents={agents} providers={providers} onTriggerFailure={triggerAgentFailure} />
               
               <div className="glass-panel p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <Shield className="w-8 h-8 text-yellow-400" />
                     <div>
                        <div className="font-mono font-bold text-yellow-400 tracking-widest glow-text-warning">ZERO-TRUST ENFORCER</div>
                        <div className="text-[10px] text-gray-400 font-mono">ENCRYPTED MEMORY CORTEX ACTIVE</div>
                     </div>
                  </div>
                  <div className="text-right font-mono text-xs text-gray-400 space-y-1">
                     <div>HALLUCINATION PROB: <span className="text-green-400">0.02%</span></div>
                     <div>RBAC POLICIES: <span className="text-cyan-400">SYNCED</span></div>
                  </div>
               </div>
            </div>
            
            {/* Middle Column - Telemetry */}
            <div className="xl:col-span-4 flex flex-col gap-4">
               <TelemetryCharts data={telemetry} />
               <div className="grid grid-cols-2 gap-4">
                  <div className="glass-panel p-4 rounded-lg flex flex-col items-center justify-center text-center">
                     <div className="text-[10px] text-gray-400 font-mono mb-1">TOTAL TOKENS PROCESSED</div>
                     <div className="text-2xl font-mono text-white glow-text-blue">
                       {(telemetry[telemetry.length - 1]?.tokens * 142 || 142000).toLocaleString()}
                     </div>
                  </div>
                  <div className="glass-panel p-4 rounded-lg flex flex-col items-center justify-center text-center">
                     <div className="text-[10px] text-gray-400 font-mono mb-1">AUTO-HEALING EVENTS</div>
                     <div className="text-2xl font-mono text-white glow-text-green">
                       {events.filter(e => e.type === 'RECOVERY').length}
                     </div>
                  </div>
               </div>
            </div>
            
            {/* Right Column - Providers & Logs */}
            <div className="xl:col-span-3 flex flex-col gap-4">
               <div className="h-[300px]">
                  <ProviderHealthPanel providers={providers} />
               </div>
               <div className="flex-1 min-h-[300px]">
                  <ActivityLog events={events} />
               </div>
            </div>
         </main>
       )}
       {activeTab === 'chaos' && (
         <ChaosLab 
           agents={agents} 
           events={events} 
           providers={providers}
           onTriggerAgentFailure={triggerAgentFailure}
           onTriggerNetworkLatency={triggerNetworkLatency}
           onTriggerApiError={triggerApiError}
           onTriggerResourceConstraint={triggerResourceConstraint}
         />
       )}
       {activeTab === 'directives' && (
         <AgentDirectives />
       )}
       {activeTab === 'knowledge' && (
         <KnowledgeBase />
       )}
       {activeTab === 'tasks' && (
         <TaskQueue />
       )}
    </div>
  );
}
