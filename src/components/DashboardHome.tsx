import React, { useState } from 'react';
import { 
  Cloud, 
  ShieldCheck, 
  DollarSign, 
  GitCompare, 
  AlertTriangle, 
  Activity, 
  CheckCircle2, 
  ArrowRight,
  Brain,
  Info,
  ChevronRight,
  RefreshCw,
  Bell,
  Cpu
} from 'lucide-react';
import { CloudAccount, CloudResource, Finding, SystemNotification } from '../types';

interface DashboardHomeProps {
  accounts: CloudAccount[];
  resources: CloudResource[];
  findings: Finding[];
  notifications: SystemNotification[];
  setActiveTab: (tab: string) => void;
  triggerScanAll: () => void;
  isScanning: boolean;
  isBeginnerMode?: boolean;
  setIsBeginnerMode?: (val: boolean) => void;
}

export function DashboardHome({
  accounts,
  resources,
  findings,
  notifications,
  setActiveTab,
  triggerScanAll,
  isScanning,
  isBeginnerMode = true,
  setIsBeginnerMode
}: DashboardHomeProps) {
  const [selectedScoreExplainer, setSelectedScoreExplainer] = useState<'health' | 'security' | 'cost' | 'drift' | null>('health');

  // Analytical aggregate calculations
  const totalResources = resources.length;
  const activeFindings = findings.filter(f => f.status === 'active');
  
  const criticalCount = activeFindings.filter(f => f.severity === 'critical').length;
  const highCount = activeFindings.filter(f => f.severity === 'high').length;
  const mediumCount = activeFindings.filter(f => f.severity === 'medium').length;
  const lowCount = activeFindings.filter(f => f.severity === 'low').length;

  const totalMonthlyCost = resources.reduce((sum, r) => sum + r.costMonthly, 0);
  const potentialSavings = resources
    .filter(r => r.details.isUnused)
    .reduce((sum, r) => sum + r.costMonthly, 0);

  // Dynamic status scores calculated from scanned findings
  // Security Score deductions: Critical: -15, High: -8, Medium: -3
  const securityScore = Math.max(0, 100 - (criticalCount * 15) - (highCount * 8) - (mediumCount * 3));
  
  // Cost score deductions based on idle resources Count
  const idleCount = resources.filter(r => r.details.isUnused).length;
  const costScore = Math.max(0, 100 - (idleCount * 10));

  // Drift Score
  const driftIssuesCount = activeFindings.filter(f => f.category === 'drift').length || 1;
  const driftScore = Math.max(0, 100 - (driftIssuesCount * 12));

  // Reliability Score (determined by healthy vs warning items)
  const healthIssuesCount = activeFindings.filter(f => f.category === 'health').length || 0;
  const warningResourcesCount = resources.filter(r => r.status === 'warning' || r.status === 'critical').length;
  const reliabilityScore = Math.max(0, 100 - (healthIssuesCount * 10) - (warningResourcesCount * 5));

  // Overall Health composite score
  const healthScore = Math.round((securityScore + costScore + driftScore + reliabilityScore) / 4);

  // Explainer objects mapping dynamically based on mode selection
  const explainers = isBeginnerMode ? {
    health: {
      title: "Overall Cloud Security & Savings Grade",
      score: healthScore,
      logic: "This overall grade tells you the safety and efficiency level of your cloud environments (AWS/GCP combined). Closer to 100% means your settings are highly secure and you are not wasting money on idle services.",
      factors: [
        { name: "Lock Security Health", weight: "25%", value: `${securityScore}%` },
        { name: "Budget Waste (Potential Savings)", weight: "25%", value: `${costScore}%` },
        { name: "Terraform Code Match", weight: "25%", value: `${driftScore}%` },
        { name: "Cloud Server Reliability", weight: "25%", value: `${reliabilityScore}%` }
      ],
      recommendations: [
        "Secure your open AWS management doors to immediately gain +15% security points",
        "Clean up running servers that are idle to save $120+ every single month",
        "Match manual changes back in Terraform so your written code matches cloud reality"
      ]
    },
    security: {
      title: "Security Setup Health Index",
      score: securityScore,
      logic: "This score shows how safe your cloud is from hacker intrusions. Leaving firewall ports open to everyone online or making data folders public to the internet will deduct safety points.",
      factors: [
        { name: "Globally Exposed Public Assets (AllUsers)", weight: "-15 pts", value: `${criticalCount} vulnerabilities` },
        { name: "Unrestricted Network Port Openings", weight: "-8 pts", value: `${highCount} active issues` },
        { name: "Minor Security Gaps", weight: "-3 pts", value: `${mediumCount} minor alerts` }
      ],
      recommendations: [
        "Uncheck 'Allow public access' on your GCP RECEIPTS folder to secure customer receipts gs://gcp-sensitive-customer-receipts",
        "Switch your AWS S3 static buckets to 'Encrypted Default' to enforce automated local encryption"
      ]
    },
    cost: {
      title: "Budget Optimization & Waste Index",
      score: costScore,
      logic: "This score measures how much money you can save by cleaning up servers you are paying for but not actually using. Like leaving the lights on in an empty room, we detect waste and tell you how to save!",
      factors: [
        { name: "Unused Idle Servers Left Running", weight: "-10 pts", value: `${idleCount} waste items` },
        { name: "Monthly Drainage / Leak Rate", weight: "Impact", value: `$${potentialSavings}/mo currently wasted` }
      ],
      recommendations: [
        "Resize your dev database replica guardian-rds-replica-01 to a smaller class (saves $150/mo!)",
        "Delete stopped sandbox servers that are holding onto costly static IP reservations"
      ]
    },
    drift: {
      title: "Terraform Blueprint Match Index",
      score: driftScore,
      logic: "Terraform is a script blueprints plan of your cloud. If someone manually adds a virtual disk or alters ports without updating your blueprints scripts, the cloud has 'Drifted' from the plan. We score how clean your scripts are.",
      factors: [
        { name: "Code Skew Discrepancies", weight: "-12 pts", value: `${driftIssuesCount} files drifted` }
      ],
      recommendations: [
        "Run 'terraform apply' to override console edits and restore your safe original blueprint setup",
        "Lock manual click-changes inside the raw console, forcing updates to go through your code files only"
      ]
    }
  } : {
    health: {
      title: "Cloud Health Score",
      score: healthScore,
      logic: "Composite weighted score aggregating security hardening index, financial optimization margins, IAC drift alignments, and runtime reliability thresholds.",
      factors: [
        { name: "Security Center Index", weight: "25%", value: `${securityScore}%` },
        { name: "Cost Optimization Index", weight: "25%", value: `${costScore}%` },
        { name: "Terraform State Alignments", weight: "25%", value: `${driftScore}%` },
        { name: "Subnets Node Reliability", weight: "25%", value: `${reliabilityScore}%` }
      ],
      recommendations: [
        "Revoke public TCP port 22 global access rules instantly to lift security to 95%+",
        "Prune oversized development EC2 instances that fall below 2% utilization parameters",
        "Synchronize manual drift adjustments in Security Groups back inside main.tf configurations"
      ]
    },
    security: {
      title: "Security Hardening Score",
      score: securityScore,
      logic: "Risk-based index deducting points dynamically per active severe finding detected. Critical severity Deducts -15% points, High Deducts -8% points, Medium -3% points.",
      factors: [
        { name: "Critical Severity Findings", weight: "-15 pts", value: `${criticalCount} unresolved` },
        { name: "High Severity Findings", weight: "-8 pts", value: `${highCount} unresolved` },
        { name: "Medium Vulnerabilities", weight: "-3 pts", value: `${mediumCount} unresolved` }
      ],
      recommendations: [
        "Eliminate public anonymous read access (AllUsers role) on GCP Receipts bucket gs://gcp-sensitive-customer-receipts",
        "Enforce KMS or AWS-SSE S3 static default encryption rules on raw asset bucket storage nodes"
      ]
    },
    cost: {
      title: "Financial Governance Score",
      score: costScore,
      logic: "Efficiency score based on idle asset ratios and unused storage capacities. Deducts -10% points per detected unattached volume, static reserved IP without VM, or unutilized RDS instance.",
      factors: [
        { name: "Total Idle Resources Listed", weight: "-10 pts", value: `${idleCount} idle elements` },
        { name: "Identified Leakage Quarterly", weight: "Impact", value: `$${potentialSavings}/mo baseline` }
      ],
      recommendations: [
        "Resize PostgreSQL dev instance guardian-rds-replica-01 down from db.r6g.large to db.t4g.medium",
        "Release orphan static IP addresses held by stopped sandbox host 'gcp-stage-sandbox-host'"
      ]
    },
    drift: {
      title: "Terraform Compliance Index",
      score: driftScore,
      logic: "Measures alignment of physical cloud infrastructures against defined Terraform .tfstate checksum records. Deducts per modified or extraneous cloud resource.",
      factors: [
        { name: "Drift Discrepancy Items", weight: "-12 pts", value: `${driftIssuesCount} items skewed` }
      ],
      recommendations: [
        "Verify Security group ingress modifications using CloudGuardian state diff before committing overrides",
        "Lock down manual operator access inside core AWS console to force IaC updates only"
      ]
    }
  };

  const explainerObj = explainers[selectedScoreExplainer || 'health'];

  return (
    <div id="dashboard-cockpit-workspace" className="space-y-6 text-slate-100">
      
      {/* 1. Premium Solid Top Section (Datadog/Vercel Aesthetic) */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-xl border border-[#1f212f] bg-[#0d0e12] shadow-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-1.5 flex-1 max-w-xl">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/25 rounded text-[9px] font-bold tracking-widest font-mono uppercase">
            ENTERPRISE CONTROL TOWER
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight sm:text-3xl">Continuous Governance Monitor</h1>
          <p className="text-xs text-slate-300 font-normal leading-relaxed">
            Real-time metadata scanners connected across <strong className="text-blue-400 font-semibold">{accounts.length} clouds</strong> auditing <strong className="text-[#a855f7] font-semibold">{totalResources} primary resources</strong>, tracking vulnerability baselines instantly.
          </p>
        </div>

        {/* Discovery Scan Trigger and loading animation */}
        <div className="shrink-0">
          <button
            id="btn-scan-all"
            disabled={isScanning}
            onClick={triggerScanAll}
            className={`w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl text-xs font-bold transition-all duration-300 border cursor-pointer ${
              isScanning 
                ? 'bg-blue-900/40 border-blue-500/50 text-blue-300 font-semibold' 
                : 'bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-bold border-blue-700'
            }`}
          >
            <Activity className={`h-4.5 w-4.5 ${isScanning ? 'animate-spin text-blue-300' : 'text-white'}`} />
            {isScanning ? 'Scanning subnets globally...' : 'Trigger Multi-Cloud Scans'}
          </button>
          
          {accounts.length > 0 && (
            <p className="text-[10px] text-slate-400 text-center font-mono mt-2 uppercase tracking-tight">
              Last sweep: {accounts[0]?.lastScanned || 'Just finished'}
            </p>
          )}
        </div>
      </div>

      {/* Beginner Welcome/Onboarding Educational Guidance Block */}
      {isBeginnerMode && (
        <div id="beginner-onboarding-hub" className="bg-[#0b101c] border border-blue-500/40 p-6 rounded-xl shadow-xl flex flex-col gap-5 relative overflow-hidden">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 bg-blue-600 text-white font-extrabold text-[10px] font-mono rounded uppercase tracking-wider">
                🎓 BEGINNER ONBOARDING PORTAL
              </span>
              <span className="text-xs text-blue-300 font-semibold">Self-explanatory guides to cloud security</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">Your Actionable Guided Blueprint to Cloud Mastery</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="bg-[#07080a] p-4 rounded-xl border border-[#1f212f] space-y-1 text-left">
                <span className="text-[11px] font-bold text-blue-400 font-mono block">1. WHAT HAPPENED?</span>
                <p className="text-slate-200 text-xs leading-relaxed font-normal">
                  Our sweeps discovered open firewall security doors (SSH access) and public folder buckets in your active AWS/GCP connections.
                </p>
              </div>
              <div className="bg-[#07080a] p-4 rounded-xl border border-[#1f212f] space-y-1 text-left">
                <span className="text-[11px] font-bold text-[#a855f7] font-mono block">2. WHY DOES IT MATTER?</span>
                <p className="text-slate-200 text-xs leading-relaxed font-normal">
                  Public storage means strangers can view receipts. Open network ports allow malicious scanners to brute-force access.
                </p>
              </div>
              <div className="bg-[#07080a] p-4 rounded-xl border border-[#1f212f] space-y-1 text-left">
                <span className="text-[11px] font-bold text-emerald-400 font-mono block">3. WHAT SHOULD I DO NEXT?</span>
                <p className="text-slate-200 text-xs leading-relaxed font-normal">
                  Lock open access rules under <button type="button" onClick={() => setActiveTab('security')} className="text-blue-400 font-bold hover:underline cursor-pointer">Security Risks</button> and ask the AI in the sidebar to write the code fix!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Explanations Metrics Score Matrix Row */}
      <div id="interactive-scores-row" className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Composite Health Card */}
        <div 
          onClick={() => setSelectedScoreExplainer('health')}
          className={`p-5 rounded-xl border transition-all duration-300 cursor-pointer relative overflow-hidden group ${
            selectedScoreExplainer === 'health' 
              ? 'bg-[#121522] border-blue-500/60 shadow-[0_4px_25px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/30' 
              : 'bg-[#0d0e12] border-[#1f212f] hover:border-slate-700 hover:bg-[#13151f]'
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider font-mono">{isBeginnerMode ? "Overall Grade" : "Cloud Health Score"}</span>
            <Cloud className={`h-4.5 w-4.5 transition-colors ${selectedScoreExplainer === 'health' ? 'text-blue-400' : 'text-slate-400'}`} />
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">{healthScore}%</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
              healthScore >= 80 ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold' : 'bg-amber-500/15 text-amber-400 border border-amber-500/30 font-semibold'
            }`}>
              {healthScore >= 90 ? 'Optimized' : healthScore >= 75 ? 'Healthy' : 'Needs Work'}
            </span>
          </div>

          <div className="mt-3.5 w-full bg-[#1b1c26] rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ${healthScore >= 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} 
              style={{ width: `${healthScore}%` }} 
            />
          </div>
          <span className="text-[9px] text-slate-450 block mt-2 text-right">Click to inspect calculation logic</span>
        </div>

        {/* Security Assessment Card */}
        <div 
          onClick={() => setSelectedScoreExplainer('security')}
          className={`p-5 rounded-xl border transition-all duration-300 cursor-pointer relative overflow-hidden group ${
            selectedScoreExplainer === 'security' 
              ? 'bg-[#121522] border-blue-500/60 shadow-[0_4px_25px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/30' 
              : 'bg-[#0d0e12] border-[#1f212f] hover:border-slate-700 hover:bg-[#13151f]'
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider font-mono">{isBeginnerMode ? "Security Health" : "Security Index"}</span>
            <ShieldCheck className={`h-4.5 w-4.5 transition-colors ${selectedScoreExplainer === 'security' ? 'text-blue-400' : 'text-slate-400'}`} />
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">{securityScore}%</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
              securityScore >= 80 ? 'bg-emerald-500/15 text-emerald-400 font-semibold' : 'bg-rose-500/15 text-rose-400 border border-rose-500/30 font-semibold'
            }`}>
              {criticalCount > 0 ? `${criticalCount} threat flag` : 'Hardened'}
            </span>
          </div>

          <div className="mt-3.5 w-full bg-[#1b1c26] rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${securityScore}%` }} />
          </div>
          <span className="text-[9px] text-slate-450 block mt-2 text-right">Click to inspect risk deductions</span>
        </div>

        {/* Cost Optimization Card */}
        <div 
          onClick={() => setSelectedScoreExplainer('cost')}
          className={`p-5 rounded-xl border transition-all duration-300 cursor-pointer relative overflow-hidden group ${
            selectedScoreExplainer === 'cost' 
              ? 'bg-[#121522] border-blue-500/60 shadow-[0_4px_25px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/30' 
              : 'bg-[#0d0e12] border-[#1f212f] hover:border-slate-700 hover:bg-[#13151f]'
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider font-mono">{isBeginnerMode ? "Potential Savings" : "Cost Efficiency"}</span>
            <DollarSign className={`h-4.5 w-4.5 transition-colors ${selectedScoreExplainer === 'cost' ? 'text-blue-400' : 'text-slate-400'}`} />
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">{costScore}%</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 font-bold uppercase font-mono tracking-wider">
              ${potentialSavings}/mo leak
            </span>
          </div>

          <div className="mt-3.5 w-full bg-[#1b1c26] rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-purple-500 transition-all duration-1000" style={{ width: `${costScore}%` }} />
          </div>
          <span className="text-[9px] text-slate-450 block mt-2 text-right">Click to view waste algorithms</span>
        </div>

        {/* Terraform Drift Compliance Card */}
        <div 
          onClick={() => setSelectedScoreExplainer('drift')}
          className={`p-5 rounded-xl border transition-all duration-300 cursor-pointer relative overflow-hidden group ${
            selectedScoreExplainer === 'drift' 
              ? 'bg-[#121522] border-blue-500/60 shadow-[0_4px_25px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/30' 
              : 'bg-[#0d0e12] border-[#1f212f] hover:border-slate-700 hover:bg-[#13151f]'
          }`}
        >
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider font-mono">{isBeginnerMode ? "Terraform Drift" : "IaC Drift Compliance"}</span>
            <GitCompare className={`h-4.5 w-4.5 transition-colors ${selectedScoreExplainer === 'drift' ? 'text-blue-400' : 'text-slate-400'}`} />
          </div>

          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono tracking-tight">{driftScore}%</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-bold uppercase font-mono tracking-wider font-semibold">
              {driftIssuesCount} skews
            </span>
          </div>

          <div className="mt-3.5 w-full bg-[#1b1c26] rounded-full h-1.5 overflow-hidden">
            <div className="h-full bg-amber-500 transition-all duration-1000" style={{ width: `${driftScore}%` }} />
          </div>
          <span className="text-[9px] text-slate-450 block mt-2 text-right">Click to inspect checksum states</span>
        </div>
      </div>

      {/* 3. Deep Score Explained Panel - Highly Detailed and Human-friendly */}
      <div className="p-6 bg-[#0d0e12] border border-[#1f212f] rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 text-slate-800 pointer-events-none font-mono text-[60px] opacity-10">LOGIC</div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-blue-500/15 rounded-lg border border-blue-500/25 flex items-center justify-center text-blue-400">
                <Info className="h-4 w-4" />
              </span>
              <h3 className="font-bold text-md text-white">{explainerObj.title} Analysis Explanation</h3>
            </div>
            
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal">
              {explainerObj.logic}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {explainerObj.factors.map((factor, i) => (
                <div key={i} className="p-3 bg-[#07080a] rounded-xl border border-[#1f212f] flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-medium">{factor.name}</span>
                  <span className="font-bold font-mono text-white">{factor.value} <span className="text-slate-400 text-[10px] font-normal">({factor.weight})</span></span>
                </div>
              ))}
            </div>
          </div>

          {/* Right column: Actionable recommendations */}
          <div className="lg:w-96 p-4 bg-[#07080a] border border-[#1f212f] rounded-xl space-y-3.5 shrink-0 text-left">
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#a855f7] block font-mono">PRIORITY RECOMMENDATIONS</span>
            
            <div className="space-y-3">
              {explainerObj.recommendations.map((rec, idx) => (
                <div key={idx} className="text-xs leading-relaxed flex items-start gap-2 text-slate-200 border-l-2 border-purple-500/40 pl-2.5">
                  <span className="font-bold text-[#c084fc] font-mono shrink-0">{idx+1}.</span>
                  <span className="font-sans">{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Active Provider Integrations & Security Incidents Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Integrations, Scans progress, AI proactive banner */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Gemini RAG Banner */}
          <div className="p-6 rounded-xl border border-blue-500/35 bg-[#0a1226] flex gap-4 transition-all duration-300 relative group overflow-hidden">
            <div className="bg-blue-950/60 text-blue-400 p-3.5 rounded-xl h-12 w-12 flex items-center justify-center shrink-0 border border-blue-500/30 shadow-lg">
              <Brain className="h-6 w-6" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                Generative AI Control Tower Assessment
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-600 text-white font-bold animate-pulse font-mono block">RAG INTERACTION</span>
              </h3>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                {criticalCount > 0 
                  ? `Scanner identified ${criticalCount} Critical vulnerabilities requiring direct resolution. An unattached database replica is idling costing an extra $150 montly. Ask the AI Cloud Architect block to compile instant remediation scripts.`
                  : "Scanning concluded safely. The cloud infrastructure bounds are balanced compliant. Pruning 3 unattached asset elements will yield up to $180 monthly runrate benefits."}
              </p>
              <button 
                onClick={() => setActiveTab('ai-advisor')} 
                className="pt-2 flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold group transition-colors cursor-pointer"
              >
                Launch AI Cloud Advisor <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform text-blue-400" />
              </button>
            </div>
          </div>

          {/* Active Provider Integrations Catalog */}
          <div className="p-6 bg-[#0d0e12] border border-[#1f212f] rounded-xl text-slate-100 font-sans">
            <div className="flex items-center justify-between border-b border-[#1f212f] pb-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Cloud className="h-5 w-5 text-slate-400" />
                Active Multi-Cloud Integrations
              </h3>
              <button 
                onClick={() => setActiveTab('settings')}
                className="text-xs text-blue-400 hover:text-blue-300 font-bold font-mono cursor-pointer"
              >
                Manage Cloud Connections
              </button>
            </div>

            <div className="divide-y divide-[#1f212f] mt-2">
              {accounts.map(acc => (
                <div key={acc.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-3.5 gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`px-2.5 py-1 rounded text-[10px] font-bold font-mono tracking-wider uppercase border ${
                      acc.provider === 'AWS' 
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/25' 
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/25'
                    }`}>
                      {acc.provider}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-bold text-white text-sm">{acc.name}</h4>
                      <p className="text-xs font-mono text-slate-300 block">
                        Role: {acc.arnRole ? acc.arnRole.substr(0, 32) + '...' : acc.serviceAccountEmail || 'Default Scoping'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-start gap-4">
                    <div className="text-right sm:block hidden text-slate-350 font-mono text-xs">
                      <p className="font-bold text-slate-150">{acc.resourcesCount} active items</p>
                      <p className="text-[10px] text-slate-400">Scan: {acc.lastScanned}</p>
                    </div>

                    <span className="flex items-center gap-2 text-xs bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-wider font-mono text-[9px] h-fit">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live verified
                    </span>
                  </div>
                </div>
              ))}

              {accounts.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-sm italic">
                  No accounts integrated. Go to Connection Center to run credentials setup.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Alerts break-up & Streams notifications */}
        <div className="space-y-6">
          {/* Severity Alerts break-down */}
          <div className="p-6 bg-[#0d0e12] border border-[#1f212f] rounded-xl text-slate-100 space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-[#1f212f] pb-3.5">
              <AlertTriangle className="h-5 w-5 text-rose-500" />
              Impactful Threat Flags
            </h3>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-rose-500/10 border border-rose-500/25 rounded-xl">
                <p className="text-3xl font-extrabold text-[#f43f5e] font-mono tracking-tight">{criticalCount}</p>
                <p className="text-[10px] text-slate-300 uppercase font-bold mt-1 tracking-wider">Critical</p>
              </div>
              <div className="p-4 bg-amber-500/10 border border-amber-500/25 rounded-xl">
                <p className="text-3xl font-extrabold text-[#f59e0b] font-mono tracking-tight">{highCount}</p>
                <p className="text-[10px] text-slate-300 uppercase font-bold mt-1 tracking-wider">High</p>
              </div>

              <div className="col-span-2 p-3 bg-[#07080a] border border-[#1f212f] rounded-xl flex items-center justify-between px-4 text-xs">
                <span className="text-slate-300 font-medium">Medium Severity Flaws</span>
                <span className="font-bold font-mono text-amber-400">{mediumCount}</span>
              </div>
              <div className="col-span-2 p-3 bg-[#07080a] border border-[#1f212f] rounded-xl flex items-center justify-between px-4 text-xs">
                <span className="text-slate-300 font-medium font-sans">Low Priority Items</span>
                <span className="font-bold font-mono text-blue-400">{lowCount}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('security')}
              className="mt-2 w-full py-2.5 bg-[#07080a] border border-[#1f212f] hover:border-slate-500 text-xs font-bold text-slate-200 rounded-lg transition-all cursor-pointer font-sans"
            >
              Examine Security Command Center
            </button>
          </div>

          {/* Incidents stream logs */}
          <div className="p-6 bg-[#0d0e12] border border-[#1f212f] rounded-xl text-slate-100 flex flex-col h-[280px]">
            <div className="flex items-center justify-between border-b border-[#1f212f] pb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 font-mono">Subnet Scans Stream</h3>
              <span className="text-[8px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-1.5 py-0.5 rounded font-mono font-bold uppercase tracking-wider block h-fit">LIVE</span>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-3.5 mt-4 pr-1 scrollbar-thin">
              {notifications.map(note => (
                <div key={note.id} className="flex gap-2.5 text-xs text-slate-200 border-l-2 pl-3 border-[#1f212f]">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-100 block">{note.title}</span>
                    <span className="text-slate-300 text-[11px] block leading-relaxed">{note.message}</span>
                    <span className="text-[10px] text-slate-400 font-mono block mt-1">{note.timestamp}</span>
                  </div>
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="py-12 text-center text-slate-400 text-xs font-mono italic">
                  No active subnet log notifications.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
