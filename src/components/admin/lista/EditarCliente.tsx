"use client";

import { useState, useEffect } from "react";
import { Loader2, Send, UploadCloud, Percent, Calendar, CheckCircle2 } from "lucide-react";
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

  useEffect(() => { setFormData(initialData); }, [initialData]);

  const notify = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playSound('click.mp3');
    const fileName = `${id}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from('imagens').upload(fileName, file);
    if (uploadError) { notify("Erro ao subir imagem!"); return; }

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/imagens/${fileName}`;
    const novaFoto: HistoricoFoto = { url: publicUrl, titulo: "Nova Etapa", descricao: "Admin" };
    
    const updatedFotos = [...(formData.historico_fotos || []), novaFoto];
    await supabase.from('clientes').update({ historico_fotos: updatedFotos }).eq('id', id);
    
    setFormData(prev => ({ ...prev, historico_fotos: updatedFotos }));
    playSound('notification.mp3');
    notify("Foto adicionada com sucesso!");
  };

  const handleWhatsApp = () => {
    playSound('click.mp3');
    const urlLogin = "https://tiger-blindadora-portal.vercel.app/login-cliente";
    const msg = `🛡️ TIGER BLINDADORA%0AOlá, ${formData.nome}!%0A%0AInformamos que seu projeto avançou para: ${formData.status}.%0A%0A🔗 Acesse: ${urlLogin}%0A👤 ID: ${id}%0A🔑 Senha: ${formData.senha}`;
    window.open(`https://wa.me/${formData.telefone?.replace(/\D/g, "")}?text=${msg}`, "_blank");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playSound('click.mp3');
    setSaving(true);

    try {
      const novoHistorico = [...(formData.historico_eventos || [])];
      
      // Se a etapa mudou, adiciona no histórico com o campo 'titulo' exigido
      if (formData.status !== initialData.status) {
        novoHistorico.push({
          titulo: "Atualização de Status",
          descricao: `Projeto avançou para: ${formData.status}`,
          data: new Date().toISOString()
        });
      }

      const dataParaEnviar = { ...formData, historico_eventos: novoHistorico };
      
      await atualizarCliente(id, dataParaEnviar);
      setFormData(dataParaEnviar);
      
      playSound('notification.mp3');
      notify("✅ Dados atualizados com sucesso!");
    } catch (error) {
      notify("❌ Erro ao atualizar dados.");
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

      {/* GALERIA */}
      <div className="bg-[#111] p-6 rounded-2xl border border-[#222]">
        <h3 className="text-orange-500 font-bold mb-4 text-xs uppercase tracking-widest">Acompanhamento Visual</h3>
        <div className="grid grid-cols-4 gap-4 mb-4">
          {formData.historico_fotos?.map((foto, idx) => (
            <img key={idx} src={foto.url} className="w-full h-24 object-cover rounded-lg border border-[#333]" />
          ))}
        </div>
        <label className="border-2 border-dashed border-[#333] p-6 flex flex-col items-center cursor-pointer hover:border-orange-500 transition-all rounded-xl">
          <UploadCloud className="text-orange-500 mb-2" />
          <span className="text-sm">Adicionar Foto</span>
          <input type="file" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>

      {/* DADOS GERAIS */}
      <div className="grid grid-cols-2 gap-4">
        <input className="bg-[#0a0a0a] border border-[#222] p-4 rounded-xl outline-none focus:border-orange-500" value={id} disabled />
        <input className="bg-[#0a0a0a] border border-[#222] p-4 rounded-xl outline-none focus:border-orange-500" placeholder="Senha" value={formData.senha || ""} onChange={(e) => setFormData(p => ({...p, senha: e.target.value}))} />
        <input className="col-span-2 bg-[#0a0a0a] border border-[#222] p-4 rounded-xl outline-none focus:border-orange-500" placeholder="Nome" value={formData.nome || ""} onChange={(e) => setFormData(p => ({...p, nome: e.target.value}))} />
        <input className="bg-[#0a0a0a] border border-[#222] p-4 rounded-xl outline-none focus:border-orange-500" placeholder="Modelo" value={formData.modelo || ""} onChange={(e) => setFormData(p => ({...p, modelo: e.target.value}))} />
        <input className="bg-[#0a0a0a] border border-[#222] p-4 rounded-xl outline-none focus:border-orange-500" placeholder="Ano" value={formData.ano_modelo || ""} onChange={(e) => setFormData(p => ({...p, ano_modelo: e.target.value}))} />
        
        <select className="col-span-2 bg-[#0a0a0a] border border-[#222] p-4 rounded-xl text-white appearance-none cursor-pointer outline-none focus:border-orange-500" value={formData.nivel_blindagem || "III-A"} onChange={(e) => setFormData(p => ({...p, nivel_blindagem: e.target.value}))}>
            <option value="III-A">Blindagem Nível III-A</option>
            <option value="III">Blindagem Nível III</option>
        </select>
      </div>

      {/* PROGRESSO E STATUS */}
      <div className="bg-[#111] p-6 rounded-2xl border border-[#222] space-y-6">
        <div>
            <label className="text-orange-500 font-bold flex items-center gap-2 mb-2 text-sm"><Percent size={18}/> PROGRESSO: {formData.progresso}%</label>
            <input type="range" className="w-full h-2 bg-[#222] rounded-lg cursor-pointer accent-orange-500" value={formData.progresso || 0} onChange={(e) => setFormData(p => ({...p, progresso: parseInt(e.target.value)}))} />
        </div>

        <select className="w-full bg-black border border-[#222] p-4 rounded-xl appearance-none outline-none focus:border-orange-500" value={formData.status} onChange={(e) => setFormData(p => ({...p, status: e.target.value}))}>
           {["Entrada", "Desmontagem", "Estrutura", "Portas", "Vidros", "Acabamento", "Testes", "Finalização", "Entrega"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* REVISÕES */}
      <div className="bg-[#111] p-6 rounded-2xl border border-[#222] space-y-4">
        <h3 className="text-orange-500 font-bold flex items-center gap-2 text-sm uppercase tracking-widest"><Calendar size={18} /> Agendar Revisão</h3>
        <select className="w-full bg-black border border-[#222] p-4 rounded-xl outline-none focus:border-orange-500" value={formData.tipo_revisao || ""} onChange={(e) => setFormData(p => ({...p, tipo_revisao: e.target.value}))}>
            <option value="">Selecione o tipo de revisão</option>
            <option value="6_meses">6 Meses</option>
            <option value="10k_km">10.000 KM</option>
            <option value="anual">Anual</option>
        </select>
        <div className="grid grid-cols-2 gap-4">
            <input type="date" className="bg-black border border-[#222] p-4 rounded-xl outline-none focus:border-orange-500" value={formData.data_revisao || ""} onChange={(e) => setFormData(p => ({...p, data_revisao: e.target.value}))} />
            <input type="time" className="bg-black border border-[#222] p-4 rounded-xl outline-none focus:border-orange-500" value={formData.hora_revisao || ""} onChange={(e) => setFormData(p => ({...p, hora_revisao: e.target.value}))} />
        </div>
      </div>

      {/* BOTÕES DE AÇÃO */}
      <div className="space-y-4">
        <button type="submit" disabled={saving} className="w-full bg-orange-500 text-black font-bold py-5 rounded-2xl hover:bg-orange-400 transition-all flex items-center justify-center gap-2">
            {saving ? <Loader2 className="animate-spin" /> : "Salvar Alterações"}
        </button>
        <button type="button" onClick={handleWhatsApp} className="w-full bg-[#25D366] text-black font-bold py-5 rounded-2xl hover:bg-green-500 transition-all flex items-center justify-center gap-2">
            <Send size={20} /> Enviar via WhatsApp
        </button>
      </div>
    </form>
  );
}