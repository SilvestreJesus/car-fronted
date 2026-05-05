<template>
  <div class="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-white">
    <!-- Header -->
    <div class="absolute top-6 left-6 right-6 flex justify-between items-center">
      <button @click="conectarBT" :class="btConnected ? 'text-blue-400 border-blue-400' : 'text-red-500 border-red-500'" class="border rounded-xl px-4 py-2 bg-[#161b22]">
        BT {{ btConnected ? 'CONECTADO' : 'DESCONECTADO' }}
      </button>
      <button @click="logout" class="text-slate-400 uppercase text-[10px] font-bold">Cerrar Sesión</button>
    </div>

    <!-- Formulario -->
    <div class="w-full max-w-md bg-[#0d1117] rounded-[2.5rem] p-8 border border-white/5">
      <h3 class="text-center font-bold text-[10px] mb-8 uppercase tracking-[0.3em] text-slate-500">Configuración BLE</h3>
      <div class="grid grid-cols-2 gap-6">
        <div v-for="(val, key) in formConfig" :key="key">
          <label class="text-[10px] font-bold text-blue-500 uppercase mb-2 block">{{ val.label }}</label>
          <input v-model.number="form[key]" type="number" class="w-full bg-[#161b22] border border-slate-800 rounded-xl py-3 px-4 outline-none text-white font-bold">
        </div>
      </div>
      <button @click="enviarParametros" class="mt-10 w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-white hover:text-black transition-all uppercase text-xs tracking-widest">
        Sincronizar por Bluetooth
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useBluetooth } from '@/composables/useBluetooth'; // Asumiendo que mueves la lógica de conexión a un composable o la pegas aquí

const router = useRouter();
const { btConnected, conectarBT, enviarComando, characteristic } = useBluetooth(); // O usa la lógica de conexión directa

const form = ref({ distancia_detectar: 50, distancia_detenerse: 10, velocidad_segura: 80, tiempo_respuesta: 20 });
const formConfig = { 
  distancia_detectar: { label: 'Detección (cm)' }, 
  distancia_detenerse: { label: 'Frenado (cm)' }, 
  velocidad_segura: { label: 'Velocidad (%)' }, 
  tiempo_respuesta: { label: 'Respuesta (ms)' } 
};

const enviarParametros = async () => {
  if (!btConnected.value) return alert("Primero conecta el Bluetooth");
  const msg = `SET_PARAMS:${form.value.distancia_detectar},${form.value.distancia_detenerse},${form.value.velocidad_segura},${form.value.tiempo_respuesta}`;
  await enviarComando(msg);
  router.push('/control');
};

const logout = () => { localStorage.clear(); router.push('/'); };
</script>