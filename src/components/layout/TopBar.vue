<template>
  <header class="h-20 w-full flex items-center justify-between px-8 bg-transparent shrink-0">
    <!-- Center Nav -->
    <nav class="flex items-center space-x-8 absolute left-1/2 -translate-x-1/2">
      <router-link to="/browse" class="text-sm font-medium text-tavern-textMuted hover:text-white transition-colors" active-class="text-white border-b-2 border-tavern-accent pb-1">首页</router-link>
      <router-link to="/console" class="text-sm font-medium text-tavern-textMuted hover:text-white transition-colors" active-class="text-white border-b-2 border-tavern-accent pb-1">控制台</router-link>
    </nav>

    <!-- Right Controls -->
    <div class="ml-auto flex items-center space-x-6">
      <!-- Search -->
      <div class="relative group">
        <Icon icon="mdi:magnify" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-tavern-textMuted group-focus-within:text-tavern-accent transition-colors" />
        <input type="text" placeholder="搜索歌曲、歌手、氛围..." class="w-64 bg-tavern-card/50 border border-tavern-border rounded-full py-1.5 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-tavern-accent/50 focus:bg-tavern-card transition-all placeholder-tavern-textMuted/50" />
      </div>

      <button class="text-tavern-textMuted hover:text-white transition-colors">
        <Icon icon="mdi:bell-outline" class="w-5 h-5" />
      </button>
      <button @click="$router.push('/settings')" class="text-tavern-textMuted hover:text-white transition-colors">
        <Icon icon="mdi:cog-outline" class="w-5 h-5" />
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
</script>
