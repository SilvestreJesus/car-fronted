<template>
  <div class="fixed inset-0 bg-[#050505] overflow-hidden font-app antialiased text-white flex landscape-layout select-none">
    
    <!-- BOTONES DE SISTEMA -->
    <div class="absolute top-4 left-4 right-4 flex justify-between items-start z-50">
      <button @click="regresar" class="btn-system-sm group">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/></svg>
        <span class="text-[9px] font-bold uppercase">Volver</span>
      </button>

      <button @click="logout" class="btn-system-sm border-red-500/30 text-red-500/80">
        <span class="text-[9px] font-bold uppercase">Salir</span>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
      </button>
    </div>

    <!-- COLUMNA IZQUIERDA: TRACCIÓN -->
    <div class="flex-1 flex flex-col justify-center items-center gap-4 border-r border-white/5 bg-gradient-to-r from-blue-900/10 to-transparent">
      <div class="flex flex-col gap-4">
        <button @touchstart="sendMove('F')" @touchend="sendMove('S')" class="btn-control w-24 h-24">
          <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8l-6 6h12l-6-6z"/></svg>
        </button>
        <button @touchstart="sendMove('B')" @touchend="sendMove('S')" class="btn-control w-24 h-24">
          <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 16l6-6H6l6 6z"/></svg>
        </button>
      </div>
      <p class="text-[9px] font-bold tracking-[0.3em] text-slate-500 uppercase">Tracción</p>
    </div>

    <!-- COLUMNA CENTRAL -->
    <div class="flex-[1.4] flex flex-col p-4 justify-between items-center">
      
      <!-- Telemetría y Token -->
      <div class="flex flex-col items-center gap-3 mt-12 w-full max-w-xs">
        <div class="grid grid-cols-2 gap-2 w-full">
          <div v-for="(val, label) in telemetria" :key="label" class="bg-[#161b22]/80 rounded-xl p-2 border border-white/5 text-center">
            <p class="text-[7px] text-slate-500 uppercase font-black">{{ label }}</p>
            <p class="text-sm font-mono font-bold leading-none">{{ val }}<span class="text-[7px] ml-0.5 text-blue-500/50">{{ unidades[label] }}</span></p>
          </div>
        </div>
        
        <!-- TOKEN DEL VEHÍCULO (Añadido aquí) -->
        <div class="flex items-center gap-2 px-3 py-1 bg-blue-500/5 border border-blue-500/10 rounded-full">
          <span class="text-[8px] font-black text-blue-500/60 uppercase tracking-widest">Unit ID:</span>
          <span class="text-[9px] font-mono font-bold text-blue-400/90">{{ vehicleToken }}</span>
        </div>
      </div>

      <!-- PANEL INFERIOR: ACELERÓMETRO Y FUNCIONES -->
      <div class="w-full flex flex-col items-center gap-4 mb-4">
        <div class="flex gap-2">
          <button @click="toggleLuces" 
                  :class="lucesOn ? 'bg-white text-black shadow-[0_0_15px_#fff]' : 'bg-[#161b22] text-slate-500 border-white/5'" 
                  class="w-10 h-10 rounded-xl flex items-center justify-center border transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
          </button>
          
          <button @touchstart="playSonido" @touchend="stopSonido" 
                  :class="sonidoActive ? 'bg-white text-black shadow-[0_0_15px_#fff]' : 'bg-[#161b22] text-slate-500 border-white/5'"
                  class="w-10 h-10 rounded-xl flex items-center justify-center border transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>
          </button>

          <div class="w-[1px] h-6 bg-white/10 mx-1 self-center"></div>

          <button @click="toggleWifi" :class="apiConnected ? 'text-blue-400 border-blue-400' : 'text-slate-600 border-white/5'" class="btn-status-sm">
            <span class="text-[7px] font-bold">WIFI</span>
          </button>
          <button @click="conectarBluetooth" :class="btConnected ? 'text-blue-400 border-blue-400' : 'text-slate-600 border-white/5'" class="btn-status-sm">
            <span class="text-[7px] font-bold">BT</span>
          </button>
        </div>

        <div class="w-full max-w-sm bg-[#161b22] p-2 rounded-xl border border-white/5 flex items-center gap-3 shadow-lg">
          <p class="text-[8px] font-black text-blue-500 uppercase tracking-tighter">Throttle</p>
          <input type="range" v-model="velocidad" min="0" max="100" class="flex-1 accent-blue-500 h-1.5 cursor-pointer">
          <p class="text-[10px] font-mono font-bold w-8 text-right">{{ velocidad }}%</p>
        </div>
      </div>
    </div>

    <!-- COLUMNA DERECHA: DIRECCIÓN -->
    <div class="flex-1 flex flex-col justify-center items-center gap-4 border-l border-white/5 bg-gradient-to-l from-blue-900/10 to-transparent">
      <div class="flex gap-4">
        <button @touchstart="sendMove('L')" @touchend="sendMove('S')" class="btn-control w-24 h-24">
          <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M10 18l-6-6 6-6v12z"/></svg>
        </button>
        <button @touchstart="sendMove('R')" @touchend="sendMove('S')" class="btn-control w-24 h-24">
          <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M14 18l6-6-6-6v12z"/></svg>
        </button>
      </div>
      <p class="text-[9px] font-bold tracking-[0.3em] text-slate-500 uppercase">Dirección</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';

const router = useRouter();

// Estados de Control
const velocidad = ref(80);
const apiConnected = ref(false); // Estado de Railway
const btConnected = ref(false);  // Estado de Bluetooth
const characteristic = ref(null);
const deviceConnected = ref(null);

// UI States
const lucesOn = ref(false);
const sonidoActive = ref(false);
const vehicleToken = ref('XB-0026'); 
const telemetria = ref({ "Dist": 0, "Stop": 0, "Vel": 0, "Ping": 0 });
const unidades = { "Dist": "cm", "Stop": "cm", "Vel": "%", "Ping": "ms" };

const regresar = () => router.back();
const logout = () => {
  if(confirm("¿Cerrar sesión?")) {
    localStorage.clear();
    router.push('/');
  }
};

// --- LOGICA BLUETOOTH (HANDSHAKE) ---

const conectarBluetooth = async () => {
  try {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: 'CARRO_' }],
      optionalServices: ['00001101-0000-1000-8000-00805f9b34fb']
    });

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService('00001101-0000-1000-8000-00805f9b34fb');
    characteristic.value = await service.getCharacteristic('00001101-0000-1000-8000-00805f9b34fb');

    // 1. Iniciar escucha de telemetría real del ESP32
    characteristic.value.startNotifications();
    characteristic.value.addEventListener('characteristicvaluechanged', (event) => {
      const rawData = new TextDecoder().decode(event.target.value);
      handleTelemetriaBT(rawData);
    });

    // 2. ENVIAR HANDSHAKE: Avisar al ESP32 que la web está lista para mover
    const encoder = new TextEncoder();
    await characteristic.value.writeValue(encoder.encode("CONNECT\n"));

    deviceConnected.value = device;
    btConnected.value = true;
    if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
  } catch (e) {
    console.error("Error BT:", e);
    btConnected.value = false;
  }
};

const sendMove = async (dir) => {
  if (navigator.vibrate) navigator.vibrate(30);
  
  // Solo envía si hay Bluetooth verificado
  if (btConnected.value && characteristic.value) {
    try {
      const encoder = new TextEncoder();
      await characteristic.value.writeValue(encoder.encode(dir + "\n"));
    } catch (error) {
      console.error("Error de transmisión:", error);
    }
  }
};

// Sincronizar Throttle en tiempo real
watch(velocidad, (newVal) => {
  if (btConnected.value) sendMove(`VEL:${newVal}`);
});

const handleTelemetriaBT = (data) => {
  if (data.startsWith("DATOS:")) {
    const partes = data.replace("DATOS:", "").split(",");
    telemetria.value.Dist = parseInt(partes[0].replace("D", "")) || 0;
  }
};

// --- LOGICA RAILWAY (PARAMETROS) ---

const fetchStatus = async () => {
  try {
    const token = localStorage.getItem('userToken');
    if(token) vehicleToken.value = token.substring(0, 8).toUpperCase();
    
    // Si Railway no responde, el sistema se considera "No Sincronizado"
    const res = await api.get(`/parametros/${token}`);
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

const toggleLuces = () => {
  lucesOn.value = !lucesOn.value;
  sendMove('H'); // H de Headlights para el ESP32
};

let timer;
onMounted(() => { 
  timer = setInterval(fetchStatus, 2000); 
});
onUnmounted(() => clearInterval(timer));
</script>

<style scoped>
@reference "../style.css";

.btn-system-sm {
  @apply bg-[#161b22]/60 backdrop-blur-sm border border-white/10 px-3 py-1.5 rounded-lg
         flex items-center gap-2 transition-all active:scale-95;
}

.btn-control {
  @apply bg-[#161b22] border border-white/10 rounded-[2.5rem] flex items-center justify-center 
         transition-all duration-75 text-slate-400 active:scale-90 active:bg-white active:text-black;
}

.btn-status-sm {
  @apply w-10 h-10 rounded-xl bg-[#161b22] border flex items-center justify-center transition-all;
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