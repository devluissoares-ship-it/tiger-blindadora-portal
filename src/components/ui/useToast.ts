// /lib/toast.ts

export const showToast = (message: string, type: 'success' | 'error' = 'success') => {
  // Feedback Sonoro
  const audio = new Audio(type === 'success' ? '/success.mp3' : '/error.mp3');
  audio.play().catch(() => console.warn("Interação do usuário necessária para som"));

  // Criar elemento
  const toast = document.createElement('div');
  
  // Estilo "Tiger" - Adicionando transição de entrada suave
  toast.className = `fixed bottom-8 right-8 px-6 py-4 rounded-2xl text-white font-bold shadow-2xl z-[9999] transition-all duration-300 transform translate-y-0 opacity-100 ${
    type === 'success' ? 'bg-[#ff9500]' : 'bg-red-600'
  }`;
  
  toast.innerText = message;
  document.body.appendChild(toast);

  // Animação de saída
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 2700);
};