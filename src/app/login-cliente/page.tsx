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
        setError("Credenciais inválidas. Verifique o ID e a Senha.");
      } else {
        window.location.href = `/portal/${data.id}`;
      }
    } catch (err) {
      setError("Erro ao conectar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      {/* Container Principal: Divide em duas colunas no desktop, empilha no celular */}
      <div className="w-full max-w-5xl bg-[#111] border border-[#222] rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row items-center">
        
        {/* Lado Esquerdo: Imagem (como no Admin) */}
        <div 
          className="w-full md:w-1/2 h-64 md:h-[500px] bg-cover bg-center flex items-center justify-center" 
          style={{ backgroundImage: "url('/login-bg.png')" }}
        >
            <div className="bg-black/60 p-6 rounded-2xl backdrop-blur-md border border-white/10 text-center">
                <img src="/logo-tiger.png" alt="Tiger Logo" className="h-16 w-auto mx-auto mb-4" />
                <h2 className="text-white font-bold text-xl tracking-[0.2em]">PORTAL TIGER</h2>
            </div>
        </div>
        
        {/* Lado Direito: Formulário */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <div className="max-w-sm mx-auto">
              <h1 className="text-2xl font-bold text-white mb-8">LOGIN <span className="text-[#ff9500]">CLIENTE</span></h1>
              
              {error && (
                <div className="mb-6 flex items-center gap-2 bg-[#ff9500]/10 border border-[#ff9500] text-[#ff9500] px-4 py-3 rounded-xl font-bold text-sm">
                  <AlertCircle className="w-5 h-5" /> {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-gray-500" size={20} />
                  <input 
                    className="w-full bg-[#0a0a0a] border border-[#222] text-white p-4 pl-12 rounded-xl outline-none focus:border-[#ff9500] transition"
                    placeholder="ID do Cliente" value={id} onChange={(e) => setId(e.target.value)} required 
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-gray-500" size={20} />
                  <input 
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-[#0a0a0a] border border-[#222] text-white p-4 pl-12 rounded-xl outline-none focus:border-[#ff9500] transition"
                    placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} required 
                  />
                  <Eye className="absolute right-4 top-3.5 text-gray-500 cursor-pointer hover:text-[#ff9500]" size={20} onClick={() => setShowPassword(!showPassword)} />
                </div>
                
                <button 
                  type="submit" disabled={loading}
                  className="w-full bg-[#ff9500] text-black font-bold py-4 rounded-xl hover:bg-white transition flex justify-center mt-6"
                >
                  {loading ? <Loader2 className="animate-spin" /> : "ENTRAR NO PORTAL"}
                </button>
              </form>
          </div>
        </div>
      </div>
    </main>
  );
}