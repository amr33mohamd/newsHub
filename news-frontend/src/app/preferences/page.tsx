'use client';

import { useEffect, useState } from 'react';
import { FlashBanner } from '@/components/layout/FlashBanner';
import { Navbar } from '@/components/layout/Navbar';
import { Toast } from '@/components/shared/Toast';
import { SubmitButton } from '@/components/shared/SubmitButton';
import { PreferenceCheckboxSection } from '@/components/preferences/PreferenceCheckboxSection';
import { PreferenceAuthorSection } from '@/components/preferences/PreferenceAuthorSection';
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

  const handleAddAuthor = (author: string) => {
    setSelectedAuthors([...selectedAuthors, author]);
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

          {toast && (
            <Toast
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <PreferenceCheckboxSection
              icon={
                <svg className="w-6 h-6 text-[#E74C3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              }
              title="Preferred Sources"
              description="Select the news sources you want to see in your personalized feed"
              items={sources}
              selectedIds={selectedSources}
              onToggle={handleSourceToggle}
              isLoading={prefsLoading}
              gridCols="single"
            />

            <PreferenceCheckboxSection
              icon={
                <svg className="w-6 h-6 text-[#E74C3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              }
              title="Preferred Categories"
              description="Select the categories you're interested in"
              items={categories}
              selectedIds={selectedCategories}
              onToggle={handleCategoryToggle}
              isLoading={prefsLoading}
              gridCols="double"
            />

            <PreferenceAuthorSection
              icon={
                <svg className="w-6 h-6 text-[#E74C3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              title="Preferred Authors"
              description="Add authors you want to follow"
              selectedAuthors={selectedAuthors}
              onAdd={handleAddAuthor}
              onRemove={handleRemoveAuthor}
            />

            <div className="flex justify-end gap-4">
              <SubmitButton isLoading={updatePreferences.isPending}>
                Save Preferences
              </SubmitButton>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
