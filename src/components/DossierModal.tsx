import React from 'react';
import { IssueItem, SeriesRunItem } from '../types';
import { 
  X, 
  BookOpen, 
  Download, 
  Tag, 
  AlertCircle, 
  Search, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Layers
} from 'lucide-react';

interface DossierModalProps {
  issue: IssueItem | null;
  series: SeriesRunItem | null;
  onClose: () => void;
  onOpenReader: (comicTitle: string, issueLabel: string, initialPage: number) => void;
  onSearchMissingIssue: (searchQuery: string) => void;
  onPurgeIssue?: (issueId: string) => void;
}

export const DossierModal: React.FC<DossierModalProps> = ({
  issue,
  series,
  onClose,
  onOpenReader,
  onSearchMissingIssue,
  onPurgeIssue
}) => {
  if (!issue) return null;

  const handleStartReading = () => {
    const startPage = issue.readProgress > 0 ? Math.floor((issue.readProgress / 100) * issue.pageCount) : 1;
    onOpenReader(issue.title, issue.issueNum, Math.max(1, startPage));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      
      {/* Window Chrome Container */}
      <div className="relative w-full max-w-4xl bg-[#1c1b1b] border border-[#333333] rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Window Chrome Bar */}
        <div className="h-10 bg-[#141313] border-b border-[#262626] px-4 flex items-center justify-between select-none">
          {/* macOS window control buttons */}
          <div className="flex items-center gap-2">
            <button 
              onClick={onClose}
              className="w-3 h-3 rounded-full bg-[#ff5f56] hover:brightness-110 cursor-pointer focus:outline-none"
              title="Close"
            />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            <span className="ml-3 font-mono-caption text-[11px] text-[#8e9192] tracking-wider hidden sm:inline">
              ARCHIVE_METADATA_DOSSIER.JSON
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono-caption text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-900/60 px-2 py-0.5 rounded">
              SYS::READ_ONLY
            </span>
            <button
              onClick={onClose}
              className="text-[#8e9192] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body: Split view (Left Artwork + Actions, Right Metadata & Sequence) */}
        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Left Column: Cover art, reading rail & buttons */}
          <div className="md:col-span-5 p-6 bg-[#161515] border-b md:border-b-0 md:border-r border-[#262626] flex flex-col items-center">
            
            {/* Framed Cover Artwork */}
            <div className="relative group w-full max-w-[260px] aspect-[2/3] rounded-lg overflow-hidden shadow-2xl border border-[#333333]">
              <img
                src={issue.coverUrl}
                alt={issue.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-white/20 font-mono-caption text-[10px] text-white">
                {issue.format}
              </div>
              <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-white/20 font-mono-caption text-[10px] text-white">
                {issue.fileSize}
              </div>
            </div>

            {/* Reading Progress Rail */}
            <div className="w-full max-w-[260px] mt-4 flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase">
                  Reading Progress
                </span>
                <span className="font-mono text-xs text-white">
                  {issue.readProgress}% READ
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#0f0e0e] rounded-full overflow-hidden border border-[#262626]">
                <div 
                  className="h-full bg-white rounded-full transition-all duration-300"
                  style={{ width: `${issue.readProgress}%` }}
                />
              </div>
              <span className="text-[11px] text-[#8e9192] text-right font-mono">
                Page {Math.floor((issue.readProgress / 100) * issue.pageCount)} of {issue.pageCount}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="w-full max-w-[260px] mt-4 flex flex-col gap-2">
              <button
                onClick={handleStartReading}
                className="w-full bg-white hover:bg-[#e6e1e1] text-black font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer shadow"
              >
                <BookOpen className="w-4 h-4" />
                <span>
                  {issue.readProgress > 0 ? `Resume Reading (P. ${Math.floor((issue.readProgress / 100) * issue.pageCount)})` : 'Start Reading #1'}
                </span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => alert(`Simulated downloading local archival archive: ${issue.title} ${issue.issueNum} (${issue.fileSize})`)}
                  className="bg-[#201f1f] hover:bg-[#2b2a2a] border border-[#333333] text-[#e6e1e1] text-xs py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#8e9192]" />
                  <span>Download</span>
                </button>
                <button
                  onClick={() => alert(`ComicInfo.xml tags editor opened for ${issue.title} ${issue.issueNum}`)}
                  className="bg-[#201f1f] hover:bg-[#2b2a2a] border border-[#333333] text-[#e6e1e1] text-xs py-2 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Tag className="w-3.5 h-3.5 text-[#8e9192]" />
                  <span>Edit Tags</span>
                </button>
              </div>
            </div>

          </div>

          {/* Right Column: Metadata, Logline & Run Sequence */}
          <div className="md:col-span-7 p-6 flex flex-col justify-between">
            
            <div className="flex flex-col gap-4">
              
              {/* Publisher, Badges & Rating */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono-caption text-[11px] text-white tracking-widest bg-[#2b2a2a] px-2 py-0.5 rounded border border-[#333333]">
                    {issue.publisher}
                  </span>
                  <span className="font-mono-caption text-[11px] text-[#8e9192]">
                    RELEASE {issue.year}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-amber-400 text-xs font-mono">
                  <Sparkles className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{issue.rating} / 10 · MASTER RUN</span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h2 className="font-headline-sm text-2xl text-white font-serif tracking-tight">
                  {issue.title}
                </h2>
                <p className="font-body-sm text-sm text-[#c4c7c8] mt-0.5">
                  {issue.subtitle} ({issue.issueNum})
                </p>
              </div>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#141313] p-3.5 rounded-xl border border-[#262626]">
                <div>
                  <span className="font-mono-caption text-[9px] text-[#8e9192] uppercase block">
                    Writer
                  </span>
                  <span className="text-xs text-white font-medium truncate block">
                    {issue.writers.join(', ')}
                  </span>
                </div>
                <div>
                  <span className="font-mono-caption text-[9px] text-[#8e9192] uppercase block">
                    Cover Artist
                  </span>
                  <span className="text-xs text-white font-medium truncate block">
                    {issue.coverArtists.join(', ')}
                  </span>
                </div>
                <div>
                  <span className="font-mono-caption text-[9px] text-[#8e9192] uppercase block">
                    Interior Pencils
                  </span>
                  <span className="text-xs text-white font-medium truncate block">
                    {issue.pencillers.join(', ')}
                  </span>
                </div>
                <div>
                  <span className="font-mono-caption text-[9px] text-[#8e9192] uppercase block">
                    Published
                  </span>
                  <span className="text-xs text-white font-medium truncate block">
                    {issue.publishedDate}
                  </span>
                </div>
                <div>
                  <span className="font-mono-caption text-[9px] text-[#8e9192] uppercase block">
                    Page Count
                  </span>
                  <span className="text-xs text-white font-medium truncate block">
                    {issue.pageCount} Pages
                  </span>
                </div>
                <div>
                  <span className="font-mono-caption text-[9px] text-[#8e9192] uppercase block">
                    Colorist
                  </span>
                  <span className="text-xs text-white font-medium truncate block">
                    {issue.colorists.join(', ')}
                  </span>
                </div>
              </div>

              {/* Logline */}
              <div>
                <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase block mb-1">
                  Series Logline
                </span>
                <p className="font-body-sm text-xs text-[#c4c7c8] leading-relaxed">
                  {issue.logline}
                </p>
              </div>

              {/* Run Sequence & Completeness (Matching Image 11) */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase tracking-wider">
                    RUN SEQUENCE · ARC ISSUES
                  </span>
                  {series && (
                    <span className="font-mono-caption text-[10px] text-white">
                      {series.ownedIssues} / {series.totalIssues} Owned ({series.completionPercentage}%)
                    </span>
                  )}
                </div>

                {/* Sequence Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    { num: '#20', owned: true, current: false },
                    { num: '#21', owned: true, current: true },
                    { num: '#22', owned: false, current: false, missing: true },
                    { num: '#23', owned: true, current: false },
                    { num: '#24', owned: false, current: false, missing: true },
                    { num: '#25', owned: true, current: false },
                    { num: '#26', owned: true, current: false },
                    { num: '#27', owned: true, current: false }
                  ].map((seq) => (
                    <div
                      key={seq.num}
                      className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1 shrink-0 ${
                        seq.current
                          ? 'bg-white text-black font-bold ring-1 ring-white'
                          : seq.missing
                          ? 'bg-rose-950/40 text-rose-300 border border-rose-800/60'
                          : 'bg-[#201f1f] text-[#c4c7c8] border border-[#262626]'
                      }`}
                    >
                      {seq.missing ? (
                        <AlertCircle className="w-3 h-3 text-rose-400" />
                      ) : seq.owned ? (
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      ) : null}
                      <span>{seq.num}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Issue Alert Spotlight (Image 11) */}
              <div className="bg-[#241718] border border-rose-900/60 rounded-xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 bg-rose-900/40 rounded-lg text-rose-400 shrink-0 mt-0.5">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-mono-caption text-[11px] text-rose-300 uppercase font-semibold block">
                      ISSUE #22 NOT IN VAULT
                    </span>
                    <span className="text-xs text-[#c4c7c8] block mt-0.5">
                      Season of Mists: Chapter 1 (Jan 1991) · Target: 36p · DC Vertigo Scans
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onSearchMissingIssue('The Sandman #22');
                  }}
                  className="bg-white hover:bg-[#e6e1e1] text-black text-xs font-semibold py-2 px-3 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Search &amp; Download #22 →</span>
                </button>
              </div>

            </div>

            {/* Footer Telemetry & Purge Action */}
            <div className="mt-6 pt-3 border-t border-[#262626] flex items-center justify-between text-xs text-[#8e9192]">
              <span className="font-mono text-[10px]">
                SHA256: {issue.checksum} · INDEXED
              </span>
              <button
                onClick={() => {
                  if (confirm(`Remove ${issue.title} ${issue.issueNum} from local library index?`)) {
                    onPurgeIssue?.(issue.id);
                    onClose();
                  }
                }}
                className="text-[#8e9192] hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Purge from Archive</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
