import { useState, useEffect } from 'react';
import { AgentNode, SystemEvent, ProviderHealth } from '../types';

export function useSystemSimulation() {
  const [agents, setAgents] = useState<AgentNode[]>([
    { id: 'sup-1', label: 'Supervisor Alpha', type: 'supervisor', status: 'active', x: 50, y: 15, load: 45 },
    { id: 'rout-1', label: 'TrueFoundry Router', type: 'routing', status: 'active', x: 50, y: 35, load: 78 },
    { id: 'sec-1', label: 'Zero-Trust Sec', type: 'security', status: 'active', x: 20, y: 35, load: 32 },
    { id: 'mem-1', label: 'Vector Context', type: 'memory', status: 'idle', x: 80, y: 35, load: 15 },
    { id: 'work-1', label: 'LLM Worker 1', type: 'worker', status: 'processing', x: 30, y: 65, load: 92 },
    { id: 'work-2', label: 'LLM Worker 2', type: 'worker', status: 'processing', x: 50, y: 65, load: 88 },
    { id: 'work-3', label: 'LLM Worker 3', type: 'worker', status: 'idle', x: 70, y: 65, load: 5 },
    { id: 'mon-1', label: 'OpTelemetry', type: 'monitoring', status: 'active', x: 50, y: 85, load: 60 },
  ]);

  const [events, setEvents] = useState<SystemEvent[]>([
    { id: 'e1', timestamp: new Date().toISOString(), type: 'INFO', source: 'System', message: 'HERMES RESILIENCE-X initialized. Zero-trust enforced.' },
    { id: 'e2', timestamp: new Date().toISOString(), type: 'INFO', source: 'Router', message: 'TrueFoundry Gateway connected. 3 models available.' }
  ]);

  const [providers, setProviders] = useState<ProviderHealth[]>([
    { id: 'p1', name: 'OpenAI GPT-4', status: 'online', latency: 120, successRate: 99.9, active: true },
    { id: 'p2', name: 'Claude 3 Opus', status: 'online', latency: 250, successRate: 99.5, active: false },
    { id: 'p3', name: 'Gemini 1.5 Pro', status: 'online', latency: 180, successRate: 99.8, active: false },
    { id: 'p4', name: 'Llama 3 Local', status: 'online', latency: 45, successRate: 100, active: false },
  ]);

  const [telemetry, setTelemetry] = useState<any[]>([
    { time: '0s', tokens: 1200, latency: 120 },
    { time: '5s', tokens: 1500, latency: 130 },
    { time: '10s', tokens: 1800, latency: 110 },
    { time: '15s', tokens: 2200, latency: 140 },
    { time: '20s', tokens: 1900, latency: 125 },
    { time: '25s', tokens: 2100, latency: 115 },
  ]);

  // Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      // 1. Update Telemetry
      setTelemetry((prev) => {
        const next = [...prev.slice(1)];
        const last = next[next.length - 1];
        next.push({
          time: `${parseInt(last.time) + 5}s`,
          tokens: Math.max(500, Math.min(5000, last.tokens + (Math.random() - 0.5) * 1000)),
          latency: Math.max(50, Math.min(800, last.latency + (Math.random() - 0.5) * 100)),
        });
        return next;
      });

      // 2. Randomly fail a provider or agent
      if (Math.random() > 0.85) {
        handleChaosEvent();
      }

      // 3. Update agent loads
      setAgents(prev => prev.map(a => ({
        ...a,
        load: a.status === 'failed' ? 0 : Math.max(5, Math.min(100, a.load + (Math.random() - 0.5) * 20)),
        status: a.status === 'recovering' ? (Math.random() > 0.5 ? 'active' : 'recovering') : a.status
      })));
      
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  const handleChaosEvent = () => {
    const rand = Math.random();
    if (rand < 0.4) {
      // Provider Latency Spike / Failover
      setProviders(prev => {
        const activeIdx = prev.findIndex(p => p.active);
        const next = [...prev];
        if (next[activeIdx].status === 'online') {
          next[activeIdx] = { ...next[activeIdx], status: 'degraded', latency: 850, successRate: 85.0 };
          addEvent('WARN', 'Provider', `${next[activeIdx].name} latency spike detected (850ms).`);
        } else if (next[activeIdx].status === 'degraded') {
          next[activeIdx] = { ...next[activeIdx], status: 'offline', latency: 0, successRate: 0, active: false };
          const fallbackIdx = (activeIdx + 1) % prev.length;
          next[fallbackIdx] = { ...next[fallbackIdx], active: true, status: 'online' };
          addEvent('CRITICAL', 'Router', `Provider ${next[activeIdx].name} failed. Failing over to ${next[fallbackIdx].name}.`);
        }
        return next;
      });
    } else if (rand < 0.8) {
      // Agent Failure
      setAgents(prev => {
        const workers = prev.filter(a => a.type === 'worker');
        if (workers.length === 0) return prev;
        const target = workers[Math.floor(Math.random() * workers.length)];
        if (target.status !== 'failed' && target.status !== 'recovering') {
            addEvent('ERROR', 'K8s', `Pod crash in ${target.label}. OOM Killed.`);
            setTimeout(() => {
               addEvent('RECOVERY', 'Supervisor', `Restarting container for ${target.label}...`);
               setAgents(a => a.map(ag => ag.id === target.id ? {...ag, status: 'recovering'} : ag));
            }, 3000);
            return prev.map(a => a.id === target.id ? { ...a, status: 'failed', load: 0 } : a);
        }
        return prev;
      });
    } else {
       // Just info
       addEvent('INFO', 'Memory', 'Vector schema optimized. Context retrieval accelerated by 12%.');
    }
  };

  const addEvent = (type: SystemEvent['type'], source: string, message: string) => {
    setEvents(prev => [{
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      type,
      source,
      message
    }, ...prev].slice(0, 50));
  };

  const triggerAgentFailure = (targetId?: string) => {
    setAgents(prev => {
      let target;
      if (typeof targetId === 'string' && targetId) {
         target = prev.find(a => a.id === targetId);
      } else {
         const workers = prev.filter(a => a.type === 'worker');
         if (workers.length === 0) return prev;
         target = workers[Math.floor(Math.random() * workers.length)];
      }

      if (target && target.status !== 'failed' && target.status !== 'recovering') {
          const tid = target.id;
          const tlabel = target.label;
          addEvent('ERROR', 'K8s', `MANUAL INJECTION: Pod crash in ${tlabel}. OOM Killed.`);
          setTimeout(() => {
             addEvent('RECOVERY', 'Supervisor', `Restarting container for ${tlabel}...`);
             setAgents(a => a.map(ag => ag.id === tid ? {...ag, status: 'recovering'} : ag));
          }, 3000);
          return prev.map(a => a.id === tid ? { ...a, status: 'failed', load: 0 } : a);
      }
      return prev;
    });
  };

  const triggerNetworkLatency = (latencyValue: number = 2500, durationMs: number = 5000) => {
    setProviders(prev => {
      const next = [...prev];
      const activeIdx = next.findIndex(p => p.active);
      if (activeIdx >= 0) {
        next[activeIdx] = { ...next[activeIdx], status: 'degraded', latency: latencyValue, successRate: 85.0 };
        addEvent('WARN', 'Chaos', `MANUAL INJECTION: Network latency spike triggered on ${next[activeIdx].name} (${latencyValue}ms for ${durationMs/1000}s).`);
      }
      return next;
    });

    setTimeout(() => {
       setProviders(prev => {
          const next = [...prev];
          const activeIdx = next.findIndex(p => p.active);
          if (activeIdx >= 0 && next[activeIdx].status === 'degraded') {
            next[activeIdx] = { ...next[activeIdx], status: 'online', latency: 150, successRate: 99.8 };
            addEvent('RECOVERY', 'Chaos', `Recovery: Network latency normalized on ${next[activeIdx].name}.`);
          }
          return next;
       });
    }, durationMs);
  };

  const triggerApiError = (targetProviderId?: string, fallbackProviderId?: string) => {
    setProviders(prev => {
       const activeIdx = prev.findIndex(p => p.active);
       if (activeIdx < 0) return prev;
       const next = [...prev];
       
       let targetIdx = activeIdx;
       if (targetProviderId) {
         const foundIdx = prev.findIndex(p => p.id === targetProviderId);
         if (foundIdx >= 0) targetIdx = foundIdx;
       }

       const targetProvider = prev[targetIdx];
       
       if (next[targetIdx].status !== 'offline') {
         next[targetIdx] = { ...next[targetIdx], status: 'offline', latency: 0, successRate: 0, active: false };
         
         if (targetProvider.active) {
            let fallbackIdx = -1;
            if (fallbackProviderId) {
                fallbackIdx = prev.findIndex(p => p.id === fallbackProviderId);
            }
            if (fallbackIdx < 0 || fallbackIdx === targetIdx || next[fallbackIdx].status === 'offline') {
                // Find next available
                fallbackIdx = (targetIdx + 1) % prev.length;
                let attempts = 0;
                while (attempts < prev.length && next[fallbackIdx].status === 'offline') {
                    fallbackIdx = (fallbackIdx + 1) % prev.length;
                    attempts++;
                }
            }
            
            if (fallbackIdx >= 0 && fallbackIdx !== targetIdx && next[fallbackIdx].status !== 'offline') {
                next[fallbackIdx] = { ...next[fallbackIdx], active: true, status: 'online' };
                addEvent('CRITICAL', 'Chaos', `MANUAL INJECTION: Forced API failure on ${targetProvider.name}. Failing over to ${next[fallbackIdx].name}.`);
            } else {
                addEvent('CRITICAL', 'Chaos', `MANUAL INJECTION: Forced API failure on ${targetProvider.name}. NO FALLBACK AVAILABLE!`);
            }
         } else {
            addEvent('CRITICAL', 'Chaos', `MANUAL INJECTION: Forced API failure on standby provider ${targetProvider.name}.`);
         }
       }
       return next;
    });
  };

  const triggerResourceConstraint = (loadValue: number = 100, durationMs: number = 3000, triggerCrash: boolean = true) => {
     addEvent('WARN', 'Chaos', `MANUAL INJECTION: Simulating severe resource constraints. Spiking all agent loads to ${loadValue}%.`);
     setAgents(prev => prev.map(a => ({
       ...a,
       load: loadValue,
     })));
     
     if (triggerCrash) {
       setTimeout(() => {
          triggerAgentFailure();
       }, durationMs);
     } else {
       setTimeout(() => {
         setAgents(prev => prev.map(a => ({
           ...a,
           load: a.status === 'failed' ? 0 : Math.random() * 40 + 30, // Randomize normal load 30-70
         })));
         addEvent('RECOVERY', 'Chaos', `Recovery: Resource constraints normalized.`);
       }, durationMs);
     }
  };

  return { 
    agents, events, providers, telemetry, 
    addEvent, triggerAgentFailure, triggerNetworkLatency, 
    triggerApiError, triggerResourceConstraint 
  };
}
