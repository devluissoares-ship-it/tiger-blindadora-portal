"use client";

export const HistoryList = ({ historico }: { historico: any[] }) => {
  return (
    <div className="bg-[#111111] p-6 rounded-xl border border-[#222]">
      <h3 className="text-lg font-bold mb-6">Histórico de Atualizações</h3>
      <div className="space-y-6">
        {historico?.map((item, index) => (
          <div key={index} className="relative pl-6 border-l border-[#222]">
            <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-[#ff9500]"></div>
            <p className="text-xs text-gray-400">{item.data}</p>
            <h4 className="text-sm font-bold text-white">{item.titulo}</h4>
            <p className="text-sm text-gray-500">{item.descricao}</p>
          </div>
        ))}
      </div>
    </div>
  );
};