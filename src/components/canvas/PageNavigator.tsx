/**
 * Page Navigator & Canvas Viewport Dock
 * Bottom floating controls for pages, zoom presets, and viewport scale
 */

import React from 'react';
import { Plus, Copy, Trash2, ZoomIn, ZoomOut, Maximize2, Layers } from 'lucide-react';
import { CanvasPage } from '../../types/canvas';

interface PageNavigatorProps {
  pages: CanvasPage[];
  currentPageIndex: number;
  zoom: number;
  onSelectPage: (index: number) => void;
  onAddPage: () => void;
  onDuplicatePage: (index: number) => void;
  onDeletePage: (index: number) => void;
  onZoomChange: (newZoom: number) => void;
  onFitScreen: () => void;
}

export const PageNavigator: React.FC<PageNavigatorProps> = ({
  pages,
  currentPageIndex,
  zoom,
  onSelectPage,
  onAddPage,
  onDuplicatePage,
  onDeletePage,
  onZoomChange,
  onFitScreen,
}) => {
  const currentPage = pages[currentPageIndex] || pages[0];

  return (
    <footer className="h-12 bg-[#121318] border-t border-white/[0.08] px-4 flex items-center justify-between z-20 text-xs text-zinc-300">
      {/* Pages switcher */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 bg-[#181A22] p-1 rounded-md border border-white/[0.06]">
          <Layers size={13} className="text-[#C2A378] ml-1.5 mr-0.5" />
          <span className="text-[11px] font-medium text-zinc-400 mr-1">Pages:</span>

          {pages.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => onSelectPage(idx)}
              className={`px-2.5 py-1 text-xs rounded transition-all font-mono ${
                idx === currentPageIndex
                  ? 'bg-[#C2A378] text-black font-semibold shadow-sm'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              {idx + 1}
            </button>
          ))}

          {/* Add Page Button */}
          <button
            onClick={onAddPage}
            title="Ajouter une page blanche"
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Duplicate page */}
        <button
          onClick={() => onDuplicatePage(currentPageIndex)}
          title="Dupliquer la page active"
          className="p-1.5 rounded bg-[#181A22] border border-white/[0.06] text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <Copy size={13} />
        </button>

        {/* Delete page */}
        {pages.length > 1 && (
          <button
            onClick={() => onDeletePage(currentPageIndex)}
            title="Supprimer la page"
            className="p-1.5 rounded bg-[#181A22] border border-white/[0.06] text-red-400/80 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {/* Center canvas metrics */}
      <div className="hidden md:flex items-center gap-2 text-zinc-500 font-mono text-[11px]">
        <span>{currentPage.name}</span>
        <span>·</span>
        <span>{currentPage.width} × {currentPage.height} px</span>
      </div>

      {/* Right zoom & scale controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={onFitScreen}
          title="Ajuster à l'écran"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#181A22] border border-white/[0.06] text-zinc-300 hover:text-white hover:bg-white/[0.06] transition-colors text-[11px]"
        >
          <Maximize2 size={12} className="text-[#C2A378]" />
          <span>Ajuster</span>
        </button>

        <div className="flex items-center bg-[#181A22] rounded border border-white/[0.06] p-0.5">
          <button
            onClick={() => onZoomChange(Math.max(0.15, zoom - 0.1))}
            title="Zoom arrière"
            className="p-1 text-zinc-400 hover:text-white rounded hover:bg-white/[0.04]"
          >
            <ZoomOut size={13} />
          </button>

          <span className="w-12 text-center font-mono text-[11px] text-zinc-300 font-medium">
            {Math.round(zoom * 100)}%
          </span>

          <button
            onClick={() => onZoomChange(Math.min(3, zoom + 0.1))}
            title="Zoom avant"
            className="p-1 text-zinc-400 hover:text-white rounded hover:bg-white/[0.04]"
          >
            <ZoomIn size={13} />
          </button>
        </div>
      </div>
    </footer>
  );
};
