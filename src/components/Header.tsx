import React, { useState } from 'react';
import { NavigationTab, AIConfig } from '../types';
import { ASSETS } from '../data/mockDatabase';
import { Search, Lock, RefreshCw, Layers, Sparkles, Cpu } from 'lucide-react';

interface HeaderProps {
  currentTab: NavigationTab;
  onNavigate: (tab: NavigationTab) => void;
  onOpenSearch: () => void;
  onLockVault: () => void;
  activeTransfersCount: number;
  aiConfig?: AIConfig;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onNavigate,
  onOpenSearch,
  onLockVault,
  activeTransfersCount,
  aiConfig
}) => {
  const [profileOpen, setProfileOpen] = useState(false);

  const getAiModelLabel = () => {
    if (!aiConfig) return 'SmolVLM';
    if (aiConfig.providerMode === 'openai_compatible') {
      return aiConfig.openaiModel.split(':')[0];
    }
    if (aiConfig.providerMode === 'local_downloaded') {
      return aiConfig.selectedLocalModelId.replace('-500m', '').replace('-1.8b', '').toUpperCase();
    }
    return 'Archival AI';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-[#0e0e0e]/95 backdrop-blur-xl border-b border-[#262626]">
      <div className="w-full h-16 px-4 sm:px-6 max-w-[1440px] mx-auto flex items-center justify-between">
        
        {/* Brand Logo & Wordmark */}
        <div className="flex items-center gap-6 lg:gap-10">
          <button 
            onClick={() => onNavigate('library')}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none"
          >
            <img 
              alt="PANEL Comic Library Logo" 
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105" 
              src={ASSETS.panelLogo} 
            />
            <div className="flex flex-col">
              <span className="font-headline-sm text-lg sm:text-xl text-white tracking-tight leading-none font-serif">
                PANEL
              </span>
              <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase tracking-widest mt-0.5">
                Archive System
              </span>
            </div>
          </button>

          {/* Primary Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-6 h-16">
            <button
              onClick={() => onNavigate('library')}
              className={`h-full flex items-center text-sm tracking-wide transition-colors cursor-pointer border-b-2 px-1 ${
                currentTab === 'library'
                  ? 'text-white border-white font-medium'
                  : 'text-[#c4c7c8] hover:text-white border-transparent'
              }`}
            >
              Library
            </button>
            <button
              onClick={() => onNavigate('import')}
              className={`h-full flex items-center text-sm tracking-wide transition-colors cursor-pointer border-b-2 px-1 ${
                currentTab === 'import'
                  ? 'text-white border-white font-medium'
                  : 'text-[#c4c7c8] hover:text-white border-transparent'
              }`}
            >
              Import &amp; Scrape
            </button>
            <button
              onClick={() => onNavigate('downloads')}
              className={`h-full flex items-center text-sm tracking-wide transition-colors cursor-pointer border-b-2 px-1 ${
                currentTab === 'downloads'
                  ? 'text-white border-white font-medium'
                  : 'text-[#c4c7c8] hover:text-white border-transparent'
              }`}
            >
              <span>Downloads</span>
              {activeTransfersCount > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-white text-black font-mono-caption text-[10px] font-bold">
                  {activeTransfersCount}
                </span>
              )}
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className={`h-full flex items-center text-sm tracking-wide transition-colors cursor-pointer border-b-2 px-1 ${
                currentTab === 'settings'
                  ? 'text-white border-white font-medium'
                  : 'text-[#c4c7c8] hover:text-white border-transparent'
              }`}
            >
              Settings
            </button>
          </nav>
        </div>

        {/* Right Section: Quick Search, Queue Indicator, Curator Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Archival AI Omni-Bar (Replaces static search bar) */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 sm:gap-2.5 bg-[#141313] hover:bg-[#1a1919] border border-[#2d2c2c] hover:border-purple-500/50 rounded-xl px-2.5 sm:px-3.5 py-1.5 transition-all cursor-pointer group shadow-inner"
            title="Open Archival AI Copilot (⌘K)"
          >
            <div className="w-5 h-5 rounded-md bg-purple-950/60 border border-purple-500/30 flex items-center justify-center shrink-0 group-hover:border-purple-400/60 transition-colors">
              <Sparkles className="w-3 h-3 text-purple-300 animate-pulse" />
            </div>

            <div className="hidden sm:flex items-center gap-2 min-w-0">
              <span className="font-body-sm text-xs text-[#c4c7c8] group-hover:text-white transition-colors truncate max-w-[190px] lg:max-w-[260px]">
                Ask AI about library, queue, vision...
              </span>
              <span className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[9px] font-mono text-emerald-400 bg-[#1c1b1b] border border-[#2b2a2a]">
                <span className="w-1 h-1 rounded-full bg-emerald-400"></span>
                {getAiModelLabel()}
              </span>
            </div>

            <kbd className="font-mono-caption text-[10px] text-[#8e9192] group-hover:text-[#c4c7c8] bg-[#222121] px-1.5 py-0.5 rounded border border-[#2b2a2a] shrink-0 ml-1">
              ⌘K
            </kbd>
          </button>

          {/* Queue Telemetry Badge */}
          <button 
            onClick={() => onNavigate('downloads')} 
            className="flex items-center gap-1.5 bg-[#1c1b1b] border border-[#262626] hover:border-[#444748] rounded-full px-3 py-1 cursor-pointer transition-colors"
          >
            <span className={`w-2 h-2 rounded-full ${activeTransfersCount > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-white animate-pulse'}`}></span>
            <span className="font-label-sm text-[11px] text-[#e6e1e1] uppercase tracking-wider">
              {activeTransfersCount > 0 ? `${activeTransfersCount} In Flight` : 'Queue Idle'}
            </span>
          </button>

          <div className="h-4 w-px bg-[#262626] hidden sm:block"></div>

          {/* Curator Profile & Node Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 cursor-pointer p-1 rounded hover:bg-[#1c1b1b] transition-colors focus:outline-none"
            >
              <img 
                alt="Curator Profile" 
                className="w-8 h-8 rounded-full object-cover border border-[#262626]" 
                src={ASSETS.curatorAvatar} 
              />
              <span className="hidden lg:inline-block font-label-md text-sm text-[#e6e1e1]">
                Curator
              </span>
            </button>

            {profileOpen && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-[#1c1b1b] border border-[#333333] rounded-xl shadow-2xl p-3 z-50 flex flex-col gap-2"
                onMouseLeave={() => setProfileOpen(false)}
              >
                <div className="flex items-center gap-3 pb-2 border-b border-[#262626]">
                  <img 
                    alt="Curator" 
                    className="w-10 h-10 rounded-full object-cover border border-[#333333]" 
                    src={ASSETS.curatorAvatar} 
                  />
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-semibold text-white truncate">curator@panel-vault.io</span>
                    <span className="font-mono-caption text-[10px] text-emerald-400">Node: ARCHIVE-ATLAS-LOCAL</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 text-xs">
                  <div className="px-2 py-1.5 rounded bg-[#0f0e0e] border border-[#262626] flex items-center justify-between text-[#8e9192]">
                    <span>Local SQLite Cache</span>
                    <span className="text-white font-mono">324 MB Clean</span>
                  </div>
                  <div className="px-2 py-1.5 rounded bg-[#0f0e0e] border border-[#262626] flex items-center justify-between text-[#8e9192]">
                    <span>Storage Partition</span>
                    <span className="text-white font-mono">1.84 / 2.0 TB</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#262626] flex flex-col gap-1">
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onNavigate('settings');
                    }}
                    className="w-full text-left px-2 py-1.5 rounded text-xs text-[#c4c7c8] hover:text-white hover:bg-[#2b2a2a] flex items-center gap-2 transition-colors"
                  >
                    <Layers className="w-3.5 h-3.5 text-[#8e9192]" />
                    <span>Database Mounts &amp; Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onLockVault();
                    }}
                    className="w-full text-left px-2 py-1.5 rounded text-xs text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 flex items-center gap-2 transition-colors"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Lock Vault (Sign Out)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Secondary Tab Navigation Bar */}
      <div className="md:hidden flex items-center justify-around bg-[#0e0e0e] border-t border-[#262626] py-1">
        <button
          onClick={() => onNavigate('library')}
          className={`py-1.5 px-3 text-xs font-medium cursor-pointer ${
            currentTab === 'library' ? 'text-white border-b-2 border-white' : 'text-[#8e9192]'
          }`}
        >
          Library
        </button>
        <button
          onClick={() => onNavigate('import')}
          className={`py-1.5 px-3 text-xs font-medium cursor-pointer ${
            currentTab === 'import' ? 'text-white border-b-2 border-white' : 'text-[#8e9192]'
          }`}
        >
          Import
        </button>
        <button
          onClick={() => onNavigate('downloads')}
          className={`py-1.5 px-3 text-xs font-medium cursor-pointer ${
            currentTab === 'downloads' ? 'text-white border-b-2 border-white' : 'text-[#8e9192]'
          }`}
        >
          Downloads
        </button>
        <button
          onClick={() => onNavigate('settings')}
          className={`py-1.5 px-3 text-xs font-medium cursor-pointer ${
            currentTab === 'settings' ? 'text-white border-b-2 border-white' : 'text-[#8e9192]'
          }`}
        >
          Settings
        </button>
      </div>
    </header>
  );
};
