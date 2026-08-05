"use client";

export const HistoryList = ({ historico }: { historico: any[] }) => {
  return (
    <div className="bg-[#111] p-6 rounded-2xl border border-[#222] shadow-sm">
      <h3 className="text-white font-bold mb-6 uppercase text-xs tracking-widest">Histórico de Atualizações</h3>
      
      {historico && historico.length > 0 ? (
        <div className="space-y-6 pl-1">
          {historico.map((item, index) => (
            <div key={index} className="relative pl-6 border-l border-[#222]">
              <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"></div>
              {item.data && (
                <p className="text-[10px] text-gray-500 font-mono mb-0.5">
                  {new Date(item.data).toLocaleDateString('pt-BR')}
                </p>
              )}
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">{item.titulo}</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">{item.descricao}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-xs italic">Nenhum histórico registrado no momento.</p>
      )}
    </div>
  );
};