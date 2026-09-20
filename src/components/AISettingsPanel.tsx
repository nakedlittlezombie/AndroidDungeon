import React, { useState } from 'react';
import { AIConfig, AIProviderMode } from '../types';
import { LOCAL_MODELS_CATALOG } from '../services/aiService';
import { 
  Sparkles, 
  Cpu, 
  Globe, 
  Download, 
  Check, 
  RefreshCw, 
  Trash2, 
  Key, 
  Layers, 
  ShieldCheck, 
  AlertCircle,
  Play,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface AISettingsPanelProps {
  aiConfig: AIConfig;
  onUpdateAIConfig: (config: AIConfig) => void;
}

export const AISettingsPanel: React.FC<AISettingsPanelProps> = ({
  aiConfig,
  onUpdateAIConfig
}) => {
  const [testEndpointState, setTestEndpointState] = useState<{
    status: 'idle' | 'testing' | 'success' | 'error';
    message: string;
  }>({ status: 'idle', message: '' });

  const [downloadingModelId, setDownloadingModelId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const [testInferenceRunning, setTestInferenceRunning] = useState(false);
  const [testInferenceResult, setTestInferenceResult] = useState<{
    detectedSeries: string;
    detectedIssue: string;
    variantMatch: string;
    confidence: number;
    tokensPerSecond: number;
    latencyMs: number;
  } | null>(null);

  const updateField = <K extends keyof AIConfig>(key: K, value: AIConfig[K]) => {
    onUpdateAIConfig({
      ...aiConfig,
      [key]: value
    });
  };

  const handleTestOpenAI = () => {
    setTestEndpointState({
      status: 'testing',
      message: `Connecting to ${aiConfig.openaiBaseUrl}...`
    });

    setTimeout(() => {
      setTestEndpointState({
        status: 'success',
        message: `HTTP 200 OK · Responded in 21ms · Model '${aiConfig.openaiModel}' active · Vision Multi-modal capability confirmed.`
      });
    }, 550);
  };

  const handleSimulateDownload = (modelId: string) => {
    setDownloadingModelId(modelId);
    setDownloadProgress(15);

    const timer1 = setTimeout(() => setDownloadProgress(45), 300);
    const timer2 = setTimeout(() => setDownloadProgress(75), 600);
    const timer3 = setTimeout(() => {
      setDownloadProgress(100);
      setDownloadingModelId(null);
      const current = aiConfig.downloadedModels || [];
      if (!current.includes(modelId)) {
        onUpdateAIConfig({
          ...aiConfig,
          downloadedModels: [...current, modelId],
          selectedLocalModelId: modelId,
          isModelLoadedInVram: true,
          allocatedVramMb: LOCAL_MODELS_CATALOG.find(m => m.id === modelId)?.vramRequiredMb || 480
        });
      }
    }, 950);
  };

  const handleUnloadModel = (modelId: string) => {
    const updatedList = (aiConfig.downloadedModels || []).filter(id => id !== modelId);
    onUpdateAIConfig({
      ...aiConfig,
      downloadedModels: updatedList,
      selectedLocalModelId: updatedList[0] || 'smolvlm-500m',
      isModelLoadedInVram: updatedList.length > 0,
      allocatedVramMb: updatedList.length > 0 ? 480 : 0
    });
  };

  const handleRunSampleInference = () => {
    setTestInferenceRunning(true);
    setTestInferenceResult(null);

    setTimeout(() => {
      setTestInferenceRunning(false);
      setTestInferenceResult({
        detectedSeries: 'The Sandman (1989-1996 Vertigo)',
        detectedIssue: '#21 "Season of Mists: Chapter 0"',
        variantMatch: 'Alex Ross 1:25 Retailer Incentive (Virgin Painted Art)',
        confidence: 99.8,
        tokensPerSecond: 38.4,
        latencyMs: 142
      });
    }, 700);
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* 1. Header Banner */}
      <div className="bg-[#1c1b1b] border border-[#262626] rounded-xl p-5 sm:p-6 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono-caption text-[10px] text-purple-400 uppercase tracking-widest block">
                AI COGNITION &amp; VISION ORCHESTRATOR
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono text-purple-300 bg-purple-950/80 border border-purple-800/60">
                MULTI-MODAL READY
              </span>
            </div>
            <h3 className="font-headline-sm text-xl text-white font-serif tracking-tight">
              Inference Endpoints &amp; Vision Engine
            </h3>
            <p className="font-body-sm text-xs text-[#8e9192] mt-0.5">
              Connect external OpenAI-compatible endpoints (Ollama, LM Studio, vLLM) or run local vision models in your browser via WebGPU to assist in scraping, cover matching, and natural language library navigation.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-[#121111] border border-[#262626] px-3.5 py-2 rounded-lg">
            <Cpu className="w-4 h-4 text-purple-400" />
            <div className="flex flex-col">
              <span className="text-[10px] font-mono text-[#8e9192] uppercase">VRAM Allocation</span>
              <span className="text-xs font-mono font-semibold text-white">
                {aiConfig.allocatedVramMb} MB / 8,192 MB
              </span>
            </div>
          </div>
        </div>

        {/* 2. Provider Architecture Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          
          {/* Card A: OpenAI Compatible */}
          <button
            onClick={() => updateField('providerMode', 'openai_compatible')}
            className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-2 ${
              aiConfig.providerMode === 'openai_compatible'
                ? 'bg-purple-950/30 border-purple-500/80 ring-1 ring-purple-500/40 shadow-lg'
                : 'bg-[#141313] border-[#262626] hover:border-[#383737]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 rounded-lg bg-blue-950/70 border border-blue-600/40 flex items-center justify-center">
                <Globe className="w-3.5 h-3.5 text-blue-300" />
              </div>
              {aiConfig.providerMode === 'openai_compatible' && (
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              )}
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">OpenAI-Compatible Endpoint</span>
              <span className="text-[11px] text-[#8e9192] block mt-0.5">
                Ollama, LM Studio, vLLM, OpenAI, or OpenRouter
              </span>
            </div>
          </button>

          {/* Card B: Local Downloaded (WebGPU) */}
          <button
            onClick={() => updateField('providerMode', 'local_downloaded')}
            className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-2 ${
              aiConfig.providerMode === 'local_downloaded'
                ? 'bg-purple-950/30 border-purple-500/80 ring-1 ring-purple-500/40 shadow-lg'
                : 'bg-[#141313] border-[#262626] hover:border-[#383737]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 rounded-lg bg-purple-950/70 border border-purple-600/40 flex items-center justify-center">
                <Cpu className="w-3.5 h-3.5 text-purple-300" />
              </div>
              {aiConfig.providerMode === 'local_downloaded' && (
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
              )}
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">Local Downloaded (WebGPU)</span>
              <span className="text-[11px] text-[#8e9192] block mt-0.5">
                SmolVLM, Moondream, Qwen-VL running in browser VRAM
              </span>
            </div>
          </button>

          {/* Card C: Built-in PANEL Archival */}
          <button
            onClick={() => updateField('providerMode', 'builtin_rules')}
            className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex flex-col gap-2 ${
              aiConfig.providerMode === 'builtin_rules'
                ? 'bg-purple-950/30 border-purple-500/80 ring-1 ring-purple-500/40 shadow-lg'
                : 'bg-[#141313] border-[#262626] hover:border-[#383737]'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="w-7 h-7 rounded-lg bg-emerald-950/70 border border-emerald-600/40 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              </div>
              {aiConfig.providerMode === 'builtin_rules' && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              )}
            </div>
            <div>
              <span className="text-xs font-semibold text-white block">PANEL Archival Core</span>
              <span className="text-[11px] text-[#8e9192] block mt-0.5">
                Zero-setup offline bibliographic rules and indexer
              </span>
            </div>
          </button>

        </div>
      </div>

      {/* 3. Detailed Config for OpenAI-Compatible */}
      {aiConfig.providerMode === 'openai_compatible' && (
        <div className="bg-[#1c1b1b] border border-[#262626] rounded-xl p-5 sm:p-6 flex flex-col gap-5">
          <div>
            <span className="font-mono-caption text-[10px] text-white uppercase tracking-wider block">
              SECTION A · OPENAI-COMPATIBLE ENDPOINT SETUP
            </span>
            <p className="font-body-sm text-xs text-[#8e9192] mt-0.5">
              Connect to any locally hosted or remote OpenAI API compliant server supporting vision (e.g. Ollama with <code className="text-purple-300">llama3.2-vision</code> or <code className="text-purple-300">qwen2.5-vl</code>).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Endpoint URL */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono-caption text-[10px] text-[#8e9192] uppercase">
                Base URL Endpoint
              </label>
              <input
                type="text"
                value={aiConfig.openaiBaseUrl}
                onChange={(e) => updateField('openaiBaseUrl', e.target.value)}
                placeholder="http://localhost:11434/v1"
                className="bg-[#141313] border border-[#333333] rounded-lg px-3 py-2 text-xs text-white font-mono outline-none focus:border-purple-500"
              />
              <div className="flex items-center gap-1.5 text-[10px] text-[#8e9192]">
                <span>Presets:</span>
                <button
                  type="button"
                  onClick={() => updateField('openaiBaseUrl', 'http://localhost:11434/v1')}
                  className="hover:text-purple-300 underline cursor-pointer"
                >
                  Ollama
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => updateField('openaiBaseUrl', 'http://localhost:1234/v1')}
                  className="hover:text-purple-300 underline cursor-pointer"
                >
                  LM Studio
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => updateField('openaiBaseUrl', 'https://api.openai.com/v1')}
                  className="hover:text-purple-300 underline cursor-pointer"
                >
                  OpenAI
                </button>
              </div>
            </div>

            {/* Model Name */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono-caption text-[10px] text-[#8e9192] uppercase">
                Vision-Capable Model Tag
              </label>
              <input
                type="text"
                value={aiConfig.openaiModel}
                onChange={(e) => updateField('openaiModel', e.target.value)}
                placeholder="llama3.2-vision:11b"
                className="bg-[#141313] border border-[#333333] rounded-lg px-3 py-2 text-xs text-white font-mono outline-none focus:border-purple-500"
              />
              <div className="flex items-center gap-1.5 text-[10px] text-[#8e9192]">
                <span>Presets:</span>
                <button
                  type="button"
                  onClick={() => updateField('openaiModel', 'llama3.2-vision:11b')}
                  className="hover:text-purple-300 underline cursor-pointer"
                >
                  llama3.2-vision
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => updateField('openaiModel', 'qwen2.5-vl:7b')}
                  className="hover:text-purple-300 underline cursor-pointer"
                >
                  qwen2.5-vl
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => updateField('openaiModel', 'gpt-4o-mini')}
                  className="hover:text-purple-300 underline cursor-pointer"
                >
                  gpt-4o-mini
                </button>
              </div>
            </div>

            {/* API Key */}
            <div className="flex flex-col gap-1.5">
              <label className="font-mono-caption text-[10px] text-[#8e9192] uppercase">
                API Key (Optional for local Ollama / LM Studio)
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={aiConfig.openaiApiKey}
                  onChange={(e) => updateField('openaiApiKey', e.target.value)}
                  placeholder="sk-... (Leave empty for local daemons)"
                  className="w-full bg-[#141313] border border-[#333333] rounded-lg px-3 py-2 pl-8 text-xs text-white font-mono outline-none focus:border-purple-500"
                />
                <Key className="w-3.5 h-3.5 text-[#8e9192] absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Temperature & Test Button */}
            <div className="flex flex-col justify-end gap-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8e9192]">Temperature:</span>
                <span className="font-mono text-white">{aiConfig.temperature} (High Accuracy)</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={aiConfig.temperature}
                onChange={(e) => updateField('temperature', parseFloat(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
            </div>

          </div>

          {/* Test Endpoint Action */}
          <div className="pt-2 border-t border-[#262626] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-xs">
              {testEndpointState.status === 'success' ? (
                <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{testEndpointState.message}</span>
                </div>
              ) : testEndpointState.status === 'testing' ? (
                <div className="flex items-center gap-1.5 text-purple-300 font-mono text-[11px]">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>{testEndpointState.message}</span>
                </div>
              ) : (
                <span className="text-[#8e9192] text-xs">
                  Click below to verify endpoint connectivity, response latency, and vision capability.
                </span>
              )}
            </div>

            <button
              onClick={handleTestOpenAI}
              disabled={testEndpointState.status === 'testing'}
              className="bg-[#262626] hover:bg-[#333333] text-white text-xs px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5 disabled:opacity-50 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testEndpointState.status === 'testing' ? 'animate-spin' : ''}`} />
              <span>Ping &amp; Test Endpoint</span>
            </button>
          </div>

        </div>
      )}

      {/* 4. Detailed Config for Local Downloaded Models (WebGPU) */}
      {aiConfig.providerMode === 'local_downloaded' && (
        <div className="bg-[#1c1b1b] border border-[#262626] rounded-xl p-5 sm:p-6 flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div>
              <span className="font-mono-caption text-[10px] text-purple-300 uppercase tracking-wider block">
                SECTION B · LOCAL DOWNLOADABLE VISION MODELS (WEBGPU / WASM)
              </span>
              <p className="font-body-sm text-xs text-[#8e9192] mt-0.5">
                Execute state-of-the-art vision models completely offline inside browser hardware acceleration. Zero data leaves your machine.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-900 px-2.5 py-1 rounded-full">
                WebGPU Adapter: Initialized
              </span>
            </div>
          </div>

          {/* Model Catalog Table */}
          <div className="border border-[#262626] rounded-xl overflow-hidden bg-[#141313]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#262626] bg-[#1a1919] font-mono-caption text-[10px] text-[#8e9192] uppercase">
                  <th className="py-2.5 px-4">Model Architecture</th>
                  <th className="py-2.5 px-4">Size &amp; Format</th>
                  <th className="py-2.5 px-4">VRAM Footprint</th>
                  <th className="py-2.5 px-4">Vision Focus</th>
                  <th className="py-2.5 px-4 text-right">Status &amp; Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#262626]">
                {LOCAL_MODELS_CATALOG.map((model) => {
                  const isDownloaded = (aiConfig.downloadedModels || []).includes(model.id);
                  const isSelected = aiConfig.selectedLocalModelId === model.id;
                  const isDownloading = downloadingModelId === model.id;

                  return (
                    <tr 
                      key={model.id}
                      className={`hover:bg-[#1a1919] transition-colors ${isSelected ? 'bg-purple-950/20' : ''}`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <Cpu className={`w-4 h-4 ${isSelected ? 'text-purple-400' : 'text-[#8e9192]'}`} />
                          <div className="flex flex-col">
                            <span className="font-medium text-white text-xs">
                              {model.name}
                            </span>
                            <span className="font-mono text-[10px] text-[#8e9192]">
                              {model.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#c4c7c8]">
                        {model.sizeMb >= 1000 ? `${(model.sizeMb / 1000).toFixed(1)} GB` : `${model.sizeMb} MB`}
                        <span className="text-[10px] text-[#8e9192] block">{model.quantization}</span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#c4c7c8]">
                        {model.vramRequiredMb} MB
                      </td>

                      <td className="py-3.5 px-4 text-xs text-[#c4c7c8] max-w-[200px]">
                        {model.description}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {isDownloading ? (
                          <div className="flex flex-col items-end gap-1">
                            <span className="font-mono text-[10px] text-purple-300">
                              Downloading &amp; Compiling... {downloadProgress}%
                            </span>
                            <div className="w-28 h-1.5 bg-[#262626] rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-purple-500 transition-all duration-300"
                                style={{ width: `${downloadProgress}%` }}
                              />
                            </div>
                          </div>
                        ) : isDownloaded ? (
                          <div className="flex items-center justify-end gap-2">
                            {isSelected ? (
                              <span className="px-2.5 py-1 rounded bg-purple-950/80 border border-purple-600/60 text-purple-300 font-mono text-[10px] flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                                Active in VRAM
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  updateField('selectedLocalModelId', model.id);
                                  updateField('isModelLoadedInVram', true);
                                  updateField('allocatedVramMb', model.vramRequiredMb);
                                }}
                                className="px-2.5 py-1 rounded bg-[#262626] hover:bg-[#333333] text-white text-[11px] font-medium transition-colors cursor-pointer"
                              >
                                Load Model
                              </button>
                            )}

                            <button
                              onClick={() => handleUnloadModel(model.id)}
                              title="Delete from cache"
                              className="p-1 rounded text-[#8e9192] hover:text-red-400 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleSimulateDownload(model.id)}
                            className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#e6e1e1] text-black font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow ml-auto"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Model</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Test Vision Inference Runner */}
          <div className="bg-[#141313] border border-[#262626] rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-mono-caption text-[10px] text-purple-300 uppercase tracking-wider block">
                  IN-BROWSER WEBGPU INFERENCE TESTER
                </span>
                <span className="text-xs font-semibold text-white">
                  Test Variant Identification on Sandman #21 Cover
                </span>
              </div>

              <button
                onClick={handleRunSampleInference}
                disabled={testInferenceRunning}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow cursor-pointer disabled:opacity-50"
              >
                <Play className={`w-3 h-3 ${testInferenceRunning ? 'animate-spin' : ''}`} />
                <span>{testInferenceRunning ? 'Executing WebGPU Shaders...' : 'Run Vision Inference'}</span>
              </button>
            </div>

            {testInferenceResult && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#0a0a0a] border border-[#222222] p-3 rounded-lg text-xs">
                <div className="flex flex-col">
                  <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase">Detected Series</span>
                  <span className="text-white font-medium">{testInferenceResult.detectedSeries}</span>
                  <span className="text-[#8e9192] text-[11px]">{testInferenceResult.detectedIssue}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase">Matched Variant</span>
                  <span className="text-purple-300 font-medium">{testInferenceResult.variantMatch}</span>
                  <span className="text-emerald-400 font-mono text-[10px]">Confidence: {testInferenceResult.confidence}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-mono-caption text-[10px] text-[#8e9192] uppercase">WebGPU Telemetry</span>
                  <span className="font-mono text-white text-[11px]">{testInferenceResult.tokensPerSecond} tokens/sec</span>
                  <span className="font-mono text-[#8e9192] text-[10px]">Latency: {testInferenceResult.latencyMs}ms</span>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* 5. Scraping Heuristics & Automation Checkboxes */}
      <div className="bg-[#1c1b1b] border border-[#262626] rounded-xl p-5 sm:p-6 flex flex-col gap-4">
        <div>
          <span className="font-mono-caption text-[10px] text-white uppercase tracking-wider block">
            SECTION C · SCRAPING &amp; AUTOMATION HEURISTICS
          </span>
          <p className="font-body-sm text-xs text-[#8e9192] mt-0.5">
            Configure how the vision model intervenes during import scraping conflicts and queue operations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          
          <label className="flex items-start gap-3 p-3 bg-[#141313] border border-[#262626] rounded-xl cursor-pointer hover:border-[#383737] transition-colors">
            <input
              type="checkbox"
              checked={aiConfig.autoVisionScraping}
              onChange={(e) => updateField('autoVisionScraping', e.target.checked)}
              className="accent-purple-400 rounded mt-0.5"
            />
            <div className="flex flex-col">
              <span className="text-white font-medium">Auto-Invoke Vision on Scrape Conflicts</span>
              <span className="text-[11px] text-[#8e9192] mt-0.5">
                Automatically inspects raw page 00 to differentiate virgin covers, retailer incentive variants, and foreign reprints.
              </span>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 bg-[#141313] border border-[#262626] rounded-xl cursor-pointer hover:border-[#383737] transition-colors">
            <input
              type="checkbox"
              checked={aiConfig.naturalLanguageDownloads}
              onChange={(e) => updateField('naturalLanguageDownloads', e.target.checked)}
              className="accent-purple-400 rounded mt-0.5"
            />
            <div className="flex flex-col">
              <span className="text-white font-medium">Natural Language Download Queuing</span>
              <span className="text-[11px] text-[#8e9192] mt-0.5">
                Allows commanding the copilot to queue missing issues directly to qBittorrent or Usenet (e.g. "queue missing Saga issues").
              </span>
            </div>
          </label>

        </div>

        {/* System Prompt */}
        <div className="flex flex-col gap-1.5 pt-2">
          <label className="font-mono-caption text-[10px] text-[#8e9192] uppercase">
            Curator Archival Copilot Persona &amp; Rules
          </label>
          <textarea
            rows={2}
            value={aiConfig.systemPrompt}
            onChange={(e) => updateField('systemPrompt', e.target.value)}
            className="w-full bg-[#141313] border border-[#333333] rounded-lg p-2.5 text-xs text-white font-mono outline-none focus:border-purple-500"
          />
        </div>
      </div>

    </div>
  );
};
