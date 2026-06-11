import React, { useState, useRef, useEffect } from 'react';
import { 
  Brain, 
  Send, 
  ChevronRight, 
  Terminal, 
  HelpCircle, 
  Copy, 
  CheckCircle2 
} from 'lucide-react';
import { ChatMessage } from '../types';

interface ChatAgentProps {
  chatHistory: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  isAILoading: boolean;
  isBeginnerMode?: boolean;
}

export function ChatAgent({
  chatHistory,
  onSendMessage,
  isAILoading,
  isBeginnerMode = true
}: ChatAgentProps) {
  const [inputText, setInputText] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isAILoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isAILoading) return;

    onSendMessage(inputText);
    setInputText('');
  };

  const selectStarterPrompt = (prompt: string) => {
    if (isAILoading) return;
    onSendMessage(prompt);
  };

  const handleCopyCode = (indexKey: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(indexKey);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Safe manual renderer that converts simple markdown structures (code blocks, bold text, bullet points) into styled HTML elements safely
  const formatAIMessage = (text: string, msgIdx: number) => {
    const parts = text.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      const indexKey = `msg-${msgIdx}-part-${index}`;
      
      // Code block
      if (part.startsWith('```')) {
        const lines = part.split('\n');
        const language = lines[0].replace('```', '').trim() || 'yaml';
        const code = lines.slice(1, -1).join('\n');
        
        return (
          <div key={indexKey} className="my-3.5 bg-[#07080a] rounded-lg overflow-hidden border border-[#1f212f] text-[11px] font-mono select-all shadow-sm relative group">
            <div className="bg-[#0e1017] px-4 py-2 border-b border-[#1f212f] text-slate-400 uppercase tracking-widest text-[9px] font-bold flex items-center justify-between">
              <span className="flex items-center gap-1 font-mono">
                <Terminal className="h-3 w-3 text-blue-400" />
                {language} Manifest Block
              </span>
              <button
                type="button"
                onClick={() => handleCopyCode(indexKey, code)}
                className="hover:text-white flex items-center gap-1 font-mono transition-colors text-[9px] cursor-pointer"
              >
                {copiedId === indexKey ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                    <CheckCircle2 className="h-3 w-3" /> COPIED
                  </span>
                ) : (
                  <>
                    <Copy className="h-3 w-3 text-slate-400" /> COPY CODE
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 text-emerald-405 text-emerald-450 text-emerald-400 overflow-x-auto whitespace-pre leading-relaxed font-mono select-all">
              {code}
            </pre>
          </div>
        );
      }

      // Inline lines format formatting (bold words and bullet lists)
      const lines = part.split('\n');
      return (
        <div key={indexKey} className="space-y-1">
          {lines.map((line, lineIdx) => {
            const lineKey = `${indexKey}-line-${lineIdx}`;

            // Bullet Point
            if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
              const cleanedText = line.trim().substring(1).trim();
              return (
                <ul key={lineKey} className="list-disc pl-5 text-xs text-slate-300 leading-relaxed font-sans text-left">
                  <li className="mt-1">{parseBoldText(cleanedText)}</li>
                </ul>
              );
            }
            
            // Header Lines
            if (line.trim().startsWith('###')) {
              return (
                <h4 key={lineKey} className="font-extrabold text-white text-xs uppercase tracking-wider pt-3 pb-1 flex items-center gap-1 font-sans text-left">
                  <ChevronRight className="h-3.5 w-3.5 text-blue-400 animate-pulse" /> 
                  {line.replace('###', '').trim()}
                </h4>
              );
            }

            if (line.trim().startsWith('##') || line.trim().startsWith('#')) {
              return (
                <h3 key={lineKey} className="font-bold text-base text-white pt-4 pb-1.5 flex items-center gap-1.5 font-sans tracking-tight text-left">
                  {line.replace(/#+/g, '').trim()}
                </h3>
              );
            }

            // Normal lines
            return line.trim() ? (
              <p key={lineKey} className="text-xs text-slate-205 text-slate-300 leading-relaxed pr-1 mt-1 font-sans font-normal text-left">
                {parseBoldText(line)}
              </p>
            ) : (
              <div key={lineKey} className="h-2.5" />
            );
          })}
        </div>
      );
    });
  };

  const parseBoldText = (txt: string) => {
    const boldParts = txt.split(/(\*\*.*?\*\*)/g);
    return boldParts.map((bPart, bIdx) => {
      if (bPart.startsWith('**') && bPart.endsWith('**')) {
        return (
          <strong key={bIdx} className="font-bold text-blue-300 bg-blue-500/15 px-1.5 py-0.5 rounded border border-blue-500/25 inline-block text-[11px] leading-none">
            {bPart.substring(2, bPart.length - 2)}
          </strong>
        );
      }
      return bPart;
    });
  };

  return (
    <div id="ai-advisor-workspace" className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-slate-100 h-[660px] items-stretch font-sans">
      
      {/* Search Suggestion Starters Pane (Col Span 4) */}
      <div className="bg-[#0d0e12] border border-[#1f212f] rounded-xl p-5 space-y-4 flex flex-col justify-between hidden lg:flex h-full lg:col-span-4 shadow-sm text-left">
        <div className="space-y-4">
          <div className="border-b border-[#1f212f] pb-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
              <Terminal className="h-4 w-4 text-blue-400" />
              Scenario Injections
            </h3>
            <p className="text-[10px] text-slate-400 leading-normal mt-1">Select starter questions parsed from live multi-cloud infrastructure states.</p>
          </div>

          <div className="space-y-2.5">
            {(isBeginnerMode ? [
              { label: 'Explain how my security risks are exploited', prompt: 'Explain the security risks in my account (unlocked buckets, port 22) like I am five years old, and show how a script program could exploit them.' },
              { label: 'How can I lock down public access safely?', prompt: 'What is the absolute easiest way for a beginner developer to make sure folders (S3 Buckets) are private, and how can authorized users still view assets?' },
              { label: 'Why am I being billed for idle cloud stuff?', prompt: 'How does cloud billing work? Why do providers charge me for unutilized virtual machines or unattached SSD drives?' },
              { label: 'What is Infrastructure as Code (Terraform)?', prompt: 'Explain what Infrastructure as Code is versus manual clicking, and why custom drift happens.' }
            ] : [
              { label: 'Summarize Security Vulnerabilities', prompt: 'Summarize the unresolved critical security vulnerabilities across AWS and GCP connected connection handles.' },
              { label: 'Plan S3 Encryption Policies', prompt: 'Create AWS S3 encrypted policy bucket blocks matching compliant standards.' },
              { label: 'Recommend Cost Containments', prompt: 'Which virtual machines or databases are under-utilized? Provide direct optimization proposals.' },
              { label: 'Remediate Ingress Security Groups', prompt: 'Draft the CLI commands to prune manually modified open security group port modifications.' }
            ]).map((starter, sIdx) => (
              <button
                key={sIdx}
                disabled={isAILoading}
                onClick={() => selectStarterPrompt(starter.prompt)}
                className="w-full text-left p-3.5 bg-[#07080a] hover:bg-[#13151f] rounded-lg border border-[#1f212f] hover:border-[#35394f] transition-all text-xs text-slate-300 hover:text-white leading-normal flex gap-2.5 cursor-pointer shadow-sm"
              >
                <HelpCircle className="h-4.5 w-4.5 text-blue-400 shrink-0 mt-0.5" />
                <span className="font-normal">{starter.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#07080a] p-4 rounded-lg border border-[#1f212f] text-[10px] text-slate-400 flex gap-2 font-sans">
          <Brain className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
          <span>CloudGuardian context injection isolates findings lists onto Gemini models queries automatically to avoid placeholder summaries.</span>
        </div>
      </div>

      {/* Primary chat Workspace (Col Span 8) */}
      <div className="bg-[#0d0e12] border border-[#1f212f] rounded-xl flex flex-col lg:col-span-8 h-full overflow-hidden shadow-sm">
        {/* Banner header */}
        <div className="px-5 py-4 bg-[#0e1017] border-b border-[#1f212f] flex items-center justify-between text-left">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-lg">
              <Brain className="h-4.5 w-4.5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-xs uppercase tracking-wider font-mono">Principal AI Advisor Console</h3>
              <span className="text-[10px] text-slate-400 font-bold block mt-0.5">State catalogs initialized &bull; AWS Secure Handshake active</span>
            </div>
          </div>
          <span className="text-[9px] font-bold uppercase bg-blue-600 text-white px-2.5 py-1 rounded-md font-mono tracking-wider">gemini-3.5-flash</span>
        </div>

        {/* Messaging Logs history */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#07080a]/30 scrollbar-thin">
          {chatHistory.map((msg, idx) => (
            <div 
              key={msg.id}
              className={`flex gap-3 max-w-4xl ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="bg-blue-500/10 text-blue-400 text-xs rounded-lg h-7 w-7 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-sm self-start mt-1">
                  <Brain className="h-4 w-4" />
                </div>
              )}
              <div 
                className={`p-4 rounded-lg text-xs max-w-full leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white font-semibold rounded-tr-none shadow-sm'
                    : 'bg-[#07080a] text-slate-100 rounded-tl-none border border-[#1f212f] shadow-sm'
                }`}
              >
                {msg.sender === 'user' ? (
                  <p className="whitespace-pre-wrap font-sans text-xs font-normal leading-relaxed text-right">{msg.text}</p>
                ) : (
                  <div className="space-y-1.5">{formatAIMessage(msg.text, idx)}</div>
                )}
              </div>
            </div>
          ))}

          {/* Chat Loader stream feedback */}
          {isAILoading && (
            <div className="flex gap-3 justify-start">
              <div className="bg-blue-500/10 text-blue-400 text-xs rounded-lg h-7 w-7 flex items-center justify-center shrink-0 border border-blue-500/20 shadow-sm self-start animate-pulse">
                <Brain className="h-4 w-4" />
              </div>
              <div className="p-4 rounded-lg text-xs bg-[#07080a] border border-[#1f212f] rounded-tl-none text-slate-400 flex items-center gap-2.5 shadow-sm">
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </span>
                <span className="font-mono text-[10.5px] uppercase tracking-wide text-slate-450 text-slate-400">Retrieving Cloud catalogue profiles...</span>
              </div>
            </div>
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Text Form */}
        <form onSubmit={handleSubmit} className="p-4 bg-[#0e1017] border-t border-[#1f212f] flex gap-2.5">
          <input
            type="text"
            required
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={isAILoading}
            placeholder="Ask CloudGuardian about AWS bucket vulnerabilities, RAG drift fixes..."
            className="flex-1 bg-[#07080a] border border-[#1f212f] rounded-lg px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 placeholder-slate-500 font-sans shadow-inner focus:ring-1 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || isAILoading}
            className={`p-2.5 rounded-lg flex items-center justify-center transition-all ${
              !inputText.trim() || isAILoading
                ? 'bg-[#07080a] text-slate-500 border border-[#1f212f] cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white font-bold active:scale-97 cursor-pointer'
            }`}
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
