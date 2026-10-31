import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { HiSearch, HiPhotograph, HiFilter } from 'react-icons/hi';
import api from '../../services/api';
import ImageCard from '../../components/ImageCard';
import SkeletonCard from '../../components/SkeletonCard';

const STYLES = ['', 'realistic', 'anime', '3d', 'cartoon', 'cyberpunk', 'fantasy', 'abstract'];

export default function History() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [style, setStyle] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (search) params.append('search', search);
      if (style) params.append('style', style);
      const { data } = await api.get(`/images/history?${params}`);
      setImages(data.images);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, style]);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleDelete = (id) => {
    setImages((prev) => prev.filter((img) => img._id !== id));
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-poppins font-bold text-2xl text-slate-900 dark:text-white">Image History</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">All your generated images</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by prompt..."
            className="input-field pl-10 pr-4"
          />
        </form>
        <div className="flex items-center gap-2">
          <HiFilter className="text-slate-500" />
          <select
            value={style}
            onChange={(e) => { setStyle(e.target.value); setPage(1); }}
            className="input-field w-auto"
          >
            {STYLES.map((s) => (
              <option key={s} value={s}>{s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All Styles'}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(12).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : images.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img) => (
              <ImageCard key={img._id} image={img} onDelete={handleDelete} />
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-outline text-sm py-2 px-4 disabled:opacity-40"
              >
                Previous
              </button>
              <span className="text-slate-400 text-sm">
                Page {page} of {pagination.pages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="btn-outline text-sm py-2 px-4 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="card p-16 text-center">
          <HiPhotograph className="text-slate-600 text-6xl mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-2">No images found</p>
          <p className="text-slate-400 dark:text-slate-500 text-sm">
            {search || style ? 'Try different search terms' : 'Start generating to see your history'}
          </p>
        </div>
      )}
    </div>
  );
}
