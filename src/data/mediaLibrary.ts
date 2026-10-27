/**
 * Curated Media Library for Origi Studio Canvas
 * High-definition, editorial photography and graphic shapes
 */

export interface MediaItem {
  id: string;
  category: 'architecture' | 'fashion' | 'objects' | 'portraits' | 'abstract';
  title: string;
  url: string;
  thumb: string;
  author: string;
}

export const CURATED_PHOTOS: MediaItem[] = [
  {
    id: 'photo-1',
    category: 'fashion',
    title: 'Haute Couture Noir & Blanc',
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=300&q=70',
    author: 'Cécile Vedrunes',
  },
  {
    id: 'photo-2',
    category: 'architecture',
    title: 'Minimalisme Béton Brutaliste',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=70',
    author: 'Simone Hutsch',
  },
  {
    id: 'photo-3',
    category: 'objects',
    title: 'Flacon de Parfum Atelier Luxe',
    url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=300&q=70',
    author: 'Laura Chouette',
  },
  {
    id: 'photo-4',
    category: 'portraits',
    title: 'Portrait Éditorial Ombre & Lumière',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=70',
    author: 'Aiony Haust',
  },
  {
    id: 'photo-5',
    category: 'architecture',
    title: 'Courbes Sculpturales & Lumière Naturelle',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=300&q=70',
    author: 'Jianxiang Liu',
  },
  {
    id: 'photo-6',
    category: 'objects',
    title: 'Céramique Japonaise & Granit',
    url: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=300&q=70',
    author: 'Kseniya Lapteva',
  },
  {
    id: 'photo-7',
    category: 'abstract',
    title: 'Gradient Fluide Obscur & Grain',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=70',
    author: 'Milad Fakurian',
  },
  {
    id: 'photo-8',
    category: 'fashion',
    title: 'Silhouette & Manteau Structuré',
    url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
    thumb: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=300&q=70',
    author: 'Burgess Milner',
  },
];

export interface GraphicShapePreset {
  id: string;
  name: string;
  shapeType: 'rectangle' | 'circle' | 'arch' | 'pill' | 'triangle' | 'star' | 'diamond' | 'stamp';
  width: number;
  height: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  borderRadius?: number;
  label: string;
}

export const GRAPHIC_SHAPES: GraphicShapePreset[] = [
  {
    id: 'shape-arch',
    name: 'Arche Studio',
    shapeType: 'arch',
    width: 280,
    height: 420,
    fill: '#F4EFE6',
    stroke: 'transparent',
    strokeWidth: 0,
    borderRadius: 140,
    label: 'Arche Éditoriale',
  },
  {
    id: 'shape-pill',
    name: 'Pilule Douce',
    shapeType: 'pill',
    width: 240,
    height: 70,
    fill: '#181A20',
    stroke: 'rgba(255, 255, 255, 0.15)',
    strokeWidth: 1,
    borderRadius: 35,
    label: 'Badge Pilule',
  },
  {
    id: 'shape-circle',
    name: 'Disque Solaire',
    shapeType: 'circle',
    width: 200,
    height: 200,
    fill: '#C2A378',
    stroke: 'transparent',
    strokeWidth: 0,
    borderRadius: 100,
    label: 'Cercle / Disque',
  },
  {
    id: 'shape-rect-bordered',
    name: 'Cadre Minimaliste',
    shapeType: 'rectangle',
    width: 320,
    height: 440,
    fill: 'transparent',
    stroke: '#F5F2EB',
    strokeWidth: 1.5,
    borderRadius: 4,
    label: 'Cadre Fin',
  },
  {
    id: 'shape-card',
    name: 'Cartouche Obsidian',
    shapeType: 'rectangle',
    width: 360,
    height: 240,
    fill: '#16181E',
    stroke: 'rgba(255, 255, 255, 0.08)',
    strokeWidth: 1,
    borderRadius: 8,
    label: 'Cartouche Sombre',
  },
  {
    id: 'shape-star',
    name: 'Étoile Atelier 4 Branches',
    shapeType: 'star',
    width: 120,
    height: 120,
    fill: '#F5F2EB',
    stroke: 'transparent',
    strokeWidth: 0,
    label: 'Étoile Éditoriale',
  },
  {
    id: 'shape-diamond',
    name: 'Losange Studio',
    shapeType: 'diamond',
    width: 140,
    height: 140,
    fill: '#C2A378',
    stroke: 'transparent',
    strokeWidth: 0,
    label: 'Losange Géométrique',
  },
];
