"use client";

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Lock, User, Eye, ShieldCheck, AlertCircle } from 'lucide-react';
import { loginAdmin } from '@/lib/auth'; // A nova ação que criamos

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Feedback sonoro (opcional)
    const audio = new Audio('/click.mp3');
    audio.play().catch(() => {});

    startTransition(async () => {
      // Chama a Server Action de autenticação segura
      const result = await loginAdmin(formData.email, formData.password);

      if (result.success) {
        router.push('/admin/dashboard');
        router.refresh(); // Garante que a sessão seja carregada
      } else {
        setError("Acesso negado: Credenciais inválidas ou sem autorização.");
      }
    });
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-[#050505] p-4 font-sans text-white">
      {error && (
        <div className="fixed top-5 flex items-center gap-2 bg-[#ff9500] text-black px-6 py-3 rounded-lg font-bold shadow-2xl z-50 animate-in fade-in slide-in-from-top-4">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="flex w-full max-w-5xl h-[600px] bg-[#111111] rounded-2xl overflow-hidden border border-[#222] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        {/* Lado Esquerdo: Imagem de fundo */}
        <div 
          className="hidden md:block w-1/2 relative bg-no-repeat bg-cover" 
          style={{ 
            backgroundImage: "url('/login-bg.png')",
            backgroundPosition: "right 100% center" 
          }} 
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#111111]/90" />
        </div>

        {/* Lado Direito: Formulário */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center items-center">
          <div className="w-full max-w-sm">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-[#1a1a1a] rounded-full border border-[#ff9500]/20">
                <Lock className="w-8 h-8 text-[#ff9500]" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-center mb-1">ACESSO <span className="text-[#ff9500]">ADMINISTRATIVO</span></h1>
            <p className="text-gray-500 text-center text-sm mb-10">Painel de Gestão Tiger Blindadora</p>

            <form className="space-y-5" onSubmit={handleLogin}>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-600" />
                <input 
                  type="text" 
                  placeholder="Usuário ou e-mail"
                  className="w-full bg-[#0a0a0a] border border-[#222] text-white p-3 pl-11 rounded-lg outline-none focus:border-[#ff9500] transition-colors"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
              
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-600" />
                <input 
                  type="password" 
                  placeholder="Senha"
                  className="w-full bg-[#0a0a0a] border border-[#222] text-white p-3 pl-11 pr-11 rounded-lg outline-none focus:border-[#ff9500] transition-colors"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                />
                <Eye className="absolute right-3 top-3.5 w-5 h-5 text-gray-600 cursor-pointer" />
              </div>

              <button 
                type="submit" 
                disabled={isPending}
                className="w-full bg-[#ff9500] hover:bg-[#e08400] text-black font-bold py-4 rounded-lg transition-all shadow-[0_0_15px_rgba(255,149,0,0.3)] disabled:opacity-50"
              >
                {isPending ? "Validando..." : "Entrar no Painel"}
              </button>
            </form>

            <div className="mt-10 pt-6 border-t border-[#222] flex items-center justify-center gap-2 text-gray-600">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs">Sistema seguro e monitorado</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}