import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import RadioList from './components/RadioList';
import AudioPlayer from './components/AudioPlayer';
import { RadioStation } from './types/radio';
import { searchRadios, getTopRadios, getRadiosByGenre } from './utils/api';

function App() {
  const [radios, setRadios] = useState<RadioStation[]>([]);
  const [currentRadio, setCurrentRadio] = useState<RadioStation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState(0); // For triggering re-renders

  // Load top radios on component mount
  useEffect(() => {
    const loadTopRadios = async () => {
      setIsLoading(true);
      try {
        const topRadios = await getTopRadios(24);
        setRadios(topRadios);
      } catch (error) {
        console.error('Error loading top radios:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTopRadios();
  }, []);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      let results: RadioStation[];
      if (query.trim()) {
        results = await searchRadios(query, 'BR', 30);
      } else {
        results = await getTopRadios(24);
      }
      setRadios(results);
    } catch (error) {
      console.error('Error searching radios:', error);
      setRadios([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenreFilter = async (genre: string) => {
    setIsLoading(true);
    try {
      const results = await getRadiosByGenre(genre, 30);
      setRadios(results);
    } catch (error) {
      console.error('Error filtering by genre:', error);
      setRadios([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = (radio: RadioStation) => {
    setCurrentRadio(radio);
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleFavoriteToggle = () => {
    setFavorites(prev => prev + 1); // Trigger re-render
  };

  const handleNext = () => {
    if (!currentRadio) return;
    
    const currentIndex = radios.findIndex(r => r.stationuuid === currentRadio.stationuuid);
    const nextIndex = (currentIndex + 1) % radios.length;
    
    if (radios[nextIndex]) {
      handlePlay(radios[nextIndex]);
    }
  };

  const handlePrevious = () => {
    if (!currentRadio) return;
    
    const currentIndex = radios.findIndex(r => r.stationuuid === currentRadio.stationuuid);
    const previousIndex = currentIndex === 0 ? radios.length - 1 : currentIndex - 1;
    
    if (radios[previousIndex]) {
      handlePlay(radios[previousIndex]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8 pb-32">
        <SearchBar
          onSearch={handleSearch}
          onGenreFilter={handleGenreFilter}
          isLoading={isLoading}
        />
        
        <RadioList
          radios={radios}
          currentRadio={currentRadio}
          isPlaying={isPlaying}
          isLoading={isLoading}
          onPlay={handlePlay}
          onPause={handlePause}
          onFavoriteToggle={handleFavoriteToggle}
        />
      </main>

      <AudioPlayer
        currentRadio={currentRadio}
        isPlaying={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={handlePause}
        onNext={radios.length > 1 ? handleNext : undefined}
        onPrevious={radios.length > 1 ? handlePrevious : undefined}
      />
    </div>
  );
}

export default App;