export const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  // 1. Proteção para Server-Side Rendering (SSR)
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  // 2. Feedback Sonoro com tratamento seguro
  try {
    const soundPath = type === 'success' ? '/success.mp3' : '/error.mp3';
    const audio = new Audio(soundPath);
    audio.play().catch(() => {
      // Ignora erro se o navegador bloquear autoplay sem interação do usuário
    });
  } catch {
    // Ignora falha de áudio em ambientes não suportados
  }

  // 3. Criar elemento no DOM
  const toast = document.createElement('div');
  
  // Estilo "Tiger" - Inicia invisível e deslocado para permitir a animação de entrada
  toast.className = `fixed bottom-8 right-8 px-6 py-4 rounded-2xl text-white font-bold shadow-2xl z-[9999] transition-all duration-300 transform translate-y-5 opacity-0 ${
    type === 'success' ? 'bg-[#ff9500]' : 'bg-red-600'
  }`;
  
  toast.innerText = message;
  document.body.appendChild(toast);

  // 4. Animação de Entrada (Força o browser a processar o estado inicial antes de animar)
  requestAnimationFrame(() => {
    toast.classList.remove('opacity-0', 'translate-y-5');
    toast.classList.add('opacity-100', 'translate-y-0');
  });

  // 5. Animação de Saída e Remoção do DOM
  setTimeout(() => {
    toast.classList.remove('opacity-100', 'translate-y-0');
    toast.classList.add('opacity-0', 'translate-y-5');

    setTimeout(() => {
      if (document.body.contains(toast)) {
        toast.remove();
      }
    }, 300);
  }, 2700);
};