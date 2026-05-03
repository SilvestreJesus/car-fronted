<template>
  <div class="min-h-screen bg-[#050505] bg-[radial-gradient(circle_at_center,_#0a192f_0%,_#050505_100%)] p-4 sm:p-8 font-app antialiased text-white">
    
    <!-- Encabezado -->
    <div class="max-w-4xl mx-auto mb-10 flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold tracking-tighter">Panel de Control <span class="text-[#3b82f6]">Admin</span></h1>
        <p class="text-slate-400 text-sm">Gestión global de flota Xolo-Bot</p>
      </div>
      <button @click="router.push('/')" class="p-2 hover:bg-white/10 rounded-full transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </button>
    </div>

    <!-- Lista de Equipos -->
    <div class="max-w-4xl mx-auto space-y-4">
      <div v-for="item in equipos" :key="item.id" 
           class="bg-[#0d1117] border border-white/5 rounded-3xl overflow-hidden transition-all duration-300 hover:border-[#3b82f6]/50">
        
        <!-- Cabecera de la Tarjeta (Click para expandir) -->
        <div @click="toggleEquipo(item.id)" class="p-6 flex items-center justify-between cursor-pointer active:bg-white/5">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-[#3b82f6]/10 rounded-2xl flex items-center justify-center text-[#3b82f6] font-bold">
              {{ item.nombre_equipo.substring(0, 2).toUpperCase() }}
            </div>
            <div>
              <h3 class="font-bold text-lg leading-tight">{{ item.nombre_equipo }}</h3>
              <p class="text-xs text-slate-500 uppercase tracking-widest">{{ item.token }}</p>
            </div>
          </div>
          <div :class="{'rotate-180': expandedId === item.id}" class="transition-transform duration-300 text-slate-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <!-- Detalles Desplegables -->
        <div v-if="expandedId === item.id" class="px-6 pb-6 animate-fade-in">
          <div class="h-px bg-white/5 mb-6"></div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Info Personal -->
            <div class="space-y-4">
              <div>
                <label class="text-[10px] font-bold text-[#3b82f6] uppercase tracking-wider">Integrantes</label>
                <p class="text-sm text-slate-300">{{ item.integrantes }}</p>
              </div>
              <div>
                <label class="text-[10px] font-bold text-[#3b82f6] uppercase tracking-wider">Contacto</label>
                <p class="text-sm text-slate-300">{{ item.email }}</p>
              </div>
            </div>

            <!-- Datos Técnicos (de la tabla parametros_bot) -->
            <div class="bg-[#161b22] rounded-2xl p-4 grid grid-cols-2 gap-4">
              <div class="text-center">
                <p class="text-[10px] text-slate-500 uppercase">Dist. Detección</p>
                <p class="text-xl font-mono text-white">{{ item.parametros?.distancia_detectar || 0 }}<span class="text-xs ml-1">cm</span></p>
              </div>
              <div class="text-center">
                <p class="text-[10px] text-slate-500 uppercase">Dist. Frenado</p>
                <p class="text-xl font-mono text-white">{{ item.parametros?.distancia_detenerse || 0 }}<span class="text-xs ml-1">cm</span></p>
              </div>
              <div class="text-center">
                <p class="text-[10px] text-slate-500 uppercase">Velocidad</p>
                <p class="text-xl font-mono text-white">{{ item.parametros?.velocidad_segura || 0 }}<span class="text-xs ml-1">%</span></p>
              </div>
              <div class="text-center">
                <p class="text-[10px] text-slate-500 uppercase">T. Respuesta</p>
                <p class="text-xl font-mono text-white">{{ item.parametros?.tiempo_respuesta || 0 }}<span class="text-xs ml-1">ms</span></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';

const router = useRouter();
const equipos = ref([]);
const expandedId = ref(null);

const cargarEquipos = async () => {
  try {
    const res = await api.get('/equipos-completo');
    equipos.value = res.data;
  } catch (error) {
    console.error("Error al cargar datos", error);
  }
};

const toggleEquipo = (id) => {
  expandedId.value = expandedId.value === id ? null : id;
};

onMounted(cargarEquipos);
</script>

<style scoped>
.font-app { font-family: 'Inter', sans-serif !important; }
.animate-fade-in { animation: fadeIn 0.4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
</style>