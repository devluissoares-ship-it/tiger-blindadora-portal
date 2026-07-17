"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Eye, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from "@/lib/supabase";

export default function LoginClientePage() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Função aprimorada para garantir que o som toque sem interrupções bruscas
  const playSoundAndRedirect = (url: string) => {
    const audio = new Audio('/click.mp3');
    
    // Tenta tocar o som
    audio.play().catch(() => {});

    // Aguarda um tempo curto (600ms) para o som fluir antes de trocar a página
    // Isso evita o "corte" seco no áudio
    setTimeout(() => {
      window.location.href = url;
    }, 600);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: dbError } = await supabase
        .from("clientes")
        .select("id, senha")
        .eq("id", id)
        .eq("senha", senha)
        .single();

      if (dbError || !data) {
        // Se errar a senha, toca um som diferente ou apenas mostra o erro
        setError("Credenciais inválidas. Verifique o ID e a Senha.");
        setLoading(false);
      } else {
        // Sucesso: toca o som e redireciona com fluidez
        playSoundAndRedirect(`/portal/${data.id}`);
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center p-4 font-sans text-white">
      <div className="flex w-full max-w-5xl h-[600px] bg-[#111111] rounded-2xl overflow-hidden border border-[#222] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        
        {/* Lado Esquerdo */}
        <div 
          className="hidden md:block w-1/2 relative bg-no-repeat bg-cover" 
          style={{ 
            backgroundImage: "url('/login-bg.png')",
            backgroundPosition: "right 100% center" 
          }} 
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#111111]/90 flex flex-col justify-end p-12">
             <img src="/logo-tiger.png" alt="Tiger Logo" className="w-24 mb-4" />
             <p className="text-[#ff9500] font-bold tracking-widest text-sm uppercase">Excelência em Blindagem</p>
          </div>
        </div>
        
        {/* Lado Direito */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center items-center">
          <div className="w-full max-w-sm">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-[#1a1a1a] rounded-full border border-[#ff9500]/20">
                <Lock className="w-8 h-8 text-[#ff9500]" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-center mb-1">LOGIN <span className="text-[#ff9500]">CLIENTE</span></h1>
            <p className="text-gray-500 text-center text-sm mb-10">Acesse o progresso do seu projeto</p>
              
            {error && (
              <div className="mb-6 flex items-center gap-2 bg-[#ff9500]/10 border border-[#ff9500] text-[#ff9500] px-4 py-3 rounded-xl font-bold text-sm animate-pulse">
                <AlertCircle className="w-5 h-5" /> {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="relative">
                <User className="absolute left-3 top-3.5 text-gray-600" size={20} />
                <input 
                  className="w-full bg-[#0a0a0a] border border-[#222] text-white p-3 pl-11 rounded-lg outline-none focus:border-[#ff9500] transition-colors"
                  placeholder="ID do Cliente" value={id} onChange={(e) => setId(e.target.value)} required 
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-600" size={20} />
                <input 
                  type={showPassword ? "text" : "password"}
                  className="w-full bg-[#0a0a0a] border border-[#222] text-white p-3 pl-11 pr-11 rounded-lg outline-none focus:border-[#ff9500] transition-colors"
                  placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required 
                />
                <Eye className="absolute right-3 top-3.5 text-gray-600 cursor-pointer hover:text-[#ff9500]" size={20} onClick={() => setShowPassword(!showPassword)} />
              </div>
              
              <button 
                type="submit" disabled={loading}
                className="w-full bg-[#ff9500] hover:bg-[#e08400] text-black font-bold py-4 rounded-lg transition-all shadow-[0_0_15px_rgba(255,149,0,0.3)] disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin mx-auto" /> : "ENTRAR NO PORTAL"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}