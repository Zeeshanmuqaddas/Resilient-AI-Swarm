import React, { useState, useEffect } from 'react';
import { Network, Database, Code, Server, Shield, PenTool, LayoutTemplate, MessageSquareWarning, CheckCircle, Clock, PlayCircle, Search } from 'lucide-react';
import { cn } from '../lib/utils';

interface SubTask {
  id: string;
  title: string;
  agentName: string;
  agentIcon: React.ElementType;
  status: 'pending' | 'in_progress' | 'review' | 'completed';
  progress: number;
}

const INITIAL_TASKS: SubTask[] = [
  {
    id: "task-001",
    title: "Define Database Schema & Relationships",
    agentName: "Backend Architect",
    agentIcon: Database,
    status: "completed",
    progress: 100
  },
  {
    id: "task-002",
    title: "Design System & Component Wireframes",
    agentName: "UI Designer",
    agentIcon: PenTool,
    status: "review",
    progress: 90
  },
  {
    id: "task-003",
    title: "Generate API CRUD Endpoints",
    agentName: "Code Generation",
    agentIcon: Code,
    status: "in_progress",
    progress: 65
  },
  {
    id: "task-004",
    title: "Review Auth Strategy (JWT)",
    agentName: "Security Agent",
    agentIcon: Shield,
    status: "in_progress",
    progress: 40
  },
  {
    id: "task-005",
    title: "Implement React Hook Connectors",
    agentName: "Frontend Code",
    agentIcon: LayoutTemplate,
    status: "pending",
    progress: 0
  },
  {
    id: "task-006",
    title: "Provision K8s & Docker Manifests",
    agentName: "DevOps / Infra",
    agentIcon: Server,
    status: "pending",
    progress: 0
  }
];

export function TaskQueue() {
  const [tasks, setTasks] = useState<SubTask[]>(INITIAL_TASKS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.agentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Simulate progress updates for the active tasks
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prev => prev.map(task => {
        if (task.status === 'in_progress') {
          const nextProgress = task.progress + Math.floor(Math.random() * 8);
          if (nextProgress >= 100) {
            return { ...task, progress: 100, status: 'review' };
          }
          return { ...task, progress: nextProgress };
        }
        if (task.status === 'review') {
           const chance = Math.random();
           if (chance > 0.8) return { ...task, status: 'completed' };
        }
        return task;
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const columns = [
    { id: 'pending', title: 'Pending', icon: Clock, color: 'text-gray-400', borderColor: 'border-gray-800' },
    { id: 'in_progress', title: 'In Progress', icon: PlayCircle, color: 'text-blue-400', borderColor: 'border-blue-500/30' },
    { id: 'review', title: 'QA Review', icon: MessageSquareWarning, color: 'text-orange-400', borderColor: 'border-orange-500/30' },
    { id: 'completed', title: 'Completed', icon: CheckCircle, color: 'text-green-400', borderColor: 'border-green-500/30' }
  ];

  return (
    <div className="flex-1 p-4 overflow-y-auto w-full max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="glass-panel p-6 rounded-lg bg-black/40 border border-[#00f3ff]/30 relative overflow-hidden mb-4">
         <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
           <Network className="w-48 h-48 text-[#00f3ff]" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex-1">
            <h2 className="text-2xl font-mono tracking-widest text-[#00f3ff] uppercase mb-2 glow-text-blue flex items-center gap-3">
              <Network className="w-8 h-8" /> 
              Dispatcher // Task Queue
            </h2>
            <p className="text-sm font-mono text-gray-400 max-w-2xl">
              Live Kanban visualization of Swarm sub-task decomposition, dynamic routing, and execution progress.
            </p>
          </div>
          <div className="relative w-full md:w-72 mt-2 md:mt-0">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search tasks or agents..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 rounded-lg py-2 pl-9 pr-3 text-sm font-mono text-gray-200 focus:outline-none focus:border-[#00f3ff] transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full min-h-[500px]">
        {columns.map(col => (
          <div key={col.id} className={cn("flex flex-col bg-black/20 border rounded-lg overflow-hidden", col.borderColor)}>
            <div className="p-3 border-b border-gray-800 bg-gray-900/50 flex items-center justify-between shadow-sm">
              <h3 className={cn("text-xs font-mono tracking-widest uppercase flex items-center gap-2", col.color)}>
                <col.icon className="w-4 h-4" />
                {col.title}
              </h3>
              <span className="text-xs font-mono text-gray-500 bg-black/50 px-2 py-0.5 rounded border border-gray-800">
                {filteredTasks.filter(t => t.status === col.id).length}
              </span>
            </div>
            
            <div className="flex-1 p-3 space-y-3 overflow-y-auto bg-black/10">
              {filteredTasks.filter(t => t.status === col.id).map(task => (
                 <div key={task.id} className="glass-panel bg-gray-900/80 border border-gray-700 hover:border-[#00f3ff]/40 rounded p-3 transition-colors group cursor-default shadow-md shadow-black/20">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h4 className="text-xs font-sans font-medium text-gray-200 leading-tight">
                        {task.title}
                      </h4>
                    </div>
                    
                    <div className={cn("flex items-center gap-1.5 text-[10px] font-mono bg-black/40 w-fit px-1.5 py-0.5 rounded border border-gray-800 mb-4", col.id === 'completed' ? 'text-gray-500' : 'text-gray-300')}>
                      <task.agentIcon className={cn("w-3 h-3", col.id === 'completed' ? 'text-gray-600' : 'text-[#00f3ff]')} />
                      {task.agentName}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[9px] font-mono text-gray-500 tracking-wider">
                        <span>PROGRESS</span>
                        <span>{task.progress}%</span>
                      </div>
                      <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
                        <div 
                           className={cn("h-full transition-all duration-300 rounded-full", col.id === 'completed' ? 'bg-green-500' : col.id === 'review' ? 'bg-orange-500' : 'bg-[#00f3ff]')}
                           style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </div>
                 </div>
              ))}
              
              {filteredTasks.filter(t => t.status === col.id).length === 0 && (
                <div className="h-24 flex items-center justify-center border border-dashed border-gray-800/50 rounded-lg bg-black/5">
                  <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">Empty Queue</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
