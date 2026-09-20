import React, { useState, useEffect } from 'react';
import { NavigationTab, IssueItem, SeriesRunItem, ReaderState, AIConfig } from './types';
import { 
  INITIAL_ISSUES, 
  INITIAL_SERIES, 
  INITIAL_ACTIVE_TRANSFERS 
} from './data/mockDatabase';
import { INITIAL_AI_CONFIG } from './services/aiService';
import { Header } from './components/Header';
import { VaultLoginModal } from './components/VaultLoginModal';
import { LibraryView } from './components/LibraryView';
import { DossierModal } from './components/DossierModal';
import { ImportScrapeView } from './components/ImportScrapeView';
import { DownloadsView } from './components/DownloadsView';
import { SettingsView } from './components/SettingsView';
import { ComicReaderModal } from './components/ComicReaderModal';
import { CommandPaletteModal } from './components/CommandPaletteModal';
import { AICopilotModal } from './components/AICopilotModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavigationTab>('library');
  const [isVaultLocked, setIsVaultLocked] = useState<boolean>(false);
  const [issues, setIssues] = useState<IssueItem[]>(INITIAL_ISSUES);
  const [seriesList, setSeriesList] = useState<SeriesRunItem[]>(INITIAL_SERIES);
  const [activeTransfersCount, setActiveTransfersCount] = useState<number>(INITIAL_ACTIVE_TRANSFERS.length);
  
  // AI Configuration State
  const [aiConfig, setAiConfig] = useState<AIConfig>(INITIAL_AI_CONFIG);
  const [isAICopilotOpen, setIsAICopilotOpen] = useState<boolean>(false);

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

  // Command palette state (optional secondary)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Keyboard shortcut listener for ⌘K -> Opens AI Copilot directly!
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsAICopilotOpen(prev => !prev);
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
      
      {/* Primary Header - Replaced static search with Archival AI Copilot */}
      <Header
        currentTab={currentTab}
        onNavigate={(tab) => setCurrentTab(tab)}
        onOpenSearch={() => setIsAICopilotOpen(true)}
        onLockVault={() => setIsVaultLocked(true)}
        activeTransfersCount={activeTransfersCount}
        aiConfig={aiConfig}
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
            onOpenAICopilot={(prompt) => {
              setIsAICopilotOpen(true);
            }}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsView 
            aiConfig={aiConfig}
            onUpdateAIConfig={(updated) => setAiConfig(updated)}
          />
        )}
      </main>

      {/* Archival AI Copilot Modal (Replaces Search Bar, Q&A, Vision Analysis, Queueing) */}
      <AICopilotModal
        isOpen={isAICopilotOpen}
        onClose={() => setIsAICopilotOpen(false)}
        issues={issues}
        seriesList={seriesList}
        aiConfig={aiConfig}
        onOpenSettingsAI={() => {
          setIsAICopilotOpen(false);
          setCurrentTab('settings');
        }}
        onNavigateTab={(tab) => {
          setIsAICopilotOpen(false);
          setCurrentTab(tab);
        }}
        onSelectIssue={(issue) => {
          setIsAICopilotOpen(false);
          setSelectedIssue(issue);
        }}
        onOpenReader={(comicTitle, issueLabel, initialPage) => {
          setIsAICopilotOpen(false);
          handleOpenReader(comicTitle, issueLabel, initialPage || 1);
        }}
        onQueueDownload={(query: string) => {
          setActiveTransfersCount(prev => prev + 1);
        }}
      />

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

      {/* Secondary Quick Filter Palette (Optional) */}
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
