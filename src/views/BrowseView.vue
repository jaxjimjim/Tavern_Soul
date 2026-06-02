<template>
  <div class="px-8 py-6 max-w-6xl mx-auto w-full">
    <!-- Featured Banner -->
    <div v-if="featuredPlaylist" @click="playerStore.playPlaylist(featuredPlaylist.id)" class="relative w-full h-64 rounded-2xl overflow-hidden mb-12 group cursor-pointer border border-tavern-border hover:border-tavern-accent/50 transition-colors">
      <div class="absolute inset-0 bg-gradient-to-r from-tavern-dark via-tavern-dark/80 to-transparent z-10"></div>
      <img :src="featuredPlaylist.picUrl" alt="Featured" class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" />
      
      <div class="absolute inset-0 z-20 p-8 flex flex-col justify-center w-2/3">
        <div class="text-[10px] font-bold uppercase tracking-widest text-tavern-accent mb-2">网易云精选推介</div>
        <h2 class="text-4xl font-serif font-bold text-white mb-4 leading-tight line-clamp-2">{{ featuredPlaylist.name }}</h2>
        <div class="flex space-x-4 mt-2">
          <button class="bg-tavern-accent text-white px-6 py-2.5 rounded-full text-sm font-semibold flex items-center hover:bg-orange-600 hover:shadow-glow-accent transition-all">
            <Icon icon="mdi:play" class="w-5 h-5 mr-1" /> 立即播放
          </button>
        </div>
      </div>
    </div>
    
    <!-- Skeleton Banner -->
    <div v-else class="w-full h-64 rounded-2xl overflow-hidden mb-12 bg-tavern-card animate-pulse border border-tavern-border"></div>

    <!-- Curated Atmospheres Grid -->
    <div class="mb-12">
      <div class="flex items-end justify-between mb-6">
        <div>
          <h3 class="text-xl font-bold text-white font-serif mb-1">发现新氛围</h3>
          <p class="text-sm text-tavern-textMuted">根据网易云算法为您推荐的优质歌单。</p>
        </div>
        <button class="text-xs font-semibold text-tavern-textMuted hover:text-white transition-colors">查看全部</button>
      </div>

      <div v-if="recommendedPlaylists.length > 0" class="grid grid-cols-4 gap-6">
        <div v-for="pl in recommendedPlaylists" :key="pl.id" @click="playerStore.playPlaylist(pl.id)" class="group cursor-pointer">
          <div class="relative w-full aspect-square rounded-xl overflow-hidden mb-3 border border-tavern-border group-hover:border-tavern-textMuted transition-colors shadow-lg">
            <img :src="pl.picUrl" :alt="pl.name" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div class="w-12 h-12 rounded-full bg-tavern-accent flex items-center justify-center text-white shadow-glow-accent transform scale-90 group-hover:scale-100 transition-transform">
                <Icon icon="mdi:play" class="w-8 h-8" />
              </div>
            </div>
          </div>
          <h4 class="text-base font-bold text-white mb-1 group-hover:text-tavern-accent transition-colors line-clamp-1">{{ pl.name }}</h4>
          <p class="text-xs text-tavern-textMuted">{{ Math.floor(pl.playCount / 10000) }}万 播放</p>
        </div>
      </div>
      
      <!-- Skeleton Grid -->
      <div v-else class="grid grid-cols-4 gap-6">
        <div v-for="i in 4" :key="i" class="animate-pulse">
          <div class="w-full aspect-square rounded-xl bg-tavern-card mb-3 border border-tavern-border"></div>
          <div class="h-4 bg-tavern-card rounded w-3/4 mb-2"></div>
          <div class="h-3 bg-tavern-card rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- Recent List -->
    <div>
      <h3 class="text-lg font-bold text-white font-serif mb-4">你的歌单</h3>
      <div v-if="authStore.isLoggedIn" class="bg-tavern-card border border-tavern-border rounded-xl p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
        
        <div v-for="playlist in authStore.userPlaylists" :key="playlist.id" @click="playerStore.playPlaylist(playlist.id)" class="flex items-center justify-between p-3 rounded-lg hover:bg-tavern-border/50 cursor-pointer transition-colors group">
          <div class="flex items-center space-x-4">
            <img :src="playlist.coverImgUrl" class="w-10 h-10 rounded object-cover" />
            <div>
              <div class="text-sm font-bold text-white line-clamp-1">{{ playlist.name }}</div>
              <div class="text-xs text-tavern-textMuted">{{ playlist.trackCount }} 首 • 创建者：{{ playlist.creator?.nickname }}</div>
            </div>
          </div>
          <div class="flex items-center space-x-6 text-tavern-textMuted">
            <Icon icon="mdi:play-circle-outline" class="w-6 h-6 hover:text-tavern-accent transition-colors" />
            <Icon icon="mdi:dots-horizontal" class="w-5 h-5 hover:text-white transition-colors" />
          </div>
        </div>

      </div>
      <div v-else class="bg-tavern-card border border-tavern-border rounded-xl p-8 flex flex-col items-center justify-center text-center">
        <Icon icon="mdi:music-box-outline" class="w-12 h-12 text-tavern-textMuted mb-2" />
        <p class="text-tavern-textMuted text-sm">登录网易云音乐查看你的歌单。</p>
        <button @click="authStore.showLoginModal = true" class="mt-4 bg-tavern-accent text-white px-6 py-2 rounded-full text-xs font-bold hover:bg-orange-600 transition-colors">
          连接账号
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Icon } from '@iconify/vue';
import { useAuthStore } from '../stores/authStore';
import { usePlayerStore } from '../stores/playerStore';
import { api_getPersonalizedPlaylists } from '../api';

const authStore = useAuthStore();
const playerStore = usePlayerStore();

const featuredPlaylist = ref<any>(null);
const recommendedPlaylists = ref<any[]>([]);

onMounted(async () => {
  const data = await api_getPersonalizedPlaylists(5);
  if (data && data.length > 0) {
    featuredPlaylist.value = data[0];
    recommendedPlaylists.value = data.slice(1, 5);
  }
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #2a2424;
  border-radius: 4px;
}
</style>
