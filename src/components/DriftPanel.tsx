import React, { useState } from 'react';
import { 
  GitCompare, 
  AlertTriangle, 
  CheckCircle, 
  Code, 
  Copy, 
  RefreshCw, 
  CheckCircle2, 
  GitPullRequest
} from 'lucide-react';
import { TerraformDrift } from '../types';

interface DriftPanelProps {
  drifts: TerraformDrift[];
  onResolveDrift: (driftId: string) => Promise<void>;
  isBeginnerMode?: boolean;
}

export function DriftPanel({
  drifts,
  onResolveDrift,
  isBeginnerMode = true
}: DriftPanelProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const handleCopy = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleSyncState = async (id: string) => {
    setSyncingId(id);
    setTimeout(async () => {
      await onResolveDrift(id);
      setSyncingId(null);
    }, 1200);
  };

  return (
    <div id="drift-detector-cockpit" className="space-y-6 text-slate-100 font-sans">
      
      {/* Premium Header Banner */}
      <div className="p-6 bg-[#0d0e12] border border-[#1f212f] rounded-xl relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-sm">
        <div className="space-y-1 text-left">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <GitCompare className="h-5.5 w-5.5 text-blue-500 animate-pulse" />
            Infrastructure Drift Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Comparing live cloud properties against declared <strong className="text-blue-400">terraform.tfstate</strong> configurations. Prevent manual console modifications.
          </p>
        </div>

        <div className="p-3 bg-[#07080a] border border-[#1f212f] rounded-lg text-xs font-mono shrink-0 flex items-center gap-2">
          <GitPullRequest className="h-4.5 w-4.5 text-blue-400" />
          <span>Active checkouts: <strong className="text-blue-400 font-bold">{drifts.length} drifted modules</strong></span>
        </div>
      </div>

      {isBeginnerMode && (
        <div id="beginner-drift-hub" className="bg-[#0b101c] border border-blue-500/40 p-5 rounded-xl shadow-lg relative overflow-hidden">
          <div className="space-y-1.5 text-left">
            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-mono rounded font-bold uppercase tracking-wider">
              🎓 INFRASTRUCTURE AS CODE LESSON
            </span>
            <h3 className="text-base font-bold text-white">Understanding Infrastructure Drift</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="space-y-1">
                <strong className="text-blue-400 font-mono block">1. WHAT HAPPENED?</strong>
                <p className="text-slate-200 leading-relaxed font-normal p-0.5">
                  Someone logged into the AWS or Google Cloud browser console and manually changed some configurations (like changing firewall rules or opening ports) instead of writing script files first.
                </p>
              </div>
              <div className="space-y-1">
                <strong className="text-indigo-400 font-mono block">2. WHY DOES IT MATTER?</strong>
                <p className="text-slate-200 leading-relaxed font-normal p-0.5">
                  In modern software teams, all IT hardware is declared as code scripts (called Terraform). Manual adjustments cause your cloud setup to "drift" from your scripts, making it hard to track security rules or rebuild servers if they crash.
                </p>
              </div>
              <div className="space-y-1">
                <strong className="text-purple-400 font-sans block font-semibold text-white">3. WHAT SHOULD I DO NEXT?</strong>
                <p className="text-slate-200 leading-relaxed font-normal p-0.5">
                  Review the listed changes. You can copy the declared correct code snippet to update your local scripts, or click blue <strong className="text-blue-405 text-blue-400 font-semibold">"Overwrite Cloud Drift"</strong> to wipe out manual adjustments and restore original safe code scripts!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Drift Iterative Catalog */}
      <div className="space-y-6">
        {drifts.map((dr) => (
          <div 
            key={dr.id}
            className="p-6 bg-[#0d0e12] border border-[#1f212f] rounded-xl space-y-4 shadow-sm transition-all relative overflow-hidden text-left"
          >
            {/* Top row alignment triggers */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1f212f] pb-4">
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider uppercase border ${
                    dr.accountId.includes('aws') ? 'bg-amber-500/10 text-amber-400 border-amber-500/25' : 'bg-blue-500/10 text-blue-400 border-blue-500/25'
                  }`}>
                    {dr.accountId.includes('aws') ? 'AWS' : 'GCP'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-tight">{dr.resourceType}</span>
                </div>

                <h3 className="text-sm font-bold text-white mt-1.5 flex items-center gap-1.5 flex-wrap">
                  <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0" />
                  Drift deviation found on :
                  <span className="text-blue-400 font-mono bg-[#07080a] px-2.5 py-1 rounded border border-[#1f212f] text-xs font-bold leading-none select-all">{dr.resourceName}</span>
                </h3>
              </div>

              {/* Force overwrite alignment baseline */}
              <button
                onClick={() => handleSyncState(dr.id)}
                disabled={syncingId !== null}
                className="flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-all shadow-sm active:scale-97 shrink-0 cursor-pointer"
              >
                <RefreshCw className={`h-3 w-3 ${syncingId === dr.id ? 'animate-spin' : ''}`} />
                {syncingId === dr.id ? 'Pushing state config...' : 'Overwrite Cloud Drift'}
              </button>
            </div>

            {/* GitHub-style PR Differential Comparisons Mock-up */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">State checksum diff (- expected, + manual active cloud)</span>
              
              <div className="border border-[#1f212f] rounded-lg overflow-hidden bg-[#07080a] font-mono text-xs text-left">
                {/* Diff Header */}
                <div className="px-4 py-1.5 bg-[#0e1017] border-b border-[#1f212f] text-[10px] text-slate-400 flex justify-between tracking-tight">
                  <span>@@ - declared state, + manual changes @@</span>
                  <span>github-diff-parser</span>
                </div>
                
                {/* Diff Body Lines */}
                <div className="divide-y divide-[#1f212f]/40 font-mono text-[11px] leading-relaxed">
                  {/* RED lines representing Declared Intended value */}
                  <div className="bg-rose-950/20 text-rose-300 px-4 py-3 border-l-4 border-rose-600 select-all whitespace-pre-wrap leading-relaxed">
                    <span className="text-rose-600 font-bold select-none mr-3 inline-block w-4">-</span>
                    {dr.stateValue}
                  </div>
                  
                  {/* GREEN lines representing Active Reality */}
                  <div className="bg-emerald-950/20 text-emerald-300 px-4 py-3 border-l-4 border-emerald-600 select-all whitespace-pre-wrap leading-relaxed">
                    <span className="text-emerald-600 font-bold select-none mr-3 inline-block w-4">+</span>
                    {dr.actualValue}
                  </div>
                </div>
              </div>
            </div>

            {/* Suggested Terraform code remediation block */}
            {dr.remediationCode && (
              <div className="bg-[#07080a] rounded-lg border border-[#1f212f] overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#0e1017] border-b border-[#1f212f]">
                  <span className="text-[9px] font-extrabold uppercase text-slate-350 tracking-wider flex items-center gap-1.5 font-mono">
                    <Code className="h-4 w-4 text-slate-400" />
                    Recommended Remediation HCL code Block
                  </span>
                  
                  <button
                    onClick={() => handleCopy(dr.id, dr.remediationCode!)}
                    className="text-slate-400 hover:text-white text-xs flex items-center gap-1 transition-colors cursor-pointer font-bold font-mono text-[10px]"
                  >
                    {copiedId === dr.id ? (
                      <span className="text-emerald-400 flex items-center gap-0.5">
                        <CheckCircle2 className="h-3 w-3" /> Copied code
                      </span>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5 text-slate-300" /> Copy Manifest
                      </>
                    )}
                  </button>
                </div>
                
                <div className="p-4 overflow-x-auto bg-[#07080a]/60">
                  <pre className="font-mono text-[11px] text-teal-400 leading-relaxed overflow-x-auto select-all text-left">
                    {dr.remediationCode}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ))}

        {drifts.length === 0 && (
          <div className="py-16 text-center bg-[#0d0e12] border border-[#1f212f] border-dashed rounded-xl space-y-3">
            <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto" />
            <h3 className="font-bold text-white text-sm">No Infrastructure Drifts Discovered</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              Your active running multi-cloud resources match recorded checksum blueprints perfectly across connected accounts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
