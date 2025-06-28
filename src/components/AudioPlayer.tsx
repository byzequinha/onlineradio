import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react';
import { RadioStation } from '../types/radio';
import { addToHistory } from '../utils/storage';

interface AudioPlayerProps {
  currentRadio: RadioStation | null;
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({
  currentRadio,
  isPlaying,
  onPlay,
  onPause,
  onNext,
  onPrevious
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBuffering, setIsBuffering] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentRadio) return;

    const handleLoadStart = () => {
      setIsBuffering(true);
      setError(null);
    };

    const handleCanPlay = () => {
      setIsBuffering(false);
    };

    const handleError = () => {
      setError('Esta estação não está disponível no momento');
      setIsBuffering(false);
    };

    const handlePlay = () => {
      addToHistory(currentRadio.stationuuid, currentRadio.name);
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('play', handlePlay);

    audio.src = currentRadio.url_resolved;
    audio.volume = isMuted ? 0 : volume;

    if (isPlaying) {
      audio.load();
    }

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('play', handlePlay);
    };
  }, [currentRadio, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying && !isBuffering && !error) {
      audio.play().catch(err => {
        console.error('Error playing audio:', err);
        setError('Erro ao reproduzir esta estação');
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, isBuffering, error]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (!currentRadio) return null;

  return (
    <>
      <audio ref={audioRef} preload="none" />
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-2xl z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Station Info */}
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {currentRadio.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 truncate">
                  {currentRadio.name}
                </h3>
                <p className="text-sm text-gray-600 truncate">
                  {currentRadio.tags || 'Rádio Online'}
                </p>
                {error && (
                  <p className="text-xs text-red-500 truncate">{error}</p>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              {onPrevious && (
                <button
                  onClick={onPrevious}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
              )}
              
              <button
                onClick={isPlaying ? onPause : onPlay}
                disabled={isBuffering || !!error}
                className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full flex items-center justify-center hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isBuffering ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </button>

              {onNext && (
                <button
                  onClick={onNext}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Volume Control */}
            <div className="hidden md:flex items-center space-x-3 flex-1 justify-end">
              <button
                onClick={toggleMute}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-24 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AudioPlayer;