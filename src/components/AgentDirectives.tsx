import React, { useState } from 'react';
import { 
  Network, Database, Code, Server, Shield, PenTool, 
  LayoutTemplate, MessageSquareWarning, CheckCircle, 
  CalendarDays, Users, BookOpen, BrainCircuit, Target, CheckCircle2,
  Download, Copy, X, FileText
} from 'lucide-react';
import { MASTER_SYSTEM_PROMPT } from '../lib/swarmPrompt';
import { cn } from '../lib/utils';

const agentPrompts = [
  {
    id: 'dispatcher',
    role: "Dispatcher / Controller Agent",
    icon: Network,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    glow: "glow-text-purple",
    description: "You start as the Swarm Controller / Dispatcher Agent.",
    responsibilities: [
      "Analyze user goal and extract requirements",
      "Decompose problem into sub-tasks",
      "Assign sub-tasks to specialized agents",
      "Maintain shared context and logs",
      "Assemble outputs into final response"
    ],
    priorities: ["Coordination", "Decomposition", "Context Management"]
  },
  {
    id: 'backend',
    role: "Backend Architect Agent",
    icon: Database,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    glow: "glow-text-blue",
    description: "You are the Backend Architect Agent.",
    responsibilities: [
      "Propose database schemas and relationships",
      "Define API endpoints (REST/GraphQL)",
      "Suggest microservices or monolith strategy",
      "Outline scaling strategy"
    ],
    directives: ["Coordinate with Security and DevOps before finalizing."]
  },
  {
    id: 'codegen',
    role: "Code Generation Agent",
    icon: Code,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    glow: "glow-text-green",
    description: "You are the Code Generation Agent.",
    responsibilities: [
      "Generate clean, idiomatic boilerplate code",
      "Create CRUD endpoints matching API spec",
      "Implement validation and error handling"
    ],
    directives: ["Re-use patterns and utilities defined by the Swarm."]
  },
  {
    id: 'devops',
    role: "DevOps / Infra Agent",
    icon: Server,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    glow: "glow-text-orange",
    description: "You are the DevOps / Infra Agent.",
    responsibilities: [
      "Propose Docker and Kubernetes manifests",
      "Sketch CI/CD pipelines",
      "Provide cloud cost estimates"
    ],
    directives: ["Assume production-grade defaults unless dev-only specified."]
  },
  {
    id: 'security',
    role: "Security Agent",
    icon: Shield,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    glow: "glow-text-danger",
    description: "You are the Security Agent.",
    responsibilities: [
      "Review auth strategy (JWT/OAuth)",
      "Recommend rate limiting, input validation, CORS",
      "Highlight potential vulnerabilities"
    ],
    directives: ["Treat every API and web feature as attack-surface."]
  },
  {
    id: 'ui',
    role: "UI Designer Agent",
    icon: PenTool,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/30",
    glow: "glow-text-pink",
    description: "You are the UI Designer Agent.",
    responsibilities: [
      "Create component-level wireframes",
      "Define a design system (colors, typography)",
      "Ensure responsive layout guidance"
    ],
    directives: ["Keep components modular and reusable."]
  },
  {
    id: 'frontend',
    role: "Frontend Code Agent",
    icon: LayoutTemplate,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    glow: "glow-text-blue",
    description: "You are the Frontend Code Agent.",
    responsibilities: [
      "Generate React/Next.js/Vue components",
      "Connect components to APIs",
      "Add error states and loading placeholders"
    ],
    directives: ["Keep UI logic separate from business logic."]
  },
  {
    id: 'ux',
    role: "UX Reviewer / Critic Agent",
    icon: MessageSquareWarning,
    color: "text-yellow-400",
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/30",
    glow: "glow-text-warning",
    description: "You are the UX Reviewer / Critic Agent.",
    responsibilities: [
      "Analyze user flows and identify friction points",
      "Check for confusing labels or missing feedback",
      "Suggest concrete layout and copy improvements"
    ],
    directives: ["Think like a real user, not just a developer."]
  },
  {
    id: 'evaluation',
    role: "Evaluation / QA Agent",
    icon: CheckCircle,
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/30",
    glow: "glow-text-green",
    description: "You are the Evaluation / QA Agent.",
    responsibilities: [
      "Review performance, security, UX, and business fit",
      "Run structured checklist reviews on deliverables",
      "Request revisions for missing or risky items"
    ],
    priorities: ["Quality Assurance", "Holistic Review"]
  },
  {
    id: 'planner',
    role: "Planner Agent",
    icon: CalendarDays,
    color: "text-indigo-400",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/30",
    glow: "glow-text-indigo",
    description: "You are the Planner Agent for long-running workflows.",
    responsibilities: [
      "Create multi-step implementation plans",
      "Phase out major features progressively",
      "Adjust plan based on execution reports"
    ],
    priorities: ["Strategic Phasing", "Workflow Orchestration"]
  },
  {
    id: 'hil',
    role: "Human-in-the-Loop Coordinator",
    icon: Users,
    color: "text-teal-400",
    bg: "bg-teal-500/10",
    border: "border-teal-500/30",
    glow: "glow-text-teal",
    description: "You are the Human-in-the-Loop Coordinator.",
    responsibilities: [
      "Expose swarm proposals in a review UI",
      "Capture user approvals, change requests, or comments",
      "Re-run agents with updated feedback"
    ],
    directives: ["Always allow user intervention and review."]
  },
  {
    id: 'knowledge',
    role: "Knowledge Agent",
    icon: BookOpen,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    glow: "glow-text-rose",
    description: "You are the Knowledge Agent.",
    responsibilities: [
      "Store past project outcomes and user feedback",
      "Check knowledge base before new tasks",
      "Suggest improvements based on learned patterns"
    ],
    priorities: ["Cross-project Learning", "Pattern Recognition"]
  }
];

const swarmIntelligence = [
  "Multi-agent swarm pattern with Dispatcher orchestration",
  "Self-healing / fallback behaviors for agent failures",
  "Holistic Evaluation / QA gates after every deliverable",
  "Long-running autonomous workflows via Planner Agent",
  "Tool-rich agents (web search, DB access, monitoring)",
  "Human-in-the-loop collaboration and review UI",
  "Cross-project learning via centralized Knowledge Base"
];

export function AgentDirectives() {
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(MASTER_SYSTEM_PROMPT);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([MASTER_SYSTEM_PROMPT], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resilient-ai-swarm-prompt.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto w-full max-w-7xl mx-auto space-y-6 relative">
      
      <div className="glass-panel p-6 rounded-lg mb-8 border border-[var(--color-cyber-border)] bg-black/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none">
           <Target className="w-64 h-64 text-[#00f3ff]" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-mono tracking-widest text-[#00f3ff] uppercase mb-2 glow-text-blue flex items-center gap-3">
              <Target className="w-8 h-8" /> 
              Swarm Intelligence & Resilience Layer
            </h2>
            <p className="text-sm font-mono text-gray-400 mb-6 max-w-3xl">
              A multi-agent system that collaboratively designs, builds, and evaluates full-stack software (frontend, backend, infra, security, and UX) in a collaborative, self-correcting way.
            </p>
          </div>
          <div>
             <button
               onClick={() => setIsPromptModalOpen(true)}
               className="flex items-center gap-2 bg-[#00f3ff]/20 hover:bg-[#00f3ff]/30 text-[#00f3ff] border border-[#00f3ff]/50 px-4 py-2 rounded-lg text-sm font-mono whitespace-nowrap transition-colors"
             >
               <FileText className="w-4 h-4" />
               View Master Prompt
             </button>
          </div>
        </div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {swarmIntelligence.map((v, i) => (
              <div key={i} className="flex items-center gap-3 bg-[#00f3ff]/5 border border-[#00f3ff]/20 p-3 rounded backdrop-blur-sm">
                 <CheckCircle2 className="w-5 h-5 text-[#00f3ff] flex-shrink-0" />
                 <span className="font-mono text-xs uppercase text-gray-300 tracking-wide">{v}</span>
              </div>
            ))}
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agentPrompts.map((agent) => {
          const Icon = agent.icon;
          return (
            <div key={agent.id} className={cn("glass-panel p-6 rounded-lg flex flex-col h-full border transition-all hover:bg-black/60", agent.border, agent.bg)}>
               <div className="flex items-center gap-4 mb-4">
                 <div className={cn("p-3 rounded-lg border flex items-center justify-center bg-black/50", agent.border, agent.color)}>
                   <Icon className="w-8 h-8" />
                 </div>
                 <div>
                   <h3 className={cn("text-xl font-bold font-mono uppercase tracking-widest", agent.color, agent.glow)}>
                     {agent.role}
                   </h3>
                   <div className="text-[10px] font-mono text-gray-500 uppercase tracking-wider mt-1">System Prompt Directive</div>
                 </div>
               </div>
               
               <p className="text-sm font-mono text-gray-300 mb-6 italic border-l-2 pl-3 border-gray-600">
                 "{agent.description}"
               </p>

               <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div>
                   <h4 className="text-xs font-mono tracking-widest text-gray-400 uppercase mb-3 border-b border-gray-700/50 pb-1">Responsibilities</h4>
                   <ul className="space-y-2">
                     {agent.responsibilities.map((resp, idx) => (
                       <li key={idx} className="flex items-start gap-2 text-xs font-mono text-gray-300">
                         <span className={cn("mt-[2px] opacity-70", agent.color)}>{'>'}</span>
                         <span>{resp}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
                 
                 <div className="flex flex-col gap-6">
                   {agent.priorities && (
                     <div>
                       <h4 className="text-xs font-mono tracking-widest text-gray-400 uppercase mb-3 border-b border-gray-700/50 pb-1">Always Prioritize</h4>
                       <div className="flex flex-wrap gap-2">
                         {agent.priorities.map((prior, idx) => (
                           <span key={idx} className={cn("text-[10px] uppercase font-mono px-2 py-1 rounded bg-black/50 border", agent.border, agent.color)}>
                             {prior}
                           </span>
                         ))}
                       </div>
                     </div>
                   )}
                   
                   {agent.directives && (
                     <div>
                       <h4 className="text-xs font-mono tracking-widest text-gray-400 uppercase mb-3 border-b border-gray-700/50 pb-1">Absolute Directives</h4>
                       <ul className="space-y-2">
                         {agent.directives.map((dir, idx) => (
                           <li key={idx} className={cn("flex items-start gap-2 text-xs font-mono font-bold uppercase", agent.color)}>
                             <span className="mt-[2px]">!!</span>
                             <span>{dir}</span>
                           </li>
                         ))}
                       </ul>
                     </div>
                   )}
                 </div>
               </div>
            </div>
          );
        })}
      </div>

      {/* Master Prompt Modal */}
      {isPromptModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel bg-gray-900 border border-[#00f3ff]/50 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl shadow-[#00f3ff]/10">
            
            <div className="bg-gray-900/95 border-b border-gray-800 p-4 flex items-center justify-between shrink-0">
               <h3 className="text-lg font-mono tracking-widest text-[#00f3ff] uppercase flex items-center gap-2 glow-text-blue">
                 <FileText className="w-5 h-5" />
                 System-Level Prompt: HERMES RESILIENCE-X
               </h3>
               <button 
                 onClick={() => setIsPromptModalOpen(false)}
                 className="text-gray-500 hover:text-white transition-colors"
               >
                 <X className="w-5 h-5" />
               </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 bg-black/40">
               <div className="bg-[#00f3ff]/5 border border-[#00f3ff]/20 rounded p-4 text-xs font-mono text-gray-300 mb-6 leading-relaxed">
                 This is the finalized, deployable system prompt. You can copy this prompt and use it in any LLM environment, Google AI Studio, or OpenAI platform to instantly initialize the complete HERMES RESILIENCE-X architecture.
               </div>
               
               <pre className="bg-black/80 border border-gray-700/50 rounded-lg p-6 font-mono text-xs text-green-400 whitespace-pre-wrap leading-relaxed overflow-x-auto selection:bg-[#00f3ff]/30">
                 {MASTER_SYSTEM_PROMPT}
               </pre>
            </div>

            <div className="p-4 border-t border-gray-800 bg-gray-900 flex justify-end gap-4 shrink-0">
               <button 
                 onClick={handleDownload}
                 className="flex items-center gap-2 px-4 py-2 border border-gray-700 hover:bg-gray-800 text-gray-300 rounded text-sm font-mono transition-colors"
               >
                 <Download className="w-4 h-4" />
                 Export .md
               </button>
               <button 
                 onClick={handleCopy}
                 className="flex items-center gap-2 px-4 py-2 bg-[#00f3ff]/20 hover:bg-[#00f3ff]/30 border border-[#00f3ff]/50 text-[#00f3ff] rounded text-sm font-mono transition-colors min-w-[120px] justify-center"
               >
                 {copySuccess ? (
                   <>
                     <CheckCircle2 className="w-4 h-4" />
                     Copied!
                   </>
                 ) : (
                   <>
                     <Copy className="w-4 h-4" />
                     Copy Prompt
                   </>
                 )}
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
