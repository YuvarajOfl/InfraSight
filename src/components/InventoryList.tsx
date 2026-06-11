import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Database, 
  Server, 
  ShieldCheck, 
  HardDrive, 
  Users, 
  ChevronRight,
  Info
} from 'lucide-react';
import { CloudResource } from '../types';

interface InventoryListProps {
  resources: CloudResource[];
  isBeginnerMode?: boolean;
}

export function InventoryList({ resources, isBeginnerMode = true }: InventoryListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResourceType, setSelectedResourceType] = useState<string>('all');
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [activeResourceDetail, setActiveResourceDetail] = useState<CloudResource | null>(null);

  // Search filter and categorizers
  const filteredResources = resources.filter((res) => {
    const matchesSearch = 
      res.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type categorizers mapping
    const matchesType = 
      selectedResourceType === 'all' || 
      (selectedResourceType === 'virtual_machine' && res.type === 'virtual_machine') ||
      (selectedResourceType === 'storage_bucket' && res.type === 'storage_bucket') ||
      (selectedResourceType === 'firewall_rule' && res.type === 'firewall_rule') ||
      (selectedResourceType === 'database_instance' && res.type === 'database_instance') ||
      (selectedResourceType === 'iam_role' && res.type === 'iam_role');

    const matchesProvider = selectedProvider === 'all' || res.provider === selectedProvider;
    const matchesRegion = selectedRegion === 'all' || res.region.toLowerCase() === selectedRegion.toLowerCase();

    return matchesSearch && matchesType && matchesProvider && matchesRegion;
  });

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'virtual_machine':
        return <Server className="h-4 w-4 text-blue-400" />;
      case 'storage_bucket':
        return <HardDrive className="h-4 w-4 text-emerald-400" />;
      case 'firewall_rule':
        return <ShieldCheck className="h-4 w-4 text-amber-500" />;
      case 'database_instance':
        return <Database className="h-4 w-4 text-purple-400" />;
      case 'iam_role':
        return <Users className="h-4 w-4 text-indigo-400" />;
      default:
        return <Server className="h-4 w-4 text-slate-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="px-2.5 py-0.5 rounded text-[9px] font-bold font-mono bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 uppercase tracking-wider">Operational</span>;
      case 'warning':
        return <span className="px-2.5 py-0.5 rounded text-[9px] font-bold font-mono bg-amber-500/15 text-amber-400 border border-amber-500/30 uppercase tracking-wider">{isBeginnerMode ? "Unused Waste" : "Opportunity"}</span>;
      case 'critical':
        return <span className="px-2.5 py-0.5 rounded text-[9px] font-bold font-mono bg-rose-500/15 text-rose-450 text-rose-400 border border-rose-500/30 uppercase tracking-wider">{isBeginnerMode ? "Security Risk" : "Threat risk"}</span>;
      case 'stopped':
        return <span className="px-2.5 py-0.5 rounded text-[9px] font-bold font-mono bg-slate-800 text-slate-350 border border-[#1f212f] uppercase tracking-wider">Offline</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded text-[9px] font-bold font-mono bg-slate-800 text-slate-350 border border-[#1f212f] uppercase tracking-wider">{status}</span>;
    }
  };

  const uniqueRegions = Array.from(new Set(resources.map(r => r.region)));

  return (
    <div id="inventory-catalog" className="space-y-6 text-slate-100 font-sans">
      
      {/* Search and Filters dropdown headers bar */}
      <div className="bg-[#0d0e12] border border-[#1f212f] rounded-xl p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center shadow-sm">
        {/* Search Field */}
        <div className="relative md:col-span-6">
          <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search cloud inventory by Name or unique ID hashes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#07080a] border border-[#1f212f] rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-slate-450 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20"
          />
        </div>

        {/* Cloud Provider Select toggle */}
        <div className="md:col-span-3">
          <select
            value={selectedProvider}
            onChange={(e) => setSelectedProvider(e.target.value)}
            className="w-full bg-[#07080a] border border-[#1f212f] rounded-lg px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-semibold cursor-pointer"
          >
            <option value="all">All Cloud Environments</option>
            <option value="AWS">AWS Infrastructure</option>
            <option value="GCP">GCP Infrastructure</option>
          </select>
        </div>

        {/* Global regions match */}
        <div className="md:col-span-3">
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
            className="w-full bg-[#07080a] border border-[#1f212f] rounded-lg px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-semibold cursor-pointer"
          >
            <option value="all">All Checked Regions</option>
            {uniqueRegions.map(reg => (
              <option key={reg} value={reg}>{reg.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      {isBeginnerMode && (
        <div id="beginner-resources-hub" className="bg-[#0b101c] border border-blue-500/40 p-5 rounded-xl shadow-lg relative overflow-hidden">
          <div className="space-y-1.5 text-left">
            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px] font-mono rounded font-bold uppercase tracking-wider">
              🎓 CLOUD ASSETS EXPLORER
            </span>
            <h3 className="text-base font-bold text-white">Your Cloud Assets Ledger</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="space-y-1">
                <strong className="text-blue-400 font-mono block">1. WHAT ARE THESE?</strong>
                <p className="text-slate-200 leading-relaxed font-normal p-0.5">
                  This list shows all registered virtual hard drives (buckets), virtual computers (VMs), and database systems running inside your AWS and GCP accounts.
                </p>
              </div>
              <div className="space-y-1">
                <strong className="text-indigo-400 font-mono block">2. WHY DOES IT MATTER?</strong>
                <p className="text-slate-200 leading-relaxed font-normal p-0.5">
                  Every active computer or storage bucket costs you money. Checking this list regularly helps you detect "orphaned" resources from tests that you forgot to delete.
                </p>
              </div>
              <div className="space-y-1">
                <strong className="text-purple-400 font-mono block font-semibold text-white">3. WHAT TO DO NEXT?</strong>
                <p className="text-slate-200 leading-relaxed font-normal p-0.5">
                  Browse by type (such as "Virtual host VMs" or "Storage buckets"). Click on any asset to inspect its details, monthly rate, and status.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Resource type category filter pills slider */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { key: 'all', label: 'All Cataloged Assets' },
          { key: 'virtual_machine', label: 'Virtual host VMs' },
          { key: 'storage_bucket', label: 'Storage S3/Buckets' },
          { key: 'firewall_rule', label: 'Firewall rules & SGs' },
          { key: 'database_instance', label: 'Relational DBs' },
          { key: 'iam_role', label: 'IAM Roles Access' }
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedResourceType(cat.key)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
              selectedResourceType === cat.key
                ? 'bg-blue-600 text-white border-blue-500 shadow-lg'
                : 'bg-[#0d0e12] text-slate-300 hover:text-white border-[#1f212f] hover:bg-[#1a1c29]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Primary listings vs Side detail panel splits split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Resource Listings (Col Span 8) */}
        <div className="bg-[#0d0e12] border border-[#1f212f] rounded-xl overflow-hidden lg:col-span-8 shadow-sm">
          <div className="px-5 py-4 border-b border-[#1f212f] flex items-center justify-between bg-[#0e1017]">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 font-mono">Inventory Discoveries Catalog</h3>
            <span className="text-[10px] font-mono font-bold text-slate-300 bg-[#151622] border border-[#23253b] px-2.5 py-1 rounded">
              TOTAL: {filteredResources.length} ELEMENTS
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="bg-[#07080a] border-b border-[#1f212f] text-[9px] font-bold text-slate-350 uppercase tracking-widest font-mono">
                  <th className="px-5 py-3">Resource Asset</th>
                  <th className="px-5 py-3">Catalog Location</th>
                  <th className="px-5 py-3 text-right">Cost Rate</th>
                  <th className="px-5 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1f212f]/40">
                {filteredResources.map((res) => (
                  <tr 
                    key={res.id}
                    onClick={() => setActiveResourceDetail(res)}
                    className={`cursor-pointer transition-colors ${
                      activeResourceDetail?.id === res.id 
                        ? 'bg-[#181d2f]/85 border-l-2 border-blue-500' 
                        : 'hover:bg-[#12141c]'
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#07080a] border border-[#1f212f] rounded-lg flex items-center justify-center">
                          {getResourceIcon(res.type)}
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">{res.name}</div>
                          <div className="font-mono text-[9px] text-slate-400 mt-0.5 uppercase select-all">
                            UID: {res.id.substr(0, 24)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase tracking-wider border ${
                          res.provider === 'AWS' 
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/25' 
                            : 'bg-blue-500/10 text-blue-400 border-blue-500/25'
                        }`}>
                          {res.provider}
                        </span>
                        <span className="text-slate-300 text-[10px] flex items-center gap-0.5 font-mono">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          {res.region}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold font-mono text-white text-xs">
                      ${res.costMonthly}/mo
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      {getStatusBadge(res.status)}
                    </td>
                  </tr>
                ))}

                {filteredResources.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400 text-xs font-mono italic">
                      No tracked infrastructure matches constraints.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Inspector Detail Sub-panel Display Panel (Col Span 4) */}
        <div className="lg:col-span-4">
          {activeResourceDetail ? (
            <div className="bg-[#0d0e12] border border-[#1f212f] rounded-xl p-6 space-y-6 shadow-sm relative">
              <div className="border-b border-[#1f212f] pb-4">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase tracking-wider border ${
                    activeResourceDetail.provider === 'AWS' ? 'bg-amber-500/10 text-amber-400 border-amber-500/25' : 'bg-blue-500/10 text-blue-400 border-blue-500/25'
                  }`}>
                    {activeResourceDetail.provider}
                  </span>
                  <span className="text-[10px] font-mono text-slate-300 uppercase font-bold tracking-tight">{activeResourceDetail.type.replace('_', ' ')}</span>
                </div>
                
                <h3 className="text-base font-extrabold text-white mt-2 leading-snug break-words">{activeResourceDetail.name}</h3>
                <p className="text-[9px] font-mono text-slate-400 mt-1 uppercase break-all">UID: {activeResourceDetail.id}</p>
              </div>

              {/* Status pricing matrix indicators */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#07080a] p-3.5 rounded-xl border border-[#1f212f] text-center shadow-inner">
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block font-mono">Monthly cost</span>
                  <span className="text-base font-bold text-white mt-1 block font-mono tracking-tight">${activeResourceDetail.costMonthly}/mo</span>
                </div>
                
                <div className="bg-[#07080a] p-3.5 rounded-xl border border-[#1f212f] text-center shadow-inner">
                  <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block font-mono">Diagnosis Status</span>
                  <div className="mt-1.5 flex items-center justify-center">
                    {getStatusBadge(activeResourceDetail.status)}
                  </div>
                </div>
              </div>

              {/* Detailed Technical Parameters configurations list */}
              <div>
                <h4 className="text-[10px] font-bold font-mono uppercase tracking-widest text-slate-400 mb-2">Technical properties</h4>
                
                <div className="bg-[#07080a] rounded-xl p-4 border border-[#1f212f] font-mono text-[11px] space-y-2.5 text-slate-200">
                  <div className="flex justify-between items-center pb-2 border-b border-[#1f212f]/60">
                    <span className="text-slate-400">Region Zone:</span>
                    <span className="text-white font-bold">{activeResourceDetail.region}</span>
                  </div>
                  
                  {activeResourceDetail.details.instanceType && (
                    <div className="flex justify-between items-center pb-2 border-b border-[#1f212f]/60">
                      <span className="text-slate-400">Node tier type:</span>
                      <span className="text-white font-bold">{activeResourceDetail.details.instanceType}</span>
                    </div>
                  )}
                  
                  {activeResourceDetail.details.publicIp && (
                    <div className="flex justify-between items-center pb-2 border-b border-[#1f212f]/60">
                      <span className="text-slate-400">Public IP address:</span>
                      <span className="text-blue-400 select-all font-bold">{activeResourceDetail.details.publicIp}</span>
                    </div>
                  )}
                  
                  {activeResourceDetail.details.sizeGb && (
                    <div className="flex justify-between items-center pb-2 border-b border-[#1f212f]/60">
                      <span className="text-slate-400">Storage capacity:</span>
                      <span className="text-white font-bold">{activeResourceDetail.details.sizeGb} GB</span>
                    </div>
                  )}
                  
                  {activeResourceDetail.details.encryptionEnabled !== undefined && (
                    <div className="flex justify-between items-center pb-2 border-b border-[#1f212f]/60">
                      <span className="text-slate-400">SSE Protection rules:</span>
                      <span className={activeResourceDetail.details.encryptionEnabled ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                        {activeResourceDetail.details.encryptionEnabled ? 'AES-255 ACTIVE' : 'DISABLED'}
                      </span>
                    </div>
                  )}
                  
                  {activeResourceDetail.details.ports && (
                    <div className="flex justify-between items-center pb-2 border-b border-[#1f212f]/60">
                      <span className="text-slate-400">Open TCP ports list:</span>
                      <span className="text-amber-500 font-bold">{activeResourceDetail.details.ports}</span>
                    </div>
                  )}

                  {activeResourceDetail.details.authPolicy && (
                    <div className="space-y-1 pt-1.5 text-left">
                      <span className="text-slate-400 block p-0.5">Access scopes Policy:</span>
                      <span className="text-[10.5px] text-amber-500 leading-normal block bg-[#0d0e12] p-2.5 rounded border border-[#1f212f] whitespace-pre-wrap select-all font-mono">
                        {activeResourceDetail.details.authPolicy}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tag dictionary blocks */}
              <div>
                <h4 className="text-[10px] font-bold font-mono uppercase tracking-widest text-slate-400 mb-2">Resource tagging keys</h4>
                
                <div className="flex flex-wrap gap-1.5">
                  {Object.entries(activeResourceDetail.tags).map(([key, val]) => (
                    <span key={key} className="text-[10px] bg-[#07080a] text-slate-300 border border-[#1f212f] px-2.5 py-1 rounded font-medium select-all">
                      {key}: <strong className="text-white font-semibold font-mono">{val}</strong>
                    </span>
                  ))}
                  {Object.keys(activeResourceDetail.tags).length === 0 && (
                    <span className="text-xs text-slate-400 italic">No structural tagging attached.</span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-[#0d0e12] rounded-xl border border-dashed border-[#1f212f] text-slate-400 space-y-2">
              <Info className="h-6 w-6 text-slate-500 mx-auto" />
              <p className="text-xs">Click any active operational infrastructure resource on the directory to pull its spec diagnostics lists.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
