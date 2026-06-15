import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

const SCROLL_AMOUNT = 210;

export default function VideoCarousel({ videos, selectedVideoId, onSelect }) {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * SCROLL_AMOUNT, behavior: 'smooth' });
  };

  return (
    <div className="relative flex-shrink-0 group/carousel">
      {/* Flecha izquierda */}
      <button
        onClick={() => scroll(-1)}
        aria-label="Anterior"
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 -ml-1
          bg-black/80 hover:bg-black text-white p-1.5 rounded-full shadow-xl
          opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* Scroll container */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide px-2 pb-1"
      >
        {videos.map((video, index) => (
          <VideoCard
            key={video.videoId}
            video={video}
            index={index}
            isSelected={video.videoId === selectedVideoId}
            onSelect={() => onSelect(video)}
          />
        ))}
      </div>

      {/* Flecha derecha */}
      <button
        onClick={() => scroll(1)}
        aria-label="Siguiente"
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 -mr-1
          bg-black/80 hover:bg-black text-white p-1.5 rounded-full shadow-xl
          opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}

function VideoCard({ video, index, isSelected, onSelect }) {
  return (
    <div
      onClick={onSelect}
      className={`flex-shrink-0 w-44 cursor-pointer group/card transition-transform duration-150 hover:-translate-y-0.5 ${
        isSelected ? 'opacity-100' : 'opacity-80 hover:opacity-100'
      }`}
    >
      <div
        className={`relative rounded-lg overflow-hidden bg-[#272727] ${
          isSelected ? 'ring-2 ring-red-500' : 'ring-1 ring-transparent hover:ring-[#3f3f3f]'
        }`}
      >
        <img
          src={video.thumbnail}
          alt={video.title}
          loading="lazy"
          className="w-full aspect-video object-cover"
        />

        {/* Overlay de reproducción */}
        <div
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-150 ${
            isSelected
              ? 'bg-red-600/20 opacity-100'
              : 'bg-black/0 opacity-0 group-hover/card:bg-black/30 group-hover/card:opacity-100'
          }`}
        >
          {isSelected ? (
            <div className="bg-red-600 rounded-full p-1.5 shadow-lg">
              <Play className="w-3.5 h-3.5 text-white fill-white" />
            </div>
          ) : (
            <div className="bg-black/70 rounded-full p-1.5">
              <Play className="w-3.5 h-3.5 text-white fill-white" />
            </div>
          )}
        </div>

        {/* Número de video */}
        <span className="absolute top-1 left-1 text-[10px] bg-black/70 text-gray-300 px-1 rounded">
          {index + 1}
        </span>
      </div>

      <p className="mt-1.5 text-[11px] text-gray-300 font-medium line-clamp-2 leading-snug px-0.5 group-hover/card:text-white transition-colors">
        {video.title}
      </p>
    </div>
  );
}
