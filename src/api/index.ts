import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
  timeout: 10000,
});

// Interceptor to attach timestamp to prevent caching, and cookie if stored
api.interceptors.request.use((config) => {
  // Prevent caching for all requests
  if (config.method === 'get') {
    config.params = { ...config.params, timestamp: Date.now() };
  }
  
  // Attach cookie if exists in localStorage
  const cookie = localStorage.getItem('cookie');
  if (cookie) {
    if (config.method === 'post') {
      config.data = { ...config.data, cookie };
    } else {
      config.params = { ...config.params, cookie };
    }
  }
  
  return config;
});

export default api;

export const api_getPlaylistTracks = async (id: number) => {
  const res = await api.post('/playlist/track/all', { id, limit: 100 });
  return res.data.songs || [];
};

export const api_getSongUrl = async (id: number, level: string = 'standard') => {
  try {
    // Use standard level to ensure MP3 format by default.
    const res = await api.post('/song/url/v1', { id, level });
    let url = res.data?.data?.[0]?.url;
    
    // Convert HTTP to HTTPS to avoid mixed content issues
    if (url && url.startsWith('http://')) {
      url = url.replace('http://', 'https://');
    }
    
    return url || null;
  } catch (e) {
    console.error('API getSongUrl error', e);
    return null;
  }
};

export const api_getLyric = async (id: number) => {
  const res = await api.post('/lyric', { id });
  return res.data.lrc?.lyric || '';
};

export const api_getPersonalizedPlaylists = async (limit: number = 6) => {
  try {
    const res = await api.post('/personalized', { limit });
    return res.data.result || [];
  } catch (e) {
    console.error('API getPersonalizedPlaylists error', e);
    return [];
  }
};
