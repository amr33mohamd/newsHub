import { useState, ReactNode } from 'react';

interface PreferenceAuthorSectionProps {
  icon: ReactNode;
  title: string;
  description: string;
  selectedAuthors: string[];
  onAdd: (author: string) => void;
  onRemove: (author: string) => void;
}

export function PreferenceAuthorSection({
  icon,
  title,
  description,
  selectedAuthors,
  onAdd,
  onRemove,
}: PreferenceAuthorSectionProps) {
  const [authorInput, setAuthorInput] = useState('');

  const handleAdd = () => {
    if (authorInput.trim() && !selectedAuthors.includes(authorInput.trim())) {
      onAdd(authorInput.trim());
      setAuthorInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h2 className="text-xl font-bold text-gray-900 uppercase tracking-wide">
          {title}
        </h2>
      </div>
      <p className="text-sm text-gray-600 mb-5">{description}</p>

      <div className="flex gap-3 mb-5">
        <input
          type="text"
          value={authorInput}
          onChange={(e) => setAuthorInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter author name"
          className="flex-1 px-4 py-3 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E74C3C] focus:border-transparent focus:bg-white hover:border-gray-400 transition-all placeholder:text-gray-500"
        />
        <button
          type="button"
          onClick={handleAdd}
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
                onClick={() => onRemove(author)}
                className="text-[#E74C3C] hover:text-[#d44332] font-bold text-lg leading-none"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
