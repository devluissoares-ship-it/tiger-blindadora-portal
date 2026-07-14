import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" className="h-full">
      <body className="h-full bg-[#0a0a0a] text-white">
        {/* Pre-carregamento dos arquivos de áudio para evitar atrasos */}
        <audio id="audio-click" src="/clickbuton.mp3" preload="auto" />
        <audio id="audio-notification" src="/notification.mp3" preload="auto" />
        
        {children}
      </body>
    </html>
  );
}