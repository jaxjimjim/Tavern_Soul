import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { DualAudioEngine } from '../utils/AudioEngine';
import { api_getPlaylistTracks, api_getSongUrl, api_getLyric } from '../api';

export const usePlayerStore = defineStore('player', () => {
  const currentTrack = ref<any>(null);
  const queue = ref<any[]>([]);
  const currentIndex = ref(-1);
  const isPlaying = ref(false);
  const currentTime = ref(0);
  const duration = ref(0);
  const currentLyric = ref('');

  // Settings & Schedules
  const defaultSchedules = [
    {
      id: 1,
      startTime: '08:00',
      endTime: '11:00',
      name: '清晨原声',
      description: '精选民谣与轻柔弦乐',
      playlistId: 3012117565, // Netease acoustic playlist
      coverUrl: 'https://images.unsplash.com/photo-1493225457124-a1a2a5f0da51?w=100&q=80',
    },
    {
      id: 2,
      startTime: '11:00',
      endTime: '16:00',
      name: '慵懒午后',
      description: '适合熟客的轻松背景音',
      playlistId: 2471960249, // Lo-Fi
      coverUrl: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?w=100&q=80',
    },
    {
      id: 3,
      startTime: '16:00',
      endTime: '20:00',
      name: '爵士之夜',
      description: '丝滑铜管与迷幻节奏',
      playlistId: 21396263, // Jazz
      coverUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=100&q=80',
    },
    {
      id: 4,
      startTime: '20:00',
      endTime: '02:00',
      name: '黑胶之夜',
      description: '顶级音质，午夜灵魂精选',
      playlistId: 981329598, // Blues/Soul
      coverUrl: 'https://images.unsplash.com/photo-1458560871784-56d23406c091?w=100&q=80',
    }
  ];

  const schedules = ref<any[]>(defaultSchedules);
  
  const getCurrentSchedule = () => {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    for (const schedule of schedules.value) {
      const [startH, startM] = schedule.startTime.split(':').map(Number);
      const [endH, endM] = schedule.endTime.split(':').map(Number);
      
      const startMinutes = startH * 60 + startM;
      let endMinutes = endH * 60 + endM;
      if (endMinutes <= startMinutes) {
        endMinutes += 24 * 60; // Next day crossing midnight
      }
      
      let testMinutes = currentMinutes;
      if (testMinutes < startMinutes && endMinutes > 24 * 60) {
         testMinutes += 24 * 60;
      }
      
      if (testMinutes >= startMinutes && testMinutes < endMinutes) {
        return schedule;
      }
    }
    return null;
  };
  const crossfadeDuration = ref(6);
  const audioQuality = ref('standard');
  const volume = ref(1.0);
  const activeAtmosphere = ref<string>('');
  const activeDeviceIds = ref<string[]>(['default']);

  const engine = new DualAudioEngine();

  // --- Persistence ---
  const saveState = () => {
    const state = {
      queue: queue.value,
      currentIndex: currentIndex.value,
      currentTrack: currentTrack.value,
      currentLyric: currentLyric.value,
      crossfadeDuration: crossfadeDuration.value,
      audioQuality: audioQuality.value,
      volume: volume.value,
      schedules: schedules.value,
      activeAtmosphere: activeAtmosphere.value,
      activeDeviceIds: activeDeviceIds.value,
    };
    localStorage.setItem('tavern_player_state', JSON.stringify(state));
  };

  const loadState = () => {
    const saved = localStorage.getItem('tavern_player_state');
    if (saved) {
      try {
        const state = JSON.parse(saved);
        queue.value = state.queue || [];
        currentIndex.value = state.currentIndex || -1;
        currentTrack.value = state.currentTrack || null;
        currentLyric.value = state.currentLyric || '';
        crossfadeDuration.value = state.crossfadeDuration ?? 6;
        audioQuality.value = state.audioQuality || 'standard';
        volume.value = state.volume ?? 1.0;
        if (state.schedules && state.schedules.length > 0) {
          schedules.value = state.schedules;
        }
        activeAtmosphere.value = state.activeAtmosphere || '';
        if (state.activeDeviceIds && state.activeDeviceIds.length > 0) {
          activeDeviceIds.value = state.activeDeviceIds;
        }
      } catch (e) {
        console.error('Failed to load player state', e);
      }
    }
  };

  // Initialize
  loadState();
  engine.crossfadeDuration = crossfadeDuration.value * 1000;
  engine.setGlobalVolume(volume.value);
  if (engine.setSinkIds) {
    engine.setSinkIds(activeDeviceIds.value);
  }

  // Auto-save on changes
  watch(
    [queue, currentIndex, currentTrack, currentLyric, crossfadeDuration, audioQuality, volume, schedules, activeAtmosphere, activeDeviceIds],
    () => {
      saveState();
    },
    { deep: true }
  );

  // Engine Callbacks
  engine.onTimeUpdate = (time, dur) => {
    currentTime.value = time;
    duration.value = dur;
  };

  engine.onEnded = () => {
    next();
  };

  engine.onNextNeeded = () => {
    // Crossfade trigger
    next(true);
  };

  const playPlaylist = async (playlistId: number) => {
    try {
      const tracks = await api_getPlaylistTracks(playlistId);
      if (tracks.length > 0) {
        queue.value = tracks;
        currentIndex.value = 0;
        await playCurrent(false); // First track, no crossfade
      }
    } catch (e) {
      console.error('Failed to play playlist', e);
    }
  };

  let consecutiveSkips = 0;

  const playCurrent = async (crossfade = true) => {
    if (currentIndex.value < 0 || currentIndex.value >= queue.value.length) return;
    
    if (consecutiveSkips >= queue.value.length) {
      console.error('All tracks in playlist failed to load.');
      isPlaying.value = false;
      consecutiveSkips = 0;
      return;
    }

    const track = queue.value[currentIndex.value];
    
    // Only clear lyrics if it's a completely new track
    if (currentTrack.value?.id !== track.id) {
      currentLyric.value = '';
    }

    // Update UI immediately
    currentTrack.value = {
      id: track.id,
      name: track.name,
      artists: track.ar.map((a: any) => a.name).join(', '),
      coverUrl: track.al.picUrl,
    };
    
    isPlaying.value = true;

    // Fetch URL and Lyric in parallel
    const [url, lyric] = await Promise.all([
      api_getSongUrl(track.id, audioQuality.value),
      api_getLyric(track.id)
    ]);

    if (!url) {
      console.warn('Track URL not found (VIP or no copyright). Skipping...');
      consecutiveSkips++;
      next(false);
      return;
    }

    consecutiveSkips = 0; // Reset on success
    currentLyric.value = lyric;
    await engine.play(url, crossfade);
  };

  const next = async (crossfade = true) => {
    if (queue.value.length === 0) return;
    
    currentIndex.value = (currentIndex.value + 1) % queue.value.length;
    await playCurrent(crossfade);
  };

  const prev = async () => {
    if (queue.value.length === 0) return;
    
    currentIndex.value = (currentIndex.value - 1 + queue.value.length) % queue.value.length;
    await playCurrent(false); // Manual prev usually doesn't crossfade
  };

  const togglePlay = () => {
    if (isPlaying.value) {
      engine.pause();
      isPlaying.value = false;
    } else {
      // If we are restoring from state and engine is empty, we must playCurrent
      if (duration.value === 0 && currentIndex.value >= 0) {
        playCurrent(false);
      } else {
        engine.resume();
        isPlaying.value = true;
      }
    }
  };

  const seek = (time: number) => {
    engine.seek(time);
  };

  const setVolume = (vol: number) => {
    volume.value = Math.max(0, Math.min(1, vol));
    engine.setGlobalVolume(volume.value);
  };

  const updateSchedules = (newSchedules: any[]) => {
    schedules.value = newSchedules;
  };

  const updateSettings = (settings: any) => {
    if (settings.crossfadeDuration !== undefined) {
      crossfadeDuration.value = settings.crossfadeDuration;
      engine.crossfadeDuration = crossfadeDuration.value * 1000;
    }
    if (settings.audioQuality !== undefined) {
      audioQuality.value = settings.audioQuality;
    }
  };

  return {
    currentTrack,
    queue,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    currentLyric,
    schedules,
    crossfadeDuration,
    audioQuality,
    volume,
    playPlaylist,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
    updateSchedules,
    updateSettings,
    getCurrentSchedule,
    activeAtmosphere,
    activeDeviceIds
  };
});
