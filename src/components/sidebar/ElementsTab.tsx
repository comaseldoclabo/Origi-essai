/**
 * Elements Tab
 * Geometric shapes, architectural arches, decorative lines, and studio stamps
 */

import React from 'react';
import { Square, Circle, Minus, Star, Shield, Milestone } from 'lucide-react';
import { CanvasElement, ShapeElement, LineElement } from '../../types/canvas';
import { GRAPHIC_SHAPES } from '../../data/mediaLibrary';

interface ElementsTabProps {
  onAddElement: (element: CanvasElement) => void;
  canvasWidth: number;
  canvasHeight: number;
}

export const ElementsTab: React.FC<ElementsTabProps> = ({
  onAddElement,
  canvasWidth,
  canvasHeight,
}) => {
  const addPresetShape = (preset: typeof GRAPHIC_SHAPES[0]) => {
    const newEl: ShapeElement = {
      id: `shape-${Date.now()}`,
      type: 'shape',
      name: preset.name,
      shapeType: preset.shapeType,
      x: Math.round((canvasWidth - preset.width) / 2),
      y: Math.round((canvasHeight - preset.height) / 2),
      width: preset.width,
      height: preset.height,
      rotation: 0,
      opacity: 1,
      zIndex: Date.now(),
      fill: preset.fill,
      stroke: preset.stroke,
      strokeWidth: preset.strokeWidth,
      borderRadius: preset.borderRadius || 0,
    };
    onAddElement(newEl);
  };

  const addLine = (style: 'solid' | 'dashed') => {
    const newEl: LineElement = {
      id: `line-${Date.now()}`,
      type: 'line',
      name: style === 'dashed' ? 'Ligne Pointillée' : 'Ligne d’accent',
      strokeColor: '#C2A378',
      strokeWidth: 2,
      lineStyle: style,
      x: Math.round((canvasWidth - 300) / 2),
      y: Math.round(canvasHeight / 2),
      width: 300,
      height: 4,
      rotation: 0,
      opacity: 1,
      zIndex: Date.now(),
    };
    onAddElement(newEl);
  };

  return (
    <div className="flex flex-col h-full text-zinc-300">
      <div className="p-3 border-b border-white/[0.08]">
        <h3 className="text-sm font-semibold text-white tracking-wide">Éléments Graphiques</h3>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          Formes géométriques, silhouettes architecturales et filets fins.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Curated Origi Studio Shapes */}
        <div>
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">
            Formes Signature Origi
          </span>
          <div className="grid grid-cols-2 gap-2">
            {GRAPHIC_SHAPES.map((shape) => (
              <button
                key={shape.id}
                onClick={() => addPresetShape(shape)}
                className="flex flex-col items-center justify-center p-3 rounded-md bg-[#151720] border border-white/[0.06] hover:border-[#C2A378]/60 hover:bg-[#1B1D28] transition-all text-center group"
              >
                <div className="w-12 h-12 flex items-center justify-center mb-2">
                  {shape.shapeType === 'arch' && (
                    <div className="w-8 h-12 bg-white/20 rounded-t-full border border-white/40" />
                  )}
                  {shape.shapeType === 'pill' && (
                    <div className="w-12 h-6 bg-white/20 rounded-full border border-white/40" />
                  )}
                  {shape.shapeType === 'circle' && (
                    <div className="w-10 h-10 bg-white/20 rounded-full border border-white/40" />
                  )}
                  {shape.shapeType === 'rectangle' && (
                    <div className="w-10 h-8 bg-white/20 rounded-sm border border-white/40" />
                  )}
                  {shape.shapeType === 'star' && <Star size={24} className="text-[#C2A378]" />}
                  {shape.shapeType === 'diamond' && (
                    <div className="w-8 h-8 bg-white/20 rotate-45 border border-white/40" />
                  )}
                </div>
                <span className="text-xs text-zinc-300 group-hover:text-white font-medium">
                  {shape.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Lines & dividers */}
        <div>
          <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">
            Lignes & Filets d'Atelier
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => addLine('solid')}
              className="flex flex-col items-center justify-center p-3 rounded-md bg-[#151720] border border-white/[0.06] hover:border-[#C2A378]/60 transition-all text-center"
            >
              <Minus size={20} className="text-[#C2A378] mb-1" />
              <span className="text-xs text-zinc-300 font-medium">Ligne Pleine</span>
            </button>
            <button
              onClick={() => addLine('dashed')}
              className="flex flex-col items-center justify-center p-3 rounded-md bg-[#151720] border border-white/[0.06] hover:border-[#C2A378]/60 transition-all text-center"
            >
              <div className="w-12 border-t border-dashed border-[#C2A378] mb-2.5 mt-2" />
              <span className="text-xs text-zinc-300 font-medium">Ligne Pointillée</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
