<template>
  <div class="bg-zinc-900 min-h-screen flex flex-col items-center p-6 text-white">
    <img src="/logo-carro.png" class="w-24 h-24 rounded-full border-2 border-white mb-4">
    <h1 class="text-3xl font-bold italic text-green-100 mb-6">Registro</h1>

    <div class="bg-zinc-400 p-6 rounded-3xl w-full max-w-sm text-black">
      <label class="font-bold">Nombre del equipo "Carro"</label>
      <input v-model="form.nombre" class="w-full bg-black text-white rounded-full p-2 mb-4">

      <label class="font-bold">Integrantes</label>
      <textarea v-model="form.integrantes" class="w-full bg-black text-white rounded-2xl p-2 mb-4" placeholder="Nombre 1, Nombre 2..."></textarea>

      <label class="font-bold">Correo electrónico</label>
      <input v-model="form.email" type="email" class="w-full bg-black text-white rounded-full p-2 mb-4">

      <label class="font-bold">Contraseña</label>
      <input v-model="form.password" type="password" class="w-full bg-black text-white rounded-full p-2 mb-4">
      
      <button @click="enviarRegistro" class="bg-zinc-700 text-white w-full py-3 rounded-full mt-4 font-bold">
        Registrar
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const form = ref({ nombre: '', integrantes: '', email: '', password: '' });

const enviarRegistro = async () => {
  const res = await axios.post('http://127.0.0.1:8000/api/registrar', form.value);
  alert("Tu Token es: " + res.data.token);
  // Redirigir al login o dashboard
};
</script>