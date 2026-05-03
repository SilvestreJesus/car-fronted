<template>
  <div class="min-h-screen bg-[#050505] bg-[radial-gradient(circle_at_center,_#0a192f_0%,_#050505_100%)] flex flex-col items-center justify-center p-6 font-app antialiased text-white">
    
    <!-- Botón Cerrar Sesión -->
    <div class="absolute top-6 right-6">
      <button @click="handleLogout" class="flex items-center gap-2 text-slate-400 hover:text-white transition-colors uppercase text-[10px] font-bold tracking-widest">
        <span>Cerrar Sesión</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </div>

    <!-- Perfil del Robot -->
    <div class="flex flex-col items-center mb-8 animate-fade-in">
      <div class="w-24 h-24 bg-[#161b22] rounded-full mb-4 border border-white/10 p-1 shadow-2xl overflow-hidden">
        <img src="../assets/logo.png" class="w-full h-full object-contain filter brightness-110" alt="Robot Logo">
      </div>
      <h2 class="text-3xl font-bold tracking-tighter">{{ equipoNombre }}</h2>
      <div class="bg-[#3b82f6]/10 px-4 py-1 rounded-full mt-2 border border-[#3b82f6]/20">
        <p class="text-xs font-mono text-[#3b82f6] uppercase tracking-[0.2em]">Token: {{ token }}</p>
      </div>
    </div>

    <!-- Caja de Parámetros -->
    <div class="w-full max-w-md bg-[#0d1117] rounded-[2.5rem] p-10 shadow-2xl border border-white/5 relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#3b82f6] to-transparent opacity-50"></div>
      
      <h3 class="text-center font-bold text-lg mb-8 uppercase tracking-widest text-slate-400">Configuración Técnica</h3>
      
      <div class="grid grid-cols-2 gap-6">
        <!-- Detectar (Entero > 0) -->
        <div class="group">
          <label class="text-[10px] font-bold text-[#3b82f6] uppercase mb-2 block tracking-wider">Detección</label>
          <div class="relative">
            <input v-model.number="form.distancia_detectar" type="number" min="1"
                   class="w-full bg-[#161b22] border border-slate-800 rounded-xl py-3 px-4 outline-none focus:border-[#3b82f6] transition-all text-white font-bold pr-12">
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-[10px] uppercase">Cm</span>
          </div>
        </div>

        <!-- Detenerse (Entero > 0) -->
        <div class="group">
          <label class="text-[10px] font-bold text-[#3b82f6] uppercase mb-2 block tracking-wider">Frenado</label>
          <div class="relative">
            <input v-model.number="form.distancia_detenerse" type="number" min="1"
                   class="w-full bg-[#161b22] border border-slate-800 rounded-xl py-3 px-4 outline-none focus:border-[#3b82f6] transition-all text-white font-bold pr-12">
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-[10px] uppercase">Cm</span>
          </div>
        </div>

        <!-- Velocidad (Ahora como entero, ej: 1 a 100) -->
        <div class="group">
          <label class="text-[10px] font-bold text-[#3b82f6] uppercase mb-2 block tracking-wider">Velocidad</label>
          <div class="relative">
            <input v-model.number="form.velocidad_segura" type="number" min="1"
                   class="w-full bg-[#161b22] border border-slate-800 rounded-xl py-3 px-4 outline-none focus:border-[#3b82f6] transition-all text-white font-bold pr-12">
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-[10px] uppercase">%</span>
          </div>
        </div>

        <!-- Tiempo de Respuesta (Entero > 0) -->
        <div class="group">
          <label class="text-[10px] font-bold text-[#3b82f6] uppercase mb-2 block tracking-wider">Respuesta</label>
          <div class="relative">
            <input v-model.number="form.tiempo_respuesta" type="number" min="1"
                   class="w-full bg-[#161b22] border border-slate-800 rounded-xl py-3 px-4 outline-none focus:border-[#3b82f6] transition-all text-white font-bold pr-12">
            <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-[10px] uppercase">Ms</span>
          </div>
        </div>
      </div>

      <button @click="saveSettings" 
              class="relative mt-10 w-full overflow-hidden bg-[#3b82f6] text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300
                     hover:bg-white hover:text-[#0d1117] hover:-translate-y-1 active:scale-[0.95] flex items-center justify-center gap-3 group uppercase text-sm tracking-widest">
        <span class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
        <span>Sincronizar Carro</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';

const router = useRouter();
const equipoNombre = ref('Cargando...');
const token = ref('---');

const form = ref({
  distancia_detectar: 50,
  distancia_detenerse: 10,
  velocidad_segura: 50, // Cambiado de 0.5 a 50 (entero)
  tiempo_respuesta: 100
});

onMounted(() => {
  const savedName = localStorage.getItem('userName');
  const savedToken = localStorage.getItem('userToken');
  if (!savedToken) {
    handleLogout();
  } else {
    equipoNombre.value = savedName || 'auto-Bot';
    token.value = savedToken;
  }
});

const handleLogout = () => {
  localStorage.clear();
  router.push('/');
};

const saveSettings = async () => {
  // Verificación extra antes de enviar: asegurar que no hay ceros o negativos
  if (Object.values(form.value).some(val => val <= 0)) {
    alert("Todos los campos deben ser mayores a 0");
    return;
  }

  try {
    // Enviamos los datos asegurándonos de que sean enteros
    await api.post('/actualizar-parametros', {
      token: token.value,
      distancia_detectar: Math.floor(form.value.distancia_detectar),
      distancia_detenerse: Math.floor(form.value.distancia_detenerse),
      velocidad_segura: Math.floor(form.value.velocidad_segura),
      tiempo_respuesta: Math.floor(form.value.tiempo_respuesta)
    });
    
    router.push('/control');
  } catch (error) {
    console.error("Build Error 500:", error.response?.data);
    alert("Error del servidor. Asegúrate de que todos los valores sean números enteros positivos.");
  }
};
</script>