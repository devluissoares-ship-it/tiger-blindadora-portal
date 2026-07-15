"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send, Save, UploadCloud, Trash2 } from "lucide-react";
import { Cliente, HistoricoFoto } from "@/types/cliente";
import { atualizarCliente } from "@/app/actions/clienteActions";
import { supabase } from "@/lib/supabase";

interface EditarClienteProps {
  params: { id: string };
  initialData: Cliente;
}

export default function EditarCliente({ params, initialData }: EditarClienteProps) {
  const [formData, setFormData] = useState<Cliente>(initialData);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  // Função de Upload de Imagem para o Storage
  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${params.id}/${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage.from('imagens').upload(fileName, file);
    if (error) {
      alert("Erro ao subir imagem: " + error.message);
    } else {
      const { data: { publicUrl } } = supabase.storage.from('imagens').getPublicUrl(fileName);
      const novaFoto: HistoricoFoto = { url: publicUrl, titulo: "Nova Atualização", descricao: "Foto enviada pelo Admin" };
      setFormData({ ...formData, historico_fotos: [...formData.historico_fotos, novaFoto] });
    }
    setUploading(false);
  };

  const handleEnviarWhatsApp = () => {
    const portalUrl = `https://portal-tiger.vercel.app/portal/${params.id}`;
    const mensagem = `Olá ${formData.nome}, seu projeto na Tiger Blindagens está atualizado! 🚗\n\nAcompanhe seu ${formData.veiculo} em tempo real aqui: ${portalUrl}\nSenha: ${formData.senha || "Consultar Admin"}`;
    const url = `https://wa.me/${formData.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await atualizarCliente(params.id, formData);
      alert("Projeto atualizado e sincronizado com o portal!");
      router.refresh();
    } catch (error) {
      alert("Erro ao salvar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="p-8 text-white min-h-screen bg-[#050505]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Editando: <span className="text-[#ff9500]">{formData.nome}</span></h1>
        <button onClick={handleEnviarWhatsApp} className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl flex items-center gap-2 font-bold transition">
          <Send size={18} /> Enviar Acesso via WhatsApp
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#111111] p-8 rounded-2xl border border-[#222] max-w-4xl space-y-8">
        {/* Informações Básicas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input className="p-4 bg-black border border-[#222] rounded-xl text-white" value={formData.nome || ""} onChange={(e) => setFormData({...formData, nome: e.target.value})} placeholder="Nome" />
          <input className="p-4 bg-black border border-[#222] rounded-xl text-white" value={formData.telefone || ""} onChange={(e) => setFormData({...formData, telefone: e.target.value})} placeholder="Telefone" />
          <input className="p-4 bg-black border border-[#222] rounded-xl text-white" value={formData.veiculo || ""} onChange={(e) => setFormData({...formData, veiculo: e.target.value})} placeholder="Veículo" />
          <input className="p-4 bg-black border border-[#222] rounded-xl text-white" value={formData.ano_modelo || ""} onChange={(e) => setFormData({...formData, ano_modelo: e.target.value})} placeholder="Ano/Modelo" />
          <input className="p-4 bg-black border border-[#222] rounded-xl text-white" value={formData.placa || ""} onChange={(e) => setFormData({...formData, placa: e.target.value})} placeholder="Placa" />
          <input className="p-4 bg-black border border-[#222] rounded-xl text-white" value={formData.chassi || ""} onChange={(e) => setFormData({...formData, chassi: e.target.value})} placeholder="Chassi" />
        </div>

        {/* Galeria de Fotos (Upload) */}
        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#222] space-y-4">
          <h3 className="text-[#ff9500] font-bold text-sm uppercase">Galeria de Acompanhamento</h3>
          <label className="cursor-pointer flex items-center justify-center gap-2 p-6 border-2 border-dashed border-[#333] rounded-xl hover:border-[#ff9500] transition">
            {uploading ? <Loader2 className="animate-spin text-[#ff9500]" /> : <><UploadCloud /> Adicionar Nova Foto ao Portal</>}
            <input type="file" className="hidden" onChange={handleUploadImage} accept="image/*" />
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {formData.historico_fotos.map((foto, idx) => (
              <div key={idx} className="relative group">
                <img src={foto.url} className="h-32 w-full object-cover rounded-lg border border-[#222]" />
                <button type="button" onClick={() => setFormData({...formData, historico_fotos: formData.historico_fotos.filter((_, i) => i !== idx)})} className="absolute top-2 right-2 p-1 bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition"><Trash2 size={14}/></button>
              </div>
            ))}
          </div>
        </div>

        {/* Status e Revisão */}
        <div className="bg-[#1a1a1a] p-6 rounded-2xl border border-[#222] grid grid-cols-1 md:grid-cols-2 gap-4">
          <select className="p-4 bg-black border border-[#222] rounded-xl text-white" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
             {["Entrada", "Desmontagem", "Estrutura", "Portas", "Vidros", "Acabamento", "Testes", "Finalização", "Entrega"].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <input type="number" className="p-4 bg-black border border-[#222] rounded-xl text-white" value={formData.progresso} onChange={(e) => setFormData({...formData, progresso: parseInt(e.target.value)})} placeholder="Progresso (%)" />
        </div>

        <button type="submit" disabled={saving} className="w-full bg-[#ff9500] text-black font-bold py-4 rounded-xl hover:bg-white transition flex justify-center items-center gap-2">
          {saving ? <Loader2 className="animate-spin" /> : <><Save size={20}/> Salvar Alterações para o Cliente</>}
        </button>
      </form>
    </main>
  );
}