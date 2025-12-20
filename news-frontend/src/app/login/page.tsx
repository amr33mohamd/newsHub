'use client';

import { FlashBanner } from '@/components/layout/FlashBanner';
import { Navbar } from '@/components/layout/Navbar';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <>
      <FlashBanner />
      <Navbar />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="text-[#E74C3C]">Welcome</span>{' '}
              <span className="text-gray-900">Back</span>
            </h1>
            <p className="text-gray-600">Sign in to access your personalized news feed</p>
          </div>
          <LoginForm />
        </div>
      </main>
    </>
  );
}
