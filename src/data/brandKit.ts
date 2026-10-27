/**
 * Origi Brand Kit & Design System
 * Inspired by origi.framer.ai visual identity:
 * - High-contrast editorial typography (Cormorant Garamond, Syne, Plus Jakarta Sans, Space Grotesk)
 * - Deep obsidian, warm sandstone, chalk white, and subtle earthen accents
 * - Clean architectural grid layouts and refined minimal aesthetics
 */

import { ColorPalette, FontPairing, PresetFormat } from '../types/canvas';

export const ORIGI_FORMATS: PresetFormat[] = [
  {
    id: 'instagram-post',
    name: 'Instagram Carré',
    width: 1080,
    height: 1080,
    category: 'social',
    icon: 'Square',
  },
  {
    id: 'instagram-portrait',
    name: 'Instagram Portrait',
    width: 1080,
    height: 1350,
    category: 'social',
    icon: 'Smartphone',
  },
  {
    id: 'instagram-story',
    name: 'Story & Reel (9:16)',
    width: 1080,
    height: 1920,
    category: 'social',
    icon: 'Smartphone',
  },
  {
    id: 'presentation-16-9',
    name: 'Présentation Pitch Deck',
    width: 1920,
    height: 1080,
    category: 'presentation',
    icon: 'Monitor',
  },
  {
    id: 'poster-editorial',
    name: 'Affiche Éditoriale (3:4)',
    width: 1200,
    height: 1600,
    category: 'print',
    icon: 'FileText',
  },
  {
    id: 'business-card',
    name: 'Carte de Visite Luxe',
    width: 1050,
    height: 600,
    category: 'print',
    icon: 'CreditCard',
  },
  {
    id: 'web-banner',
    name: 'Bannière Web Studio',
    width: 1500,
    height: 500,
    category: 'digital',
    icon: 'Layout',
  },
];

export const ORIGI_PALETTES: ColorPalette[] = [
  {
    id: 'origi-noir',
    name: 'Origi Obsidian & Crème',
    description: 'Contraste signature noir d’encre, alabâtre et or champagne discret',
    colors: ['#0C0D11', '#181A20', '#F5F2EB', '#DCD5C9', '#C2A378', '#73706B'],
    background: '#0C0D11',
    textPrimary: '#F5F2EB',
    accent: '#C2A378',
  },
  {
    id: 'origi-atelier-sand',
    name: 'Atelier Pierre & Argile',
    description: 'Tons minéraux épurés, pierre ponce et noir calligraphique',
    colors: ['#F3EFE6', '#E4DCD0', '#1C1B19', '#3D3A35', '#A39988', '#8C5E48'],
    background: '#F3EFE6',
    textPrimary: '#1C1B19',
    accent: '#8C5E48',
  },
  {
    id: 'origi-brutalist',
    name: 'Brutaliste Électrique',
    description: 'Graphisme fort, indigo profond et touches néon ultra-modernes',
    colors: ['#0A0B10', '#1E2235', '#F8FAFC', '#6366F1', '#10B981', '#F43F5E'],
    background: '#0A0B10',
    textPrimary: '#F8FAFC',
    accent: '#6366F1',
  },
  {
    id: 'origi-monochrome',
    name: 'Monochrome Pur',
    description: 'Nuances de gris neutres, blancs purs et noirs absolus',
    colors: ['#FFFFFF', '#F4F4F5', '#E4E4E7', '#71717A', '#27272A', '#09090B'],
    background: '#09090B',
    textPrimary: '#FFFFFF',
    accent: '#E4E4E7',
  },
  {
    id: 'origi-botanical',
    name: 'Sauge & Lin Naturel',
    description: 'Harmonie organique pour identités éco-luxe et bien-être',
    colors: ['#F7F7F2', '#E1E4D9', '#2E3830', '#4A5B4F', '#8F9B89', '#C5835C'],
    background: '#F7F7F2',
    textPrimary: '#2E3830',
    accent: '#4A5B4F',
  },
];

export const ORIGI_FONT_PAIRINGS: FontPairing[] = [
  {
    id: 'editorial-couture',
    name: 'Éditorial & Atelier',
    style: 'Cormorant Garamond + Plus Jakarta Sans',
    headingFont: 'Cormorant Garamond',
    bodyFont: 'Plus Jakarta Sans',
  },
  {
    id: 'avant-garde',
    name: 'Avant-Garde Studio',
    style: 'Syne + Space Grotesk',
    headingFont: 'Syne',
    bodyFont: 'Space Grotesk',
  },
  {
    id: 'classical-luxury',
    name: 'Haute Horlogerie & Luxe',
    style: 'Cinzel + Cormorant Garamond',
    headingFont: 'Cinzel',
    bodyFont: 'Cormorant Garamond',
  },
  {
    id: 'minimal-brutalist',
    name: 'Brutaliste Architectural',
    style: 'Space Grotesk + JetBrains Mono',
    headingFont: 'Space Grotesk',
    bodyFont: 'JetBrains Mono',
  },
];

export const AVAILABLE_FONTS = [
  { name: 'Cormorant Garamond', category: 'Serif Éditorial', weight: '300, 400, 600, 700' },
  { name: 'Syne', category: 'Avant-Garde Display', weight: '500, 700, 800' },
  { name: 'Plus Jakarta Sans', category: 'Sans Moderne', weight: '300, 400, 500, 600, 700' },
  { name: 'Space Grotesk', category: 'Monospace / Display', weight: '400, 500, 600, 700' },
  { name: 'Cinzel', category: 'Luxe Romain', weight: '400, 600, 700' },
  { name: 'JetBrains Mono', category: 'Monospace Précision', weight: '400, 500' },
];
