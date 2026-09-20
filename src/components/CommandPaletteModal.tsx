import React, { useState, useEffect } from 'react';
import { IssueItem, SeriesRunItem, NavigationTab } from '../types';
import { Search, X, BookOpen, HardDrive, ArrowRight, CornerDownLeft } from 'lucide-react';

interface CommandPaletteModalProps {
  isOpen: boolean;
  issues: IssueItem[];
  seriesList: SeriesRunItem[];
  onClose: () => void;
  onSelectIssue: (issue: IssueItem) => void;
  onNavigateTab: (tab: NavigationTab) => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  issues,
  seriesList,
  onClose,
  onSelectIssue,
  onNavigateTab
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // toggle handled by parent or opened
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredIssues = query
    ? issues.filter(
        i =>
          i.title.toLowerCase().includes(query.toLowerCase()) ||
          i.writers.some(w => w.toLowerCase().includes(query.toLowerCase())) ||
          i.publisher.toLowerCase().includes(query.toLowerCase())
      )
    : issues.slice(0, 4);

  const filteredSeries = query
    ? seriesList.filter(
        s =>
          s.title.toLowerCase().includes(query.toLowerCase()) ||
          s.creators.toLowerCase().includes(query.toLowerCase()) ||
          s.publisher.toLowerCase().includes(query.toLowerCase())
      )
    : seriesList.slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md">
      
      <div className="w-full max-w-2xl bg-[#1c1b1b] border border-[#333333] rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col">
        
        {/* Search Input */}
        <div className="relative p-4 border-b border-[#262626] flex items-center gap-3">
          <Search className="w-5 h-5 text-[#8e9192]" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search archival issues, series runs, creators, or publishers..."
            className="w-full bg-transparent text-sm text-white placeholder-[#8e9192] outline-none font-mono"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-[#8e9192] hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="font-mono-caption text-[10px] text-[#8e9192] bg-[#2b2a2a] px-1.5 py-0.5 rounded border border-[#262626]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-3 flex flex-col gap-3 divide-y divide-[#262626]">
          
          {/* Quick Navigation Commands */}
          <div className="flex flex-col gap-1">
            <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase px-2 mb-1">
              Jump To Module
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { label: 'Master Library', tab: 'library' },
                { label: 'Import & Scrape', tab: 'import' },
                { label: 'Downloads / Harvester', tab: 'downloads' },
                { label: 'Settings & Cache', tab: 'settings' }
              ].map(cmd => (
                <button
                  key={cmd.tab}
                  onClick={() => {
                    onClose();
                    onNavigateTab(cmd.tab as NavigationTab);
                  }}
                  className="text-left px-2.5 py-1.5 rounded-lg bg-[#141313] hover:bg-[#262626] border border-[#262626] text-xs text-[#c4c7c8] hover:text-white transition-colors cursor-pointer"
                >
                  {cmd.label}
                </button>
              ))}
            </div>
          </div>

          {/* Series Runs */}
          <div className="pt-2 flex flex-col gap-1">
            <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase px-2 mb-1">
              Series Runs ({filteredSeries.length})
            </span>
            {filteredSeries.map(s => (
              <button
                key={s.id}
                onClick={() => {
                  const matching = issues.find(i => i.seriesId === s.id) || issues[0];
                  onClose();
                  onSelectIssue(matching);
                }}
                className="w-full text-left p-2 rounded-lg hover:bg-[#242323] flex items-center justify-between group transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-10 rounded bg-[#0e0e0e] overflow-hidden shrink-0 border border-[#333333]">
                    <img src={s.coverUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-white truncate group-hover:underline">
                      {s.title}
                    </span>
                    <span className="text-[11px] text-[#8e9192] truncate">
                      {s.publisher} · {s.ownedIssues}/{s.totalIssues} issues ({s.completionPercentage}%)
                    </span>
                  </div>
                </div>
                <CornerDownLeft className="w-3.5 h-3.5 text-[#8e9192] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>

          {/* Individual Issues */}
          <div className="pt-2 flex flex-col gap-1">
            <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase px-2 mb-1">
              Archival Issues ({filteredIssues.length})
            </span>
            {filteredIssues.map(issue => (
              <button
                key={issue.id}
                onClick={() => {
                  onClose();
                  onSelectIssue(issue);
                }}
                className="w-full text-left p-2 rounded-lg hover:bg-[#242323] flex items-center justify-between group transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-11 rounded bg-[#0e0e0e] overflow-hidden shrink-0 border border-[#333333]">
                    <img src={issue.coverUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-semibold text-white truncate group-hover:underline">
                      {issue.title} {issue.issueNum}
                    </span>
                    <span className="text-[11px] text-[#8e9192] truncate">
                      {issue.writers.join(', ')} · {issue.publisher} ({issue.year})
                    </span>
                  </div>
                </div>
                <CornerDownLeft className="w-3.5 h-3.5 text-[#8e9192] opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>

        </div>

      </div>

    </div>
  );
};
