"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from "@/lib/supabase";
import { LogOut, Loader2, Info } from 'lucide-react'; // Removi o ConsultorIA daqui
import { Cliente } from "@/types/cliente";

export default function DashboardCliente() {
  const { id } = useParams();
  const router = useRouter();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!id) return;
    
    const fetchCliente = async () => {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .eq('id', decodeURIComponent(id as string))
        .single();

      if (!error && data) setCliente(data);
    };
    fetchCliente();
  }, [id]);

  if (!mounted) return null;

  if (!cliente) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-[#ff9500]">
      <Loader2 className="animate-spin" size={48} />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#050505] text-white p-4 md:p-8">
      {/* Mantenha o seu Header e sua Galeria de Fotos aqui */}
      {/* REMOVA QUALQUER CHAMADA PARA ConsultorIA */}
      
      <div className="text-gray-400">
         {/* O restante do seu layout... */}
      </div>
    </main>
  );
}