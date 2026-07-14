"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from "@/lib/supabase"; // Importação direta
import { LogOut, CalendarDays, Send } from 'lucide-react';
import { playClick, playNotification } from "@/lib/audio";
import { Cliente } from "@/types/cliente"; // Importação da sua interface

export default function DashboardCliente() {
  const { id } = useParams();
  const router = useRouter();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [resposta, setResposta] = useState("");
  const [loading, setLoading] = useState(false);
  const [pergunta, setPergunta] = useState("");

  // Busca direta no Supabase ao carregar
  useEffect(() => {
    const fetchCliente = async () => {
      if (!id) return;
      const decodedId = decodeURIComponent(id as string);
      
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', decodedId)
        .single();

      if (!error && data) {
        setCliente(data);
      }
    };

    fetchCliente();
  }, [id]);

  const handleConsultaIA = async (perguntaCustomizada?: string) => {
    if (!cliente) return;
    playClick();
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
          nivelBlindagem: (cliente as any).nivelBlindagem || 'Nível III-A',
          tipoRevisao: cliente.tipoRevisao,
          dataRevisao: cliente.dataRevisao,
          isUserAdmin: false
        }),
      });
      
      const resData = await response.json();
      playNotification();
      setResposta(resData.text || "Consulte seu consultor técnico diretamente.");
    } catch (e) {
      setResposta("Erro ao consultar a rede Tiger Tech. Tente novamente.");
    }
    setLoading(false);
  };

  const handleLogout = () => {
    playClick();
    router.push('/login-cliente');
  };

  if (!cliente) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
      Carregando dados do veículo...
    </div>
  );

  return (
    <main className="min-h-screen bg-[#050505] text-white p-4 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Olá, {cliente.nome?.split(' ')[0]}!</h1>
          <p className="text-gray-400">Acompanhe em tempo real a blindagem do seu {cliente.veiculo}.</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 bg-[#222] hover:bg-red-900/30 px-4 py-2 rounded-lg font-bold transition">
          <LogOut size={18} /> Sair
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111111] p-6 rounded-xl border border-[#222]">
            <h2 className="text-lg font-bold mb-4">Progresso do Projeto ({cliente.progresso || 0}%)</h2>
            <div className="w-full bg-[#050505] h-4 rounded-full overflow-hidden border border-[#222]">
              <div className="bg-[#ff9500] h-full transition-all duration-500" style={{ width: `${cliente.progresso || 0}%` }}></div>
            </div>
            <p className="mt-2 text-sm text-gray-400">Etapa {cliente.etapaAtual || 1}: <span className="text-white font-bold">{cliente.status || "Em processamento"}</span></p>
          </div>

          <div className="bg-[#111111] p-6 rounded-xl border border-[#222]">
            <h2 className="text-lg font-bold mb-4">Acompanhamento em Fotos</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(cliente.historicoFotos || []).map((foto: any, i: number) => (
                <div key={i} className="flex flex-col gap-1">
                  <img src={foto.url} className="w-full h-32 object-cover rounded-lg border border-[#222]" alt={foto.descricao} />
                  <p className="text-[10px] text-gray-500 uppercase truncate">{foto.titulo || "Progresso"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#111] p-6 rounded-xl border border-[#222] flex flex-col items-center text-center">
            <h2 className="font-bold text-[#ff9500] mb-4">Consultor Técnico IA</h2>
            <button onClick={() => handleConsultaIA()} className="w-full bg-[#ff9500] text-black font-bold py-3 rounded-lg hover:bg-white transition-all mb-4">
              {loading ? "ANALISANDO..." : "EXPLICAR ETAPA ATUAL"}
            </button>

            <div className="w-full flex gap-2">
              <input 
                className="flex-1 bg-black border border-[#222] p-3 rounded-lg text-sm outline-none focus:border-[#ff9500]"
                placeholder="Dúvida específica? Pergunte..."
                value={pergunta}
                onChange={(e) => setPergunta(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleConsultaIA(pergunta)}
              />
              <button onClick={() => handleConsultaIA(pergunta)} className="bg-[#222] p-3 rounded-lg hover:bg-[#ff9500] transition">
                <Send size={18} />
              </button>
            </div>
            {resposta && <div className="mt-4 p-4 bg-black rounded-lg text-sm text-gray-300 border border-[#222] text-left">{resposta}</div>}
          </div>

          {cliente.dataRevisao && (
            <div className="bg-[#1a0505] p-6 rounded-xl border border-red-900/50">
              <div className="flex items-center gap-2 text-red-500 mb-2">
                <CalendarDays size={18} />
                <h2 className="font-bold">Revisão Agendada</h2>
              </div>
              <p className="text-xl font-bold">
                {new Date(cliente.dataRevisao).toLocaleDateString('pt-BR')}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}