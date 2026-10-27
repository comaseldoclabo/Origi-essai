/**
 * Origi Canvas — Studio Graphique & Création Éditoriale
 * An advanced graphic design application marrying Canva's versatility with Origi's refined aesthetic.
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/header/Header';
import { LeftSidebar } from './components/sidebar/LeftSidebar';
import { InspectorBar } from './components/inspector/InspectorBar';
import { InteractiveCanvas } from './components/canvas/InteractiveCanvas';
import { PageNavigator } from './components/canvas/PageNavigator';
import { ExportModal } from './components/modals/ExportModal';
import { PresentationModal } from './components/modals/PresentationModal';
import { CanvasElement, CanvasPage, ColorPalette, FontPairing, PresetFormat, TextElement } from './types/canvas';
import { ORIGI_TEMPLATES } from './data/templates';

export default function App() {
  // Initial state with curated Origi lookbook template
  const [projectTitle, setProjectTitle] = useState('Origi Atelier — Édition Automne 2026');
  const [pages, setPages] = useState<CanvasPage[]>([
    JSON.parse(JSON.stringify(ORIGI_TEMPLATES[0].page)),
  ]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [zoom, setZoom] = useState(0.55);

  // Modals state
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isPresentationOpen, setIsPresentationOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);

  // Undo / Redo History Stack
  const [history, setHistory] = useState<CanvasPage[][]>([
    [JSON.parse(JSON.stringify(ORIGI_TEMPLATES[0].page))],
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isHistoryUpdate = useRef(false);

  const currentPage = pages[currentPageIndex] || pages[0];

  // Helper to commit state change to history
  const pushStateToHistory = useCallback((newPages: CanvasPage[]) => {
    if (isHistoryUpdate.current) {
      isHistoryUpdate.current = false;
      return;
    }
    setHistory((prev) => {
      const truncated = prev.slice(0, historyIndex + 1);
      return [...truncated, JSON.parse(JSON.stringify(newPages))];
    });
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  // Set initial zoom based on screen size
  useEffect(() => {
    const handleResize = () => {
      const availableW = window.innerWidth - 380; // account for sidebar
      const availableH = window.innerHeight - 130; // account for headers
      const fitZoom = Math.min(availableW / currentPage.width, availableH / currentPage.height) * 0.88;
      setZoom(Math.max(0.2, Math.min(1.2, parseFloat(fitZoom.toFixed(2)))));
    };
    handleResize();
  }, [currentPage.width, currentPage.height]);

  // Undo handler
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const targetIndex = historyIndex - 1;
      isHistoryUpdate.current = true;
      setHistoryIndex(targetIndex);
      setPages(JSON.parse(JSON.stringify(history[targetIndex])));
      setSelectedIds([]);
    }
  }, [history, historyIndex]);

  // Redo handler
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const targetIndex = historyIndex + 1;
      isHistoryUpdate.current = true;
      setHistoryIndex(targetIndex);
      setPages(JSON.parse(JSON.stringify(history[targetIndex])));
      setSelectedIds([]);
    }
  }, [history, historyIndex]);

  // Element mutation handlers
  const handleUpdateElement = (id: string, updates: Partial<CanvasElement>) => {
    setPages((prevPages) => {
      const nextPages = prevPages.map((pg, idx) => {
        if (idx !== currentPageIndex) return pg;
        return {
          ...pg,
          elements: pg.elements.map((el) => {
            if (el.id !== id) return el;
            return { ...el, ...updates } as CanvasElement;
          }),
        };
      });
      pushStateToHistory(nextPages);
      return nextPages;
    });
  };

  const handleUpdateElements = (updatesList: { id: string; updates: Partial<CanvasElement> }[]) => {
    const updateMap = new Map(updatesList.map((u) => [u.id, u.updates]));
    setPages((prevPages) => {
      const nextPages = prevPages.map((pg, idx) => {
        if (idx !== currentPageIndex) return pg;
        return {
          ...pg,
          elements: pg.elements.map((el) => {
            const up = updateMap.get(el.id);
            if (!up) return el;
            return { ...el, ...up } as CanvasElement;
          }),
        };
      });
      return nextPages;
    });
  };

  const handleAddElement = (element: CanvasElement) => {
    setPages((prevPages) => {
      const nextPages = prevPages.map((pg, idx) => {
        if (idx !== currentPageIndex) return pg;
        return {
          ...pg,
          elements: [...pg.elements, element],
        };
      });
      pushStateToHistory(nextPages);
      return nextPages;
    });
    setSelectedIds([element.id]);
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    setPages((prevPages) => {
      const nextPages = prevPages.map((pg, idx) => {
        if (idx !== currentPageIndex) return pg;
        return {
          ...pg,
          elements: pg.elements.filter((el) => !selectedIds.includes(el.id)),
        };
      });
      pushStateToHistory(nextPages);
      return nextPages;
    });
    setSelectedIds([]);
  };

  const handleDeleteElement = (id: string) => {
    setPages((prevPages) => {
      const nextPages = prevPages.map((pg, idx) => {
        if (idx !== currentPageIndex) return pg;
        return {
          ...pg,
          elements: pg.elements.filter((el) => el.id !== id),
        };
      });
      pushStateToHistory(nextPages);
      return nextPages;
    });
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  };

  const handleDuplicateSelected = () => {
    if (selectedIds.length === 0) return;
    const duplicatedElements: CanvasElement[] = [];

    setPages((prevPages) => {
      const nextPages = prevPages.map((pg, idx) => {
        if (idx !== currentPageIndex) return pg;
        const currentSelected = pg.elements.filter((el) => selectedIds.includes(el.id));
        const newCopies: CanvasElement[] = currentSelected.map((el) => ({
          ...JSON.parse(JSON.stringify(el)),
          id: `${el.type}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: `${el.name} (copie)`,
          x: el.x + 24,
          y: el.y + 24,
          zIndex: Date.now(),
        }));
        duplicatedElements.push(...newCopies);
        return {
          ...pg,
          elements: [...pg.elements, ...newCopies],
        };
      });
      pushStateToHistory(nextPages);
      return nextPages;
    });

    if (duplicatedElements.length > 0) {
      setSelectedIds(duplicatedElements.map((el) => el.id));
    }
  };

  // Reorder layer
  const handleMoveLayer = (id: string, direction: 'up' | 'down') => {
    setPages((prevPages) => {
      const nextPages = prevPages.map((pg, idx) => {
        if (idx !== currentPageIndex) return pg;
        const sorted = [...pg.elements].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
        const itemIdx = sorted.findIndex((el) => el.id === id);
        if (itemIdx === -1) return pg;

        if (direction === 'up' && itemIdx < sorted.length - 1) {
          const current = sorted[itemIdx];
          const next = sorted[itemIdx + 1];
          const tempZ = current.zIndex;
          current.zIndex = next.zIndex;
          next.zIndex = tempZ;
        } else if (direction === 'down' && itemIdx > 0) {
          const current = sorted[itemIdx];
          const prev = sorted[itemIdx - 1];
          const tempZ = current.zIndex;
          current.zIndex = prev.zIndex;
          prev.zIndex = tempZ;
        }

        return { ...pg, elements: sorted };
      });
      pushStateToHistory(nextPages);
      return nextPages;
    });
  };

  const handleBringToFront = () => {
    if (selectedIds.length === 0) return;
    const maxZ = Math.max(...currentPage.elements.map((el) => el.zIndex || 0), 0);
    handleUpdateElement(selectedIds[0], { zIndex: maxZ + 1 });
  };

  const handleSendToBack = () => {
    if (selectedIds.length === 0) return;
    const minZ = Math.min(...currentPage.elements.map((el) => el.zIndex || 0), 1);
    handleUpdateElement(selectedIds[0], { zIndex: Math.max(0, minZ - 1) });
  };

  // Apply template
  const handleApplyTemplate = (templatePage: CanvasPage) => {
    const cloned = JSON.parse(JSON.stringify(templatePage));
    cloned.id = `page-${Date.now()}`;
    setPages((prev) => {
      const next = prev.map((pg, idx) => (idx === currentPageIndex ? cloned : pg));
      pushStateToHistory(next);
      return next;
    });
    setSelectedIds([]);
  };

  // Apply brand kit palette to current page
  const handleApplyPalette = (palette: ColorPalette) => {
    setPages((prevPages) => {
      const nextPages = prevPages.map((pg, idx) => {
        if (idx !== currentPageIndex) return pg;
        return {
          ...pg,
          backgroundColor: palette.background,
          elements: pg.elements.map((el) => {
            if (el.type === 'text') {
              const t = el as TextElement;
              // If kicker, use accent, else primary
              if (t.fontSize <= 16 && t.fontFamily.includes('Space')) {
                return { ...t, color: palette.accent };
              }
              return { ...t, color: palette.textPrimary };
            }
            if (el.type === 'shape') {
              // Subtle frame color update
              if (el.fill === 'transparent') {
                return { ...el, stroke: palette.accent };
              }
            }
            return el;
          }),
        };
      });
      pushStateToHistory(nextPages);
      return nextPages;
    });
  };

  // Apply font pairing
  const handleApplyFontPairing = (pairing: FontPairing) => {
    setPages((prevPages) => {
      const nextPages = prevPages.map((pg, idx) => {
        if (idx !== currentPageIndex) return pg;
        return {
          ...pg,
          elements: pg.elements.map((el) => {
            if (el.type === 'text') {
              const t = el as TextElement;
              if (t.fontSize >= 32) {
                return { ...t, fontFamily: pairing.headingFont };
              }
              return { ...t, fontFamily: pairing.bodyFont };
            }
            return el;
          }),
        };
      });
      pushStateToHistory(nextPages);
      return nextPages;
    });
  };

  // Select format preset (resize current page)
  const handleSelectFormat = (fmt: PresetFormat) => {
    setPages((prevPages) => {
      const nextPages = prevPages.map((pg, idx) => {
        if (idx !== currentPageIndex) return pg;
        return {
          ...pg,
          width: fmt.width,
          height: fmt.height,
        };
      });
      pushStateToHistory(nextPages);
      return nextPages;
    });
  };

  // Page management
  const handleAddPage = () => {
    const newPage: CanvasPage = {
      id: `page-${Date.now()}`,
      name: `Page ${pages.length + 1}`,
      width: currentPage.width,
      height: currentPage.height,
      backgroundColor: currentPage.backgroundColor,
      elements: [],
    };
    const nextPages = [...pages, newPage];
    setPages(nextPages);
    setCurrentPageIndex(pages.length);
    setSelectedIds([]);
    pushStateToHistory(nextPages);
  };

  const handleDuplicatePage = (index: number) => {
    const target = pages[index];
    const duplicated: CanvasPage = {
      ...JSON.parse(JSON.stringify(target)),
      id: `page-${Date.now()}`,
      name: `${target.name} (copie)`,
    };
    const nextPages = [...pages];
    nextPages.splice(index + 1, 0, duplicated);
    setPages(nextPages);
    setCurrentPageIndex(index + 1);
    setSelectedIds([]);
    pushStateToHistory(nextPages);
  };

  const handleDeletePage = (index: number) => {
    if (pages.length <= 1) return;
    const nextPages = pages.filter((_, idx) => idx !== index);
    setPages(nextPages);
    setCurrentPageIndex(Math.max(0, index - 1));
    setSelectedIds([]);
    pushStateToHistory(nextPages);
  };

  const handleFitScreen = () => {
    const availableW = window.innerWidth - 380;
    const availableH = window.innerHeight - 130;
    const fitZoom = Math.min(availableW / currentPage.width, availableH / currentPage.height) * 0.88;
    setZoom(Math.max(0.2, Math.min(1.2, parseFloat(fitZoom.toFixed(2)))));
  };

  const activeElement = selectedIds.length === 1 ? currentPage.elements.find((el) => el.id === selectedIds[0]) || null : null;

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0D0E12] text-zinc-100 select-none">
      {/* 1. Top Header */}
      <Header
        projectTitle={projectTitle}
        currentWidth={currentPage.width}
        currentHeight={currentPage.height}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUpdateTitle={setProjectTitle}
        onSelectFormat={handleSelectFormat}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onOpenExport={() => setIsExportOpen(true)}
        onOpenPresentation={() => setIsPresentationOpen(true)}
        onOpenAI={() => setIsAIOpen(true)}
      />

      {/* 2. Contextual Inspector Bar */}
      <InspectorBar
        element={activeElement}
        onUpdateElement={handleUpdateElement}
        onDeleteSelected={handleDeleteSelected}
        onDuplicateSelected={handleDuplicateSelected}
        onBringForward={() => selectedIds[0] && handleMoveLayer(selectedIds[0], 'up')}
        onSendBackward={() => selectedIds[0] && handleMoveLayer(selectedIds[0], 'down')}
        onBringToFront={handleBringToFront}
        onSendToBack={handleSendToBack}
      />

      {/* 3. Main Workspace: Left Sidebar + Interactive Canvas */}
      <main className="flex-1 flex overflow-hidden relative">
        <LeftSidebar
          currentPage={currentPage}
          selectedIds={selectedIds}
          onSelect={setSelectedIds}
          onAddElement={handleAddElement}
          onUpdateElement={handleUpdateElement}
          onDeleteElement={handleDeleteElement}
          onMoveLayer={handleMoveLayer}
          onApplyTemplate={handleApplyTemplate}
          onApplyPalette={handleApplyPalette}
          onApplyFontPairing={handleApplyFontPairing}
        />

        <InteractiveCanvas
          page={currentPage}
          selectedIds={selectedIds}
          zoom={zoom}
          onSelect={setSelectedIds}
          onUpdateElement={handleUpdateElement}
          onUpdateElements={handleUpdateElements}
          onDeleteSelected={handleDeleteSelected}
          onDuplicateSelected={handleDuplicateSelected}
          onUndo={handleUndo}
          onRedo={handleRedo}
        />
      </main>

      {/* 4. Bottom Page Navigator & Zoom Dock */}
      <PageNavigator
        pages={pages}
        currentPageIndex={currentPageIndex}
        zoom={zoom}
        onSelectPage={setCurrentPageIndex}
        onAddPage={handleAddPage}
        onDuplicatePage={handleDuplicatePage}
        onDeletePage={handleDeletePage}
        onZoomChange={setZoom}
        onFitScreen={handleFitScreen}
      />

      {/* 5. Modals */}
      {isExportOpen && (
        <ExportModal page={currentPage} onClose={() => setIsExportOpen(false)} />
      )}

      {isPresentationOpen && (
        <PresentationModal
          pages={pages}
          initialPageIndex={currentPageIndex}
          onClose={() => setIsPresentationOpen(false)}
        />
      )}
    </div>
  );
}
