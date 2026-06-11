import React, { useState } from 'react';
import { 
  DollarSign, 
  Trash2, 
  ArrowUpRight, 
  TrendingDown, 
  RefreshCw, 
  Info, 
  Coins, 
  Cpu, 
  Database, 
  HardDrive 
} from 'lucide-react';
import { CloudResource, Finding } from '../types';

interface CostCardsProps {
  resources: CloudResource[];
  findings: Finding[];
  onResolveFinding: (findingId: string) => Promise<void>;
  isBeginnerMode?: boolean;
}

export function CostCards({
  resources,
  findings,
  onResolveFinding,
  isBeginnerMode = true
}: CostCardsProps) {
  const [remediatingId, setRemediatingId] = useState<string | null>(null);

  const costFindings = findings.filter(f => f.category === 'cost' && f.status === 'active');
  const totalCost = resources.reduce((sum, r) => sum + r.costMonthly, 0);
  const potentialSavings = resources
    .filter(r => r.details.isUnused)
    .reduce((sum, r) => sum + r.costMonthly, 0);

  const handleDecommission = async (findingId: string) => {
    setRemediatingId(findingId);
    setTimeout(async () => {
      await onResolveFinding(findingId);
      setRemediatingId(null);
    }, 1200);
  };

  return (
    <div id="cost-optimizer" className="space-y-6 text-slate-100 font-sans">

      {isBeginnerMode && (
        <div id="beginner-cost-hub" className="bg-[#0b101c] border border-purple-500/40 p-5 rounded-xl shadow-lg relative overflow-hidden">
          <div className="space-y-1.5 text-left">
            <span className="px-2 py-0.5 bg-purple-500/15 text-purple-300 border border-purple-500/35 text-[10px] font-mono rounded font-bold uppercase tracking-wider">
              🎓 BUDGET OPTIMIZATION GUIDE
            </span>
            <h3 className="text-base font-bold text-white">How Your Cloud Costs Work</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="space-y-1">
                <strong className="text-purple-400 font-mono block">1. WHAT HAPPENED?</strong>
                <p className="text-slate-200 leading-relaxed font-normal p-0.5">
                  Your connected AWS and GCP accounts are running virtual systems and storing files that have been flagged as "unutilized" or "idle."
                </p>
              </div>
              <div className="space-y-1">
                <strong className="text-indigo-455 text-indigo-400 font-mono block">2. WHY DOES IT MATTER?</strong>
                <p className="text-slate-200 leading-relaxed font-normal p-0.5">
                  Cloud databases and servers cost money every single minute they are turned on, even if your application is not getting any traffic. Turning off waste saves you money instantly.
                </p>
              </div>
              <div className="space-y-1">
                <strong className="text-teal-400 font-mono block font-semibold">3. WHAT SHOULD I DO NEXT?</strong>
                <p className="text-slate-200 leading-relaxed font-normal p-0.5">
                  Review the waste findings below and click the purple <strong className="text-purple-400">"Decommission / Resize"</strong> button. We will resize oversized components or delete orphan files for you!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Metrics Board Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Runrate Card */}
        <div className="p-6 bg-[#0d0e12] border border-[#1f212f] rounded-xl relative overflow-hidden shadow-sm">
          <DollarSign className="absolute right-[-10px] bottom-[-10px] h-28 w-28 text-white/5 pointer-events-none" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-350 font-mono">Estimated Monthly Runrate</span>
          <span className="text-3xl font-extrabold text-white mt-1.5 block font-mono tracking-tight">${totalCost}</span>
          <span className="text-[10px] text-slate-400 mt-2 block leading-relaxed">
            Aggregated cost factors across connected operational infrastructure endpoints.
          </span>
        </div>

        {/* Leakage savings */}
        <div className="p-6 bg-[#0d0e12] border border-[#1f212f] rounded-xl relative overflow-hidden shadow-sm">
          <Coins className="absolute right-[-10px] bottom-[-10px] h-28 w-28 text-purple-500/5 pointer-events-none" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-350 font-mono">Identified Leakage (Savings)</span>
          <span className="text-3xl font-extrabold text-[#c084fc] mt-1.5 block font-mono tracking-tight">${potentialSavings}</span>
          
          <div className="mt-2.5">
            <span className="text-[10px] text-purple-300 font-extrabold inline-flex items-center gap-1 bg-purple-500/15 border border-purple-500/35 px-2.5 py-0.5 rounded-full font-mono uppercase tracking-wider">
              <ArrowUpRight className="h-3.5 w-3.5 text-purple-400 animate-pulse" />
              Reduce {totalCost > 0 ? Math.round((potentialSavings / totalCost) * 100) : 0}% of budget
            </span>
          </div>
        </div>

        {/* Projection Target bar charts */}
        <div className="p-6 bg-[#0d0e12] border border-[#1f212f] rounded-xl relative overflow-hidden shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-350 font-mono block mb-2.5">Expenditure Forecast Target</span>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 font-medium font-sans">Optimized Target:</span>
              <span className="text-emerald-400 font-bold font-mono">${totalCost - potentialSavings}/mo</span>
            </div>

            <div className="w-full bg-[#07080a] rounded-full h-2.5 border border-[#1f212f] overflow-hidden">
              <div 
                className="bg-purple-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${totalCost > 0 ? ((totalCost - potentialSavings) / totalCost) * 100 : 100}%` }}
              />
            </div>
            
            <p className="text-[10px] text-slate-400 leading-normal block pt-1.5">
              Fusing automated stop-schedules and decommissioning idle disks restores massive capacity.
            </p>
          </div>
        </div>
      </div>

      {/* Main Two-column panel: Leaking items list vs Forecast sidebar chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (Savings Recommendations) */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="font-bold text-xs font-mono tracking-widest uppercase text-slate-300">Actionable Financial Waste Findings</h3>
          
          {costFindings.map((finding) => {
            const matchingRes = resources.find(r => r.id === finding.resourceId);
            return (
              <div 
                key={finding.id} 
                className="p-6 bg-[#0d0e12] border border-[#1f212f] rounded-xl hover:border-slate-750 transition-colors space-y-4 relative"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono tracking-wider uppercase border ${
                        finding.provider === 'AWS' ? 'bg-amber-500/10 text-amber-400 border-amber-500/25' : 'bg-blue-500/10 text-blue-400 border-blue-500/25'
                      }`}>
                        {finding.provider}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">{finding.id}</span>
                    </div>
                    <h4 className="font-bold text-white text-base tracking-tight leading-snug">{finding.title}</h4>
                  </div>

                  {matchingRes && (
                    <div className="bg-purple-500/15 border border-purple-500/25 px-3 py-1.5 rounded-lg text-center shrink-0 min-w-[84px]">
                      <span className="text-[9px] text-[#c084fc] uppercase font-bold block tracking-wider font-mono">leakrate</span>
                      <span className="text-sm font-bold font-mono text-purple-300">${matchingRes.costMonthly}/mo</span>
                    </div>
                  )}
                </div>

                <p className="text-xs text-slate-200 leading-relaxed font-normal">{finding.description}</p>
                
                <p className="text-[11px] text-slate-400 font-sans">
                  Target resource: <strong className="text-slate-200 font-mono bg-[#07080a] px-2 py-0.5 rounded border border-[#1f212f]">{finding.resourceName || finding.resourceId}</strong>
                </p>

                {/* Remediation Fix Card container - Flat flat layout to reject nesting */}
                <div className="p-4 bg-[#07080a] rounded-lg border border-[#1f212f] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-0.5 flex-1 max-w-lg">
                    <span className="text-[9px] text-slate-400 uppercase font-mono tracking-wider block font-bold">REMEDIATION STEPS</span>
                    <p className="text-xs text-slate-250 leading-relaxed font-normal">{finding.remediation}</p>
                  </div>
                  
                  <button
                    onClick={() => handleDecommission(finding.id)}
                    disabled={remediatingId !== null}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                  >
                    <RefreshCw className={`h-3 w-3 ${remediatingId === finding.id ? 'animate-spin' : ''}`} />
                    {remediatingId === finding.id ? 'Optimizing...' : 'Decommission / Resize'}
                  </button>
                </div>
              </div>
            );
          })}

          {costFindings.length === 0 && (
            <div className="py-12 bg-[#0d0e12] border border-[#1f212f] border-dashed rounded-xl text-center text-slate-400 font-mono text-xs">
              No active cost leaks detected. Cloud resource budgeting is running perfectly.
            </div>
          )}
        </div>

        {/* Right Column (Trend forecasting & idle explanations sidebar) */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-[#0d0e12] border border-[#1f212f] rounded-xl p-6 space-y-5 h-fit">
            <div>
              <h3 className="font-bold text-xs font-mono tracking-widest uppercase text-slate-350 border-b border-[#1f212f] pb-2.5">Utilization Explanations</h3>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed font-sans">
                Utilization aggregates computed over trailing 15-day intervals across subnets.
              </p>
            </div>

            <div className="space-y-4">
              {/* Projected Months projections */}
              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-200">
                  <span>Month 1 Forecast:</span>
                  <span className="font-semibold text-white">${totalCost}</span>
                </div>
                <div className="w-full bg-[#07080a] border border-[#1f212f] rounded h-3 overflow-hidden relative">
                  <div className="bg-rose-500 h-full" style={{ width: '100%' }} />
                </div>
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-200">
                  <span>Month 2 Forecast:</span>
                  <span className="font-semibold text-white">${totalCost - potentialSavings}</span>
                </div>
                <div className="w-full bg-[#07080a] border border-[#1f212f] rounded h-3 overflow-hidden relative">
                  <div className="bg-purple-500 h-full" style={{ width: `${totalCost > 0 ? ((totalCost - potentialSavings) / totalCost) * 100 : 100}%` }} />
                </div>
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                <div className="flex justify-between text-slate-200">
                  <span>Month 3 Forecast:</span>
                  <span className="font-semibold text-white">${totalCost - potentialSavings}</span>
                </div>
                <div className="w-full bg-[#07080a] border border-[#1f212f] rounded h-3 overflow-hidden relative">
                  <div className="bg-purple-500 h-full" style={{ width: `${totalCost > 0 ? ((totalCost - potentialSavings) / totalCost) * 100 : 100}%` }} />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#1f212f] text-[10px] text-slate-400 space-y-2 font-mono">
              <span className="block font-bold text-slate-350 uppercase tracking-wider text-[9px]">IDLE BENCHMARK POLICIERS</span>
              <p className="leading-snug">
                - CPU thresholds trigger warnings when &lt;2% avg for 7 consecutive days.
              </p>
              <p className="leading-snug">
                - Unattached volumes represent SSD boot capacities locked away from computing nodes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
