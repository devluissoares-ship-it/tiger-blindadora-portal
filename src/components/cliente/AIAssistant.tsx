"use client";

import { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';

export default function AIAssistant({ cliente, isUserAdmin = false }: { cliente: any, isUserAdmin?: boolean }) {
  const [isReady, setIsReady] = useState(false);

  // Esta trava garante que o componente NUNCA rode no servidor
  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) return <div className="p-4 text-gray-500">Iniciando sistema...</div>;

  return (
    <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-[#222]">
      <div className="flex items-center gap-3 mb-4">
        <Bot className={isUserAdmin ? "text-blue-500" : "text-orange-500"} size={20} />
        <h3 className="font-bold text-white">{isUserAdmin ? "Painel Admin" : "IA"}</h3>
      </div>
      <p className="text-gray-400 text-sm">Sistema ativo e operante.</p>
    </div>
  );
}