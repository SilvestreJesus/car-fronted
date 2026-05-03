<template>
  <!-- Contenedor principal con fondo gradiente -->
  <div class="min-h-screen bg-[#050505] bg-[radial-gradient(circle_at_center,_#0a192f_0%,_#050505_100%)] flex flex-col items-center justify-center p-6 font-app antialiased text-white">
    
    <!-- Tarjeta Principal -->
    <div class="w-full max-w-md bg-[#0d1117] rounded-[2.5rem] p-10 shadow-2xl border border-white/5">
      
      <!-- Logo centrado -->
      <div class="flex justify-center mb-10">
        <img src="/logo-carro.png" alt="Logo" class="w-28 h-auto object-contain filter brightness-125" />
      </div>

      <!-- Títulos -->
      <div class="text-center mb-10">
        <h1 class="text-3xl font-bold tracking-tight animate-fade-in">Bienvenido</h1>
        <p class="text-slate-400 text-sm mt-2 font-normal">Gestiona tu vehículo con un toque profesional</p>
      </div>

      <div class="space-y-6">
        <!-- Campo Correo -->
        <div class="group relative text-left">
          <label class="text-[11px] font-bold text-[#3b82f6] uppercase mb-2 block tracking-wider">Correo Electrónico</label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#3b82f6] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </span>
            <input v-model="email" type="email" placeholder="correo@ejemplo.com" 
                   class="w-full bg-[#161b22] border border-slate-800 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-[#3b82f6] transition-all text-white placeholder:text-slate-600 font-normal">
          </div>
        </div>

        <!-- Campo Contraseña -->
        <div class="group relative text-left">
          <div class="flex justify-between mb-2">
            <label class="text-[11px] font-bold text-[#3b82f6] uppercase tracking-wider">Contraseña</label>
            <button class="text-[10px] font-medium text-slate-500 hover:text-white transition-colors uppercase">¿Olvidaste la clave?</button>
          </div>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#3b82f6] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </span>
            <input v-model="password" type="password" placeholder="••••••••" 
                   class="w-full bg-[#161b22] border border-slate-800 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-[#3b82f6] transition-all text-white placeholder:text-slate-600 font-normal">
          </div>
        </div>
      </div>

      <!-- Botón Acceder -->
      <button @click="handleLogin" 
              class="relative mt-10 w-full overflow-hidden bg-[#3b82f6] text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300
                     hover:bg-white hover:text-[#0d1117] hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(255,255,255,0.15)]
                     active:scale-[0.95] flex items-center justify-center gap-2 group text-base uppercase">
        <span class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
        <span class="relative z-10">Acceder al Panel</span>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>

      <!-- Enlace a Registro -->
      <button @click="router.push('/registro')" 
              class="mt-8 w-full py-2 text-slate-500 font-medium hover:text-slate-300 transition-all text-xs uppercase tracking-widest">
        Crear cuenta nueva
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';

const router = useRouter();
const email = ref('');
const password = ref('');

const handleLogin = async () => {
  if (!email.value || !password.value) {
    alert("Por favor, completa todos los campos.");
    return;
  }

  try {
    const res = await api.post('/login', {
      email: email.value,
      password: password.value
    });

    if (res.data.status === 'success') {
      localStorage.setItem('userToken', res.data.token);
      localStorage.setItem('userRole', res.data.role);
      localStorage.setItem('userName', res.data.nombre);

      if (res.data.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/parametros');
      }
    }
  } catch (error) {
    const msg = error.response?.data?.message || "Error de conexión";
    alert("Error: " + msg);
  }
};
</script>

<style scoped>
.font-app, input, button, label {
  font-family: 'Inter', sans-serif !important;
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer {
  100% { transform: translateX(100%); }
}

.group-hover\:animate-shimmer {
  animation: shimmer 1.5s infinite;
}
</style>