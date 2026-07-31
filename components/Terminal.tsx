import React, { useState, useEffect, useRef } from "react";
import {
  Terminal as TerminalIcon,
  Wifi,
  Battery,
  Command,
  Cpu,
  Activity,
  Server,
  Zap,
  MousePointer2,
} from "lucide-react";
import {
  PERSONAL_INFO,
  EXPERIENCE,
  PROJECTS,
  SKILLS,
  EDUCATION,
} from "../constants";
import { motion, AnimatePresence } from "framer-motion";

interface HistoryItem {
  id: number;
  type: "command" | "output";
  content: React.ReactNode;
}

const Terminal: React.FC = () => {
  const initialOutput = `INITIALIZING PORTFOLIO KERNEL...\nLOADED MODULES: [EXPERIENCE, PROJECTS, SKILLS]\nSTATUS: IMMEDIATELY AVAILABLE FOR HIRE\n\nWelcome to ${PERSONAL_INFO.name}'s Interactive Terminal.\nType 'help' to access the system.`;

  const [input, setInput] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([
    { id: 0, type: "output", content: initialOutput },
  ]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of terminal content only
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input on click
  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const newHistory = [
      ...history,
      { id: Date.now(), type: "command" as const, content: cmd },
    ];

    // Add to command history for up/down arrow navigation
    if (trimmedCmd) {
      setCommandHistory((prev) => [...prev, cmd]);
      setHistoryIndex(-1);
    }

    let response: React.ReactNode;

    switch (trimmedCmd) {
      case "help":
        response = (
          <div className="text-slate-300 space-y-2 font-mono text-sm">
            <p className="text-accent mb-2"> AVAILABLE_COMMANDS_V1.0</p>
            <div className="grid grid-cols-[120px_1fr] gap-2 border-l-2 border-slate-700 pl-3">
              <span className="text-green-400 font-bold">about</span>{" "}
              <span>System Identity</span>
              <span className="text-green-400 font-bold">experience</span>{" "}
              <span>Execution History</span>
              <span className="text-green-400 font-bold">projects</span>{" "}
              <span>Deployed Units</span>
              <span className="text-green-400 font-bold">skills</span>{" "}
              <span>Capabilities</span>
              <span className="text-green-400 font-bold">education</span>{" "}
              <span>Knowledge Base</span>
              <span className="text-green-400 font-bold">contact</span>{" "}
              <span>Establish Connection</span>
              <span className="text-yellow-400 font-bold">clear</span>{" "}
              <span>Flush Buffer</span>
            </div>
          </div>
        );
        break;

      case "about":
      case "whoami":
        response = (
          <div className="space-y-2 font-mono border-l-2 border-accent pl-4 py-2 bg-accent/5">
            <p className="text-white font-bold text-lg">{PERSONAL_INFO.name}</p>
            <p className="text-slate-300">{PERSONAL_INFO.summary}</p>
            <p className="text-slate-500 text-xs">
              Lat/Long: {PERSONAL_INFO.location}
            </p>
          </div>
        );
        break;

      case "experience":
        response = (
          <div className="space-y-6">
            {EXPERIENCE.map((exp, i) => (
              <div
                key={i}
                className="relative pl-4 border-l border-slate-700 hover:border-accent transition-colors"
              >
                <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 bg-slate-900 border border-accent rounded-full" />
                <div className="flex flex-wrap gap-x-3 items-baseline mb-1">
                  <span className="text-accent font-bold uppercase tracking-wider">
                    {exp.role}
                  </span>
                  <span className="text-slate-500 text-xs">
                    @ {exp.company}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 font-mono mb-2 uppercase">
                  {exp.period}
                </div>
                <ul className="space-y-1">
                  {exp.description.slice(0, 3).map((d, j) => (
                    <li key={j} className="text-slate-300 text-xs flex gap-2">
                      <span className="text-slate-600"></span>
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        );
        break;

      case "projects":
        response = (
          <div className="grid md:grid-cols-2 gap-3">
            {PROJECTS.map((proj, i) => (
              <div
                key={i}
                className="bg-slate-900/50 p-3 rounded border border-slate-700 hover:border-accent/50 transition-colors group"
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="text-green-400 font-bold font-mono text-sm group-hover:text-accent transition-colors">
                    {proj.name}
                  </div>
                  <div className="text-[10px] bg-slate-800 text-slate-400 px-1 rounded">
                    PROJ-{i + 1}
                  </div>
                </div>
                <p className="text-slate-400 text-xs mb-2 line-clamp-2">
                  {proj.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {proj.tech.slice(0, 3).map((t, k) => (
                    <span
                      key={k}
                      className="text-[9px] bg-slate-800 text-slate-500 px-1 rounded border border-slate-700/50"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
        break;

      case "skills":
        response = (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SKILLS.map((cat, i) => (
              <div key={i}>
                <span className="text-accent font-bold text-xs uppercase block mb-1 border-b border-slate-800 pb-1">
                  {cat.category}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {cat.items.map((item, j) => (
                    <span key={j} className="text-slate-300 text-xs font-mono">
                      [{item}]
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
        break;

      case "education":
        response = (
          <div>
            {EDUCATION.map((edu, i) => (
              <div
                key={i}
                className="bg-slate-900/30 p-3 border-l-2 border-yellow-500"
              >
                <div className="text-white font-bold">{edu.institution}</div>
                <div className="text-slate-300 text-sm">{edu.degree}</div>
                <div className="text-slate-500 text-xs font-mono mt-1 flex justify-between">
                  <span>{edu.period}</span>
                  {/* <span>SCORE: {edu.score}</span> */}
                </div>
              </div>
            ))}
          </div>
        );
        break;

      case "contact":
        response = (
          <div className="space-y-2 bg-slate-900/50 p-4 rounded border border-dashed border-slate-700">
            <div className="flex justify-between items-center text-xs text-slate-500 font-mono mb-2 border-b border-slate-800 pb-2">
              <span>COMM_CHANNEL_OPEN</span>
              <span className="animate-pulse text-green-500">
                ● ONLINE / IMMEDIATELY AVAILABLE
              </span>
            </div>
            <div>
              <span className="text-accent w-16 inline-block">EMAIL</span>{" "}
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="text-white hover:underline"
              >
                {PERSONAL_INFO.email}
              </a>
            </div>
            <div>
              <span className="text-accent w-16 inline-block">PHONE</span>{" "}
              <span className="text-white">{PERSONAL_INFO.phone}</span>
            </div>
            <div className="flex gap-4 mt-3 pt-3 border-t border-slate-800">
              {PERSONAL_INFO.socials.map((s, i) => (
                <a
                  key={i}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-slate-800 hover:bg-white hover:text-black px-2 py-1 rounded transition-colors uppercase"
                >
                  {s.name}
                </a>
              ))}
            </div>
          </div>
        );
        break;

      case "clear":
        setHistory([{ id: 0, type: "output", content: initialOutput }]);
        setInput("");
        return;

      case "":
        response = null;
        break;

      default:
        response = (
          <span className="text-red-400 font-mono">
            ERR: UNKNOWN_COMMAND '{trimmedCmd}'. EXECUTE 'help' FOR MANUAL.
          </span>
        );
    }

    if (response) {
      newHistory.push({
        id: Date.now() + 1,
        type: "output",
        content: response,
      });
    }

    setHistory(newHistory);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <section className="py-20 px-4 md:px-8 relative overflow-hidden z-20">
      {/* Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.6fr_1fr] gap-12 items-center relative z-10">
        {/* Left Column: Terminal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, x: -30 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "backOut" }}
          className="w-full"
        >
          <div className="relative rounded-xl overflow-hidden bg-slate-900/95 border border-slate-700/50 shadow-[0_0_50px_-10px_rgba(56,189,248,0.2)] h-[550px] flex flex-col">
            {/* CRT Effect */}
            <div className="absolute inset-0 pointer-events-none z-20 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />

            {/* Terminal Header */}
            <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-800 relative z-30">
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex items-center gap-2 text-slate-400 text-xs font-mono bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                  <Command size={12} />
                  <span>Portfolio_CLI</span>
                </div>
              </div>
            </div>

            {/* Terminal Body */}
            <div
              ref={scrollRef}
              className="flex-1 p-6 md:p-8 overflow-y-auto custom-scrollbar cursor-text bg-slate-900/50 font-mono text-sm relative z-10"
              onClick={handleContainerClick}
            >
              <div className="space-y-4">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className={`${item.type === "command" ? "mt-6" : "mb-2"}`}
                  >
                    {item.type === "command" ? (
                      <div className="flex items-center gap-3 text-slate-300">
                        <span className="text-green-500 font-bold">➜</span>
                        <span className="text-blue-400 font-bold">~</span>
                        <span className="text-white font-semibold tracking-wide">
                          {item.content}
                        </span>
                      </div>
                    ) : (
                      <div className="text-slate-300 leading-relaxed ml-0 animate-in fade-in slide-in-from-left-2 duration-300">
                        {item.content}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Active Input */}
              <div className="flex items-center gap-3 mt-6 text-slate-300">
                <span className="text-green-500 font-bold">➜</span>
                <span className="text-blue-400 font-bold">~</span>
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="bg-transparent border-none outline-none w-full text-white font-semibold caret-transparent"
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                  />
                  <motion.span
                    animate={{ opacity: [1, 1, 0, 0] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      times: [0, 0.5, 0.5, 1],
                    }}
                    className="absolute top-0 bottom-0 w-2.5 bg-accent/80 shadow-[0_0_8px_rgba(56,189,248,0.8)] pointer-events-none"
                    style={{ left: `${input.length}ch` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Context/Info Panel */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hidden lg:block space-y-8"
        >
          <div>
            <h3 className="text-sm font-mono text-accent mb-2 tracking-widest uppercase flex items-center gap-2">
              <TerminalIcon size={16} />
              System Interface
            </h3>
            <h2 className="text-4xl font-bold font-display text-white mb-4">
              Direct <br />
              <span className="text-slate-500">Database Access</span>
            </h2>
            <p className="text-slate-400 leading-relaxed border-l-2 border-slate-800 pl-4">
              For the developers and the curious: bypass the GUI and query the
              raw data directly. This interface provides a direct link to my
              professional background, technical stack, and contact protocols.
            </p>
          </div>

          {/* Quick Actions Panel */}
          <div className="glass-card p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-2">
              <span className="text-xs font-mono text-slate-500 uppercase">
                Quick Execute
              </span>
              <div className="flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] font-mono text-green-500">
                  SYSTEM READY
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {["experience", "skills", "projects", "contact"].map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => handleCommand(cmd)}
                  className="group glass-chip flex items-center justify-between px-4 py-3 rounded-lg hover:border-accent/50 hover:bg-accent/5 transition-all text-left"
                >
                  <span className="text-sm font-mono text-slate-300 group-hover:text-white">
                    <span className="text-accent opacity-50 group-hover:opacity-100 mr-2">
                      $
                    </span>
                    {cmd}
                  </span>
                  <MousePointer2
                    size={14}
                    className="text-slate-600 group-hover:text-accent opacity-0 group-hover:opacity-100 transition-opacity transform -rotate-45"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Decor Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="glass-card p-4 rounded-xl text-center">
              <Cpu size={20} className="mx-auto text-slate-500 mb-2" />
              <div className="text-xs text-slate-500 font-mono mb-1">
                CPU LOAD
              </div>
              <div className="text-accent font-bold">12%</div>
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <Server size={20} className="mx-auto text-slate-500 mb-2" />
              <div className="text-xs text-slate-500 font-mono mb-1">
                MEMORY
              </div>
              <div className="text-accent font-bold">64MB</div>
            </div>
            <div className="glass-card p-4 rounded-xl text-center">
              <Zap size={20} className="mx-auto text-slate-500 mb-2" />
              <div className="text-xs text-slate-500 font-mono mb-1">
                UPTIME
              </div>
              <div className="text-accent font-bold">99.9%</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Terminal;
