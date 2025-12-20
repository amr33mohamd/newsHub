'use client';

import { useState, useEffect } from 'react';
import { useArticles } from '@/hooks/useArticles';

export function FlashBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { data } = useArticles(1, {});

  const flashNews = data?.data?.slice(0, 5).map(article => article.title) || [];

  useEffect(() => {
    if (flashNews.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % flashNews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [flashNews.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + flashNews.length) % flashNews.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % flashNews.length);
  };

  if (flashNews.length === 0) return null;

  return (
    <div className="bg-[#E74C3C] text-white py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
            </svg>
            <span className="font-bold text-sm">FLASH</span>
          </div>
          <p className="text-sm flex-1 overflow-hidden line-clamp-1">
            {flashNews[currentIndex]}
          </p>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <button
            onClick={handlePrev}
            className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded transition-colors"
            aria-label="Previous news"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={handleNext}
            className="w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded transition-colors"
            aria-label="Next news"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
