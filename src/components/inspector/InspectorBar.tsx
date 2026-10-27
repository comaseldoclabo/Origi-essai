/**
 * Contextual Inspector Toolbar
 * Canva-style floating/docked toolbar displaying properties of the currently active element
 */

import React from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2,
  Copy,
  Lock,
  Unlock,
  BringToFront,
  SendToBack,
  Sliders,
  Type,
  Square,
  Sparkles,
} from 'lucide-react';
import { CanvasElement, ImageElement, ShapeElement, TextElement } from '../../types/canvas';
import { AVAILABLE_FONTS } from '../../data/brandKit';

interface InspectorBarProps {
  element: CanvasElement | null;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onDeleteSelected: () => void;
  onDuplicateSelected: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
}

export const InspectorBar: React.FC<InspectorBarProps> = ({
  element,
  onUpdateElement,
  onDeleteSelected,
  onDuplicateSelected,
  onBringToFront,
  onSendToBack,
}) => {
  if (!element) {
    return (
      <header className="h-11 bg-[#13141A] border-b border-white/[0.08] px-4 flex items-center justify-between text-xs text-zinc-400 select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C2A378]/60 animate-pulse" />
          <span className="text-zinc-400 font-medium">Origi Canvas Studio</span>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-500">Sélectionnez un élément sur la page pour modifier ses propriétés</span>
        </div>
        <div className="flex items-center gap-3 text-zinc-500 font-mono text-[11px]">
          <span>Grille active</span>
          <span>·</span>
          <span>Aimant intelligent</span>
        </div>
      </header>
    );
  }

  const isText = element.type === 'text';
  const isShape = element.type === 'shape';
  const isImage = element.type === 'image';

  const textEl = isText ? (element as TextElement) : null;
  const shapeEl = isShape ? (element as ShapeElement) : null;
  const imgEl = isImage ? (element as ImageElement) : null;

  return (
    <header className="h-11 bg-[#13141A] border-b border-white/[0.08] px-4 flex items-center justify-between text-xs text-zinc-200 select-none overflow-x-auto">
      {/* Left section: specific element styling controls */}
      <div className="flex items-center gap-2">
        {/* Element label */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/[0.04] text-[11px] font-mono text-[#C2A378] border border-white/[0.06]">
          {isText && <Type size={12} />}
          {isShape && <Square size={12} />}
          {isImage && <Sparkles size={12} />}
          <span className="truncate max-w-[100px]">{element.name}</span>
        </div>

        <div className="w-[1px] h-4 bg-white/10 mx-1" />

        {/* TEXT CONTROLS */}
        {textEl && (
          <div className="flex items-center gap-1.5">
            {/* Font Family selector */}
            <select
              value={textEl.fontFamily}
              onChange={(e) => onUpdateElement(element.id, { fontFamily: e.target.value } as Partial<CanvasElement>)}
              className="bg-[#1C1E26] border border-white/10 rounded px-2.5 py-1 text-xs text-white outline-none cursor-pointer hover:border-[#C2A378]/50"
            >
              {AVAILABLE_FONTS.map((f) => (
                <option key={f.name} value={f.name} className="bg-[#1C1E26] text-white">
                  {f.name} ({f.category})
                </option>
              ))}
            </select>

            {/* Font Size */}
            <div className="flex items-center bg-[#1C1E26] border border-white/10 rounded px-1">
              <button
                onClick={() =>
                  onUpdateElement(element.id, { fontSize: Math.max(8, textEl.fontSize - 2) } as Partial<CanvasElement>)
                }
                className="px-1.5 py-0.5 text-zinc-400 hover:text-white"
              >
                -
              </button>
              <input
                type="number"
                value={textEl.fontSize}
                onChange={(e) =>
                  onUpdateElement(element.id, { fontSize: parseInt(e.target.value) || 12 } as Partial<CanvasElement>)
                }
                className="w-10 bg-transparent text-center text-xs text-white outline-none"
              />
              <button
                onClick={() => onUpdateElement(element.id, { fontSize: textEl.fontSize + 2 } as Partial<CanvasElement>)}
                className="px-1.5 py-0.5 text-zinc-400 hover:text-white"
              >
                +
              </button>
            </div>

            {/* Text Color Picker */}
            <div className="flex items-center gap-1 bg-[#1C1E26] border border-white/10 rounded px-1.5 py-0.5">
              <input
                type="color"
                value={textEl.color.startsWith('#') ? textEl.color : '#FFFFFF'}
                onChange={(e) => onUpdateElement(element.id, { color: e.target.value } as Partial<CanvasElement>)}
                className="w-4 h-4 rounded cursor-pointer border-0 bg-transparent"
              />
              <span className="text-[10px] font-mono text-zinc-400">{textEl.color}</span>
            </div>

            {/* Bold */}
            <button
              onClick={() => {
                const isCurrentlyBold =
                  textEl.fontWeight === 'bold' || textEl.fontWeight === 700 || textEl.fontWeight === '700';
                onUpdateElement(element.id, { fontWeight: isCurrentlyBold ? 400 : 700 } as Partial<CanvasElement>);
              }}
              className={`p-1.5 rounded hover:bg-white/10 ${
                textEl.fontWeight === 'bold' || textEl.fontWeight === 700 || textEl.fontWeight === '700'
                  ? 'bg-[#C2A378] text-black font-bold'
                  : 'text-zinc-300'
              }`}
              title="Gras"
            >
              <Bold size={13} />
            </button>

            {/* Italic */}
            <button
              onClick={() => {
                onUpdateElement(element.id, {
                  fontStyle: textEl.fontStyle === 'italic' ? 'normal' : 'italic',
                } as Partial<CanvasElement>);
              }}
              className={`p-1.5 rounded hover:bg-white/10 ${
                textEl.fontStyle === 'italic' ? 'bg-[#C2A378] text-black' : 'text-zinc-300'
              }`}
              title="Italique"
            >
              <Italic size={13} />
            </button>

            {/* Underline */}
            <button
              onClick={() => {
                onUpdateElement(element.id, {
                  textDecoration: textEl.textDecoration === 'underline' ? 'none' : 'underline',
                } as Partial<CanvasElement>);
              }}
              className={`p-1.5 rounded hover:bg-white/10 ${
                textEl.textDecoration === 'underline' ? 'bg-[#C2A378] text-black' : 'text-zinc-300'
              }`}
              title="Souligné"
            >
              <Underline size={13} />
            </button>

            {/* Text Alignment */}
            <div className="flex items-center bg-[#1C1E26] border border-white/10 rounded p-0.5">
              <button
                onClick={() => onUpdateElement(element.id, { textAlign: 'left' } as Partial<CanvasElement>)}
                className={`p-1 rounded ${textEl.textAlign === 'left' ? 'bg-white/20 text-white' : 'text-zinc-400'}`}
              >
                <AlignLeft size={13} />
              </button>
              <button
                onClick={() => onUpdateElement(element.id, { textAlign: 'center' } as Partial<CanvasElement>)}
                className={`p-1 rounded ${textEl.textAlign === 'center' ? 'bg-white/20 text-white' : 'text-zinc-400'}`}
              >
                <AlignCenter size={13} />
              </button>
              <button
                onClick={() => onUpdateElement(element.id, { textAlign: 'right' } as Partial<CanvasElement>)}
                className={`p-1 rounded ${textEl.textAlign === 'right' ? 'bg-white/20 text-white' : 'text-zinc-400'}`}
              >
                <AlignRight size={13} />
              </button>
            </div>

            {/* Letter spacing */}
            <div className="flex items-center gap-1.5 bg-[#1C1E26] border border-white/10 rounded px-2 py-0.5" title="Espacement des lettres">
              <span className="text-[10px] text-zinc-400 font-mono">AV</span>
              <input
                type="range"
                min="-2"
                max="10"
                step="0.5"
                value={textEl.letterSpacing || 0}
                onChange={(e) =>
                  onUpdateElement(element.id, { letterSpacing: parseFloat(e.target.value) } as Partial<CanvasElement>)
                }
                className="w-14 accent-[#C2A378]"
              />
            </div>
          </div>
        )}

        {/* SHAPE CONTROLS */}
        {shapeEl && (
          <div className="flex items-center gap-2">
            {/* Fill Color */}
            <div className="flex items-center gap-1.5 bg-[#1C1E26] border border-white/10 rounded px-2 py-0.5">
              <span className="text-[11px] text-zinc-400">Fond:</span>
              <input
                type="color"
                value={shapeEl.fill.startsWith('#') ? shapeEl.fill : '#C2A378'}
                onChange={(e) => onUpdateElement(element.id, { fill: e.target.value } as Partial<CanvasElement>)}
                className="w-4 h-4 rounded cursor-pointer border-0 bg-transparent"
              />
            </div>

            {/* Stroke Color */}
            <div className="flex items-center gap-1.5 bg-[#1C1E26] border border-white/10 rounded px-2 py-0.5">
              <span className="text-[11px] text-zinc-400">Contour:</span>
              <input
                type="color"
                value={shapeEl.stroke.startsWith('#') ? shapeEl.stroke : '#FFFFFF'}
                onChange={(e) => onUpdateElement(element.id, { stroke: e.target.value } as Partial<CanvasElement>)}
                className="w-4 h-4 rounded cursor-pointer border-0 bg-transparent"
              />
            </div>

            {/* Stroke Width */}
            <div className="flex items-center gap-1 bg-[#1C1E26] border border-white/10 rounded px-2 py-0.5">
              <span className="text-[11px] text-zinc-400">Épaisseur:</span>
              <input
                type="number"
                min="0"
                max="20"
                value={shapeEl.strokeWidth || 0}
                onChange={(e) =>
                  onUpdateElement(element.id, { strokeWidth: parseInt(e.target.value) || 0 } as Partial<CanvasElement>)
                }
                className="w-8 text-center text-xs text-white bg-transparent outline-none"
              />
            </div>

            {/* Border Radius */}
            <div className="flex items-center gap-1 bg-[#1C1E26] border border-white/10 rounded px-2 py-0.5">
              <span className="text-[11px] text-zinc-400">Rayon:</span>
              <input
                type="number"
                min="0"
                max="200"
                value={shapeEl.borderRadius || 0}
                onChange={(e) =>
                  onUpdateElement(element.id, { borderRadius: parseInt(e.target.value) || 0 } as Partial<CanvasElement>)
                }
                className="w-10 text-center text-xs text-white bg-transparent outline-none"
              />
            </div>
          </div>
        )}

        {/* IMAGE CONTROLS */}
        {imgEl && (
          <div className="flex items-center gap-2">
            {/* Filter preset */}
            <div className="flex items-center gap-1 bg-[#1C1E26] border border-white/10 rounded px-2 py-0.5">
              <Sliders size={12} className="text-[#C2A378]" />
              <select
                value={imgEl.filterPreset || 'none'}
                onChange={(e) =>
                  onUpdateElement(element.id, { filterPreset: e.target.value as any } as Partial<CanvasElement>)
                }
                className="bg-transparent text-xs text-white outline-none cursor-pointer"
              >
                <option value="none" className="bg-[#1C1E26]">Filtre: Naturel</option>
                <option value="noir" className="bg-[#1C1E26]">Noir & Blanc Intense</option>
                <option value="vintage" className="bg-[#1C1E26]">Atelier Vintage Chaud</option>
                <option value="contrast" className="bg-[#1C1E26]">Contraste Luxe</option>
                <option value="sepia" className="bg-[#1C1E26]">Sépia Minéral</option>
                <option value="cool" className="bg-[#1C1E26]">Indigo Minimal</option>
              </select>
            </div>

            {/* Object Fit */}
            <button
              onClick={() =>
                onUpdateElement(element.id, {
                  objectFit: imgEl.objectFit === 'cover' ? 'contain' : 'cover',
                } as Partial<CanvasElement>)
              }
              className="px-2 py-1 rounded bg-[#1C1E26] border border-white/10 text-zinc-300 hover:text-white text-xs"
            >
              Fit: {imgEl.objectFit === 'cover' ? 'Remplir (Cover)' : 'Entier (Contain)'}
            </button>

            {/* Border Radius */}
            <div className="flex items-center gap-1 bg-[#1C1E26] border border-white/10 rounded px-2 py-0.5">
              <span className="text-[11px] text-zinc-400">Coins:</span>
              <input
                type="number"
                min="0"
                max="200"
                value={imgEl.borderRadius || 0}
                onChange={(e) =>
                  onUpdateElement(element.id, { borderRadius: parseInt(e.target.value) || 0 } as Partial<CanvasElement>)
                }
                className="w-10 text-center text-xs text-white bg-transparent outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Right section: Universal actions (opacity, ordering, duplicate, delete, lock) */}
      <div className="flex items-center gap-1.5">
        {/* Opacity */}
        <div className="flex items-center gap-1.5 bg-[#1C1E26] border border-white/10 rounded px-2 py-0.5" title="Opacité">
          <span className="text-[10px] text-zinc-400 font-mono">
            {Math.round((element.opacity ?? 1) * 100)}%
          </span>
          <input
            type="range"
            min="0.05"
            max="1"
            step="0.05"
            value={element.opacity ?? 1}
            onChange={(e) => onUpdateElement(element.id, { opacity: parseFloat(e.target.value) })}
            className="w-14 accent-[#C2A378]"
          />
        </div>

        {/* Bring to front */}
        <button
          onClick={onBringToFront}
          className="p-1.5 rounded hover:bg-white/10 text-zinc-300"
          title="Premier plan"
        >
          <BringToFront size={14} />
        </button>

        {/* Send to back */}
        <button
          onClick={onSendToBack}
          className="p-1.5 rounded hover:bg-white/10 text-zinc-300"
          title="Arrière-plan"
        >
          <SendToBack size={14} />
        </button>

        <div className="w-[1px] h-4 bg-white/10 mx-1" />

        {/* Duplicate */}
        <button
          onClick={onDuplicateSelected}
          className="p-1.5 rounded hover:bg-white/10 text-zinc-300"
          title="Dupliquer (Ctrl+D)"
        >
          <Copy size={14} />
        </button>

        {/* Lock/Unlock */}
        <button
          onClick={() => onUpdateElement(element.id, { locked: !element.locked })}
          className={`p-1.5 rounded hover:bg-white/10 ${element.locked ? 'text-[#C2A378]' : 'text-zinc-400'}`}
          title={element.locked ? 'Déverrouiller' : 'Verrouiller'}
        >
          {element.locked ? <Lock size={14} /> : <Unlock size={14} />}
        </button>

        {/* Delete */}
        <button
          onClick={onDeleteSelected}
          className="p-1.5 rounded hover:bg-red-500/20 text-red-400"
          title="Supprimer (Suppr)"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </header>
  );
};
