"use client";

import { useState, useEffect } from "react";
import { Loader2, Send, UploadCloud, Wrench, Percent, Calendar } from "lucide-react";
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

  useEffect(() => { 
    setFormData(initialData); 
  }, [initialData]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    playSound('click.mp3');
    const fileName = `${id}/${Date.now()}_${file.name}`;
    const { error: uploadError } = await supabase.storage.from('imagens').upload(fileName, file);
    if (uploadError) { alert("Erro ao subir imagem!"); return; }

    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/imagens/${fileName}`;
    const novaFoto: HistoricoFoto = { url: publicUrl, titulo: "Nova Etapa", descricao: "Admin" };
    
    const updatedFotos = [...(formData.historico_fotos || []), novaFoto];
    await supabase.from('clientes').update({ historico_fotos: updatedFotos }).eq('id', id);
    
    setFormData(prev => ({ ...prev, historico_fotos: updatedFotos }));
    playSound('notification.mp3');
  };

  // MENSAGEM PROFISSIONAL E ORGANIZADA
  const handleWhatsApp = () => {
    playSound('click.mp3');
    const urlLogin = "https://tiger-blindadora-portal.vercel.app/login-cliente";
    
    const msg = [
      "🛡️ *TIGER BLINDADORA*",
      `Olá, *${formData.nome || "Cliente"}*!`,
      "",
      "Informamos que houve uma atualização no status do seu veículo em nosso sistema.",
      "",
      "🔗 *Acesse seu portal aqui:*",
      urlLogin,
      "",
      "👤 *Seu Usuário (ID):* " + id,
      "🔑 *Sua Senha:* " + (formData.senha || "Consulte o admin"),
      "",
      "Estamos cuidando de cada detalhe com total segurança.",
      "Acompanhe o progresso em tempo real."
    ].join("%0A");

    window.open(`https://wa.me/${formData.telefone?.replace(/\D/g, "")}?text=${msg}`, "_blank");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    playSound('click.mp3');
    setSaving(true);
    await atualizarCliente(id, formData);
    playSound('notification.mp3');
    alert("✅ Dados sincronizados com sucesso!");
    setSaving(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#050505] p-8 rounded-3xl border border-[#222] shadow-2xl max-w-4xl mx-auto space-y-8 text-white">
      
      {/* GALERIA */}
      <div className="bg-[#111] p-6 rounded-2xl border border-[#222]">
        <h3 className="text-orange-500 font-bold mb-4">ACOMPANHAMENTO VISUAL</h3>
        <div className="grid grid-cols-4 gap-4 mb-4">
          {formData.historico_fotos?.map((foto, idx) => (
            <img key={idx} src={foto.url} className="w-full h-24 object-cover rounded-lg border border-[#333]" />
          ))}
        </div>
        <label className="border-2 border-dashed border-[#333] p-6 flex flex-col items-center cursor-pointer hover:border-orange-500 rounded-xl">
          <UploadCloud className="text-orange-500 mb-2" />
          <span>Adicionar Foto</span>
          <input type="file" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>

      {/* DADOS GERAIS */}
      <div className="grid grid-cols-2 gap-4">
        <input className="bg-[#0a0a0a] border border-[#222] p-4 rounded-xl" value={id} disabled />
        <input className="bg-[#0a0a0a] border border-[#222] p-4 rounded-xl" placeholder="Senha" value={formData.senha || ""} onChange={(e) => setFormData(p => ({...p, senha: e.target.value}))} />
        <input className="col-span-2 bg-[#0a0a0a] border border-[#222] p-4 rounded-xl" placeholder="Nome" value={formData.nome || ""} onChange={(e) => setFormData(p => ({...p, nome: e.target.value}))} />
        <input className="bg-[#0a0a0a] border border-[#222] p-4 rounded-xl" placeholder="Modelo" value={formData.modelo || ""} onChange={(e) => setFormData(p => ({...p, modelo: e.target.value}))} />
        <input className="bg-[#0a0a0a] border border-[#222] p-4 rounded-xl" placeholder="Ano" value={formData.ano_modelo || ""} onChange={(e) => setFormData(p => ({...p, ano_modelo: e.target.value}))} />
        
        <select className="col-span-2 bg-[#0a0a0a] border border-[#222] p-4 rounded-xl text-white" value={formData.nivel_blindagem || "III-A"} onChange={(e) => setFormData(p => ({...p, nivel_blindagem: e.target.value}))}>
            <option value="III-A">Blindagem Nível III-A</option>
            <option value="III">Blindagem Nível III</option>
        </select>
      </div>

      {/* PROGRESSO E STATUS */}
      <div className="bg-[#111] p-6 rounded-2xl border border-[#222] space-y-6">
        <div>
            <label className="text-orange-500 font-bold flex items-center gap-2 mb-2"><Percent size={18}/> PROGRESSO: {formData.progresso || 0}%</label>
            <input type="range" className="w-full h-2 bg-[#222] rounded-lg appearance-none cursor-pointer accent-orange-500" value={formData.progresso || 0} onChange={(e) => setFormData(p => ({...p, progresso: parseInt(e.target.value)}))} />
        </div>

        <select className="w-full bg-black border border-[#222] p-4 rounded-xl" value={formData.status} onChange={(e) => setFormData(p => ({...p, status: e.target.value}))}>
           {["Entrada", "Desmontagem", "Estrutura", "Portas", "Vidros", "Acabamento", "Testes", "Finalização", "Entrega"].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* REVISÕES */}
      <div className="bg-[#111] p-6 rounded-2xl border border-[#222] space-y-4">
        <h3 className="text-orange-500 font-bold flex items-center gap-2"><Calendar /> AGENDAR REVISÃO</h3>
        <select className="w-full bg-black border border-[#222] p-4 rounded-xl" value={formData.tipo_revisao || ""} onChange={(e) => setFormData(p => ({...p, tipo_revisao: e.target.value}))}>
            <option value="">Selecione o tipo</option>
            <option value="6_meses">6 Meses</option>
            <option value="10k_km">10.000 KM</option>
            <option value="anual">Anual</option>
        </select>
        <div className="grid grid-cols-2 gap-4">
            <input type="date" className="bg-black border border-[#222] p-4 rounded-xl" value={formData.data_revisao || ""} onChange={(e) => setFormData(p => ({...p, data_revisao: e.target.value}))} />
            <input type="time" className="bg-black border border-[#222] p-4 rounded-xl" value={formData.hora_revisao || ""} onChange={(e) => setFormData(p => ({...p, hora_revisao: e.target.value}))} />
        </div>
      </div>

      {/* BOTÕES DE AÇÃO */}
      <div className="space-y-4">
        <button type="submit" className="w-full bg-orange-500 text-black font-bold py-5 rounded-2xl">
            {saving ? <Loader2 className="animate-spin" /> : "Salvar Alterações"}
        </button>
        <button type="button" onClick={handleWhatsApp} className="w-full bg-[#25D366] text-black font-bold py-5 rounded-2xl flex items-center justify-center gap-2">
            <Send size={20} /> Enviar Acesso via WhatsApp
        </button>
      </div>
    </form>
  );
}