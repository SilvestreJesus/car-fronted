<template>
  <div class="min-h-screen bg-[#050505] bg-[radial-gradient(circle_at_center,_#0a192f_0%,_#050505_100%)] p-6 font-app antialiased text-white flex flex-col items-center">
    
    <!-- Header con Estado de Conexión -->
    <div class="w-full max-w-md flex justify-between items-center mb-6">
      <button @click="router.push('/parametros')" class="p-2 hover:bg-white/10 rounded-full transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <div class="flex gap-4">
        <!-- Indicador WiFi (API) -->
        <div :class="apiConnected ? 'text-[#3b82f6]' : 'text-red-500'" class="flex flex-col items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a10.5 10.5 0 0114.142 0M1.414 8.414a15.5 15.5 0 0121.172 0" />
          </svg>
          <span class="text-[8px] font-bold uppercase tracking-tighter">WiFi</span>
        </div>
        <!-- Indicador Bluetooth -->
        <button @click="toggleBluetooth" :class="btConnected ? 'text-[#3b82f6]' : 'text-slate-500'" class="flex flex-col items-center transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7l10 10M7 17L17 7M12 3v18" />
          </svg>
          <span class="text-[8px] font-bold uppercase tracking-tighter">BT</span>
        </button>
      </div>
    </div>

    <!-- Info del Equipo -->
    <div class="text-center mb-8">
      <div class="w-20 h-20 bg-[#161b22] rounded-full mx-auto mb-3 border border-white/10 p-1 flex items-center justify-center">
        <img src="/logo-carro.png" class="w-14 h-14 object-contain" alt="Logo">
      </div>
      <h2 class="text-2xl font-bold tracking-tighter">{{ equipoNombre }}</h2>
      <p class="text-[10px] font-mono text-slate-500 tracking-widest uppercase">{{ token }}</p>
    </div>

    <!-- Telemetría en Tiempo Real -->
    <div class="w-full max-w-sm bg-[#161b22]/50 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 mb-8">
      <h3 class="text-center text-[10px] font-bold text-[#3b82f6] uppercase tracking-[0.2em] mb-6">Parámetros Tiempo Real</h3>
      <div class="grid grid-cols-2 gap-4 text-center">
        <div v-for="(val, label) in telemetria" :key="label" class="bg-black/40 rounded-2xl p-3 border border-white/5">
          <p class="text-[9px] text-slate-500 uppercase font-bold mb-1">{{ label }}</p>
          <p class="text-xl font-mono font-bold">{{ val }}<span class="text-[10px] ml-1 text-[#3b82f6]">{{ unidades[label] }}</span></p>
        </div>
      </div>
    </div>

    <!-- Controles del Carro -->
    <div class="w-full max-w-sm px-4">
      <h3 class="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-10">Controles Flota</h3>
      
      <div class="relative h-64 w-full flex items-center justify-center">
        <!-- Pad Direccional -->
        <div class="absolute left-0 grid grid-cols-3 gap-2">
          <div class="col-start-2">
            <button @touchstart="sendMove('F')" @touchend="sendMove('S')" class="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-black active:scale-90 transition-transform shadow-lg shadow-blue-500/20">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8l-6 6h12l-6-6z"/></svg>
            </button>
          </div>
          <div class="row-start-2 col-start-1">
            <button @touchstart="sendMove('L')" @touchend="sendMove('S')" class="w-14 h-14 bg-[#161b22] border border-white/10 rounded-xl flex items-center justify-center active:scale-90 transition-transform">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M10 18l-6-6 6-6v12z"/></svg>
            </button>
          </div>
          <div class="row-start-2 col-start-2">
            <div class="w-14 h-14 bg-blue-500/10 rounded-full border border-blue-500/30 flex items-center justify-center">
              <div class="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
            </div>
          </div>
          <div class="row-start-2 col-start-3">
            <button @touchstart="sendMove('R')" @touchend="sendMove('S')" class="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-black active:scale-90 transition-transform">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M14 18l6-6-6-6v12z"/></svg>
            </button>
          </div>
          <div class="row-start-3 col-start-2">
            <button @touchstart="sendMove('B')" @touchend="sendMove('S')" class="w-14 h-14 bg-[#161b22] border border-white/10 rounded-xl flex items-center justify-center active:scale-90 transition-transform">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 16l6-6H6l6 6z"/></svg>
            </button>
          </div>
        </div>

        <!-- Slider de Velocidad Vertical -->
        <div class="absolute right-0 flex flex-col items-center gap-4">
           <p class="text-[9px] font-bold text-blue-500 vertical-text">VELOCIDAD</p>
           <input type="range" v-model="manualSpeed" min="0" max="100" class="vertical-range accent-blue-500">
           <span class="font-mono text-sm">{{ manualSpeed }}%</span>
        </div>
      </div>
    </div>

    <!-- Estado Inferior -->
    <div class="mt-auto pb-4 text-center">
      <div class="flex items-center gap-2 justify-center">
        <div :class="apiConnected || btConnected ? 'bg-green-500' : 'bg-red-500'" class="w-2 h-2 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
        <p class="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          {{ apiConnected || btConnected ? 'Sistema En Línea' : 'Sistema Desconectado' }}
        </p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';

const router = useRouter();
const equipoNombre = ref(localStorage.getItem('userName') || 'Xolo-Bot');
const token = ref(localStorage.getItem('userToken') || '---');

// Estados de conexión
const apiConnected = ref(false);
const btConnected = ref(false);
const manualSpeed = ref(80);

// Datos simulando tiempo real
const telemetria = ref({
  "Detección": 0,
  "Frenado": 0,
  "Velocidad": 0,
  "Respuesta": 0
});

const unidades = {
  "Detección": "cm",
  "Frenado": "cm",
  "Velocidad": "%",
  "Respuesta": "ms"
};

// Función para obtener datos de la API (polling)
const fetchRealTimeData = async () => {
  try {
    const res = await api.get(`/parametros/${token.value}`);
    telemetria.value["Detección"] = res.data.d_detectar;
    telemetria.value["Frenado"] = res.data.d_frenar;
    telemetria.value["Velocidad"] = res.data.v_segura;
    telemetria.value["Respuesta"] = res.data.t_resp;
    apiConnected.ref = true;
  } catch (error) {
    apiConnected.value = false;
  }
};

let intervalId;
onMounted(() => {
  fetchRealTimeData();
  intervalId = setInterval(fetchRealTimeData, 3000); // Actualiza cada 3 seg
});

onUnmounted(() => clearInterval(intervalId));

// Bluetooth (Lógica simplificada para Web Bluetooth API)
const toggleBluetooth = async () => {
  if (btConnected.value) {
    btConnected.value = false;
    return;
  }
  try {
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['0000ffe0-0000-1000-8000-00805f9b34fb'] // Ejemplo UUID HM-10
    });
    btConnected.value = true;
    console.log("Conectado a:", device.name);
  } catch (err) {
    console.log("BT cancelado o no soportado");
  }
};

// Enviar comandos de movimiento
const sendMove = (dir) => {
  console.log(`Enviando comando: ${dir} con velocidad ${manualSpeed.value}`);
  // Aquí podrías enviar por Bluetooth si está conectado:
  // characteristic.writeValue(new TextEncoder().encode(dir));
};

const handleLogout = () => {
  localStorage.clear();
  router.push('/');
};
</script>

<style scoped>
.font-app { font-family: 'Inter', sans-serif !important; }
.animate-fade-in { animation: fadeIn 0.6s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

/* Slider Vertical */
.vertical-range {
  writing-mode: bt-lr; /* Firefox */
  -webkit-appearance: slider-vertical; /* Webkit */
  width: 8px;
  height: 150px;
  padding: 0 5px;
}

.vertical-text {
  writing-mode: vertical-rl;
  transform: rotate(180deg);
}

/* Efectos de botones */
button:active {
  transform: scale(0.9);
}
</style>