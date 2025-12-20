'use client';

import { useEffect, useState } from 'react';
import { FlashBanner } from '@/components/layout/FlashBanner';
import { Navbar } from '@/components/layout/Navbar';
import { Toast } from '@/components/shared/Toast';
import { usePreferences, useUpdatePreferences } from '@/hooks/usePreferences';
import { useSources } from '@/hooks/useSources';
import { useCategories } from '@/hooks/useCategories';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function PreferencesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { data: preferences, isLoading: prefsLoading } = usePreferences();
  const { data: sources } = useSources();
  const { data: categories } = useCategories();
  const updatePreferences = useUpdatePreferences();

  const [selectedSources, setSelectedSources] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [authorInput, setAuthorInput] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Note: Primary auth protection is in middleware (see middleware.ts)
  // This client-side check is for UX only - prevents flash of content
  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  useEffect(() => {
    if (preferences) {
      setSelectedSources(preferences.preferred_sources || []);
      setSelectedCategories(preferences.preferred_categories || []);
      setSelectedAuthors(preferences.preferred_authors || []);
    }
  }, [preferences]);

  const handleSourceToggle = (sourceId: number) => {
    setSelectedSources((prev) =>
      prev.includes(sourceId)
        ? prev.filter((id) => id !== sourceId)
        : [...prev, sourceId]
    );
  };

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleAddAuthor = () => {
    if (authorInput.trim() && !selectedAuthors.includes(authorInput.trim())) {
      setSelectedAuthors([...selectedAuthors, authorInput.trim()]);
      setAuthorInput('');
    }
  };

  const handleRemoveAuthor = (author: string) => {
    setSelectedAuthors(selectedAuthors.filter((a) => a !== author));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    updatePreferences.mutate(
      {
        preferred_sources: selectedSources,
        preferred_categories: selectedCategories,
        preferred_authors: selectedAuthors,
      },
      {
        onSuccess: () => {
          setToast({ message: 'Preferences updated successfully!', type: 'success' });
        },
        onError: () => {
          setToast({ message: 'Failed to update preferences. Please try again.', type: 'error' });
        },
      }
    );
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <FlashBanner />
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="text-[#E74C3C]">Your</span>{' '}
              <span className="text-gray-900">Preferences</span>
            </h1>
            <p className="text-gray-600">
              Customize your news feed by selecting your preferred sources, categories, and authors
            </p>
          </div>

          {/* Toast notifications */}
          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-6 h-6 text-[#E74C3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
                  Preferred Sources
                </h2>
              </div>
              <p className="text-sm text-gray-600 mb-5">
                Select the news sources you want to see in your personalized feed
              </p>

              {prefsLoading || !sources ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-12 bg-gray-200 rounded-lg"></div>
                  <div className="h-12 bg-gray-200 rounded-lg"></div>
                  <div className="h-12 bg-gray-200 rounded-lg"></div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {sources.map((source) => (
                    <label
                      key={source.id}
                      className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-white hover:border-[#E74C3C] cursor-pointer transition-all group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedSources.includes(source.id)}
                        onChange={() => handleSourceToggle(source.id)}
                        className="w-5 h-5 text-[#E74C3C] border-gray-300 rounded focus:ring-2 focus:ring-[#E74C3C] cursor-pointer"
                      />
                      <span className="ml-3 text-gray-900 font-medium group-hover:text-[#E74C3C] transition-colors">{source.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-6 h-6 text-[#E74C3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
                  Preferred Categories
                </h2>
              </div>
              <p className="text-sm text-gray-600 mb-5">
                Select the categories you&apos;re interested in
              </p>

              {prefsLoading || !categories ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-12 bg-gray-200 rounded-lg"></div>
                  <div className="h-12 bg-gray-200 rounded-lg"></div>
                  <div className="h-12 bg-gray-200 rounded-lg"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-white hover:border-[#E74C3C] cursor-pointer transition-all group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleCategoryToggle(category.id)}
                        className="w-5 h-5 text-[#E74C3C] border-gray-300 rounded focus:ring-2 focus:ring-[#E74C3C] cursor-pointer"
                      />
                      <span className="ml-3 text-gray-900 font-medium group-hover:text-[#E74C3C] transition-colors">{category.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-6 h-6 text-[#E74C3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
                  Preferred Authors
                </h2>
              </div>
              <p className="text-sm text-gray-600 mb-5">
                Add authors you want to follow
              </p>

              <div className="flex gap-3 mb-5">
                <input
                  type="text"
                  value={authorInput}
                  onChange={(e) => setAuthorInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAuthor())}
                  placeholder="Enter author name"
                  className="flex-1 px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E74C3C] focus:border-transparent focus:bg-white hover:border-gray-400 transition-all placeholder:text-gray-500"
                />
                <button
                  type="button"
                  onClick={handleAddAuthor}
                  className="px-6 py-3 bg-[#E74C3C] text-white text-sm font-medium uppercase rounded-lg hover:bg-[#d44332] transition-colors whitespace-nowrap"
                >
                  Add
                </button>
              </div>

              {selectedAuthors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedAuthors.map((author) => (
                    <div
                      key={author}
                      className="flex items-center gap-2 px-4 py-2 bg-[#E74C3C]/10 text-[#E74C3C] rounded-full border border-[#E74C3C]/20"
                    >
                      <span className="text-sm font-medium">{author}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAuthor(author)}
                        className="text-[#E74C3C] hover:text-[#d44332] font-bold text-lg leading-none"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="submit"
                disabled={updatePreferences.isPending}
                className="px-8 py-3 bg-[#E74C3C] text-white font-semibold text-sm uppercase rounded-lg hover:bg-[#d44332] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {updatePreferences.isPending ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Preferences
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
