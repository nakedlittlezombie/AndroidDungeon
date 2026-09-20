import React, { useState, useEffect } from 'react';
import { ActiveTransfer, CompletedIngest, HarvesterResult } from '../types';
import { 
  INITIAL_ACTIVE_TRANSFERS, 
  INITIAL_COMPLETED_INGESTS, 
  HARVESTER_RESULTS_DATABASE 
} from '../data/mockDatabase';
import { 
  Download, 
  Pause, 
  Play, 
  X, 
  ArrowUp, 
  ArrowDown, 
  Search, 
  Radio, 
  CheckCircle2, 
  ShieldCheck, 
  Server, 
  HardDrive, 
  Activity, 
  Wifi, 
  ExternalLink 
} from 'lucide-react';

interface DownloadsViewProps {
  initialSearchQuery?: string;
  onTransferCompleted?: (title: string) => void;
  onMoveToLibrary?: () => void;
}

export const DownloadsView: React.FC<DownloadsViewProps> = ({
  initialSearchQuery = '',
  onTransferCompleted,
  onMoveToLibrary
}) => {
  const [activeTransfers, setActiveTransfers] = useState<ActiveTransfer[]>(INITIAL_ACTIVE_TRANSFERS);
  const [completedIngests, setCompletedIngests] = useState<CompletedIngest[]>(INITIAL_COMPLETED_INGESTS);
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [isSearching, setIsSearching] = useState(false);
  const [harvesterResults, setHarvesterResults] = useState<HarvesterResult[]>([]);
  const [throttle, setThrottle] = useState('unlimited');
  const [allPaused, setAllPaused] = useState(false);

  // Auto-search if initial search query is provided
  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
      performSearch(initialSearchQuery);
    }
  }, [initialSearchQuery]);

  const performSearch = (query: string) => {
    if (!query.trim()) return;
    setIsSearching(true);
    setTimeout(() => {
      const q = query.toLowerCase();
      const results = HARVESTER_RESULTS_DATABASE[q] || [
        {
          id: `dyn-${Date.now()}-1`,
          title: `${query} (Digital HD Edition).cbz`,
          subtitle: `Direct Ingestion Mirror · Verified Lossless CBZ Archive`,
          sourceName: 'DDL (GetComics Mirror)',
          sourceType: 'ddl',
          payload: '74.5 MB',
          availability: 'Online (100% Mirror)'
        },
        {
          id: `dyn-${Date.now()}-2`,
          title: `${query} Complete Run [Prowlarr Jackett Pack]`,
          subtitle: `alt.binaries / torrent swarm target`,
          sourceName: 'Torrent (Prowlarr)',
          sourceType: 'torrent',
          payload: '184 MB',
          availability: '52 Seeds / 4 Peers'
        }
      ];
      setHarvesterResults(results);
      setIsSearching(false);
    }, 450);
  };

  const handleStartIngest = (result: HarvesterResult) => {
    const newTransfer: ActiveTransfer = {
      id: `transfer-${Date.now()}`,
      title: result.title,
      creatorsPublisher: result.subtitle,
      source: `SOURCE: ${result.sourceName.toUpperCase()}`,
      priority: 'HIGH',
      currentBytes: '4.2 MB',
      totalBytes: result.payload,
      percentage: 6,
      speed: '24.5 MB/s',
      eta: 'ETA 28s',
      chunkProgress: 'Chunk 12 / 180',
      securityNote: 'SHA256 Validation Armed',
      coverUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYxzJvAIUP6oMNHIlsU9yAayHKvJepuBAybZU7HppJGpiNtI5EOX2-CE7vnMGiYOJPb7sJwuL1aFYtjQCOlhCL5M_BAq4vsVHoSskp-eHmbeaDqv53Kjl1HbbqXR11g_NEmYv9BxuT2RkMGBwQugJ9_4pP3bcDNR1l971h9Gu1H2d9_oxsQiYrpCPKrgATQj3F79_pB9k0Zywa2NFcUNUR3uTx8FhlZE8M9yH7N_M8niIrQC4jYEc',
      formatBadge: 'CBZ',
      paused: false
    };

    setActiveTransfers(prev => [newTransfer, ...prev]);
    alert(`Queued ingestion for "${result.title}" from ${result.sourceName}!`);
  };

  const togglePauseTransfer = (id: string) => {
    setActiveTransfers(prev =>
      prev.map(t => (t.id === id ? { ...t, paused: !t.paused } : t))
    );
  };

  const cancelTransfer = (id: string) => {
    setActiveTransfers(prev => prev.filter(t => t.id !== id));
  };

  const toggleAll = () => {
    const newState = !allPaused;
    setAllPaused(newState);
    setActiveTransfers(prev => prev.map(t => ({ ...t, paused: newState })));
  };

  return (
    <div className="w-full min-h-screen pt-20 pb-24 px-4 sm:px-6 max-w-[1440px] mx-auto flex flex-col gap-6">
      
      {/* 1. Protocol & Bandwidth Telemetry Header (Image 15) */}
      <div className="w-full bg-[#1c1b1b] border border-[#262626] rounded-xl p-3.5 sm:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="font-mono-caption text-[10px] text-emerald-400 uppercase tracking-widest block">
            PROTOCOL V4.19 · ARCHIVAL TRANSFER ENCLAVE
          </span>
          <div className="flex items-center gap-3">
            <h2 className="font-headline-sm text-xl text-white font-serif tracking-tight">
              Ingress Stream Engine
            </h2>
            <span className="font-mono text-xs text-[#8e9192]">
              {activeTransfers.length} In Flight · 14 Queued
            </span>
          </div>
        </div>

        {/* Bandwidth & Ingress Stats */}
        <div className="flex items-center gap-6 sm:gap-8 flex-wrap w-full md:w-auto justify-between md:justify-end">
          <div>
            <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase block">
              Aggregate Bandwidth
            </span>
            <span className="font-mono text-sm sm:text-base font-semibold text-white">
              {allPaused ? '0.0 MB/s' : '38.4 MB/s'}
            </span>
          </div>

          <div>
            <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase block">
              NVMe Available
            </span>
            <span className="font-mono text-sm sm:text-base font-semibold text-emerald-400">
              1.4 TB Free
            </span>
          </div>

          {/* Pause All / Throttle controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleAll}
              className="bg-[#201f1f] hover:bg-[#2b2a2a] border border-[#333333] text-xs text-white py-1.5 px-3 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              {allPaused ? (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Resume All</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause All</span>
                </>
              )}
            </button>

            <select
              value={throttle}
              onChange={(e) => setThrottle(e.target.value)}
              className="bg-[#201f1f] border border-[#333333] text-xs text-[#c4c7c8] py-1.5 px-2 rounded-lg outline-none cursor-pointer"
            >
              <option value="unlimited">Throttle: Unlimited</option>
              <option value="50mb">Throttle: 50 MB/s</option>
              <option value="night">Night Sync: 10 MB/s</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Universal Search & Remote Harvester */}
      <div className="bg-[#1c1b1b] border border-[#262626] rounded-xl p-5 flex flex-col gap-4 shadow-lg">
        <div>
          <span className="font-mono-caption text-[10px] text-white uppercase tracking-wider block">
            REMOTE HARVESTER &amp; METADATA INGESTION SEARCH
          </span>
          <p className="font-body-sm text-xs text-[#8e9192] mt-0.5">
            Query across connected Direct Mirrors (GetComics), Torrents (Jackett/Prowlarr), Usenet NZB, and OPDS remote feeds.
          </p>
        </div>

        {/* Search Input Row */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8e9192] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && performSearch(searchQuery)}
              placeholder="Search missing issue or omnibus (e.g. The Sandman #22)..."
              className="w-full bg-[#0f0e0e] border border-[#333333] focus:border-white rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#8e9192] outline-none transition-colors font-mono"
            />
          </div>

          <button
            onClick={() => performSearch(searchQuery)}
            disabled={isSearching}
            className="bg-white hover:bg-[#e6e1e1] text-black text-xs font-semibold py-2.5 px-5 rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow disabled:opacity-50"
          >
            <Radio className={`w-3.5 h-3.5 ${isSearching ? 'animate-pulse' : ''}`} />
            <span>{isSearching ? 'Querying...' : 'Harvest Sources'}</span>
          </button>
        </div>

        {/* Harvester Search Results */}
        {harvesterResults.length > 0 && (
          <div className="mt-2 bg-[#141313] border border-[#262626] rounded-xl overflow-hidden">
            <div className="p-3 bg-[#181717] border-b border-[#262626] flex items-center justify-between text-xs text-[#8e9192]">
              <span className="font-mono-caption text-[10px] text-emerald-400">
                Found {harvesterResults.length} Ingestion Candidates for &quot;{searchQuery}&quot;
              </span>
              <span>Local Enclave Filter Active</span>
            </div>

            <div className="divide-y divide-[#262626]">
              {harvesterResults.map((result) => (
                <div
                  key={result.id}
                  className="p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-[#1a1919] transition-colors"
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-sm font-semibold text-white truncate">
                      {result.title}
                    </span>
                    <span className="text-xs text-[#8e9192]">
                      {result.subtitle} · <span className="text-emerald-400 font-mono">{result.availability}</span>
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-mono text-xs text-[#c4c7c8] bg-[#201f1f] px-2 py-1 rounded border border-[#262626]">
                      {result.payload}
                    </span>
                    <button
                      onClick={() => handleStartIngest(result)}
                      className="bg-white hover:bg-[#e6e1e1] text-black text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Ingest Now</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 3. Ingress Waveform & Connected Providers (Image 15) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        
        {/* Waveform Canvas Monitor */}
        <div className="md:col-span-8 bg-[#1c1b1b] border border-[#262626] rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase">
              Ingress Network Spectrum · Packet Stream
            </span>
            <span className="font-mono text-xs text-emerald-400 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5" />
              PEAK: 42.1 MB/s
            </span>
          </div>

          {/* SVG Waveform Visualizer */}
          <div className="w-full h-16 relative flex items-end">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 60">
              <defs>
                <linearGradient id="waveGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 45 Q 30 20 60 35 T 120 15 T 180 30 T 240 10 T 300 25 T 360 8 T 400 18 L 400 60 L 0 60 Z"
                fill="url(#waveGrad)"
              />
              <path
                d="M 0 45 Q 30 20 60 35 T 120 15 T 180 30 T 240 10 T 300 25 T 360 8 T 400 18"
                fill="none"
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </svg>
          </div>
        </div>

        {/* Connected Remotes Box */}
        <div className="md:col-span-4 bg-[#1c1b1b] border border-[#262626] rounded-xl p-4 flex flex-col gap-2">
          <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase">
            Connected Ingestion Remotes
          </span>
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex items-center justify-between bg-[#141313] p-2 rounded border border-[#262626]">
              <span className="text-white">Remote WebDAV Vault</span>
              <span className="text-emerald-400 font-mono text-[10px]">4ms · 18.2 MB/s</span>
            </div>
            <div className="flex items-center justify-between bg-[#141313] p-2 rounded border border-[#262626]">
              <span className="text-white">Nextcloud Enclave</span>
              <span className="text-emerald-400 font-mono text-[10px]">Sync · 8.1 MB/s</span>
            </div>
            <div className="flex items-center justify-between bg-[#141313] p-2 rounded border border-[#262626]">
              <span className="text-white">Direct Torrent Daemon</span>
              <span className="text-[#8e9192] font-mono text-[10px]">12 Seeds</span>
            </div>
          </div>
        </div>

      </div>

      {/* 4. Active Ingestion Transfers (Image 15) */}
      <div className="bg-[#1c1b1b] border border-[#262626] rounded-xl p-5 flex flex-col gap-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-mono-caption text-[10px] text-white uppercase tracking-wider block">
              ACTIVE INGESTION QUEUE ({activeTransfers.length})
            </span>
            <span className="text-xs text-[#8e9192]">
              Real-time multi-threaded payloads downloading to staging partition
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {activeTransfers.map((item) => (
            <div
              key={item.id}
              className="bg-[#141313] border border-[#262626] hover:border-[#333333] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors"
            >
              {/* Cover & Title */}
              <div className="flex items-center gap-3.5 min-w-0 flex-1">
                <div className="w-12 h-16 rounded bg-[#0e0e0e] overflow-hidden shrink-0 border border-[#333333]">
                  <img src={item.coverUrl} alt="" className="w-full h-full object-cover" />
                </div>

                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-caption text-[9px] text-[#8e9192] bg-[#201f1f] px-1.5 py-0.5 rounded">
                      {item.source}
                    </span>
                    <span className={`font-mono-caption text-[9px] px-1.5 py-0.5 rounded ${
                      item.priority === 'HIGH' ? 'text-amber-300 bg-amber-950/60' : 'text-[#8e9192] bg-[#201f1f]'
                    }`}>
                      PRIORITY: {item.priority}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-white truncate mt-1">
                    {item.title}
                  </h4>
                  <span className="text-xs text-[#8e9192] truncate">
                    {item.creatorsPublisher}
                  </span>

                  {/* Progress Bar & Telemetry */}
                  <div className="w-full mt-2 flex flex-col gap-1">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="text-white">
                        {item.currentBytes} / {item.totalBytes} ({item.percentage}%)
                      </span>
                      <span className="text-emerald-400">
                        {item.paused ? 'PAUSED' : `${item.speed} · ${item.eta}`}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#0e0e0e] rounded-full overflow-hidden border border-[#262626]">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          item.paused ? 'bg-amber-400' : 'bg-white'
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <span className="font-mono text-[10px] text-[#8e9192]">
                      {item.chunkProgress} · {item.securityNote}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => togglePauseTransfer(item.id)}
                  className="p-2 rounded-lg bg-[#201f1f] hover:bg-[#2b2a2a] text-[#c4c7c8] hover:text-white border border-[#333333] transition-colors cursor-pointer"
                  title={item.paused ? 'Resume' : 'Pause'}
                >
                  {item.paused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => cancelTransfer(item.id)}
                  className="p-2 rounded-lg bg-[#201f1f] hover:bg-rose-950/50 text-[#8e9192] hover:text-rose-400 border border-[#333333] transition-colors cursor-pointer"
                  title="Cancel Transfer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* 5. Completed Archival Ingests (Image 15) */}
      <div className="bg-[#1c1b1b] border border-[#262626] rounded-xl overflow-hidden shadow-lg">
        <div className="p-4 bg-[#181717] border-b border-[#262626] flex items-center justify-between">
          <div>
            <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase block">
              COMPLETED ARCHIVAL INGESTS
            </span>
            <span className="text-xs text-white font-medium">
              Verified &amp; Checksum Armed Archives Ready for Staging
            </span>
          </div>

          <button
            onClick={() => {
              onMoveToLibrary?.();
              alert('All verified completed ingests moved to library catalog!');
            }}
            className="bg-[#201f1f] hover:bg-[#2b2a2a] border border-[#333333] text-xs text-white font-medium py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Move All to Library</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141313] border-b border-[#262626] text-[#8e9192] font-mono-caption text-[10px] uppercase">
              <tr>
                <th className="py-3 px-4">Payload Archive</th>
                <th className="py-3 px-4">Integrity Status</th>
                <th className="py-3 px-4">Size</th>
                <th className="py-3 px-4">Source Node</th>
                <th className="py-3 px-4 text-right">Ingested</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {completedIngests.map((comp) => (
                <tr key={comp.id} className="hover:bg-[#201f1f] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-white text-xs">
                        {comp.title}
                      </span>
                      <span className="text-[#8e9192] text-[11px]">
                        {comp.creatorsPublisher}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="font-mono-caption text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-900 px-2 py-0.5 rounded">
                      {comp.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-mono text-white">
                    {comp.payload}
                  </td>

                  <td className="py-3 px-4 text-[#c4c7c8]">
                    {comp.sourceNode}
                  </td>

                  <td className="py-3 px-4 text-right text-[#8e9192] font-mono">
                    {comp.ingestedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
