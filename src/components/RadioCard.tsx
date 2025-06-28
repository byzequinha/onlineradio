import React from 'react';
import { Play, Pause, Heart, HeartIcon, Signal, Users } from 'lucide-react';
import { RadioStation } from '../types/radio';
import { isFavorite, addToFavorites, removeFromFavorites } from '../utils/storage';

interface RadioCardProps {
  radio: RadioStation;
  isPlaying: boolean;
  onPlay: (radio: RadioStation) => void;
  onPause: () => void;
  onFavoriteToggle: () => void;
}

const RadioCard: React.FC<RadioCardProps> = ({
  radio,
  isPlaying,
  onPlay,
  onPause,
  onFavoriteToggle
}) => {
  const favorite = isFavorite(radio.stationuuid);

  const handleFavoriteClick = () => {
    if (favorite) {
      removeFromFavorites(radio.stationuuid);
    } else {
      addToFavorites({
        stationuuid: radio.stationuuid,
        name: radio.name,
        url_resolved: radio.url_resolved,
        tags: radio.tags,
        bitrate: radio.bitrate,
        codec: radio.codec,
        addedAt: new Date().toISOString()
      });
    }
    onFavoriteToggle();
  };

  const formatTags = (tags: string) => {
    if (!tags) return 'Geral';
    return tags.split(',')
      .slice(0, 3)
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .join(', ') || 'Geral';
  };

  const getSignalStrength = (bitrate: number) => {
    if (bitrate >= 128) return 'text-green-500';
    if (bitrate >= 64) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${
      isPlaying ? 'ring-2 ring-blue-500 bg-gradient-to-br from-blue-50 to-purple-50' : ''
    }`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
              {radio.name}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {formatTags(radio.tags)}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Signal className={`w-3 h-3 ${getSignalStrength(radio.bitrate)}`} />
                <span>{radio.bitrate}kbps</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{radio.votes} votos</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-full transition-all ${
              favorite 
                ? 'text-red-500 hover:bg-red-50' 
                : 'text-gray-400 hover:text-red-500 hover:bg-gray-50'
            }`}
          >
            {favorite ? <HeartIcon className="w-5 h-5 fill-current" /> : <Heart className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() => isPlaying ? onPause() : onPlay(radio)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              isPlaying
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pausar' : 'Tocar'}
          </button>

          {radio.codec && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {radio.codec.toUpperCase()}
            </span>
          )}
        </div>
      </div>
      
      {isPlaying && (
        <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
      )}
    </div>
  );
};

export default RadioCard;