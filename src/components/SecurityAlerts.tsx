import React, { useState } from 'react';
import { 
  Shield, 
  AlertOctagon, 
  AlertTriangle, 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  FileText, 
  Play, 
  Info,
  ExternalLink,
  ChevronRight,
  BookOpen,
  Zap,
  Target
} from 'lucide-react';
import { Finding } from '../types';

interface SecurityAlertsProps {
  findings: Finding[];
  onResolveFinding: (findingId: string) => Promise<void>;
  isBeginnerMode?: boolean;
}

export function SecurityAlerts({
  findings,
  onResolveFinding,
  isBeginnerMode = true
}: SecurityAlertsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFindingId, setSelectedFindingId] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState<string | null>(null);
  const [remediatingId, setRemediatingId] = useState<string | null>(null);

  // Group findings into categories: security, cost, drift, reliability, compliance
  const activeFindings = findings.filter((f) => {
    if (selectedCategory === 'all') return f.category === 'security'; // default to security center
    return f.category === selectedCategory;
  });

  const getSeverityBadge = (sev: string) => {
    switch (sev) {
      case 'critical':
        return <span className="bg-rose-500/10 text-rose-450 text-rose-400 border border-rose-500/20 text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">Critical Impact</span>;
      case 'high':
        return <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">High Risk</span>;
      case 'medium':
        return <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">Medium Warn</span>;
      default:
        return <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] px-2 py-0.5 rounded font-mono font-bold uppercase tracking-wider">Low Advisory</span>;
    }
  };

  const handleRemediate = async (id: string) => {
    setRemediatingId(id);
    setTimeout(async () => {
      await onResolveFinding(id);
      setRemediatingId(null);
    }, 1200);
  };

  // Educational content mappings for explainable AI security items (Professional Mode)
  const educationalContext = {
    'f-sec-01': {
      whyItMatters: "Exposing standard administrative ports (such as SSH Port 22 or RDP Port 3389) allows automated scripts on the internet to launch persistent brute-force attacks, scanner probes, and password-stuffing attacks. It represents an unnecessary increase in the external attack surface.",
      howExploited: "An attacker scans public CIDR blocks looking for open ingress listeners on port 22. Once located, they coordinate distributed credential stuffing engines or exploit known remote code execution vulnerabilities in old SSH service version utilities.",
      attackSurface: "Public Internet Ingress (0.0.0.0/0)",
      riskLevel: "High - Remote Terminal Acquisition",
      effort: "Low - ~3 Mins via CLI",
      remediationGuide: "Modify the Security Group or Firewall Rule ingress configuration. Revoke rule allows from 0.0.0.0/0, replace with a secure Corporate bastion VPN block or employ AWS Systems Manager (SSM) Host terminal session channels."
    },
    'f-sec-02': {
      whyItMatters: "Static S3 storage buckets containing code assets or build bundles should never allow unencrypted anonymous guest access. It leaks production source variables, static keys, or internal workflows, exposing the SaaS code pipeline directly.",
      howExploited: "Attackers scour DNS records and run automated directory enumeration tools on s3.amazonaws.com buckets to extract database coordinates, private env templates, or unhashed sensitive receipts.",
      attackSurface: "Global anonymous REST APIs",
      riskLevel: "High - Full Data Exposure",
      effort: "Medium - ~10 Mins console lock",
      remediationGuide: "Navigate to the designated bucket parameters, toggle the 'Block all public access' settings button to true, and enable SSE-S3 AES-256 Default Server-Side encryption keys."
    },
    'f-sec-03': {
      whyItMatters: "Developer identities with administrator access roles bypassed standard segregation rules. In the event of a laptop compromise or credentials leakage, broad access permissions allow attackers to hijack the physical multi-cloud root nodes completely.",
      howExploited: "If a developer mistakenly leaks their IAM access secret inside code repositories, automated scrapers fetch and exploit the credential within minutes to spawn expensive GPU cryptominers or delete databases.",
      attackSurface: "AWS IAM Control API Boundary",
      riskLevel: "Critical - Total Cloud Hijack",
      effort: "High - Required IAM policies tuning",
      remediationGuide: "Scan active developer workflows using CloudGuardian IAM Analyzer, restrict asterisk (*) admin configurations down to scoped S3 or EC2 elements, and enforce mandatory Multi-Factor Authentication (MFA)."
    },
    'f-sec-04': {
      whyItMatters: "Providing google storage bucket anonymous 'allUsers' read bounds allows anyone on the internet to list, download, and scrape customer receipts directories containing credit balances, PII details, or compliance-restricted records.",
      howExploited: "Simple Google search hooks or storage bucket lists find gs:// directories public assets, gathering PDF invoices with direct target links to leverage downstream social engineering hijackings.",
      attackSurface: "Public Google Cloud API bucket URL",
      riskLevel: "Extreme - Privacy Regulation Infraction",
      effort: "Low - 1 CLI command lock",
      remediationGuide: "Enforce GCP Uniform Bucket-Level Access, delete any allUsers roles inside IAM policies, and configure access via Signed URLs if files must be transiently exposed to customers."
    }
  };

  // Educational content mappings for explainable AI security items (Beginner Mode)
  const educationalContextBeginner = {
    'f-sec-01': {
      whyItMatters: "Port 22 is an entry door used by developers to log into servers (SSH). Leaving it open to the entire internet (0.0.0.0/0) is like leaving your home's front door wide open on a busy street. Automated internet bots will constantly try to guess your logins.",
      howExploited: "Harmless-looking software scan programs search the entire web for servers with open port 22 access. Once they find yours, they use dictionary-guessing tools to try thousands of default passwords to gain control.",
      attackSurface: "Open Entry Port (Universal Access)",
      riskLevel: "High risk of server break-in",
      effort: "Extremely easy - ~1 minute setup patch",
      remediationGuide: "Modify the server's firewall group rules to restrict port 22 access to either your personal IP address or shut down public access entirely and use secure cloud connection systems."
    },
    'f-sec-02': {
      whyItMatters: "S3 Buckets are cloud folders where your application stores its static files. Making static asset files public to everyone on the internet means anyone can read or edit your source code, private configs, or user documents without checking passwords.",
      howExploited: "Malicious programs search the internet for publicly accessible AWS folders. Once discovered, they download the contents to find private database keys, passwords, or confidential records.",
      attackSurface: "Unlocked storage folder (Public Guest Access)",
      riskLevel: "High risk of folder leakage",
      effort: "Easy - ~2 minute checkbox toggle",
      remediationGuide: "Navigate to your bucket dashboard parameters, check 'Block all public access' to make it completely private, and enable 'Default Encryption' to automatically scramble stored files."
    },
    'f-sec-03': {
      whyItMatters: "Broad Administrator access is like giving someone the master key to a whole building instead of just the front door. If a developer's access key is accidentally leaked, the hacker gets complete full access to clean out all systems.",
      howExploited: "If developers push their security keys into Github by accident, robotic bots crawl Github within seconds, steal the credentials, and spin up expensive cryptocurrency setups that cost you thousands.",
      attackSurface: "Cloud Administrative Access (IAM Control)",
      riskLevel: "Critical risk of total cloud takeover",
      effort: "Intermediate - needs setting clean permissions rules",
      remediationGuide: "Remove the asterisk (*) wildcard admin access from identity roles. Create specific scoped permissions templates and enforce mandatory multi-factor authentication (MFA) tokens on login."
    },
    'f-sec-04': {
      whyItMatters: "Public access to customer receipt folders is a major privacy violation. A Google Cloud bucket with 'allUsers' guest rule means anyone on the web can list and download customer bills, containing purchase amounts, company names, or emails.",
      howExploited: "An attacker types the public bucket address search term in Web Search or uses scanning scripts to fetch all PDF receipts to perform target scam emails or identity thefts.",
      attackSurface: "Public folder (Unchecked Guest Access)",
      riskLevel: "Critical risk of legal privacy breach",
      effort: "Low effort - ~1 minute rule deletion",
      remediationGuide: "Turn on 'Uniform access controls' in the GCP Console options, delete the 'allUsers' guest row, and use brief 'Signed URLs' to let authorized buyers access receipts transitively."
    }
  };

  const getContextForFinding = (id: string) => {
    const activeContext = isBeginnerMode ? educationalContextBeginner : educationalContext;
    return activeContext[id] || {
      whyItMatters: isBeginnerMode 
        ? "Leaving security configurations too broad is like neglecting to lock your doors. It allows internet automated search tools to find your databases and probe for passwords."
        : "Providing overprivileged or unencrypted configurations exposes background infrastructure endpoints to brute force scanners, risking sensitive operational leakages.",
      howExploited: isBeginnerMode
        ? "Automated scanners search the entire web looking for active open ports and unencrypted database buckets to attack."
        : "Attackers utilize public discovery scanning toolsets to map unprotected subnets and open firewall doors.",
      attackSurface: isBeginnerMode ? "Exposed Cloud Component" : "Restricted Multi-cloud subnets",
      riskLevel: isBeginnerMode ? "Exposure Hazard" : "Medium - General Vulnerability",
      effort: isBeginnerMode ? "Quick setting change" : "Medium - Requires configuration change",
      remediationGuide: isBeginnerMode
        ? "Restrict open firewalls, make database folders private, and use AWS Systems Manager channels to connect safely."
        : "Secure access controls, enable default encryption rules, and restrict ingress ranges to authorized corporate VPN blocks."
    };
  };

  const exportReport = (format: 'pdf' | 'csv') => {
    setIsExporting(format);
    setTimeout(() => {
      const reportHeaders = ['ID', 'Category', 'Severity', 'Resource', 'Title', 'Remediation', 'Status'];
      const rawCSVRows = activeFindings.map(f => [
        f.id,
        f.category,
        f.severity.toUpperCase(),
        f.resourceName || f.resourceId || 'Global',
        f.title.replace(/,/g, ' '),
        f.remediation.replace(/,/g, ' '),
        f.status
      ]);

      const csvContent = "data:text/csv;charset=utf-8," 
        + [reportHeaders.join(','), ...rawCSVRows.map(e => e.join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `CloudGuardian_${selectedCategory}_Report_${Date.now()}.${format === 'pdf' ? 'txt' : 'csv'}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(null);
    }, 800);
  };

  return (
    <div id="security-command-center" className="space-y-6 text-slate-100">
      
      {/* Top Professional Control bar banner (Datadog/Vercel Aesthetic) */}
      <div className="p-6 bg-[#0d0e12] border border-[#1f212f] rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Shield className="h-5.5 w-5.5 text-blue-400" />
            Security Command Center
          </h2>
          <p className="text-xs text-slate-300">
            Detecting public cloud storage buckets, open SSH management terminals, overprivileged developer roles, and insecure firewall rules.
          </p>
        </div>

        {/* PDF/CSV Exporter tools */}
        <div className="flex gap-2.5">
          <button
            onClick={() => exportReport('csv')}
            disabled={isExporting !== null}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#07080a] border border-[#1f212f] hover:border-slate-500 hover:bg-[#151622] rounded-lg text-xs font-bold text-slate-200 cursor-pointer transition-all"
          >
            <Download className="h-3.5 w-3.5 text-slate-400" />
            {isExporting === 'csv' ? 'Compiling CSV...' : 'Export CSV'}
          </button>
          
          <button
            onClick={() => exportReport('pdf')}
            disabled={isExporting !== null}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#07080a] border border-[#1f212f] hover:border-slate-500 hover:bg-[#151622] rounded-lg text-xs font-bold text-slate-200 cursor-pointer transition-all"
          >
            <FileText className="h-3.5 w-3.5 text-slate-400" />
            {isExporting === 'pdf' ? 'Compiling PDF...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Beginner Welcome/Onboarding Educational Guidance Block */}
      {isBeginnerMode && (
        <div id="beginner-sec-hub" className="bg-[#0b101c] border border-blue-500/40 p-5 rounded-xl shadow-lg flex flex-col gap-4 relative overflow-hidden">
          <div className="space-y-1.5 text-left">
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono rounded font-bold uppercase tracking-wider">
              🎓 SECURITY LEARNING ASSISTANT
            </span>
            <h3 className="text-base font-bold text-white">How to Read and Fix Security Alerts</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="space-y-1">
                <strong className="text-blue-400 font-mono block">1. WHAT ARE THESE?</strong>
                <p className="text-slate-200 leading-relaxed font-normal">
                  These are security vulnerabilities (called Findings) discovered in your real active systems. We point out dangerous unencrypted buckets and open firewalls.
                </p>
              </div>
              <div className="space-y-1">
                <strong className="text-[#a855f7] font-mono block">2. WHY DO THEY MATTER?</strong>
                <p className="text-slate-200 leading-relaxed font-normal">
                  Unsecured configurations are like leaving your keys outdoors. Automated scrapers can fetch credentials, steal data, or launch miners instantly.
                </p>
              </div>
              <div className="space-y-1">
                <strong className="text-emerald-400 font-mono block font-semibold">3. WHAT TO DO NEXT?</strong>
                <p className="text-slate-200 leading-relaxed font-normal">
                  Simply select any finding on the left list, read our explainers, and hit the blue <strong className="text-blue-400">"Run Auto Remediation"</strong> button to patch the cloud!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Categories Tab Selector */}
        <div className="flex bg-[#0d0e12] p-1 rounded-lg border border-[#1f212f] max-w-sm">
          {[
            { key: 'all', label: 'Security Center' },
            { key: 'cost', label: 'Cost Audits' },
            { key: 'drift', label: 'Drifts' }
          ].map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setSelectedCategory(tab.key);
                setSelectedFindingId(null);
              }}
              className={`px-4 py-1.5 rounded-md text-xs font-bold cursor-pointer transition-all ${
                (selectedCategory === tab.key || (selectedCategory === 'all' && tab.key === 'all'))
                  ? 'bg-blue-600 text-white font-extrabold shadow'
                  : 'text-slate-400 hover:text-white font-medium'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Micro statistics check details */}
        <div className="flex items-center gap-3 text-xs text-slate-350 font-mono">
          <span>Active counts:</span>
          <span className="px-2.5 py-1 bg-rose-500/15 text-rose-450 text-rose-400 border border-rose-500/35 rounded font-bold">
            {findings.filter(f => f.severity === 'critical' && f.status === 'active').length} Critical flags
          </span>
          <span className="px-2.5 py-1 bg-amber-500/15 text-amber-450 text-amber-400 border border-amber-500/35 rounded font-bold">
            {findings.filter(f => f.severity === 'high' && f.status === 'active').length} High risk
          </span>
        </div>
      </div>

      {/* Main split display: left items list, right deep dive explainable details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col (List of Findings) */}
        <div className="lg:col-span-7 space-y-3">
          {activeFindings.map((finding) => (
            <div
              key={finding.id}
              onClick={() => setSelectedFindingId(finding.id)}
              className={`p-5 rounded-xl border transition-all cursor-pointer relative ${
                selectedFindingId === finding.id 
                  ? 'bg-[#121522] border-blue-500/60 shadow-md ring-1 ring-blue-500/30' 
                  : finding.status === 'resolved'
                  ? 'bg-[#07080a] border-[#1f212f] opacity-60'
                  : 'bg-[#0d0e12] border-[#1f212f] hover:border-slate-700 hover:bg-[#13151f]'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="mt-1">
                  {finding.severity === 'critical' ? (
                    <AlertOctagon className="h-5 w-5 text-rose-500 animate-pulse" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-400" />
                  )}
                </div>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getSeverityBadge(finding.severity)}
                    <span className="bg-[#151622] border border-[#23253b] px-2 py-0.5 rounded text-[9px] font-mono font-bold text-slate-350 uppercase">{finding.provider}</span>
                    <span className="text-[9px] text-slate-400 font-mono font-bold uppercase">{finding.id}</span>
                    {finding.status === 'resolved' && (
                      <span className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded text-[9px] font-bold flex items-center gap-1 font-mono uppercase">✓ Fixed</span>
                    )}
                  </div>

                  <h3 className="font-bold text-white text-sm tracking-tight">{finding.title}</h3>
                  <p className="text-slate-300 text-xs line-clamp-1">{finding.description}</p>
                </div>

                <ChevronRight className={`h-4.5 w-4.5 text-slate-500 transition-transform ${selectedFindingId === finding.id ? 'rotate-90 text-blue-400' : ''}`} />
              </div>
            </div>
          ))}

          {activeFindings.length === 0 && (
            <div className="py-12 text-center bg-[#0d0e12] rounded-xl border border-dashed border-[#1f212f] text-slate-450">
              <ShieldCheck className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
              Scanning checks reports everything clean or verified resolved.
            </div>
          )}
        </div>

        {/* Right Col (Explainable AI side-panel Details dashboard) */}
        <div className="lg:col-span-5">
          {selectedFindingId ? (
            (() => {
              const findingObj = findings.find(f => f.id === selectedFindingId);
              if (!findingObj) return null;
              const detailsObj = getContextForFinding(selectedFindingId);

              return (
                <div className="p-6 bg-[#0d0e12] border border-[#1f212f] rounded-xl space-y-6 relative">
                  <div>
                    <span className="text-[10px] font-bold uppercase font-mono text-blue-400 block tracking-widest leading-none">RISK ASSESSMENT SHEETS</span>
                    <h3 className="font-extrabold text-white text-base mt-2">{findingObj.title}</h3>
                    <p className="text-slate-300 text-sm mt-1.5 leading-relaxed font-sans">{findingObj.description}</p>
                  </div>

                  {/* High level attack surface metrics summary */}
                  <div className="grid grid-cols-2 gap-3 p-3 bg-[#07080a] border border-[#1f212f] rounded-xl text-xs font-sans">
                    <div className="space-y-0.5">
                      <span className="text-slate-400 text-[10px] font-mono uppercase">Attack surface</span>
                      <p className="font-bold text-white leading-normal">{detailsObj.attackSurface}</p>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-slate-400 text-[10px] font-mono uppercase">Risk evaluation</span>
                      <p className="font-bold text-white leading-normal">{detailsObj.riskLevel}</p>
                    </div>
                    <div className="space-y-0.5 border-t border-[#1f212f] pt-2 mt-2 col-span-2 flex justify-between pr-4 items-center">
                      <span className="text-slate-400 text-[10px] font-mono uppercase">Remediation Effort</span>
                      <p className="font-bold text-blue-400 font-mono">{detailsObj.effort}</p>
                    </div>
                  </div>

                  {/* Attacker Exploit logic panels (Educational Context) */}
                  <div className="space-y-4">
                    <div className="space-y-1.5 p-1">
                      <span className="text-[10px] font-bold font-mono text-rose-400 flex items-center gap-1 uppercase">
                        <BookOpen className="h-3.5 w-3.5 text-rose-450" /> Why this matters
                      </span>
                      <p className="text-slate-200 text-xs leading-relaxed font-normal">{detailsObj.whyItMatters}</p>
                    </div>

                    <div className="p-3.5 bg-rose-950/15 border border-rose-900/30 rounded-lg space-y-1.5 text-left">
                      <span className="text-[10px] font-bold font-mono text-rose-400 uppercase tracking-wide flex items-center gap-1">
                        <Target className="h-3.5 w-3.5" /> How attackers exploit this
                      </span>
                      <p className="text-slate-300 text-[11px] leading-relaxed font-sans font-normal">{detailsObj.howExploited}</p>
                    </div>
                  </div>

                  {/* Recommended fixes guide */}
                  <div className="p-4 bg-emerald-950/15 border border-emerald-900/35 rounded-lg space-y-2 text-left">
                    <div className="flex items-center gap-1.5">
                      <span className="p-1 bg-emerald-500/20 text-emerald-400 rounded-md border border-emerald-500/30">
                        <Zap className="h-3.5 w-3.5" />
                      </span>
                      <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">Remediation action guide</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-normal">{detailsObj.remediationGuide}</p>
                  </div>

                  {/* Interactive Remediation Execution Action Button */}
                  <div className="border-t border-[#1f212f] pt-4 flex items-center justify-between gap-4">
                    <div className="text-left font-mono">
                      <span className="text-[9px] text-zinc-500 uppercase block font-mono">Source Element</span>
                      <span className="text-xs text-white font-semibold block uppercase">{findingObj.resourceName || 'Global Rule'}</span>
                    </div>

                    {findingObj.status === 'active' ? (
                      <button
                        onClick={() => handleRemediate(findingObj.id)}
                        disabled={remediatingId !== null}
                        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg select-none transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-97"
                      >
                        <Play className={`h-3 w-3 ${remediatingId === findingObj.id ? 'animate-spin' : ''}`} />
                        {remediatingId === findingObj.id ? 'Executing Hotfix...' : 'Run Auto Remediation'}
                      </button>
                    ) : (
                      <span className="px-3.5 py-1.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-bold text-xs rounded-lg font-mono uppercase">
                        ✓ remediated safely
                      </span>
                    )}
                  </div>
                </div>
              );
            })()
          ) : (
            <div className="p-12 text-center bg-[#0d0e12] rounded-xl border border-dashed border-[#1f212f] text-slate-400 space-y-2">
              <Info className="h-7 w-7 text-slate-500 mx-auto" />
              <p className="text-xs">Click any security anomaly on the left catalog folder to inspect extreme detailed threats vector calculations and click-to-remediate actions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
