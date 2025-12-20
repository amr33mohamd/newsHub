import Link from 'next/link';
import { User } from '@/types';

interface PageHeaderProps {
  user: User | null;
  title: string;
  subtitle: string;
}

export function PageHeader({ user, title, subtitle }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-4xl md:text-5xl font-bold mb-2">
        <span className="text-[#E74C3C]">{title}</span>{' '}
        <span className="text-gray-900">{subtitle}</span>
      </h1>
      {user ? (
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-[#E74C3C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <p className="text-gray-600">
            Personalized news feed based on your preferences •{' '}
            <Link href="/preferences" className="text-[#E74C3C] hover:text-[#d44332] font-semibold transition-colors">
              Update Preferences
            </Link>
          </p>
        </div>
      ) : (
        <p className="text-gray-600">
          Latest news from all sources •{' '}
          <Link href="/login" className="text-[#E74C3C] hover:text-[#d44332] font-semibold transition-colors">
            Login for personalized feed
          </Link>
        </p>
      )}
    </div>
  );
}
