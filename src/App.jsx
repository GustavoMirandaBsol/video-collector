import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import VideoCarousel from './components/VideoCarousel';
import VideoPlayer from './components/VideoPlayer';
import ModalAddChannel from './components/ModalAddChannel';
import { getChannelVideos } from './services/youtubeService';
import { Youtube } from 'lucide-react';

const STORAGE_KEY = 'yt_library_channels_v1';

function loadChannels() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

export default function App() {
  const [channels, setChannels] = useState(loadChannels);
  const [activeChannelId, setActiveChannelId] = useState(null);
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loadingVideos, setLoadingVideos] = useState(false);
  const [videosError, setVideosError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Persistir canales en localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(channels));
  }, [channels]);

  const addChannel = useCallback((channel) => {
    setChannels(prev =>
      prev.find(c => c.id === channel.id)
        ? prev
        : [...prev, { id: channel.id, title: channel.title, thumbnail: channel.thumbnail }]
    );
  }, []);

  const removeChannel = useCallback((id) => {
    setChannels(prev => prev.filter(c => c.id !== id));
    setActiveChannelId(prev => {
      if (prev === id) {
        setVideos([]);
        setSelectedVideo(null);
        setVideosError(null);
        return null;
      }
      return prev;
    });
  }, []);

  const selectChannel = useCallback(async (id) => {
    if (id === activeChannelId) return;

    setActiveChannelId(id);
    setVideos([]);
    setSelectedVideo(null);
    setVideosError(null);
    setLoadingVideos(true);

    try {
      const vids = await getChannelVideos(id);
      setVideos(vids);
      if (vids.length > 0) setSelectedVideo(vids[0]);
    } catch (err) {
      setVideosError(err.message);
    } finally {
      setLoadingVideos(false);
    }
  }, [activeChannelId]);

  const showContent = !loadingVideos && !videosError && videos.length > 0;
  const showWelcome = !activeChannelId && !loadingVideos;

  return (
    <div className="flex flex-col h-screen bg-[#0f0f0f] text-white overflow-hidden">
      <Navbar onAddChannel={() => setModalOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          channels={channels}
          activeChannelId={activeChannelId}
          onSelect={selectChannel}
          onRemove={removeChannel}
        />

        <main className="flex-1 flex flex-col overflow-hidden p-4 gap-3 min-w-0">
          {/* Pantalla de bienvenida */}
          {showWelcome && (
            <WelcomeScreen onAdd={() => setModalOpen(true)} hasChannels={channels.length > 0} />
          )}

          {/* Skeleton de carga */}
          {loadingVideos && <LoadingSkeleton />}

          {/* Error */}
          {videosError && !loadingVideos && (
            <ErrorScreen message={videosError} onRetry={() => activeChannelId && selectChannel(activeChannelId)} />
          )}

          {/* Contenido principal */}
          {showContent && (
            <>
              <VideoPlayer video={selectedVideo} />
              <VideoCarousel
                videos={videos}
                selectedVideoId={selectedVideo?.videoId}
                onSelect={setSelectedVideo}
              />
            </>
          )}
        </main>
      </div>

      {modalOpen && (
        <ModalAddChannel
          onAdd={addChannel}
          onClose={() => setModalOpen(false)}
          existingIds={channels.map(c => c.id)}
        />
      )}
    </div>
  );
}

function WelcomeScreen({ onAdd, hasChannels }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-gray-600 select-none">
      <Youtube className="w-20 h-20 mb-5 opacity-10" />
      <p className="text-xl font-semibold text-gray-500 mb-2">
        {hasChannels ? 'Selecciona un canal' : 'Tu biblioteca está vacía'}
      </p>
      <p className="text-sm text-gray-600 mb-6">
        {hasChannels
          ? 'Elige un canal del panel izquierdo para ver sus videos.'
          : 'Agrega canales de YouTube para comenzar tu biblioteca.'}
      </p>
      {!hasChannels && (
        <button
          onClick={onAdd}
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
        >
          Adicionar primer canal
        </button>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="flex-1 flex flex-col gap-3 animate-pulse min-h-0">
      {/* Skeleton del reproductor */}
      <div className="flex-1 min-h-0 bg-[#272727] rounded-xl" />
      {/* Info del video */}
      <div className="space-y-1.5 px-1">
        <div className="h-3.5 bg-[#272727] rounded w-2/3" />
        <div className="h-3 bg-[#272727] rounded w-1/4" />
      </div>
      {/* Skeleton del carrusel */}
      <div className="flex gap-3 flex-shrink-0 overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex-shrink-0 w-44 space-y-1.5">
            <div className="w-full aspect-video bg-[#272727] rounded-lg" />
            <div className="h-2.5 bg-[#272727] rounded w-full" />
            <div className="h-2.5 bg-[#272727] rounded w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorScreen({ message, onRetry }) {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="bg-red-950/30 border border-red-800/40 rounded-xl p-8 max-w-sm text-center space-y-3">
        <div className="w-10 h-10 bg-red-900/50 rounded-full flex items-center justify-center mx-auto">
          <span className="text-red-400 text-lg">!</span>
        </div>
        <p className="text-red-300 font-semibold">Error al cargar videos</p>
        <p className="text-red-400/70 text-sm leading-relaxed">{message}</p>
        <button
          onClick={onRetry}
          className="mt-2 px-4 py-2 text-sm bg-red-800/40 hover:bg-red-800/60 text-red-200 rounded-lg transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}
