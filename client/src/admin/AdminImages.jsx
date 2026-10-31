import React, { useState, useEffect } from 'react';
import { HiSearch, HiPhotograph, HiTrash } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function AdminImages() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 20 });
      if (search) params.append('search', search);
      const { data } = await api.get(`/admin/images?${params}`);
      setImages(data.images);
      setPagination(data.pagination);
    } catch {
      toast.error('Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, [page, search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this image?')) return;
    try {
      await api.delete(`/admin/images/${id}`);
      setImages((prev) => prev.filter((img) => img._id !== id));
      toast.success('Image deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-poppins font-bold text-2xl text-slate-900 dark:text-white">Image Management</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{pagination?.total || 0} total images</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); setSearch(searchInput); setPage(1); }} className="relative max-w-md">
        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search by prompt..."
          className="input-field pl-10"
        />
      </form>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
        </div>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.map((img) => (
            <div key={img._id} className="card overflow-hidden group">
              <div className="relative aspect-square bg-slate-200 dark:bg-slate-800">
                <img src={img.imageUrl} alt={img.prompt} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => handleDelete(img._id)}
                    className="p-2 bg-red-500/80 rounded-lg text-white hover:bg-red-500 transition-colors"
                  >
                    <HiTrash size={18} />
                  </button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-slate-600 dark:text-slate-300 text-xs line-clamp-2">{img.prompt}</p>
                <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">{img.userId?.name}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center">
          <HiPhotograph className="text-slate-600 text-5xl mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">No images found</p>
        </div>
      )}

      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-outline text-sm py-2 px-4 disabled:opacity-40">Previous</button>
          <span className="text-slate-400 text-sm">Page {page} of {pagination.pages}</span>
          <button onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="btn-outline text-sm py-2 px-4 disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  );
}
