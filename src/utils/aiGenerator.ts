/**
 * Origi AI Design Generator
 * Synthesizes Canva-level graphic designs using Origi's editorial visual identity
 */

import { CanvasElement, CanvasPage } from '../types/canvas';
import { CURATED_PHOTOS } from '../data/mediaLibrary';

export interface GenerateDesignParams {
  prompt: string;
  format: 'social' | 'presentation' | 'poster' | 'square';
  palettePreference?: 'dark' | 'sand' | 'brutalist' | 'monochrome';
}

export function generateOrigiDesign(params: GenerateDesignParams): CanvasPage {
  const { prompt, format, palettePreference = 'dark' } = params;
  const pLower = prompt.toLowerCase();

  // Dimensions
  let width = 1080;
  let height = 1350;
  if (format === 'square') {
    width = 1080;
    height = 1080;
  } else if (format === 'presentation') {
    width = 1920;
    height = 1080;
  } else if (format === 'poster') {
    width = 1200;
    height = 1600;
  }

  // Choose palette
  let bg = '#0C0D11';
  let primaryText = '#F5F2EB';
  let accent = '#C2A378';
  let secondaryText = '#9CA3AF';
  let frameStroke = 'rgba(245, 242, 235, 0.15)';

  if (palettePreference === 'sand' || pLower.includes('pierre') || pLower.includes('beige') || pLower.includes('naturel')) {
    bg = '#F3EFE6';
    primaryText = '#1C1B19';
    accent = '#8C5E48';
    secondaryText = '#73706B';
    frameStroke = 'rgba(28, 27, 25, 0.15)';
  } else if (palettePreference === 'brutalist' || pLower.includes('cyber') || pLower.includes('futur')) {
    bg = '#0A0B10';
    primaryText = '#FFFFFF';
    accent = '#6366F1';
    secondaryText = '#94A3B8';
    frameStroke = 'rgba(99, 102, 241, 0.3)';
  }

  // Choose photo matching keywords
  let photo = CURATED_PHOTOS[0].url;
  if (pLower.includes('archi') || pLower.includes('bâtiment') || pLower.includes('espace') || pLower.includes('béton')) {
    photo = CURATED_PHOTOS[1].url;
  } else if (pLower.includes('parfum') || pLower.includes('produit') || pLower.includes('objet') || pLower.includes('luxe')) {
    photo = CURATED_PHOTOS[2].url;
  } else if (pLower.includes('sculpt') || pLower.includes('céramique') || pLower.includes('art')) {
    photo = CURATED_PHOTOS[5].url;
  } else if (pLower.includes('mode') || pLower.includes('vêtement') || pLower.includes('collection')) {
    photo = CURATED_PHOTOS[0].url;
  } else if (pLower.includes('portrait') || pLower.includes('visage') || pLower.includes('conférence')) {
    photo = CURATED_PHOTOS[3].url;
  }

  // Derive elegant title
  let title = prompt.trim();
  if (title.length > 36) {
    title = title.substring(0, 36) + '...';
  }
  if (!title) title = 'Nouvelle Perspective';

  // Capitalize title
  title = title.charAt(0).toUpperCase() + title.slice(1);

  const elements: CanvasElement[] = [];

  if (format === 'presentation') {
    // 16:9 Presentation slide layout
    elements.push(
      {
        id: `el-gen-img-${Date.now()}`,
        type: 'image',
        name: 'Visuel Éditorial',
        src: photo,
        x: width * 0.52,
        y: 100,
        width: width * 0.42,
        height: height - 200,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
        objectFit: 'cover',
        borderRadius: 8,
        filterPreset: 'contrast',
      },
      {
        id: `el-gen-kicker-${Date.now()}`,
        type: 'text',
        name: 'En-tête Origi',
        text: 'ORIGI ATELIER · ÉDITION SPÉCIALE 2026',
        fontFamily: 'Space Grotesk',
        fontSize: 15,
        fontWeight: 600,
        color: accent,
        textAlign: 'left',
        letterSpacing: 3,
        lineHeight: 1,
        textTransform: 'uppercase',
        x: 100,
        y: 140,
        width: 700,
        height: 30,
        rotation: 0,
        opacity: 1,
        zIndex: 2,
      },
      {
        id: `el-gen-title-${Date.now()}`,
        type: 'text',
        name: 'Titre de Présentation',
        text: title,
        fontFamily: 'Syne',
        fontSize: 68,
        fontWeight: 700,
        color: primaryText,
        textAlign: 'left',
        letterSpacing: -0.5,
        lineHeight: 1.1,
        textTransform: 'none',
        x: 100,
        y: 200,
        width: 800,
        height: 180,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      {
        id: `el-gen-body-${Date.now()}`,
        type: 'text',
        name: 'Corps du Concept',
        text: `Une composition générée avec précision pour matérialiser la vision "${prompt}". L’équilibre entre espaces négatifs et éléments graphiques confère une signature intemporelle.`,
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 20,
        fontWeight: 300,
        color: secondaryText,
        textAlign: 'left',
        letterSpacing: 0.2,
        lineHeight: 1.6,
        textTransform: 'none',
        x: 100,
        y: 420,
        width: 720,
        height: 140,
        rotation: 0,
        opacity: 0.9,
        zIndex: 4,
      },
      {
        id: `el-gen-badge-${Date.now()}`,
        type: 'shape',
        name: 'Pillule Signature',
        shapeType: 'pill',
        x: 100,
        y: 620,
        width: 220,
        height: 48,
        rotation: 0,
        opacity: 1,
        zIndex: 5,
        fill: accent,
        stroke: 'transparent',
        strokeWidth: 0,
        borderRadius: 24,
      },
      {
        id: `el-gen-badge-txt-${Date.now()}`,
        type: 'text',
        name: 'Texte Bouton',
        text: 'VOIR LE PROJET',
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 14,
        fontWeight: 700,
        color: bg,
        textAlign: 'center',
        letterSpacing: 2,
        lineHeight: 1,
        textTransform: 'uppercase',
        x: 110,
        y: 636,
        width: 200,
        height: 20,
        rotation: 0,
        opacity: 1,
        zIndex: 6,
      }
    );
  } else {
    // Portrait / Poster / Square layout
    elements.push(
      // Frame
      {
        id: `el-gen-frame-${Date.now()}`,
        type: 'shape',
        name: 'Cadre Minimal',
        shapeType: 'rectangle',
        x: 36,
        y: 36,
        width: width - 72,
        height: height - 72,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
        fill: 'transparent',
        stroke: frameStroke,
        strokeWidth: 1.5,
        borderRadius: 2,
      },
      // Photo
      {
        id: `el-gen-img-${Date.now()}`,
        type: 'image',
        name: 'Image Centrale',
        src: photo,
        x: 100,
        y: 180,
        width: width - 200,
        height: height * 0.52,
        rotation: 0,
        opacity: 1,
        zIndex: 2,
        objectFit: 'cover',
        borderRadius: 4,
        filterPreset: 'contrast',
      },
      // Top Kicker
      {
        id: `el-gen-kicker-${Date.now()}`,
        type: 'text',
        name: 'En-tête Kicker',
        text: 'ORIGI STUDIO · ATELIER DESIGN 2026',
        fontFamily: 'Space Grotesk',
        fontSize: 13,
        fontWeight: 600,
        color: accent,
        textAlign: 'center',
        letterSpacing: 4,
        lineHeight: 1,
        textTransform: 'uppercase',
        x: 80,
        y: 80,
        width: width - 160,
        height: 24,
        rotation: 0,
        opacity: 1,
        zIndex: 3,
      },
      // Title
      {
        id: `el-gen-title-${Date.now()}`,
        type: 'text',
        name: 'Titre Principal',
        text: title,
        fontFamily: 'Cormorant Garamond',
        fontSize: width > 1100 ? 84 : 64,
        fontWeight: 400,
        fontStyle: 'italic',
        color: primaryText,
        textAlign: 'center',
        letterSpacing: 1,
        lineHeight: 1.1,
        textTransform: 'none',
        x: 80,
        y: height * 0.52 + 220,
        width: width - 160,
        height: 90,
        rotation: 0,
        opacity: 1,
        zIndex: 4,
      },
      // Description
      {
        id: `el-gen-desc-${Date.now()}`,
        type: 'text',
        name: 'Texte Éditorial',
        text: `Une composition sur mesure conçue selon les proportions d’or et la typographie épurée du studio Origi. L’essence de la création contemporaine au service de vos idées.`,
        fontFamily: 'Plus Jakarta Sans',
        fontSize: 16,
        fontWeight: 300,
        color: secondaryText,
        textAlign: 'center',
        letterSpacing: 0.3,
        lineHeight: 1.5,
        textTransform: 'none',
        x: 120,
        y: height * 0.52 + 330,
        width: width - 240,
        height: 70,
        rotation: 0,
        opacity: 0.85,
        zIndex: 5,
      }
    );
  }

  return {
    id: `gen-page-${Date.now()}`,
    name: `IA Origi — ${title}`,
    width,
    height,
    backgroundColor: bg,
    elements,
  };
}
