/**
 * Media Tab
 * Curated high-res editorial photography, local file upload, and image URL import
 */

import React, { useState, useRef } from 'react';
import { Upload, Link as LinkIcon, Sparkles } from 'lucide-react';
import { CURATED_PHOTOS, MediaItem } from '../../data/mediaLibrary';
import { CanvasElement, ImageElement } from '../../types/canvas';

interface MediaTabProps {
  onAddElement: (element: CanvasElement) => void;
  canvasWidth: number;
  canvasHeight: number;
}

export const MediaTab: React.FC<MediaTabProps> = ({
  onAddElement,
  canvasWidth,
  canvasHeight,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [customUrl, setCustomUrl] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    { id: 'all', label: 'Toutes' },
    { id: 'fashion', label: 'Mode' },
    { id: 'architecture', label: 'Architecture' },
    { id: 'objects', label: 'Objets' },
    { id: 'portraits', label: 'Portraits' },
  ];

  const filteredPhotos =
    selectedCategory === 'all'
      ? CURATED_PHOTOS
      : CURATED_PHOTOS.filter((p) => p.category === selectedCategory);

  const addImageToCanvas = (src: string, title = 'Image Studio') => {
    const width = Math.min(600, Math.round(canvasWidth * 0.7));
    const height = Math.min(600, Math.round(canvasHeight * 0.5));

    const newEl: ImageElement = {
      id: `img-${Date.now()}`,
      type: 'image',
      name: title,
      src,
      alt: title,
      x: Math.round((canvasWidth - width) / 2),
      y: Math.round((canvasHeight - height) / 2),
      width,
      height,
      rotation: 0,
      opacity: 1,
      zIndex: Date.now(),
      objectFit: 'cover',
      borderRadius: 4,
      filterPreset: 'none',
    };
    onAddElement(newEl);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          addImageToCanvas(event.target.result as string, file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      addImageToCanvas(customUrl.trim(), 'Image Web');
      setCustomUrl('');
      setShowUrlInput(false);
    }
  };

  return (
    <div className="flex flex-col h-full text-zinc-300">
      <div className="p-3 border-b border-white/[0.08]">
        <h3 className="text-sm font-semibold text-white tracking-wide">Photothèque & Médias</h3>
        <p className="text-[11px] text-zinc-400 mt-0.5">
          Sélection éditoriale haute résolution et import de fichiers.
        </p>

        {/* Upload buttons */}
        <div className="flex gap-2 mt-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded bg-[#C2A378] text-black font-semibold text-xs hover:bg-[#d6b78d] transition-colors"
          >
            <Upload size={13} />
            <span>Importer</span>
          </button>

          <button
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="flex items-center justify-center px-2 py-1.5 rounded bg-white/[0.05] border border-white/10 hover:bg-white/10 text-zinc-300 text-xs transition-colors"
            title="Ajouter via URL"
          >
            <LinkIcon size={13} />
          </button>
        </div>

        {/* URL Input collapse */}
        {showUrlInput && (
          <form onSubmit={handleAddCustomUrl} className="mt-2 flex gap-1">
            <input
              type="url"
              placeholder="https://..."
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="flex-1 bg-[#1C1E26] border border-white/10 rounded px-2 py-1 text-xs text-white placeholder-zinc-500 outline-none"
            />
            <button
              type="submit"
              className="px-2.5 py-1 bg-white/[0.08] text-xs text-white rounded hover:bg-white/[0.15]"
            >
              OK
            </button>
          </form>
        )}

        {/* Category filters */}
        <div className="flex flex-wrap gap-1 mt-3">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-2 py-0.5 text-[10px] rounded transition-colors ${
                selectedCategory === c.id
                  ? 'bg-white text-black font-semibold'
                  : 'bg-white/[0.04] text-zinc-400 hover:text-white'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Photos Masonry / Grid */}
      <div className="flex-1 overflow-y-auto p-3 grid grid-cols-2 gap-2">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            onClick={() => addImageToCanvas(photo.url, photo.title)}
            className="group relative cursor-pointer rounded overflow-hidden aspect-[4/5] bg-black/40 border border-white/[0.06] hover:border-[#C2A378]/60 transition-all"
          >
            <img
              src={photo.thumb}
              alt={photo.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
              <span className="text-[10px] font-medium text-white line-clamp-1">{photo.title}</span>
              <span className="text-[9px] text-zinc-400 font-mono">Photo {photo.author}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
