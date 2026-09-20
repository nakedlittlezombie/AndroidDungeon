import React, { useState } from 'react';
import { ASSETS } from '../data/mockDatabase';
import { Lock, Eye, EyeOff, Server, Fingerprint, ArrowRight, ShieldCheck } from 'lucide-react';

interface VaultLoginModalProps {
  onUnlock: () => void;
  onCancel?: () => void;
}

export const VaultLoginModal: React.FC<VaultLoginModalProps> = ({ onUnlock, onCancel }) => {
  const [collectorId, setCollectorId] = useState('curator@panel-vault.io');
  const [passphrase, setPassphrase] = useState('archival-master-key-2024');
  const [showPass, setShowPass] = useState(false);
  const [rememberNode, setRememberNode] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setTimeout(() => {
      setIsAuthenticating(false);
      onUnlock();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0a]/90 backdrop-blur-2xl overflow-y-auto px-4 py-8">
      
      {/* Noir Comic Background Art with Vignette */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-25 pointer-events-none filter grayscale contrast-125"
        style={{ backgroundImage: `url(${ASSETS.noirHeroBackground})` }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0a0a0a]/90 via-[#0e0e0e]/80 to-[#0a0a0a]/95 pointer-events-none" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.1)_0%,rgba(10,10,10,0.95)_75%)] pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[480px] flex flex-col items-center">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="flex items-center gap-3 mb-2">
            <img 
              alt="PANEL Logo" 
              className="h-9 w-auto object-contain drop-shadow" 
              src={ASSETS.panelLogo} 
            />
            <div className="text-left">
              <span className="font-headline-sm text-2xl text-white font-serif tracking-tight block leading-none">
                PANEL
              </span>
              <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase tracking-widest mt-0.5 block">
                Archive System
              </span>
            </div>
          </div>
          
          <h1 className="font-headline-lg text-3xl sm:text-4xl text-white font-serif tracking-tight mt-2 mb-1">
            Androids Dungeon
          </h1>
          <p className="font-body-sm text-xs text-[#c4c7c8] max-w-sm">
            Curator clearance required for archival ingest &amp; modification.
          </p>
        </div>

        {/* Form Card */}
        <div className="w-full bg-[#1c1b1b]/95 border border-[#333333] rounded-2xl shadow-2xl p-6 sm:p-8 backdrop-blur-md">
          
          {/* Card Header Status */}
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#262626]">
            <div>
              <span className="font-mono-caption text-[10px] text-emerald-400 block tracking-wider">
                RESTRICTED ACCESS
              </span>
              <span className="font-mono-caption text-[11px] text-[#8e9192] tracking-widest">
                SECURITY PROTOCOL V.04
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#2b2a2a] flex items-center justify-center border border-[#333333]">
              <Lock className="w-4 h-4 text-white" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Collector ID Input */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono-caption text-[11px] text-[#c4c7c8] tracking-wider uppercase">
                Collector Identifier
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={collectorId}
                  onChange={(e) => setCollectorId(e.target.value)}
                  className="w-full bg-[#0f0e0e] border border-[#333333] focus:border-white rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#8e9192] outline-none transition-colors font-mono"
                  placeholder="curator@panel-vault.io"
                  required
                />
              </div>
            </div>

            {/* Passphrase Input */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="font-mono-caption text-[11px] text-[#c4c7c8] tracking-wider uppercase">
                  Master Passphrase
                </label>
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="text-[11px] font-mono-caption text-[#8e9192] hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                >
                  {showPass ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" /> HIDE
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" /> SHOW
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="w-full bg-[#0f0e0e] border border-[#333333] focus:border-white rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-[#8e9192] outline-none transition-colors font-mono tracking-wider"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            {/* Remember Node Checkbox & Forgot link */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberNode}
                  onChange={(e) => setRememberNode(e.target.checked)}
                  className="w-4 h-4 rounded bg-[#0f0e0e] border-[#333333] text-white accent-white focus:ring-0"
                />
                <span className="font-body-sm text-xs text-[#c4c7c8]">
                  Remember Node on this workstation
                </span>
              </label>
              <button 
                type="button" 
                onClick={() => alert('Offline master rescue key can be retrieved via local terminal: panel-ctl --rescue')}
                className="text-xs text-[#8e9192] hover:text-white transition-colors"
              >
                Forgot Key?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isAuthenticating}
              className="mt-2 w-full bg-white hover:bg-[#e6e1e1] text-black font-semibold text-sm py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.99] cursor-pointer shadow-lg disabled:opacity-75"
            >
              {isAuthenticating ? (
                <span>DECRYPTING VAULT KEY...</span>
              ) : (
                <>
                  <span>ENTER LIBRARY</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Federated Clearance Options */}
          <div className="mt-6 pt-5 border-t border-[#262626]">
            <div className="text-center mb-3">
              <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase tracking-widest">
                OR FEDERATED CLEARANCE
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={onUnlock}
                className="flex items-center justify-center gap-2 bg-[#0f0e0e] hover:bg-[#262626] border border-[#333333] text-white text-xs font-medium py-2.5 px-3 rounded-lg transition-colors cursor-pointer"
              >
                <Server className="w-4 h-4 text-[#8e9192]" />
                <span>Self-Hosted</span>
              </button>

              <button
                type="button"
                onClick={onUnlock}
                className="flex items-center justify-center gap-2 bg-[#0f0e0e] hover:bg-[#262626] border border-[#333333] text-white text-xs font-medium py-2.5 px-3 rounded-lg transition-colors cursor-pointer"
              >
                <Fingerprint className="w-4 h-4 text-emerald-400" />
                <span>Passkey SSO</span>
              </button>
            </div>
          </div>

          {onCancel && (
            <div className="mt-4 text-center">
              <button
                onClick={onCancel}
                className="text-xs text-[#8e9192] hover:text-white transition-colors cursor-pointer"
              >
                Browse as Guest (Read-Only)
              </button>
            </div>
          )}

        </div>

        {/* Live Node Telemetry Footer */}
        <div className="mt-6 flex items-center justify-between w-full px-2 text-[11px] font-mono-caption text-[#8e9192]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>NODE: ARCHIVE-ATLAS-LOCAL · LATENCY 4MS</span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8e9192]" />
            <span className="hidden sm:inline">ZERO TELEMETRY RECORDED · LOCAL ENCLAVE</span>
          </div>
        </div>

      </div>
    </div>
  );
};
