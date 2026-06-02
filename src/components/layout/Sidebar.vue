<template>
  <aside class="w-64 h-full flex flex-col bg-tavern-dark border-r border-tavern-border py-6 px-4 shrink-0">
    <!-- Brand -->
    <div class="flex items-center space-x-3 mb-10 px-2 cursor-pointer" @click="$router.push('/player')">
      <h1 class="text-2xl font-bold font-serif italic text-white tracking-wide">Tavern Soul</h1>
    </div>

    <!-- User / Mode -->
    <div @click="handleUserClick" class="flex items-center space-x-3 mb-8 px-2 bg-tavern-card rounded-lg p-3 border border-tavern-border hover:border-tavern-accent/30 transition-colors cursor-pointer group relative">
      <div v-if="!authStore.isLoggedIn" class="w-8 h-8 rounded-full bg-tavern-border flex items-center justify-center text-tavern-textMuted group-hover:text-white transition-colors">
        <Icon icon="mdi:account" class="w-5 h-5" />
      </div>
      <div v-else class="w-8 h-8 rounded-full overflow-hidden border border-tavern-accent shadow-glow-accent">
        <img :src="authStore.profile?.avatarUrl" alt="Avatar" class="w-full h-full object-cover" />
      </div>
      
      <div class="flex-1 min-w-0">
        <div class="text-sm font-semibold text-white truncate">{{ authStore.profile?.nickname || '登录网易云' }}</div>
        <div class="text-[10px] text-tavern-textMuted mt-0.5">{{ authStore.isLoggedIn ? '馆长模式' : '连接账号' }}</div>
      </div>

      <!-- Logout button visible on hover if logged in -->
      <button v-if="authStore.isLoggedIn" @click.stop="authStore.logout" class="absolute right-3 opacity-0 group-hover:opacity-100 text-tavern-textMuted hover:text-red-400 transition-all">
        <Icon icon="mdi:logout" class="w-4 h-4" />
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-grow space-y-1">
      <router-link to="/browse" class="flex items-center space-x-3 px-3 py-2 rounded-md text-tavern-textMuted hover:text-white hover:bg-tavern-card transition-colors group" active-class="text-tavern-accent bg-tavern-card/50">
        <Icon icon="mdi:library-music-outline" class="w-5 h-5 group-hover:text-tavern-accent transition-colors" />
        <span class="text-sm font-medium">音乐库</span>
      </router-link>
      <router-link to="/playlists" class="flex items-center space-x-3 px-3 py-2 rounded-md text-tavern-textMuted hover:text-white hover:bg-tavern-card transition-colors group">
        <Icon icon="mdi:playlist-music-outline" class="w-5 h-5 group-hover:text-tavern-accent transition-colors" />
        <span class="text-sm font-medium">歌单</span>
      </router-link>
      <router-link to="/artists" class="flex items-center space-x-3 px-3 py-2 rounded-md text-tavern-textMuted hover:text-white hover:bg-tavern-card transition-colors group">
        <Icon icon="mdi:account-music-outline" class="w-5 h-5 group-hover:text-tavern-accent transition-colors" />
        <span class="text-sm font-medium">歌手</span>
      </router-link>
      <router-link to="/albums" class="flex items-center space-x-3 px-3 py-2 rounded-md text-tavern-textMuted hover:text-white hover:bg-tavern-card transition-colors group">
        <Icon icon="mdi:album" class="w-5 h-5 group-hover:text-tavern-accent transition-colors" />
        <span class="text-sm font-medium">专辑</span>
      </router-link>
    </nav>

    <!-- Bottom Actions -->
    <div class="mt-auto space-y-6">
      <button @click="$router.push('/console')" class="w-full py-2.5 bg-tavern-accent/10 text-tavern-accent font-medium text-sm rounded-full border border-tavern-accent/20 hover:bg-tavern-accent hover:text-white hover:shadow-glow-accent transition-all duration-300">
        排班计划
      </button>

      <div class="space-y-3 px-2">
        <div class="flex items-center space-x-3 text-xs text-tavern-textMuted hover:text-white cursor-pointer transition-colors">
          <Icon icon="mdi:download-outline" class="w-4 h-4" />
          <span>下载管理</span>
        </div>
        <div class="flex items-center space-x-3 text-xs text-tavern-textMuted hover:text-white cursor-pointer transition-colors">
          <Icon icon="mdi:wifi-off" class="w-4 h-4" />
          <span>离线模式</span>
        </div>
        <div @click="$router.push('/settings')" class="flex items-center space-x-3 text-xs text-tavern-textMuted hover:text-white cursor-pointer transition-colors">
          <Icon icon="mdi:cog-outline" class="w-4 h-4" />
          <span>设置</span>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { useAuthStore } from '../../stores/authStore';

const authStore = useAuthStore();

const handleUserClick = () => {
  if (!authStore.isLoggedIn) {
    authStore.showLoginModal = true;
  }
};
</script>
