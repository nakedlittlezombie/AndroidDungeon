import React, { useState } from 'react';
import { 
  IssueItem, 
  SeriesRunItem, 
  LibraryViewFilter, 
  PublisherFilter, 
  SortOption, 
  ViewMode 
} from '../types';
import { 
  BookOpen, 
  Layers, 
  SlidersHorizontal, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Grid3X3, 
  List, 
  Clock, 
  Calendar, 
  ArrowUpDown,
  HardDrive,
  Info
} from 'lucide-react';

interface LibraryViewProps {
  issues: IssueItem[];
  seriesList: SeriesRunItem[];
  onSelectIssue: (issue: IssueItem) => void;
  onSelectSeries: (series: SeriesRunItem) => void;
  onOpenReader: (title: string, issueLabel: string, page: number) => void;
  onSearchMissingIssue: (query: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  issues,
  seriesList,
  onSelectIssue,
  onSelectSeries,
  onOpenReader,
  onSearchMissingIssue
}) => {
  const [viewFilter, setViewFilter] = useState<LibraryViewFilter>('series');
  const [publisherFilter, setPublisherFilter] = useState<PublisherFilter>('all');
  const [sortBy, setSortBy] = useState<SortOption>('completion');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showcaseIndex, setShowcaseIndex] = useState(0);

  // Showcase featured items
  const showcaseItems = seriesList.slice(0, 4);
  const activeShowcase = showcaseItems[showcaseIndex] || showcaseItems[0];
  const featuredIssue = issues.find(i => i.seriesId === activeShowcase?.id) || issues[0];

  // Filtering series
  const filteredSeries = seriesList.filter(s => {
    if (publisherFilter !== 'all') {
      if (publisherFilter === 'vertigo' && s.imprintCategory !== 'vertigo') return false;
      if (publisherFilter === 'image' && s.imprintCategory !== 'image') return false;
      if (publisherFilter === 'kodansha' && s.imprintCategory !== 'kodansha') return false;
    }
    if (viewFilter === 'missing' && s.status !== 'missing_issues') return false;
    if (viewFilter === 'completed' && s.status !== 'complete') return false;
    if (viewFilter === 'publishers' && s.imprintCategory !== 'vertigo') return false;
    return true;
  });

  // Filtering issues
  const filteredIssues = issues.filter(i => {
    if (publisherFilter !== 'all') {
      if (publisherFilter === 'vertigo' && !i.publisher.toLowerCase().includes('vertigo') && !i.publisher.toLowerCase().includes('dc')) return false;
      if (publisherFilter === 'image' && !i.publisher.toLowerCase().includes('image')) return false;
      if (publisherFilter === 'kodansha' && !i.publisher.toLowerCase().includes('kodansha')) return false;
    }
    if (viewFilter === 'reading' && i.readStatus !== 'reading') return false;
    if (viewFilter === 'completed' && i.readStatus !== 'completed') return false;
    return true;
  });

  // Calculate statistics
  const totalIssuesCount = 4280;
  const totalSeriesCount = 186;
  const metadataMatchedRate = 94.2;

  return (
    <div className="w-full min-h-screen pt-20 pb-24 px-4 sm:px-6 max-w-[1440px] mx-auto flex flex-col gap-6">
      
      {/* 1. Master Vault Telemetry Bar (Image 5, 9) */}
      <div className="w-full bg-[#1c1b1b] border border-[#262626] rounded-xl p-3.5 sm:p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#2b2a2a] flex items-center justify-center border border-[#333333]">
            <HardDrive className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase tracking-widest block">
              CATALOG INDEX / MASTER VAULT
            </span>
            <span className="font-headline-sm text-lg text-white font-serif tracking-tight">
              Androids Archival Repository
            </span>
          </div>
        </div>

        {/* Telemetry Metrics */}
        <div className="flex items-center gap-6 sm:gap-8 flex-wrap w-full md:w-auto justify-between md:justify-end">
          <div>
            <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase block">
              Indexed Issues
            </span>
            <span className="font-mono text-sm sm:text-base font-semibold text-white">
              {totalIssuesCount.toLocaleString()}
            </span>
          </div>

          <div>
            <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase block">
              Series Runs
            </span>
            <span className="font-mono text-sm sm:text-base font-semibold text-white">
              {totalSeriesCount}
            </span>
          </div>

          <div>
            <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase block">
              Metadata Match
            </span>
            <span className="font-mono text-sm sm:text-base font-semibold text-emerald-400">
              {metadataMatchedRate}%
            </span>
          </div>

          <div className="min-w-[140px] flex flex-col gap-1">
            <div className="flex items-center justify-between font-mono-caption text-[10px]">
              <span className="text-[#8e9192]">Array Storage</span>
              <span className="text-white font-mono">1.84 / 2.0 TB</span>
            </div>
            <div className="w-full h-1.5 bg-[#0f0e0e] rounded-full overflow-hidden border border-[#262626]">
              <div className="h-full bg-white rounded-full w-[92%]" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Jump Back In / Showcase Hero Banner (Image 5, 9) */}
      {activeShowcase && (
        <div className="relative w-full rounded-2xl overflow-hidden border border-[#333333] shadow-2xl bg-[#141313] min-h-[340px] flex flex-col justify-end p-6 sm:p-10">
          
          {/* Backdrop Cover Image with Gradient Vignette */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center transition-all duration-700 filter brightness-40 contrast-110"
            style={{ 
              backgroundImage: `url(${activeShowcase.backdropUrl || activeShowcase.coverUrl})`
            }}
          />
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#141313] via-[#141313]/70 to-transparent" />
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#141313] via-[#141313]/80 to-transparent" />

          {/* Hero Content */}
          <div className="relative z-10 max-w-2xl flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="font-mono-caption text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-900 px-2 py-0.5 rounded tracking-wider">
                JUMP BACK IN · CURRENTLY READING
              </span>
              <span className="font-mono-caption text-[11px] text-[#c4c7c8]">
                {activeShowcase.publisher} · {activeShowcase.years}
              </span>
            </div>

            <h1 className="font-headline-lg text-3xl sm:text-5xl text-white font-serif tracking-tight drop-shadow-md">
              {activeShowcase.title}
            </h1>

            <p className="font-body-sm text-sm text-[#e6e1e1] line-clamp-2 max-w-xl drop-shadow">
              {activeShowcase.logline}
            </p>

            {/* Reading Progress Rail */}
            <div className="w-full max-w-md flex flex-col gap-1 mt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono-caption text-[10px] text-[#c4c7c8]">
                  Issue #21 (Prologue)
                </span>
                <span className="font-mono text-xs text-white">
                  68% READ (PAGE 24 OF 36)
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#0e0e0e]/80 rounded-full overflow-hidden border border-[#333333]">
                <div className="h-full bg-white rounded-full w-[68%]" />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <button
                onClick={() => onOpenReader(activeShowcase.title, '#21', 24)}
                className="bg-white hover:bg-[#e6e1e1] text-black font-semibold text-xs sm:text-sm py-2.5 px-5 rounded-lg flex items-center gap-2 transition-all cursor-pointer shadow-lg"
              >
                <BookOpen className="w-4 h-4" />
                <span>Continue Reading (Page 24)</span>
              </button>

              <button
                onClick={() => onSelectIssue(featuredIssue)}
                className="bg-[#201f1f]/80 hover:bg-[#2b2a2a] backdrop-blur-md border border-[#444748] text-white text-xs sm:text-sm py-2.5 px-4 rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Info className="w-4 h-4 text-[#c4c7c8]" />
                <span>Inspect Dossier</span>
              </button>
            </div>
          </div>

          {/* Carousel Dots */}
          <div className="absolute bottom-6 right-6 z-10 flex items-center gap-2">
            {showcaseItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setShowcaseIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  showcaseIndex === idx ? 'w-6 bg-white' : 'w-2 bg-[#8e9192]/50 hover:bg-[#8e9192]'
                }`}
                title={item.title}
              />
            ))}
          </div>

        </div>
      )}

      {/* 3. Filter Navigation Tabs & Controls Bar (Image 5, 9, 13) */}
      <div className="flex flex-col gap-4 border-b border-[#262626] pb-4">
        
        {/* Main Segmented View Tabs */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              onClick={() => setViewFilter('series')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                viewFilter === 'series'
                  ? 'bg-white text-black font-semibold shadow'
                  : 'bg-[#1c1b1b] text-[#c4c7c8] hover:text-white border border-[#262626]'
              }`}
            >
              All Series (186)
            </button>
            <button
              onClick={() => setViewFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                viewFilter === 'all'
                  ? 'bg-white text-black font-semibold shadow'
                  : 'bg-[#1c1b1b] text-[#c4c7c8] hover:text-white border border-[#262626]'
              }`}
            >
              All Issues ({issues.length})
            </button>
            <button
              onClick={() => setViewFilter('reading')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                viewFilter === 'reading'
                  ? 'bg-white text-black font-semibold shadow'
                  : 'bg-[#1c1b1b] text-[#c4c7c8] hover:text-white border border-[#262626]'
              }`}
            >
              Active Reads
            </button>
            <button
              onClick={() => setViewFilter('missing')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5 ${
                viewFilter === 'missing'
                  ? 'bg-white text-black font-semibold shadow'
                  : 'bg-[#1c1b1b] text-rose-300 hover:text-rose-100 border border-rose-900/40'
              }`}
            >
              <AlertCircle className="w-3 h-3" />
              <span>Missing Issues (42)</span>
            </button>
            <button
              onClick={() => setViewFilter('completed')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors flex items-center gap-1.5 ${
                viewFilter === 'completed'
                  ? 'bg-white text-black font-semibold shadow'
                  : 'bg-[#1c1b1b] text-emerald-300 hover:text-emerald-100 border border-[#262626]'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Completed Runs (114)</span>
            </button>
            <button
              onClick={() => setViewFilter('publishers')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                viewFilter === 'publishers'
                  ? 'bg-white text-black font-semibold shadow'
                  : 'bg-[#1c1b1b] text-[#c4c7c8] hover:text-white border border-[#262626]'
              }`}
            >
              DC Vertigo Archive
            </button>
          </div>

          {/* Right Controls: Sort & View Toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#1c1b1b] border border-[#262626] rounded-lg px-2.5 py-1 text-xs text-[#c4c7c8]">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#8e9192]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-white outline-none cursor-pointer"
              >
                <option value="completion" className="bg-[#1c1b1b]">Run Completeness</option>
                <option value="recent" className="bg-[#1c1b1b]">Recently Added</option>
                <option value="alpha" className="bg-[#1c1b1b]">Series Name (A-Z)</option>
                <option value="rating" className="bg-[#1c1b1b]">Curator Rating</option>
              </select>
            </div>

            <div className="flex items-center bg-[#1c1b1b] border border-[#262626] rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#2b2a2a] text-white' : 'text-[#8e9192] hover:text-white'
                }`}
                title="Grid Layout"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded cursor-pointer ${
                  viewMode === 'table' ? 'bg-[#2b2a2a] text-white' : 'text-[#8e9192] hover:text-white'
                }`}
                title="Dense Table"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Secondary Imprint Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase shrink-0 mr-1">
            Imprint:
          </span>
          {[
            { id: 'all', label: 'All Publishers' },
            { id: 'vertigo', label: 'DC Vertigo' },
            { id: 'image', label: 'Image Comics' },
            { id: 'darkhorse', label: 'Dark Horse' },
            { id: 'kodansha', label: 'Kodansha' },
            { id: 'marvel', label: 'Marvel Modern' }
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setPublisherFilter(p.id as PublisherFilter)}
              className={`px-2.5 py-1 rounded text-xs cursor-pointer transition-colors shrink-0 ${
                publisherFilter === p.id
                  ? 'bg-[#363434] text-white font-medium border border-[#444748]'
                  : 'bg-[#141313] text-[#8e9192] hover:text-[#c4c7c8] border border-[#262626]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

      </div>

      {/* 4. DC Vertigo Dedicated Archive View (Image 13) */}
      {viewFilter === 'publishers' && (
        <div className="flex flex-col gap-6">
          
          {/* Publisher Header with Sparkline Health */}
          <div className="relative rounded-2xl overflow-hidden border border-[#333333] bg-[#141313] p-6 sm:p-8">
            <div 
              className="absolute inset-0 z-0 bg-cover bg-center opacity-30 filter contrast-125"
              style={{ backgroundImage: `url(${activeShowcase.coverUrl})` }}
            />
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#141313] via-[#141313]/90 to-transparent" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex flex-col gap-2 max-w-xl">
                <span className="font-mono-caption text-[10px] text-emerald-400 tracking-wider">
                  PUBLISHER ARCHIVE PROFILE
                </span>
                <h2 className="font-headline-lg text-3xl sm:text-4xl text-white font-serif tracking-tight">
                  DC Vertigo Archive
                </h2>
                <p className="font-body-sm text-xs sm:text-sm text-[#c4c7c8]">
                  Curated repository of seminal Vertigo imprints (1993–2019) featuring master editions of Sandman, Hellblazer, Preacher, Y: The Last Man, and Transmetropolitan.
                </p>
              </div>

              {/* Publisher Telemetry Stats */}
              <div className="flex items-center gap-6 bg-[#1c1b1b]/80 backdrop-blur-md p-4 rounded-xl border border-[#333333]">
                <div>
                  <span className="font-mono-caption text-[10px] text-[#8e9192] block">Catalog Volumes</span>
                  <span className="font-mono text-lg font-bold text-white">8 Series</span>
                </div>
                <div className="h-8 w-px bg-[#333333]" />
                <div>
                  <span className="font-mono-caption text-[10px] text-[#8e9192] block">Overall Completion</span>
                  <span className="font-mono text-lg font-bold text-emerald-400">97.8%</span>
                </div>
                <div className="h-8 w-px bg-[#333333]" />
                <div>
                  <span className="font-mono-caption text-[10px] text-[#8e9192] block">Disk Volume</span>
                  <span className="font-mono text-lg font-bold text-white">79.2 GB</span>
                </div>
              </div>
            </div>
          </div>

          <h3 className="font-headline-sm text-xl text-white font-serif tracking-tight">
            Archival Vertigo Runs
          </h3>
        </div>
      )}

      {/* 5. Main Content: Series View (Image 9) vs Issues View (Image 5) */}
      {viewFilter === 'series' || viewFilter === 'missing' || viewFilter === 'completed' || viewFilter === 'publishers' ? (
        
        /* Series Grid (Image 9) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredSeries.map((series) => (
            <div
              key={series.id}
              onClick={() => {
                const primaryIssue = issues.find(i => i.seriesId === series.id) || issues[0];
                onSelectIssue(primaryIssue);
              }}
              className="group bg-[#1c1b1b] hover:bg-[#201f1f] border border-[#262626] hover:border-[#444748] rounded-xl overflow-hidden transition-all duration-200 cursor-pointer flex flex-col justify-between shadow-lg hover:shadow-2xl"
            >
              {/* Cover Artwork Container */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#0f0e0e]">
                <img
                  src={series.coverUrl}
                  alt={series.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Publisher & Year Badge */}
                <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-white/20 font-mono-caption text-[10px] text-white">
                  {series.publisher}
                </div>

                {/* Status Pill */}
                <div className="absolute top-2.5 right-2.5">
                  {series.status === 'complete' ? (
                    <span className="bg-emerald-950/80 backdrop-blur-md border border-emerald-500/50 text-emerald-300 font-mono-caption text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      RUN COMPLETE
                    </span>
                  ) : (
                    <span className="bg-black/80 backdrop-blur-md border border-white/20 text-white font-mono-caption text-[10px] px-2 py-0.5 rounded">
                      {series.completionPercentage}%
                    </span>
                  )}
                </div>

                {/* Bottom Completeness Bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-[#0f0e0e]/80">
                  <div
                    className={`h-full ${
                      series.completionPercentage === 100 ? 'bg-emerald-400' : 'bg-white'
                    }`}
                    style={{ width: `${series.completionPercentage}%` }}
                  />
                </div>
              </div>

              {/* Series Card Details */}
              <div className="p-4 flex flex-col gap-2">
                <div>
                  <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase block">
                    {series.years}
                  </span>
                  <h3 className="font-headline-sm text-lg text-white font-serif tracking-tight line-clamp-1 group-hover:text-white transition-colors">
                    {series.title}
                  </h3>
                </div>

                <p className="font-body-sm text-xs text-[#c4c7c8] line-clamp-1">
                  {series.creators}
                </p>

                {/* Completeness & Missing issues status (Image 9) */}
                <div className="pt-2 border-t border-[#262626] flex items-center justify-between text-xs font-mono">
                  <span className="text-[#8e9192]">
                    {series.ownedIssues}/{series.totalIssues} issues
                  </span>

                  {series.missingIssues.length > 0 ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSearchMissingIssue(`${series.title} ${series.missingIssues[0]}`);
                      }}
                      className="text-rose-400 hover:text-rose-300 flex items-center gap-1 font-mono-caption text-[10px] cursor-pointer"
                    >
                      <AlertCircle className="w-3 h-3" />
                      <span>MISSING: {series.missingIssues.join(', ')}</span>
                    </button>
                  ) : (
                    <span className="text-emerald-400 font-mono-caption text-[10px]">
                      100% COMPLETE
                    </span>
                  )}
                </div>

              </div>

            </div>
          ))}
        </div>

      ) : (

        /* Issues Grid (Image 5) */
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredIssues.map((issue) => (
            <div
              key={issue.id}
              onClick={() => onSelectIssue(issue)}
              className="group bg-[#1c1b1b] hover:bg-[#201f1f] border border-[#262626] hover:border-[#444748] rounded-xl overflow-hidden transition-all duration-200 cursor-pointer flex flex-col justify-between shadow"
            >
              {/* Cover Artwork */}
              <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#0f0e0e]">
                <img
                  src={issue.coverUrl}
                  alt={issue.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Reading Status Pill */}
                <div className="absolute top-2 right-2">
                  {issue.readStatus === 'completed' ? (
                    <span className="bg-emerald-950/80 backdrop-blur-md border border-emerald-500/50 text-emerald-300 font-mono-caption text-[9px] px-1.5 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      COMPLETED
                    </span>
                  ) : issue.readStatus === 'reading' ? (
                    <span className="bg-black/80 backdrop-blur-md border border-white/30 text-white font-mono-caption text-[9px] px-1.5 py-0.5 rounded">
                      {issue.readProgress}% READ
                    </span>
                  ) : (
                    <span className="bg-black/80 backdrop-blur-md border border-white/20 text-[#8e9192] font-mono-caption text-[9px] px-1.5 py-0.5 rounded">
                      UNREAD
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                {issue.readProgress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#0f0e0e]/80">
                    <div
                      className="h-full bg-white"
                      style={{ width: `${issue.readProgress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Issue details */}
              <div className="p-3 flex flex-col gap-1">
                <span className="font-mono-caption text-[9px] text-[#8e9192] uppercase">
                  {issue.publisher} · {issue.issueNum}
                </span>
                <h4 className="font-headline-sm text-sm text-white font-serif tracking-tight truncate group-hover:text-white">
                  {issue.title}
                </h4>
                <p className="font-body-sm text-[11px] text-[#8e9192] truncate">
                  {issue.writers.join(', ')}
                </p>
              </div>

            </div>
          ))}
        </div>

      )}

    </div>
  );
};
