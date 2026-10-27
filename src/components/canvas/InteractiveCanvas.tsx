/**
 * Interactive Canvas Engine
 * The main high-performance workspace for Origi Canvas
 */

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { CanvasElement, CanvasPage } from '../../types/canvas';
import { CanvasElementView } from './CanvasElementView';
import { TransformHandles } from './TransformHandles';
import { AlignmentGuides, GuideLine } from './AlignmentGuides';

interface InteractiveCanvasProps {
  page: CanvasPage;
  selectedIds: string[];
  zoom: number;
  onSelect: (ids: string[]) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onUpdateElements: (updates: { id: string; updates: Partial<CanvasElement> }[]) => void;
  onDeleteSelected: () => void;
  onDuplicateSelected: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
}

export const InteractiveCanvas: React.FC<InteractiveCanvasProps> = ({
  page,
  selectedIds,
  zoom,
  onSelect,
  onUpdateElement,
  onUpdateElements,
  onDeleteSelected,
  onDuplicateSelected,
  onUndo,
  onRedo,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Pan state
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const panStartRef = useRef({ x: 0, y: 0, startPanX: 0, startPanY: 0 });

  // Dragging elements state
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{
    startX: number;
    startY: number;
    initialPositions: { id: string; x: number; y: number }[];
  }>({ startX: 0, startY: 0, initialPositions: [] });

  // Resizing state
  const [resizing, setResizing] = useState<{
    handle: string;
    startX: number;
    startY: number;
    elX: number;
    elY: number;
    elW: number;
    elH: number;
    id: string;
  } | null>(null);

  // Rotating state
  const [rotating, setRotating] = useState<{
    id: string;
    centerX: number;
    centerY: number;
    startAngle: number;
    initialRotation: number;
  } | null>(null);

  // Smart snapping guides
  const [guides, setGuides] = useState<GuideLine[]>([]);

  // Selected element (single)
  const singleSelected = selectedIds.length === 1 ? page.elements.find((el) => el.id === selectedIds[0]) : null;

  // Spacebar pan detection
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input/textarea
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      if (e.code === 'Space' && !e.repeat) {
        setIsSpacePressed(true);
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedIds.length > 0) {
          e.preventDefault();
          onDeleteSelected();
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        onDuplicateSelected();
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          onRedo?.();
        } else {
          onUndo?.();
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        onRedo?.();
      }

      // Nudge with arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && selectedIds.length > 0) {
        e.preventDefault();
        const delta = e.shiftKey ? 10 : 1;
        let dx = 0;
        let dy = 0;
        if (e.key === 'ArrowUp') dy = -delta;
        if (e.key === 'ArrowDown') dy = delta;
        if (e.key === 'ArrowLeft') dx = -delta;
        if (e.key === 'ArrowRight') dx = delta;

        const updates = selectedIds.map((id) => {
          const el = page.elements.find((item) => item.id === id);
          return {
            id,
            updates: {
              x: (el?.x || 0) + dx,
              y: (el?.y || 0) + dy,
            },
          };
        });
        onUpdateElements(updates);
      }

      if (e.key === 'Escape') {
        onSelect([]);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectedIds, page.elements, onDeleteSelected, onDuplicateSelected, onUndo, onRedo, onSelect, onUpdateElements]);

  // Mouse wheel zoom / pan
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      // Canvas zoom is handled by parent, but we can let default prevent
      e.preventDefault();
    } else {
      // Pan with scroll
      setPan((prev) => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
    }
  };

  // Background mousedown: start pan or clear selection
  const handleContainerMouseDown = (e: React.MouseEvent) => {
    if (isSpacePressed || e.button === 1) {
      // Pan
      setIsPanning(true);
      panStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        startPanX: pan.x,
        startPanY: pan.y,
      };
      return;
    }

    // Clicked empty canvas/board background -> deselect
    if (e.target === containerRef.current || (canvasRef.current && e.target === canvasRef.current)) {
      onSelect([]);
    }
  };

  // Dragging element start
  const handleElementMouseDown = (e: React.MouseEvent, element: CanvasElement) => {
    if (isSpacePressed || e.button === 1 || element.locked) return;
    e.stopPropagation();

    let newSelected = [...selectedIds];
    if (e.shiftKey) {
      if (newSelected.includes(element.id)) {
        newSelected = newSelected.filter((id) => id !== element.id);
      } else {
        newSelected.push(element.id);
      }
    } else {
      if (!newSelected.includes(element.id)) {
        newSelected = [element.id];
      }
    }
    onSelect(newSelected);

    // Prepare dragging
    setIsDragging(true);
    const initialPositions = newSelected.map((id) => {
      const el = page.elements.find((item) => item.id === id);
      return { id, x: el?.x || 0, y: el?.y || 0 };
    });

    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialPositions,
    };
  };

  // Start resize
  const handleResizeStart = (handle: string, e: React.MouseEvent) => {
    if (!singleSelected) return;
    setResizing({
      handle,
      startX: e.clientX,
      startY: e.clientY,
      elX: singleSelected.x,
      elY: singleSelected.y,
      elW: singleSelected.width,
      elH: singleSelected.height,
      id: singleSelected.id,
    });
  };

  // Start rotate
  const handleRotateStart = (e: React.MouseEvent) => {
    if (!singleSelected || !canvasRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const centerX = canvasRect.left + (singleSelected.x + singleSelected.width / 2) * zoom;
    const centerY = canvasRect.top + (singleSelected.y + singleSelected.height / 2) * zoom;
    const rad = Math.atan2(e.clientY - centerY, e.clientX - centerX);

    setRotating({
      id: singleSelected.id,
      centerX,
      centerY,
      startAngle: rad,
      initialRotation: singleSelected.rotation || 0,
    });
  };

  // Global mouse move and up handlers
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      // 1. Panning canvas
      if (isPanning) {
        const dx = e.clientX - panStartRef.current.x;
        const dy = e.clientY - panStartRef.current.y;
        setPan({
          x: panStartRef.current.startPanX + dx,
          y: panStartRef.current.startPanY + dy,
        });
        return;
      }

      // 2. Dragging elements
      if (isDragging) {
        const dx = (e.clientX - dragStartRef.current.startX) / zoom;
        const dy = (e.clientY - dragStartRef.current.startY) / zoom;

        // Snapping calculations
        const newGuides: GuideLine[] = [];
        let snapX = dx;
        let snapY = dy;

        if (singleSelected) {
          const targetX = dragStartRef.current.initialPositions[0].x + dx;
          const targetY = dragStartRef.current.initialPositions[0].y + dy;
          const targetCenterX = targetX + singleSelected.width / 2;
          const targetCenterY = targetY + singleSelected.height / 2;
          const pageCenterX = page.width / 2;
          const pageCenterY = page.height / 2;
          const threshold = 6;

          // Snap to horizontal center
          if (Math.abs(targetCenterX - pageCenterX) < threshold) {
            snapX = pageCenterX - singleSelected.width / 2 - dragStartRef.current.initialPositions[0].x;
            newGuides.push({ type: 'x', position: pageCenterX });
          }
          // Snap to vertical center
          if (Math.abs(targetCenterY - pageCenterY) < threshold) {
            snapY = pageCenterY - singleSelected.height / 2 - dragStartRef.current.initialPositions[0].y;
            newGuides.push({ type: 'y', position: pageCenterY });
          }
        }

        setGuides(newGuides);

        const updates = dragStartRef.current.initialPositions.map((pos) => ({
          id: pos.id,
          updates: {
            x: Math.round(pos.x + snapX),
            y: Math.round(pos.y + snapY),
          },
        }));
        onUpdateElements(updates);
        return;
      }

      // 3. Resizing element
      if (resizing) {
        const dx = (e.clientX - resizing.startX) / zoom;
        const dy = (e.clientY - resizing.startY) / zoom;
        const { handle, elX, elY, elW, elH, id } = resizing;

        let newX = elX;
        let newY = elY;
        let newW = elW;
        let newH = elH;

        if (handle.includes('r')) newW = Math.max(20, elW + dx);
        if (handle.includes('l')) {
          const w = Math.max(20, elW - dx);
          newX = elX + (elW - w);
          newW = w;
        }
        if (handle.includes('b')) newH = Math.max(20, elH + dy);
        if (handle.includes('t')) {
          const h = Math.max(20, elH - dy);
          newY = elY + (elH - h);
          newH = h;
        }

        onUpdateElement(id, {
          x: Math.round(newX),
          y: Math.round(newY),
          width: Math.round(newW),
          height: Math.round(newH),
        });
        return;
      }

      // 4. Rotating element
      if (rotating) {
        const currentAngle = Math.atan2(e.clientY - rotating.centerY, e.clientX - rotating.centerX);
        const diffRad = currentAngle - rotating.startAngle;
        let deg = rotating.initialRotation + (diffRad * 180) / Math.PI;

        // Snap to 0, 90, 180, 270 degrees if within 4 degrees
        const snapAngles = [0, 90, 180, 270, 360];
        const normalized = ((deg % 360) + 360) % 360;
        for (const snap of snapAngles) {
          if (Math.abs(normalized - snap) < 4) {
            deg = snap;
            break;
          }
        }

        onUpdateElement(rotating.id, {
          rotation: Math.round(deg),
        });
      }
    },
    [isPanning, isDragging, resizing, rotating, zoom, singleSelected, page.width, page.height, onUpdateElements, onUpdateElement]
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setIsDragging(false);
    setResizing(null);
    setRotating(null);
    setGuides([]);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleContainerMouseDown}
      onWheel={handleWheel}
      className={`relative flex-1 h-full overflow-hidden flex items-center justify-center bg-[#090A0E] origi-canvas-dots ${
        isSpacePressed || isPanning ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'
      }`}
    >
      {/* Transformation viewport */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isPanning || isDragging || resizing || rotating ? 'none' : 'transform 0.15s ease-out',
        }}
        className="relative shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] rounded-sm"
      >
        {/* Canvas Board Paper */}
        <div
          ref={canvasRef}
          style={{
            width: `${page.width}px`,
            height: `${page.height}px`,
            backgroundColor: page.backgroundColor || '#0C0D11',
          }}
          className="relative overflow-hidden select-none"
        >
          {/* Smart Snapping Alignment Lines */}
          <AlignmentGuides guides={guides} canvasWidth={page.width} canvasHeight={page.height} />

          {/* Render Elements in ascending zIndex */}
          {[...page.elements]
            .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
            .map((el) => {
              if (el.visible === false) return null;
              const isSelected = selectedIds.includes(el.id);

              return (
                <div
                  key={el.id}
                  onMouseDown={(e) => handleElementMouseDown(e, el)}
                  style={{
                    position: 'absolute',
                    left: `${el.x}px`,
                    top: `${el.y}px`,
                    width: `${el.width}px`,
                    height: `${el.height}px`,
                    transform: el.rotation ? `rotate(${el.rotation}deg)` : undefined,
                    opacity: el.opacity ?? 1,
                    zIndex: el.zIndex || 1,
                    cursor: el.locked ? 'not-allowed' : isDragging ? 'grabbing' : 'move',
                  }}
                  className={`group ${isSelected ? 'ring-1 ring-[#C2A378]/50' : ''}`}
                >
                  <CanvasElementView
                    element={el}
                    isSelected={isSelected}
                    onUpdateText={(id, newText) => onUpdateElement(id, { text: newText } as Partial<CanvasElement>)}
                  />

                  {/* Transform Handles when selected */}
                  {isSelected && !el.locked && (
                    <TransformHandles
                      element={el}
                      zoom={zoom}
                      onResizeStart={handleResizeStart}
                      onRotateStart={handleRotateStart}
                    />
                  )}
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
