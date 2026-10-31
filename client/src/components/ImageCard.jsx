import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiHeart, HiDownload, HiTrash, HiClipboard, HiShare } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../services/api';

const ImageCard = ({ image, onDelete, onFavoriteToggle, isFavorited = false, showDelete = true }) => {
  const [favorited, setFavorited] = useState(isFavorited);
  const [loading, setLoading] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const handleFavorite = async (e) => {
    e.stopPropagation();
    setLoading(true);
    try {
      if (favorited) {
        await api.delete(`/favorites/${image._id}`);
        setFavorited(false);
        toast.success('Removed from favorites');
      } else {
        await api.post(`/favorites/${image._id}`);
        setFavorited(true);
        toast.success('Added to favorites');
      }
      onFavoriteToggle?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update favorites');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPrompt = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(image.prompt);
    toast.success('Prompt copied!');
  };

  const handleDownload = async (e) => {
    e.stopPropagation();
    try {
      const response = await fetch(image.imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pixora-${image._id}.png`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Image downloaded!');
    } catch {
      // Fallback: open in new tab
      window.open(image.imageUrl, '_blank');
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(image.imageUrl);
    toast.success('Image URL copied to clipboard!');
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this image?')) return;
    try {
      await api.delete(`/images/${image._id}`);
      toast.success('Image deleted');
      onDelete?.(image._id);
    } catch {
      toast.error('Failed to delete image');
    }
  };

  const styleColors = {
    realistic: 'bg-blue-500/20 text-blue-400',
    anime: 'bg-pink-500/20 text-pink-400',
    '3d': 'bg-orange-500/20 text-orange-400',
    cartoon: 'bg-yellow-500/20 text-yellow-400',
    cyberpunk: 'bg-cyan-500/20 text-cyan-400',
    fantasy: 'bg-purple-500/20 text-purple-400',
    abstract: 'bg-green-500/20 text-green-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="card-hover overflow-hidden group cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-800">
        {!imgLoaded && <div className="skeleton absolute inset-0" />}
        <img
          src={image.imageUrl}
          alt={image.prompt}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImgLoaded(true)}
          loading="lazy"
        />

        {/* Overlay actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={handleFavorite}
                disabled={loading}
                className={`p-2 rounded-lg backdrop-blur-sm transition-all ${
                  favorited ? 'bg-red-500/80 text-white' : 'bg-black/50 text-white hover:bg-red-500/60'
                }`}
              >
                <HiHeart size={16} />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 rounded-lg bg-black/50 text-white hover:bg-violet-500/60 backdrop-blur-sm transition-all"
              >
                <HiDownload size={16} />
              </button>
              <button
                onClick={handleCopyPrompt}
                className="p-2 rounded-lg bg-black/50 text-white hover:bg-cyan-500/60 backdrop-blur-sm transition-all"
              >
                <HiClipboard size={16} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-lg bg-black/50 text-white hover:bg-green-500/60 backdrop-blur-sm transition-all"
              >
                <HiShare size={16} />
              </button>
            </div>
            {showDelete && (
              <button
                onClick={handleDelete}
                className="p-2 rounded-lg bg-black/50 text-white hover:bg-red-600/80 backdrop-blur-sm transition-all"
              >
                <HiTrash size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2 leading-relaxed">{image.prompt}</p>
        <div className="flex items-center justify-between mt-2">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styleColors[image.style] || 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
            {image.style}
          </span>
          <span className="text-slate-400 dark:text-slate-500 text-xs">
            {new Date(image.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ImageCard;
