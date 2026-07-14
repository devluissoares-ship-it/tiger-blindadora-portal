"use client";
import { Save } from 'lucide-react';
import { updateProjectStatus } from '@/lib/actions';

export const ProjectDetails = ({ cliente }: any) => {
  
  const handleSave = async (formData: FormData) => {
    // A Server Action processa o formData automaticamente
    const result = await updateProjectStatus(cliente.id, formData);
    
    if (result.success) {
      alert("Dados sincronizados com sucesso no servidor!");
    } else {
      alert("Erro ao salvar dados. Tente novamente.");
    }
  };

  return (
    <form action={handleSave} className="bg-[#111111] p-6 rounded-xl border border-[#222]">
      <h3 className="text-lg font-bold mb-4">Dados do Cliente: {cliente?.nome}</h3>
      
      {/* Campos ocultos ou editáveis para enviar ao servidor */}
      <input type="hidden" name="id" value={cliente?.id} />
      
      <div className="mb-4">
        <label className="text-xs text-gray-500 uppercase tracking-wider">Cliente</label>
        <input 
          name="nome" 
          defaultValue={cliente?.nome} 
          className="w-full bg-[#050505] border border-[#222] p-2 rounded text-white font-semibold focus:border-[#ff9500] outline-none"
        />
      </div>

      <div className="mb-6">
        <label className="text-xs text-gray-500 uppercase tracking-wider">Veículo</label>
        <p className="text-sm text-gray-300 bg-[#050505] p-2 rounded border border-[#222]">
          {cliente?.veiculo}
        </p>
      </div>
      
      <button 
        type="submit" 
        className="bg-[#ff9500] text-black px-4 py-2 rounded font-bold flex items-center gap-2 transition hover:bg-[#e08400] w-full justify-center"
      >
        <Save size={16}/> Salvar Alterações
      </button>
    </form>
  );
};