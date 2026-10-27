/**
 * Text Tab
 * Typographic combinations matching Origi's editorial visual identity
 */

import React from 'react';
import { Type, Quote, Hash } from 'lucide-react';
import { CanvasElement, TextElement } from '../../types/canvas';

interface TextTabProps {
  onAddElement: (element: CanvasElement) => void;
  canvasWidth: number;
  canvasHeight: number;
}

export const TextTab: React.FC<TextTabProps> = ({
  onAddElement,
  canvasWidth,
  canvasHeight,
}) => {
  const addTextPreset = (preset: {
    name: string;
    text: string;
    fontFamily: string;
    fontSize: number;
    fontWeight: number | string;
    fontStyle?: 'normal' | 'italic';
    color: string;
    textAlign: 'left' | 'center' | 'right';
    letterSpacing: number;
    lineHeight: number;
    textTransform?: 'none' | 'uppercase' | 'lowercase';
    width: number;
    height: number;
  }) => {
    const newEl: TextElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      name: preset.name,
      text: preset.text,
      fontFamily: preset.fontFamily,
      fontSize: preset.fontSize,
      fontWeight: preset.fontWeight,
      fontStyle: preset.fontStyle || 'normal',
      color: preset.color,
      textAlign: preset.textAlign,
      letterSpacing: preset.letterSpacing,
      lineHeight: preset.lineHeight,
      textTransform: preset.textTransform || 'none',
      x: Math.round((canvasWidth - preset.width) / 2),
      y: Math.round((canvasHeight - preset.height) / 2),
      width: preset.width,
      height: preset.height,
      rotation: 0,
      opacity: 1,
      zIndex: Date.now(),
    };
    onAddElement(newEl);
  };

  return (
    <div className="flex flex-col h-full text-zinc-300">
      <div className="p-3 border-b border-white/[0.08]">
        <h3 className="text-sm font-semibold text-white tracking-wide">Typographie Éditoriale</h3>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          Styles typographiques inspirés des publications et de l’identité Origi.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {/* Quick buttons */}
        <div className="space-y-2">
          {/* Editorial Headline */}
          <button
            onClick={() =>
              addTextPreset({
                name: 'Titre Cormorant',
                text: 'L’Élégance du Vide',
                fontFamily: 'Cormorant Garamond',
                fontSize: 68,
                fontWeight: 400,
                fontStyle: 'italic',
                color: '#F5F2EB',
                textAlign: 'center',
                letterSpacing: 1.5,
                lineHeight: 1.1,
                width: 600,
                height: 90,
              })
            }
            className="w-full p-3 rounded-md bg-[#151720] border border-white/[0.06] hover:border-[#C2A378]/60 transition-all text-left group"
          >
            <div className="text-xl font-normal italic text-white group-hover:text-[#C2A378] font-['Cormorant_Garamond']">
              Titre Éditorial Roman
            </div>
            <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
              Cormorant Garamond · Italique · 68px
            </div>
          </button>

          {/* Avant-Garde Syne */}
          <button
            onClick={() =>
              addTextPreset({
                name: 'Titre Syne Avant-Garde',
                text: 'ORIGI STUDIO',
                fontFamily: 'Syne',
                fontSize: 54,
                fontWeight: 800,
                color: '#FFFFFF',
                textAlign: 'left',
                letterSpacing: -0.5,
                lineHeight: 1.05,
                textTransform: 'uppercase',
                width: 520,
                height: 70,
              })
            }
            className="w-full p-3 rounded-md bg-[#151720] border border-white/[0.06] hover:border-[#C2A378]/60 transition-all text-left group"
          >
            <div className="text-lg font-extrabold uppercase text-white group-hover:text-[#C2A378] font-['Syne']">
              Titre Avant-Garde
            </div>
            <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
              Syne · Gras 800 · 54px
            </div>
          </button>

          {/* Monolith Space Grotesk */}
          <button
            onClick={() =>
              addTextPreset({
                name: 'En-tête Kicker',
                text: '01 / ARCHITECTURE & MINIMALISME',
                fontFamily: 'Space Grotesk',
                fontSize: 14,
                fontWeight: 600,
                color: '#C2A378',
                textAlign: 'left',
                letterSpacing: 3,
                lineHeight: 1.2,
                textTransform: 'uppercase',
                width: 480,
                height: 30,
              })
            }
            className="w-full p-3 rounded-md bg-[#151720] border border-white/[0.06] hover:border-[#C2A378]/60 transition-all text-left group"
          >
            <div className="text-xs uppercase font-semibold text-[#C2A378] font-['Space_Grotesk'] tracking-widest">
              01 / Tag d'Atelier
            </div>
            <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
              Space Grotesk · Interlettrage 3px · 14px
            </div>
          </button>

          {/* Subtitle / Description */}
          <button
            onClick={() =>
              addTextPreset({
                name: 'Sous-titre Moderne',
                text: 'Une vision claire et durable qui valorise la forme pure.',
                fontFamily: 'Plus Jakarta Sans',
                fontSize: 22,
                fontWeight: 300,
                color: '#DCD5C9',
                textAlign: 'left',
                letterSpacing: 0.2,
                lineHeight: 1.4,
                width: 540,
                height: 70,
              })
            }
            className="w-full p-3 rounded-md bg-[#151720] border border-white/[0.06] hover:border-[#C2A378]/60 transition-all text-left group"
          >
            <div className="text-sm font-light text-zinc-200 group-hover:text-white font-['Plus_Jakarta_Sans']">
              Sous-titre Épuré & Fluide
            </div>
            <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
              Plus Jakarta Sans · Fin 300 · 22px
            </div>
          </button>

          {/* Editorial Pull Quote */}
          <button
            onClick={() =>
              addTextPreset({
                name: 'Citation Studio',
                text: '« La perfection est atteinte non pas lorsqu’il n’y a plus rien à ajouter, mais lorsqu’il n’y a plus rien à retirer. »',
                fontFamily: 'Cormorant Garamond',
                fontSize: 26,
                fontWeight: 400,
                fontStyle: 'italic',
                color: '#F5F2EB',
                textAlign: 'center',
                letterSpacing: 0.5,
                lineHeight: 1.5,
                width: 600,
                height: 100,
              })
            }
            className="w-full p-3 rounded-md bg-[#151720] border border-white/[0.06] hover:border-[#C2A378]/60 transition-all text-left group"
          >
            <div className="text-xs italic text-zinc-300 group-hover:text-white font-['Cormorant_Garamond']">
              « Citation Éditoriale & Réflexion »
            </div>
            <div className="text-[10px] font-mono text-zinc-400 mt-0.5">
              Cormorant Garamond · Italique Centré
            </div>
          </button>

          {/* JetBrains Mono Timestamp / Technical note */}
          <button
            onClick={() =>
              addTextPreset({
                name: 'Note Technique Mono',
                text: 'COORDINATES: 48.8566° N, 2.3522° E\nORIGI ATELIER V.2026',
                fontFamily: 'JetBrains Mono',
                fontSize: 12,
                fontWeight: 500,
                color: '#8C887F',
                textAlign: 'left',
                letterSpacing: 1,
                lineHeight: 1.6,
                textTransform: 'uppercase',
                width: 320,
                height: 48,
              })
            }
            className="w-full p-3 rounded-md bg-[#151720] border border-white/[0.06] hover:border-[#C2A378]/60 transition-all text-left group"
          >
            <div className="text-xs font-mono text-zinc-400 group-hover:text-white">
              COORD. 48.8566° N, 2.3522° E
            </div>
            <div className="text-[10px] font-mono text-zinc-500 mt-0.5">
              JetBrains Mono · Données & Sceau
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
