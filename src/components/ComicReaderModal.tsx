import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  Columns, 
  Square, 
  BookOpen, 
  Sliders
} from 'lucide-react';

interface ComicReaderModalProps {
  isOpen: boolean;
  comicTitle: string;
  issueLabel: string;
  initialPage?: number;
  totalPages?: number;
  onClose: () => void;
}

export const ComicReaderModal: React.FC<ComicReaderModalProps> = ({
  isOpen,
  comicTitle,
  issueLabel,
  initialPage = 24,
  totalPages = 36,
  onClose
}) => {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [zoom, setZoom] = useState(100);
  const [isSpread, setIsSpread] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage, isOpen]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setCurrentPage(p => Math.min(totalPages, p + (isSpread ? 2 : 1)));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentPage(p => Math.max(1, p - (isSpread ? 2 : 1)));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, totalPages, isSpread, onClose]);

  if (!isOpen) return null;

  const nextPage = () => setCurrentPage(p => Math.min(totalPages, p + (isSpread ? 2 : 1)));
  const prevPage = () => setCurrentPage(p => Math.max(1, p - (isSpread ? 2 : 1)));

  // Simulated page artwork themes
  const sampleArtworks = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCYxzJvAIUP6oMNHIlsU9yAayHKvJepuBAybZU7HppJGpiNtI5EOX2-CE7vnMGiYOJPb7sJwuL1aFYtjQCOlhCL5M_BAq4vsVHoSskp-eHmbeaDqv53Kjl1HbbqXR11g_NEmYv9BxuT2RkMGBwQugJ9_4pP3bcDNR1l971h9Gu1H2d9_oxsQiYrpCPKrgATQj3F79_pB9k0Zywa2NFcUNUR3uTx8FhlZE8M9yH7N_M8niIrQC4jYEc",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBvsw609fr1ZejqFFTb3ADKhQq39TfYNw8YI52yhlGYPzcs0FUPxCxGv7m68ObD8Xh8RJ3qd4MBLkLVdMe8ivlbiLZRLjUETEBWvSuLYtCKSLxNmuLLm9Igf31SsyCrB66Dl5im7RzJ3vw8dsESdQ7hxa7OJkVcTTcqWMF33AEWx6jyoZrfikKQEult_TAwDa4eN131vayJwI51jfzGPrGrbbUZ8ZLIHOlUpbza5LYW8uBwusat52E",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAiGz-ElzZfjpHIvFt-dWDecvV-qFgOAKRGXK1LQyxf1FT97AMOlw_zrVSSSM7OILsd1FHtIrBOMIXlMMXZAxHu7R1WpnrGTqM-7qWs0XatnEORsFf-siEQu6o0SNLxp-qZDZXwHLtGB0A4oaSzAuTQF87gxMa93mRpPhfchApxEWoLD9WubWz6NLuAJa3tXe0JXlQDs84obiFQokMlq1XPdK0gTj1V_2DCYeO_LIhjPxOrhCBIus8",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAtGN_7NMKRccJAX0hQRFxoY9LgqYWRb8xLgxONtasJ-DNFap9-CD1fX2j84u-KGfMrM85-Ht073xw62Tl7Q16duiNcU5hAhWD0fhX_xwa5VfbJpRn0SBpc5Io3hr1bRXToVyDrAcXO7kdo9aaCKed4VBIDL9Ylf04nutJ4BwYKVEbksOvnxL-UYHt6T_9pAc3AfBvbrDW8TqOPc9PS2floeHcNQxPVQIgput0-DCr7Y0bInU6IKEM",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDYdowF4puuLdxXCFUMn6FyuIva8ZDSe81U6zUyqhFnB8tAOhCaBQj7fm9R74MWdalaPppoU27GpMFfpmFCtiosobuQ2xDQVVfCdyBU_tVTt7Kbbl-LUchFIZCYJMcIxfiUvmp39uurtp_lc7ShNU4Z6xIdDAmbWltvkRVkXNy1hpIC1GhVQM9RHaabFdDn3k5veNYdshQUMBHg3gksdpJxvewSUM00XBbJKn1LZXrr2rctNFZ26Lk"
  ];
  const activeImage1 = sampleArtworks[(currentPage - 1) % sampleArtworks.length];
  const activeImage2 = sampleArtworks[currentPage % sampleArtworks.length];

  return (
    <div className="fixed inset-0 z-50 bg-[#080808] flex flex-col select-none overflow-hidden">
      
      {/* Top Reader Controls Bar */}
      <div className="h-14 bg-[#111111]/90 backdrop-blur-md border-b border-[#262626] px-4 flex items-center justify-between z-10 shrink-0">
        
        {/* Title & Issue */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#201f1f] hover:bg-[#2b2a2a] text-[#c4c7c8] hover:text-white border border-[#333333] transition-colors cursor-pointer"
            title="Exit Reader"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex flex-col min-w-0">
            <h3 className="text-sm font-semibold text-white truncate">
              {comicTitle}
            </h3>
            <span className="font-mono-caption text-[10px] text-[#8e9192]">
              {issueLabel} · PAGE {currentPage} OF {totalPages}
            </span>
          </div>
        </div>

        {/* Reader Display Tools */}
        <div className="flex items-center gap-2">
          
          {/* Zoom Buttons */}
          <div className="hidden sm:flex items-center bg-[#1c1b1b] border border-[#262626] rounded-lg p-0.5">
            <button
              onClick={() => setZoom(z => Math.max(60, z - 15))}
              className="p-1.5 text-[#8e9192] hover:text-white rounded cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-xs text-white px-2">
              {zoom}%
            </span>
            <button
              onClick={() => setZoom(z => Math.min(160, z + 15))}
              className="p-1.5 text-[#8e9192] hover:text-white rounded cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Spread / Single Page Toggle */}
          <button
            onClick={() => setIsSpread(!isSpread)}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              isSpread
                ? 'bg-white text-black border-white'
                : 'bg-[#1c1b1b] text-[#8e9192] hover:text-white border-[#262626]'
            }`}
            title={isSpread ? 'Single Page' : 'Double Page Spread'}
          >
            <Columns className="w-4 h-4" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => {
              if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen?.().catch(() => {});
                setIsFullscreen(true);
              } else {
                document.exitFullscreen?.().catch(() => {});
                setIsFullscreen(false);
              }
            }}
            className="p-2 rounded-lg bg-[#1c1b1b] hover:bg-[#262626] text-[#8e9192] hover:text-white border border-[#262626] transition-colors cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

        </div>

      </div>

      {/* Main Canvas Viewport with Left/Right Click zones */}
      <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-auto bg-[#070707]">
        
        {/* Left Arrow Button */}
        <button
          onClick={prevPage}
          disabled={currentPage <= 1}
          className="absolute left-4 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-opacity cursor-pointer disabled:opacity-0"
          title="Previous Page (Left Arrow)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Comic Pages Container */}
        <div 
          className="flex items-center justify-center gap-4 transition-transform duration-200"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          {/* Page 1 */}
          <div className="relative max-h-[82vh] max-w-[90vw] aspect-[2/3] rounded-lg shadow-2xl overflow-hidden border border-[#262626] bg-[#0d0d0d]">
            <img
              src={activeImage1}
              alt={`Page ${currentPage}`}
              className="w-full h-full object-contain"
            />
            <div className="absolute bottom-2 left-2 bg-black/70 px-2 py-0.5 rounded font-mono text-[10px] text-white">
              P. {currentPage}
            </div>
          </div>

          {/* Page 2 (if spread enabled) */}
          {isSpread && currentPage < totalPages && (
            <div className="relative max-h-[82vh] max-w-[90vw] aspect-[2/3] rounded-lg shadow-2xl overflow-hidden border border-[#262626] bg-[#0d0d0d]">
              <img
                src={activeImage2}
                alt={`Page ${currentPage + 1}`}
                className="w-full h-full object-contain"
              />
              <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 rounded font-mono text-[10px] text-white">
                P. {currentPage + 1}
              </div>
            </div>
          )}
        </div>

        {/* Right Arrow Button */}
        <button
          onClick={nextPage}
          disabled={currentPage >= totalPages}
          className="absolute right-4 z-20 w-12 h-12 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-opacity cursor-pointer disabled:opacity-0"
          title="Next Page (Right Arrow / Space)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

      </div>

      {/* Bottom Page Scrubber Rail */}
      <div className="h-12 bg-[#111111]/90 backdrop-blur-md border-t border-[#262626] px-4 flex items-center justify-between gap-4 z-10 shrink-0">
        <span className="font-mono text-xs text-[#8e9192] shrink-0">
          Page {currentPage} of {totalPages}
        </span>

        <input
          type="range"
          min="1"
          max={totalPages}
          value={currentPage}
          onChange={(e) => setCurrentPage(parseInt(e.target.value))}
          className="w-full max-w-xl accent-white cursor-pointer"
        />

        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono-caption text-[10px] text-[#8e9192] hidden sm:inline">
            ARROW KEYS OR SPACE TO FLIP
          </span>
        </div>
      </div>

    </div>
  );
};
