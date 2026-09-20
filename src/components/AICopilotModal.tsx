import React, { useState, useEffect, useRef } from 'react';
import { 
  IssueItem, 
  SeriesRunItem, 
  NavigationTab, 
  AIConfig, 
  AIMessage, 
  AIMessageAction, 
  AIVisionDetection 
} from '../types';
import { queryArchivalCopilot, analyzeCoverWithVision } from '../services/aiService';
import { 
  Sparkles, 
  Search, 
  X, 
  Upload, 
  Image as ImageIcon, 
  Send, 
  CornerDownLeft, 
  Download, 
  BookOpen, 
  Layers, 
  ShieldCheck, 
  Cpu, 
  AlertCircle,
  ChevronRight,
  ExternalLink,
  Sliders
} from 'lucide-react';

interface AICopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  issues: IssueItem[];
  seriesList: SeriesRunItem[];
  aiConfig: AIConfig;
  onOpenSettingsAI: () => void;
  onQueueDownload: (query: string) => void;
  onOpenReader: (comicTitle: string, issueLabel: string, initialPage: number) => void;
  onNavigateTab: (tab: NavigationTab) => void;
  onSelectIssue: (issue: IssueItem) => void;
}

export const AICopilotModal: React.FC<AICopilotModalProps> = ({
  isOpen,
  onClose,
  issues,
  seriesList,
  aiConfig,
  onOpenSettingsAI,
  onQueueDownload,
  onOpenReader,
  onNavigateTab,
  onSelectIssue
}) => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Welcome to **PANEL Archival Intelligence**. I have indexed your entire vault of **4,280 issues** and **186 series**. 

How can I assist your curation today? You can ask about missing issues, queue new downloads, or upload any cover scan for **AI Vision inspection**.`,
      timestamp: '12:00 PM',
      suggestedActions: [
        {
          label: '❓ What issues am I missing?',
          actionType: 'filter_library',
          payload: { filter: 'missing' }
        },
        {
          label: '⚡ Queue download for Sandman #22',
          actionType: 'queue_download',
          payload: { query: 'The Sandman #22' }
        },
        {
          label: '📖 What was I reading last?',
          actionType: 'open_reader',
          payload: { title: 'The Sandman', issue: '#21', page: 24 }
        }
      ]
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedImageName, setAttachedImageName] = useState<string>('');
  const [isAnalyzingVision, setIsAnalyzingVision] = useState(false);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isProcessing]);

  // Handle ESC hotkey
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const showToast = (text: string) => {
    setToastNotice(text);
    setTimeout(() => setToastNotice(null), 3000);
  };

  const handleSendMessage = async (customPrompt?: string, imageUrlOverride?: string) => {
    const promptToSend = customPrompt || inputPrompt;
    const imageToSend = imageUrlOverride || attachedImage;

    if (!promptToSend.trim() && !imageToSend) return;

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: promptToSend || (imageToSend ? 'Analyze this cover with the AI Vision model:' : ''),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      imageUrl: imageToSend || undefined,
      imageFileName: attachedImageName || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputPrompt('');
    setAttachedImage(null);
    setAttachedImageName('');
    setIsProcessing(true);

    let visionResult: AIVisionDetection | undefined;
    if (imageToSend) {
      setIsAnalyzingVision(true);
      try {
        visionResult = await analyzeCoverWithVision(imageToSend, aiConfig);
      } catch (err) {
        console.error('Vision analysis error', err);
      } finally {
        setIsAnalyzingVision(false);
      }
    }

    try {
      const assistantResponse = await queryArchivalCopilot(
        promptToSend || 'Analyze attached cover',
        aiConfig,
        {
          issues,
          seriesList,
          attachedImageUrl: imageToSend || undefined
        }
      );

      if (visionResult) {
        assistantResponse.visionResult = visionResult;
        assistantResponse.content = `👁️ **Vision Model Analysis Complete (${visionResult.confidence}% confidence)**

• **Identified Title**: ${visionResult.detectedTitle} ${visionResult.detectedIssueNum}
• **Publisher**: ${visionResult.detectedPublisher}
• **Edition / Variant**: ${visionResult.detectedVariant}
• **Cover Artist**: ${visionResult.detectedCoverArtist || 'Verified Artist'}
• **Barcode / UPC**: \`${visionResult.upcBarcode || 'None detected'}\`

${visionResult.summary}`;
      }

      setMessages(prev => [...prev, assistantResponse]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Apologies, I encountered a temporary communication interruption with the inference daemon. You can verify your endpoint in Settings.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExecuteAction = (action: AIMessageAction) => {
    switch (action.actionType) {
      case 'queue_download':
        onQueueDownload(action.payload?.query || 'The Sandman #22');
        showToast(`⚡ Ingestion queued: ${action.payload?.query || 'Item'}`);
        break;
      case 'open_reader':
        onClose();
        onOpenReader(action.payload?.title || 'The Sandman', action.payload?.issue || '#21', action.payload?.page || 1);
        break;
      case 'navigate_tab':
        onClose();
        onNavigateTab(action.payload?.tab || 'library');
        break;
      case 'filter_library':
        onClose();
        onNavigateTab('library');
        break;
      case 'inspect_vision':
        onClose();
        onNavigateTab('import');
        break;
      default:
        break;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setAttachedImage(dataUrl);
      setAttachedImageName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleLoadSampleCover = () => {
    const sampleCover = "https://lh3.googleusercontent.com/aida-public/AB6AXuCYxzJvAIUP6oMNHIlsU9yAayHKvJepuBAybZU7HppJGpiNtI5EOX2-CE7vnMGiYOJPb7sJwuL1aFYtjQCOlhCL5M_BAq4vsVHoSskp-eHmbeaDqv53Kjl1HbbqXR11g_NEmYv9BxuT2RkMGBwQugJ9_4pP3bcDNR1l971h9Gu1H2d9_oxsQiYrpCPKrgATQj3F79_pB9k0Zywa2NFcUNUR3uTx8FhlZE8M9yH7N_M8niIrQC4jYEc";
    setAttachedImage(sampleCover);
    setAttachedImageName('Sandman_21_RawCover_Incentive.jpg');
    handleSendMessage('Analyze this comic cover using vision to detect if it is a virgin or retailer incentive variant.', sampleCover);
  };

  if (!isOpen) return null;

  const getEngineDisplay = () => {
    if (aiConfig.providerMode === 'openai_compatible') {
      return `OpenAI Endpoint · ${aiConfig.openaiModel}`;
    } else if (aiConfig.providerMode === 'local_downloaded') {
      return `Local WebGPU · ${aiConfig.selectedLocalModelId.toUpperCase()} (${aiConfig.allocatedVramMb}MB VRAM)`;
    }
    return 'PANEL Archival Intelligence (Built-in)';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Toast Notification */}
      {toastNotice && (
        <div className="fixed top-6 z-60 bg-white text-black font-semibold text-xs py-2 px-4 rounded-full shadow-2xl flex items-center gap-2 animate-bounce">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>{toastNotice}</span>
        </div>
      )}

      {/* Main Copilot Modal Window */}
      <div className="w-full max-w-3xl h-[88vh] max-h-[780px] bg-[#161515] border border-[#2f2e2e] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="h-14 px-4 bg-[#100f0f] border-b border-[#262626] flex items-center justify-between shrink-0">
          
          {/* Active AI Status */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-900/50 to-indigo-900/50 border border-purple-500/40 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-purple-300 animate-pulse" />
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white tracking-tight font-serif">
                  PANEL Archival Copilot
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-[#201f1f] text-emerald-400 border border-[#333333]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Active
                </span>
              </div>
              <span className="text-[11px] text-[#8e9192] font-mono truncate">
                {getEngineDisplay()}
              </span>
            </div>
          </div>

          {/* Quick Actions & Close */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenSettingsAI();
              }}
              title="Configure AI Endpoint & Vision Models"
              className="px-2.5 py-1.5 rounded-lg bg-[#201f1f] hover:bg-[#2b2a2a] border border-[#333333] text-xs text-[#c4c7c8] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Settings</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#8e9192] hover:text-white hover:bg-[#201f1f] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

        </div>

        {/* Message History Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs sm:text-sm scrollbar-thin scrollbar-thumb-[#262626]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Role Header */}
              <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-[#8e9192]">
                {msg.role === 'user' ? (
                  <span>You</span>
                ) : (
                  <span className="flex items-center gap-1 text-purple-400 font-medium">
                    <Sparkles className="w-3 h-3" />
                    Archival Copilot
                  </span>
                )}
                <span>·</span>
                <span>{msg.timestamp}</span>
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[88%] rounded-2xl p-4 leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-white text-black shadow-md rounded-tr-sm'
                    : 'bg-[#1c1b1b] border border-[#2b2a2a] text-[#e6e1e1] rounded-tl-sm'
                }`}
              >
                {/* Image Preview if user attached one */}
                {msg.imageUrl && (
                  <div className="mb-3 rounded-lg overflow-hidden border border-[#444444] max-w-[200px] bg-black">
                    <img src={msg.imageUrl} alt="Attached Cover" className="w-full h-auto object-cover max-h-48" />
                    {msg.imageFileName && (
                      <div className="px-2 py-1 text-[10px] font-mono text-[#c4c7c8] bg-[#141313] truncate">
                        {msg.imageFileName}
                      </div>
                    )}
                  </div>
                )}

                {/* Markdown text representation */}
                <div className="whitespace-pre-line space-y-2">
                  {msg.content}
                </div>

                {/* Vision Result Card (If present) */}
                {msg.visionResult && (
                  <div className="mt-3 p-3 rounded-xl bg-[#121212] border border-purple-900/50 flex flex-col gap-2">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-purple-300 font-semibold flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        AI Vision Tagging
                      </span>
                      <span className="text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
                        {msg.visionResult.confidence}% Verified
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {msg.visionResult.visualTags.map((tag, i) => (
                        <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#201f1f] text-[#c4c7c8] border border-[#333333]">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Interactive Actions */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[#2d2c2c] flex flex-wrap gap-2">
                    {msg.suggestedActions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleExecuteAction(action)}
                        className="px-3 py-1.5 rounded-lg bg-[#252424] hover:bg-white hover:text-black border border-[#383737] text-xs font-medium text-[#e6e1e1] transition-all cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95"
                      >
                        {action.actionType === 'queue_download' && <Download className="w-3.5 h-3.5 text-emerald-400" />}
                        {action.actionType === 'open_reader' && <BookOpen className="w-3.5 h-3.5 text-sky-400" />}
                        {action.actionType === 'filter_library' && <Layers className="w-3.5 h-3.5 text-amber-400" />}
                        {action.actionType === 'navigate_tab' && <ChevronRight className="w-3.5 h-3.5 text-purple-400" />}
                        <span>{action.label}</span>
                      </button>
                    ))}
                  </div>
                )}

              </div>
            </div>
          ))}

          {/* Thinking / Streaming Animation */}
          {isProcessing && (
            <div className="flex items-start gap-2 animate-in fade-in duration-150">
              <div className="w-6 h-6 rounded-full bg-purple-900/40 border border-purple-500/30 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-purple-300 animate-spin" />
              </div>
              <div className="bg-[#1c1b1b] border border-[#262626] rounded-2xl rounded-tl-sm px-4 py-3 text-xs text-[#8e9192] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
                <span>
                  {isAnalyzingVision 
                    ? 'Processing cover image with Vision Model (SmolVLM/WebGPU)...' 
                    : 'Querying archival graph & database...'}
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-4 py-2 bg-[#121111] border-t border-[#201f1f] flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-mono text-[#8e9192] uppercase shrink-0">
            Suggested:
          </span>
          <button
            onClick={() => handleSendMessage('What issues am I missing in The Sandman and Saga?')}
            className="px-2.5 py-1 rounded-full bg-[#1c1b1b] hover:bg-[#292828] border border-[#2b2a2a] text-[11px] text-[#c4c7c8] hover:text-white shrink-0 transition-colors cursor-pointer"
          >
            ❓ Check Missing Issues
          </button>
          <button
            onClick={() => handleSendMessage('Queue download for The Sandman #22')}
            className="px-2.5 py-1 rounded-full bg-[#1c1b1b] hover:bg-[#292828] border border-[#2b2a2a] text-[11px] text-emerald-400 hover:text-emerald-300 shrink-0 transition-colors cursor-pointer"
          >
            ⚡ Queue Sandman #22
          </button>
          <button
            onClick={handleLoadSampleCover}
            className="px-2.5 py-1 rounded-full bg-[#1c1b1b] hover:bg-[#292828] border border-[#2b2a2a] text-[11px] text-purple-400 hover:text-purple-300 shrink-0 transition-colors cursor-pointer flex items-center gap-1"
          >
            <ImageIcon className="w-3 h-3" />
            <span>Test Cover Vision</span>
          </button>
          <button
            onClick={() => handleSendMessage('What was I reading last and what is my progress?')}
            className="px-2.5 py-1 rounded-full bg-[#1c1b1b] hover:bg-[#292828] border border-[#2b2a2a] text-[11px] text-[#c4c7c8] hover:text-white shrink-0 transition-colors cursor-pointer"
          >
            📖 Active Reading Status
          </button>
          <button
            onClick={() => handleSendMessage('Show me all Alan Moore titles in my library')}
            className="px-2.5 py-1 rounded-full bg-[#1c1b1b] hover:bg-[#292828] border border-[#2b2a2a] text-[11px] text-[#c4c7c8] hover:text-white shrink-0 transition-colors cursor-pointer"
          >
            🏛️ Works by Alan Moore
          </button>
        </div>

        {/* Attached Image Bar (if present) */}
        {attachedImage && (
          <div className="px-4 py-2 bg-[#171616] border-t border-[#262626] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <img src={attachedImage} alt="Staged for vision" className="w-8 h-10 object-cover rounded border border-[#333333]" />
              <div className="flex flex-col min-w-0">
                <span className="text-xs text-white truncate font-mono">
                  {attachedImageName || 'Cover_Inspection.jpg'}
                </span>
                <span className="text-[10px] text-purple-400">
                  Ready for Vision Model Inspection
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setAttachedImage(null);
                setAttachedImageName('');
              }}
              className="p-1 rounded hover:bg-[#252424] text-[#8e9192] hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-[#100f0f] border-t border-[#262626] flex items-center gap-2 shrink-0">
          
          {/* Hidden file input for vision uploads */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileUpload}
          />

          {/* Upload Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Upload comic cover or splash page for Vision AI"
            className="p-2.5 rounded-xl bg-[#1c1b1b] hover:bg-[#262525] border border-[#2f2e2e] text-[#8e9192] hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <Upload className="w-4 h-4" />
          </button>

          {/* Prompt Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Ask about library, queue a download, or paste an issue query..."
              className="w-full bg-[#1c1b1b] border border-[#2f2e2e] focus:border-white rounded-xl py-2.5 pl-3.5 pr-10 text-xs sm:text-sm text-white placeholder-[#6b6d6e] outline-none transition-colors"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[#6b6d6e] pointer-events-none hidden sm:inline">
              ↵ Enter
            </kbd>
          </div>

          {/* Send Button */}
          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={(!inputPrompt.trim() && !attachedImage) || isProcessing}
            className="p-2.5 rounded-xl bg-white hover:bg-[#e6e1e1] text-black disabled:opacity-40 transition-all cursor-pointer shrink-0 shadow active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>

        </div>

      </div>

    </div>
  );
};
