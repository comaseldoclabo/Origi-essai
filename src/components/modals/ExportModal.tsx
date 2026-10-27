/**
 * Export Modal
 * Canva-style multi-format export: PNG (1x/2x/3x), SVG Vector, JSON Project, PDF Print
 */

import React, { useState } from 'react';
import { X, Download, FileImage, FileCode, Printer, Check, Sparkles } from 'lucide-react';
import { CanvasPage } from '../../types/canvas';
import { exportPageToPNG, exportPageToSVG, downloadFile } from '../../utils/exporter';

interface ExportModalProps {
  page: CanvasPage;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ page, onClose }) => {
  const [format, setFormat] = useState<'png' | 'svg' | 'json' | 'pdf'>('png');
  const [scale, setScale] = useState<number>(2);
  const [filename, setFilename] = useState<string>(
    page.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') || 'origi-design'
  );
  const [isExporting, setIsExporting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    setIsSuccess(false);

    try {
      if (format === 'png') {
        await exportPageToPNG(page, `${filename}@${scale}x.png`, scale);
      } else if (format === 'svg') {
        const svgContent = exportPageToSVG(page);
        downloadFile(svgContent, `${filename}.svg`, 'image/svg+xml');
      } else if (format === 'json') {
        const jsonContent = JSON.stringify(page, null, 2);
        downloadFile(jsonContent, `${filename}.origi.json`, 'application/json');
      } else if (format === 'pdf') {
        window.print();
      }
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 2500);
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 select-none">
      <div className="w-full max-w-md bg-[#13141B] border border-white/10 rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#C2A378]/20 text-[#C2A378] flex items-center justify-center">
              <Download size={14} />
            </div>
            <h3 className="text-sm font-semibold text-white tracking-wide">
              Exporter le Design Origi
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 text-xs text-zinc-300">
          {/* Format selection */}
          <div>
            <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-2">
              Type de fichier
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'png', title: 'Image PNG', desc: 'Idéal web & réseaux', icon: <FileImage size={15} /> },
                { id: 'svg', title: 'Vectoriel SVG', desc: 'Net à l’infini / Figma', icon: <FileCode size={15} /> },
                { id: 'json', title: 'Projet JSON', desc: 'Sauvegarde réutilisable', icon: <FileCode size={15} /> },
                { id: 'pdf', title: 'PDF / Impression', desc: 'Format document papier', icon: <Printer size={15} /> },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  onClick={() => setFormat(fmt.id as any)}
                  className={`p-2.5 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                    format === fmt.id
                      ? 'bg-[#C2A378]/15 border-[#C2A378] text-white'
                      : 'bg-[#181A22] border-white/[0.06] text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-white font-medium">
                    <span className="text-[#C2A378]">{fmt.icon}</span>
                    <span>{fmt.title}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500">{fmt.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Scale Resolution for PNG */}
          {format === 'png' && (
            <div>
              <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1.5">
                Résolution / Densité de pixels
              </label>
              <div className="flex gap-2">
                {[
                  { val: 1, label: '1x (Standard)' },
                  { val: 2, label: '2x (Haute Définition - Recommandé)' },
                  { val: 3, label: '3x (Ultra Net Impression)' },
                ].map((s) => (
                  <button
                    key={s.val}
                    onClick={() => setScale(s.val)}
                    className={`flex-1 py-1.5 px-2 rounded text-[11px] border transition-colors ${
                      scale === s.val
                        ? 'bg-white text-black font-semibold border-white'
                        : 'bg-[#181A22] border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
              <div className="text-[10px] font-mono text-zinc-500 mt-1">
                Taille finale exportée : {page.width * scale} × {page.height * scale} px
              </div>
            </div>
          )}

          {/* Filename input */}
          <div>
            <label className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block mb-1">
              Nom du fichier
            </label>
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              className="w-full bg-[#181A22] border border-white/10 rounded-md px-3 py-2 text-xs text-white placeholder-zinc-500 outline-none focus:border-[#C2A378]"
            />
          </div>

          {/* Success message */}
          {isSuccess && (
            <div className="p-2.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center gap-2">
              <Check size={14} />
              <span>Export réussi avec succès !</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-white/[0.08] flex items-center justify-end gap-2 bg-[#0E0F14]">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded text-xs text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors"
          >
            Fermer
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="px-4 py-1.5 rounded bg-[#C2A378] text-black font-semibold text-xs flex items-center gap-1.5 hover:bg-[#d6b78d] transition-all disabled:opacity-50"
          >
            {isExporting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                <span>Génération...</span>
              </>
            ) : (
              <>
                <Download size={13} />
                <span>Télécharger</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
