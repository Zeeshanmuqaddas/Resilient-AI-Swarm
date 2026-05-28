import React, { useState } from 'react';
import { Search, BookOpen, Clock, Tag, ExternalLink, ChevronRight, Hash, Plus, X, Users } from 'lucide-react';
import { cn } from '../lib/utils';

interface KnowledgeEntry {
  id: string;
  projectName: string;
  date: string;
  description: string;
  stack: string[];
  lessonsLearned: string[];
  patterns: string[];
}

const INITIAL_ENTRIES: KnowledgeEntry[] = [
  {
    id: "kb-001",
    projectName: "Project Nova",
    date: "2026-05-10",
    description: "AI startup landing page with user authentication and payment integration. Initially struggled with isolated state management.",
    stack: ["React", "Node.js", "Firebase Auth", "Stripe"],
    lessonsLearned: [
       "OAuth flows in iframes cause redirect context loss; must implement popup or redirect strategies correctly.",
       "Stripe webhooks require raw body parsing, conflicting with default Express JSON middlewares."
    ],
    patterns: [
       "Swarm utilized the 'Gateway/Microservice' pattern to isolate the webhook processor.",
       "Fallback agent generated mock payment data while the Stripe environment was unavailable."
    ]
  },
  {
    id: "kb-002",
    projectName: "Nexus Admin Dashboard",
    date: "2026-05-18",
    description: "B2B backend management interface with RBAC and complex data grid visualizations representing real-time metrics.",
    stack: ["Next.js", "PostgreSQL", "TailwindCSS", "Recharts"],
    lessonsLearned: [
       "Aggregating large datasets on the client causes main-thread blocking; aggregation must be moved to the database layer.",
       "Granular RBAC needs a centralized policy enforcer, spreading checking logic across components is highly error-prone."
    ],
    patterns: [
       "Implemented cursor-based pagination for high-volume data tables.",
       "Used centralized middleware for route protection and role verification."
    ]
  },
  {
    id: "kb-003",
    projectName: "Echo Social Feed",
    date: "2026-05-20",
    description: "Real-time activity feed with websockets and media upload capabilities requiring high availability.",
    stack: ["Vue", "Socket.io", "AWS S3", "Express"],
    lessonsLearned: [
       "Socket.io reconnections under unstable networks can cause duplicate events if not properly deduplicated on the client.",
       "Direct-to-S3 pre-signed uploads are significantly more efficient than passing binary files through the Node server memory."
    ],
    patterns: [
       "Generation of pre-signed URLs via short-lived API endpoints prior to upload.",
       "Attachment of idempotent UUIDs to all websocket payloads."
    ]
  },
  {
    id: "kb-004",
    projectName: "Apollo Orchestrator",
    date: "2026-05-22",
    description: "Multi-agent autonomous planning system designed to process complex natural language instructions.",
    stack: ["Python", "FastAPI", "Gemini 3.0", "Redis"],
    lessonsLearned: [
       "LLMs can enter infinite loops if failure states are not strictly capped with max-revision counters.",
       "Parsing unstructured JSON from generative outputs is brittle without strict schema enforcement."
    ],
    patterns: [
       "Dispatcher uses structured function calling to enforce output schemas.",
       "Implemented Circuit Breaker pattern to halt swarm execution upon reaching failure limits."
    ]
  }
];

export function KnowledgeBase() {
  const [entries, setEntries] = useState<KnowledgeEntry[]>(INITIAL_ENTRIES);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStack, setNewStack] = useState('');
  const [newLessons, setNewLessons] = useState('');
  const [newPatterns, setNewPatterns] = useState('');

  const filteredEntries = entries.filter(entry => 
    entry.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.stack.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleManualIngestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName || !newDescription) return;

    const newEntry: KnowledgeEntry = {
      id: `kb-${String(entries.length + 1).padStart(3, '0')}`,
      projectName: newProjectName,
      date: new Date().toISOString().split('T')[0],
      description: newDescription,
      stack: newStack.split(',').map(s => s.trim()).filter(s => s),
      lessonsLearned: newLessons.split('\n').map(l => l.trim()).filter(l => l),
      patterns: newPatterns.split('\n').map(p => p.trim()).filter(p => p),
    };

    setEntries([newEntry, ...entries]);
    setIsModalOpen(false);
    
    // Reset form
    setNewProjectName('');
    setNewDescription('');
    setNewStack('');
    setNewLessons('');
    setNewPatterns('');
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto w-full max-w-7xl mx-auto space-y-6 relative">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-lg bg-black/40 border border-[#bc13fe]/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
           <BookOpen className="w-48 h-48 text-[#bc13fe]" />
        </div>
        <div className="relative z-10 flex-1">
          <h2 className="text-2xl font-mono tracking-widest text-[#bc13fe] uppercase mb-2 glow-text-purple flex items-center gap-3">
            <BookOpen className="w-8 h-8" /> 
            Knowledge Base // Historical Archive
          </h2>
          <p className="text-sm font-mono text-gray-400 max-w-2xl">
            Browse past project outcomes, architectural decisions, and lessons learned generated by the Swarm Intelligence.
          </p>
        </div>
        
        <div className="relative z-10 w-full md:w-auto flex flex-col sm:flex-row gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search history..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 border border-[#bc13fe]/30 rounded-lg py-2 pl-9 pr-3 text-sm font-mono text-gray-200 focus:outline-none focus:border-[#bc13fe] transition-colors"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-[#bc13fe]/20 hover:bg-[#bc13fe]/30 border border-[#bc13fe]/50 text-[#bc13fe] px-4 py-2 rounded-lg text-sm font-mono transition-colors"
          >
            <Plus className="w-4 h-4" />
            Manual Ingestion
          </button>
        </div>
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.map(entry => (
          <div key={entry.id} className="glass-panel p-6 rounded-lg border border-gray-800 hover:border-[#bc13fe]/40 transition-colors bg-black/50">
             
             <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
               <div>
                 <div className="flex items-center gap-3 mb-1">
                   <h3 className="text-lg font-bold font-mono text-[#00f3ff] glow-text-blue">{entry.projectName}</h3>
                   <span className="text-xs font-mono text-gray-500 flex items-center gap-1 border border-gray-700 bg-gray-900/50 px-2 py-0.5 rounded">
                     <Hash className="w-3 h-3" />
                     {entry.id}
                   </span>
                 </div>
                 <p className="text-sm font-mono text-gray-400 mt-1">{entry.description}</p>
               </div>
               <div className="flex items-center gap-2 text-xs font-mono text-gray-500 whitespace-nowrap bg-black/30 px-3 py-1.5 rounded border border-gray-800">
                 <Clock className="w-3 h-3 text-[#bc13fe]" />
                 {entry.date}
               </div>
             </div>

             <div className="flex flex-wrap gap-2 mb-6">
               {entry.stack.map(tech => (
                 <span key={tech} className="text-xs font-mono px-2 py-1 rounded bg-[#bc13fe]/10 text-[#bc13fe] border border-[#bc13fe]/20 flex items-center gap-1">
                   <Tag className="w-3 h-3" />
                   {tech}
                 </span>
               ))}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/30 rounded-lg border border-gray-800/50 p-4">
               
               <div>
                 <h4 className="text-xs font-mono tracking-widest text-orange-400 uppercase mb-3 flex items-center gap-2">
                   <ChevronRight className="w-4 h-4" />
                   Lessons Learned
                 </h4>
                 <ul className="space-y-3">
                   {entry.lessonsLearned.map((lesson, idx) => (
                     <li key={idx} className="flex items-start gap-2 text-xs font-mono text-gray-300">
                       <span className="text-orange-400/70 mt-[2px]">•</span>
                       <span className="leading-relaxed">{lesson}</span>
                     </li>
                   ))}
                 </ul>
               </div>

               <div>
                 <h4 className="text-xs font-mono tracking-widest text-emerald-400 uppercase mb-3 flex items-center gap-2">
                   <ChevronRight className="w-4 h-4" />
                   Recurring Patterns
                 </h4>
                 <ul className="space-y-3">
                   {entry.patterns.map((pattern, idx) => (
                     <li key={idx} className="flex items-start gap-2 text-xs font-mono text-gray-300">
                       <span className="text-emerald-400/70 mt-[2px]">•</span>
                       <span className="leading-relaxed">{pattern}</span>
                     </li>
                   ))}
                 </ul>
               </div>

             </div>

          </div>
        ))}

        {filteredEntries.length === 0 && (
          <div className="glass-panel p-12 rounded-lg text-center border-gray-800 bg-black/30">
             <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
             <div className="font-mono text-gray-400">No knowledge records found matching your query.</div>
          </div>
        )}
      </div>

      {/* Human-in-the-Loop Ingestion Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel bg-gray-900 border border-teal-500/50 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-teal-900/20">
            
            <div className="sticky top-0 bg-gray-900/95 backdrop-blur z-10 border-b border-gray-800 p-4 flex items-center justify-between">
               <h3 className="text-lg font-mono tracking-widest text-teal-400 uppercase flex items-center gap-2">
                 <Users className="w-5 h-5" />
                 Human-in-the-Loop Ingestion
               </h3>
               <button 
                 onClick={() => setIsModalOpen(false)}
                 className="text-gray-500 hover:text-white transition-colors"
               >
                 <X className="w-5 h-5" />
               </button>
            </div>

            <form onSubmit={handleManualIngestion} className="p-6 space-y-6">
               <div className="bg-teal-500/5 border border-teal-500/20 rounded p-4 text-xs font-mono text-teal-200/80 mb-6">
                 Manually inject new intelligence into the centralized Knowledge Base. This information will be available to all swarm agents in subsequent iterations.
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Project Name</label>
                   <input 
                     required
                     type="text" 
                     value={newProjectName}
                     onChange={(e) => setNewProjectName(e.target.value)}
                     className="w-full bg-black/50 border border-gray-700 rounded p-2 text-sm font-mono focus:border-teal-500 focus:outline-none transition-colors"
                     placeholder="e.g. Phoenix Dashboard"
                   />
                 </div>
                 <div className="space-y-1">
                   <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Tech Stack (comma separated)</label>
                   <input 
                     type="text" 
                     value={newStack}
                     onChange={(e) => setNewStack(e.target.value)}
                     className="w-full bg-black/50 border border-gray-700 rounded p-2 text-sm font-mono focus:border-teal-500 focus:outline-none transition-colors"
                     placeholder="React, Graphql, GCP..."
                   />
                 </div>
               </div>

               <div className="space-y-1">
                 <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Project Description</label>
                 <textarea 
                   required
                   value={newDescription}
                   onChange={(e) => setNewDescription(e.target.value)}
                   className="w-full bg-black/50 border border-gray-700 rounded p-2 text-sm font-mono focus:border-teal-500 focus:outline-none transition-colors min-h-[80px]"
                   placeholder="Brief overview of the project and its primary challenges..."
                 />
               </div>

               <div className="space-y-1">
                 <label className="text-xs font-mono text-gray-400 uppercase tracking-wider text-orange-400">Lessons Learned (one per line)</label>
                 <textarea 
                   required
                   value={newLessons}
                   onChange={(e) => setNewLessons(e.target.value)}
                   className="w-full bg-black/50 border border-orange-500/30 rounded p-2 text-sm font-mono focus:border-orange-500 focus:outline-none transition-colors min-h-[100px]"
                   placeholder="What failed? What did the swarm learn?"
                 />
               </div>

               <div className="space-y-1">
                 <label className="text-xs font-mono text-gray-400 uppercase tracking-wider text-emerald-400">Recurring Patterns (one per line)</label>
                 <textarea 
                   value={newPatterns}
                   onChange={(e) => setNewPatterns(e.target.value)}
                   className="w-full bg-black/50 border border-emerald-500/30 rounded p-2 text-sm font-mono focus:border-emerald-500 focus:outline-none transition-colors min-h-[100px]"
                   placeholder="Successful architectural patterns discovered..."
                 />
               </div>

               <div className="flex justify-end pt-4 border-t border-gray-800">
                 <button 
                   type="button"
                   onClick={() => setIsModalOpen(false)}
                   className="px-4 py-2 text-gray-400 hover:text-white text-sm font-mono uppercase tracking-widest mr-4"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit"
                   className="px-6 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded text-sm font-mono uppercase tracking-widest transition-colors flex items-center gap-2"
                 >
                   <BookOpen className="w-4 h-4" />
                   Ingest Record
                 </button>
               </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

