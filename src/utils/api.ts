const BASE_URL = 'https://de1.api.radio-browser.info/json';

export const searchRadios = async (
  query: string = '',
  countrycode: string = 'BR',
  limit: number = 20
): Promise<RadioStation[]> => {
  try {
    const params = new URLSearchParams({
      countrycode,
      limit: limit.toString(),
      order: 'votes'
    });
    
    if (query.trim()) {
      params.append('name', query);
    }
    
    const response = await fetch(`${BASE_URL}/stations/search?${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch radio stations');
    }
    
    const data = await response.json();
    return data.filter((station: any) => 
      station.url_resolved && 
      station.lastcheckok === 1
    );
  } catch (error) {
    console.error('Error fetching radio stations:', error);
    return [];
  }
};

export const getTopRadios = async (limit: number = 20): Promise<RadioStation[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/stations/topvote?limit=${limit}&hidebroken=true`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch top radio stations');
    }
    
    const data = await response.json();
    return data.filter((station: any) => station.countrycode === 'BR');
  } catch (error) {
    console.error('Error fetching top radio stations:', error);
    return [];
  }
};

export const getRadiosByGenre = async (
  tag: string,
  limit: number = 20
): Promise<RadioStation[]> => {
  try {
    const response = await fetch(
      `${BASE_URL}/stations/bytag/${encodeURIComponent(tag)}?limit=${limit}&hidebroken=true`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch radio stations by genre');
    }
    
    const data = await response.json();
    return data.filter((station: any) => station.countrycode === 'BR');
  } catch (error) {
    console.error('Error fetching radio stations by genre:', error);
    return [];
  }
};