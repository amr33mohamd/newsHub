import { ReactNode } from 'react';
import { PreferenceLoadingSkeleton } from './PreferenceLoadingSkeleton';

interface PreferenceItem {
  id: number;
  name: string;
}

interface PreferenceCheckboxSectionProps {
  icon: ReactNode;
  title: string;
  description: string;
  items?: PreferenceItem[];
  selectedIds: number[];
  onToggle: (id: number) => void;
  isLoading: boolean;
  gridCols?: 'single' | 'double';
}

export function PreferenceCheckboxSection({
  icon,
  title,
  description,
  items,
  selectedIds,
  onToggle,
  isLoading,
  gridCols = 'single',
}: PreferenceCheckboxSectionProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
          {title}
        </h2>
      </div>
      <p className="text-sm text-gray-600 mb-5">{description}</p>

      {isLoading || !items ? (
        <PreferenceLoadingSkeleton count={3} />
      ) : (
        <div className={gridCols === 'double' ? 'grid grid-cols-1 md:grid-cols-2 gap-2.5' : 'space-y-2.5'}>
          {items.map((item) => (
            <label
              key={item.id}
              className="flex items-center p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-white hover:border-[#E74C3C] cursor-pointer transition-all group"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(item.id)}
                onChange={() => onToggle(item.id)}
                className="w-5 h-5 text-[#E74C3C] border-gray-300 rounded focus:ring-2 focus:ring-[#E74C3C] cursor-pointer"
              />
              <span className="ml-3 text-gray-900 font-medium group-hover:text-[#E74C3C] transition-colors">
                {item.name}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
