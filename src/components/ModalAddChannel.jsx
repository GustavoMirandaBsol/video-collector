import { useState, useEffect, useRef } from 'react';
import { X, Search, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { resolveChannel } from '../services/youtubeService';

export default function ModalAddChannel({ onAdd, onClose, existingIds }) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [preview, setPreview] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSearch = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setStatus('loading');
    setPreview(null);
    setErrorMsg('');

    try {
      const channel = await resolveChannel(trimmed);

      if (existingIds.includes(channel.id)) {
        setStatus('error');
        setErrorMsg('Este canal ya está en tu biblioteca.');
        return;
      }

      setPreview(channel);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.message || 'No se encontró el canal. Verifica el ID o @handle.');
    }
  };

  const handleAdd = () => {
    if (preview) {
      onAdd(preview);
      onClose();
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (status !== 'idle') {
      setStatus('idle');
      setPreview(null);
      setErrorMsg('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key !== 'Enter' || status === 'loading') return;
    status === 'success' ? handleAdd() : handleSearch();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#212121] border border-[#3f3f3f] rounded-2xl w-full max-w-md mx-4 shadow-2xl shadow-black/60 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#3f3f3f]">
          <h2 className="text-base font-semibold text-white">Adicionar Canal de YouTube</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-[#3f3f3f]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-gray-400 text-sm leading-relaxed">
            Ingresa el{' '}
            <code className="text-red-400 bg-red-950/40 px-1.5 py-0.5 rounded text-xs">@handle</code>
            {' '}o el{' '}
            <code className="text-yellow-400 bg-yellow-950/30 px-1.5 py-0.5 rounded text-xs">ID del canal</code>
            {' '}(empieza con <span className="text-white font-mono text-xs">UC…</span>).
          </p>

          {/* Input + Botón buscar */}
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="@midudev  o  UCxxxxxxxx..."
              className="flex-1 bg-[#0f0f0f] border border-[#3f3f3f] focus:border-[#717171] rounded-lg px-4 py-2.5 text-sm outline-none text-white placeholder-gray-600 transition-colors font-mono"
            />
            <button
              onClick={handleSearch}
              disabled={status === 'loading' || !input.trim()}
              className="bg-[#3f3f3f] hover:bg-[#4f4f4f] disabled:opacity-40 disabled:cursor-not-allowed
                text-white px-4 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 flex-shrink-0"
            >
              {status === 'loading' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Estado de error */}
          {status === 'error' && (
            <div className="flex items-start gap-2.5 bg-red-900/20 border border-red-800/50 rounded-lg p-3">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300 leading-snug">{errorMsg}</p>
            </div>
          )}

          {/* Preview del canal encontrado */}
          {status === 'success' && preview && (
            <div className="flex items-center gap-3 bg-[#0f0f0f] border border-green-800/40 rounded-lg p-3">
              <img
                src={preview.thumbnail}
                alt={preview.title}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0 ring-2 ring-green-500/30"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{preview.title}</p>
                <p className="text-xs text-gray-500 truncate font-mono mt-0.5">{preview.id}</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#3f3f3f] bg-[#1a1a1a]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-[#3f3f3f]"
          >
            Cancelar
          </button>
          <button
            onClick={status === 'success' ? handleAdd : handleSearch}
            disabled={status === 'loading' || !input.trim()}
            className="px-5 py-2 text-sm font-semibold rounded-lg transition-colors
              disabled:opacity-40 disabled:cursor-not-allowed
              bg-red-600 hover:bg-red-700 active:bg-red-800 text-white"
          >
            {status === 'success' ? 'Agregar Canal' : 'Buscar'}
          </button>
        </div>
      </div>
    </div>
  );
}
