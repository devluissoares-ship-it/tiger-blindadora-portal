"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Send, Camera, ShieldCheck, Car, Hash } from 'lucide-react';
import { useDB } from "@/hooks/useDB"; // Importação correta do seu hook

const ETAPAS = ['Entrada', 'Triagem', 'Desmontagem', 'Estrutura', 'Portas', 'Vidros', 'Acabamento', 'Testes', 'Finalização', 'Entrega', 'Pós-Venda'];

export default function DashboardCliente({ params }: { params: { id: string } }) {
  const { data } = useDB(); // Agora buscamos do Supabase via useDB
  const [cliente, setCliente] = useState<any>(null);
  const [resposta, setResposta] = useState("");
  const [loading, setLoading] = useState(false);
  const [pergunta, setPergunta] = useState("");

  // Efeito para sincronizar quando o dado do Supabase carregar
  useEffect(() => {
    if (data?.clientes) {
      const found = data.clientes.find((c: any) => c.id === params.id);
      setCliente(found || null);
    }
  }, [data, params.id]);

  const indexStatus = ETAPAS.indexOf(cliente?.status || 'Entrada');
  const progressoPorcentagem = cliente?.progresso || ((indexStatus + 1) / ETAPAS.length) * 100;

  const handleConsultaIA = async (perguntaCustomizada?: string) => {
    if (!cliente) return;
    setLoading(true);
    setResposta("");
    try {
      const response = await fetch('/api/chat-status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: perguntaCustomizada ? `Dúvida: ${perguntaCustomizada}` : cliente.status,
          veiculo: cliente.veiculo,
          nivelBlindagem: cliente.nivelBlindagem || 'Nível III-A',
          nomeCliente: cliente.nome 
        }),
      });
      const data = await response.json();
      setResposta(data.text || "Consulte seu consultor técnico diretamente.");
    } catch (e) {
      setResposta("Erro ao consultar a rede Tiger Tech. Tente novamente.");
    }
    setLoading(false);
  };

  if (!cliente) return <div className="p-8 text-white min-h-screen bg-[#000000]">Carregando dados do projeto...</div>;

  return (
    <div className="min-h-screen bg-[#000000] text-white font-sans selection:bg-[#FF5C00] selection:text-black">
      <header className="flex items-center justify-between px-8 py-6 border-b border-[#1A1A1A]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 relative"><Image src="/logo-tiger.png" alt="Tiger" fill className="object-contain" /></div>
          <div>
            <h1 className="text-xl font-bold tracking-widest uppercase">Tiger <span className="text-[#FF5C00]">Tracking</span></h1>
            <p className="text-xs text-gray-500">Olá, {cliente.nome}</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 md:p-12 space-y-8">
        
        <div className="p-8 rounded-xl bg-[#0A0A0A] border border-[#1A1A1A]">
          <h2 className="text-sm text-gray-500 uppercase tracking-widest mb-2">Fase Atual</h2>
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-4xl font-bold">{cliente.status || "Entrada"}</h3>
            <span className="text-[#FF5C00] font-bold text-2xl">{Math.round(progressoPorcentagem)}%</span>
          </div>
          <div className="w-full bg-[#111] h-2 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#FF5C00] to-[#FF3300] transition-all duration-1000" style={{ width: `${progressoPorcentagem}%` }} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg flex items-center gap-3">
            <ShieldCheck className="text-[#FF5C00]" />
            <div>
              <p className="text-[10px] text-gray-500 uppercase">Blindagem</p>
              <p className="font-bold">{cliente.nivelBlindagem || "---"}</p>
            </div>
          </div>
          <div className="p-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg flex items-center gap-3">
            <Car className="text-[#FF5C00]" />
            <div>
              <p className="text-[10px] text-gray-500 uppercase">Veículo/Placa</p>
              <p className="font-bold">{cliente.modelo || cliente.veiculo}</p>
              <p className="text-[10px] text-gray-400">{cliente.placa || "Sem placa"}</p>
            </div>
          </div>
          <div className="p-4 bg-[#0A0A0A] border border-[#1A1A1A] rounded-lg flex items-center gap-3">
            <Hash className="text-[#FF5C00]" />
            <div>
              <p className="text-[10px] text-gray-500 uppercase">Chassi</p>
              <p className="font-bold">{cliente.chassi || "---"}</p>
            </div>
          </div>
        </div>

        <div className="p-8 rounded-xl bg-[#0A0A0A] border border-[#1A1A1A]">
          <h3 className="text-[#FF5C00] font-bold mb-6 flex items-center gap-2">
            <Camera size={20} /> Acompanhamento Visual
          </h3>
          {/* Corrigido para ler historicoFotos do Supabase */}
          {cliente.historicoFotos && cliente.historicoFotos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {cliente.historicoFotos.map((item: any, idx: number) => (
                <div key={idx} className="group cursor-pointer">
                  <div className="aspect-video rounded overflow-hidden border border-[#222] mb-2">
                    <img src={item.url} alt={item.descricao || "Progresso"} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  </div>
                  <p className="text-[10px] text-[#FF5C00] uppercase font-bold tracking-wider">{item.descricao || "Progresso"}</p>
                </div>
              ))}
            </div>
          ) : <p className="text-gray-500 text-sm">Nenhuma foto disponível no momento.</p>}
        </div>

        <div className="p-8 rounded-xl bg-[#0A0A0A] border border-[#1A1A1A] space-y-4">
          <h4 className="text-[#FF5C00] font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF5C00] animate-pulse" /> IA TIGER CONSULTING
          </h4>
          <button onClick={() => handleConsultaIA()} className="w-full bg-[#1A1A1A] hover:bg-[#FF5C00] hover:text-black py-2 rounded text-sm transition-all">
            {loading ? "PROCESSANDO..." : "EXPLICAR ETAPA ATUAL"}
          </button>
          <div className="flex gap-2">
            <input 
              className="flex-1 bg-black border border-[#222] p-3 rounded text-sm outline-none focus:border-[#FF5C00]"
              placeholder={`Dúvida sobre a fase de ${cliente.status}?`}
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleConsultaIA(pergunta)}
            />
            <button onClick={() => handleConsultaIA(pergunta)} className="bg-[#1A1A1A] px-4 rounded hover:bg-[#FF5C00] transition">
              <Send size={18} />
            </button>
          </div>
          {resposta && <p className="text-gray-400 text-sm p-4 bg-black rounded border border-[#222] animate-in fade-in">{resposta}</p>}
        </div>
      </main>
    </div>
  );
}