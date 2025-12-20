'use client';

import { useState, useEffect } from 'react';
import { useSources, useCategories } from '@/hooks';
import type { ArticleFilters } from '@/types';

interface FilterBarProps {
  onFilterChange: (filters: ArticleFilters) => void;
  currentFilters?: ArticleFilters;
}

export function FilterBar({ onFilterChange, currentFilters }: FilterBarProps) {
  const [sourceId, setSourceId] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const { data: sources } = useSources();
  const { data: categories } = useCategories();

  useEffect(() => {
    if (currentFilters) {
      setSourceId(currentFilters.source_id?.toString() || '');
      setCategoryId(currentFilters.category_id?.toString() || '');
      setFromDate(currentFilters.from_date || '');
      setToDate(currentFilters.to_date || '');
    }
  }, [currentFilters]);

  useEffect(() => {
    onFilterChange({
      source_id: sourceId ? Number(sourceId) : undefined,
      category_id: categoryId ? Number(categoryId) : undefined,
      from_date: fromDate || undefined,
      to_date: toDate || undefined,
    });
  }, [sourceId, categoryId, fromDate, toDate, onFilterChange]);

  const clearFilters = () => {
    setSourceId('');
    setCategoryId('');
    setFromDate('');
    setToDate('');
  };

  const activeFilterCount = [sourceId, categoryId, fromDate, toDate].filter(Boolean).length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors md:cursor-default md:pointer-events-none"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#E74C3C]/10">
            <svg className="w-5 h-5 text-[#E74C3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Filters</h3>
            {activeFilterCount > 0 && (
              <p className="text-xs text-gray-600 mt-0.5">{activeFilterCount} active</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {activeFilterCount > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFilters();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#E74C3C] hover:text-white hover:bg-[#E74C3C] font-semibold uppercase transition-all rounded-md border border-[#E74C3C]"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform md:hidden ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      <div className={`${isExpanded ? 'block' : 'hidden'} md:block border-t border-gray-100`}>
        <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              Source
            </label>
            <select
              value={sourceId}
              onChange={(e) => setSourceId(e.target.value)}
              className="w-full px-4 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E74C3C] focus:border-transparent focus:bg-white hover:border-gray-400 transition-all"
            >
              <option value="">All Sources</option>
              {sources?.map((source) => (
                <option key={source.id} value={source.id}>
                  {source.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Category
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E74C3C] focus:border-transparent focus:bg-white hover:border-gray-400 transition-all"
            >
              <option value="">All Categories</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              From Date
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-4 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E74C3C] focus:border-transparent focus:bg-white hover:border-gray-400 transition-all"
            />
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              To Date
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-4 py-2.5 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E74C3C] focus:border-transparent focus:bg-white hover:border-gray-400 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
