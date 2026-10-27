/**
 * Left Sidebar & Tool Dock
 * Canva-inspired navigation dock with Origi's minimalist luxury styling
 */

import React, { useState } from 'react';
import {
  LayoutTemplate,
  Shapes,
  Type,
  Image,
  Palette,
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { CanvasElement, CanvasPage, ColorPalette, FontPairing } from '../../types/canvas';
import { TemplatesTab } from './TemplatesTab';
import { ElementsTab } from './ElementsTab';
import { TextTab } from './TextTab';
import { MediaTab } from './MediaTab';
import { BrandKitTab } from './BrandKitTab';
import { LayersTab } from './LayersTab';
import { AIGeneratorTab } from './AIGeneratorTab';

export type SidebarTab = 'templates' | 'elements' | 'text' | 'media' | 'brand' | 'layers' | 'ai';

interface LeftSidebarProps {
  currentPage: CanvasPage;
  selectedIds: string[];
  onSelect: (ids: string[]) => void;
  onAddElement: (element: CanvasElement) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onDeleteElement: (id: string) => void;
  onMoveLayer: (id: string, direction: 'up' | 'down') => void;
  onApplyTemplate: (templatePage: CanvasPage) => void;
  onApplyPalette: (palette: ColorPalette) => void;
  onApplyFontPairing: (pairing: FontPairing) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  currentPage,
  selectedIds,
  onSelect,
  onAddElement,
  onUpdateElement,
  onDeleteElement,
  onMoveLayer,
  onApplyTemplate,
  onApplyPalette,
  onApplyFontPairing,
}) => {
  const [activeTab, setActiveTab] = useState<SidebarTab | null>('templates');

  const navItems: { id: SidebarTab; label: string; icon: React.ReactNode }[] = [
    { id: 'templates', label: 'Modèles', icon: <LayoutTemplate size={18} /> },
    { id: 'elements', label: 'Éléments', icon: <Shapes size={18} /> },
    { id: 'text', label: 'Texte', icon: <Type size={18} /> },
    { id: 'media', label: 'Médias', icon: <Image size={18} /> },
    { id: 'brand', label: 'Brand Kit', icon: <Palette size={18} /> },
    { id: 'layers', label: 'Calques', icon: <Layers size={18} /> },
    { id: 'ai', label: 'IA Studio', icon: <Sparkles size={18} className="text-[#C2A378]" /> },
  ];

  const handleTabClick = (tabId: SidebarTab) => {
    if (activeTab === tabId) {
      setActiveTab(null); // toggle close
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <aside className="relative flex h-full z-30 select-none">
      {/* Icon Rail (Far Left) */}
      <nav className="w-18 bg-[#101117] border-r border-white/[0.08] flex flex-col items-center py-3 gap-1 z-20">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-14 py-2.5 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${
                isActive
                  ? 'bg-[#1C1E28] text-[#C2A378] font-semibold border border-white/[0.08]'
                  : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <div>{item.icon}</div>
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Slide-out Drawer Panel */}
      {activeTab && (
        <section className="w-80 h-full bg-[#12131A] border-r border-white/[0.08] flex flex-col z-10 shadow-2xl relative">
          {/* Close / Collapse tab trigger */}
          <button
            onClick={() => setActiveTab(null)}
            className="absolute -right-3 top-4 w-6 h-6 rounded-full bg-[#1C1E28] border border-white/20 text-zinc-300 hover:text-white flex items-center justify-center shadow-md z-30"
            title="Masquer le panneau"
          >
            <ChevronLeft size={13} />
          </button>

          {activeTab === 'templates' && <TemplatesTab onApplyTemplate={onApplyTemplate} />}
          {activeTab === 'elements' && (
            <ElementsTab
              onAddElement={onAddElement}
              canvasWidth={currentPage.width}
              canvasHeight={currentPage.height}
            />
          )}
          {activeTab === 'text' && (
            <TextTab
              onAddElement={onAddElement}
              canvasWidth={currentPage.width}
              canvasHeight={currentPage.height}
            />
          )}
          {activeTab === 'media' && (
            <MediaTab
              onAddElement={onAddElement}
              canvasWidth={currentPage.width}
              canvasHeight={currentPage.height}
            />
          )}
          {activeTab === 'brand' && (
            <BrandKitTab
              currentBackgroundColor={currentPage.backgroundColor}
              onApplyPalette={onApplyPalette}
              onApplyFontPairing={onApplyFontPairing}
            />
          )}
          {activeTab === 'layers' && (
            <LayersTab
              elements={currentPage.elements}
              selectedIds={selectedIds}
              onSelect={onSelect}
              onUpdateElement={onUpdateElement}
              onDeleteElement={onDeleteElement}
              onMoveLayer={onMoveLayer}
            />
          )}
          {activeTab === 'ai' && <AIGeneratorTab onApplyGeneratedPage={onApplyTemplate} />}
        </section>
      )}
    </aside>
  );
};
