import React from 'react';

const SkeletonCard = () => (
  <div className="card overflow-hidden">
    <div className="skeleton aspect-square" />
    <div className="p-3 space-y-2">
      <div className="skeleton h-4 rounded w-full" />
      <div className="skeleton h-4 rounded w-3/4" />
      <div className="flex justify-between mt-2">
        <div className="skeleton h-5 w-16 rounded-full" />
        <div className="skeleton h-4 w-20 rounded" />
      </div>
    </div>
  </div>
);

export default SkeletonCard;
