<template>
  <div class="fixed inset-0 bg-[#050505] text-white flex select-none overflow-hidden">
    <!-- Tracción (Izquierda) -->
    <div class="flex-1 flex flex-col justify-center items-center gap-4 border-r border-white/5">
      <button @touchstart="sendMove('F')" @touchend="sendMove('S')" class="btn-control">↑</button>
      <button @touchstart="sendMove('B')" @touchend="sendMove('S')" class="btn-control">↓</button>
    </div>

    <!-- Centro (Telemetría) -->
    <div class="flex-[1.4] flex flex-col p-4 justify-between items-center">
      <div class="grid grid-cols-2 gap-2 w-full mt-10">
        <div v-for="(val, label) in telemetria" :key="label" class="bg-[#161b22] rounded-xl p-3 border border-white/5 text-center">
          <p class="text-[8px] text-slate-500 uppercase">{{ label }}</p>
          <p class="text-xl font-mono font-bold">{{ val }}</p>
        </div>
      </div>
      
      <div class="w-full flex flex-col items-center gap-4 mb-4">
        <div class="flex gap-4">
          <button @click="sendMove('H')" class="w-12 h-12 rounded-full bg-[#161b22] border border-white/10">💡</button>
          <button @touchstart="sendMove('P')" @touchend="sendMove('O')" class="w-12 h-12 rounded-full bg-[#161b22] border border-white/10">📢</button>
        </div>
        <input type="range" v-model="velocidad" min="0" max="100" class="w-full accent-blue-500">
        <p class="text-xs font-bold">Potencia: {{ velocidad }}%</p>
      </div>
    </div>

    <!-- Dirección (Derecha) -->
    <div class="flex-1 flex flex-col justify-center items-center gap-4 border-l border-white/5">
      <div class="flex gap-4">
        <button @touchstart="sendMove('L')" @touchend="sendMove('S')" class="btn-control">←</button>
        <button @touchstart="sendMove('R')" @touchend="sendMove('S')" class="btn-control">→</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useBluetooth } from '@/composables/useBluetooth';

const { btConnected, enviarComando, telemetria } = useBluetooth();
const velocidad = ref(80);

const sendMove = (dir) => {
  if (btConnected.value) enviarComando(dir);
};

watch(velocidad, (val) => {
  if (btConnected.value) enviarComando(`VEL:${val}`);
});
</script>

<style scoped>
.btn-control {
  @apply w-20 h-20 bg-[#161b22] rounded-3xl flex items-center justify-center text-2xl active:bg-blue-600 active:scale-90 transition-all;
}
</style>