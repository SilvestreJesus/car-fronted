
<template>
  <div class="min-h-screen bg-[#050505] bg-[radial-gradient(circle_at_center,_#0a192f_0%,_#050505_100%)] flex flex-col items-center justify-center p-6 font-app antialiased">
    
    <div class="w-full max-w-md bg-[#0d1117] rounded-[2.5rem] p-10 shadow-2xl border border-white/5">
      
      <!-- Logo centrado -->
      <div class="flex justify-center mb-8">
        <img src="../assets/logo.png" alt="Logo" class="w-24 h-auto object-contain filter brightness-125" />
      </div>

      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-white tracking-tight animate-fade-in">Registro</h1>
        <p class="text-slate-400 text-sm mt-2 font-normal">Configura el acceso para tu proyecto robótico</p>
      </div>

      <div class="space-y-5">
        <!-- Nombre del Carro -->
        <div class="group relative text-left">
          <label class="text-[11px] font-bold text-[#3b82f6] uppercase mb-2 block tracking-wider">Nombre del equipo "Automóvil"</label>
          <input v-model="form.nombre" type="text" placeholder="Ej. Xolo-Bot" 
                 class="w-full bg-[#161b22] border border-slate-800 rounded-xl py-3 px-4 outline-none focus:border-[#3b82f6] transition-all text-white">
        </div>

        <!-- Integrantes -->
        <div class="group relative text-left">
          <label class="text-[11px] font-bold text-[#3b82f6] uppercase mb-2 block tracking-wider">Integrantes</label>
          <textarea v-model="form.integrantes" placeholder="Nombre 1, Nombre 2..." rows="2"
                    class="w-full bg-[#161b22] border border-slate-800 rounded-xl py-3 px-4 outline-none focus:border-[#3b82f6] transition-all text-white resize-none"></textarea>
        </div>

        <!-- Correo -->
        <div class="group relative text-left">
          <label class="text-[11px] font-bold text-[#3b82f6] uppercase mb-2 block tracking-wider">Correo Electrónico</label>
          <input v-model="form.email" type="email" placeholder="correo@ejemplo.com" 
                 class="w-full bg-[#161b22] border border-slate-800 rounded-xl py-3 px-4 outline-none focus:border-[#3b82f6] transition-all text-white">
        </div>

        <!-- Contraseña -->
        <div class="group relative text-left">
          <label class="text-[11px] font-bold text-[#3b82f6] uppercase mb-2 block tracking-wider">Contraseña</label>
          <input v-model="form.password" type="password" placeholder="••••••••" 
                 class="w-full bg-[#161b22] border border-slate-800 rounded-xl py-3 px-4 outline-none focus:border-[#3b82f6] transition-all text-white">
        </div>

        <!-- Confirmar Contraseña -->
        <div class="group relative text-left">
          <label class="text-[11px] font-bold text-[#3b82f6] uppercase mb-2 block tracking-wider">Confirmar Contraseña</label>
          <input v-model="form.confirmPassword" type="password" placeholder="••••••••" 
                 class="w-full bg-[#161b22] border border-slate-800 rounded-xl py-3 px-4 outline-none focus:border-[#3b82f6] transition-all text-white">
          <p v-if="form.password !== form.confirmPassword && form.confirmPassword" class="text-red-500 text-[10px] mt-1 font-medium italic">Las contraseñas no coinciden</p>
        </div>
      </div>

      <!-- Botón REGISTRAR -->
      <button @click="enviarRegistro" 
              :disabled="form.password !== form.confirmPassword || !form.password"
              class="relative mt-8 w-full overflow-hidden bg-[#3b82f6] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300
                     hover:bg-white hover:text-[#0d1117] hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(255,255,255,0.15)]
                     active:scale-[0.95] flex items-center justify-center gap-2 group text-base uppercase">
        
        <span class="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer"></span>
        
        <span class="relative z-10">Finalizar Registro</span>
      </button>

      <!-- Volver al Login -->
      <button @click="router.push('/')" 
              class="mt-6 w-full py-2 text-slate-500 font-medium hover:text-slate-300 transition-all text-xs uppercase tracking-widest">
        ¿Ya tienes cuenta? Inicia sesión
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
// Importamos la configuración que acabamos de crear
import api from '@/services/api';
const router = useRouter();
const form = ref({ 
  nombre: '', 
  integrantes: '', 
  email: '', 
  password: '', 
  confirmPassword: '' 
});

const enviarRegistro = async () => {
  if (form.value.password !== form.value.confirmPassword) {
    alert("Las contraseñas deben ser iguales.");
    return;
  }

  try {
    // Usamos 'api.post' en lugar de 'axios.post' con la URL larga
    const res = await api.post('/registrar', {
      nombre: form.value.nombre,
      integrantes: form.value.integrantes,
      email: form.value.email,
      password: form.value.password
    });
    
    alert("¡Registro exitoso! 🚀\nTu Token es: " + res.data.token);
    router.push('/'); 
    
  } catch (error) {
    // Si el error viene del servidor (ej. el correo ya existe)
    if (error.response) {
      alert("Error: " + (error.response.data.message || "No se pudo registrar el equipo"));
    } else {
      alert("No hay conexión con el servidor de Railway");
    }
  }
};
</script>

<style scoped>
.font-app, input, textarea, button, label {
  font-family: 'Inter', -apple-system, system-ui, sans-serif !important;
}

@keyframes shimmer { 100% { transform: translateX(100%); } }
.group-hover\:animate-shimmer { animation: shimmer 1.5s infinite; }
.animate-fade-in { animation: fadeIn 0.8s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
</style>