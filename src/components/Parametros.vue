<template>
  <div class="min-h-screen bg-[#050505] bg-[radial-gradient(circle_at_center,_#0a192f_0%,_#050505_100%)] flex flex-col items-center justify-center p-6 font-app antialiased text-white">
    
    <!-- Barra Superior de Estado y Navegación -->
    <div class="absolute top-6 left-6 right-6 flex justify-between items-center z-50">
      <!-- Indicadores de Conexión -->
      <div class="flex gap-3">
        <div :class="apiConnected ? 'text-blue-400 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'text-red-500 border-red-500/50'" 
             class="flex items-center gap-2 border rounded-xl px-3 py-1.5 bg-[#161b22] transition-all duration-500">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"/>
          </svg>
          <span class="text-[9px] font-black uppercase tracking-tighter">API {{ apiConnected ? 'Online' : 'Offline' }}</span>
        </div>

        <button @click="conectarBluetooth" :class="btConnected ? 'text-blue-400 border-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'text-slate-600 border-white/5'" 
             class="flex items-center gap-2 border rounded-xl px-3 py-1.5 bg-[#161b22] transition-all">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7l10 10M17 7l-10 10M12 3v18"/>
          </svg>
          <span class="text-[9px] font-black uppercase tracking-tighter">BT</span>
        </button>
      </div>

      <!-- Cerrar Sesión -->
      <button @click="handleLogout" class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors uppercase text-[10px] font-bold tracking-widest">
        <span>Cerrar Sesión</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </div>

    <!-- Perfil del Robot -->
    <div class="flex flex-col items-center mb-8 animate-fade-in">
      <div class="flex justify-center mb-6">
        <img src="../assets/logo.png" alt="Logo" class="w-24 h-auto filter brightness-125" />
      </div>
      <h2 class="text-3xl font-bold tracking-tighter">{{ equipoNombre }}</h2>
      <div class="bg-blue-500/10 px-4 py-1 rounded-full mt-2 border border-blue-500/20">
        <p class="text-xs font-mono text-blue-400 uppercase tracking-[0.2em]">Token: {{ token }}</p>
      </div>
    </div>

    <!-- Caja de Parámetros -->
    <div class="w-full max-w-md bg-[#0d1117] rounded-[2.5rem] p-8 shadow-2xl border border-white/5 relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
      
      <h3 class="text-center font-bold text-[10px] mb-8 uppercase tracking-[0.3em] text-slate-500">Configuración Técnica</h3>
      
      <div class="grid grid-cols-2 gap-6">
        <!-- Input fields (Detección, Frenado, etc.) - Mantener igual que tu código -->
        <div v-for="(val, key) in formConfig" :key="key" class="group">
          <label class="text-[10px] font-bold text-blue-500 uppercase mb-2 block tracking-wider">{{ val.label }}</label>
          <div class="relative">
            <input v-model.number="form[key]" type="number" min="1"
                   class="w-full bg-[#161b22] border border-slate-800 rounded-xl py-3 px-4 outline-none focus:border-blue-500 transition-all text-white font-bold pr-12">
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold text-[10px] uppercase">{{ val.unit }}</span>
          </div>
        </div>
      </div>

      <button @click="saveSettings" 
              class="relative mt-10 w-full overflow-hidden bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300
                     hover:bg-white hover:text-black active:scale-[0.95] flex items-center justify-center gap-3 group uppercase text-xs tracking-widest">
        <span>Sincronizar Carro</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';

const router = useRouter();
const equipoNombre = ref('Cargando...');
const token = ref('---');
const btConnected = ref(false);

// 1. DECLARACIÓN ÚNICA DE apiConnected
const apiConnected = ref(false);

const form = ref({
  distancia_detectar: 50,
  distancia_detenerse: 5,
  velocidad_segura: 80,
  tiempo_respuesta: 20
});

const formConfig = {
  distancia_detectar: { label: 'Detección', unit: 'Cm' },
  distancia_detenerse: { label: 'Frenado', unit: 'Cm' },
  velocidad_segura: { label: 'Velocidad', unit: '%' },
  tiempo_respuesta: { label: 'Respuesta', unit: 'Ms' }
};

// 2. FUNCIÓN DE ESTADO (Usando la lógica de tiempo real)
const checkStatus = async () => {
  try {
    // Usamos una estampa de tiempo para evitar caché del navegador
    const res = await api.get(`/parametros/${token.value}?t=${Date.now()}`);
    
    if (res.data && res.data.last_ping) {
      const ultimaConexion = new Date(res.data.last_ping).getTime();
      const ahora = new Date().getTime();
      
      // Calculamos la diferencia absoluta en milisegundos y pasamos a segundos
      const diferenciaSegundos = Math.abs(ahora - ultimaConexion) / 1000;

      // Si el log te da 1.6s estando desconectado, es un falso positivo.
      // Vamos a validar que la diferencia sea realmente pequeña.
      // El ESP32 consulta cada 2s, así que 10s es un margen muy seguro.
      apiConnected.value = diferenciaSegundos < 10;
      
      console.log(`Diferencia Real: ${diferenciaSegundos.toFixed(2)}s | Icono: ${apiConnected.value ? 'AZUL' : 'ROJO'}`);
    }
  } catch (error) {
    apiConnected.value = false;
  }
};

const conectarBluetooth = async () => {
  try {
    await navigator.bluetooth.requestDevice({ acceptAllDevices: true });
    btConnected.value = true;
  } catch { btConnected.value = false; }
};

let timer;
onMounted(() => {
  const savedName = localStorage.getItem('userName');
  const savedToken = localStorage.getItem('userToken');
  if (!savedToken) {
    handleLogout();
  } else {
    equipoNombre.value = savedName || 'Xolo-Bot';
    token.value = savedToken;
  }
  checkStatus();
  timer = setInterval(checkStatus, 5000);
});

onUnmounted(() => clearInterval(timer));

const handleLogout = () => {
  localStorage.clear();
  router.push('/');
};

const saveSettings = async () => {
  if (Object.values(form.value).some(val => val <= 0)) {
    alert("Todos los campos deben ser mayores a 0");
    return;
  }

  try {
    await api.post('/actualizar-parametros', {
      token: token.value,
      ...form.value
    });
    router.push('/control');
  } catch (error) {
    alert("Error de sincronización con el servidor.");
  }
};
</script>