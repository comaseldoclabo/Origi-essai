/**
 * Layers Tab
 * Z-index hierarchy management, element visibility, locking, and selection
 */

import React from 'react';
import { Eye, EyeOff, Lock, Unlock, Trash2, ArrowUp, ArrowDown, Type, Square, Sparkles } from 'lucide-react';
import { CanvasElement } from '../../types/canvas';

interface LayersTabProps {
  elements: CanvasElement[];
  selectedIds: string[];
  onSelect: (ids: string[]) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onDeleteElement: (id: string) => void;
  onMoveLayer: (id: string, direction: 'up' | 'down') => void;
}

export const LayersTab: React.FC<LayersTabProps> = ({
  elements,
  selectedIds,
  onSelect,
  onUpdateElement,
  onDeleteElement,
  onMoveLayer,
}) => {
  // Sort layers from top to bottom (highest zIndex first)
  const sortedLayers = [...elements].sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0));

  return (
    <div className="flex flex-col h-full text-zinc-300">
      <div className="p-3 border-b border-white/[0.08]">
        <h3 className="text-sm font-semibold text-white tracking-wide">Gestion des Calques</h3>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          {elements.length} élément{elements.length > 1 ? 's' : ''} sur cette page.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sortedLayers.length === 0 ? (
          <div className="text-center py-8 text-xs text-zinc-500">
            Aucun élément sur cette page
          </div>
        ) : (
          sortedLayers.map((el, index) => {
            const isSelected = selectedIds.includes(el.id);

            return (
              <div
                key={el.id}
                onClick={() => onSelect([el.id])}
                className={`flex items-center justify-between p-2 rounded text-xs transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-[#C2A378]/15 border-[#C2A378]/60 text-white font-medium'
                    : 'bg-[#151720] border-transparent hover:border-white/10 text-zinc-300'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {/* Icon per type */}
                  <span className="text-[#C2A378] flex-shrink-0">
                    {el.type === 'text' && <Type size={13} />}
                    {el.type === 'shape' && <Square size={13} />}
                    {el.type === 'image' && <Sparkles size={13} />}
                  </span>

                  <span className="truncate text-xs">{el.name}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  {/* Move Up */}
                  <button
                    disabled={index === 0}
                    onClick={() => onMoveLayer(el.id, 'up')}
                    className="p-1 rounded text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400"
                    title="Monter"
                  >
                    <ArrowUp size={12} />
                  </button>

                  {/* Move Down */}
                  <button
                    disabled={index === sortedLayers.length - 1}
                    onClick={() => onMoveLayer(el.id, 'down')}
                    className="p-1 rounded text-zinc-400 hover:text-white disabled:opacity-30 disabled:hover:text-zinc-400"
                    title="Descendre"
                  >
                    <ArrowDown size={12} />
                  </button>

                  {/* Toggle Visibility */}
                  <button
                    onClick={() => onUpdateElement(el.id, { visible: el.visible === false ? true : false })}
                    className="p-1 rounded text-zinc-400 hover:text-white"
                    title={el.visible === false ? 'Afficher' : 'Masquer'}
                  >
                    {el.visible === false ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>

                  {/* Toggle Lock */}
                  <button
                    onClick={() => onUpdateElement(el.id, { locked: !el.locked })}
                    className={`p-1 rounded hover:text-white ${el.locked ? 'text-[#C2A378]' : 'text-zinc-400'}`}
                    title={el.locked ? 'Déverrouiller' : 'Verrouiller'}
                  >
                    {el.locked ? <Lock size={12} /> : <Unlock size={12} />}
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => onDeleteElement(el.id)}
                    className="p-1 rounded text-zinc-400 hover:text-red-400"
                    title="Supprimer"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
