import React, { useRef, useState } from 'react';
import { SystemEvent } from '../types';
import { cn } from '../lib/utils';
import { Terminal, Download, Calendar, X } from 'lucide-react';

export function ActivityLog({ events }: { events: SystemEvent[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const filteredEvents = events.filter((event) => {
    if (!startDate && !endDate) return true;
    
    const eventDate = new Date(event.timestamp);
    // Setting eventDate hours to 0 to properly compare with YYYY-MM-DD input
    const eventDay = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate()).getTime();
    
    const start = startDate ? new Date(startDate).getTime() : -Infinity;
    
    // For end date, we also want to include the whole day, so we compare without time if we used same approach
    const end = endDate ? new Date(endDate).getTime() : Infinity;

    return eventDay >= start && eventDay <= end;
  });

  const downloadReport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filteredEvents, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `swarm_audit_log_${new Date().toISOString()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="glass-panel rounded-lg p-4 h-[300px] flex flex-col font-mono text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 border-b border-[var(--color-cyber-border)] pb-2 gap-2">
         <h2 className="text-sm font-mono tracking-widest text-[#bc13fe] uppercase flex items-center gap-2 glow-text-purple shrink-0">
            <Terminal className="w-4 h-4"/> Event Horizon // Healing Logs
         </h2>
         <div className="flex items-center gap-3">
           <div className="flex items-center gap-2 bg-black/40 border border-gray-800 rounded px-2 py-1">
             <Calendar className="w-3 h-3 text-gray-500" />
             <input 
               type="date" 
               className="bg-transparent border-none text-gray-400 focus:outline-none focus:text-[#bc13fe] text-[10px] w-[100px] cursor-text"
               value={startDate}
               onChange={(e) => setStartDate(e.target.value)}
             />
             <span className="text-gray-600">-</span>
             <input 
               type="date" 
               className="bg-transparent border-none text-gray-400 focus:outline-none focus:text-[#bc13fe] text-[10px] w-[100px] cursor-text"
               value={endDate}
               onChange={(e) => setEndDate(e.target.value)}
             />
             {(startDate || endDate) && (
               <button 
                 onClick={() => { setStartDate(''); setEndDate(''); }}
                 className="text-gray-500 hover:text-red-400 focus:outline-none transition-colors ml-1"
                 title="Clear Dates"
               >
                 <X className="w-3 h-3" />
               </button>
             )}
           </div>
           
           <button 
             onClick={downloadReport}
             disabled={filteredEvents.length === 0}
             className="flex items-center gap-2 text-[#bc13fe] hover:text-white px-2 py-1 rounded bg-[#bc13fe]/10 hover:bg-[#bc13fe]/20 border border-[#bc13fe]/30 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
             title="Generate Audit Report (JSON)"
           >
             <Download className="w-3 h-3" />
             <span className="hidden md:inline">Export Report</span>
           </button>
         </div>
      </div>
      
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto pr-2 space-y-2"
      >
        {filteredEvents.map((event) => (
          <div key={event.id} className="flex gap-3 leading-tight font-mono">
             <span className="text-gray-500 shrink-0">
               [{new Date(event.timestamp).toLocaleTimeString([], { hour12: false, fractionalSecondDigits: 2 })}]
             </span>
             
             <span className={cn(
               "shrink-0 w-16",
               event.type === 'INFO' && 'text-blue-400',
               event.type === 'WARN' && 'text-yellow-400',
               event.type === 'ERROR' && 'text-orange-400',
               event.type === 'CRITICAL' && 'text-red-500 font-bold',
               event.type === 'RECOVERY' && 'text-green-400 font-bold',
             )}>
               [{event.type}]
             </span>
             
             <span className="text-pink-400 shrink-0 border border-pink-500/20 px-1 rounded bg-pink-500/10">
               {event.source}
             </span>
             
             <span className="text-gray-300 break-words">
               {event.message}
             </span>
          </div>
        ))}
      </div>
    </div>
  );
}
