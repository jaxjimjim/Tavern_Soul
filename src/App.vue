<template>
  <div class="h-screen w-screen flex flex-col bg-tavern-dark text-tavern-text overflow-hidden bg-texture">
    <div class="flex flex-1 overflow-hidden relative">
      <!-- Conditional Sidebar -->
      <Sidebar v-if="!route.meta.hideSidebar" />
      
      <!-- Main Content Area -->
      <main class="flex-1 flex flex-col min-w-0 relative h-full">
        <TopBar v-if="!route.meta.hideSidebar" />
        
        <div class="flex-1 overflow-y-auto overflow-x-hidden relative">
          <!-- Router View with Transition -->
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>

    <!-- Persistent Bottom Player -->
    <BottomPlayer />

    <!-- Global Modals -->
    <LoginModal />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from './components/layout/Sidebar.vue';
import TopBar from './components/layout/TopBar.vue';
import BottomPlayer from './components/layout/BottomPlayer.vue';
import LoginModal from './components/LoginModal.vue';
import { useAuthStore } from './stores/authStore';

const route = useRoute();
const authStore = useAuthStore();

onMounted(() => {
  authStore.checkStatus();
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>