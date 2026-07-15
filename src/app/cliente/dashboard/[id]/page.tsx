"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from "@/lib/supabase";
import { LogOut, Send, Loader2, Info } from 'lucide-react';
import { Cliente } from "@/types/cliente";

export default function DashboardCliente() {
  const { id } = useParams();
  const router = useRouter();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [resposta, setResposta] = useState("");
  const [loading, setLoading] = useState(false);
  const [pergunta, setPergunta] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchCliente = async () => {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', decodeURIComponent(id as string))
        .single();

      if (!error && data) setCliente(data);
    };
    fetchCliente();
  }, [id]);

  const handleConsultaIA = async (perguntaCustomizada?: string) => {
    if (!cliente) return;
    setLoading(true);
    setResposta("");
    
    try {
      const response = await fetch('/api/chat-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomeCliente: cliente.nome,
          status: perguntaCustomizada ? `Dúvida: ${perguntaCustomizada}` : cliente.status,
          veiculo: cliente.veiculo,
          nivelBlindagem: cliente.nivel_blindagem,
          isUserAdmin: false
        }),
      });
      
      const resData = await response.json();
      setResposta(resData.text || "Consulte seu consultor técnico diretamente.");
    } catch (e) {
      setResposta("Erro ao consultar a rede Tiger Tech. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!cliente) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#ff9500]">
      <Loader2 className="animate-spin" size={48} />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#050505] text-white p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#ff9500]">TIGER.</h1>
          <p className="text-gray-500 text-sm">{cliente.nome} | {cliente.veiculo}</p>
        </div>
        <button onClick={() => router.push('/login-cliente')} className="text-gray-500 hover:text-white transition">
          <LogOut size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111111] p-6 rounded-2xl border border-[#222]">
            <h2 className="text-xs font-bold uppercase tracking-widest text-[#ff9500] mb-4">Progresso: {cliente.progresso}%</h2>
            <div className="w-full bg-black h-3 rounded-full border border-[#222] overflow-hidden">
              <div className="bg-[#ff9500] h-full transition-all duration-1000" style={{ width: `${cliente.progresso}%` }}></div>
            </div>
            <p className="mt-4 text-sm">Etapa Atual: <span className="font-bold text-white">{cliente.status}</span></p>
          </div>

          {/* Galeria de Fotos */}
          <div className="bg-[#111111] p-6 rounded-2xl border border-[#222]">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-4 text-[#ff9500]">Registro Fotográfico</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {cliente.historico_fotos?.length > 0 ? (
                cliente.historico_fotos.map((foto, i) => (
                  <div key={i} className="bg-black p-2 rounded-xl border border-[#222]">
                    <img src={foto.url} className="w-full h-32 object-cover rounded-lg" alt="Progresso" />
                    <p className="text-[10px] mt-2 text-gray-400">{foto.descricao}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600 text-sm">Nenhuma foto disponível no momento.</p>
              )}
            </div>
          </div>
        </div>

        {/* Coluna Lateral - IA e Informações */}
        <div className="space-y-6">
          <div className="bg-[#111111] p-6 rounded-2xl border border-[#222]">
            <h2 className="font-bold text-[#ff9500] mb-4 text-sm uppercase">Consultor Técnico IA</h2>
            <button onClick={() => handleConsultaIA()} className="w-full bg-[#ff9500] text-black font-bold py-3 rounded-lg hover:bg-white transition mb-4">
              {loading ? "Processando..." : "Explicar Etapa"}
            </button>
            <div className="flex gap-2">
              <input 
                className="flex-1 bg-black border border-[#222] p-3 rounded-lg text-sm outline-none"
                placeholder="Dúvida?"
                value={pergunta}
                onChange={(e) => setPergunta(e.target.value)}
              />
              <button onClick={() => handleConsultaIA(pergunta)} className="bg-[#222] px-4 rounded-lg hover:bg-[#ff9500] transition"><Send size={18} /></button>
            </div>
            {resposta && <div className="mt-4 text-xs text-gray-300 p-4 bg-black rounded-lg border border-[#222]">{resposta}</div>}
          </div>
          
          <div className="bg-[#111111] p-6 rounded-2xl border border-[#222] text-sm text-gray-400 space-y-2">
             <div className="flex items-center gap-2 text-[#ff9500]"><Info size={16}/> Dados do Veículo</div>
             <p>Placa: <span className="text-white">{cliente.placa || "N/A"}</span></p>
             <p>Blindagem: <span className="text-white">{cliente.nivel_blindagem || "III-A"}</span></p>
          </div>
        </div>
      </div>
    </main>
  );
}