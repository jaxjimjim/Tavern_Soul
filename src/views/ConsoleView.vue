<template>
  <div class="px-8 py-6 max-w-6xl mx-auto w-full">
    <!-- Header -->
    <div class="mb-10">
      <h1 class="text-3xl font-bold font-serif text-white tracking-wide mb-2">自动播放控制台</h1>
      <p class="text-tavern-textMuted text-sm">为你的清吧精准编排每一个时段的灵魂。</p>
    </div>

    <div class="grid grid-cols-12 gap-8">
      <!-- Left Column: Daily Schedule -->
      <div class="col-span-8 bg-tavern-card rounded-2xl p-6 border border-tavern-border shadow-lg">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-lg font-semibold text-white flex items-center">
            <Icon icon="mdi:calendar-clock" class="mr-2 text-tavern-accent" />
            今日调度
          </h2>
          <div class="flex space-x-4 text-xs font-medium">
            <button @click="openEditModal" class="text-tavern-accent bg-tavern-accent/10 hover:bg-tavern-accent/20 px-4 py-1.5 rounded-full transition-colors flex items-center">
              <Icon icon="mdi:pencil" class="mr-1" /> 编辑排班
            </button>
            <button class="text-white bg-tavern-border px-3 py-1.5 rounded-full">今天</button>
            <button class="text-tavern-textMuted hover:text-white px-3 py-1.5 transition-colors">明天</button>
          </div>
        </div>

        <!-- Timeline -->
        <div class="relative border-l-2 border-tavern-border ml-4 space-y-8 pb-4">
          <div v-for="schedule in playerStore.schedules" :key="schedule.id" class="relative pl-6">
            
            <!-- Indicator Node -->
            <div v-if="getScheduleStatus(schedule) === 'completed'" class="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-tavern-dark border-2 border-tavern-textMuted flex items-center justify-center">
              <div class="w-1.5 h-1.5 rounded-full bg-tavern-textMuted"></div>
            </div>
            <div v-else-if="getScheduleStatus(schedule) === 'active'" class="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-tavern-dark border-2 border-tavern-accent flex items-center justify-center shadow-glow-accent">
              <div class="w-1.5 h-1.5 rounded-full bg-tavern-accent"></div>
            </div>
            <div v-else class="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-tavern-dark border-2 border-tavern-border flex items-center justify-center"></div>

            <!-- Content -->
            <div v-if="getScheduleStatus(schedule) === 'active'">
              <div class="bg-tavern-dark border border-tavern-accent/30 rounded-xl p-4 shadow-glow-accent/10 mt-2 relative overflow-hidden">
                <div class="absolute right-0 top-0 w-32 h-32 bg-tavern-accent/5 rounded-full blur-2xl pointer-events-none"></div>
                
                <div class="flex justify-between items-start mb-2 relative z-10">
                  <div class="text-xs font-bold text-tavern-accent font-mono">{{ schedule.startTime }} - {{ schedule.endTime }} (当前排班)</div>
                  <div class="flex space-x-2">
                     <button @click="playerStore.activeAtmosphere = ''; playerStore.playPlaylist(schedule.playlistId)" class="px-3 py-1 rounded bg-tavern-accent text-white text-xs font-bold hover:bg-orange-600 transition-colors flex items-center">
                       <Icon icon="mdi:play" class="mr-1"/> 立即同步歌单
                     </button>
                  </div>
                </div>
                <div class="text-base font-bold text-white mb-1 relative z-10">{{ schedule.name }}</div>
                <div class="text-xs text-tavern-textMuted mb-4 relative z-10">{{ schedule.description }}</div>
                
                <div v-if="playerStore.currentTrack" class="flex items-center space-x-3 bg-tavern-border/30 rounded-lg p-2 relative z-10">
                  <div class="w-8 h-8 rounded bg-tavern-card overflow-hidden shrink-0">
                    <img :src="playerStore.currentTrack.coverUrl" alt="Track" class="w-full h-full object-cover" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <div class="text-xs font-semibold text-white truncate">{{ playerStore.currentTrack.name }}</div>
                    <div class="w-full h-1 bg-tavern-dark rounded-full mt-1.5 overflow-hidden">
                      <div class="h-full bg-tavern-accent rounded-full transition-all duration-1000" :style="{ width: (playerStore.currentTime / (playerStore.duration || 1) * 100) + '%' }"></div>
                    </div>
                  </div>
                  <Icon v-if="playerStore.isPlaying" icon="eos-icons:three-dots-loading" class="text-tavern-accent w-5 h-5 mr-1" />
                </div>
              </div>
            </div>

            <div v-else>
              <div class="flex justify-between items-start mb-1">
                <div class="text-xs text-tavern-textMuted font-mono">{{ schedule.startTime }} - {{ schedule.endTime }}</div>
                <div v-if="getScheduleStatus(schedule) === 'completed'" class="text-[10px] uppercase tracking-wider text-tavern-textMuted bg-tavern-border/50 px-2 py-0.5 rounded">已结束</div>
                <div v-else class="text-[10px] uppercase tracking-wider text-tavern-accent border border-tavern-accent/30 px-2 py-0.5 rounded">即将播放</div>
              </div>
              <div class="text-sm font-semibold" :class="getScheduleStatus(schedule) === 'upcoming' ? 'text-white' : 'text-white/50'">{{ schedule.name }}</div>
              <div class="text-xs text-tavern-textMuted mt-1">{{ schedule.description }}</div>
            </div>

          </div>
        </div>
      </div>

      <!-- Right Column: Controls -->
      <div class="col-span-4 space-y-6">
        <!-- Active Output Header -->
        <div class="flex items-center justify-end space-x-3 mb-2">
          <div class="text-right">
            <div class="text-[10px] text-tavern-textMuted uppercase font-bold tracking-widest">当前输出</div>
            <div class="text-xs font-semibold text-white max-w-[200px] truncate" :title="activeDeviceNames">{{ activeDeviceNames || '默认设备' }}</div>
          </div>
          <div class="w-10 h-10 rounded-full bg-tavern-card border border-tavern-accent/30 flex items-center justify-center text-tavern-accent">
            <Icon icon="mdi:speaker-bluetooth" class="w-5 h-5" />
          </div>
        </div>

        <!-- Atmospheric Energies -->
        <div>
          <h3 class="text-xs font-bold text-tavern-textMuted uppercase tracking-wider mb-3 ml-1">一键氛围场</h3>
          <div class="grid grid-cols-2 gap-3">
            <button @click="triggerAtmosphere('热闹', [6871587520, 24381616])" class="h-20 rounded-xl border flex flex-col items-center justify-center transition-all group" :class="playerStore.activeAtmosphere === '热闹' ? 'bg-tavern-accent/20 border-tavern-accent text-white shadow-glow-accent' : 'bg-tavern-card border-tavern-border hover:border-tavern-textMuted text-tavern-textMuted hover:text-white'">
              <Icon icon="mdi:fire" class="w-6 h-6 mb-1" :class="playerStore.activeAtmosphere === '热闹' ? 'text-red-500' : ''" />
              <span class="text-xs font-bold">热闹 (流行/摇滚)</span>
            </button>
            <button @click="triggerAtmosphere('放松', [2471960249, 7360855217])" class="h-20 rounded-xl border flex flex-col items-center justify-center transition-all" :class="playerStore.activeAtmosphere === '放松' ? 'bg-tavern-accent/20 border-tavern-accent text-white shadow-glow-accent' : 'bg-tavern-card border-tavern-border hover:border-tavern-textMuted text-tavern-textMuted hover:text-white'">
              <Icon icon="mdi:coffee-outline" class="w-6 h-6 mb-1" />
              <span class="text-xs font-bold">放松 (Lo-Fi)</span>
            </button>
            <button @click="triggerAtmosphere('干杯', [5410313886, 2829883282])" class="h-20 rounded-xl border flex flex-col items-center justify-center transition-all" :class="playerStore.activeAtmosphere === '干杯' ? 'bg-tavern-accent/20 border-tavern-accent text-white shadow-glow-accent' : 'bg-tavern-card border-tavern-border hover:border-tavern-textMuted text-tavern-textMuted hover:text-white'">
              <Icon icon="mdi:glass-wine" class="w-6 h-6 mb-1" />
              <span class="text-xs font-bold">干杯 (电子/节奏)</span>
            </button>
            <button @click="triggerAtmosphere('沉浸', [21396263, 2736066224])" class="h-20 rounded-xl border flex flex-col items-center justify-center transition-all" :class="playerStore.activeAtmosphere === '沉浸' ? 'bg-tavern-accent/20 border-tavern-accent text-white shadow-glow-accent' : 'bg-tavern-card border-tavern-border hover:border-tavern-textMuted text-tavern-textMuted hover:text-white'">
              <Icon icon="mdi:candle" class="w-6 h-6 mb-1" />
              <span class="text-xs font-bold">沉浸 (爵士)</span>
            </button>
          </div>
        </div>

        <!-- Playback Devices -->
        <div>
          <h3 class="text-xs font-bold text-tavern-textMuted uppercase tracking-wider mb-3 ml-1">播放设备 (物理同步)</h3>
          <div class="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
            <div v-for="dev in audioDevices" :key="dev.deviceId" @click="toggleDevice(dev.deviceId)" class="bg-tavern-card border rounded-lg p-3 flex items-center justify-between cursor-pointer transition-colors" :class="playerStore.activeDeviceIds.includes(dev.deviceId) ? 'border-tavern-accent/50 bg-tavern-accent/5' : 'border-tavern-border hover:border-tavern-textMuted'">
              <div class="flex items-center space-x-3" :class="!playerStore.activeDeviceIds.includes(dev.deviceId) && 'opacity-60'">
                <div class="w-8 h-8 rounded flex items-center justify-center" :class="playerStore.activeDeviceIds.includes(dev.deviceId) ? 'bg-tavern-accent/10 text-tavern-accent' : 'bg-tavern-border text-tavern-textMuted'">
                  <Icon icon="mdi:speaker" class="w-4 h-4" />
                </div>
                <div>
                  <div class="text-xs font-bold text-white w-32 truncate">{{ dev.label || '未知音频设备' }}</div>
                  <div class="text-[10px]" :class="playerStore.activeDeviceIds.includes(dev.deviceId) ? 'text-tavern-accent' : 'text-tavern-textMuted'">{{ playerStore.activeDeviceIds.includes(dev.deviceId) ? '正在输出音频' : '空闲' }}</div>
                </div>
              </div>
              <div class="w-4 h-4 rounded-full border flex items-center justify-center" :class="playerStore.activeDeviceIds.includes(dev.deviceId) ? 'border-tavern-accent bg-tavern-accent' : 'border-tavern-textMuted'">
                 <div v-if="playerStore.activeDeviceIds.includes(dev.deviceId)" class="w-1.5 h-1.5 bg-tavern-dark rounded-full"></div>
              </div>
            </div>
            <div v-if="audioDevices.length === 0" class="text-xs text-tavern-textMuted p-2 text-center border border-tavern-border border-dashed rounded-lg">
              正在获取硬件设备...请允许权限
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Tasks -->
    <div class="mt-10">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white">交接任务</h3>
      </div>
      
      <div class="grid grid-cols-3 gap-6">
        <!-- Task Card 1 -->
        <div class="bg-tavern-card border border-tavern-border hover:border-tavern-accent/50 rounded-xl p-5 transition-all group">
          <div class="flex justify-between items-start mb-3">
            <div class="text-[10px] uppercase font-bold text-tavern-textMuted border border-tavern-border px-2 py-0.5 rounded">场景切换</div>
            <Icon icon="mdi:dots-horizontal" class="text-tavern-textMuted group-hover:text-white" />
          </div>
          <h4 class="text-sm font-bold text-white mb-2">切换到黑胶之夜</h4>
          <p class="text-xs text-tavern-textMuted line-clamp-2 mb-4">强制切换到无损音质并开始播放深夜黑胶特辑。</p>
          <div class="flex justify-between items-center mt-auto">
            <div class="flex -space-x-2">
              <div class="w-6 h-6 rounded-full bg-yellow-600 border-2 border-tavern-card"></div>
              <div class="w-6 h-6 rounded-full bg-tavern-accent border-2 border-tavern-card"></div>
            </div>
            <button @click="executeVinylNight" class="text-xs font-semibold text-tavern-dark bg-white hover:bg-tavern-accent hover:text-white px-3 py-1.5 rounded transition-colors">立即执行</button>
          </div>
        </div>
        
        <!-- Task Card 2 -->
        <div class="bg-tavern-card border border-tavern-border hover:border-tavern-textMuted rounded-xl p-5 transition-all group">
          <div class="flex justify-between items-start mb-3">
            <div class="text-[10px] uppercase font-bold text-green-500/80 border border-green-500/30 px-2 py-0.5 rounded">自动补齐</div>
            <Icon icon="mdi:dots-horizontal" class="text-tavern-textMuted group-hover:text-white" />
          </div>
          <h4 class="text-sm font-bold text-white mb-2">更新营业歌单</h4>
          <p class="text-xs text-tavern-textMuted line-clamp-2 mb-4">为营业时段自动拉取最新的推荐曲目并覆盖当前队列。</p>
          <div class="flex justify-between items-center mt-auto">
            <div class="flex -space-x-2">
              <div class="w-6 h-6 rounded-full bg-blue-600 border-2 border-tavern-card"></div>
            </div>
            <button @click="updatePlaylist" class="text-xs font-semibold text-tavern-textMuted bg-tavern-border hover:text-white px-3 py-1.5 rounded transition-colors">拉取新歌单</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Schedules Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div class="bg-tavern-dark border border-tavern-border rounded-2xl w-[800px] max-h-[80vh] flex flex-col shadow-2xl">
        <div class="p-6 border-b border-tavern-border flex justify-between items-center">
          <h2 class="text-xl font-bold text-white font-serif">编辑营业排班</h2>
          <button @click="showEditModal = false" class="text-tavern-textMuted hover:text-white"><Icon icon="mdi:close" class="w-6 h-6" /></button>
        </div>
        
        <div class="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          <div v-for="(sch, i) in editingSchedules" :key="sch.id" class="bg-tavern-card p-4 rounded-xl border border-tavern-border">
            <div class="flex justify-between items-center mb-4">
              <div class="text-sm font-bold text-tavern-accent">时段 {{ i + 1 }}</div>
            </div>
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-[10px] text-tavern-textMuted uppercase mb-1">开始时间</label>
                <input v-model="sch.startTime" type="time" class="w-full bg-tavern-dark border border-tavern-border rounded p-2 text-white text-sm outline-none focus:border-tavern-accent" />
              </div>
              <div>
                <label class="block text-[10px] text-tavern-textMuted uppercase mb-1">结束时间</label>
                <input v-model="sch.endTime" type="time" class="w-full bg-tavern-dark border border-tavern-border rounded p-2 text-white text-sm outline-none focus:border-tavern-accent" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label class="block text-[10px] text-tavern-textMuted uppercase mb-1">排班名称</label>
                <input v-model="sch.name" type="text" class="w-full bg-tavern-dark border border-tavern-border rounded p-2 text-white text-sm outline-none focus:border-tavern-accent" />
              </div>
              <div>
                <label class="block text-[10px] text-tavern-textMuted uppercase mb-1">网易云歌单 ID</label>
                <input v-model="sch.playlistId" type="number" class="w-full bg-tavern-dark border border-tavern-border rounded p-2 text-white text-sm outline-none focus:border-tavern-accent" />
              </div>
            </div>
            <div>
              <label class="block text-[10px] text-tavern-textMuted uppercase mb-1">描述</label>
              <input v-model="sch.description" type="text" class="w-full bg-tavern-dark border border-tavern-border rounded p-2 text-white text-sm outline-none focus:border-tavern-accent" />
            </div>
          </div>
        </div>
        
        <div class="p-6 border-t border-tavern-border flex justify-end space-x-4">
          <button @click="showEditModal = false" class="px-6 py-2 rounded-full text-sm font-semibold text-white bg-tavern-border hover:bg-tavern-textMuted transition-colors">取消</button>
          <button @click="saveSchedules" class="px-6 py-2 rounded-full text-sm font-semibold text-white bg-tavern-accent hover:bg-orange-600 transition-colors shadow-glow-accent">保存设置</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { Icon } from '@iconify/vue';
import { usePlayerStore } from '../stores/playerStore';
import { api_getPersonalizedPlaylists } from '../api';

const playerStore = usePlayerStore();
const now = ref(new Date());
let timer: number | null = null;

const showEditModal = ref(false);
const editingSchedules = ref<any[]>([]);
const audioDevices = ref<MediaDeviceInfo[]>([]);

const activeDeviceNames = computed(() => {
  const actives = audioDevices.value.filter(d => playerStore.activeDeviceIds.includes(d.deviceId));
  if (actives.length === 0) return '默认设备';
  return actives.map(d => d.label || '未知音频设备').join(' + ');
});

const openEditModal = () => {
  editingSchedules.value = JSON.parse(JSON.stringify(playerStore.schedules));
  showEditModal.value = true;
};

const saveSchedules = () => {
  playerStore.updateSchedules(editingSchedules.value);
  showEditModal.value = false;
};

onMounted(async () => {
  timer = window.setInterval(() => {
    now.value = new Date();
  }, 10000); // Check every 10 seconds

  // Fetch audio devices
  try {
    // Request permission if needed
    await navigator.mediaDevices.getUserMedia({ audio: true }).catch(() => {});
    const devices = await navigator.mediaDevices.enumerateDevices();
    audioDevices.value = devices.filter(d => d.kind === 'audiooutput');
    
    // Ensure default is always there if none found
    if (audioDevices.value.length === 0) {
      audioDevices.value = [{ deviceId: 'default', kind: 'audiooutput', label: '系统默认输出设备', groupId: '' } as MediaDeviceInfo];
    }
  } catch (e) {
    console.error('Failed to enumerate devices', e);
    audioDevices.value = [{ deviceId: 'default', kind: 'audiooutput', label: '系统默认输出设备', groupId: '' } as MediaDeviceInfo];
  }
});

onUnmounted(() => {
  if (timer) clearInterval(timer);
});

const toggleDevice = (deviceId: string) => {
  let active = [...playerStore.activeDeviceIds];
  if (active.includes(deviceId)) {
    active = active.filter(id => id !== deviceId);
  } else {
    active.push(deviceId);
  }
  
  if (active.length === 0) {
    active = ['default']; // fallback
  }
  
  playerStore.activeDeviceIds = active;
  // This will trigger the watch in playerStore to sync with AudioEngine
  if (playerStore.engine && (playerStore.engine as any).setSinkIds) {
    (playerStore.engine as any).setSinkIds(active);
  }
};

const triggerAtmosphere = (name: string, playlistIds: number[]) => {
  playerStore.activeAtmosphere = name;
  // Randomly pick one from the pool
  const randomId = playlistIds[Math.floor(Math.random() * playlistIds.length)];
  playerStore.playPlaylist(randomId);
};

const getScheduleStatus = (schedule: any) => {
  const currentMinutes = now.value.getHours() * 60 + now.value.getMinutes();
  const [startH, startM] = schedule.startTime.split(':').map(Number);
  const [endH, endM] = schedule.endTime.split(':').map(Number);
  
  const startMinutes = startH * 60 + startM;
  let endMinutes = endH * 60 + endM;
  if (endMinutes <= startMinutes) {
    endMinutes += 24 * 60; // Next day
  }
  
  let testMinutes = currentMinutes;
  if (testMinutes < startMinutes && endMinutes > 24 * 60) {
     testMinutes += 24 * 60;
  }
  
  if (testMinutes >= startMinutes && testMinutes < endMinutes) {
    return 'active';
  } else if (testMinutes >= endMinutes || (testMinutes < startMinutes && endMinutes < 24*60 && testMinutes > endMinutes)) {
    const normalizedCurrent = (testMinutes - startMinutes + 24 * 60) % (24 * 60);
    const normalizedEnd = endMinutes - startMinutes;
    
    if (normalizedCurrent < normalizedEnd) return 'active';
    if (normalizedCurrent >= normalizedEnd && normalizedCurrent < 12 * 60) return 'completed';
    return 'upcoming';
  }
  return 'upcoming';
};

const executeVinylNight = () => {
  playerStore.activeAtmosphere = '';
  playerStore.updateSettings({ audioQuality: 'lossless' });
  const vinylSchedule = playerStore.schedules.find(s => s.name === '黑胶之夜');
  if (vinylSchedule) {
    playerStore.playPlaylist(vinylSchedule.playlistId);
  }
};

const updatePlaylist = async () => {
  try {
    playerStore.activeAtmosphere = '';
    const data = await api_getPersonalizedPlaylists(1);
    if (data && data.length > 0) {
      playerStore.playPlaylist(data[0].id);
    }
  } catch(e) {
    console.error(e);
  }
};
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
