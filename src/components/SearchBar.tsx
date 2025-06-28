import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onGenreFilter: (genre: string) => void;
  isLoading: boolean;
}

const POPULAR_GENRES = [
  'rock', 'pop', 'sertanejo', 'forró', 'funk', 'gospel', 
  'jazz', 'classical', 'country', 'electronic', 'reggae'
];

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onGenreFilter, isLoading }) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleGenreSelect = (genre: string) => {
    setSelectedGenre(genre);
    onGenreFilter(genre);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSelectedGenre('');
    setQuery('');
    onSearch('');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar estações de rádio..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            disabled={isLoading}
          />
        </div>
        
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-3 rounded-lg flex items-center gap-2 transition-all ${
              showFilters || selectedGenre
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtros
          </button>
          
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? 'Buscando...' : 'Buscar'}
          </button>
          
          {(query || selectedGenre) && (
            <button
              type="button"
              onClick={clearFilters}
              className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {showFilters && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Gêneros Populares:</h3>
          <div className="flex flex-wrap gap-2">
            {POPULAR_GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => handleGenreSelect(genre)}
                className={`px-3 py-1 rounded-full text-sm transition-all ${
                  selectedGenre === genre
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
                }`}
              >
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedGenre && (
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
          <Filter className="w-4 h-4" />
          Filtrando por: <span className="font-medium">{selectedGenre}</span>
        </div>
      )}
    </div>
  );
};

export default SearchBar;