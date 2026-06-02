<template>
  <div class="h-screen w-screen bg-[#111111] text-white flex overflow-hidden font-sans">
    
    <!-- Left Navigation -->
    <aside class="w-64 bg-[#161616] border-r border-white/5 flex flex-col justify-between py-8 px-6 shrink-0">
      <div>
        <div class="flex items-center space-x-3 mb-12 cursor-pointer" @click="$router.push('/browse')">
          <h1 class="text-2xl font-bold font-serif text-[#FF4B4B] tracking-wide">Tavern Soul</h1>
        </div>
        
        <nav class="space-y-2">
          <router-link to="/console" class="flex items-center space-x-4 px-4 py-3 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            <Icon icon="mdi:view-dashboard-outline" class="w-5 h-5" />
            <span class="text-sm font-medium">控制台</span>
          </router-link>
          <router-link to="/browse" class="flex items-center space-x-4 px-4 py-3 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            <Icon icon="mdi:library-music-outline" class="w-5 h-5" />
            <span class="text-sm font-medium">音乐库</span>
          </router-link>
          <router-link to="/playlists" class="flex items-center space-x-4 px-4 py-3 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            <Icon icon="mdi:playlist-music-outline" class="w-5 h-5" />
            <span class="text-sm font-medium">歌单</span>
          </router-link>
          <router-link to="/player" class="flex items-center space-x-4 px-4 py-3 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors">
            <Icon icon="mdi:microphone-variant" class="w-5 h-5" />
            <span class="text-sm font-medium">沉浸歌词</span>
          </router-link>
        </nav>
      </div>
      
      <div class="space-y-2">
        <button class="w-full flex items-center space-x-4 px-4 py-3 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-colors text-left">
          <Icon icon="mdi:help-circle-outline" class="w-5 h-5" />
          <span class="text-sm font-medium">帮助与支持</span>
        </button>
        <button @click="authStore.logout()" class="w-full flex items-center space-x-4 px-4 py-3 rounded-lg text-white/60 hover:text-[#FF4B4B] hover:bg-[#FF4B4B]/10 transition-colors text-left">
          <Icon icon="mdi:logout" class="w-5 h-5" />
          <span class="text-sm font-medium">退出登录</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto overflow-x-hidden relative custom-scrollbar">
      <!-- Background subtle red glow -->
      <div class="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FF4B4B]/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div class="max-w-4xl mx-auto py-12 px-12">
        
        <header class="mb-10">
          <h1 class="text-3xl font-bold mb-2">设置</h1>
          <p class="text-white/50 text-sm">管理清吧的听觉氛围与技术首选项。</p>
        </header>

        <div class="space-y-6">
          
          <!-- Identity Card -->
          <div class="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 flex items-center space-x-6 hover:border-white/10 transition-colors">
            <div class="w-24 h-24 bg-[#FF4B4B] rounded-xl flex flex-col items-center justify-center text-white shadow-lg shadow-[#FF4B4B]/20">
              <Icon icon="mdi:music-note" class="w-10 h-10 mb-1" />
              <span class="text-[10px] font-bold">TAVERN TUNE</span>
            </div>
            <div class="flex-1">
              <h2 class="text-xl font-bold mb-1">Tavern Soul 身份标识</h2>
              <p class="text-sm text-white/50 mb-4">更新您的清吧标识并连接流媒体账户。</p>
              <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-2 bg-black/40 border border-white/10 px-4 py-2 rounded-full text-xs font-bold text-white/80">
                  <div class="w-2 h-2 rounded-full" :class="authStore.isLoggedIn ? 'bg-green-500' : 'bg-red-500'"></div>
                  <span>{{ authStore.isLoggedIn ? '网易云已连接' : '未连接网易云' }}</span>
                </div>
                <button @click="authStore.showLoginModal = true" class="bg-[#FF4B4B] hover:bg-[#ff3333] text-white px-5 py-2 rounded-full text-xs font-bold transition-colors">
                  切换账号
                </button>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <!-- Playback Card -->
            <div class="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
              <h3 class="text-lg font-bold mb-6 flex items-center">
                <Icon icon="mdi:play-circle-outline" class="mr-2 text-[#FF4B4B]" /> 播放设置
              </h3>
              
              <div class="space-y-6">
                <div>
                  <div class="flex justify-between items-end mb-2">
                    <span class="text-sm font-medium">默认交叉淡入淡出</span>
                    <span class="text-sm font-bold text-[#FF4B4B]">{{ crossfadeDuration }}s</span>
                  </div>
                  <input type="range" v-model="crossfadeDuration" min="0" max="10" step="1" class="w-full accent-[#FF4B4B] h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                  <p class="text-[10px] text-white/40 mt-2">在清吧神曲之间实现平滑过渡。</p>
                </div>
                
                <div class="flex items-center justify-between pt-4 border-t border-white/5">
                  <div>
                    <div class="text-sm font-medium">启动时自动恢复</div>
                    <div class="text-[10px] text-white/40 mt-1">控制台启动时立即开始播放音乐。</div>
                  </div>
                  <div class="w-10 h-5 bg-[#FF4B4B] rounded-full relative cursor-pointer shadow-inner">
                    <div class="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Audio Output Card -->
            <div class="bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
              <h3 class="text-lg font-bold mb-6 flex items-center">
                <Icon icon="mdi:speaker-wireless" class="mr-2 text-[#FF4B4B]" /> 音频输出
              </h3>
              
              <div class="space-y-6">
                <div>
                  <div class="text-sm font-medium mb-3">扬声器同步 (多设备输出)</div>
                  <div class="text-xs text-white/40 mb-3">物理设备的同步组网已迁移至控制台实时管理。</div>
                  <button @click="$router.push('/console')" class="bg-black/40 border border-white/10 hover:border-[#FF4B4B]/50 hover:text-[#FF4B4B] px-4 py-2 rounded-lg text-xs font-semibold text-white/60 transition-colors flex items-center">
                    <Icon icon="mdi:speaker-multiple" class="mr-2 w-4 h-4" />
                    前往控制台配置设备
                  </button>
                </div>
                
                <div class="pt-2">
                  <div class="text-sm font-medium mb-3">输出音质</div>
                  <div class="flex space-x-2">
                    <button @click="audioQuality = 'standard'" class="flex-1 py-2 rounded-lg text-[10px] font-bold tracking-wider transition-colors border" :class="audioQuality === 'standard' ? 'bg-[#FF4B4B]/10 text-[#FF4B4B] border-[#FF4B4B]' : 'bg-transparent border-white/10 text-white/40 hover:text-white'">STANDARD</button>
                    <button @click="audioQuality = 'higher'" class="flex-1 py-2 rounded-lg text-[10px] font-bold tracking-wider transition-colors border" :class="audioQuality === 'higher' ? 'bg-[#FF4B4B]/10 text-[#FF4B4B] border-[#FF4B4B]' : 'bg-transparent border-white/10 text-white/40 hover:text-white'">HIGHER</button>
                    <button @click="audioQuality = 'exhigh'" class="flex-1 py-2 rounded-lg text-[10px] font-bold tracking-wider transition-colors border" :class="audioQuality === 'exhigh' ? 'bg-[#FF4B4B]/10 text-[#FF4B4B] border-[#FF4B4B]' : 'bg-transparent border-white/10 text-white/40 hover:text-white'">LOSSLESS</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-12 gap-6">
            <!-- Big Screen Experience Card -->
            <div class="col-span-8 bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors flex">
              <div class="flex-1 pr-8">
                <h3 class="text-lg font-bold mb-6 flex items-center">
                  <Icon icon="mdi:television-clean" class="mr-2 text-[#FF4B4B]" /> 大屏沉浸体验
                </h3>
                
                <div class="space-y-6">
                  <div>
                    <div class="flex justify-between items-center mb-3">
                      <span class="text-sm font-medium">歌词字号</span>
                    </div>
                    <div class="flex items-center space-x-4">
                      <span class="text-xs font-serif">A</span>
                      <input type="range" min="1" max="5" value="4" class="flex-1 accent-[#FF4B4B] h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                      <span class="text-xl font-serif">A</span>
                    </div>
                  </div>
                  
                  <div class="flex items-center justify-between pt-4 border-t border-white/5">
                    <div>
                      <div class="text-sm font-medium">KTV 跟唱模式</div>
                      <div class="text-[10px] text-white/40 mt-1">开启歌词逐字高亮与节拍追踪。</div>
                    </div>
                    <div class="w-10 h-5 bg-white/10 rounded-full relative cursor-pointer">
                      <div class="absolute left-1 top-1 w-3 h-3 bg-white/50 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="w-48 bg-black/50 rounded-xl border border-white/5 flex flex-col items-center justify-center p-4">
                <h4 class="text-lg font-serif font-bold text-white mb-1 shadow-glow-accent/20 text-center">Lyrics Preview</h4>
                <div class="text-[10px] text-white/40">动效强度: 高</div>
              </div>
            </div>

            <!-- Duty Shift Card -->
            <div class="col-span-4 bg-[#1A1A1A] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition-colors">
              <h3 class="text-lg font-bold mb-5 flex items-center">
                <Icon icon="mdi:calendar-clock-outline" class="mr-2 text-[#FF4B4B]" /> 排班计划
              </h3>
              
              <div class="bg-black/40 rounded-xl p-4 border border-white/5 mb-4">
                <div class="text-[9px] font-bold text-[#FF4B4B] uppercase tracking-wider mb-2">Automated Schedule</div>
                <p class="text-xs text-white/60 leading-relaxed">营业时段排班与氛围歌单自动化调度系统，现已升级为实时动态控制面板。</p>
              </div>
              
              <button @click="$router.push('/console')" class="w-full py-2.5 rounded-lg border border-white/10 text-xs font-semibold text-white/60 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-center">
                <Icon icon="mdi:home-clock" class="mr-2 w-4 h-4" /> 进入调度台
              </button>
            </div>
          </div>
          
        </div>

        <!-- Footer Actions -->
        <div class="mt-12 pt-6 border-t border-white/5 flex items-center justify-between">
          <div class="text-[10px] font-bold text-white/30 uppercase tracking-widest">
            上次同步: 2 分钟前
          </div>
          <div class="flex space-x-4">
            <button class="px-6 py-2.5 rounded-lg text-sm font-bold text-white/60 border border-white/10 hover:text-white hover:bg-white/5 transition-colors">
              重置默认
            </button>
            <button @click="saveSettings" class="px-6 py-2.5 rounded-lg text-sm font-bold bg-[#FF4B4B] hover:bg-[#ff3333] text-white transition-colors shadow-lg shadow-[#FF4B4B]/20">
              保存设置
            </button>
          </div>
        </div>
        
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from '@iconify/vue';
import { usePlayerStore } from '../stores/playerStore';
import { useAuthStore } from '../stores/authStore';

const playerStore = usePlayerStore();
const authStore = useAuthStore();

// Clone for local editing
const crossfadeDuration = ref(playerStore.crossfadeDuration);
const audioQuality = ref(playerStore.audioQuality);

const saveSettings = () => {
  playerStore.updateSettings({ 
    crossfadeDuration: crossfadeDuration.value,
    audioQuality: audioQuality.value 
  });
  // Navigate back or show toast
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
  background: #333;
  border-radius: 4px;
}
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 12px;
  width: 12px;
  border-radius: 50%;
  background: #FF4B4B;
  cursor: pointer;
  margin-top: -4px;
}
input[type=range]::-webkit-slider-runnable-track {
  width: 100%;
  height: 4px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}
</style>
