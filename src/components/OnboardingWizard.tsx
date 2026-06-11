import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  ArrowRight, 
  Activity, 
  CheckCircle, 
  Upload, 
  Key, 
  Lock, 
  RefreshCw 
} from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: (accounts: any[], resources: any[], findings: any[], drifts: any[]) => void;
  userEmail: string;
}

export function OnboardingWizard({ onComplete, userEmail }: OnboardingWizardProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [awsAccountName, setAwsAccountName] = useState<string>('AWS-Core-Enterprise-Production');
  const [awsArnRole, setAwsArnRole] = useState<string>('arn:aws:iam::885901239534:role/CloudGuardianReadOnlyAudit');
  const [awsExternalId, setAwsExternalId] = useState<string>('cg-external-39djd8a');
  const [awsRegion, setAwsRegion] = useState<string>('us-east-1');

  const [gcpProjectName, setGcpProjectName] = useState<string>('gcp-enterprise-scale-pci-dss');
  const [gcpServiceAccountEmail, setGcpServiceAccountEmail] = useState<string>('cloudguardian-scanner@gcp-enterprise-scale-pci-dss.iam.gserviceaccount.com');
  const [gcpRegion, setGcpRegion] = useState<string>('us-central1');

  const [validationState, setValidationState] = useState<'idle' | 'testing' | 'success'>('idle');
  const [scanningState, setScanningState] = useState<'idle' | 'running' | 'success'>('idle');
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scannedItemsCount, setScannedItemsCount] = useState<number>(0);

  // AWS and GCP mock validation
  const triggerValidation = () => {
    setValidationState('testing');
    setTimeout(() => {
      setValidationState('success');
    }, 1800);
  };

  const triggerFirstScan = () => {
    setScanningState('running');
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setScanProgress(progress);
      setScannedItemsCount(Math.floor((progress / 100) * 14));
      if (progress >= 100) {
        clearInterval(interval);
        setScanningState('success');
      }
    }, 120);
  };

  const completeOnboarding = () => {
    // Generate onboarding specific default accounts
    const onboardingAccounts = [
      {
        id: 'acc-aws-onb',
        name: awsAccountName,
        provider: 'AWS' as const,
        status: 'connected' as const,
        arnRole: awsArnRole,
        externalId: awsExternalId,
        lastScanned: new Date().toISOString().replace('T', ' ').substr(0, 16) + ' UTC',
        region: awsRegion,
        resourcesCount: 8
      },
      {
        id: 'acc-gcp-onb',
        name: gcpProjectName,
        provider: 'GCP' as const,
        status: 'connected' as const,
        serviceAccountEmail: gcpServiceAccountEmail,
        lastScanned: new Date().toISOString().replace('T', ' ').substr(0, 16) + ' UTC',
        region: gcpRegion,
        resourcesCount: 6
      }
    ];

    onComplete(onboardingAccounts, [], [], []); // Trigger initialization update in parent App state
  };

  return (
    <div id="setup-wizard-overlay" className="min-h-screen bg-[#07080a] text-slate-100 font-sans flex flex-col justify-between selection:bg-blue-600/30 selection:text-blue-250 py-6 relative overflow-hidden">
      {/* Deep dark backing layers */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff02_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Header bar */}
      <header className="max-w-5xl mx-auto w-full px-6 flex items-center justify-between relative z-10 text-left">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-lg font-bold flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-white tracking-tight text-sm">CloudGuardian <span className="text-blue-400">AI</span></h1>
            <span className="text-[8px] text-slate-500 font-mono font-bold uppercase tracking-wider block">INTELLIGENT ONBOARDING CONSOLE</span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-[#13151f] border border-[#1f212f] rounded-lg text-xs text-slate-400">
          <Lock className="h-3 w-3 text-emerald-400" />
          <span className="font-mono text-[10px] uppercase font-bold text-slate-300">{userEmail}</span>
        </div>
      </header>

      {/* Main wizard workspace */}
      <main className="max-w-3xl mx-auto w-full px-6 py-8 relative z-10 flex-1 flex flex-col justify-center">
        {/* Progress Tracker dots */}
        <div className="flex items-center justify-between max-w-lg mx-auto w-full mb-8">
          {[1, 2, 3, 4, 5].map((step) => (
            <React.Fragment key={step}>
              <div 
                className={`flex items-center justify-center rounded-full h-8 w-8 font-mono text-xs font-bold transition-all border duration-300 ${
                  currentStep === step
                    ? 'bg-blue-600 text-white border-blue-500 shadow-sm'
                    : currentStep > step
                    ? 'bg-emerald-950/40 text-emerald-400 border-emerald-900/50'
                    : 'bg-[#13151f] text-slate-500 border-[#1f212f]'
                }`}
              >
                {step}
              </div>
              {step < 5 && (
                <div 
                  className={`flex-1 h-[2px] mx-2 rounded transition-all duration-300 ${
                    currentStep > step ? 'bg-gradient-to-r from-emerald-500 to-blue-500' : 'bg-[#1f212f]'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Wizard step card */}
        <div className="bg-[#0d0e12] border border-[#1f212f] rounded-xl p-6 sm:p-8 shadow-sm relative min-h-[380px] flex flex-col justify-between">
          <AnimatePresence mode="wait">
            {/* STEP 1: CONNECT AWS */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 text-left"
              >
                <div>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/25 text-[9px] font-bold font-mono uppercase tracking-wider">AWS Integration</span>
                  <h2 className="text-xl sm:text-2xl font-bold mt-2 text-white">Trust handshake & connect AWS</h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    CloudGuardian scans metadata via read-only cross-account trust roles. We never read customer contents or passwords.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#07080a] border border-[#1f212f] rounded-lg p-4">
                  {/* Left guide details */}
                  <div className="space-y-3.5 text-xs">
                    <h3 className="font-bold text-slate-200">IAM User setup helper guide:</h3>
                    <ul className="space-y-2 text-slate-400 list-inside list-disc font-sans leading-relaxed">
                      <li>Go to your AWS Console &gt; <strong className="text-slate-300 font-semibold">IAM Roles</strong></li>
                      <li>Create role with <strong className="text-slate-300 font-semibold">SecurityAudit</strong> &amp; <strong className="text-slate-300 font-semibold">ReadOnlyAccess</strong> policies only</li>
                      <li>Mandate our cryptographic External ID value</li>
                      <li>Copy the generated Role ARN into the fields</li>
                    </ul>

                    <div className="p-3.5 bg-emerald-950/20 border border-emerald-900/40 rounded-lg text-[11px] text-slate-300 flex gap-2 leading-relaxed">
                      <Lock className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-emerald-400 block mb-0.5 font-bold">Is read-only safe?</strong>
                        Absolutely. Under strict Least-Privilege profiles, read-only permissions cannot edit, modify, generate costing spikes or delete infrastructure nodes.
                      </span>
                    </div>
                  </div>

                  {/* Inputs fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Aws target region</label>
                      <input 
                        type="text" 
                        value={awsRegion} 
                        onChange={(e) => setAwsRegion(e.target.value)} 
                        className="w-full bg-[#0d0e12] border border-[#1f212f] rounded px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Assigned Account Name</label>
                      <input 
                        type="text" 
                        value={awsAccountName} 
                        onChange={(e) => setAwsAccountName(e.target.value)} 
                        className="w-full bg-[#0d0e12] border border-[#1f212f] rounded px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">IAM Cross-Account Role ARN</label>
                      <input 
                        type="text" 
                        value={awsArnRole} 
                        onChange={(e) => setAwsArnRole(e.target.value)} 
                        className="w-full bg-[#0d0e12] border border-[#1f212f] rounded px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">AWS Required External ID</label>
                      <input 
                        type="text" 
                        value={awsExternalId}
                        readOnly 
                        className="w-full bg-[#0d0e12] border border-[#1f212f] rounded px-3 py-2 text-xs font-mono text-slate-500 select-all cursor-not-allowed" 
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: CONNECT GCP */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 text-left"
              >
                <div>
                  <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 text-[9px] font-bold font-mono uppercase tracking-wider">GCP Integration</span>
                  <h2 className="text-xl sm:text-2xl font-bold mt-2 text-white">Trust handshake & connect Google Cloud</h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Connect GCP via limited Service Accounts. CloudGuardian audits VPC gateways, firewall tables and blob bucket settings securely.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#07080a] border border-[#1f212f] rounded-lg p-4">
                  {/* Left guide details */}
                  <div className="space-y-3.5 text-xs">
                    <h3 className="font-bold text-slate-200">Viewer Credentials setup helper:</h3>
                    <ul className="space-y-2 text-slate-400 list-inside list-disc font-sans leading-relaxed">
                      <li>Go to GCP Console &gt; <strong className="text-slate-300 font-semibold">IAM &amp; Admin Service Accounts</strong></li>
                      <li>Provision scanning user, bind the read-only <strong className="text-slate-300 font-semibold">Viewer</strong> role scope</li>
                      <li>Generate a new private key formatted in JSON</li>
                      <li>Drop or Upload the .json file details into the file selector here</li>
                    </ul>

                    <div className="p-3.5 bg-blue-950/20 border border-blue-900/40 rounded-lg text-[11px] text-slate-300 flex gap-2 leading-relaxed">
                      <Lock className="h-4 w-4 text-blue-400 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-blue-405 text-blue-400 block mb-0.5 font-bold">Metadata scanning only</strong>
                        Your service JSON handles are securely salted and isolated on Cloud Run server-side; we never share raw tokens in public repositories.
                      </span>
                    </div>
                  </div>

                  {/* Inputs fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Gcp checking region</label>
                      <input 
                        type="text" 
                        value={gcpRegion} 
                        onChange={(e) => setGcpRegion(e.target.value)} 
                        className="w-full bg-[#0d0e12] border border-[#1f212f] rounded px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Display Project name</label>
                      <input 
                        type="text" 
                        value={gcpProjectName} 
                        onChange={(e) => setGcpProjectName(e.target.value)} 
                        className="w-full bg-[#0d0e12] border border-[#1f212f] rounded px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Service Account Email</label>
                      <input 
                        type="text" 
                        value={gcpServiceAccountEmail} 
                        onChange={(e) => setGcpServiceAccountEmail(e.target.value)} 
                        className="w-full bg-[#0d0e12] border border-[#1f212f] rounded px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">GCP private credentials key</label>
                      <div className="relative border border-dashed border-[#1f212f] bg-[#0d0e12] p-4 rounded-lg text-center cursor-pointer hover:bg-slate-900 transition-colors">
                        <Upload className="h-5 w-5 text-slate-400 mx-auto mb-1" />
                        <span className="text-[11px] font-semibold text-emerald-400 block">✓ enterprise-service-account-key.json matches</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: VALIDATE CREDENTIALS */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6 text-center py-6"
              >
                <div className="max-w-md mx-auto space-y-4">
                  <div className="p-3.5 bg-blue-500/10 border border-blue-500/25 rounded-full w-fit mx-auto text-blue-400">
                    <Key className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Validate connected credentials</h2>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      We handshake live cloud API endpoints using the designated role permissions to dry-run metadata retrievals safely.
                    </p>
                  </div>

                  {validationState === 'idle' && (
                    <button
                      onClick={triggerValidation}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 font-bold text-xs rounded-lg transition-all flex items-center gap-2 mx-auto cursor-pointer"
                    >
                      <RefreshCw className="h-4 w-4" /> Start validation test
                    </button>
                  )}

                  {validationState === 'testing' && (
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <Activity className="h-10 w-10 text-blue-500 animate-spin" />
                      </div>
                      <p className="text-xs font-mono text-slate-400 animate-pulse">Establishing IAM secure handshakes...</p>
                    </div>
                  )}

                  {validationState === 'success' && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }} 
                      className="space-y-4 bg-[#07080a] p-5 rounded-lg border border-[#1f212f] text-left"
                    >
                      <div className="flex items-center justify-between border-b border-[#1f212f] pb-2">
                        <span className="text-[10px] font-mono text-slate-400">PROVIDER TRUST CHECKPOINT</span>
                        <span className="text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded font-bold uppercase tracking-wider font-mono">VERIFIED</span>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-400">AWS Identity Access Status:</span>
                          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            SecurityAudit Live
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-slate-400">GCP Viewer Handshake Check:</span>
                          <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                            <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                            GServiceAccount Verified
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 4: RUN FIRST SCAN */}
            {currentStep === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 text-center py-6"
              >
                <div className="max-w-md mx-auto space-y-4">
                  <div className="p-3.5 bg-indigo-500/10 border border-indigo-500/25 rounded-full w-fit mx-auto text-indigo-400">
                    <Activity className={`h-6 w-6 ${scanningState === 'running' ? 'animate-spin' : ''}`} />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Execute initial discovery scan</h2>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Now that secure read-only roles are locked in, run the initial inventory scanner. We scan network subnets, open port groups, state drift anomalies, and unused disk pools.
                    </p>
                  </div>

                  {scanningState === 'idle' && (
                    <button
                      onClick={triggerFirstScan}
                      className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 font-bold text-xs rounded-lg transition-all flex items-center gap-2 mx-auto cursor-pointer"
                    >
                      <Activity className="h-4 w-4" /> Execute discovery scan
                    </button>
                  )}

                  {scanningState === 'running' && (
                    <div className="space-y-4">
                      <div className="w-full bg-[#07080a] rounded-full h-2 overflow-hidden max-w-xs mx-auto border border-[#1f212f]">
                        <div className="bg-indigo-500 h-full transition-all duration-150" style={{ width: `${scanProgress}%` }} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-mono text-slate-300">{scanProgress}% Discovery completed</p>
                        <p className="text-[10px] font-mono text-slate-550 text-slate-400">Checking subnet security groups & S3 configurations. Assets detected: {scannedItemsCount}...</p>
                      </div>
                    </div>
                  )}

                  {scanningState === 'success' && (
                    <motion.div 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      className="space-y-4 bg-[#07080a] p-5 rounded-lg border border-[#1f212f] text-left"
                    >
                      <div className="flex items-center justify-between border-b border-[#1f212f] pb-2">
                        <span className="text-[10px] font-mono text-slate-450">DISCOVERY ASSESSMENT FINISHED</span>
                        <span className="text-[9px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/25 px-2 py-0.5 rounded font-bold uppercase tracking-wider font-mono">COMPLETE</span>
                      </div>
                      <div className="space-y-3 font-mono">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Total Cloud Assets Cataloged:</span>
                          <span className="text-white font-bold font-mono">14 Elements</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Security Ingress Vulnerabilities:</span>
                          <span className="text-rose-450 text-rose-400 font-bold font-mono">4 Findings</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Cost Containment Leakages Found:</span>
                          <span className="text-purple-400 font-bold font-mono">3 Issues (savings $288/mo)</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">Cryptographic Terraform Drift:</span>
                          <span className="text-amber-500 font-bold font-mono">4 Differences</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* STEP 5: ONBOARDING REVIEW FINDINGS */}
            {currentStep === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6 text-center"
              >
                <div className="space-y-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[9px] font-bold font-mono uppercase tracking-wider">Onboarding Finished</span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white font-sans tracking-tight">Your cloud cockpit is primed</h2>
                  <p className="text-xs sm:text-sm text-slate-400 leading-normal max-w-lg mx-auto">
                    We synchronized your connected infrastructure maps safely. Welcome to your Principal Cloud Security and Drift control cockpit. Let's start the workspace!
                  </p>
                </div>

                {/* Micro indicators bento preview cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-[#07080a] border border-[#1f212f] rounded-lg space-y-1">
                    <span className="text-[9px] uppercase font-bold text-slate-450 block">Health Baseline</span>
                    <span className="text-lg font-bold font-mono text-emerald-400">68%</span>
                    <span className="text-[10px] text-slate-400 block mt-1">Needs hardening optimizer</span>
                  </div>
                  <div className="p-4 bg-[#07080a] border border-[#1f212f] rounded-lg space-y-1">
                    <span className="text-[9px] uppercase font-bold text-slate-450 block">Identified Leaks</span>
                    <span className="text-lg font-bold font-mono text-rose-450 text-rose-400">8 Findings</span>
                    <span className="text-[10px] text-slate-400 block mt-1">4 Critical / High severe threats</span>
                  </div>
                  <div className="p-4 bg-[#07080a] border border-[#1f212f] rounded-lg space-y-1">
                    <span className="text-[9px] uppercase font-bold text-slate-450 block">Monthly Savings</span>
                    <span className="text-lg font-bold font-mono text-purple-400">$288.00</span>
                    <span className="text-[10px] text-slate-400 block mt-1">Idle hosts & storage replicas</span>
                  </div>
                </div>

                {/* Compliances */}
                <div className="max-w-md mx-auto py-3 bg-[#07080a] border border-[#1f212f] rounded-lg px-4 flex items-center justify-between text-xs text-slate-400">
                  <span>Continuous threat guard:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1.5 uppercase text-[9px] font-mono">
                    <CheckCircle className="h-3.5 w-3.5" /> SOC 2 / ISO 27001 ACTIVE
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons footer inside card */}
          <div className="flex justify-between items-center border-t border-[#1f212f] pt-4 mt-6">
            <button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className={`px-4 py-2 text-xs font-semibold rounded-lg border border-[#1f212f] hover:bg-[#13151f] text-slate-400 hover:text-white transition-all cursor-pointer ${
                currentStep === 1 ? 'opacity-30 cursor-not-allowed' : ''
              }`}
            >
              Previous Setups
            </button>

            {currentStep < 5 ? (
              <button
                onClick={() => {
                  if (currentStep === 3 && validationState !== 'success') {
                    // Force complete validation first
                    triggerValidation();
                    setTimeout(() => setCurrentStep(4), 1800);
                  } else if (currentStep === 4 && scanningState !== 'success') {
                    // Force run scan first
                    triggerFirstScan();
                    setTimeout(() => setCurrentStep(5), 3000);
                  } else {
                    setCurrentStep(prev => prev + 1);
                  }
                }}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1 cursor-pointer transition-all active:scale-98"
              >
                <span>Continue</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </button>
            ) : (
              <button
                onClick={completeOnboarding}
                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 text-white font-extrabold text-xs rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer transition-all duration-300"
              >
                <span>Enter CloudGuardian Dashboard</span>
                <ArrowRight className="h-4.5 w-4.5" />
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Trust guarantees footer info */}
      <footer className="relative z-10 max-w-lg mx-auto text-center space-y-2 mt-4 px-6 text-slate-500 text-[10px]">
        <div className="flex justify-center gap-4 text-slate-400 font-mono">
          <span>SOC 2 Compliance Guard</span>
          <span>&bull;</span>
          <span>End-to-End Encryption Salt</span>
          <span>&bull;</span>
          <span>ISO 27001 Certified Processing</span>
        </div>
        <p className="leading-snug">
          Secure tokens stay inside GCP salt containers; CloudGuardian AI does not have write, create or delete infrastructure modifiers.
        </p>
      </footer>
    </div>
  );
}
