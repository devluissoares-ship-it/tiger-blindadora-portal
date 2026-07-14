"use client";

import { useDB } from "@/hooks/useDB";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { playNotification } from "@/lib/audio";
import { Upload, X, Camera, Lock, Car, Hash, MessageCircle } from "lucide-react";

interface FormData {
  id: string;
  nome: string;
  telefone: string;
  veiculo: string;
  modelo: string;
  anoModelo: string;
  placa: string;
  chassi: string;
  senha: string;
  nivelBlindagem: string;
  status: string;
  progresso: number;
  tipoRevisao: string;
  dataRevisao: string;
  horaRevisao: string;
  etapaAtual: number;
  imagens: any[];
  [key: string]: any;
}

export default function EditarCliente({ params }: { params: { id: string } }) {
  const { data, updateCliente } = useDB();
  const router = useRouter();
  
  // Encontra o cliente de forma estável
  const cliente = data?.clientes?.find((c: any) => c.id === params.id);
  
  const [formData, setFormData] = useState<FormData | null>(null);

  // useEffect corrigido para evitar loops e lentidão
  useEffect(() => {
    if (cliente && !formData) {
      setFormData({
        ...cliente,
        imagens: cliente.historicoFotos || [],
        senha: cliente.senha || "",
        id: cliente.id,
        etapaAtual: cliente.etapaAtual || 1
      });
    }
  }, [cliente]); // Dependência apenas no objeto cliente

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0] && formData) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const novaImagemUrl = event.target?.result as string;
        setFormData((prev: any) => ({
          ...prev,
          imagens: [...(prev?.imagens || []), { url: novaImagemUrl, descricao: "Nova etapa" }]
        }));
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const removeImagem = (index: number) => {
    if (!formData) return;
    setFormData((prev: any) => ({
      ...prev,
      imagens: prev.imagens.filter((_: any, i: number) => i !== index)
    }));
  };

  const updateDescricao = (index: number, novaDescricao: string) => {
    if (!formData) return;
    const novasImagens = [...formData.imagens];
    novasImagens[index] = { ...novasImagens[index], descricao: novaDescricao };
    setFormData({ ...formData, imagens: novasImagens });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;
    
    try {
      const dadosParaEnviar = {
        ...formData,
        historicoFotos: formData.imagens,
        progresso: Number(formData.progresso || 0),
        etapaAtual: Number(formData.etapaAtual || 1)
      };
      
      await updateCliente(params.id, dadosParaEnviar);
      playNotification();
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Erro ao salvar:", error);
      alert("⚠️ Erro ao salvar dados. Verifique a conexão.");
    }
  };

  if (!formData) return <div className="p-8 text-white">Carregando dados do projeto...</div>;

  return (
    <main className="p-8 text-white min-h-screen bg-[#050505]">
      <h1 className="text-2xl font-bold mb-6">Editar Projeto: {formData.nome}</h1>
      
      <form onSubmit={handleSubmit} className="bg-[#111111] p-6 rounded-xl border border-[#222] max-w-2xl space-y-6">
        
        <div className="bg-[#1a1a1a] p-4 rounded border border-[#ff9500]/20">
          <h3 className="text-[10px] uppercase text-[#ff9500] font-bold mb-3 flex items-center gap-2">
            <Camera size={14} /> Acompanhamento Visual
          </h3>
          <div className="space-y-4 mb-4">
            {formData.imagens?.map((img: any, index: number) => (
              <div key={index} className="flex gap-4 items-center bg-black p-2 rounded border border-[#333]">
                <div className="relative w-16 h-16 shrink-0 rounded overflow-hidden">
                  <img src={typeof img === 'string' ? img : img.url} alt="Etapa" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImagem(index)} className="absolute top-0 right-0 bg-red-600 p-0.5 rounded-bl"><X size={12}/></button>
                </div>
                <input 
                  className="flex-1 bg-transparent p-2 border-b border-[#333] focus:border-[#ff9500] outline-none text-sm"
                  value={img.descricao || "Progresso"}
                  onChange={(e) => updateDescricao(index, e.target.value)}
                  placeholder="Descrição da etapa..."
                />
              </div>
            ))}
          </div>
          <label className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-[#333] rounded cursor-pointer hover:border-[#ff9500]">
            <Upload size={16} /> <span>Adicionar foto da etapa</span>
            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 flex items-center gap-2 bg-black border border-[#222] rounded px-3">
            <Hash size={16} className="text-gray-500"/>
            <input className="w-full p-3 bg-transparent outline-none text-gray-500" value={formData.id || ""} disabled placeholder="ID do Cliente" />
          </div>

          <input className="p-3 bg-black border border-[#222] rounded" value={formData.nome || ""} onChange={(e) => setFormData({...formData, nome: e.target.value})} placeholder="Nome do Cliente" />
          <input className="p-3 bg-black border border-[#222] rounded" value={formData.telefone || ""} onChange={(e) => setFormData({...formData, telefone: e.target.value})} placeholder="WhatsApp" />
          <input className="p-3 bg-black border border-[#222] rounded" value={formData.veiculo || ""} onChange={(e) => setFormData({...formData, veiculo: e.target.value})} placeholder="Veículo" />
          <input className="p-3 bg-black border border-[#222] rounded" value={formData.modelo || ""} onChange={(e) => setFormData({...formData, modelo: e.target.value})} placeholder="Modelo" />
          <input className="p-3 bg-black border border-[#222] rounded" value={formData.anoModelo || ""} onChange={(e) => setFormData({...formData, anoModelo: e.target.value})} placeholder="Ano/Modelo" />
          <input className="p-3 bg-black border border-[#222] rounded" value={formData.placa || ""} onChange={(e) => setFormData({...formData, placa: e.target.value})} placeholder="Placa" />
          <input className="p-3 bg-black border border-[#222] rounded col-span-2" value={formData.chassi || ""} onChange={(e) => setFormData({...formData, chassi: e.target.value})} placeholder="Chassi" />
          
          <div className="col-span-2 flex items-center gap-2 bg-black border border-[#222] rounded px-3">
            <Lock size={16} className="text-gray-500"/>
            <input className="w-full p-3 bg-transparent outline-none" value={formData.senha || ""} onChange={(e) => setFormData({...formData, senha: e.target.value})} placeholder="Senha de Acesso do Cliente" />
          </div>
        </div>

        <div className="bg-[#1a1a1a] p-4 rounded border border-[#222]">
          <h3 className="text-[10px] uppercase text-[#ff9500] font-bold mb-3">📋 Blindagem, Status e Revisão</h3>
          
          <select className="w-full bg-black border border-[#222] rounded p-3 mb-4" value={formData.nivelBlindagem || ""} onChange={(e) => setFormData({...formData, nivelBlindagem: e.target.value})}>
            <option value="">Nível de Blindagem</option>
            <option value="III-A">III-A</option>
            <option value="III">III</option>
          </select>

          <select className="w-full bg-black border border-[#222] rounded p-3 mb-4" value={formData.status || ""} onChange={(e) => setFormData({...formData, status: e.target.value})}>
            {["Entrada", "Desmontagem", "Estrutura", "Portas", "Vidros", "Acabamento", "Testes", "Finalização", "Entrega", "Pós-Venda"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <input type="number" className="w-full bg-black border border-[#222] rounded p-3 mb-4" value={formData.progresso || 0} onChange={(e) => setFormData({...formData, progresso: parseInt(e.target.value)})} placeholder="Progresso %" />

          <input className="w-full bg-black border border-[#222] rounded p-3 mb-2" placeholder="Tipo de Revisão" value={formData.tipoRevisao || ""} onChange={(e) => setFormData({...formData, tipoRevisao: e.target.value})} />
          <div className="grid grid-cols-2 gap-4">
            <input type="date" className="bg-black border border-[#222] rounded p-3" value={formData.dataRevisao || ""} onChange={(e) => setFormData({...formData, dataRevisao: e.target.value})} />
            <input type="time" className="bg-black border border-[#222] rounded p-3" value={formData.horaRevisao || ""} onChange={(e) => setFormData({...formData, horaRevisao: e.target.value})} />
          </div>
        </div>

        <button type="submit" className="w-full bg-[#ff9500] text-black font-bold p-3 rounded mt-4 hover:bg-white transition-all">
          Salvar Dados do Projeto
        </button>

        <button 
          type="button"
          onClick={() => {
            const mensagem = encodeURIComponent(
              `Olá ${formData.nome}! O seu projeto na Tiger Blindagens está em andamento. ` +
              `Acompanhe em tempo real pelo nosso portal: https://tiger-blindadora-portal.vercel.app/portal/${formData.id}\n\n` +
              `ID de Acesso: ${formData.id}\n` +
              `Senha: ${formData.senha}\n\n` +
              `Estamos à disposição!`
            );
            window.open(`https://wa.me/${formData.telefone?.replace(/\D/g, '')}?text=${mensagem}`, '_blank');
          }}
          className="w-full bg-[#25D366] text-white font-bold p-3 rounded mt-2 hover:bg-[#128C7E] transition-all flex items-center justify-center gap-2"
        >
          <MessageCircle size={18} />
          Enviar Acesso via WhatsApp
        </button>
      </form>
    </main>
  );
}