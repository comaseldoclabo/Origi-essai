/**
 * Presentation Modal
 * Fullscreen presentation / slideshow preview
 */

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { CanvasPage } from '../../types/canvas';
import { CanvasElementView } from '../canvas/CanvasElementView';

interface PresentationModalProps {
  pages: CanvasPage[];
  initialPageIndex: number;
  onClose: () => void;
}

export const PresentationModal: React.FC<PresentationModalProps> = ({
  pages,
  initialPageIndex,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialPageIndex);
  const currentPage = pages[currentIndex] || pages[0];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        setCurrentIndex((prev) => Math.min(pages.length - 1, prev + 1));
      }
      if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => Math.max(0, prev - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pages.length, onClose]);

  // Compute scale to fit viewport with padding
  const viewportWidth = window.innerWidth * 0.9;
  const viewportHeight = window.innerHeight * 0.85;
  const scale = Math.min(viewportWidth / currentPage.width, viewportHeight / currentPage.height, 1);

  return (
    <div className="fixed inset-0 z-50 bg-[#07080A] flex flex-col items-center justify-center p-6 select-none">
      {/* Top Bar */}
      <div className="absolute top-4 left-6 right-6 flex items-center justify-between text-xs text-zinc-400 z-50">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C2A378]" />
          <span className="font-semibold text-white tracking-widest uppercase font-mono text-[11px]">
            ORIGI ATELIER · PRÉSENTATION
          </span>
          <span className="text-zinc-600">·</span>
          <span>{currentPage.name}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-zinc-400">
            Page {currentIndex + 1} / {pages.length}
          </span>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            title="Quitter la présentation (Échap)"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div className="flex items-center justify-center w-full h-full overflow-hidden">
        <div
          style={{
            width: `${currentPage.width}px`,
            height: `${currentPage.height}px`,
            backgroundColor: currentPage.backgroundColor || '#0C0D11',
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
          }}
          className="relative shadow-2xl rounded-sm overflow-hidden"
        >
          {/* Elements */}
          {[...currentPage.elements]
            .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
            .map((el) => {
              if (el.visible === false) return null;
              return (
                <div
                  key={el.id}
                  style={{
                    position: 'absolute',
                    left: `${el.x}px`,
                    top: `${el.y}px`,
                    width: `${el.width}px`,
                    height: `${el.height}px`,
                    transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                    opacity: el.opacity ?? 1,
                    zIndex: el.zIndex || 1,
                  }}
                >
                  <CanvasElementView element={el} isSelected={false} />
                </div>
              );
            })}
        </div>
      </div>

      {/* Navigation Controls Bottom */}
      {pages.length > 1 && (
        <div className="absolute bottom-6 flex items-center gap-3 bg-[#14151D] border border-white/10 px-4 py-2 rounded-full shadow-xl z-50">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="text-xs font-mono text-zinc-300">
            {currentIndex + 1} / {pages.length}
          </span>

          <button
            disabled={currentIndex === pages.length - 1}
            onClick={() => setCurrentIndex((prev) => Math.min(pages.length - 1, prev + 1))}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white disabled:opacity-30 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
