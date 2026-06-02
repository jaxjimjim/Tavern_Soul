import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../api';

interface UserProfile {
  userId: number;
  nickname: string;
  avatarUrl: string;
}

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false);
  const profile = ref<UserProfile | null>(null);
  const qrKey = ref('');
  const qrUrl = ref('');
  const qrStatus = ref(0); // 800: expired, 801: waiting, 802: authorized, 803: success
  const showLoginModal = ref(false);
  const userPlaylists = ref<any[]>([]);

  // Check login status on init
  const checkStatus = async () => {
    try {
      const res = await api.post('/login/status');
      if (res.data.data.code === 200 && res.data.data.account !== null) {
        isLoggedIn.value = true;
        profile.value = res.data.data.profile;
        await fetchUserPlaylists(profile.value!.userId);
      } else {
        isLoggedIn.value = false;
        profile.value = null;
      }
    } catch (e) {
      console.error('Failed to check status', e);
    }
  };

  const getQrKey = async () => {
    const res = await api.get(`/login/qr/key?timestamp=${Date.now()}`);
    if (res.data.code === 200) {
      qrKey.value = res.data.data.unikey;
      await createQr();
    }
  };

  const createQr = async () => {
    const res = await api.get(`/login/qr/create?key=${qrKey.value}&qrimg=true&timestamp=${Date.now()}`);
    if (res.data.code === 200) {
      qrUrl.value = res.data.data.qrurl;
    }
  };

  const checkQrStatus = async () => {
    if (!qrKey.value) return;
    const res = await api.get(`/login/qr/check?key=${qrKey.value}&timestamp=${Date.now()}`);
    qrStatus.value = res.data.code;
    
    if (res.data.code === 803) {
      // Login successful
      const cookie = res.data.cookie;
      localStorage.setItem('cookie', cookie);
      showLoginModal.value = false;
      await checkStatus();
    }
    return res.data.code;
  };

  const fetchUserPlaylists = async (uid: number) => {
    try {
      const res = await api.get(`/user/playlist?uid=${uid}`);
      if (res.data.code === 200) {
        userPlaylists.value = res.data.playlist;
      }
    } catch (e) {
      console.error('Failed to fetch playlists', e);
    }
  };

  const logout = async () => {
    await api.post('/logout');
    localStorage.removeItem('cookie');
    isLoggedIn.value = false;
    profile.value = null;
    userPlaylists.value = [];
  };

  return {
    isLoggedIn,
    profile,
    qrKey,
    qrUrl,
    qrStatus,
    showLoginModal,
    userPlaylists,
    checkStatus,
    getQrKey,
    checkQrStatus,
    logout
  };
});
