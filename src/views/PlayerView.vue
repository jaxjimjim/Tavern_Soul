<template>
  <div class="absolute inset-0 w-full h-full p-10 flex flex-col bg-[#121011]">
    <!-- Custom Top Nav for Immersive Mode -->
    <header class="flex items-center justify-between z-10 shrink-0">
      <div class="flex items-center space-x-6">
        <button @click="$router.back()" class="w-10 h-10 rounded-full bg-tavern-card/50 border border-tavern-border flex items-center justify-center text-tavern-textMuted hover:text-white hover:bg-tavern-card transition-all">
          <Icon icon="mdi:chevron-down" class="w-6 h-6" />
        </button>
        <h1 class="text-2xl font-bold font-serif italic text-white tracking-wide cursor-pointer" @click="$router.push('/console')">Tavern Soul</h1>
      </div>
      <div class="flex items-center space-x-4 text-tavern-textMuted ml-auto">
        <Icon icon="mdi:star-outline" class="w-5 h-5 hover:text-white cursor-pointer" />
        <Icon icon="mdi:export-variant" class="w-5 h-5 hover:text-white cursor-pointer" />
      </div>
    </header>

    <!-- Main Content: Cover & Lyrics -->
    <div class="flex-1 flex items-center justify-between mt-12 relative h-full min-h-0">
      <!-- Subtle background radial glow -->
      <div class="absolute left-1/4 top-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-tavern-accent/10 rounded-full blur-[120px] pointer-events-none"></div>

      <!-- Left: Album Vinyl/Cover -->
      <div class="w-1/2 h-full flex flex-col items-center justify-center relative z-10">
        <div class="relative w-[400px] h-[400px] rounded-full p-2 bg-[#1a1717] border border-tavern-border shadow-2xl overflow-hidden flex items-center justify-center">
          <div class="w-full h-full rounded-full overflow-hidden border border-white/5 animate-[spin_20s_linear_infinite]" :style="isPlaying ? 'animation-play-state: running;' : 'animation-play-state: paused;'">
             <img :src="currentTrack?.coverUrl || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80'" alt="Album Cover" class="w-full h-full object-cover" />
          </div>
          <!-- Vinyl Center Hole -->
          <div class="absolute w-12 h-12 bg-[#121011] rounded-full border border-tavern-border/50 flex items-center justify-center shadow-inner">
             <div class="w-2 h-2 bg-tavern-textMuted rounded-full"></div>
          </div>
        </div>
        
        <div class="mt-12 text-center">
          <h2 class="text-3xl font-bold text-white mb-2 tracking-tight">{{ currentTrack?.name || '午夜低语' }}</h2>
          <p class="text-tavern-textMuted font-serif italic text-lg">{{ currentTrack?.artists || '生锈铁锚四重奏' }}</p>
        </div>
      </div>

      <!-- Right: Lyrics -->
      <div class="col-span-8 relative h-full flex flex-col justify-center pl-16 overflow-hidden z-10">
        <!-- Masking for smooth scroll fade -->
        <div class="absolute inset-0 pointer-events-none z-20 mask-vertical-fade"></div>
        
        <div class="space-y-12 py-32 overflow-y-auto hide-scrollbar h-full flex flex-col items-start pr-10 scroll-smooth relative z-10 mask-vertical-fade" id="lyrics-container">
          <p v-for="(line, index) in parsedLyrics" :key="index"
             class="font-serif leading-snug transition-all duration-500 cursor-pointer w-full"
             :class="{
               'text-[56px] font-bold text-white/95 scale-[1.02] transform origin-left': isCurrentLine(index),
               'text-[40px] font-medium text-white/20 hover:text-white/40': !isCurrentLine(index)
             }"
             @click="seekToLine(line.time)">
             {{ line.text || '...' }}
          </p>
          <p v-if="parsedLyrics.length === 0" class="text-4xl font-serif leading-snug text-tavern-textMuted/40">
            暂无歌词
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { usePlayerStore } from '../stores/playerStore';

const playerStore = usePlayerStore();
const { currentTrack, isPlaying, currentLyric, currentTime } = storeToRefs(playerStore);

interface LyricLine {
  time: number;
  text: string;
}

const parsedLyrics = computed<LyricLine[]>(() => {
  const lrc = currentLyric.value;
  if (!lrc) return [];
  const lines = lrc.split('\n');
  const result: LyricLine[] = [];
  
  const timeExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
  
  lines.forEach(line => {
    const match = timeExp.exec(line);
    if (match) {
      const min = parseInt(match[1]);
      const sec = parseInt(match[2]);
      const ms = parseInt(match[3]);
      const text = line.replace(timeExp, '').trim();
      const time = min * 60 + sec + (ms / (ms > 99 ? 1000 : 100));
      if (text) {
        result.push({ time, text });
      }
    }
  });
  
  return result;
});

const isCurrentLine = (index: number) => {
  const time = currentTime.value;
  const curr = parsedLyrics.value[index];
  const next = parsedLyrics.value[index + 1];
  
  if (!next) return time >= curr.time;
  return time >= curr.time && time < next.time;
};

const seekToLine = (time: number) => {
  playerStore.seek(time);
};
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.mask-vertical-fade {
  mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%);
}
</style>
