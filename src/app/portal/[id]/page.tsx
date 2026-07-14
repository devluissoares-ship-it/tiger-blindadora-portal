"use client";

import { useDB } from "@/hooks/useDB";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Zap, Calendar, Send } from "lucide-react";
import { playClick, playNotification } from "@/lib/audio";

export default function DashboardCliente({ params }: { params: { id: string } }) {
  const { data } = useDB();
  const [cliente, setCliente] = useState<any>(null);
  const [resposta, setResposta] = useState("");
  const [loading, setLoading] = useState(false);
  const [pergunta, setPergunta] = useState("");

  useEffect(() => {
    if (data?.clientes) {
      const found = data.clientes.find((c: any) => c.id === params.id);
      setCliente(found || null);
    }
  }, [data, params.id]);

  const handleConsultaIA = async (duvidaCustomizada?: string) => {
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
          status: duvidaCustomizada ? `Dúvida: ${duvidaCustomizada}` : cliente.status,
          veiculo: cliente.veiculo,
          nivelBlindagem: cliente.nivel_blindagem || cliente.nivelBlindagem || 'Nível III-A',
          tipoRevisao: cliente.tipo_revisao || cliente.tipoRevisao,
          dataRevisao: cliente.data_revisao || cliente.dataRevisao,
          isUserAdmin: false
        }),
      });
      
      const resData = await response.json();
      if (!response.ok) throw new Error("Erro na rede");
      
      playNotification();
      setResposta(resData.text || "Consulte seu consultor técnico diretamente.");
    } catch (e) {
      setResposta("Erro ao consultar a rede Tiger Tech. Tente novamente.");
    }
    setLoading(false);
  };

  if (!cliente) return <div className="p-8 text-center text-gray-500">Localizando projeto no sistema Tiger...</div>;

  // Normalização para garantir que as fotos apareçam independentemente de como o banco entrega
  const listaFotos = cliente.historico_fotos || cliente.historicoFotos || cliente.imagens || [];

  return (
    <main className="min-h-screen bg-[#050505] text-white p-6 md:p-12">
      <style jsx global>{`
        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 5px #ff9500); transform: scale(1); }
          50% { filter: drop-shadow(0 0 25px #ff9500); transform: scale(1.05); }
        }
        .tiger-tech { animation: pulse-glow 3s infinite ease-in-out; }
      `}</style>

      {/* Header */}
      <header className="flex justify-between items-center mb-12">
        <Image src="/logo-tiger.png" alt="Tiger" width={160} height={50} />
        <div className="text-right">
          <h1 className="text-xl font-bold text-[#ff9500]">{cliente.nome}</h1>
          <p className="text-sm text-gray-500">{cliente.veiculo} • {cliente.nivel_blindagem || cliente.nivelBlindagem || 'Nível III-A'}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-[#111] p-8 rounded-3xl border border-[#222]">
            <div className="flex justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#ff9500]">Status da Blindagem</h2>
              <span className="font-mono text-[#ff9500]">{cliente.progresso || 0}%</span>
            </div>
            <div className="w-full bg-black h-3 rounded-full border border-[#222] overflow-hidden">
              <div className="h-full bg-[#ff9500] transition-all duration-1000" style={{ width: `${cliente.progresso || 0}%` }} />
            </div>
            <p className="mt-4 text-2xl font-bold uppercase">{cliente.status}</p>
          </div>

          <div className="bg-[#111] p-8 rounded-3xl border border-[#222]">
            <h2 className="text-xs font-bold mb-6 uppercase tracking-widest text-[#ff9500]">Galeria de Acompanhamento</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {listaFotos.length > 0 ? listaFotos.map((foto: any, i: number) => {
                const url = typeof foto === 'string' ? foto : foto.url;
                const desc = typeof foto === 'string' ? "Progresso da blindagem" : (foto.descricao || "Progresso");
                return (
                  <div key={i} className="bg-[#1a1a1a] p-2 rounded-xl border border-[#222]">
                    <img src={url} className="w-full aspect-video object-cover rounded-lg" alt={`Etapa ${i}`} />
                    <p className="text-[#ff9500] text-xs font-bold mt-3 px-1 uppercase tracking-wider">{desc}</p>
                  </div>
                );
              }) : <p className="text-gray-600">Fotos serão carregadas conforme o progresso.</p>}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-[#111] p-8 rounded-3xl border border-[#222] flex flex-col items-center text-center">
            <div className="tiger-tech mb-8 p-1">
              <Image src="/tigre-ia.png" alt="IA" width={180} height={180} className="rounded-full border-4 border-[#ff9500]/20" />
            </div>
            <h2 className="font-bold text-xl mb-4 text-[#ff9500]">Consultor Técnico IA</h2>
            
            <button 
              onClick={() => handleConsultaIA()} 
              className="w-full bg-[#ff9500] text-black font-bold py-4 rounded-xl hover:bg-white transition-all transform hover:scale-[1.02] mb-4"
            >
              {loading ? "ANALISANDO..." : "EXPLICAR ETAPA"}
            </button>

            <div className="w-full flex gap-2">
              <input 
                className="flex-1 bg-black border border-[#222] p-4 rounded-xl text-sm outline-none focus:border-[#ff9500]"
                placeholder="Dúvida específica?"
                value={pergunta}
                onChange={(e) => setPergunta(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleConsultaIA(pergunta)}
              />
              <button 
                onClick={() => handleConsultaIA(pergunta)}
                className="bg-[#222] p-4 rounded-xl hover:bg-[#ff9500] hover:text-black transition-all"
              >
                <Send size={20} />
              </button>
            </div>

            {resposta && <div className="mt-6 p-5 bg-black rounded-xl text-sm text-gray-300 border border-[#222] w-full text-left">{resposta}</div>}
          </div>

          <div className="bg-[#111] p-6 rounded-3xl border border-[#222]">
            <div className="flex items-center gap-2 text-[#ff9500] mb-2">
              <Calendar size={16} />
              <span className="text-xs font-bold uppercase">Próxima Revisão</span>
            </div>
            <p className="text-lg font-bold">
              {cliente.data_revisao || cliente.dataRevisao ? new Date(cliente.data_revisao || cliente.dataRevisao).toLocaleDateString('pt-BR') : "Agendar"}
            </p>
          </div>
        </div>
      </div>

      <a href="https://wa.me/5511991343588" target="_blank" onClick={playClick} className="fixed bottom-8 right-8 bg-[#111] border border-[#ff9500] text-[#ff9500] px-6 py-4 rounded-full font-bold flex items-center gap-3 hover:bg-[#ff9500] hover:text-black transition-all shadow-[0_0_20px_rgba(255,149,0,0.4)]">
        <Zap size={20} />
        <span>FALAR COM EQUIPE</span>
      </a>
    </main>
  );
}