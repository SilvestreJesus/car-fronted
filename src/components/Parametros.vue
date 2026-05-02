<template>
  <div class="min-h-screen bg-[#1a1a1a] text-white flex flex-col items-center p-6">
    <div class="w-24 h-24 bg-white rounded-full mb-4 border-2 border-gray-500 overflow-hidden">
      <img src="/logo-carro.png" class="w-full h-full object-cover">
    </div>
    
    <h2 class="text-3xl font-bold text-[#d4e6d4] italic mb-1">{{ equipoNombre }}</h2>
    <p class="text-xl font-mono text-gray-300 mb-8">Token: {{ token }}</p>

    <!-- Caja de Parámetros -->
    <div class="bg-[#999999] w-full max-w-sm rounded-[30px] p-8 text-black shadow-lg">
      <h3 class="text-center font-bold text-xl mb-6 italic">Parametros</h3>
      
      <div class="grid grid-cols-2 gap-x-6 gap-y-8">
        <!-- Detectar -->
        <div class="flex flex-col">
          <label class="font-black text-sm mb-1">Detectar Distancia</label>
          <div class="relative">
            <input v-model="form.distancia_detectar" type="number" 
                   class="w-full bg-black text-white rounded-2xl py-3 px-4 outline-none text-right font-bold pr-12">
            <span class="absolute right-3 top-3 text-white font-bold">Cm</span>
          </div>
        </div>

        <!-- Detenerse -->
        <div class="flex flex-col">
          <label class="font-black text-sm mb-1">Detenerse</label>
          <div class="relative">
            <input v-model="form.distancia_detenerse" type="number" 
                   class="w-full bg-black text-white rounded-2xl py-3 px-4 outline-none text-right font-bold pr-12">
            <span class="absolute right-3 top-3 text-white font-bold">Cm</span>
          </div>
        </div>

        <!-- Velocidad -->
        <div class="flex flex-col">
          <label class="font-black text-sm mb-1">Velocidad</label>
          <div class="relative">
            <input v-model="form.velocidad_segura" type="number" step="0.1"
                   class="w-full bg-black text-white rounded-2xl py-3 px-4 outline-none text-right font-bold pr-12">
            <span class="absolute right-3 top-3 text-white font-bold">M/s</span>
          </div>
        </div>

        <!-- Tiempo de Respuesta -->
        <div class="flex flex-col">
          <label class="font-black text-sm mb-1 text-[11px]">Tiempo de respuesta</label>
          <div class="relative">
            <input v-model="form.tiempo_respuesta" type="number" 
                   class="w-full bg-black text-white rounded-2xl py-3 px-4 outline-none text-right font-bold pr-12">
            <span class="absolute right-3 top-3 text-white font-bold">Ms</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Botón Guardar -->
    <button @click="saveSettings" class="mt-12 bg-[#333333] text-white font-bold py-4 px-16 rounded-full hover:bg-black shadow-xl transition">
      Guarda Datos
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const equipoNombre = ref('Nombre Equipo');
const token = ref('');
const form = ref({
  distancia_detectar: 50,
  distancia_detenerse: 10,
  velocidad_segura: 0.5,
  tiempo_respuesta: 100
});

onMounted(() => {
  token.value = localStorage.getItem('equipo_token') || 'SIN-TOKEN';
  // Aquí podrías hacer un fetch para cargar los valores actuales si ya existen
});

const saveSettings = async () => {
  try {
    await axios.post(`http://localhost:8000/api/equipos/update-params`, {
      token: token.value,
      ...form.value
    });
    alert("¡Parámetros sincronizados con el carro!");
  } catch (error) {
    alert("Error al guardar");
  }
};
</script>