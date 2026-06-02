<template>
  <div v-if="authStore.showLoginModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
    <div class="bg-tavern-card border border-tavern-border rounded-2xl p-8 max-w-sm w-full shadow-2xl relative">
      <!-- Close Button -->
      <button @click="closeModal" class="absolute top-4 right-4 text-tavern-textMuted hover:text-white transition-colors">
        <Icon icon="mdi:close" class="w-6 h-6" />
      </button>

      <div class="text-center mb-8">
        <h2 class="text-2xl font-serif font-bold text-white mb-2">连接你的灵魂</h2>
        <p class="text-xs text-tavern-textMuted">请打开网易云音乐 App 扫码登录</p>
      </div>

      <div class="flex flex-col items-center justify-center">
        <!-- QR Code Container -->
        <div class="p-4 bg-white rounded-xl mb-6 relative">
          <qrcode-vue v-if="authStore.qrUrl" :value="authStore.qrUrl" :size="200" level="M" />
          <div v-else class="w-[200px] h-[200px] flex items-center justify-center bg-gray-100">
            <Icon icon="eos-icons:loading" class="w-8 h-8 text-tavern-dark" />
          </div>

          <!-- Status Overlays -->
          <div v-if="authStore.qrStatus === 800" class="absolute inset-0 bg-white/90 flex flex-col items-center justify-center rounded-xl">
            <Icon icon="mdi:refresh" class="w-10 h-10 text-tavern-dark mb-2 cursor-pointer hover:text-tavern-accent transition-colors" @click="refreshQr" />
            <span class="text-xs font-bold text-tavern-dark">二维码已过期</span>
          </div>
          <div v-if="authStore.qrStatus === 802" class="absolute inset-0 bg-white/90 flex flex-col items-center justify-center rounded-xl">
            <Icon icon="mdi:check-circle" class="w-10 h-10 text-green-600 mb-2" />
            <span class="text-xs font-bold text-tavern-dark">扫描成功！请在手机上确认</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { Icon } from '@iconify/vue';
import QrcodeVue from 'qrcode.vue';
import { useAuthStore } from '../stores/authStore';

const authStore = useAuthStore();
let pollInterval: any = null;

const startPolling = () => {
  pollInterval = setInterval(async () => {
    const status = await authStore.checkQrStatus();
    if (status === 800 || status === 803) {
      clearInterval(pollInterval);
    }
  }, 3000);
};

const refreshQr = async () => {
  clearInterval(pollInterval);
  await authStore.getQrKey();
  startPolling();
};

onMounted(async () => {
  await refreshQr();
});

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval);
});

const closeModal = () => {
  if (pollInterval) clearInterval(pollInterval);
  authStore.showLoginModal = false;
};
</script>
