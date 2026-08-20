export const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  // 1. Proteção SSR
  if (typeof window === 'undefined') return;

  // 2. Som - Tratamento seguro
  try {
    const audio = new Audio(type === 'success' ? '/success.mp3' : '/error.mp3');
    audio.play().catch(() => {});
  } catch {}

  // 3. Criar e estilizar elemento
  const toast = document.createElement('div');
  
  // Usamos estilos inline básicos como fallback de segurança
  // e mantemos as classes do Tailwind para o visual Tiger
  toast.className = `fixed bottom-8 right-8 px-6 py-4 rounded-2xl text-white font-bold shadow-2xl z-[9999] transition-all duration-300 transform translate-y-5 opacity-0 ${
    type === 'success' ? 'bg-orange-500' : 'bg-red-600'
  }`;
  
  toast.innerText = message;
  document.body.appendChild(toast);

  // 4. Animação de entrada
  requestAnimationFrame(() => {
    toast.classList.remove('opacity-0', 'translate-y-5');
    toast.classList.add('opacity-100', 'translate-y-0');
  });

  // 5. Limpeza automática
  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-5');
    
    // Remove o elemento após a transição
    setTimeout(() => {
      if (document.body.contains(toast)) {
        document.body.removeChild(toast);
      }
    }, 300);
  }, 2700);
};