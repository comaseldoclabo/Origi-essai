/**
 * Origi Canvas - Core Type Definitions
 */

export type ElementType = 'text' | 'shape' | 'image' | 'line' | 'badge' | 'frame';

export type ShapeType = 
  | 'rectangle' 
  | 'circle' 
  | 'arch' 
  | 'pill' 
  | 'triangle' 
  | 'star' 
  | 'diamond' 
  | 'polygon'
  | 'stamp';

export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type TextTransform = 'none' | 'uppercase' | 'lowercase' | 'capitalize';

export interface BaseElement {
  id: string;
  type: ElementType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number; // in degrees
  opacity: number; // 0 to 1
  locked?: boolean;
  visible?: boolean;
  zIndex: number;
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number | string;
  fontStyle?: 'normal' | 'italic';
  color: string;
  textAlign: TextAlign;
  letterSpacing: number; // in px
  lineHeight: number; // unitless multiplier e.g. 1.2
  textTransform?: TextTransform;
  textDecoration?: 'none' | 'underline' | 'line-through';
  backgroundColor?: string;
  padding?: number;
  borderRadius?: number;
}

export interface ShapeElement extends BaseElement {
  type: 'shape';
  shapeType: ShapeType;
  fill: string;
  stroke: string;
  strokeWidth: number;
  strokeDasharray?: string;
  borderRadius?: number;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  alt?: string;
  objectFit: 'cover' | 'contain';
  borderRadius: number;
  filter?: string; // CSS filter e.g. 'grayscale(100%)'
  filterPreset?: 'none' | 'bw' | 'vintage' | 'noir' | 'sepia' | 'contrast' | 'cool' | 'glow';
  shadowColor?: string;
  shadowBlur?: number;
}

export interface LineElement extends BaseElement {
  type: 'line';
  strokeColor: string;
  strokeWidth: number;
  lineStyle: 'solid' | 'dashed' | 'dotted';
  arrowStart?: boolean;
  arrowEnd?: boolean;
}

export interface BadgeElement extends BaseElement {
  type: 'badge';
  text: string;
  subtext?: string;
  styleVariant: 'origi-stamp' | 'curved' | 'minimal-tag' | 'architectural';
  bgColor: string;
  textColor: string;
  borderColor?: string;
}

export type CanvasElement = TextElement | ShapeElement | ImageElement | LineElement | BadgeElement;

export interface CanvasPage {
  id: string;
  name: string;
  width: number;
  height: number;
  backgroundColor: string;
  elements: CanvasElement[];
}

export interface PresetFormat {
  id: string;
  name: string;
  width: number;
  height: number;
  category: 'social' | 'print' | 'presentation' | 'digital';
  icon: string;
}

export interface ColorPalette {
  id: string;
  name: string;
  description: string;
  colors: string[];
  background: string;
  textPrimary: string;
  accent: string;
}

export interface FontPairing {
  id: string;
  name: string;
  style: string;
  headingFont: string;
  bodyFont: string;
  displayFont?: string;
}
