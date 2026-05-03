<template>
  <!-- Contenedor forzado a horizontal: Se rota 90deg si el cel está en vertical -->
  <div class="fixed inset-0 bg-[#050505] overflow-hidden font-app antialiased text-white flex landscape-layout select-none">
    
    <!-- COLUMNA IZQUIERDA: ACELERACIÓN (Arriba / Abajo) -->
    <div class="flex-1 flex flex-col justify-center items-center gap-8 border-r border-white/5 bg-gradient-to-r from-blue-900/10 to-transparent">
      <div class="flex flex-col gap-4">
        <button @touchstart="sendMove('F')" @touchend="sendMove('S')" class="btn-control w-24 h-24">
          <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8l-6 6h12l-6-6z"/></svg>
        </button>
        <button @touchstart="sendMove('B')" @touchend="sendMove('S')" class="btn-control w-24 h-24">
          <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 16l6-6H6l6 6z"/></svg>
        </button>
      </div>
      <p class="text-[10px] font-bold tracking-[0.3em] text-slate-500 uppercase">Aceleración</p>
    </div>

    <!-- COLUMNA CENTRAL: TELEMETRÍA Y ESTADOS -->
    <div class="flex-[1.2] flex flex-col p-4 justify-between items-center">
      <!-- Header: Conexiones rápidas -->
      <div class="flex gap-6 pt-2">
        <button @click="toggleWifi" :class="apiConnected ? 'text-blue-500 border-blue-500/50' : 'text-slate-600 border-white/5'" 
                class="flex flex-col items-center gap-1 border rounded-xl px-4 py-2 bg-[#161b22]">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/></svg>
          <span class="text-[8px] font-bold uppercase">WiFi</span>
        </button>
        
        <button @click="toggleBT" :class="btConnected ? 'text-blue-500 border-blue-500/50' : 'text-slate-600 border-white/5'" 
                class="flex flex-col items-center gap-1 border rounded-xl px-4 py-2 bg-[#161b22]">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7l10 10M17 7l-10 10M12 3v18"/></svg>
          <span class="text-[8px] font-bold uppercase">BT</span>
        </button>
      </div>

      <!-- Panel de Telemetría (Datos del ESP32) -->
      <div class="bg-[#161b22]/50 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 w-full max-w-xs shadow-2xl">
        <h3 class="text-center text-[10px] font-black text-blue-500 uppercase tracking-[.25em] mb-6">Xolo-Bot Telemetry</h3>
        <div class="grid grid-cols-2 gap-4">
          <div v-for="(val, label) in telemetria" :key="label" class="bg-black/40 rounded-2xl p-3 border border-white/5 text-center">
            <p class="text-[9px] text-slate-500 uppercase font-bold">{{ label }}</p>
            <p class="text-xl font-mono font-bold leading-none mt-1">{{ val }}<span class="text-[9px] ml-1 text-blue-400/50">{{ unidades[label] }}</span></p>
          </div>
        </div>
      </div>

      <!-- Status Message -->
      <div class="pb-2 text-center">
        <p class="text-[10px] font-bold tracking-widest uppercase" :class="apiConnected ? 'text-blue-400' : 'text-red-500'">
          ● {{ apiConnected ? 'Conectado a la API' : 'Sistema Desconectado' }}
        </p>
      </div>
    </div>

    <!-- COLUMNA DERECHA: DIRECCIÓN (Izquierda / Derecha) -->
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

const apiConnected = ref(false);
const btConnected = ref(false);
const telemetria = ref({ "Dist": 0, "Stop": 0, "Vel": 0, "Ping": 0 });
const unidades = { "Dist": "cm", "Stop": "cm", "Vel": "%", "Ping": "ms" };

const sendMove = (dir) => {
  if (navigator.vibrate) navigator.vibrate(40);
  console.log(`Enviando a ESP32: ${dir}`);
  // Aquí va tu lógica de axios para mover el carro
};

const toggleWifi = () => apiConnected.value = !apiConnected.value;
const toggleBT = () => btConnected.value = !btConnected.value;

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
onMounted(() => { timer = setInterval(fetchStatus, 2000); });
onUnmounted(() => clearInterval(timer));
</script>

<style scoped>
@reference "@/style.css";

.btn-control {
  @apply bg-[#161b22] border border-white/10 rounded-[2rem] flex items-center justify-center 
         transition-all duration-75 text-slate-400 active:scale-90 active:bg-white active:text-black 
         active:shadow-[0_0_40px_rgba(59,130,246,0.5)];
}

/* Forzar Horizontal */
@media screen and (orientation: portrait) {
  .landscape-layout {
    transform: rotate(90deg);
    transform-origin: bottom left;
    position: absolute;
    top: -100vw;
    left: 0;
    height: 100vw;
    width: 100vh;
    overflow: hidden;
  }
}

.select-none {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}
</style>