/**
 * Canvas Element Renderer
 * Renders individual elements on canvas with styling, text editing, and SVG shapes
 */

import React, { useState, useRef, useEffect } from 'react';
import { CanvasElement, ImageElement, LineElement, ShapeElement, TextElement, BadgeElement } from '../../types/canvas';

interface CanvasElementViewProps {
  element: CanvasElement;
  isSelected: boolean;
  onUpdateText?: (id: string, newText: string) => void;
}

export const CanvasElementView: React.FC<CanvasElementViewProps> = ({
  element,
  isSelected,
  onUpdateText,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textInputRef.current) {
      textInputRef.current.focus();
      textInputRef.current.select();
    }
  }, [isEditing]);

  const handleTextBlur = () => {
    setIsEditing(false);
    if (textInputRef.current && onUpdateText) {
      onUpdateText(element.id, textInputRef.current.value);
    }
  };

  // Render text element
  if (element.type === 'text') {
    const t = element as TextElement;

    if (isEditing) {
      return (
        <textarea
          ref={textInputRef}
          defaultValue={t.text}
          onBlur={handleTextBlur}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsEditing(false);
            }
          }}
          className="w-full h-full bg-transparent resize-none outline-none border border-amber-400 p-0 m-0 z-50 text-white"
          style={{
            fontFamily: t.fontFamily,
            fontSize: `${t.fontSize}px`,
            fontWeight: t.fontWeight,
            fontStyle: t.fontStyle || 'normal',
            color: t.color,
            textAlign: t.textAlign,
            letterSpacing: `${t.letterSpacing}px`,
            lineHeight: t.lineHeight,
            textTransform: t.textTransform || 'none',
            textDecoration: t.textDecoration || 'none',
          }}
        />
      );
    }

    return (
      <div
        onDoubleClick={(e) => {
          e.stopPropagation();
          if (!element.locked) setIsEditing(true);
        }}
        className="w-full h-full select-none cursor-default whitespace-pre-wrap break-words overflow-hidden"
        style={{
          fontFamily: t.fontFamily,
          fontSize: `${t.fontSize}px`,
          fontWeight: t.fontWeight,
          fontStyle: t.fontStyle || 'normal',
          color: t.color,
          textAlign: t.textAlign,
          letterSpacing: `${t.letterSpacing}px`,
          lineHeight: t.lineHeight,
          textTransform: t.textTransform || 'none',
          textDecoration: t.textDecoration || 'none',
          backgroundColor: t.backgroundColor || 'transparent',
          padding: t.padding ? `${t.padding}px` : undefined,
          borderRadius: t.borderRadius ? `${t.borderRadius}px` : undefined,
        }}
      >
        {t.text}
      </div>
    );
  }

  // Render shape element
  if (element.type === 'shape') {
    const s = element as ShapeElement;

    if (s.shapeType === 'arch') {
      const r = s.width / 2;
      return (
        <svg width="100%" height="100%" viewBox={`0 0 ${s.width} ${s.height}`} className="overflow-visible">
          <path
            d={`M 0 ${s.height} L 0 ${r} A ${r} ${r} 0 0 1 ${s.width} ${r} L ${s.width} ${s.height} Z`}
            fill={s.fill || 'transparent'}
            stroke={s.stroke || 'transparent'}
            strokeWidth={s.strokeWidth || 0}
            strokeDasharray={s.strokeDasharray}
          />
        </svg>
      );
    }

    if (s.shapeType === 'circle') {
      return (
        <div
          className="w-full h-full rounded-full"
          style={{
            backgroundColor: s.fill,
            border: s.strokeWidth ? `${s.strokeWidth}px solid ${s.stroke}` : undefined,
            boxShadow: s.shadowBlur ? `${s.shadowOffsetX || 0}px ${s.shadowOffsetY || 4}px ${s.shadowBlur}px ${s.shadowColor || 'rgba(0,0,0,0.4)'}` : undefined,
          }}
        />
      );
    }

    if (s.shapeType === 'pill') {
      return (
        <div
          className="w-full h-full rounded-full"
          style={{
            backgroundColor: s.fill,
            border: s.strokeWidth ? `${s.strokeWidth}px solid ${s.stroke}` : undefined,
          }}
        />
      );
    }

    if (s.shapeType === 'star') {
      const cx = s.width / 2;
      const cy = s.height / 2;
      const spikes = 4;
      const outerR = Math.min(s.width, s.height) / 2;
      const innerR = outerR * 0.28;
      let pathStr = '';
      let rot = (Math.PI / 2) * 3;
      const step = Math.PI / spikes;

      for (let i = 0; i < spikes; i++) {
        let x = cx + Math.cos(rot) * outerR;
        let y = cy + Math.sin(rot) * outerR;
        pathStr += (i === 0 ? `M ${x} ${y}` : ` L ${x} ${y}`);
        rot += step;

        x = cx + Math.cos(rot) * innerR;
        y = cy + Math.sin(rot) * innerR;
        pathStr += ` L ${x} ${y}`;
        rot += step;
      }
      pathStr += ' Z';

      return (
        <svg width="100%" height="100%" viewBox={`0 0 ${s.width} ${s.height}`}>
          <path d={pathStr} fill={s.fill} stroke={s.stroke} strokeWidth={s.strokeWidth} />
        </svg>
      );
    }

    if (s.shapeType === 'diamond') {
      return (
        <svg width="100%" height="100%" viewBox={`0 0 ${s.width} ${s.height}`}>
          <polygon
            points={`${s.width / 2},0 ${s.width},${s.height / 2} ${s.width / 2},${s.height} 0,${s.height / 2}`}
            fill={s.fill}
            stroke={s.stroke}
            strokeWidth={s.strokeWidth}
          />
        </svg>
      );
    }

    // Default rectangle
    return (
      <div
        className="w-full h-full"
        style={{
          backgroundColor: s.fill,
          borderRadius: `${s.borderRadius || 0}px`,
          border: s.strokeWidth ? `${s.strokeWidth}px solid ${s.stroke}` : undefined,
          boxShadow: s.shadowBlur ? `${s.shadowOffsetX || 0}px ${s.shadowOffsetY || 4}px ${s.shadowBlur}px ${s.shadowColor || 'rgba(0,0,0,0.4)'}` : undefined,
        }}
      />
    );
  }

  // Render image element
  if (element.type === 'image') {
    const img = element as ImageElement;

    let filterStyle = '';
    if (img.filterPreset === 'noir' || img.filterPreset === 'bw') {
      filterStyle = 'grayscale(100%) contrast(120%)';
    } else if (img.filterPreset === 'sepia') {
      filterStyle = 'sepia(80%)';
    } else if (img.filterPreset === 'vintage') {
      filterStyle = 'sepia(35%) contrast(110%) brightness(95%)';
    } else if (img.filterPreset === 'contrast') {
      filterStyle = 'contrast(125%) brightness(105%)';
    } else if (img.filterPreset === 'cool') {
      filterStyle = 'hue-rotate(180deg) saturate(85%)';
    }

    return (
      <div
        className="w-full h-full overflow-hidden select-none pointer-events-none"
        style={{
          borderRadius: `${img.borderRadius || 0}px`,
          boxShadow: img.shadowBlur ? `0 8px ${img.shadowBlur}px ${img.shadowColor || 'rgba(0,0,0,0.4)'}` : undefined,
        }}
      >
        <img
          src={img.src}
          alt={img.alt || 'Visuel'}
          crossOrigin="anonymous"
          className="w-full h-full select-none"
          style={{
            objectFit: img.objectFit || 'cover',
            filter: filterStyle || img.filter || 'none',
          }}
          draggable={false}
        />
      </div>
    );
  }

  // Render line element
  if (element.type === 'line') {
    const l = element as LineElement;
    return (
      <div className="w-full h-full flex items-center">
        <div
          className="w-full"
          style={{
            borderTop: `${l.strokeWidth}px ${l.lineStyle} ${l.strokeColor}`,
          }}
        />
      </div>
    );
  }

  // Render badge element
  if (element.type === 'badge') {
    const b = element as BadgeElement;
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center text-center p-2 rounded-full border"
        style={{
          backgroundColor: b.bgColor || '#181A20',
          borderColor: b.borderColor || 'rgba(255, 255, 255, 0.15)',
          color: b.textColor || '#F5F2EB',
        }}
      >
        <span className="text-xs font-mono tracking-widest uppercase font-semibold">{b.text}</span>
        {b.subtext && <span className="text-[10px] text-zinc-400 tracking-wider">{b.subtext}</span>}
      </div>
    );
  }

  return null;
};
