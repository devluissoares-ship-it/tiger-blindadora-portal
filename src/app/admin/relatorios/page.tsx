"use client";

import { useDB } from "@/hooks/useDB";
import { Cliente } from "@/types/cliente";
import { playNotification } from "@/lib/audio";
import { useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function RelatoriosPage() {
  const { data } = useDB();
  const clientes = data?.clientes as Cliente[] || [];

  useEffect(() => { playNotification(); }, []);

  const totalBlindados = clientes.filter(c => c.status === "Entrega").length;
  const emProcesso = clientes.filter(c => c.status !== "Entrega").length;

  const dataGrafico = [
    { name: 'Concluídos', value: totalBlindados },
    { name: 'Em Produção', value: emProcesso },
  ];
  const COLORS = ['#ff9500', '#444']; // Cor do "Em Produção" levemente mais clara para destacar

  const gerarPDF = () => {
    // ... Mantenha sua lógica de gerarPDF aqui ...
  };

  return (
    <main className="pl-64 p-8 bg-[#050505] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-8">Relatórios e Métricas</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Gráfico de Distribuição - Ajustado altura para evitar encavalamento */}
        <div className="bg-[#111111] p-6 rounded-xl border border-[#222] col-span-1 h-80 flex flex-col">
          <h3 className="text-gray-400 mb-2 text-sm uppercase tracking-wider">Distribuição de Projetos</h3>
          <div className="flex-grow">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={dataGrafico} 
                  innerRadius={50} 
                  outerRadius={70} 
                  paddingAngle={5} 
                  dataKey="value"
                >
                  {dataGrafico.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} 
                  itemStyle={{ color: '#fff' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  wrapperStyle={{ paddingTop: '20px', fontSize: '12px' }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cards de Métricas */}
        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#111111] p-8 rounded-xl border border-[#222] flex flex-col justify-center">
            <h3 className="text-gray-400 uppercase text-xs tracking-widest">Blindagens Concluídas</h3>
            <p className="text-5xl font-bold text-[#ff9500] mt-3">{totalBlindados}</p>
          </div>
          <div className="bg-[#111111] p-8 rounded-xl border border-[#222] flex flex-col justify-center">
            <h3 className="text-gray-400 uppercase text-xs tracking-widest">Eficiência (Pós-Venda)</h3>
            <p className="text-5xl font-bold text-[#ff9500] mt-3">98%</p>
          </div>
        </div>
      </div>

      <div className="bg-[#111111] p-8 rounded-xl border border-[#222]">
        <h2 className="text-xl font-bold mb-6">Exportação de Dados</h2>
        <button 
          onClick={gerarPDF}
          className="bg-[#ff9500] text-black px-8 py-3 rounded-lg font-bold hover:bg-white transition-all transform hover:scale-[1.01]"
        >
          Baixar Relatório Executivo (PDF)
        </button>
      </div>
    </main>
  );
}