import React, { useState, useEffect } from 'react';
import { NavigationTab, IssueItem, SeriesRunItem, ReaderState } from './types';
import { 
  INITIAL_ISSUES, 
  INITIAL_SERIES, 
  INITIAL_ACTIVE_TRANSFERS 
} from './data/mockDatabase';
import { Header } from './components/Header';
import { VaultLoginModal } from './components/VaultLoginModal';
import { LibraryView } from './components/LibraryView';
import { DossierModal } from './components/DossierModal';
import { ImportScrapeView } from './components/ImportScrapeView';
import { DownloadsView } from './components/DownloadsView';
import { SettingsView } from './components/SettingsView';
import { ComicReaderModal } from './components/ComicReaderModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('library');
  const [isVaultLocked, setIsVaultLocked] = useState<boolean>(false);
  const [issues, setIssues] = useState<IssueItem[]>(INITIAL_ISSUES);
  const [seriesList, setSeriesList] = useState<SeriesRunItem[]>(INITIAL_SERIES);
  const [activeTransfersCount, setActiveTransfersCount] = useState<number>(INITIAL_ACTIVE_TRANSFERS.length);
  
  // Selected issue for Dossier Modal
  const [selectedIssue, setSelectedIssue] = useState<IssueItem | null>(null);

  // Search query for Downloads / Harvester tab
  const [harvesterSearchQuery, setHarvesterSearchQuery] = useState<string>('');

  // Reader state
  const [readerState, setReaderState] = useState<ReaderState>({
    isOpen: false,
    comicTitle: 'The Sandman',
    issueLabel: '#21',
    currentPage: 24,
    totalPages: 36,
    zoomLevel: 100,
    fitMode: 'width',
    flowDirection: 'ltr'
  });

  // Command palette state (⌘K)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Keyboard shortcut listener for ⌘K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Find series for currently selected dossier issue
  const currentSeries = selectedIssue
    ? seriesList.find(s => s.id === selectedIssue.seriesId) || null
    : null;

  const handleOpenReader = (comicTitle: string, issueLabel: string, initialPage: number) => {
    setReaderState({
      isOpen: true,
      comicTitle,
      issueLabel,
      currentPage: initialPage,
      totalPages: 36,
      zoomLevel: 100,
      fitMode: 'width',
      flowDirection: 'ltr'
    });
  };

  const handleSearchMissingIssue = (searchQuery: string) => {
    setHarvesterSearchQuery(searchQuery);
    setCurrentTab('downloads');
  };

  const handlePurgeIssue = (issueId: string) => {
    setIssues(prev => prev.filter(i => i.id !== issueId));
  };

  return (
    <div className="min-h-screen bg-[#141313] text-[#e6e1e1] flex flex-col relative selection:bg-white selection:text-black">
      
      {/* Primary Header */}
      <Header
        currentTab={currentTab}
        onNavigate={(tab) => setCurrentTab(tab)}
        onOpenSearch={() => setCommandPaletteOpen(true)}
        onLockVault={() => setIsVaultLocked(true)}
        activeTransfersCount={activeTransfersCount}
      />

      {/* Main View Area */}
      <main className="flex-1 flex flex-col">
        {currentTab === 'library' && (
          <LibraryView
            issues={issues}
            seriesList={seriesList}
            onSelectIssue={(issue) => setSelectedIssue(issue)}
            onSelectSeries={(series) => {
              const matched = issues.find(i => i.seriesId === series.id) || issues[0];
              setSelectedIssue(matched);
            }}
            onOpenReader={handleOpenReader}
            onSearchMissingIssue={handleSearchMissingIssue}
          />
        )}

        {currentTab === 'import' && (
          <ImportScrapeView
            onImportCompleted={(count) => {
              setActiveTransfersCount(prev => Math.max(0, prev - 1));
            }}
          />
        )}

        {currentTab === 'downloads' && (
          <DownloadsView
            initialSearchQuery={harvesterSearchQuery}
            onTransferCompleted={(title) => {
              alert(`Transfer complete: ${title}`);
            }}
            onMoveToLibrary={() => {
              setCurrentTab('library');
            }}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView />
        )}
      </main>

      {/* Dossier Modal (Screens 3 & 6 - Image 5, 11) */}
      {selectedIssue && (
        <DossierModal
          issue={selectedIssue}
          series={currentSeries}
          onClose={() => setSelectedIssue(null)}
          onOpenReader={handleOpenReader}
          onSearchMissingIssue={handleSearchMissingIssue}
          onPurgeIssue={handlePurgeIssue}
        />
      )}

      {/* Interactive Comic Reader (Dark Room Reader) */}
      <ComicReaderModal
        isOpen={readerState.isOpen}
        comicTitle={readerState.comicTitle}
        issueLabel={readerState.issueLabel}
        initialPage={readerState.currentPage}
        totalPages={readerState.totalPages}
        onClose={() => setReaderState(prev => ({ ...prev, isOpen: false }))}
      />

      {/* Command Palette (⌘K) Quick Search */}
      <CommandPaletteModal
        isOpen={commandPaletteOpen}
        issues={issues}
        seriesList={seriesList}
        onClose={() => setCommandPaletteOpen(false)}
        onSelectIssue={(issue) => setSelectedIssue(issue)}
        onNavigateTab={(tab) => setCurrentTab(tab)}
      />

      {/* Vault Login Modal (Screen 2 - Image 3.jpeg) */}
      {isVaultLocked && (
        <VaultLoginModal
          onUnlock={() => setIsVaultLocked(false)}
          onCancel={() => setIsVaultLocked(false)}
        />
      )}

    </div>
  );
}
