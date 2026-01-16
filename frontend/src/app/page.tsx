"use client";
import React, { useState, useEffect, ChangeEvent } from 'react';
import { Plus, FileText, Headphones, Music, Loader2, Zap, Play, Download } from 'lucide-react';

interface FileData {
  name: string;
  audioUrl: string;
  cardsUrl?: string;
}

export default function ShelfAI_Dev() {
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
    <div className="flex min-h-screen bg-[#050507] text-slate-200 font-sans">
      <aside className="w-80 border-r border-white/5 bg-white/[0.02] p-8 flex flex-col">
        <div className="mb-10 flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-white fill-current" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">Shelf<span className="text-orange-500 italic">DEV</span></h1>
        </div>
        
        <label className="block p-6 border border-dashed border-white/10 rounded-2xl text-center cursor-pointer hover:bg-white/[0.02] mb-10">
          <Plus className="mx-auto mb-2 text-orange-400" />
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Test New Feature</span>
          <input type="file" className="hidden" onChange={handleUpload} />
        </label>

        <nav className="flex-1 space-y-4 overflow-y-auto">
          {files.map((f, i) => (
            <div key={i} onClick={() => setActiveFile(f)} className={`p-4 rounded-2xl cursor-pointer border ${activeFile?.name === f.name ? 'bg-orange-500/10 border-orange-500/40' : 'bg-white/[0.03] border-white/5'}`}>
              <p className="text-[12px] font-bold truncate text-white uppercase">{f.name}</p>
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col items-center justify-center p-12">
        {loading ? (
          <Loader2 className="w-16 h-16 animate-spin text-orange-500" />
        ) : activeFile ? (
          <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-12 w-full max-w-2xl text-center">
            <h2 className="text-4xl font-black text-white mb-8 italic uppercase tracking-tighter">{activeFile.name}</h2>
            <div className="flex justify-center gap-6">
              <button onClick={() => new Audio(activeFile.audioUrl).play()} className="px-8 py-4 bg-orange-600 rounded-2xl flex items-center gap-3 font-bold uppercase text-xs tracking-widest">
                <Play className="w-4 h-4 fill-current" /> Play Audio
              </button>
              {activeFile.cardsUrl && (
                <a href={activeFile.cardsUrl} download className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 font-bold uppercase text-xs tracking-widest hover:bg-white/10">
                  <Download className="w-4 h-4" /> Download Anki
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center opacity-20"><Headphones className="w-20 h-20 mx-auto mb-4" /><p className="font-bold uppercase tracking-[0.3em] text-xs">Sandbox Mode</p></div>
        )}
      </main>
    </div>
  );
}
