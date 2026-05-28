import React, { useState } from 'react';
import { AgentNode, SystemEvent, ProviderHealth } from '../types';
import { AlertOctagon, Zap, ShieldAlert, Cpu, Flame, SlidersHorizontal } from 'lucide-react';
import { TopologyMap } from './TopologyMap';
import { ActivityLog } from './ActivityLog';

interface ChaosLabProps {
  agents: AgentNode[];
  events: SystemEvent[];
  providers: ProviderHealth[];
  onTriggerAgentFailure: () => void;
  onTriggerNetworkLatency: (latency: number, duration: number) => void;
  onTriggerApiError: (targetId?: string, fallbackId?: string) => void;
  onTriggerResourceConstraint: (load: number, duration: number, crash: boolean) => void;
}

export function ChaosLab({
  agents,
  events,
  providers,
  onTriggerAgentFailure,
  onTriggerNetworkLatency,
  onTriggerApiError,
  onTriggerResourceConstraint
}: ChaosLabProps) {
  const [latencyMs, setLatencyMs] = useState(2500);
  const [latencyDurMs, setLatencyDurMs] = useState(5000);
  const [cpuLoad, setCpuLoad] = useState(100);
  const [cpuDurMs, setCpuDurMs] = useState(3000);
  const [triggerCrash, setTriggerCrash] = useState(true);
  const [targetApiProvider, setTargetApiProvider] = useState<string>('');
  const [fallbackApiProvider, setFallbackApiProvider] = useState<string>('');

  return (
    <div className="flex-1 p-4 grid grid-cols-1 xl:grid-cols-12 gap-4 auto-rows-max overflow-y-auto">
      {/* Left Column - Injectors */}
      <div className="xl:col-span-4 flex flex-col gap-4">
        <div className="glass-panel p-4 rounded-lg flex flex-col h-full border border-red-500/30 bg-black/40 shadow-[inset_0_0_20px_rgba(255,0,0,0.1)]">
          <h2 className="text-sm font-mono tracking-widest text-[#ff3333] uppercase mb-4 flex items-center gap-2 glow-text-danger">
            <Flame className="w-5 h-5"/> Chaos Injectors
          </h2>
          <p className="text-xs font-mono text-gray-400 mb-6">
            Simulate catastrophic failures to test system resilience, automatic failovers, and recovery mechanisms.
          </p>

          <div className="flex flex-col gap-6 flex-1">
            <div className="bg-black/30 border border-yellow-500/20 rounded-lg p-3">
              <button 
                onClick={() => onTriggerNetworkLatency(latencyMs, latencyDurMs)}
                className="w-full flex items-center gap-3 p-3 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-left transition-all group"
              >
                <div className="flex-shrink-0 p-2 bg-yellow-500/20 rounded text-yellow-400 group-hover:scale-110 transition-transform">
                  <Zap className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-sm text-yellow-400 font-bold uppercase tracking-wider">Network Latency</span>
                  <span className="text-[10px] font-mono text-gray-400">Inject synthetic latency on active route</span>
                </div>
              </button>
              
              <div className="mt-3 px-2 space-y-3">
                 <div className="flex items-center justify-between gap-4">
                    <label className="text-[10px] font-mono text-yellow-500/80">LATENCY (MS): {latencyMs}</label>
                    <input type="range" min="100" max="10000" step="100" value={latencyMs} onChange={(e) => setLatencyMs(Number(e.target.value))} className="flex-1 accent-yellow-500" />
                 </div>
                 <div className="flex items-center justify-between gap-4">
                    <label className="text-[10px] font-mono text-yellow-500/80">DURATION (S): {(latencyDurMs/1000).toFixed(1)}</label>
                    <input type="range" min="1000" max="15000" step="1000" value={latencyDurMs} onChange={(e) => setLatencyDurMs(Number(e.target.value))} className="flex-1 accent-yellow-500" />
                 </div>
              </div>
            </div>

            <div className="bg-black/30 border border-red-500/20 rounded-lg p-3">
              <button 
                onClick={() => onTriggerApiError(targetApiProvider, fallbackApiProvider)}
                className="w-full flex items-center gap-3 p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/50 rounded-lg text-left transition-all group"
              >
                <div className="flex-shrink-0 p-2 bg-red-500/20 rounded text-red-500 group-hover:scale-110 transition-transform">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-sm text-red-500 font-bold uppercase tracking-wider">API Failure</span>
                  <span className="text-[10px] font-mono text-gray-400">Force specific provider offline</span>
                </div>
              </button>
              
              <div className="mt-3 px-2 space-y-3">
                 <div className="flex items-center gap-2">
                    <label className="text-[10px] font-mono text-red-500/80 uppercase w-20">Target:</label>
                    <select 
                      value={targetApiProvider} 
                      onChange={(e) => setTargetApiProvider(e.target.value)}
                      className="flex-1 bg-black/50 border border-red-500/30 text-gray-300 text-xs font-mono p-1 rounded"
                    >
                      <option value="">(Active Provider)</option>
                      {providers.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                 </div>
                 <div className="flex items-center gap-2">
                    <label className="text-[10px] font-mono text-red-500/80 uppercase w-20">Fallback:</label>
                    <select 
                      value={fallbackApiProvider} 
                      onChange={(e) => setFallbackApiProvider(e.target.value)}
                      className="flex-1 bg-black/50 border border-red-500/30 text-gray-300 text-xs font-mono p-1 rounded"
                    >
                      <option value="">(Auto-select Next)</option>
                      {providers.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                 </div>
              </div>
            </div>

            <div className="bg-black/30 border border-[orange]/20 rounded-lg p-3">
              <button 
                onClick={() => onTriggerResourceConstraint(cpuLoad, cpuDurMs, triggerCrash)}
                className="w-full flex items-center gap-3 p-3 bg-[orange]/10 hover:bg-[orange]/20 border border-[orange]/50 rounded-lg text-left transition-all group"
              >
                <div className="flex-shrink-0 p-2 bg-[orange]/20 rounded text-[orange] group-hover:scale-110 transition-transform">
                  <Cpu className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="font-mono text-sm text-[orange] font-bold uppercase tracking-wider">Resource Constraints</span>
                  <span className="text-[10px] font-mono text-gray-400">Spike agent CPU load</span>
                </div>
              </button>
              
              <div className="mt-3 px-2 space-y-3">
                 <div className="flex items-center justify-between gap-4">
                    <label className="text-[10px] font-mono whitespace-nowrap text-[orange]/80">CPU LOAD (%): {cpuLoad}</label>
                    <input type="range" min="50" max="100" step="5" value={cpuLoad} onChange={(e) => setCpuLoad(Number(e.target.value))} className="flex-1 accent-[orange]" />
                 </div>
                 <div className="flex items-center justify-between gap-4">
                    <label className="text-[10px] font-mono whitespace-nowrap text-[orange]/80">DURATION (S): {(cpuDurMs/1000).toFixed(1)}</label>
                    <input type="range" min="1000" max="10000" step="1000" value={cpuDurMs} onChange={(e) => setCpuDurMs(Number(e.target.value))} className="flex-1 accent-[orange]" />
                 </div>
                 <label className="flex items-center gap-2 cursor-pointer mt-1">
                    <input type="checkbox" checked={triggerCrash} onChange={(e) => setTriggerCrash(e.target.checked)} className="accent-[orange] rounded bg-black/50 border-gray-600" />
                    <span className="text-[10px] font-mono text-[orange]/80 uppercase">Trigger OOM Crash after duration</span>
                 </label>
              </div>
            </div>

            <button 
              onClick={onTriggerAgentFailure}
              className="flex items-center gap-3 p-4 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/50 rounded-lg text-left transition-all group"
            >
              <div className="flex-shrink-0 p-2 bg-pink-500/20 rounded text-pink-500 group-hover:scale-110 transition-transform">
                <AlertOctagon className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-sm text-pink-500 font-bold uppercase tracking-wider">Agent Pod Crash</span>
                <span className="text-[10px] font-mono text-gray-400">Randomly kill an active LLM worker node</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Right Column - Validation */}
      <div className="xl:col-span-8 flex flex-col gap-4">
        <TopologyMap agents={agents} providers={providers} />
        <div className="flex-1 min-h-[300px]">
           <ActivityLog events={events} />
        </div>
      </div>
    </div>
  );
}
