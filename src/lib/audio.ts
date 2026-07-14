// lib/audio.ts

export const playClick = () => {
  const audio = new Audio('/clickbuton.mp3');
  audio.volume = 0.5; // Ajuste o volume se precisar
  audio.play().catch(() => {});
};

export const playNotification = () => {
  const audio = new Audio('/notification.mp3');
  audio.volume = 0.7;
  audio.play().catch(() => {});
};