"use client";

import { useState, useEffect } from "react";
import { Loader2, Send, UploadCloud, Percent, Calendar, CheckCircle2, CheckSquare, Camera, Trash2 } from "lucide-react";
import { Cliente, HistoricoFoto } from "@/types/cliente";
import { atualizarCliente } from "@/app/actions/clienteActions";
import { supabase } from "@/lib/supabase";

const playSound = (soundFile: string) => {
  if (typeof window !== 'undefined') {
    new Audio(`/${soundFile}`).play().catch(() => {});
  }
};

export default function EditarCliente({ id, initialData }: { id: string; initialData: Cliente }) {
  const [formData, setFormData] = useState<Cliente>(initialData);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Estados locais para o Checklist e Múltiplas Fotos de Entrada
  const [checklistEntrada, setChecklistEntrada] = useState<any>(
    initialData.checklist_entrada || {
      lataria: false,
      vidros_e_parabrisa: false,
      interior_e_bancos: false,
      painel_e_km: false,
      acessorios_e_pertences: false,
      observacoes: ""
    }
  );

  const [fotosEntrada, setFotosEntrada] = useState<string[]>(
    (initialData as any).fotos_entrada || []
  );

  useEffect(() => { 
    setFormData(initialData); 
    if (initialData.checklist_entrada) {
      setChecklistEntrada(initialData.checklist_entrada);
    }
    if ((initialData as any).fotos_entrada) {
      setFotosEntrada((initialData as any).fotos_entrada);
    }
  }, [initialData]);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Upload automático no Acompanhamento Visual vinculado à fase atual (sem prompts feios)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playSound('click.mp3');
    const fileName = `${id}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from('imagens').upload(fileName, file);
    if (uploadError) { notify("Erro ao subir imagem!"); return; }

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/imagens/${fileName}`;
    
    // Usa a fase atual do projeto (ex: Entrada, Desmontagem, etc.) como título automático
    const faseAtualTitulo = (formData.status || "Atualização").toUpperCase();

    const novaFoto: HistoricoFoto = { 
      url: publicUrl, 
      titulo: faseAtualTitulo, 
      descricao: "" 
    };
    
    const updatedFotos = [...(formData.historico_fotos || []), novaFoto];
    await supabase.from('clientes').update({ historico_fotos: updatedFotos }).eq('id', id);
    
    setFormData(prev => ({ ...prev, historico_fotos: updatedFotos }));
    playSound('notification.mp3');
    notify(`Foto adicionada com sucesso na fase: ${faseAtualTitulo}!`);
    e.target.value = ""; // Limpa o input
  };

  // Função para remover foto do Acompanhamento Visual
  const handleRemoverFotoAcompanhamento = async (indexToRemove: number) => {
    playSound('click.mp3');
    const updatedFotos = formData.historico_fotos?.filter((_, idx) => idx !== indexToRemove) || [];
    
    await supabase.from('clientes').update({ historico_fotos: updatedFotos }).eq('id', id);
    setFormData(prev => ({ ...prev, historico_fotos: updatedFotos }));
    notify("Foto removida com sucesso!");
  };

  // Função para upload de Múltiplas Fotos na Vistoria de Entrada
  const handleUploadFotosEntrada = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    playSound('click.mp3');
    let novasUrls = [...fotosEntrada];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = `${id}/entrada_${Date.now()}_${i}_${file.name}`;
      const { error: uploadError } = await supabase.storage.from('imagens').upload(fileName, file);
      
      if (!uploadError) {
        const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/imagens/${fileName}`;
        novasUrls.push(publicUrl);
      }
    }

    setFotosEntrada(novasUrls);
    playSound('notification.mp3');
    notify("Fotos de entrada adicionadas!");
  };

  const handleRemoverFotoEntrada = (indexToRemove: number) => {
    playSound('click.mp3');
    const novasUrls = fotosEntrada.filter((_, idx) => idx !== indexToRemove);
    setFotosEntrada(novasUrls);
  };

  const handleWhatsApp = () => {
    playSound('click.mp3');
    const urlLogin = "https://tiger-blindadora-portal.vercel.app/login-cliente";
    const msg = `🛡️ TIGER BLINDADORA%0AOlá, ${formData.nome}!%0A%0AInformamos que seu projeto avançou para: ${formData.status}.%0A%0A🔗 Acesse: ${urlLogin}%0A👤 ID: ${id}%0A🔑 Senha: ${formData.senha}%0A%0AAtenciosamente,%0ATiger Blindadora`;
    window.open(`https://wa.me/${formData.telefone?.replace(/\D/g, "")}?text=${msg}`, "_blank");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playSound('click.mp3');
    setSaving(true);

    try {
      const novoHistorico = [...(formData.historico_eventos || [])];
      
      if (formData.status !== initialData.status) {
        novoHistorico.push({
          titulo: "Atualização de Status",
          descricao: `Projeto avançou para: ${formData.status}`,
          data: new Date().toISOString()
        });
      }

      const dataParaEnviar: any = { 
        ...formData, 
        historico_eventos: novoHistorico,
        checklist_entrada: checklistEntrada,
        fotos_entrada: fotosEntrada
      };
      
      const { error } = await supabase
        .from('clientes')
        .update({
          nome: dataParaEnviar.nome,
          senha: dataParaEnviar.senha,
          modelo: dataParaEnviar.modelo,
          ano_modelo: dataParaEnviar.ano_modelo,
          placa: dataParaEnviar.placa,
          chassi: dataParaEnviar.chassi,
          nivel_blindagem: dataParaEnviar.nivel_blindagem,
          progresso: dataParaEnviar.progresso,
          status: dataParaEnviar.status,
          tipo_revisao: dataParaEnviar.tipo_revisao,
          data_revisao: dataParaEnviar.data_revisao,
          hora_revisao: dataParaEnviar.hora_revisao,
          historico_eventos: dataParaEnviar.historico_eventos,
          historico_fotos: dataParaEnviar.historico_fotos,
          checklist_entrada: dataParaEnviar.checklist_entrada,
          fotos_entrada: dataParaEnviar.fotos_entrada,
        })
        .eq('id', id);

      if (error) throw error;

      await atualizarCliente(id, dataParaEnviar);
      
      setFormData(dataParaEnviar);
      playSound('notification.mp3');
      notify("✅ Dados atualizados e salvos com sucesso!");
    } catch (error) {
      console.error(error);
      notify("❌ Erro ao atualizar dados no banco.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative bg-[#050505] p-8 rounded-3xl border border-[#222] shadow-2xl max-w-4xl mx-auto space-y-8 text-white">
      
      {notification && (
        <div className="fixed top-20 right-8 bg-orange-600 text-white px-6 py-4 rounded-xl font-bold flex items-center gap-3 shadow-2xl z-50 animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 /> {notification}
        </div>
      )}

      {/* ACOMPANHAMENTO VISUAL */}
      <div className="bg-[#111] p-6 rounded-2xl border border-[#222]">
        <h3 className="text-orange-500 font-bold mb-4 text-xs uppercase tracking-widest">Acompanhamento Visual</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
          {formData.historico_fotos?.map((foto, idx) => (
            <div key={idx} className="relative group rounded-xl overflow-hidden border border-[#333] bg-black shadow-md">
              <img src={foto.url} className="w-full h-24 object-cover group-hover:scale-105 transition-transform duration-300" />
              <div className="p-2 bg-gradient-to-t from-black/90 to-black/60">
                <p className="text-[9px] text-orange-400 font-extrabold uppercase tracking-widest truncate">{foto.titulo || formData.status}</p>
              </div>
              <button 
                type="button"
                onClick={() => handleRemoverFotoAcompanhamento(idx)}
                className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                title="Remover foto"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
        <label className="border-2 border-dashed border-[#333] p-6 flex flex-col items-center cursor-pointer hover:border-orange-500 transition-all rounded-xl group">
          <UploadCloud className="text-orange-500 mb-2 group-hover:scale-110 transition-transform" size={24} />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-300 group-hover:text-orange-400">Adicionar Foto</span>
          <span className="text-[8px] text-gray-500 mt-1">Fase atual: {(formData.status || "Entrada").toUpperCase()}</span>
          <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>

      {/* CHECKLIST E VISTORIA DE ENTRADA */}
      <div className="bg-[#111] p-6 rounded-2xl border border-orange-500/40 shadow-lg shadow-orange-500/5 space-y-4">
        <h3 className="text-orange-500 font-bold uppercase text-xs tracking-widest flex items-center gap-2">
          <CheckSquare size={18} /> Checklist e Vistoria de Entrada
        </h3>
        <p className="text-gray-400 text-xs">
          Marque os itens vistoriados e adicione fotos detalhadas do veículo ao dar entrada na Tiger.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { key: 'lataria', label: 'Lataria (Riscos/Amassados)' },
            { key: 'vidros_e_parabrisa', label: 'Vidros e Para-brisa' },
            { key: 'interior_e_bancos', label: 'Interior e Bancos' },
            { key: 'painel_e_km', label: 'Painel e Quilometragem' },
            { key: 'acessorios_e_pertences', label: 'Acessórios e Pertences' },
          ].map((item) => (
            <label key={item.key} className="flex items-center gap-3 bg-[#1a1a1a] p-3 rounded-xl border border-[#333] cursor-pointer hover:border-orange-500/50 transition-all">
              <input 
                type="checkbox"
                checked={!!checklistEntrada[item.key]}
                onChange={(e) => setChecklistEntrada({ ...checklistEntrada, [item.key]: e.target.checked })}
                className="w-4 h-4 accent-orange-500 rounded cursor-pointer"
              />
              <span className="text-xs text-white font-medium">{item.label}</span>
            </label>
          ))}
        </div>

        <textarea 
          placeholder="Observações do checklist (ex: Pequeno arranhão no para-choque traseiro esquerdo)..."
          value={checklistEntrada.observacoes || ""}
          onChange={(e) => setChecklistEntrada({ ...checklistEntrada, observacoes: e.target.value })}
          className="w-full bg-[#1a1a1a] border border-[#333] p-3 rounded-xl text-white text-xs outline-none focus:border-orange-500 transition-all h-20 resize-none"
        />

        {/* Múltiplas Fotos da Entrada */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300 font-bold uppercase">Fotos da Vistoria de Entrada ({fotosEntrada.length})</span>
            <label className="bg-[#222] hover:bg-[#333] text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border border-[#444] transition-all cursor-pointer">
              <Camera size={16} className="text-orange-500" /> Adicionar Múltiplas Fotos
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleUploadFotosEntrada} />
            </label>
          </div>

          {fotosEntrada.length > 0 && (
            <div className="grid grid-cols-4 gap-3 pt-2">
              {fotosEntrada.map((url, idx) => (
                <div key={idx} className="relative group rounded-lg overflow-hidden border border-[#333] bg-black">
                  <img src={url} alt="Entrada" className="w-full h-20 object-cover" />
                  <button 
                    type="button"
                    onClick={() => handleRemoverFotoEntrada(idx)}
                    className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white p-1 rounded-md opacity-80 group-hover:opacity-100 transition-all"
                    title="Remover foto"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* DADOS GERAIS */}
      <div className="grid grid-cols-2 gap-4">
        <input className="bg-[#0a0a0a] border border-[#222] p-4 rounded-xl outline-none focus:border-orange-500 text-xs" value={id} disabled />
        <input className="bg-[#0a0a0a] border border-[#222] p-4 rounded-xl outline-none focus:border-orange-500 text-xs" placeholder="Senha" value={formData.senha || ""} onChange={(e) => setFormData(p => ({...p, senha: e.target.value}))} />
        <input className="col-span-2 bg-[#0a0a0a] border border-[#222] p-4 rounded-xl outline-none focus:border-orange-500 text-xs" placeholder="Nome" value={formData.nome || ""} onChange={(e) => setFormData(p => ({...p, nome: e.target.value}))} />
        
        <input className="bg-[#0a0a0a] border border-[#222] p-4 rounded-xl outline-none focus:border-orange-500 text-xs" placeholder="Modelo" value={formData.modelo || ""} onChange={(e) => setFormData(p => ({...p, modelo: e.target.value}))} />
        <input className="bg-[#0a0a0a] border border-[#222] p-4 rounded-xl outline-none focus:border-orange-500 text-xs" placeholder="Ano" value={formData.ano_modelo || ""} onChange={(e) => setFormData(p => ({...p, ano_modelo: e.target.value}))} />
        
        <input className="bg-[#0a0a0a] border border-[#222] p-4 rounded-xl outline-none focus:border-orange-500 text-xs" placeholder="Placa" value={formData.placa || ""} onChange={(e) => setFormData(p => ({...p, placa: e.target.value}))} />
        <input className="bg-[#0a0a0a] border border-[#222] p-4 rounded-xl outline-none focus:border-orange-500 text-xs" placeholder="Chassi" value={formData.chassi || ""} onChange={(e) => setFormData(p => ({...p, chassi: e.target.value}))} />
        
        <select className="col-span-2 bg-[#0a0a0a] border border-[#222] p-4 rounded-xl text-white appearance-none cursor-pointer outline-none focus:border-orange-500 text-xs" value={formData.nivel_blindagem || "III-A"} onChange={(e) => setFormData(p => ({...p, nivel_blindagem: e.target.value}))}>
            <option value="III-A">Blindagem Nível III-A</option>
            <option value="III">Blindagem Nível III</option>
        </select>
      </div>

      {/* PROGRESSO E STATUS */}
      <div className="bg-[#111] p-6 rounded-2xl border border-[#222] space-y-6">
        <div>
            <label className="text-orange-500 font-bold flex items-center gap-2 mb-2 text-xs uppercase"><Percent size={18}/> PROGRESSO: {formData.progresso}%</label>
            <input type="range" className="w-full h-2 bg-[#222] rounded-lg cursor-pointer accent-orange-500" value={formData.progresso || 0} onChange={(e) => setFormData(p => ({...p, progresso: parseInt(e.target.value)}))} />
        </div>

        <select className="w-full bg-black border border-[#222] p-4 rounded-xl appearance-none outline-none focus:border-orange-500 text-xs" value={formData.status} onChange={(e) => setFormData(p => ({...p, status: e.target.value}))}>
           {["Entrada", "Desmontagem", "Estrutura", "Portas", "Vidros", "Acabamento", "Testes", "Finalização", "Entrega"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* REVISÕES */}
      <div className="bg-[#111] p-6 rounded-2xl border border-[#222] space-y-4">
        <h3 className="text-orange-500 font-bold flex items-center gap-2 text-xs uppercase tracking-widest"><Calendar size={18} /> Agendar Revisão</h3>
        <select className="w-full bg-black border border-[#222] p-4 rounded-xl outline-none focus:border-orange-500 text-xs" value={formData.tipo_revisao || ""} onChange={(e) => setFormData(p => ({...p, tipo_revisao: e.target.value}))}>
            <option value="">Selecione o tipo de revisão</option>
            <option value="6_meses">6 Meses</option>
            <option value="10k_km">10.000 KM</option>
            <option value="anual">Anual</option>
        </select>
        <div className="grid grid-cols-2 gap-4">
            <input type="date" className="bg-black border border-[#222] p-4 rounded-xl outline-none focus:border-orange-500 text-xs" value={formData.data_revisao || ""} onChange={(e) => setFormData(p => ({...p, data_revisao: e.target.value}))} />
            <input type="time" className="bg-black border border-[#222] p-4 rounded-xl outline-none focus:border-orange-500 text-xs" value={formData.hora_revisao || ""} onChange={(e) => setFormData(p => ({...p, hora_revisao: e.target.value}))} />
        </div>
      </div>

      <div className="space-y-4">
        <button type="submit" disabled={saving} className="w-full bg-orange-500 text-black font-bold py-5 rounded-2xl hover:bg-orange-400 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider">
            {saving ? <Loader2 className="animate-spin" /> : "Salvar Alterações"}
        </button>
        <button type="button" onClick={handleWhatsApp} className="w-full bg-[#25D366] text-black font-bold py-5 rounded-2xl hover:bg-green-500 transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider">
            <Send size={20} /> Enviar via WhatsApp
        </button>
      </div>
    </form>
  );
}