import { Trash2, BookMarked } from 'lucide-react';

export default function Sidebar({ channels, activeChannelId, onSelect, onRemove }) {
  return (
    <aside className="w-60 flex-shrink-0 bg-[#1a1a1a] border-r border-[#2e2e2e] flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-[#2e2e2e] flex-shrink-0">
        <div className="flex items-center gap-2 text-gray-500">
          <BookMarked className="w-3.5 h-3.5" />
          <span className="text-[11px] font-semibold uppercase tracking-widest">
            Mis Canales ({channels.length})
          </span>
        </div>
      </div>

      <ul className="flex-1 overflow-y-auto py-2 sidebar-scroll">
        {channels.length === 0 && (
          <li className="px-4 py-10 text-center text-gray-600 text-xs leading-relaxed">
            Sin canales guardados.
            <br />
            Agrega uno con el botón superior.
          </li>
        )}
        {channels.map(channel => (
          <ChannelItem
            key={channel.id}
            channel={channel}
            isActive={channel.id === activeChannelId}
            onSelect={() => onSelect(channel.id)}
            onRemove={() => onRemove(channel.id)}
          />
        ))}
      </ul>
    </aside>
  );
}

function ChannelItem({ channel, isActive, onSelect, onRemove }) {
  return (
    <li
      onClick={onSelect}
      className={`group flex items-center gap-3 px-3 py-2 mx-2 my-0.5 rounded-lg cursor-pointer transition-colors duration-150 ${
        isActive
          ? 'bg-[#3f3f3f] text-white'
          : 'hover:bg-[#272727] text-gray-300 hover:text-white'
      }`}
    >
      <div className="relative flex-shrink-0">
        <img
          src={channel.thumbnail}
          alt={channel.title}
          className="w-9 h-9 rounded-full object-cover bg-[#3f3f3f]"
          onError={e => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(channel.title[0])}&background=282828&color=888&size=36`;
          }}
        />
        {isActive && (
          <span className="absolute -right-0.5 -bottom-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#1a1a1a]" />
        )}
      </div>

      <span className="flex-1 text-sm font-medium truncate">{channel.title}</span>

      <button
        onClick={e => {
          e.stopPropagation();
          onRemove();
        }}
        title="Eliminar canal"
        className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-all duration-150 p-1 rounded flex-shrink-0"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </li>
  );
}
