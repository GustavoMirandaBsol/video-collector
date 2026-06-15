const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

async function apiFetch(endpoint, params) {
  if (!API_KEY || API_KEY === 'REEMPLAZA_CON_TU_API_KEY') {
    throw new Error('Configura VITE_YOUTUBE_API_KEY en .env.local antes de continuar.');
  }

  const url = new URL(`${BASE_URL}/${endpoint}`);
  url.searchParams.set('key', API_KEY);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const res = await fetch(url.toString());
  const data = await res.json();

  if (!res.ok) {
    const msg = data?.error?.message || `HTTP ${res.status}`;
    const reason = data?.error?.errors?.[0]?.reason;
    if (reason === 'quotaExceeded') {
      throw new Error('Cuota diaria de la API agotada. Intenta mañana o usa otra API key.');
    }
    throw new Error(msg);
  }

  return data;
}

function normalizeChannel(item) {
  const t = item.snippet.thumbnails;
  return {
    id: item.id,
    title: item.snippet.title,
    thumbnail: t?.medium?.url ?? t?.default?.url ?? '',
    description: item.snippet.description,
  };
}

export async function getChannelById(id) {
  const data = await apiFetch('channels', { part: 'snippet', id });
  if (!data.items?.length) throw new Error('Canal no encontrado para el ID proporcionado.');
  return normalizeChannel(data.items[0]);
}

export async function getChannelByHandle(handle) {
  const withAt = handle.startsWith('@') ? handle : `@${handle}`;
  const data = await apiFetch('channels', { part: 'snippet', forHandle: withAt });
  if (!data.items?.length) throw new Error(`Canal no encontrado: ${withAt}`);
  return normalizeChannel(data.items[0]);
}

// Resuelve automáticamente: ID de canal (UC...) o handle (@username / username)
export async function resolveChannel(input) {
  const trimmed = input.trim();
  if (/^UC[a-zA-Z0-9_-]{20,}$/.test(trimmed)) {
    return getChannelById(trimmed);
  }
  return getChannelByHandle(trimmed);
}

export async function getChannelVideos(channelId) {
  const data = await apiFetch('search', {
    part: 'snippet',
    channelId,
    order: 'date',
    type: 'video',
    maxResults: 15,
  });

  return (data.items ?? []).map(item => ({
    videoId: item.id.videoId,
    title: item.snippet.title,
    thumbnail:
      item.snippet.thumbnails?.medium?.url ??
      item.snippet.thumbnails?.default?.url ??
      '',
    publishedAt: item.snippet.publishedAt,
    channelTitle: item.snippet.channelTitle,
  }));
}
