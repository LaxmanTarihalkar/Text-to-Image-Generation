import React, { useState, useEffect } from 'react';
import { HiHeart, HiPhotograph } from 'react-icons/hi';
import api from '../../services/api';
import ImageCard from '../../components/ImageCard';
import SkeletonCard from '../../components/SkeletonCard';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/favorites?page=${page}&limit=12`);
      setFavorites(data.favorites);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFavorites(); }, [page]);

  const handleFavoriteToggle = () => fetchFavorites();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-poppins font-bold text-2xl text-slate-900 dark:text-white flex items-center gap-2">
          <HiHeart className="text-red-400" /> Favorites
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Your saved images</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : favorites.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {favorites.map((fav) => (
              fav.imageId && (
                <ImageCard
                  key={fav._id}
                  image={fav.imageId}
                  isFavorited={true}
                  onFavoriteToggle={handleFavoriteToggle}
                  showDelete={false}
                />
              )
            ))}
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="btn-outline text-sm py-2 px-4 disabled:opacity-40">Previous</button>
              <span className="text-slate-400 text-sm">Page {page} of {pagination.pages}</span>
              <button onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="btn-outline text-sm py-2 px-4 disabled:opacity-40">Next</button>
            </div>
          )}
        </>
      ) : (
        <div className="card p-16 text-center">
          <HiHeart className="text-slate-600 text-6xl mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400 text-lg mb-2">No favorites yet</p>
          <p className="text-slate-400 dark:text-slate-500 text-sm">Heart images from your history to save them here</p>
        </div>
      )}
    </div>
  );
}
