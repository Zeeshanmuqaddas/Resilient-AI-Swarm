import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Activity } from 'lucide-react';

export function TelemetryCharts({ data }: { data: any[] }) {
  return (
    <div className="glass-panel rounded-lg p-4 flex flex-col h-[400px]">
       <h2 className="text-sm font-mono tracking-widest text-[#ffbf00] uppercase mb-4 flex items-center gap-2">
         <Activity className="w-4 h-4"/> Global Telemetry Streams
       </h2>
       
       <div className="flex-1 grid grid-cols-1 gap-6">
          <div className="h-full flex flex-col">
             <div className="text-[10px] text-gray-400 font-mono mb-2">TOKENS / SEC (AGGREGATE)</div>
             <div className="flex-1 min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={data}>
                   <defs>
                     <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.8}/>
                       <stop offset="95%" stopColor="#00f3ff" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                   <XAxis dataKey="time" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                   <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                   <Tooltip 
                     contentStyle={{ backgroundColor: 'rgba(10, 15, 30, 0.9)', border: '1px solid #00f3ff50' }}
                     itemStyle={{ color: '#00f3ff' }}
                   />
                   <Area type="monotone" dataKey="tokens" stroke="#00f3ff" fillOpacity={1} fill="url(#colorTokens)" isAnimationActive={false} />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
          </div>
          
          <div className="h-full flex flex-col">
             <div className="text-[10px] text-gray-400 font-mono mb-2">GATEWAY LATENCY P99 (MS)</div>
             <div className="flex-1 min-h-0">
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={data}>
                   <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                   <XAxis dataKey="time" stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                   <YAxis stroke="#ffffff40" fontSize={10} tickLine={false} axisLine={false} />
                   <Tooltip 
                     contentStyle={{ backgroundColor: 'rgba(10, 15, 30, 0.9)', border: '1px solid #ff333350' }}
                     itemStyle={{ color: '#ff3333' }}
                   />
                   <Line type="stepAfter" dataKey="latency" stroke="#ff3333" strokeWidth={2} dot={false} isAnimationActive={false} />
                 </LineChart>
               </ResponsiveContainer>
             </div>
          </div>
       </div>
    </div>
  );
}
