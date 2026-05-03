<template>
  <div class="fixed inset-0 bg-[#050505] overflow-hidden font-app antialiased text-white flex landscape-layout select-none">
    
    <!-- COLUMNA IZQUIERDA: ACELERACIÓN Y SLIDER DE VELOCIDAD -->
    <div class="flex-1 flex flex-col justify-center items-center gap-4 border-r border-white/5 bg-gradient-to-r from-blue-900/10 to-transparent">
      <div class="flex items-center gap-8">
        <!-- Slider de Velocidad (Acelerómetro Manual) -->
        <div class="flex flex-col items-center gap-2">
          <p class="text-[8px] font-black text-blue-500 uppercase vertical-text">Power</p>
          <div class="relative w-12 h-48 bg-[#161b22] rounded-2xl border border-white/5 flex items-end p-1">
            <input 
              type="range" v-model="velocidad" min="0" max="100" 
              class="accent-blue-500 w-44 h-10 absolute -rotate-90 origin-center -translate-y-20 cursor-pointer"
            >
            <div class="w-full bg-blue-500/20 rounded-xl transition-all duration-300" :style="{ height: velocidad + '%' }"></div>
          </div>
          <p class="text-[10px] font-mono font-bold">{{ velocidad }}%</p>
        </div>

        <!-- Botones de Avance/Retroceso -->
        <div class="flex flex-col gap-4">
          <button @touchstart="sendMove('F')" @touchend="sendMove('S')" class="btn-control w-20 h-20">
            <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8l-6 6h12l-6-6z"/></svg>
          </button>
          <button @touchstart="sendMove('B')" @touchend="sendMove('S')" class="btn-control w-20 h-20">
            <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 16l6-6H6l6 6z"/></svg>
          </button>
        </div>
      </div>
      <p class="text-[10px] font-bold tracking-[0.3em] text-slate-500 uppercase mt-2">Tracción</p>
    </div>

    <!-- COLUMNA CENTRAL: TELEMETRÍA Y CONTROLES SUPERIORES -->
    <div class="flex-[1.2] flex flex-col p-4 justify-between items-center">
      <div class="flex gap-3 pt-2">
        <!-- Luces y Sonido integrados arriba -->
        <button @click="toggleLuces" :class="lucesOn ? 'bg-yellow-400 text-black' : 'bg-[#161b22] text-slate-500'" 
                class="w-12 h-12 rounded-xl flex items-center justify-center border border-white/5 transition-all">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
        </button>
        <button @touchstart="playSonido" @touchend="stopSonido" :class="sonidoActive ? 'bg-white text-black' : 'bg-[#161b22] text-slate-500'"
                class="w-12 h-12 rounded-xl flex items-center justify-center border border-white/5">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
        </button>
        <div class="w-px h-10 bg-white/10 mx-1"></div>
        <!-- Conexiones -->
        <button @click="toggleWifi" :class="apiConnected ? 'text-blue-400' : 'text-slate-600'" class="btn-mini-status">
          <span class="text-[7px] font-black">WIFI</span>
        </button>
        <button @click="conectarBluetooth" :class="btConnected ? 'text-blue-400' : 'text-slate-600'" class="btn-mini-status">
          <span class="text-[7px] font-black">BT</span>
        </button>
      </div>

      <!-- Telemetría Dinámica -->
      <div class="bg-[#161b22]/50 backdrop-blur-xl border border-white/10 rounded-[2rem] p-5 w-full max-w-xs shadow-2xl">
        <div class="grid grid-cols-2 gap-3">
          <div v-for="(val, label) in telemetria" :key="label" class="bg-black/40 rounded-xl p-2 border border-white/5 text-center">
            <p class="text-[8px] text-slate-500 uppercase font-black">{{ label }}</p>
            <p class="text-lg font-mono font-bold leading-none mt-1">{{ val }}<span class="text-[8px] ml-1 text-blue-500/50">{{ unidades[label] }}</span></p>
          </div>
        </div>
      </div>

      <p class="text-[9px] font-black tracking-[0.4em] uppercase text-blue-500/80 animate-pulse">
        System Ready
      </p>
    </div>

    <!-- COLUMNA DERECHA: DIRECCIÓN -->
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

const velocidad = ref(50);
const apiConnected = ref(false);
const btConnected = ref(false);
const lucesOn = ref(false);
const sonidoActive = ref(false);
const telemetria = ref({ "Dist": 0, "Stop": 0, "Vel": 0, "Ping": 0 });
const unidades = { "Dist": "cm", "Stop": "cm", "Vel": "%", "Ping": "ms" };

const sendMove = (dir) => {
  if (navigator.vibrate) navigator.vibrate(30);
  console.log(`Enviando Comando: ${dir} | Potencia: ${velocidad.value}%`);
  // Aquí concatenas la velocidad con la dirección para el ESP32
};

const conectarBluetooth = async () => {
  try {
    const device = await navigator.bluetooth.requestDevice({ acceptAllDevices: true });
    btConnected.value = true;
  } catch (e) { btConnected.value = false; }
};

// ... resto de funciones de luces, sonido y fetchStatus igual que antes
</script>

<style scoped>
@reference "../style.css";

.btn-control {
  @apply bg-[#161b22] border border-white/10 rounded-3xl flex items-center justify-center 
         transition-all duration-75 text-slate-400 active:scale-90 active:bg-white active:text-black;
}

.btn-mini-status {
  @apply w-12 h-12 rounded-xl bg-[#161b22] border border-white/5 flex items-center justify-center transition-all;
}

.vertical-text { writing-mode: vertical-lr; }

/* Estilos personalizados para el input range vertical */
input[type=range] {
  -webkit-appearance: none;
  background: transparent;
}
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 24px;
  width: 24px;
  border-radius: 50%;
  background: #ffffff;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(59,130,246,0.8);
  margin-top: -8px;
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
</style>