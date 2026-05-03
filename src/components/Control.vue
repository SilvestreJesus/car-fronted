<template>
  <div class="fixed inset-0 bg-[#050505] overflow-hidden font-app antialiased text-white flex landscape-layout select-none">
    
    <!-- BARRA DE NAVEGACIÓN SUPERIOR (Botones de Sistema) -->
    <div class="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-50">
      <!-- Regresar -->
      <button @click="regresar" class="btn-system group">
        <svg class="w-6 h-6 transition-transform group-active:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        <span class="text-[10px] font-bold uppercase tracking-tighter">Volver</span>
      </button>

      <!-- Cerrar Sesión -->
      <button @click="logout" class="btn-system border-red-500/20 hover:bg-red-500/10 text-red-500/80">
        <span class="text-[10px] font-bold uppercase tracking-tighter">Cerrar Sesión</span>
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
        </svg>
      </button>
    </div>

    <!-- COLUMNA IZQUIERDA: TRACCIÓN -->
    <div class="flex-1 flex flex-col justify-center items-center gap-6 border-r border-white/5 bg-gradient-to-r from-blue-900/10 to-transparent">
      <div class="flex flex-col gap-4 mt-12">
        <button @touchstart="sendMove('F')" @touchend="sendMove('S')" class="btn-control w-24 h-24">
          <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8l-6 6h12l-6-6z"/></svg>
        </button>
        <button @touchstart="sendMove('B')" @touchend="sendMove('S')" class="btn-control w-24 h-24">
          <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 16l6-6H6l6 6z"/></svg>
        </button>
      </div>
      <p class="text-[10px] font-bold tracking-[0.3em] text-slate-500 uppercase">Tracción</p>
    </div>

    <!-- COLUMNA CENTRAL: ACELERÓMETRO + TELEMETRÍA -->
    <div class="flex-[1.5] flex flex-col p-4 justify-end items-center pb-8">
      
      <div class="w-full flex flex-col items-center gap-4 mb-8">
        <!-- Slider Horizontal de Velocidad -->
        <div class="w-full max-w-md bg-[#161b22] p-3 rounded-2xl border border-white/5 flex items-center gap-4 shadow-xl">
          <p class="text-[9px] font-black text-blue-500 uppercase">Speed</p>
          <input type="range" v-model="velocidad" min="0" max="100" class="flex-1 accent-blue-500 h-2 cursor-pointer">
          <p class="text-xs font-mono font-bold w-10">{{ velocidad }}%</p>
        </div>

        <!-- Botones de Acciones y Conexión -->
        <div class="flex gap-3">
          <button @click="toggleLuces" 
                  :class="lucesOn ? 'bg-white text-black shadow-[0_0_20px_#fff]' : 'bg-[#161b22] text-slate-500 border-white/5'" 
                  class="w-12 h-12 rounded-2xl flex items-center justify-center border transition-all">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          </button>
          
          <button @touchstart="playSonido" @touchend="stopSonido" 
                  :class="sonidoActive ? 'bg-white text-black shadow-[0_0_20px_#fff]' : 'bg-[#161b22] text-slate-500 border-white/5'"
                  class="w-12 h-12 rounded-2xl flex items-center justify-center border transition-all">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
          </button>

          <div class="w-[1px] h-10 bg-white/10 mx-2 self-center"></div>

          <button @click="toggleWifi" :class="apiConnected ? 'text-blue-400 border-blue-400' : 'text-slate-600 border-white/5'" class="btn-status">
            <span class="text-[9px] font-black">WIFI</span>
          </button>
          <button @click="conectarBluetooth" :class="btConnected ? 'text-blue-400 border-blue-400' : 'text-slate-600 border-white/5'" class="btn-status">
            <span class="text-[9px] font-black">BT</span>
          </button>
        </div>
      </div>

      <!-- Telemetría -->
      <div class="bg-[#161b22]/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 w-full max-w-sm shadow-2xl">
        <div class="grid grid-cols-2 gap-4">
          <div v-for="(val, label) in telemetria" :key="label" class="bg-black/60 rounded-2xl p-3 border border-white/5 text-center">
            <p class="text-[9px] text-slate-500 uppercase font-black tracking-widest">{{ label }}</p>
            <p class="text-xl font-mono font-bold leading-none mt-1">{{ val }}<span class="text-[9px] ml-1 text-blue-500/50">{{ unidades[label] }}</span></p>
          </div>
        </div>
      </div>
    </div>

    <!-- COLUMNA DERECHA: DIRECCIÓN -->
    <div class="flex-1 flex flex-col justify-center items-center gap-8 border-l border-white/5 bg-gradient-to-l from-blue-900/10 to-transparent">
      <div class="flex gap-4 mt-12">
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
import { useRouter } from 'vue-router';
import api from '@/services/api';

const router = useRouter();
const velocidad = ref(80);
const apiConnected = ref(false);
const btConnected = ref(false);
const lucesOn = ref(false);
const sonidoActive = ref(false);
const telemetria = ref({ "Dist": 0, "Stop": 0, "Vel": 0, "Ping": 0 });
const unidades = { "Dist": "cm", "Stop": "cm", "Vel": "%", "Ping": "ms" };

// Funciones de Navegación
const regresar = () => {
  router.back();
};

const logout = () => {
  if(confirm("¿Estás seguro de que deseas cerrar sesión?")) {
    localStorage.clear(); // Limpia token y datos
    router.push('/login'); // Ajusta la ruta a tu vista de login
  }
};

const sendMove = (dir) => {
  if (navigator.vibrate) navigator.vibrate(30);
  console.log(`Comando: ${dir} | Potencia: ${velocidad.value}%`);
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
  } catch (e) { btConnected.value = false; }
};

const toggleWifi = () => apiConnected.value = !apiConnected.value;

const fetchStatus = async () => {
  try {
    const res = await api.get(`/parametros/${localStorage.getItem('userToken')}`);
    telemetria.value = { 
      "Dist": res.data.d_detectar || 0, 
      "Stop": res.data.d_frenar || 0, 
      "Vel": res.data.v_segura || 0, 
      "Ping": res.data.t_resp || 0 
    };
    apiConnected.value = true;
  } catch { 
    apiConnected.value = false; 
  }
};

let timer;
onMounted(() => { timer = setInterval(fetchStatus, 2000); });
onUnmounted(() => clearInterval(timer));
</script>

<style scoped>
@reference "../style.css";

.btn-system {
  @apply bg-[#161b22]/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl
         flex items-center gap-3 transition-all active:scale-95;
}

.btn-control {
  @apply bg-[#161b22] border border-white/10 rounded-[2.5rem] flex items-center justify-center 
         transition-all duration-75 text-slate-400 active:scale-90 active:bg-white active:text-black;
}

.btn-status {
  @apply w-12 h-12 rounded-2xl bg-[#161b22] border flex items-center justify-center transition-all;
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