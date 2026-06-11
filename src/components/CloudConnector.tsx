import React, { useState } from 'react';
import { 
  Cloud, 
  Shield, 
  Upload, 
  CheckCircle, 
  Trash2, 
  Key, 
  Info,
  RefreshCw
} from 'lucide-react';
import { CloudAccount } from '../types';

interface CloudConnectorProps {
  accounts: CloudAccount[];
  onConnectAccount: (accountPayload: any) => Promise<void>;
  onDisconnectAccount: (accountId: string) => Promise<void>;
}

export function CloudConnector({
  accounts,
  onConnectAccount,
  onDisconnectAccount
}: CloudConnectorProps) {
  const [provider, setProvider] = useState<'AWS' | 'GCP'>('AWS');
  const [name, setName] = useState('');
  const [region, setRegion] = useState('');
  // AWS Fields
  const [arnRole, setArnRole] = useState('arn:aws:iam::123456789012:role/CloudGuardianReadOnlyAudit');
  const [externalId, setExternalId] = useState('cg-ext-3902dfa');
  // GCP Fields
  const [serviceAccountEmail, setServiceAccountEmail] = useState('');
  const [gcpJsonContent, setGcpJsonContent] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        setGcpJsonContent(text);
        if (parsed.client_email) {
          setServiceAccountEmail(parsed.client_email);
        }
      } catch (err) {
        setErrorMessage('Invalid service account key JSON schema.');
      }
    };
    reader.readAsText(file);
  };

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!name.trim()) {
      setErrorMessage('A connection handle name description is required.');
      return;
    }

    setIsVerifying(true);
    setTimeout(async () => {
      try {
        const payload = provider === 'AWS' 
          ? { provider, name, region, arnRole, externalId }
          : { provider, name, region, serviceAccountEmail, serviceAccountJson: gcpJsonContent };

        await onConnectAccount(payload);
        // Reset
        setName('');
        setGcpJsonContent('');
        setServiceAccountEmail('');
        setIsVerifying(false);
      } catch (error: any) {
        setErrorMessage('Credential handshaking failed. Please verify cross-account trusts.');
        setIsVerifying(false);
      }
    }, 1200);
  };

  return (
    <div id="cloud-connector-module" className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-slate-100 font-sans">
      
      {/* Credentials submission side sheet (Col Span 5) */}
      <div className="bg-[#0d0e12] border border-[#1f212f] p-6 rounded-xl h-fit space-y-6 lg:col-span-5 shadow-sm">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Key className="h-5.5 w-5.5 text-blue-400" />
            Integrate Cloud Environment
          </h2>
          <p className="text-xs text-slate-450 mt-1">
            Link read-only role scopes to scan vulnerabilities and infrastructure drifts instantly.
          </p>
        </div>

        {/* AWS / GCP Selector tabs */}
        <div className="grid grid-cols-2 bg-[#07080a] p-1 rounded-lg border border-[#1f212f]">
          <button
            type="button"
            onClick={() => { setProvider('AWS'); setRegion('us-east-1'); }}
            className={`py-2 rounded-md font-bold text-xs transition-with-duration cursor-pointer ${
              provider === 'AWS' 
                ? 'bg-blue-600 text-white font-extrabold shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            AWS IAM Role
          </button>
          
          <button
            type="button"
            onClick={() => { setProvider('GCP'); setRegion('us-central1'); }}
            className={`py-2 rounded-md font-bold text-xs transition-with-duration cursor-pointer ${
              provider === 'GCP' 
                ? 'bg-blue-600 text-white font-extrabold shadow' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            GCP Service Key
          </button>
        </div>

        <form onSubmit={handleConnect} className="space-y-4 text-left">
          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-405 text-slate-400 mb-1 tracking-wider">
              Connection Display Name
            </label>
            <input
              type="text"
              required
              placeholder={provider === 'AWS' ? 'e.g., aws-devstack-core' : 'e.g., gcp-prodscale-vpc'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#07080a] border border-[#1f212f] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 placeholder-slate-500"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">
              Active scan region
            </label>
            <input
              type="text"
              required
              placeholder={provider === 'AWS' ? 'us-east-1' : 'us-central1'}
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full bg-[#07080a] border border-[#1f212f] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 placeholder-slate-500"
            />
          </div>

          {provider === 'AWS' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">
                  Cross-Account IAM Role ARN
                </label>
                <input
                  type="text"
                  required
                  value={arnRole}
                  onChange={(e) => setArnRole(e.target.value)}
                  className="w-full bg-[#07080a] border border-[#1f212f] rounded-lg px-3.5 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">
                  Cryptographic External ID
                </label>
                <input
                  type="text"
                  required
                  value={externalId}
                  onChange={(e) => setExternalId(e.target.value)}
                  className="w-full bg-[#07080a] border border-[#1f212f] rounded-lg px-3.5 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="bg-[#07080a] p-3.5 rounded-lg border border-[#1f212f] text-[10.5px] text-slate-300 leading-normal flex gap-2">
                <Info className="h-4.5 w-4.5 text-blue-450 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  Provide permissions equivalent to <strong className="text-white font-bold">SecurityAudit</strong> policies in AWS. ReadOnlyAccess does not write or delete resources.
                </span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">
                  Service Account Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g., scanner@prodscale-infra.iam.gserviceaccount.com"
                  value={serviceAccountEmail}
                  onChange={(e) => setServiceAccountEmail(e.target.value)}
                  className="w-full bg-[#07080a] border border-[#1f212f] rounded-lg px-3.5 py-2 text-xs text-white focus:outline-none focus:border-blue-500 placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 tracking-wider">
                  GCP private credentials file
                </label>
                <div className="relative border-2 border-dashed border-[#1f212f] bg-[#07080a] rounded-lg p-4 text-center hover:bg-[#13151f] transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Upload className="h-5 w-5 text-slate-500 mx-auto mb-1.5" />
                  <span className="text-[11px] text-slate-300 block font-semibold">
                    {gcpJsonContent ? 'JSON key loaded successfully ✓' : 'Drag or Upload service-key.json'}
                  </span>
                </div>
              </div>

              <div className="bg-[#07080a] p-3.5 rounded-lg border border-[#1f212f] text-[10.5px] text-slate-350 leading-normal flex gap-2">
                <Info className="h-4.5 w-4.5 text-blue-400 shrink-0 mt-0.5" />
                <span>
                  Configure the Service Account with the <strong className="text-white font-bold">Viewer</strong> role within your GCP projects directory.
                </span>
              </div>
            </div>
          )}

          {errorMessage && (
            <p className="text-xs text-rose-400 font-semibold bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isVerifying}
            className={`w-full py-2.5 rounded-lg font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              isVerifying 
                ? 'bg-slate-900 text-slate-400 border border-[#1f212f] cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow shadow-blue-500/10 active:scale-98'
            }`}
          >
            {isVerifying && <RefreshCw className="h-3.5 w-3.5 animate-spin text-blue-400" />}
            {isVerifying ? 'Handshaking cloud subnetworks...' : 'Authorize Cloud Connection'}
          </button>
        </form>
      </div>

      {/* Connected Channels directory list (Col Span 7) */}
      <div className="bg-[#0d0e12] border border-[#1f212f] p-6 rounded-xl lg:col-span-7 space-y-6 shadow-sm">
        <div className="text-left">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Cloud className="h-5.5 w-5.5 text-slate-400" />
            Connected Credentials
          </h2>
          <p className="text-xs text-slate-450 mt-1">
            Active cross-account connections authenticated across subnets.
          </p>
        </div>

        <div className="space-y-4">
          {accounts.map((acc) => (
            <div 
              key={acc.id}
              className="p-5 rounded-lg bg-[#07080a] border border-[#1f212f] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left"
            >
              <div className="flex items-start gap-4 min-w-0">
                <div className={`px-2.5 py-1 rounded border text-[10px] font-bold font-mono uppercase tracking-wider inline-block shrink-0 ${
                  acc.provider === 'AWS' 
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/25' 
                    : 'bg-blue-500/10 text-blue-400 border-blue-500/25'
                }`}>
                  {acc.provider}
                </div>
                
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-white text-sm tracking-tight">{acc.name}</h3>
                    
                    <span className="flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono h-fit">
                      <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />
                      verified
                    </span>
                  </div>
                  
                  <p className="text-[11px] text-slate-450 mt-1 leading-relaxed font-mono">
                    ID: {acc.id} | Scoping Region: <strong className="text-slate-200 font-semibold">{acc.region}</strong>
                  </p>
                  
                  {/* Dense role indicators */}
                  <pre className="text-[9px] font-mono text-slate-300 break-all bg-[#0d0e12] p-2.5 border border-[#1f212f] rounded-md leading-relaxed select-all">
                    {acc.arnRole || acc.serviceAccountEmail || 'Minimum privilege scope active'}
                  </pre>
                </div>
              </div>

              {/* Action columns info & disconnect triggers */}
              <div className="flex items-center justify-between sm:justify-start gap-4 self-stretch sm:self-auto pt-2.5 sm:pt-0 border-t border-[#1f212f] sm:border-t-0 font-mono">
                <div className="text-left sm:text-right font-mono shrink-0">
                  <span className="text-[9px] text-zinc-500 uppercase block font-mono">Active inventory</span>
                  <span className="text-xs text-white font-bold block">{acc.resourcesCount} resources</span>
                </div>
                
                <button
                  type="button"
                  onClick={() => onDisconnectAccount(acc.id)}
                  className="p-2.5 bg-[#0d0e12] hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-[#1f212f] hover:border-rose-500/30 rounded-lg transition-all cursor-pointer h-9 w-9 flex items-center justify-center shrink-0"
                  title="Disconnect handle"
                >
                  <Trash2 className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          ))}

          {accounts.length === 0 && (
            <div className="py-12 text-center bg-[#0d0e12] rounded-xl border border-dashed border-[#1f212f] text-slate-400 font-mono text-xs">
              No cloud interfaces currently connected. Submit credentials on the left sheet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
