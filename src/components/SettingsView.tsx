import React, { useState } from 'react';
import { SystemSettings } from '../types';
import { INITIAL_SETTINGS } from '../data/mockDatabase';
import { 
  Database, 
  HardDrive, 
  FolderPlus, 
  RefreshCw, 
  Check, 
  Save, 
  Sliders, 
  Globe, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink,
  BookOpen,
  Layers,
  Cpu
} from 'lucide-react';

interface SettingsViewProps {
  onSave?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onSave }) => {
  const [settings, setSettings] = useState<SystemSettings>(INITIAL_SETTINGS);
  const [activeSubTab, setActiveSubTab] = useState('metadata');
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [testingClient, setTestingClient] = useState(false);

  const handleTestLink = () => {
    setTestingClient(true);
    setTimeout(() => {
      setTestingClient(false);
      alert('qBittorrent Daemon successfully reached at http://192.168.1.100:8080 (API v2.8.3 Auth OK)');
    }, 400);
  };

  const handleSave = () => {
    setIsSavedToast(true);
    onSave?.();
    setTimeout(() => setIsSavedToast(false), 2500);
  };

  return (
    <div className="w-full min-h-screen pt-20 pb-32 px-4 sm:px-6 max-w-[1440px] mx-auto flex flex-col gap-6">
      
      {/* 1. Sys.Kernel Header (Image 1) */}
      <div className="w-full bg-[#1c1b1b] border border-[#262626] rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="font-mono-caption text-[10px] text-emerald-400 uppercase tracking-widest block">
            SYS.KERNEL 4.19-ARCH · CONFIG REVISION 08.4
          </span>
          <h2 className="font-headline-sm text-xl text-white font-serif tracking-tight">
            Library Engine &amp; Archival Preferences
          </h2>
          <p className="font-body-sm text-xs text-[#8e9192] mt-0.5">
            Tune background daemons, local database synchronization, scraping heuristics, and direct storage mounts.
          </p>
        </div>

        {/* Diagnostics Box */}
        <div className="flex items-center gap-6 bg-[#141313] px-4 py-2.5 rounded-lg border border-[#262626]">
          <div className="flex flex-col">
            <span className="font-mono-caption text-[9px] text-[#8e9192] uppercase">
              Memory Allocation
            </span>
            <span className="font-mono text-xs font-semibold text-white">
              3.2 / 8 GB (Safe)
            </span>
          </div>
          <div className="h-6 w-px bg-[#262626]" />
          <div className="flex flex-col">
            <span className="font-mono-caption text-[9px] text-[#8e9192] uppercase">
              SQLite Cache
            </span>
            <span className="font-mono text-xs font-semibold text-emerald-400">
              324 MB Clean
            </span>
          </div>
        </div>
      </div>

      {/* Main Settings Grid: Sub-nav on left, Options on right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Sub-Navigation Menu */}
        <div className="md:col-span-3 flex flex-col gap-2">
          <div className="bg-[#1c1b1b] border border-[#262626] rounded-xl p-2 flex flex-col gap-1">
            {[
              { id: 'general', label: 'General & Paths' },
              { id: 'metadata', label: 'Metadata & Local DBs' },
              { id: 'indexers', label: 'Indexers & Downloaders' },
              { id: 'reader', label: 'Reader & Display' },
              { id: 'storage', label: 'Storage & Mounts' },
              { id: 'security', label: 'Security & Curators' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`text-left px-3.5 py-2 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                  activeSubTab === tab.id
                    ? 'bg-white text-black font-semibold shadow'
                    : 'text-[#c4c7c8] hover:text-white hover:bg-[#201f1f]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Enclave Health Card */}
          <div className="bg-[#1c1b1b] border border-[#262626] rounded-xl p-3.5 flex flex-col gap-2">
            <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase">
              Storage Partition Status
            </span>
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-white">NVMe RAID 0</span>
              <span className="text-emerald-400">ONLINE</span>
            </div>
            <div className="w-full h-1.5 bg-[#0f0e0e] rounded-full overflow-hidden border border-[#262626]">
              <div className="h-full bg-white rounded-full w-[92%]" />
            </div>
            <span className="font-mono text-[10px] text-[#8e9192]">
              1.84 TB / 2.0 TB utilized
            </span>
          </div>
        </div>

        {/* Right Settings Form Container */}
        <div className="md:col-span-9 flex flex-col gap-6">
          
          {/* Section 1: Metadata Harvesting & Index Caches (Image 1) */}
          <div className="bg-[#1c1b1b] border border-[#262626] rounded-xl p-5 sm:p-6 flex flex-col gap-5">
            <div>
              <span className="font-mono-caption text-[10px] text-white uppercase tracking-wider block">
                SECTION 01 · METADATA HARVESTING &amp; LOCAL CACHES
              </span>
              <p className="font-body-sm text-xs text-[#8e9192] mt-0.5">
                Local relational caches allow sub-millisecond offline matching without triggering Comic Vine API rate limits.
              </p>
            </div>

            {/* Comic Vine Local Database */}
            <div className="bg-[#141313] border border-[#262626] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-semibold text-white">
                    Comic Vine Local Database
                  </span>
                  <span className="font-mono-caption text-[9px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-900">
                    CONNECTED · 412,850 ISSUES
                  </span>
                </div>
                <span className="font-mono text-xs text-[#8e9192] truncate">
                  Path: {settings.cvDbPath}
                </span>
                <label className="flex items-center gap-2 mt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.cvSyncWeekly}
                    onChange={(e) => setSettings({ ...settings, cvSyncWeekly: e.target.checked })}
                    className="accent-white rounded"
                  />
                  <span className="text-xs text-[#c4c7c8]">
                    Auto-sync weekly delta dumps during midnight maintenance
                  </span>
                </label>
              </div>

              <button
                onClick={() => alert('Checking Comic Vine delta dump updates... (Current local store is up-to-date with 412,850 issues)')}
                className="bg-[#201f1f] hover:bg-[#2b2a2a] border border-[#333333] text-xs text-white py-2 px-3.5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Update Database</span>
              </button>
            </div>

            {/* GCD Local Database */}
            <div className="bg-[#141313] border border-[#262626] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-emerald-400" />
                  <span className="text-sm font-semibold text-white">
                    GCD Local Database (Grand Comics Database)
                  </span>
                  <span className="font-mono-caption text-[9px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-900">
                    ACTIVE · 894,120 RECORDS
                  </span>
                </div>
                <span className="font-mono text-xs text-[#8e9192] truncate">
                  Path: {settings.gcdDbPath}
                </span>
                <span className="text-xs text-[#8e9192]">
                  Relational dump indexing Golden Age, Silver Age, and international printings.
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => alert('Downloading latest GCD MySQL/SQLite compressed dump...')}
                  className="bg-[#201f1f] hover:bg-[#2b2a2a] border border-[#333333] text-xs text-[#c4c7c8] py-2 px-3 rounded-lg transition-colors cursor-pointer"
                >
                  Download Latest Dump
                </button>
                <button
                  onClick={() => alert('Local GCD relational database verified clean.')}
                  className="bg-white hover:bg-[#e6e1e1] text-black text-xs font-semibold py-2 px-3.5 rounded-lg transition-colors cursor-pointer shadow"
                >
                  Update Database
                </button>
              </div>
            </div>

          </div>

          {/* Section 2: Indexers & Remote Download Clients (Image 1) */}
          <div className="bg-[#1c1b1b] border border-[#262626] rounded-xl p-5 sm:p-6 flex flex-col gap-5">
            <div>
              <span className="font-mono-caption text-[10px] text-white uppercase tracking-wider block">
                SECTION 02 · INDEXERS &amp; DOWNLOAD CLIENTS
              </span>
              <p className="font-body-sm text-xs text-[#8e9192] mt-0.5">
                Connect torrent clients, Usenet downloaders, and direct download mirrors.
              </p>
            </div>

            {/* Torrent Download Client */}
            <div className="bg-[#141313] border border-[#262626] rounded-xl p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">
                  Torrent Download Client (qBittorrent)
                </span>
                <button
                  onClick={handleTestLink}
                  disabled={testingClient}
                  className="bg-[#201f1f] hover:bg-[#2b2a2a] border border-[#333333] text-xs text-white py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${testingClient ? 'animate-spin' : ''}`} />
                  <span>{testingClient ? 'Pinging...' : 'Test Link'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="font-mono-caption text-[10px] text-[#8e9192] block mb-1">Host</label>
                  <input
                    type="text"
                    value={settings.torrentHost}
                    onChange={(e) => setSettings({ ...settings, torrentHost: e.target.value })}
                    className="w-full bg-[#0f0e0e] border border-[#333333] rounded px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-mono-caption text-[10px] text-[#8e9192] block mb-1">Port</label>
                  <input
                    type="text"
                    value={settings.torrentPort}
                    onChange={(e) => setSettings({ ...settings, torrentPort: e.target.value })}
                    className="w-full bg-[#0f0e0e] border border-[#333333] rounded px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-mono-caption text-[10px] text-[#8e9192] block mb-1">Daemon User</label>
                  <input
                    type="text"
                    value={settings.torrentUser}
                    onChange={(e) => setSettings({ ...settings, torrentUser: e.target.value })}
                    className="w-full bg-[#0f0e0e] border border-[#333333] rounded px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Direct Download Mirror Crawler */}
            <div className="bg-[#141313] border border-[#262626] rounded-xl p-4 flex flex-col gap-3">
              <span className="text-sm font-semibold text-white">
                Direct Download Integration (GetComics Engine)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-mono-caption text-[10px] text-[#8e9192] block mb-1">Mirror Preference</label>
                  <input
                    type="text"
                    value={settings.ddlMirrorPref}
                    onChange={(e) => setSettings({ ...settings, ddlMirrorPref: e.target.value })}
                    className="w-full bg-[#0f0e0e] border border-[#333333] rounded px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-mono-caption text-[10px] text-[#8e9192] block mb-1">Ingestion Staging Path</label>
                  <input
                    type="text"
                    value={settings.ddlPath}
                    onChange={(e) => setSettings({ ...settings, ddlPath: e.target.value })}
                    className="w-full bg-[#0f0e0e] border border-[#333333] rounded px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Section 3: Ingestion Rules & Optimization (Image 1) */}
          <div className="bg-[#1c1b1b] border border-[#262626] rounded-xl p-5 sm:p-6 flex flex-col gap-4">
            <div>
              <span className="font-mono-caption text-[10px] text-white uppercase tracking-wider block">
                SECTION 03 · INGESTION RULES &amp; OPTIMIZATION
              </span>
            </div>

            <div className="flex flex-col divide-y divide-[#262626]">
              <label className="py-3 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-white block">Standardized Naming</span>
                  <span className="text-[11px] text-[#8e9192]">
                    Auto-rename newly scraped archives to: <code className="text-white font-mono">{settings.namingPattern}</code>
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.standardizedNaming}
                  onChange={(e) => setSettings({ ...settings, standardizedNaming: e.target.checked })}
                  className="w-4 h-4 accent-white"
                />
              </label>

              <label className="py-3 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-white block">Lossless WebP Thumbnail Engine</span>
                  <span className="text-[11px] text-[#8e9192]">
                    Pre-generate WebP cover previews for instant gallery browsing
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.webpThumbnailEngine}
                  onChange={(e) => setSettings({ ...settings, webpThumbnailEngine: e.target.checked })}
                  className="w-4 h-4 accent-white"
                />
              </label>

              <label className="py-3 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-white block">Preserve Original CBR / RAR Files</span>
                  <span className="text-[11px] text-[#8e9192]">
                    Keep uncompressed CBR bitstreams instead of converting to CBZ
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.preserveOriginalCbr}
                  onChange={(e) => setSettings({ ...settings, preserveOriginalCbr: e.target.checked })}
                  className="w-4 h-4 accent-white"
                />
              </label>

              <label className="py-3 flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-white block">Auto-strip Commercials</span>
                  <span className="text-[11px] text-[#8e9192]">
                    Scan and remove scanlation advertisements, website watermarks, and non-story pages
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.autoStripAds}
                  onChange={(e) => setSettings({ ...settings, autoStripAds: e.target.checked })}
                  className="w-4 h-4 accent-white"
                />
              </label>
            </div>
          </div>

          {/* Section 4: Library Root Mounts (Image 1) */}
          <div className="bg-[#1c1b1b] border border-[#262626] rounded-xl overflow-hidden shadow-lg">
            <div className="p-4 bg-[#181717] border-b border-[#262626] flex items-center justify-between">
              <div>
                <span className="font-mono-caption text-[10px] text-white uppercase block">
                  LIBRARY ROOT DIRECTORY MOUNTS
                </span>
                <span className="text-xs text-[#8e9192]">
                  Host paths monitored by PANEL filesystem watchers
                </span>
              </div>

              <button
                onClick={() => alert('Directory mount picker: Mount new NAS / ZFS Volume to PANEL')}
                className="bg-white hover:bg-[#e6e1e1] text-black text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow"
              >
                <FolderPlus className="w-3.5 h-3.5" />
                <span>Mount Directory</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#141313] border-b border-[#262626] text-[#8e9192] font-mono-caption text-[10px] uppercase">
                  <tr>
                    <th className="py-3 px-4">Mount Path</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Usage Ratio</th>
                    <th className="py-3 px-4">Volume</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#262626]">
                  <tr className="hover:bg-[#201f1f] transition-colors">
                    <td className="py-3 px-4 font-mono text-white">/Volumes/Media/Comics/Main_Library</td>
                    <td className="py-3 px-4 text-[#c4c7c8]">Master Archive</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-white">1.2 / 2.0 TB</span>
                        <div className="w-16 h-1.5 bg-[#0f0e0e] rounded-full overflow-hidden border border-[#262626]">
                          <div className="h-full bg-white rounded-full w-[60%]" />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#8e9192]">Pool A (ZFS)</td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => alert('Scanning /Volumes/Media/Comics/Main_Library... (0 new files)')}
                        className="text-white hover:underline font-medium text-xs cursor-pointer"
                      >
                        Scan Now
                      </button>
                    </td>
                  </tr>

                  <tr className="hover:bg-[#201f1f] transition-colors">
                    <td className="py-3 px-4 font-mono text-white">/Volumes/Media/Comics/Manga_Vault</td>
                    <td className="py-3 px-4 text-[#c4c7c8]">Manga (RTL)</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-white">420 GB / 1.0 TB</span>
                        <div className="w-16 h-1.5 bg-[#0f0e0e] rounded-full overflow-hidden border border-[#262626]">
                          <div className="h-full bg-white rounded-full w-[42%]" />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#8e9192]">Pool B (SSD)</td>
                    <td className="py-3 px-4 text-right">
                      <button 
                        onClick={() => alert('Scanning /Volumes/Media/Comics/Manga_Vault... (0 new files)')}
                        className="text-white hover:underline font-medium text-xs cursor-pointer"
                      >
                        Scan Now
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 5: Viewport Architecture / Reading Mechanics (Image 1) */}
          <div className="bg-[#1c1b1b] border border-[#262626] rounded-xl p-5 sm:p-6 flex flex-col gap-4">
            <div>
              <span className="font-mono-caption text-[10px] text-white uppercase tracking-wider block">
                SECTION 05 · VIEWPORT ARCHITECTURE &amp; RENDERING
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="font-mono-caption text-[10px] text-[#8e9192] block mb-1">
                  Default Canvas Fit
                </label>
                <select
                  value={settings.defaultCanvasFit}
                  onChange={(e) => setSettings({ ...settings, defaultCanvasFit: e.target.value as any })}
                  className="w-full bg-[#141313] border border-[#333333] rounded px-3 py-2 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="width">Fit to Width (Default)</option>
                  <option value="spread">Double Page Spread</option>
                  <option value="height">Fit to Height</option>
                </select>
              </div>

              <div>
                <label className="font-mono-caption text-[10px] text-[#8e9192] block mb-1">
                  Reading Flow Direction
                </label>
                <select
                  value={settings.readingFlowDirection}
                  onChange={(e) => setSettings({ ...settings, readingFlowDirection: e.target.value as any })}
                  className="w-full bg-[#141313] border border-[#333333] rounded px-3 py-2 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="ltr">Left-to-Right (Western)</option>
                  <option value="rtl">Right-to-Left (Manga / RTL)</option>
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-mono-caption text-[10px] text-[#8e9192]">
                    Lookahead Frame Cache
                  </label>
                  <span className="font-mono text-xs text-white">
                    {settings.lookaheadFrameCache} Pages
                  </span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="32"
                  step="2"
                  value={settings.lookaheadFrameCache}
                  onChange={(e) => setSettings({ ...settings, lookaheadFrameCache: parseInt(e.target.value) })}
                  className="w-full accent-white cursor-pointer mt-2"
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Floating Save Changes Dock at bottom (Image 1) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-xl px-4">
        <div className="bg-[#1c1b1b]/95 backdrop-blur-xl border border-[#333333] rounded-2xl p-3.5 px-5 shadow-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-[#c4c7c8] font-medium truncate">
              {isSavedToast ? 'Settings committed to daemon configuration!' : 'Modifications staged · Ingestion daemon standby'}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setSettings(INITIAL_SETTINGS)}
              className="bg-[#201f1f] hover:bg-[#2b2a2a] border border-[#333333] text-xs text-[#8e9192] hover:text-white py-2 px-3 rounded-lg transition-colors cursor-pointer"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              className="bg-white hover:bg-[#e6e1e1] text-black font-semibold text-xs py-2 px-4 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shadow"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
