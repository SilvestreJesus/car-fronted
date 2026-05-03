<template>
  <!-- Contenedor forzado a horizontal con overflow oculto para evitar scroll -->
  <div class="fixed inset-0 bg-[#050505] bg-[radial-gradient(circle_at_center,_#0a192f_0%,_#050505_100%)] overflow-hidden font-app antialiased text-white p-4 flex flex-row gap-6">
    
    <!-- COLUMNA IZQUIERDA: D-PAD Y ACCIONES -->
    <div class="flex-1 flex flex-col justify-between py-4">
      <!-- Botones de Acción (Luces/Sonido) -->
      <div class="flex gap-4">
        <button @click="toggleLuces" :class="lucesOn ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.4)]' : 'bg-[#161b22] text-slate-500'" 
                class="w-12 h-12 rounded-2xl flex items-center justify-center transition-all active:scale-95 border border-white/5">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.674a1 1 0 00.908-.588l3.361-7.46a2 2 0 00-1.815-2.819H14.12a2 2 0 00-1.92 1.442l-1.07 4.116H7.13a2 2 0 00-1.896 2.634l1.523 4.512a2 2 0 001.896 1.363h1.01z" />
          </svg>
        </button>
        <button @touchstart="playSonido" @touchend="stopSonido" :class="sonidoActive ? 'bg-white text-black' : 'bg-[#161b22] text-slate-500'"
                class="w-12 h-12 rounded-2xl flex items-center justify-center transition-all border border-white/5">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        </button>
      </div>

      <!-- D-PAD (Control de manos/dedos) -->
      <div class="relative w-48 h-48 grid grid-cols-3 grid-rows-3 gap-2">
        <button @touchstart="sendMove('F')" @touchend="sendMove('S')" class="col-start-2 btn-control">
          <svg class="w-8 h-8 rotate-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8l-6 6h12l-6-6z"/></svg>
        </button>
        <button @touchstart="sendMove('L')" @touchend="sendMove('S')" class="row-start-2 col-start-1 btn-control">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M10 18l-6-6 6-6v12z"/></svg>
        </button>
        <button @touchstart="sendMove('R')" @touchend="sendMove('S')" class="row-start-2 col-start-3 btn-control">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M14 18l6-6-6-6v12z"/></svg>
        </button>
        <button @touchstart="sendMove('B')" @touchend="sendMove('S')" class="row-start-3 col-start-2 btn-control">
          <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 16l6-6H6l6 6z"/></svg>
        </button>
        <!-- Centro: Indicador de dirección en vivo -->
        <div class="row-start-2 col-start-2 flex items-center justify-center">
          <div :style="{ transform: `rotate(${carRotation}deg)` }" class="transition-transform duration-300">
            <img src="../assets/logo.png" class="w-12 h-12 object-contain filter drop-shadow-[0_0_8px_#3b82f6]" alt="Carro">
          </div>
        </div>
      </div>
    </div>

    <!-- COLUMNA CENTRAL: TELEMETRÍA -->
    <div class="flex-[0.8] flex flex-col justify-center gap-4">
      <div class="bg-[#161b22]/50 backdrop-blur-md border border-white/5 rounded-3xl p-4">
        <h3 class="text-center text-[10px] font-bold text-[#3b82f6] uppercase tracking-[0.2em] mb-4">Telemetría</h3>
        <div class="grid grid-cols-2 gap-3">
          <div v-for="(val, label) in telemetria" :key="label" class="bg-black/40 rounded-xl p-2 border border-white/5 text-center">
            <p class="text-[8px] text-slate-500 uppercase font-bold">{{ label }}</p>
            <p class="text-lg font-mono font-bold leading-none mt-1">{{ val }}<span class="text-[8px] ml-1 text-blue-400">{{ unidades[label] }}</span></p>
          </div>
        </div>
      </div>
      
      <!-- Estado de Conexión -->
      <div class="flex justify-center gap-6">
        <div :class="apiConnected ? 'text-blue-500' : 'text-red-500'" class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-current shadow-[0_0_8px_currentColor]"></div>
          <span class="text-[10px] font-bold uppercase tracking-widest">WiFi</span>
        </div>
        <div :class="btConnected ? 'text-blue-500' : 'text-slate-600'" class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-current shadow-[0_0_8px_currentColor]"></div>
          <span class="text-[10px] font-bold uppercase tracking-widest">BT</span>
        </div>
      </div>
    </div>

    <!-- COLUMNA DERECHA: VELOCIDAD Y SALIDA -->
    <div class="flex-1 flex flex-col items-end justify-between py-4">
      <button @click="router.push('/parametros')" class="bg-[#161b22] p-3 rounded-2xl hover:bg-white/10 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Control de Velocidad Vertical -->
      <div class="flex items-center gap-6 pr-4">
        <div class="flex flex-col items-center">
          <p class="text-[10px] font-bold text-blue-500 mb-4 vertical-text tracking-widest">THROTTLE</p>
          <input type="range" v-model="manualSpeed" min="0" max="100" class="vertical-range accent-blue-500">
          <p class="mt-4 font-mono text-xl font-bold">{{ manualSpeed }}%</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';

const router = useRouter();
const carRotation = ref(0);
const lucesOn = ref(false);
const sonidoActive = ref(false);
const manualSpeed = ref(80);
const apiConnected = ref(false);
const btConnected = ref(false);

const telemetria = ref({ "Dist": 0, "Stop": 0, "Vel": 0, "Ping": 0 });
const unidades = { "Dist": "cm", "Stop": "cm", "Vel": "%", "Ping": "ms" };

const sendMove = (dir) => {
  // Animación del coche en el centro
  const rotations = { 'F': 0, 'R': 90, 'B': 180, 'L': -90, 'S': carRotation.value };
  carRotation.value = rotations[dir];
  console.log(`Comando: ${dir}`);
};

const toggleLuces = () => {
  lucesOn.value = !lucesOn.value;
  // api.post('/control/luces', { estado: lucesOn.value });
};

const playSonido = () => sonidoActive.value = true;
const stopSonido = () => sonidoActive.value = false;

// Polling de datos
const fetchStatus = async () => {
  try {
    const res = await api.get(`/parametros/${localStorage.getItem('userToken')}`);
    telemetria.value = {
      "Dist": res.data.d_detectar,
      "Stop": res.data.d_frenar,
      "Vel": res.data.v_segura,
      "Ping": res.data.t_resp
    };
    apiConnected.value = true;
  } catch { apiConnected.value = false; }
};

let timer;
onMounted(() => {
  timer = setInterval(fetchStatus, 2000);
  // Sugerencia: Bloquear orientación si es posible vía Manifest o API
});
onUnmounted(() => clearInterval(timer));
</script>

<style scoped>
@reference "../../style.css";
/* Animación de botones de control */
.btn-control {
  @apply bg-[#161b22] border border-white/10 rounded-2xl flex items-center justify-center transition-all duration-75 text-slate-400;
}

.btn-control:active {
  @apply bg-white text-black scale-95 shadow-[0_0_25px_rgba(59,130,246,0.6)];
}

.vertical-range {
  -webkit-appearance: slider-vertical;
  width: 12px;
  height: 180px;
  background: #161b22;
  border-radius: 10px;
}

.vertical-text {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}

/* Forzar horizontal en dispositivos móviles */
@media screen and (orientation: portrait) {
  /* Opcional: Podrías rotar todo el body 90deg aquí si no quieres que el usuario lo haga */
}
</style>