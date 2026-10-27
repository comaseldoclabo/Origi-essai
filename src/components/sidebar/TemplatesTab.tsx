/**
 * Templates Tab
 * Shows curated Origi Designer Templates with category filtering and instant canvas load
 */

import React, { useState } from 'react';
import { ORIGI_TEMPLATES, TemplateItem } from '../../data/templates';
import { CanvasPage } from '../../types/canvas';

interface TemplatesTabProps {
  onApplyTemplate: (templatePage: CanvasPage) => void;
}

export const TemplatesTab: React.FC<TemplatesTabProps> = ({ onApplyTemplate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Tous' },
    { id: 'editorial', label: 'Éditorial' },
    { id: 'pitch', label: 'Pitch Deck' },
    { id: 'print', label: 'Affiches' },
    { id: 'social', label: 'Social & Story' },
  ];

  const filtered = activeCategory === 'all'
    ? ORIGI_TEMPLATES
    : ORIGI_TEMPLATES.filter((t) => t.category === activeCategory);

  return (
    <div className="flex flex-col h-full text-zinc-300">
      <div className="p-3 border-b border-white/[0.08]">
        <h3 className="text-sm font-semibold text-white tracking-wide">Modèles Origi Atelier</h3>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          Sélections graphiques inspirées de l’univers visuel Origi Framer.
        </p>

        {/* Categories segmented buttons */}
        <div className="flex flex-wrap gap-1 mt-3">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors ${
                activeCategory === c.id
                  ? 'bg-[#C2A378] text-black font-semibold'
                  : 'bg-white/[0.04] text-zinc-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of templates */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filtered.map((tmpl) => (
          <div
            key={tmpl.id}
            onClick={() => onApplyTemplate(tmpl.page)}
            className="group relative cursor-pointer rounded-md overflow-hidden border border-white/[0.08] hover:border-[#C2A378]/60 transition-all bg-[#151720]"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-black/60 relative">
              <img
                src={tmpl.thumbnail}
                alt={tmpl.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
              <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono text-[#C2A378] border border-white/10">
                {tmpl.page.width} × {tmpl.page.height}
              </div>
            </div>

            <div className="p-2.5">
              <h4 className="text-xs font-semibold text-white group-hover:text-[#C2A378] transition-colors">
                {tmpl.name}
              </h4>
              <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5">
                {tmpl.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
