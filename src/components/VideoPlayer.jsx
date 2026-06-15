export default function VideoPlayer({ video }) {
  if (!video) return null;

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-2">
      <div className="relative flex-1 bg-black rounded-xl overflow-hidden shadow-2xl">
        <iframe
          key={video.videoId}
          src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0&modestbranding=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
      <div className="flex-shrink-0 px-1">
        <h2 className="text-sm font-semibold text-white line-clamp-1 leading-snug">
          {video.title}
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">{video.channelTitle}</p>
      </div>
    </div>
  );
}
