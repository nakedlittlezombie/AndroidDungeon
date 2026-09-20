import React, { useState } from 'react';
import { StagedScrapeItem } from '../types';
import { INITIAL_STAGED_SCRAPES } from '../data/mockDatabase';
import { 
  Database, 
  FolderOpen, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  ArrowRight, 
  Layers, 
  Check, 
  Sparkles,
  Sliders,
  ShieldCheck,
  FileCode,
  HardDrive
} from 'lucide-react';

interface ImportScrapeViewProps {
  onImportCompleted: (count: number) => void;
}

export const ImportScrapeView: React.FC<ImportScrapeViewProps> = ({ onImportCompleted }) => {
  const [stagedItems, setStagedItems] = useState<StagedScrapeItem[]>(INITIAL_STAGED_SCRAPES);
  const [selectedConflictItem, setSelectedConflictItem] = useState<StagedScrapeItem | null>(
    INITIAL_STAGED_SCRAPES.find(i => i.hasConflict) || null
  );
  const [selectedVariantId, setSelectedVariantId] = useState<string>('cover-b');
  const [inboundPath, setInboundPath] = useState('/Volumes/Media/Comics/Staging/2024_Q3_Inbound');
  const [activeEngine, setActiveEngine] = useState('cv-local');
  const [ocrEnabled, setOcrEnabled] = useState(false);
  const [highDpiEnabled, setHighDpiEnabled] = useState(true);
  const [aiVisionAssistEnabled, setAiVisionAssistEnabled] = useState(true);
  const [isScraping, setIsScraping] = useState(false);
  const [isVisionAnalyzing, setIsVisionAnalyzing] = useState(false);
  const [visionInspectionData, setVisionInspectionData] = useState<{
    analyzed: boolean;
    variantMatch: string;
    confidence: number;
    visualProof: string;
    barcodeDetected: string;
    recommendedVariantId: string;
  }>({
    analyzed: true,
    variantMatch: 'Variant B (Alex Ross Painted Virgin 1:25 Retailer Incentive)',
    confidence: 99.8,
    visualProof: 'Absence of commercial logo trade dress, barcode block removed on front, signature watercolor strokes match Alex Ross 1:25 retailer incentive.',
    barcodeDetected: '761941215456 02121',
    recommendedVariantId: 'cover-b'
  });

  const handleRunScrape = () => {
    setIsScraping(true);
    setTimeout(() => {
      setIsScraping(false);
      alert('Automated scrape completed against Local Comic Vine SQLite Cache (412k indexed issues) with AI Vision validation enabled.');
    }, 900);
  };

  const handleTriggerVisionAnalysis = () => {
    setIsVisionAnalyzing(true);
    setTimeout(() => {
      setIsVisionAnalyzing(false);
      setVisionInspectionData({
        analyzed: true,
        variantMatch: 'Variant B (Alex Ross Painted Virgin 1:25 Retailer Incentive)',
        confidence: 99.8,
        visualProof: 'Absence of commercial logo trade dress, barcode block removed on front, signature watercolor strokes match Alex Ross 1:25 retailer incentive.',
        barcodeDetected: '761941215456 02121',
        recommendedVariantId: 'cover-b'
      });
      setSelectedVariantId('cover-b');
    }, 600);
  };

  const handleApplyVisionMatchAndResolve = () => {
    if (!selectedConflictItem) return;
    setStagedItems(prev =>
      prev.map(item =>
        item.id === selectedConflictItem.id
          ? {
              ...item,
              status: 'ready',
              confidenceScore: 99.8,
              confidenceLabel: '99.8% AI Vision Match (Variant B)',
              hasConflict: false
            }
          : item
      )
    );
    setSelectedConflictItem(null);
  };

  const handleResolveConflict = () => {
    if (!selectedConflictItem) return;
    setStagedItems(prev =>
      prev.map(item =>
        item.id === selectedConflictItem.id
          ? {
              ...item,
              status: 'ready',
              confidenceScore: 99,
              confidenceLabel: '99% Match (Variant B)',
              hasConflict: false
            }
          : item
      )
    );
    setSelectedConflictItem(null);
  };

  const handleImportAll = () => {
    const verifiedCount = stagedItems.filter(i => i.status === 'ready').length;
    onImportCompleted(verifiedCount);
    alert(`Successfully imported ${verifiedCount} verified comic archives into local PANEL library!`);
  };

  return (
    <div className="w-full min-h-screen pt-20 pb-24 px-4 sm:px-6 max-w-[1440px] mx-auto flex flex-col gap-6">
      
      {/* 1. Workbench Stage Bar (Image 7) */}
      <div className="w-full bg-[#1c1b1b] border border-[#262626] rounded-xl p-3.5 sm:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="font-mono-caption text-[10px] text-emerald-400 uppercase tracking-widest block">
            STAGE 02 / METADATA HARVESTER
          </span>
          <h2 className="font-headline-sm text-xl text-white font-serif tracking-tight">
            Archival Ingestion Workbench
          </h2>
        </div>

        {/* Telemetry Chips */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-[#0f0e0e] border border-[#262626] px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs">
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[#8e9192]">Local Index Cache:</span>
            <span className="text-white font-mono">1.30M Issues (&lt;1ms)</span>
          </div>

          <div className="bg-[#0f0e0e] border border-[#262626] px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs">
            <Layers className="w-3.5 h-3.5 text-white" />
            <span className="text-[#8e9192]">Staging Pool:</span>
            <span className="text-white font-mono">32 Archives</span>
          </div>

          <div className="bg-[#241718] border border-rose-900/60 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs text-rose-300">
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-mono">Needs Review: 4 Conflicts</span>
          </div>
        </div>
      </div>

      {/* 2. Mounted Inbound Directory Bar */}
      <div className="bg-[#1c1b1b] border border-[#262626] rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <FolderOpen className="w-5 h-5 text-[#8e9192] shrink-0" />
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase">
              Mounted Inbound Ingestion Directory
            </span>
            <input
              type="text"
              value={inboundPath}
              onChange={(e) => setInboundPath(e.target.value)}
              className="bg-transparent text-sm text-white font-mono outline-none border-b border-transparent focus:border-white transition-colors truncate"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => alert('Directory picker simulated: /Volumes/Media/Comics/Staging')}
            className="bg-[#201f1f] hover:bg-[#2b2a2a] border border-[#333333] text-xs text-[#c4c7c8] hover:text-white py-2 px-3 rounded-lg transition-colors cursor-pointer"
          >
            Browse Enclave
          </button>

          <button
            onClick={handleRunScrape}
            disabled={isScraping}
            className="bg-white hover:bg-[#e6e1e1] text-black text-xs font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 fill-black ${isScraping ? 'animate-spin' : ''}`} />
            <span>{isScraping ? 'Matching SQLite...' : 'Run Automated Scrape & Match'}</span>
          </button>
        </div>
      </div>

      {/* 3. Scraper Engine Selectors & Toggles */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-[#262626] pb-4">
        
        {/* Engine Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase shrink-0 mr-1">
            Engine:
          </span>
          <button
            onClick={() => setActiveEngine('cv-local')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 flex items-center gap-2 ${
              activeEngine === 'cv-local'
                ? 'bg-white text-black font-semibold shadow'
                : 'bg-[#1c1b1b] text-[#c4c7c8] border border-[#262626]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Comic Vine (Local DB - Synced: Today • 412k)</span>
          </button>

          <button
            onClick={() => setActiveEngine('gcd-local')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 flex items-center gap-2 ${
              activeEngine === 'gcd-local'
                ? 'bg-white text-black font-semibold shadow'
                : 'bg-[#1c1b1b] text-[#c4c7c8] border border-[#262626]'
            }`}
          >
            <span>GCD (Local SQLite/Dump • 890k)</span>
          </button>

          <button
            onClick={() => setActiveEngine('anilist')}
            className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${
              activeEngine === 'anilist'
                ? 'bg-white text-black font-semibold shadow'
                : 'bg-[#1c1b1b] text-[#c4c7c8] border border-[#262626]'
            }`}
          >
            AniList Manga GraphQL
          </button>
        </div>

        {/* Feature Switches */}
        <div className="flex items-center gap-4 text-xs select-none flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer bg-purple-950/40 border border-purple-900/60 px-2.5 py-1 rounded-lg">
            <input
              type="checkbox"
              checked={aiVisionAssistEnabled}
              onChange={(e) => setAiVisionAssistEnabled(e.target.checked)}
              className="accent-purple-400 rounded"
            />
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span className="text-purple-200 font-medium">AI Vision Assist (SmolVLM / Vision Engine)</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={ocrEnabled}
              onChange={(e) => setOcrEnabled(e.target.checked)}
              className="accent-white rounded"
            />
            <span className="text-[#c4c7c8]">OCR Splash Pages</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={highDpiEnabled}
              onChange={(e) => setHighDpiEnabled(e.target.checked)}
              className="accent-white rounded"
            />
            <span className="text-[#c4c7c8]">Fetch 300DPI Covers</span>
          </label>
        </div>

      </div>

      {/* 4. Batch Action Ribbon */}
      <div className="bg-[#181717] border border-[#262626] rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <span className="text-sm font-semibold text-white block">
            Batch Queue: 32 Items Staged (28 Verified / 4 Pending Action)
          </span>
          <span className="font-mono-caption text-[11px] text-emerald-400 block mt-0.5">
            Local Index Matching: 0 API calls consumed • High-speed SQLite matching
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => alert('Skipped unresolved conflicts')}
            className="bg-[#201f1f] hover:bg-[#2b2a2a] border border-[#333333] text-xs text-[#c4c7c8] py-2 px-3 rounded-lg transition-colors cursor-pointer"
          >
            Skip Conflicts
          </button>
          <button
            onClick={handleImportAll}
            className="bg-white hover:bg-[#e6e1e1] text-black text-xs font-semibold py-2 px-4 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Import All Validated (28 issues)</span>
          </button>
        </div>
      </div>

      {/* 5. Inbound Inspection Matrix Table */}
      <div className="bg-[#1c1b1b] border border-[#262626] rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141313] border-b border-[#262626] text-[#8e9192] font-mono-caption text-[10px] uppercase">
              <tr>
                <th className="py-3 px-4">File Source</th>
                <th className="py-3 px-4">Catalog Match</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4">Source Key</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262626]">
              {stagedItems.map((item) => (
                <tr 
                  key={item.id}
                  className={`hover:bg-[#201f1f] transition-colors ${
                    item.id === selectedConflictItem?.id ? 'bg-[#2b2121]' : ''
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-14 rounded bg-[#0f0e0e] overflow-hidden shrink-0 border border-[#333333]">
                        <img src={item.coverUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-mono text-xs text-white truncate max-w-[200px]">
                          {item.filename}
                        </span>
                        <span className="font-mono-caption text-[10px] text-[#8e9192]">
                          {item.fileSize} · {item.fileFormat}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-col">
                      <span className="text-white font-medium text-xs">
                        {item.catalogMatchTitle}
                      </span>
                      <span className="text-[#8e9192] text-[11px]">
                        {item.publisher}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-mono-caption text-[10px] px-2 py-0.5 rounded ${
                        item.confidenceScore >= 95
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-900'
                          : item.hasConflict
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-900'
                          : 'bg-blue-950/60 text-blue-300 border border-blue-900'
                      }`}>
                        {item.confidenceLabel}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-mono text-xs text-[#c4c7c8]">
                      {item.sourceKey}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {item.status === 'resolve' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedConflictItem(item);
                            handleTriggerVisionAnalysis();
                          }}
                          title="Run AI Vision on Cover Art"
                          className="px-2.5 py-1.5 rounded bg-purple-950/50 hover:bg-purple-900/60 border border-purple-700/60 text-purple-200 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                          <span>AI Vision Match</span>
                        </button>
                        <button
                          onClick={() => setSelectedConflictItem(item)}
                          className="bg-amber-400 hover:bg-amber-300 text-black font-semibold text-xs py-1.5 px-3 rounded cursor-pointer transition-colors"
                        >
                          Resolve Conflict
                        </button>
                      </div>
                    ) : item.status === 'ready' ? (
                      <span className="text-emerald-400 font-mono-caption text-[10px] flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        READY
                      </span>
                    ) : (
                      <span className="text-[#8e9192] font-mono-caption text-[10px] flex items-center justify-end gap-1">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        SCRAPING
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Split-Pane Conflict Resolver & Edition Matcher (Image 7) */}
      {selectedConflictItem && selectedConflictItem.conflictDetails && (
        <div className="bg-[#1c1b1b] border-2 border-amber-500/60 rounded-2xl p-5 sm:p-6 shadow-2xl flex flex-col gap-5">
          
          <div className="flex items-center justify-between border-b border-[#262626] pb-3">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-amber-500/20 text-amber-400 rounded-lg">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <span className="font-mono-caption text-[10px] text-amber-400 uppercase tracking-widest block">
                  ARCHIVE CONFLICT DETECTED
                </span>
                <h3 className="font-headline-sm text-lg text-white font-serif tracking-tight">
                  Issue Variant &amp; Edition Mismatch
                </h3>
              </div>
            </div>

            <button
              onClick={() => setSelectedConflictItem(null)}
              className="text-xs text-[#8e9192] hover:text-white transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>

          {/* Split Column: Embedded vs Candidate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left: Embedded Archive Payload */}
            <div className="bg-[#141313] border border-[#262626] rounded-xl p-4 flex flex-col gap-3">
              <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase block">
                Source: Embedded Archive Payload
              </span>

              <div className="flex items-start gap-4">
                <img
                  src={selectedConflictItem.conflictDetails.rawPageThumb}
                  alt="Raw Page 00"
                  className="w-20 h-28 object-cover rounded border border-[#333333] shrink-0"
                />
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="text-sm font-semibold text-white">
                    {selectedConflictItem.conflictDetails.extractedTitle}
                  </span>
                  <span className="text-xs text-[#c4c7c8]">
                    Series: {selectedConflictItem.conflictDetails.extractedSeries}
                  </span>
                  <span className="text-xs text-[#8e9192]">
                    Release: {selectedConflictItem.conflictDetails.extractedRelease}
                  </span>
                </div>
              </div>

              {/* Raw ComicInfo.xml snippet */}
              <div className="mt-2 bg-[#0a0a0a] border border-[#262626] rounded p-2.5 font-mono text-[10px] text-[#c4c7c8] overflow-x-auto">
                <pre>{selectedConflictItem.conflictDetails.rawXml}</pre>
              </div>
            </div>

            {/* Right: Candidate Comic Vine & Variant Selector */}
            <div className="bg-[#141313] border border-[#262626] rounded-xl p-4 flex flex-col gap-3">
              <span className="font-mono-caption text-[10px] text-emerald-400 uppercase block">
                Candidate: {selectedConflictItem.conflictDetails.candidateId}
              </span>

              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-semibold text-white">
                  {selectedConflictItem.conflictDetails.canonicalTitle}
                </h4>
                <span className="text-xs text-[#c4c7c8]">
                  {selectedConflictItem.conflictDetails.publisherDate} · UPC: {selectedConflictItem.conflictDetails.upcBarcode}
                </span>
                <p className="text-xs text-[#8e9192] line-clamp-2 mt-1">
                  {selectedConflictItem.conflictDetails.synopsis}
                </p>
              </div>

              {/* Selectable Cover Variants */}
              <div className="mt-2">
                <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase block mb-2">
                  Select Matching Cover Variant:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {selectedConflictItem.conflictDetails.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`flex flex-col items-center gap-1.5 p-1.5 rounded-lg border text-left cursor-pointer transition-colors ${
                        selectedVariantId === v.id
                          ? 'border-white bg-[#201f1f]'
                          : 'border-[#262626] bg-[#0f0e0e] hover:border-[#444748]'
                      }`}
                    >
                      <img src={v.coverUrl} alt={v.name} className="w-full aspect-[2/3] object-cover rounded" />
                      <span className="font-mono text-[9px] text-[#c4c7c8] truncate w-full text-center">
                        {v.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* AI Vision Model Inspection Card */}
          <div className="bg-[#121111] border border-purple-900/60 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-purple-950/80 border border-purple-600/50 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
                </div>
                <div>
                  <span className="font-mono-caption text-[10px] text-purple-300 uppercase tracking-wider block">
                    AI VISION INSPECTOR · SMOLVLM (WEBGPU) / INFERENCE ENGINE
                  </span>
                  <span className="text-xs font-semibold text-white">
                    Automated Cover Feature &amp; Variant Verification
                  </span>
                </div>
              </div>

              <button
                onClick={handleTriggerVisionAnalysis}
                disabled={isVisionAnalyzing}
                className="px-2.5 py-1 rounded bg-[#201f1f] hover:bg-[#2b2a2a] border border-[#333333] text-[11px] text-[#c4c7c8] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3 h-3 ${isVisionAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isVisionAnalyzing ? 'Analyzing Pixels...' : 'Re-Run Vision Analysis'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#0a0a0a] border border-[#222222] p-3 rounded-lg text-xs">
              <div className="flex flex-col gap-1">
                <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase">Detected Artwork Variant</span>
                <span className="text-white font-medium">{visionInspectionData.variantMatch}</span>
                <span className="text-emerald-400 font-mono text-[10px]">
                  Confidence: {visionInspectionData.confidence}% (Conclusive Match)
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase">Visual Artifacts &amp; Proof</span>
                <p className="text-[#c4c7c8] text-[11px] line-clamp-3">
                  {visionInspectionData.visualProof}
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase">Barcode &amp; Corner OCR</span>
                <span className="font-mono text-white text-[11px]">
                  UPC: {visionInspectionData.barcodeDetected}
                </span>
                <span className="text-purple-300 font-mono text-[10px]">
                  Trade Dress: None (Virgin Edition)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#8e9192] italic">
                AI Vision recommends selecting Variant B (Alex Ross 1:25 Retailer Incentive).
              </span>
              <button
                onClick={handleApplyVisionMatchAndResolve}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-md cursor-pointer active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Auto-Select Detected Variant &amp; Resolve (99.8% Match)</span>
              </button>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setSelectedConflictItem(null)}
              className="bg-[#201f1f] hover:bg-[#2b2a2a] border border-[#333333] text-xs text-[#c4c7c8] py-2 px-4 rounded-lg transition-colors cursor-pointer"
            >
              Cancel &amp; Keep Local
            </button>
            <button
              onClick={handleResolveConflict}
              className="bg-white hover:bg-[#e6e1e1] text-black font-semibold text-xs py-2 px-5 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shadow"
            >
              <Check className="w-4 h-4" />
              <span>Confirm Match &amp; Import to Library</span>
            </button>
          </div>

        </div>
      )}

      {/* 7. Bottom Bento Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1c1b1b] border border-[#262626] rounded-xl p-4 flex flex-col gap-1">
          <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase">
            Archival Pipeline
          </span>
          <span className="font-mono text-2xl font-bold text-white">
            12,480 issues
          </span>
          <span className="text-xs text-[#8e9192]">
            Processed without error in current local store
          </span>
        </div>

        <div className="bg-[#1c1b1b] border border-[#262626] rounded-xl p-4 flex flex-col gap-1">
          <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase">
            Database Accuracy
          </span>
          <span className="font-mono text-2xl font-bold text-emerald-400">
            99.4%
          </span>
          <span className="text-xs text-[#8e9192]">
            First-pass SQLite exact match rate
          </span>
        </div>

        <div className="bg-[#1c1b1b] border border-[#262626] rounded-xl p-4 flex flex-col gap-1">
          <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase">
            Storage Health
          </span>
          <span className="font-mono text-2xl font-bold text-white">
            1.42 TB
          </span>
          <span className="text-xs text-[#8e9192]">
            Clean metadata cache partition
          </span>
        </div>
      </div>

    </div>
  );
};
