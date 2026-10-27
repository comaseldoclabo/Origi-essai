/**
 * AI Generator Tab
 * Smart prompt-to-design generator matching Origi's aesthetic
 */

import React, { useState } from 'react';
import { Sparkles, Wand2, ArrowRight } from 'lucide-react';
import { generateOrigiDesign } from '../../utils/aiGenerator';
import { CanvasPage } from '../../types/canvas';

interface AIGeneratorTabProps {
  onApplyGeneratedPage: (page: CanvasPage) => void;
}

export const AIGeneratorTab: React.FC<AIGeneratorTabProps> = ({ onApplyGeneratedPage }) => {
  const [prompt, setPrompt] = useState('');
  const [format, setFormat] = useState<'social' | 'presentation' | 'poster' | 'square'>('social');
  const [palette, setPalette] = useState<'dark' | 'sand' | 'brutalist' | 'monochrome'>('dark');
  const [isGenerating, setIsGenerating] = useState(false);

  const promptSuggestions = [
    'Affiche de vernissage pour galerie d’art à Paris',
    'Couverture lookbook haute couture Automne 2026',
    'Slide de présentation pour studio d’architecture minimaliste',
    'Drop de parfum exclusif et céramique artisanale',
  ];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setTimeout(() => {
      const generatedPage = generateOrigiDesign({
        prompt,
        format,
        palettePreference: palette,
      });
      onApplyGeneratedPage(generatedPage);
      setIsGenerating(false);
    }, 600);
  };

  return (
    <div className="flex flex-col h-full text-zinc-300">
      <div className="p-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-[#C2A378]/20 text-[#C2A378]">
            <Sparkles size={14} />
          </div>
          <h3 className="text-sm font-semibold text-white tracking-wide">Studio IA Origi</h3>
        </div>
        <p className="text-[11px] text-zinc-400 mt-1">
          Générez une composition complète sur mesure adaptée à l’identité visuelle d’Origi.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        <form onSubmit={handleGenerate} className="space-y-3">
          {/* Prompt text area */}
          <div>
            <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
              Description de votre création
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="ex: Affiche éditoriale pour exposition d'art contemporain et architecture brute..."
              className="w-full bg-[#151720] border border-white/10 rounded-md p-2.5 text-xs text-white placeholder-zinc-500 outline-none focus:border-[#C2A378]/70 resize-none"
            />
          </div>

          {/* Quick inspiration tags */}
          <div>
            <span className="text-[10px] text-zinc-500 font-mono block mb-1.5">Suggestions d'inspiration :</span>
            <div className="space-y-1">
              {promptSuggestions.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setPrompt(s)}
                  className="w-full text-left text-[11px] text-zinc-400 hover:text-white p-1.5 rounded hover:bg-white/[0.05] transition-colors truncate"
                >
                  → {s}
                </button>
              ))}
            </div>
          </div>

          {/* Format selection */}
          <div>
            <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">
              Format de sortie
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'social', label: 'Portrait (4:5)' },
                { id: 'square', label: 'Carré (1:1)' },
                { id: 'presentation', label: 'Pitch Deck (16:9)' },
                { id: 'poster', label: 'Affiche (3:4)' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormat(f.id as any)}
                  className={`py-1.5 px-2 text-xs rounded border transition-colors ${
                    format === f.id
                      ? 'bg-[#C2A378] text-black font-semibold border-[#C2A378]'
                      : 'bg-[#151720] border-white/10 text-zinc-300 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Palette preference */}
          <div>
            <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">
              Ambiance chromatique
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { id: 'dark', label: 'Obsidian Noir' },
                { id: 'sand', label: 'Atelier Pierre' },
                { id: 'brutalist', label: 'Brutaliste Indigo' },
                { id: 'monochrome', label: 'Monochrome Pur' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPalette(p.id as any)}
                  className={`py-1.5 px-2 text-xs rounded border transition-colors ${
                    palette === p.id
                      ? 'bg-white text-black font-semibold border-white'
                      : 'bg-[#151720] border-white/10 text-zinc-300 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            type="submit"
            disabled={!prompt.trim() || isGenerating}
            className="w-full py-2.5 px-3 rounded-md bg-[#C2A378] text-black font-semibold text-xs flex items-center justify-center gap-2 hover:bg-[#d5b58b] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md mt-4"
          >
            {isGenerating ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Composition en cours...</span>
              </>
            ) : (
              <>
                <Wand2 size={13} />
                <span>Générer le Design Origi</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
