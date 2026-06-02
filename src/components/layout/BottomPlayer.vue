<template>
  <div class="h-24 w-full bg-[#121011] border-t border-tavern-border flex items-center px-6 shrink-0 relative z-50">
    <!-- Left: Track Info -->
    <div class="w-1/3 flex items-center space-x-4">
      <div class="w-14 h-14 rounded bg-tavern-card overflow-hidden shadow-lg cursor-pointer" @click="$router.push('/player')">
        <img v-if="currentTrack?.coverUrl" :src="currentTrack.coverUrl" alt="Cover" class="w-full h-full object-cover" />
        <div v-else class="w-full h-full flex items-center justify-center text-tavern-textMuted bg-tavern-border">
          <Icon icon="mdi:music-note" class="w-6 h-6" />
        </div>
      </div>
      <div>
        <div class="text-sm font-semibold text-white line-clamp-1 cursor-pointer hover:underline" @click="$router.push('/player')">
          {{ currentTrack?.name || '星光小夜曲' }}
        </div>
        <div class="text-xs text-tavern-textMuted line-clamp-1 mt-0.5">
          {{ currentTrack?.artists || '克拉拉·万斯' }}
        </div>
      </div>
      <button class="text-tavern-textMuted hover:text-tavern-accent transition-colors ml-2">
        <Icon icon="mdi:heart-outline" class="w-5 h-5" />
      </button>
    </div>

    <!-- Center: Playback Controls -->
    <div class="w-1/3 flex flex-col items-center justify-center">
      <div class="flex items-center space-x-6 mb-2">
        <button class="text-tavern-textMuted hover:text-white transition-colors">
          <Icon icon="mdi:shuffle" class="w-4 h-4" />
        </button>
        <button @click="playerStore.prev()" class="text-tavern-textMuted hover:text-white transition-colors">
          <Icon icon="mdi:skip-previous" class="w-6 h-6" />
        </button>
        <button @click="playerStore.togglePlay()" class="w-10 h-10 rounded-full bg-tavern-accent text-white flex items-center justify-center hover:scale-105 hover:shadow-glow-accent transition-all">
          <Icon :icon="isPlaying ? 'mdi:pause' : 'mdi:play'" class="w-6 h-6" />
        </button>
        <button @click="playerStore.next()" class="text-tavern-textMuted hover:text-white transition-colors">
          <Icon icon="mdi:skip-next" class="w-6 h-6" />
        </button>
        <button class="text-tavern-textMuted hover:text-white transition-colors">
          <Icon icon="mdi:repeat" class="w-4 h-4" />
        </button>
      </div>
      
      <!-- Progress Bar -->
      <div class="flex items-center space-x-3 w-full max-w-md">
        <span class="text-[10px] text-tavern-textMuted w-8 text-right">{{ formatTime(currentTime) }}</span>
        <div class="flex-grow h-1 bg-tavern-border rounded-full overflow-hidden cursor-pointer group" @click="seekTo">
          <div class="h-full bg-tavern-accent rounded-full transition-all duration-300 relative group-hover:bg-tavern-accent pointer-events-none" :style="{ width: `${progress}%` }">
            <div class="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full opacity-0 group-hover:opacity-100 shadow-md"></div>
          </div>
        </div>
        <span class="text-[10px] text-tavern-textMuted w-8">{{ formatTime(duration) }}</span>
      </div>
    </div>

      <!-- Right Controls -->
      <div class="w-1/3 flex items-center justify-end space-x-4 pr-6">
        <button @click="$router.push(route.path === '/player' ? '/browse' : '/player')" class="flex flex-col items-center text-tavern-textMuted hover:text-white transition-colors group">
          <Icon icon="mdi:microphone-variant" class="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          <span class="text-[9px] mt-1">歌词</span>
        </button>
        <button class="flex flex-col items-center text-tavern-textMuted hover:text-white transition-colors group">
          <Icon icon="mdi:playlist-play" class="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          <span class="text-[9px] mt-1">队列</span>
        </button>
        <button class="flex flex-col items-center text-tavern-accent transition-colors group relative">
          <Icon icon="mdi:speaker-wireless" class="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          <span class="text-[9px] mt-1 font-bold">设备</span>
          <span class="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-tavern-dark"></span>
        </button>

      <!-- Volume -->
      <div class="flex items-center space-x-2 ml-4">
        <Icon :icon="volumeIcon" class="w-4 h-4 cursor-pointer" @click="toggleMute" />
        <div class="w-20 h-1 bg-tavern-border rounded-full overflow-hidden cursor-pointer" @click="setVolume">
          <div class="h-full bg-white hover:bg-tavern-accent transition-colors rounded-full" :style="{ width: `${volume * 100}%` }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { Icon } from '@iconify/vue';
import { usePlayerStore } from '../../stores/playerStore';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';

const route = useRoute();
const playerStore = usePlayerStore();
const { currentTrack, isPlaying, currentTime, duration, volume } = storeToRefs(playerStore);

const previousVolume = ref(1.0);

const volumeIcon = computed(() => {
  if (volume.value === 0) return 'mdi:volume-mute';
  if (volume.value < 0.5) return 'mdi:volume-medium';
  return 'mdi:volume-high';
});

const toggleMute = () => {
  if (volume.value > 0) {
    previousVolume.value = volume.value;
    playerStore.setVolume(0);
  } else {
    playerStore.setVolume(previousVolume.value || 1.0);
  }
};

const setVolume = (e: MouseEvent) => {
  const target = e.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const ratio = (e.clientX - rect.left) / rect.width;
  playerStore.setVolume(ratio);
};

const progress = computed(() => {
  if (duration.value === 0) return 0;
  return (currentTime.value / duration.value) * 100;
});

const seekTo = (e: MouseEvent) => {
  if (duration.value === 0) return;
  const target = e.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const ratio = (e.clientX - rect.left) / rect.width;
  playerStore.seek(ratio * duration.value);
};

const formatTime = (seconds: number) => {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};
</script>
