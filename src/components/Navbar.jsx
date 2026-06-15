import { PlusCircle, Youtube } from 'lucide-react';

export default function Navbar({ onAddChannel }) {
  return (
    <header className="flex items-center justify-between px-6 py-3 bg-[#212121] border-b border-[#3f3f3f] z-10 flex-shrink-0">
      <div className="flex items-center gap-2.5">
        <Youtube className="text-red-500 w-7 h-7 flex-shrink-0" />
        <h1 className="text-base font-bold tracking-tight select-none">
          Mi Biblioteca YouTube
        </h1>
      </div>

      <button
        onClick={onAddChannel}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors duration-150 shadow-lg shadow-red-900/30"
      >
        <PlusCircle className="w-4 h-4" />
        Adicionar Canal
      </button>
    </header>
  );
}
