/**
 * Transform Handles for Canvas Elements
 * 8-point bounding box resize handles + rotation handle + dimensional readout
 */

import React from 'react';
import { RotateCw } from 'lucide-react';
import { CanvasElement } from '../../types/canvas';

interface TransformHandlesProps {
  element: CanvasElement;
  zoom: number;
  onResizeStart: (handle: string, e: React.MouseEvent) => void;
  onRotateStart: (e: React.MouseEvent) => void;
}

export const TransformHandles: React.FC<TransformHandlesProps> = ({
  element,
  zoom,
  onResizeStart,
  onRotateStart,
}) => {
  const handles = [
    { id: 'tl', cursor: 'nwse-resize', style: { top: -6, left: -6 } },
    { id: 't', cursor: 'ns-resize', style: { top: -6, left: '50%', transform: 'translateX(-50%)' } },
    { id: 'tr', cursor: 'nesw-resize', style: { top: -6, right: -6 } },
    { id: 'r', cursor: 'ew-resize', style: { top: '50%', right: -6, transform: 'translateY(-50%)' } },
    { id: 'br', cursor: 'nwse-resize', style: { bottom: -6, right: -6 } },
    { id: 'b', cursor: 'ns-resize', style: { bottom: -6, left: '50%', transform: 'translateX(-50%)' } },
    { id: 'bl', cursor: 'nesw-resize', style: { bottom: -6, left: -6 } },
    { id: 'l', cursor: 'ew-resize', style: { top: '50%', left: -6, transform: 'translateY(-50%)' } },
  ];

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none"
      style={{
        outline: '1.5px solid #C2A378',
        boxShadow: '0 0 0 1px rgba(0,0,0,0.5)',
      }}
    >
      {/* 8 resize handle anchors */}
      {handles.map((h) => (
        <div
          key={h.id}
          onMouseDown={(e) => {
            e.stopPropagation();
            onResizeStart(h.id, e);
          }}
          className="absolute w-3 h-3 bg-white border border-[#C2A378] rounded-[2px] pointer-events-auto transition-transform hover:scale-125 z-30"
          style={{
            ...h.style,
            cursor: h.cursor,
          }}
        />
      ))}

      {/* Rotation handle floating above top */}
      <div
        className="absolute left-1/2 -top-8 -translate-x-1/2 flex flex-col items-center pointer-events-auto cursor-grab active:cursor-grabbing z-30 group"
        onMouseDown={(e) => {
          e.stopPropagation();
          onRotateStart(e);
        }}
      >
        <div className="w-[1.5px] h-3 bg-[#C2A378]" />
        <div className="w-5 h-5 rounded-full bg-[#181A20] border border-[#C2A378] flex items-center justify-center text-[#C2A378] shadow-md group-hover:bg-[#C2A378] group-hover:text-black transition-colors">
          <RotateCw size={11} />
        </div>
      </div>

      {/* Dimensions tooltip badge at bottom center */}
      <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-black/85 backdrop-blur-sm text-[10px] font-mono text-zinc-300 rounded border border-white/10 whitespace-nowrap pointer-events-none">
        {Math.round(element.width)} × {Math.round(element.height)} px
        {element.rotation ? ` · ${Math.round(element.rotation)}°` : ''}
      </div>
    </div>
  );
};
