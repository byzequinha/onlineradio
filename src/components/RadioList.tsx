import React from 'react';
import { RadioStation } from '../types/radio';
import RadioCard from './RadioCard';
import { Loader2, Radio as RadioIcon } from 'lucide-react';

interface RadioListProps {
  radios: RadioStation[];
  currentRadio: RadioStation | null;
  isPlaying: boolean;
  isLoading: boolean;
  onPlay: (radio: RadioStation) => void;
  onPause: () => void;
  onFavoriteToggle: () => void;
}

const RadioList: React.FC<RadioListProps> = ({
  radios,
  currentRadio,
  isPlaying,
  isLoading,
  onPlay,
  onPause,
  onFavoriteToggle
}) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
        <p className="text-gray-600">Carregando estações de rádio...</p>
      </div>
    );
  }

  if (radios.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-500">
        <RadioIcon className="w-16 h-16 mb-4 text-gray-300" />
        <h3 className="text-xl font-semibold mb-2">Nenhuma estação encontrada</h3>
        <p className="text-center">
          Tente usar termos diferentes na busca ou explore os gêneros populares.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          Estações Encontradas
        </h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {radios.length} {radios.length === 1 ? 'estação' : 'estações'}
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {radios.map((radio) => (
          <RadioCard
            key={radio.stationuuid}
            radio={radio}
            isPlaying={isPlaying && currentRadio?.stationuuid === radio.stationuuid}
            onPlay={onPlay}
            onPause={onPause}
            onFavoriteToggle={onFavoriteToggle}
          />
        ))}
      </div>
    </div>
  );
};

export default RadioList;