import React, { useState, useEffect } from 'react';
import { ThemeFileNode } from '../types';
import { X, Code, Copy, Check, FileText, Folder, Eye } from 'lucide-react';

interface ThemeInspectorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeInspectorDrawer: React.FC<ThemeInspectorDrawerProps> = ({ isOpen, onClose }) => {
  const [themeTree, setThemeTree] = useState<ThemeFileNode[]>([]);
  const [selectedFile, setSelectedFile] = useState<ThemeFileNode | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/theme/files')
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.files) {
            setThemeTree(data.files);
            // Select Hero.vue or en.json as initial file
            const heroFile = findFile(data.files, 'Hero.vue');
            if (heroFile) setSelectedFile(heroFile);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [isOpen]);

  const findFile = (nodes: ThemeFileNode[], name: string): ThemeFileNode | null => {
    for (const node of nodes) {
      if (node.type === 'file' && node.name === name) return node;
      if (node.type === 'directory' && node.children) {
        const found = findFile(node.children, name);
        if (found) return found;
      }
    }
    return null;
  };

  const handleCopyCode = () => {
    if (selectedFile && selectedFile.content) {
      navigator.clipboard.writeText(selectedFile.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  const renderTree = (nodes: ThemeFileNode[]) => {
    return (
      <ul className="space-y-1 pl-2">
        {nodes.map((node) => (
          <li key={node.path}>
            {node.type === 'directory' ? (
              <div className="space-y-1">
                <div className="flex items-center space-x-1.5 gap-1.5 text-xs font-bold text-amber-800 py-1">
                  <Folder className="w-3.5 h-3.5 text-amber-600" />
                  <span>{node.name}</span>
                </div>
                {node.children && renderTree(node.children)}
              </div>
            ) : (
              <button
                onClick={() => setSelectedFile(node)}
                className={`w-full text-left px-2.5 py-1.5 rounded-xl text-xs font-mono flex items-center space-x-2 gap-2 transition-colors ${
                  selectedFile?.path === node.path
                    ? 'bg-rose-500 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-amber-100/60'
                }`}
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{node.name}</span>
              </button>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 text-slate-100 w-full max-w-4xl h-full shadow-2xl flex flex-col border-l border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5 gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white font-heading">
                Nuxiox Theme Spec Code Inspector
              </h3>
              <p className="text-[11px] text-slate-400">
                Generated Vue 3 SFCs, i18n Locales (EN/FA/AR), & UI Modals
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer Body: Sidebar + Editor */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 overflow-hidden">
          {/* File Explorer Sidebar */}
          <div className="p-4 bg-slate-950/60 border-r border-slate-800 overflow-y-auto max-h-full">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center space-x-1.5 gap-1.5">
              <Folder className="w-3.5 h-3.5 text-rose-400" />
              <span>kindergarten-theme</span>
            </h4>
            {loading ? (
              <p className="text-xs text-slate-500">Loading files...</p>
            ) : (
              renderTree(themeTree)
            )}
          </div>

          {/* Code Viewer Panel */}
          <div className="md:col-span-2 flex flex-col bg-slate-900 h-full overflow-hidden">
            {selectedFile ? (
              <>
                <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-rose-400">
                    {selectedFile.path}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center space-x-1.5 gap-1.5 px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy File</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed text-slate-300 bg-slate-950/40">
                  <pre className="whitespace-pre-wrap">{selectedFile.content}</pre>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 text-xs">
                <Eye className="w-8 h-8 mb-2 text-slate-600" />
                <p>Select a Vue SFC or i18n JSON file from the left sidebar to inspect its source code.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
