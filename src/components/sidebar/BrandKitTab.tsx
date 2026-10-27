/**
 * Brand Kit Tab
 * Origi Visual Identity & Design System controls
 */

import React from 'react';
import { Palette, Type, Check, Sparkles } from 'lucide-react';
import { ORIGI_PALETTES, ORIGI_FONT_PAIRINGS } from '../../data/brandKit';
import { CanvasElement, ColorPalette, FontPairing, TextElement } from '../../types/canvas';

interface BrandKitTabProps {
  currentBackgroundColor: string;
  onApplyPalette: (palette: ColorPalette) => void;
  onApplyFontPairing: (pairing: FontPairing) => void;
}

export const BrandKitTab: React.FC<BrandKitTabProps> = ({
  currentBackgroundColor,
  onApplyPalette,
  onApplyFontPairing,
}) => {
  return (
    <div className="flex flex-col h-full text-zinc-300">
      <div className="p-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#C2A378]" />
          <h3 className="text-sm font-semibold text-white tracking-wide">Brand Kit Origi</h3>
        </div>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          Identité visuelle officielle : palettes minérales et paires typographiques.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-5">
        {/* Color Palettes */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Palette size={13} className="text-[#C2A378]" />
            <span className="text-[11px] font-mono text-zinc-300 uppercase tracking-wider font-semibold">
              Palettes Signatures Origi
            </span>
          </div>

          <div className="space-y-2.5">
            {ORIGI_PALETTES.map((pal) => {
              const isActive = currentBackgroundColor.toLowerCase() === pal.background.toLowerCase();

              return (
                <div
                  key={pal.id}
                  onClick={() => onApplyPalette(pal)}
                  className={`p-2.5 rounded-md border cursor-pointer transition-all bg-[#151720] ${
                    isActive ? 'border-[#C2A378] ring-1 ring-[#C2A378]/30' : 'border-white/[0.06] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-white">{pal.name}</span>
                    {isActive && (
                      <span className="flex items-center gap-1 text-[10px] text-[#C2A378] font-mono">
                        <Check size={11} /> Actif
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-zinc-400 mb-2">{pal.description}</p>

                  {/* Swatches strip */}
                  <div className="flex h-5 rounded overflow-hidden border border-white/10">
                    {pal.colors.map((c, i) => (
                      <div
                        key={i}
                        className="flex-1 transition-transform hover:scale-110"
                        style={{ backgroundColor: c }}
                        title={c}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Font Pairings */}
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <Type size={13} className="text-[#C2A378]" />
            <span className="text-[11px] font-mono text-zinc-300 uppercase tracking-wider font-semibold">
              Paires Typographiques
            </span>
          </div>

          <div className="space-y-2">
            {ORIGI_FONT_PAIRINGS.map((pair) => (
              <button
                key={pair.id}
                onClick={() => onApplyFontPairing(pair)}
                className="w-full p-2.5 rounded-md bg-[#151720] border border-white/[0.06] hover:border-[#C2A378]/60 transition-all text-left group"
              >
                <div className="text-xs font-semibold text-white group-hover:text-[#C2A378] transition-colors">
                  {pair.name}
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5">
                  {pair.headingFont} + {pair.bodyFont}
                </div>
                <div className="mt-2 pt-2 border-t border-white/[0.04] flex items-baseline justify-between">
                  <span
                    className="text-sm text-zinc-200"
                    style={{ fontFamily: pair.headingFont }}
                  >
                    Titre d’Atelier
                  </span>
                  <span
                    className="text-[11px] text-zinc-400"
                    style={{ fontFamily: pair.bodyFont }}
                  >
                    Texte descriptif
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Design Philosophy Note */}
        <div className="p-3 rounded bg-black/40 border border-white/[0.04] text-[11px] text-zinc-400 space-y-1.5">
          <div className="font-semibold text-zinc-300 uppercase tracking-wide text-[10px] font-mono">
            Directives de Style Origi :
          </div>
          <p>• Priorité au contraste maximal entre fonds sombres et typographies claires.</p>
          <p>• Respect rigoureux du ratio d'or et des espaces négatifs.</p>
          <p>• Éléments géométriques sobres (arches romanes, filets fins de 1px).</p>
        </div>
      </div>
    </div>
  );
};
