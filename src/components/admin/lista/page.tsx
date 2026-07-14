"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "@/data/db";

export default function ListaClientesPage() {
  const [clientes, setClientes] = useState<any[]>([]);

  useEffect(() => {
    // Carrega do LocalStorage ou do db.ts
    const saved = localStorage.getItem('tiger_db');
    const source = saved ? JSON.parse(saved) : db;
    setClientes(source.clientes);
  }, []);

  const handleDelete = (id: string) => {
    const confirmacao = confirm("Deseja excluir este cliente?");
    if (confirmacao) {
      const novaLista = clientes.filter((c) => c.id !== id);
      setClientes(novaLista);
      localStorage.setItem('tiger_db', JSON.stringify({ clientes: novaLista }));
      // Não precisa de reload se o estado atualizar
    }
  };

  return (
    <main className="p-8 text-white">
      <h1 className="text-2xl font-bold mb-6">Lista de Clientes</h1>
      
      <div className="space-y-4">
        {clientes.map((cliente) => (
          <div key={cliente.id} className="p-4 bg-[#111111] border border-[#222] rounded flex justify-between items-center">
            <div>
              <p className="font-bold">{cliente.nome}</p>
              <p className="text-sm text-gray-500">ID: {cliente.id}</p>
            </div>
            
            <div className="flex gap-4">
              {/* ESSE É O LINK QUE CORRIGE O 404 */}
              <Link href={`/admin/${cliente.id}/editar`} className="text-blue-400 hover:underline">
                Editar
              </Link>
              
              {/* ESSE É O BOTÃO DE EXCLUIR */}
              <button 
                onClick={() => handleDelete(cliente.id)} 
                className="text-red-500 hover:underline"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}