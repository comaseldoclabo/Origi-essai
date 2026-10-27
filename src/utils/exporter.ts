/**
 * Origi Canvas Exporter Utility
 * High-resolution canvas rendering to PNG, SVG vector generation, and JSON project backup
 */

import { CanvasElement, CanvasPage, ImageElement, LineElement, ShapeElement, TextElement } from '../types/canvas';

/**
 * Downloads a data URL or blob as a file in the browser
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Helper to load an image into an HTMLImageElement with CORS enabled
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Fallback try without crossOrigin or resolve placeholder
      const fallbackImg = new Image();
      fallbackImg.onload = () => resolve(fallbackImg);
      fallbackImg.onerror = (e) => reject(e);
      fallbackImg.src = src;
    };
    img.src = src;
  });
}

/**
 * Export a canvas page as a high-resolution PNG
 */
export async function exportPageToPNG(page: CanvasPage, filename = 'origi-design.png', scale = 2): Promise<void> {
  const canvas = document.createElement('canvas');
  canvas.width = page.width * scale;
  canvas.height = page.height * scale;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Scale context for retina / high-res export
  ctx.scale(scale, scale);

  // Background
  ctx.fillStyle = page.backgroundColor || '#0C0D11';
  ctx.fillRect(0, 0, page.width, page.height);

  // Sort elements by zIndex
  const sorted = [...page.elements]
    .filter((el) => el.visible !== false)
    .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));

  for (const el of sorted) {
    ctx.save();

    // Position and rotation
    const centerX = el.x + el.width / 2;
    const centerY = el.y + el.height / 2;
    ctx.translate(centerX, centerY);
    if (el.rotation) {
      ctx.rotate((el.rotation * Math.PI) / 180);
    }
    ctx.globalAlpha = el.opacity ?? 1;

    // Move to local origin (-width/2, -height/2)
    ctx.translate(-el.width / 2, -el.height / 2);

    if (el.type === 'shape') {
      const shape = el as ShapeElement;
      drawShapeOnCanvas(ctx, shape);
    } else if (el.type === 'image') {
      const imgEl = el as ImageElement;
      try {
        const loadedImg = await loadImage(imgEl.src);
        drawImageOnCanvas(ctx, imgEl, loadedImg);
      } catch (err) {
        console.warn('Could not load image for export, rendering placeholder', err);
        ctx.fillStyle = '#333';
        ctx.fillRect(0, 0, el.width, el.height);
      }
    } else if (el.type === 'text') {
      const textEl = el as TextElement;
      drawTextOnCanvas(ctx, textEl);
    } else if (el.type === 'line') {
      const lineEl = el as LineElement;
      drawLineOnCanvas(ctx, lineEl);
    }

    ctx.restore();
  }

  // Trigger download
  const dataUrl = canvas.toDataURL('image/png', 1.0);
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function drawShapeOnCanvas(ctx: CanvasRenderingContext2D, shape: ShapeElement) {
  const { width, height, shapeType, fill, stroke, strokeWidth, borderRadius = 0 } = shape;

  ctx.fillStyle = fill || 'transparent';
  ctx.strokeStyle = stroke || 'transparent';
  ctx.lineWidth = strokeWidth || 0;

  if (shape.strokeDasharray) {
    ctx.setLineDash(shape.strokeDasharray.split(',').map((v) => parseInt(v.trim()) || 4));
  } else {
    ctx.setLineDash([]);
  }

  ctx.beginPath();
  if (shapeType === 'circle') {
    ctx.arc(width / 2, height / 2, Math.min(width, height) / 2, 0, Math.PI * 2);
  } else if (shapeType === 'arch') {
    const radius = width / 2;
    ctx.moveTo(0, height);
    ctx.lineTo(0, radius);
    ctx.arc(radius, radius, radius, Math.PI, 0, false);
    ctx.lineTo(width, height);
    ctx.closePath();
  } else if (shapeType === 'star') {
    const cx = width / 2;
    const cy = height / 2;
    const spikes = 4;
    const outerRadius = Math.min(width, height) / 2;
    const innerRadius = outerRadius * 0.28;
    let rot = (Math.PI / 2) * 3;
    const step = Math.PI / spikes;

    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      let x = cx + Math.cos(rot) * outerRadius;
      let y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
  } else if (shapeType === 'diamond') {
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width, height / 2);
    ctx.lineTo(width / 2, height);
    ctx.lineTo(0, height / 2);
    ctx.closePath();
  } else if (shapeType === 'pill') {
    const r = height / 2;
    ctx.roundRect(0, 0, width, height, r);
  } else {
    // Standard rectangle with border radius
    ctx.roundRect(0, 0, width, height, borderRadius);
  }

  if (fill && fill !== 'transparent') ctx.fill();
  if (stroke && stroke !== 'transparent' && strokeWidth > 0) ctx.stroke();
}

function drawImageOnCanvas(ctx: CanvasRenderingContext2D, el: ImageElement, img: HTMLImageElement) {
  const { width, height, borderRadius = 0, filterPreset } = el;

  ctx.save();
  if (borderRadius > 0) {
    ctx.beginPath();
    ctx.roundRect(0, 0, width, height, borderRadius);
    ctx.clip();
  }

  // Filter effect if any
  if (filterPreset === 'noir' || filterPreset === 'bw') {
    ctx.filter = 'grayscale(100%) contrast(120%)';
  } else if (filterPreset === 'sepia') {
    ctx.filter = 'sepia(80%)';
  } else if (filterPreset === 'vintage') {
    ctx.filter = 'sepia(35%) contrast(110%) brightness(95%)';
  } else if (filterPreset === 'contrast') {
    ctx.filter = 'contrast(125%) brightness(105%)';
  }

  ctx.drawImage(img, 0, 0, width, height);
  ctx.restore();
}

function drawTextOnCanvas(ctx: CanvasRenderingContext2D, el: TextElement) {
  const { text, fontSize, fontFamily, fontWeight, fontStyle = 'normal', color, textAlign, letterSpacing = 0, lineHeight = 1.2, textTransform } = el;

  let displayText = text;
  if (textTransform === 'uppercase') displayText = text.toUpperCase();
  else if (textTransform === 'lowercase') displayText = text.toLowerCase();

  ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}", serif, sans-serif`;
  ctx.fillStyle = color || '#FFFFFF';
  ctx.textBaseline = 'top';

  const lines = displayText.split('\n');
  const actualLineHeight = fontSize * lineHeight;

  lines.forEach((line, index) => {
    let startX = 0;
    if (textAlign === 'center') {
      startX = el.width / 2;
      ctx.textAlign = 'center';
    } else if (textAlign === 'right') {
      startX = el.width;
      ctx.textAlign = 'right';
    } else {
      startX = 0;
      ctx.textAlign = 'left';
    }

    const y = index * actualLineHeight;
    // Basic letter spacing if supported
    if (letterSpacing && (ctx as unknown as { letterSpacing?: string }).letterSpacing !== undefined) {
      (ctx as unknown as { letterSpacing: string }).letterSpacing = `${letterSpacing}px`;
    }
    ctx.fillText(line, startX, y);
  });
}

function drawLineOnCanvas(ctx: CanvasRenderingContext2D, el: LineElement) {
  const { width, height, strokeColor, strokeWidth, lineStyle } = el;
  ctx.strokeStyle = strokeColor || '#C2A378';
  ctx.lineWidth = strokeWidth || 2;

  if (lineStyle === 'dashed') {
    ctx.setLineDash([8, 6]);
  } else if (lineStyle === 'dotted') {
    ctx.setLineDash([3, 4]);
  } else {
    ctx.setLineDash([]);
  }

  ctx.beginPath();
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();
}

/**
 * Generate clean SVG string for high-precision vector export
 */
export function exportPageToSVG(page: CanvasPage): string {
  const elementsSvg = page.elements
    .filter((el) => el.visible !== false)
    .sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0))
    .map((el) => {
      const transform = `transform="translate(${el.x}, ${el.y}) rotate(${el.rotation || 0} ${el.width / 2} ${el.height / 2})" opacity="${el.opacity ?? 1}"`;

      if (el.type === 'shape') {
        const s = el as ShapeElement;
        if (s.shapeType === 'circle') {
          return `<g ${transform}><circle cx="${s.width / 2}" cy="${s.height / 2}" r="${s.width / 2}" fill="${s.fill}" stroke="${s.stroke}" stroke-width="${s.strokeWidth}" /></g>`;
        }
        if (s.shapeType === 'arch') {
          const r = s.width / 2;
          return `<g ${transform}><path d="M 0 ${s.height} L 0 ${r} A ${r} ${r} 0 0 1 ${s.width} ${r} L ${s.width} ${s.height} Z" fill="${s.fill}" stroke="${s.stroke}" stroke-width="${s.strokeWidth}" /></g>`;
        }
        return `<g ${transform}><rect width="${s.width}" height="${s.height}" rx="${s.borderRadius || 0}" fill="${s.fill}" stroke="${s.stroke}" stroke-width="${s.strokeWidth}" /></g>`;
      }

      if (el.type === 'image') {
        const img = el as ImageElement;
        return `<g ${transform}><image href="${img.src}" width="${img.width}" height="${img.height}" preserveAspectRatio="xMidYMid slice" /></g>`;
      }

      if (el.type === 'text') {
        const t = el as TextElement;
        const alignMap = { left: 'start', center: 'middle', right: 'end', justify: 'start' };
        const xPos = t.textAlign === 'center' ? t.width / 2 : t.textAlign === 'right' ? t.width : 0;
        return `<g ${transform}><text x="${xPos}" y="${t.fontSize}" font-family="${t.fontFamily}" font-size="${t.fontSize}px" font-weight="${t.fontWeight}" fill="${t.color}" text-anchor="${alignMap[t.textAlign] || 'start'}">${escapeXml(t.text)}</text></g>`;
      }

      if (el.type === 'line') {
        const l = el as LineElement;
        return `<g ${transform}><line x1="0" y1="${l.height / 2}" x2="${l.width}" y2="${l.height / 2}" stroke="${l.strokeColor}" stroke-width="${l.strokeWidth}" /></g>`;
      }

      return '';
    })
    .join('\n  ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${page.width} ${page.height}" width="${page.width}" height="${page.height}">
  <!-- Origi Studio Canvas Vector Export -->
  <rect width="${page.width}" height="${page.height}" fill="${page.backgroundColor || '#0C0D11'}" />
  ${elementsSvg}
</svg>`;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
