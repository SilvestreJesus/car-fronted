<template>
  <div class="fixed inset-0 bg-[#050505] overflow-hidden font-app antialiased text-white flex landscape-layout select-none">
    
    <!-- COLUMNA IZQUIERDA: TRACCIÓN (Solo botones) -->
    <div class="flex-1 flex flex-col justify-center items-center gap-6 border-r border-white/5 bg-gradient-to-r from-blue-900/10 to-transparent">
      <div class="flex flex-col gap-4">
        <button @touchstart="sendMove('F')" @touchend="sendMove('S')" class="btn-control w-24 h-24">
          <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8l-6 6h12l-6-6z"/></svg>
        </button>
        <button @touchstart="sendMove('B')" @touchend="sendMove('S')" class="btn-control w-24 h-24">
          <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 16l6-6H6l6 6z"/></svg>
        </button>
      </div>
      <p class="text-[10px] font-bold tracking-[0.3em] text-slate-500 uppercase">Tracción</p>
    </div>

    <!-- COLUMNA CENTRAL: ACELERÓMETRO HORIZONTAL + TELEMETRÍA -->
    <div class="flex-[1.5] flex flex-col p-4 justify-between items-center">
      
      <!-- BARRA SUPERIOR: ACELERÓMETRO Y CONTROLES -->
      <div class="w-full flex flex-col items-center gap-3">
        <!-- Slider Horizontal de Velocidad -->
        <div class="w-full max-w-md bg-[#161b22] p-3 rounded-2xl border border-white/5 flex items-center gap-4">
          <p class="text-[9px] font-black text-blue-500 uppercase tracking-tighter">Speed</p>
          <input type="range" v-model="velocidad" min="0" max="100" class="flex-1 accent-blue-500 h-2 cursor-pointer">
          <p class="text-xs font-mono font-bold w-8">{{ velocidad }}%</p>
        </div>

        <!-- Botones de Acciones y Conexión -->
        <div class="flex gap-2">
          <!-- Fix: Luces ahora se ponen blancas al activar -->
          <button @click="toggleLuces" 
                  :class="lucesOn ? 'bg-white text-black shadow-[0_0_20px_#fff]' : 'bg-[#161b22] text-slate-500 border-white/5'" 
                  class="w-11 h-11 rounded-xl flex items-center justify-center border transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          </button>
          
          <button @touchstart="playSonido" @touchend="stopSonido" 
                  :class="sonidoActive ? 'bg-white text-black shadow-[0_0_20px_#fff]' : 'bg-[#161b22] text-slate-500 border-white/5'"
                  class="w-11 h-11 rounded-xl flex items-center justify-center border transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
          </button>

          <div class="w-[2px] h-8 bg-white/10 mx-1 self-center"></div>

          <button @click="toggleWifi" :class="apiConnected ? 'text-blue-400 border-blue-400' : 'text-slate-600 border-white/5'" class="btn-status">
            <span class="text-[8px] font-bold">WIFI</span>
          </button>
          <button @click="conectarBluetooth" :class="btConnected ? 'text-blue-400 border-blue-400' : 'text-slate-600 border-white/5'" class="btn-status">
            <span class="text-[8px] font-bold">BT</span>
          </button>
        </div>
      </div>

      <!-- Telemetría -->
      <div class="bg-[#161b22]/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-5 w-full max-w-xs shadow-2xl">
        <div class="grid grid-cols-2 gap-3">
          <div v-for="(val, label) in telemetria" :key="label" class="bg-black/40 rounded-xl p-2 border border-white/5 text-center">
            <p class="text-[8px] text-slate-500 uppercase font-black">{{ label }}</p>
            <p class="text-lg font-mono font-bold leading-none mt-1">{{ val }}<span class="text-[8px] ml-1 text-blue-500/50">{{ unidades[label] }}</span></p>
          </div>
        </div>
      </div>

      <p class="text-[9px] font-black tracking-[0.4em] uppercase" :class="apiConnected ? 'text-blue-500' : 'text-red-500'">
        {{ apiConnected ? '● Online' : '○ Offline' }}
      </p>
    </div>

    <!-- COLUMNA DERECHA: DIRECCIÓN (Solo botones) -->
    <div class="flex-1 flex flex-col justify-center items-center gap-8 border-l border-white/5 bg-gradient-to-l from-blue-900/10 to-transparent">
      <div class="flex gap-4">
        <button @touchstart="sendMove('L')" @touchend="sendMove('S')" class="btn-control w-24 h-24">
          <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M10 18l-6-6 6-6v12z"/></svg>
        </button>
        <button @touchstart="sendMove('R')" @touchend="sendMove('S')" class="btn-control w-24 h-24">
          <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M14 18l6-6-6-6v12z"/></svg>
        </button>
      </div>
      <p class="text-[10px] font-bold tracking-[0.3em] text-slate-500 uppercase">Dirección</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import api from '@/services/api';

const velocidad = ref(80);
const apiConnected = ref(false);
const btConnected = ref(false);
const lucesOn = ref(false);
const sonidoActive = ref(false);
const telemetria = ref({ "Dist": 0, "Stop": 0, "Vel": 0, "Ping": 0 });
const unidades = { "Dist": "cm", "Stop": "cm", "Vel": "%", "Ping": "ms" };

const sendMove = (dir) => {
  if (navigator.vibrate) navigator.vibrate(30);
  console.log(`Acción: ${dir} | Potencia: ${velocidad.value}%`);
};

const toggleLuces = () => {
  lucesOn.value = !lucesOn.value;
  if (navigator.vibrate) navigator.vibrate(50);
};

const playSonido = () => sonidoActive.value = true;
const stopSonido = () => sonidoActive.value = false;

const conectarBluetooth = async () => {
  try {
    await navigator.bluetooth.requestDevice({ acceptAllDevices: true });
    btConnected.value = true;
  } catch (e) { 
    btConnected.value = false; 
  }
};

const toggleWifi = () => apiConnected.value = !apiConnected.value;

const fetchStatus = async () => {
  try {
    const res = await api.get(`/parametros/${localStorage.getItem('userToken')}`);
    telemetria.value = { "Dist": res.data.d_detectar, "Stop": res.data.d_frenar, "Vel": res.data.v_segura, "Ping": res.data.t_resp };
    apiConnected.value = true;
  } catch { apiConnected.value = false; }
};

let timer;
onMounted(() => { timer = setInterval(fetchStatus, 2000); });
onUnmounted(() => clearInterval(timer));
</script>

<style scoped>
@reference "../style.css";

.btn-control {
  @apply bg-[#161b22] border border-white/10 rounded-[2rem] flex items-center justify-center 
         transition-all duration-75 text-slate-400 active:scale-90 active:bg-white active:text-black;
}

.btn-status {
  @apply w-11 h-11 rounded-xl bg-[#161b22] border flex items-center justify-center transition-all;
}

@media screen and (orientation: portrait) {
  .landscape-layout {
    transform: rotate(90deg);
    transform-origin: bottom left;
    position: absolute;
    top: -100vw;
    left: 0;
    height: 100vw;
    width: 100vh;
  }
}

.select-none {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}
</style>