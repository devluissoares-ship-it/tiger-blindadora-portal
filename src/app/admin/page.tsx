'use client';
import { useState } from 'react';
import { playClick, playNotification } from "@/lib/audio";

export default function PainelAdmin() {
  // Simulação dos dados - em produção, isso viria de um fetch('/api/clientes')
  const [clientes, setClientes] = useState([
    { id: 'tiger-001', nome: 'Cliente VIP', telefone: '5511999999999', veiculo: 'Range Rover Velar', status: 'Triagem', revisao: '2026-12-30', foto: '' }
  ]);

  const atualizarCliente = async (id: string, campo: string, valor: string) => {
    playClick(); // Som ao interagir com campos
    
    // Atualiza localmente
    const novosClientes = clientes.map(c => c.id === id ? { ...c, [campo]: valor } : c);
    setClientes(novosClientes);

    // Persiste no seu JSON via API
    await fetch('/api/update-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, [campo]: valor })
    });
    
    playNotification(); // Som de sucesso após a atualização
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white p-8 font-sans">
      <header className="mb-10 border-b border-[#222] pb-6">
        <h1 className="text-4xl font-bold text-[#FF5C00] uppercase tracking-widest">Painel Tiger</h1>
        <p className="text-[#555]">Centro de Controle de Blindagem</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {clientes.map((c) => (
          <div key={c.id} className="bg-[#0A0A0A] p-8 rounded-3xl border border-[#222] shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold">{c.nome}</h2>
                <p className="text-[#FF5C00]">{c.veiculo}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-[#555] uppercase">ID: {c.id}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* STATUS */}
              <div>
                <label className="text-[9px] text-[#555] uppercase mb-1 block">Status de Produção</label>
                <select 
                  className="w-full bg-[#000] p-4 rounded-xl border border-[#222] text-sm"
                  value={c.status}
                  onChange={(e) => atualizarCliente(c.id, 'status', e.target.value)}
                >
                  {['Entrada', 'Triagem', 'Desmontagem', 'Blindagem', 'Remontagem', 'Testes', 'Entrega'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* DATA DE REVISÃO */}
              <div>
                <label className="text-[9px] text-[#555] uppercase mb-1 block">Data da Próxima Revisão</label>
                <input 
                  type="date"
                  className="w-full bg-[#000] p-4 rounded-xl border border-[#222] text-sm"
                  value={c.revisao}
                  onChange={(e) => atualizarCliente(c.id, 'revisao', e.target.value)}
                />
              </div>

              {/* FOTO DA TRIAGEM */}
              <div>
                <label className="text-[9px] text-[#555] uppercase mb-1 block">Link da Foto (Triagem/Progresso)</label>
                <input 
                  type="text" 
                  placeholder="URL da Imagem..."
                  className="w-full bg-[#000] p-4 rounded-xl border border-[#222] text-sm mb-4"
                  onChange={(e) => atualizarCliente(c.id, 'foto', e.target.value)}
                />
              </div>

              {/* AÇÕES */}
              <a 
                href={`https://wa.me/${c.telefone}?text=Olá ${c.nome}, o status do seu veículo foi atualizado para: ${c.status}.`}
                target="_blank"
                onClick={playClick}
                className="w-full bg-[#FF5C00] text-black font-bold py-4 rounded-xl text-center uppercase tracking-widest text-xs hover:bg-white transition-all"
              >
                Notificar via WhatsApp
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}