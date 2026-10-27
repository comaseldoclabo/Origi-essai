/**
 * Main Top Header
 * App branding, project title, format preset selector, undo/redo, and export
 */

import React, { useState } from 'react';
import {
  Undo2,
  Redo2,
  Download,
  Play,
  Sparkles,
  Maximize2,
  ChevronDown,
  Layers,
  FileCode,
} from 'lucide-react';
import { ORIGI_FORMATS } from '../../data/brandKit';
import { PresetFormat } from '../../types/canvas';

interface HeaderProps {
  projectTitle: string;
  currentWidth: number;
  currentHeight: number;
  canUndo: boolean;
  canRedo: boolean;
  onUpdateTitle: (title: string) => void;
  onSelectFormat: (format: PresetFormat) => void;
  onUndo: () => void;
  onRedo: () => void;
  onOpenExport: () => void;
  onOpenPresentation: () => void;
  onOpenAI: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  projectTitle,
  currentWidth,
  currentHeight,
  canUndo,
  canRedo,
  onUpdateTitle,
  onSelectFormat,
  onUndo,
  onRedo,
  onOpenExport,
  onOpenPresentation,
  onOpenAI,
}) => {
  const [showFormatDropdown, setShowFormatDropdown] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  return (
    <header className="h-14 bg-[#0E0F14] border-b border-white/[0.08] px-4 flex items-center justify-between z-30 select-none">
      {/* Brand & Project Title */}
      <div className="flex items-center gap-4">
        {/* Origi Studio Brand Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-[#C2A378] text-black font-extrabold flex items-center justify-center font-['Syne'] text-sm tracking-tighter shadow-sm">
            O
          </div>
          <div className="flex flex-col">
            <span className="font-['Syne'] font-bold text-white text-sm tracking-widest leading-none">
              ORIGI
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#C2A378] uppercase leading-tight">
              CANVAS STUDIO
            </span>
          </div>
        </div>

        <div className="w-[1px] h-6 bg-white/10 hidden sm:block" />

        {/* Inline editable project title */}
        <div className="hidden sm:flex items-center">
          {isEditingTitle ? (
            <input
              type="text"
              autoFocus
              defaultValue={projectTitle}
              onBlur={(e) => {
                setIsEditingTitle(false);
                if (e.target.value.trim()) onUpdateTitle(e.target.value.trim());
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  setIsEditingTitle(false);
                  if (e.currentTarget.value.trim()) onUpdateTitle(e.currentTarget.value.trim());
                }
              }}
              className="bg-[#1C1E26] text-white text-xs font-medium px-2 py-1 rounded border border-[#C2A378] outline-none"
            />
          ) : (
            <button
              onClick={() => setIsEditingTitle(true)}
              className="text-xs text-zinc-300 font-medium hover:text-white px-2 py-1 rounded hover:bg-white/[0.04] transition-colors truncate max-w-[200px]"
              title="Cliquer pour renommer"
            >
              {projectTitle}
            </button>
          )}
        </div>

        {/* Format Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowFormatDropdown(!showFormatDropdown)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#161822] border border-white/[0.08] hover:border-white/20 text-xs text-zinc-300 transition-colors"
          >
            <span className="font-mono text-[11px] text-[#C2A378]">
              {currentWidth} × {currentHeight}
            </span>
            <ChevronDown size={12} className="text-zinc-500" />
          </button>

          {showFormatDropdown && (
            <div className="absolute top-full left-0 mt-1.5 w-60 bg-[#161822] border border-white/10 rounded-lg shadow-2xl py-1 z-50 text-xs">
              <div className="px-3 py-1.5 text-[10px] font-mono text-zinc-400 uppercase tracking-wider border-b border-white/[0.06]">
                Changer le format du canevas
              </div>
              {ORIGI_FORMATS.map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => {
                    onSelectFormat(fmt);
                    setShowFormatDropdown(false);
                  }}
                  className="w-full px-3 py-2 text-left hover:bg-white/[0.06] flex items-center justify-between text-zinc-300 hover:text-white transition-colors"
                >
                  <span className="font-medium">{fmt.name}</span>
                  <span className="text-[10px] font-mono text-zinc-500">
                    {fmt.width}×{fmt.height}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Middle: Undo / Redo */}
      <div className="flex items-center gap-1">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="p-2 rounded hover:bg-white/[0.06] text-zinc-300 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="Annuler (Ctrl+Z)"
        >
          <Undo2 size={15} />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="p-2 rounded hover:bg-white/[0.06] text-zinc-300 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          title="Rétablir (Ctrl+Y)"
        >
          <Redo2 size={15} />
        </button>
      </div>

      {/* Right actions: AI Generator, Presentation, Export */}
      <div className="flex items-center gap-2">
        {/* Magic AI Button */}
        <button
          onClick={onOpenAI}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded bg-gradient-to-r from-[#C2A378]/20 to-[#C2A378]/10 border border-[#C2A378]/40 hover:border-[#C2A378] text-[#C2A378] text-xs font-medium transition-all"
        >
          <Sparkles size={13} />
          <span>Générateur IA</span>
        </button>

        {/* Presentation Mode */}
        <button
          onClick={onOpenPresentation}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-white/[0.04] border border-white/10 hover:bg-white/10 text-zinc-300 text-xs transition-colors"
          title="Aperçu Plein Écran"
        >
          <Play size={13} />
          <span className="hidden sm:inline">Présentation</span>
        </button>

        {/* Export Button (Canva Download) */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-[#C2A378] text-black text-xs font-semibold hover:bg-[#d6b78d] transition-all shadow-md active:scale-95"
        >
          <Download size={13} />
          <span>Exporter</span>
        </button>
      </div>
    </header>
  );
};
