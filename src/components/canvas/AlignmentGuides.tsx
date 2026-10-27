/**
 * Smart Alignment Guides Component
 * Renders magnetic snapping lines across canvas during dragging
 */

import React from 'react';

export interface GuideLine {
  type: 'x' | 'y';
  position: number;
}

interface AlignmentGuidesProps {
  guides: GuideLine[];
  canvasWidth: number;
  canvasHeight: number;
}

export const AlignmentGuides: React.FC<AlignmentGuidesProps> = ({
  guides,
  canvasWidth,
  canvasHeight,
}) => {
  if (!guides.length) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-40 overflow-visible"
      width={canvasWidth}
      height={canvasHeight}
    >
      {guides.map((g, idx) => {
        if (g.type === 'x') {
          return (
            <line
              key={`guide-x-${idx}`}
              x1={g.position}
              y1={0}
              x2={g.position}
              y2={canvasHeight}
              stroke="#E11D48"
              strokeWidth="1"
              strokeDasharray="4 3"
            />
          );
        } else {
          return (
            <line
              key={`guide-y-${idx}`}
              x1={0}
              y1={g.position}
              x2={canvasWidth}
              y2={g.position}
              stroke="#E11D48"
              strokeWidth="1"
              strokeDasharray="4 3"
            />
          );
        }
      })}
    </svg>
  );
};
