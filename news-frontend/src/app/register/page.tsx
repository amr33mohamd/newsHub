'use client';

import { FlashBanner } from '@/components/layout/FlashBanner';
import { Navbar } from '@/components/layout/Navbar';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <>
      <FlashBanner />
      <Navbar />
      <main className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              <span className="text-[#E74C3C]">Join</span>{' '}
              <span className="text-gray-900">NewsHub</span>
            </h1>
            <p className="text-gray-600">Create your account to get personalized news</p>
          </div>
          <RegisterForm />
        </div>
      </main>
    </>
  );
}
