import { FavoriteRadio, PlaybackHistory } from '../types/radio';

const FAVORITES_KEY = 'online-radios-favorites';
const HISTORY_KEY = 'online-radios-history';

export const getFavorites = (): FavoriteRadio[] => {
  try {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export const addToFavorites = (radio: FavoriteRadio): void => {
  try {
    const favorites = getFavorites();
    const exists = favorites.some(fav => fav.stationuuid === radio.stationuuid);
    
    if (!exists) {
      const newFavorites = [...favorites, { ...radio, addedAt: new Date().toISOString() }];
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    }
  } catch (error) {
    console.error('Error adding to favorites:', error);
  }
};

export const removeFromFavorites = (stationuuid: string): void => {
  try {
    const favorites = getFavorites();
    const filtered = favorites.filter(fav => fav.stationuuid !== stationuuid);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing from favorites:', error);
  }
};

export const isFavorite = (stationuuid: string): boolean => {
  const favorites = getFavorites();
  return favorites.some(fav => fav.stationuuid === stationuuid);
};

export const getPlaybackHistory = (): PlaybackHistory[] => {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error getting playback history:', error);
    return [];
  }
};

export const addToHistory = (stationuuid: string, name: string): void => {
  try {
    let history = getPlaybackHistory();
    
    // Remove existing entry for this station
    history = history.filter(item => item.stationuuid !== stationuuid);
    
    // Add to beginning of array
    history.unshift({
      stationuuid,
      name,
      playedAt: new Date().toISOString()
    });
    
    // Keep only last 50 entries
    history = history.slice(0, 50);
    
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error adding to history:', error);
  }
};