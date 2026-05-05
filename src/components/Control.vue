<template>
  <div class="fixed inset-0 bg-[#050505] text-white flex select-none overflow-hidden font-sans">
    
    <!-- Tracción (Izquierda) -->
    <div class="flex-1 flex flex-col justify-center items-center gap-6 border-r border-white/5">
      <button 
        @touchstart.prevent="sendMove('F')" 
        @touchend.prevent="sendMove('S')" 
        class="w-24 h-24 bg-[#161b22] rounded-3xl flex items-center justify-center text-3xl active:bg-blue-600 active:scale-95 transition-all shadow-lg border border-white/5"
      >
        ↑
      </button>
      <button 
        @touchstart.prevent="sendMove('B')" 
        @touchend.prevent="sendMove('S')" 
        class="w-24 h-24 bg-[#161b22] rounded-3xl flex items-center justify-center text-3xl active:bg-blue-600 active:scale-95 transition-all shadow-lg border border-white/5"
      >
        ↓
      </button>
    </div>

    <!-- Centro (Telemetría y Extras) -->
    <div class="flex-[1.4] flex flex-col p-6 justify-between items-center">
      <!-- Grid de Datos -->
      <div class="grid grid-cols-2 gap-3 w-full mt-8">
        <div v-for="(val, label) in telemetria" :key="label" class="bg-[#1d2128] rounded-2xl p-4 border border-white/5 text-center shadow-inner">
          <p class="text-[10px] text-blue-400 font-bold uppercase tracking-wider mb-1">{{ label }}</p>
          <p class="text-2xl font-mono font-bold text-white">{{ val }}</p>
        </div>
      </div>
      
      <!-- Controles Secundarios -->
      <div class="w-full flex flex-col items-center gap-6 mb-8">
        <div class="flex gap-6">
          <button 
            @click="sendMove('H')" 
            class="w-14 h-14 rounded-full bg-[#1d2128] border border-white/10 flex items-center justify-center text-xl active:bg-yellow-500 transition-colors"
          >
            💡
          </button>
          <button 
            @touchstart.prevent="sendMove('P')" 
            @touchend.prevent="sendMove('O')" 
            class="w-14 h-14 rounded-full bg-[#1d2128] border border-white/10 flex items-center justify-center text-xl active:bg-red-600 transition-colors"
          >
            📢
          </button>
        </div>

        <!-- Slider de Velocidad -->
        <div class="w-full px-4">
          <input 
            type="range" 
            v-model="velocidad" 
            min="0" 
            max="100" 
            class="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          >
          <div class="flex justify-between mt-2">
            <p class="text-[10px] font-bold text-slate-500 uppercase">Potencia</p>
            <p class="text-[10px] font-bold text-blue-500">{{ velocidad }}%</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Dirección (Derecha) -->
    <div class="flex-1 flex flex-col justify-center items-center gap-6 border-l border-white/5">
      <div class="flex gap-4">
        <button 
          @touchstart.prevent="sendMove('L')" 
          @touchend.prevent="sendMove('S')" 
          class="w-24 h-24 bg-[#161b22] rounded-3xl flex items-center justify-center text-3xl active:bg-blue-600 active:scale-95 transition-all shadow-lg border border-white/5"
        >
          ←
        </button>
        <button 
          @touchstart.prevent="sendMove('R')" 
          @touchend.prevent="sendMove('S')" 
          class="w-24 h-24 bg-[#161b22] rounded-3xl flex items-center justify-center text-3xl active:bg-blue-600 active:scale-95 transition-all shadow-lg border border-white/5"
        >
          →
        </button>
      </div>
    </div>

    <!-- Estado de Conexión Flotante -->
    <div class="absolute top-4 left-1/2 -translate-x-1/2">
      <span 
        class="px-3 py-1 rounded-full text-[9px] font-black tracking-tighter border uppercase"
        :class="btConnected ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'"
      >
        {{ btConnected ? 'Sistema BLE Activo' : 'Sin Conexión' }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useBluetooth } from '@/composables/useBluetooth';

const { btConnected, enviarComando, telemetria } = useBluetooth();
const velocidad = ref(80);

const sendMove = (dir) => {
  // Solo enviamos si hay conexión para evitar errores en consola
  if (btConnected.value) {
    enviarComando(dir);
  }
};

// Sincronizar velocidad cuando cambie el slider
watch(velocidad, (val) => {
  if (btConnected.value) {
    enviarComando(`VEL:${val}`);
  }
});
</script>

<style scoped>
/* Estilos mínimos para el slider ya que Tailwind no cubre todos los pseudo-elementos fácilmente */
input[type='range']::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: #3b82f6;
  border-radius: 50%;
  cursor: pointer;
}
</style>