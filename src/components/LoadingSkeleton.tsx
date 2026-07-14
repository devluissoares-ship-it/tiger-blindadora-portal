export default function LoadingSkeleton() {
  return (
    <div className="pl-64 p-8 bg-[#050505] min-h-screen text-white animate-pulse">
      <div className="h-8 w-64 bg-[#111111] mb-8 rounded"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#111111] h-80 rounded-xl border border-[#222]"></div>
        <div className="col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#111111] h-40 rounded-xl border border-[#222]"></div>
          <div className="bg-[#111111] h-40 rounded-xl border border-[#222]"></div>
        </div>
      </div>
    </div>
  );
}