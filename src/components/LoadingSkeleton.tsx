"use client";

export default function LoadingSkeleton() {
  return (
    <div className="pl-64 p-8 bg-[#050505] min-h-screen animate-pulse">
      {/* Header */}
      <div className="h-10 w-1/3 bg-[#111111] mb-10 rounded-xl"></div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Coluna 1: Widgets de Status */}
        <div className="space-y-6">
          <div className="bg-[#111111] h-64 rounded-2xl border border-[#222]"></div>
          <div className="bg-[#111111] h-40 rounded-2xl border border-[#222]"></div>
        </div>

        {/* Coluna 2: Conteúdo central */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#111111] h-32 rounded-2xl border border-[#222]"></div>
            <div className="bg-[#111111] h-32 rounded-2xl border border-[#222]"></div>
          </div>
          <div className="bg-[#111111] h-96 rounded-2xl border border-[#222]"></div>
        </div>
      </div>
    </div>
  );
}