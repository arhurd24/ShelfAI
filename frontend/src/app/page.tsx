"use client";
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Plus, FileText, Headphones, Music, Loader2, Zap, Play, Download, Clock } from 'lucide-react';

interface FileData {
  name: string;
  audioUrl: string;
  cardsUrl?: string;
}

export default function ShelfAI_v2_Dev() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [activeFile, setActiveFile] = useState<FileData | null>(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch(`${API_BASE}/files`);
        const data = await res.json();
        setFiles(data);
      } catch (err) { console.error("Sync Error", err); }
    };
    if(API_BASE) fetchFiles();
  }, [API_BASE]);

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      setFiles(prev => [data, ...prev]);
      setActiveFile(data);
    } catch (err) { alert("Dev Brain Offline"); }
    finally { setLoading(false); }
  };

  return (
    <div className="flex min-h-screen bg-[#050507] text-slate-200 font-sans selection:bg-orange-500/30">
      
      {/* SIDEBAR */}
      <aside className="w-80 border-r border-white/5 bg-white/[0.02] backdrop-blur-xl p-8 flex flex-col">
        <div className="mb-10 flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(234,88,12,0.4)]">
            <Zap className="w-5 h-5 text-white fill-current" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">ShelfAI<span className="text-orange-500 italic ml-1">(DEV)</span></h1>
        </div>
        
        <label className="group relative block p-6 border border-dashed border-white/10 rounded-2xl text-center cursor-pointer hover:border-orange-500/50 hover:bg-white/[0.02] transition-all duration-300 mb-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <Plus className="mx-auto mb-2 text-orange-400 group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-white transition-colors">Import Dev Source</span>
          <input type="file" className="hidden" onChange={handleUpload} />
        </label>

        <nav className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 text-orange-500/50">Sandbox Assets</h2>
          {files.map((f, i) => (
            <div 
              key={i} 
              onClick={() => setActiveFile(f)}
              className={`group p-4 rounded-2xl cursor-pointer transition-all border ${activeFile?.name === f.name ? 'bg-orange-600/10 border-orange-500/40 shadow-lg' : 'bg-white/[0.03] border-white/5 hover:border-white/20'}`}
            >
              <div className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${activeFile?.name === f.name ? 'bg-orange-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-orange-400'}`}>
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold truncate text-white uppercase tracking-tight">{f.name}</p>
                  <p className="text-[10px] text-slate-500 font-medium italic underline decoration-orange-500/30">Dev Environment</p>
                </div>
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 flex flex-col bg-gradient-to-b from-[#0e0a0a] to-[#050507]">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-12">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 px-3 py-1 bg-orange-500/10 rounded-full border border-orange-500/20">
                    <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-orange-500 uppercase tracking-tighter italic font-mono">Experimental Branch Active</span>
                </div>
            </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-12 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-600/10 blur-[120px] rounded-full pointer-events-none" />

          {loading ? (
            <div className="z-10 text-center animate-in fade-in duration-700">
              <Loader2 className="w-16 h-16 animate-spin text-orange-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2 tracking-tight">Processing Sandbox Logic...</h3>
            </div>
          ) : activeFile ? (
            <div className="z-10 w-full max-w-4xl animate-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-12 backdrop-blur-md shadow-2xl">
                <div className="flex items-start justify-between mb-12">
                  <div className="flex-1">
                    <h2 className="text-4xl font-black text-white mb-4 tracking-tighter italic uppercase underline decoration-orange-500/20">{activeFile.name}</h2>
                    <div className="flex gap-4 text-orange-400">
                        <Zap className="w-3 h-3 fill-current" />
                        <span className="text-[10px] font-bold uppercase tracking-wider font-mono">Dev Analysis Active</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {activeFile.cardsUrl && (
                        <a 
                            href={activeFile.cardsUrl} 
                            target="_blank"
                            className="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-orange-500/20 transition group"
                            title="Download Anki Cards"
                        >
                            <Download className="w-5 h-5 text-slate-300 group-hover:text-orange-400" />
                        </a>
                    )}
                    <button 
                      onClick={() => new Audio(activeFile.audioUrl).play()}
                      className="flex items-center gap-3 px-8 py-4 bg-orange-600 rounded-2xl hover:bg-orange-500 transition shadow-[0_10px_30px_rgba(234,88,12,0.3)] group"
                    >
                        <Play className="w-5 h-5 text-white fill-current group-hover:scale-110 transition" />
                        <span className="font-black text-xs uppercase tracking-[0.1em]">Test Briefing</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 opacity-50">
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                        <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1 italic text-center">Dev Storage Connected</p>
                    </div>
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                        <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1 italic">Testing Logic: Prompt v2</p>
                    </div>
                    <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl text-center">
                        <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1 italic">Vercel: Preview Mode</p>
                    </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="z-10 text-center">
              <div className="w-24 h-24 bg-orange-600/5 rounded-[2rem] border border-white/5 flex items-center justify-center mb-8 mx-auto rotate-12">
                <Headphones className="w-10 h-10 text-slate-700" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3 tracking-tighter italic uppercase">Dev Sandbox</h2>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] max-w-sm mx-auto leading-loose italic underline decoration-orange-500/20">
                Safely test new prompts & voices here.
              </p>
            </div>
          )}
        </div>

        {/* FOOTER PLAYER */}
        {activeFile && (
            <footer className="h-24 border-t border-white/5 bg-[#050507] flex items-center px-12 gap-8 z-20">
                <div className="flex items-center gap-4 w-64">
                    <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center shrink-0">
                        <Music className="w-5 h-5 text-white" />
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-[11px] font-bold text-white truncate uppercase tracking-tight italic">{activeFile.name}</p>
                        <p className="text-[9px] text-orange-500/70 uppercase tracking-widest italic font-mono">Debug Audio Stream</p>
                    </div>
                </div>
                <div className="flex-1">
                   <audio key={activeFile.audioUrl} controls src={activeFile.audioUrl} className="w-full h-8 accent-orange-500" />
                </div>
            </footer>
        )}
      </main>
    </div>
  );
}
