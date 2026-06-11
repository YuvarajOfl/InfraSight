/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  ShieldCheck, 
  DollarSign, 
  GitCompare, 
  Search, 
  Brain, 
  LayoutDashboard, 
  Settings, 
  Activity, 
  BarChart, 
  Terminal, 
  Layers, 
  ListOrdered,
  Bell,
  LogOut
} from 'lucide-react';
import { CloudAccount, CloudResource, Finding, TerraformDrift, ChatMessage, SystemNotification } from './types';
import { DashboardHome } from './components/DashboardHome';
import { CloudConnector } from './components/CloudConnector';
import { InventoryList } from './components/InventoryList';
import { SecurityAlerts } from './components/SecurityAlerts';
import { CostCards } from './components/CostCards';
import { DriftPanel } from './components/DriftPanel';
import { ChatAgent } from './components/ChatAgent';
import { ArchitectureViewer } from './components/ArchitectureViewer';
import { LandingPage } from './components/LandingPage';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<string>('');
  
  // High-fidelity Multi-cloud state variables
  const [accounts, setAccounts] = useState<CloudAccount[]>([]);
  const [resources, setResources] = useState<CloudResource[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [drifts, setDrifts] = useState<TerraformDrift[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  
  // AI Chat advisor parameters
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'i-1',
      sender: 'ai',
      text: `Hello! I am **CloudGuardian AI**, your Principal Multi-Cloud Infrastructure Security, Cost, and IaC Architect. 

I have automatically uploaded the **Retrieval-Augmented (RAG) Context** from your active scanned discoveries. I am ready to resolve finding codes. 

Ask me questions such as:
- *"Are there any globally exposed SSH vulnerabilities?"*
- *"Explain my Terraform Configuration Drift discrepancies and write the HCL fix."*
- *"Draft some AWS CLI command parameters to resolve public bucket leaks."*`,
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  // UI State Controllers
  const [isScanning, setIsScanning] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const [hasNotificationsDropdown, setHasNotificationsDropdown] = useState(false);
  const [isBeginnerMode, setIsBeginnerMode] = useState(true);

  // Sync state variables from Backend REST endpoints on boot-up
  const fetchStateData = async () => {
    try {
      const runQuery = async (endpoint: string) => {
        const res = await fetch(endpoint);
        const json = await res.json();
        return json.success ? json.data : [];
      };

      const [accs, res, finds, drfs, notes] = await Promise.all([
        runQuery('/api/accounts'),
        runQuery('/api/resources'),
        runQuery('/api/findings'),
        runQuery('/api/drift'),
        runQuery('/api/notifications')
      ]);

      setAccounts(accs);
      setResources(res);
      setFindings(finds);
      setDrifts(drfs);
      setNotifications(notes);
    } catch (err) {
      console.error('REST State Synchronization Failure:', err);
    }
  };

  useEffect(() => {
    fetchStateData();
  }, []);

  // Action: Connect Account
  const handleConnectAccount = async (accountPayload: any) => {
    try {
      const response = await fetch('/api/accounts/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountPayload)
      });
      const result = await response.json();
      if (result.success) {
        setAccounts(prev => [...prev, result.data]);
        // Trigger fresh data pull to populate newly added resources too
        await fetchStateData();
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      console.error('Error connecting credential handle:', err);
      throw err;
    }
  };

  // Action: Disconnect Account
  const handleDisconnectAccount = async (accountId: string) => {
    try {
      const response = await fetch(`/api/accounts/${accountId}`, {
        method: 'DELETE'
      });
      const result = await response.json();
      if (result.success) {
        setAccounts(prev => prev.filter(acc => acc.id !== accountId));
        setResources(prev => prev.filter(r => r.accountId !== accountId));
        setFindings(prev => prev.filter(f => f.accountId !== accountId));
        setDrifts(prev => prev.filter(d => d.accountId !== accountId));
      }
    } catch (err) {
      console.error('Error deleting connected account:', err);
    }
  };

  // Action: Scanner run execution
  const handleScanAll = async () => {
    if (isScanning || accounts.length === 0) return;
    setIsScanning(true);

    try {
      // Simulate concurrent multi-cloud scan runs
      await Promise.all(
        accounts.map(acc => 
          fetch(`/api/accounts/scan/${acc.id}`, { method: 'POST' })
        )
      );

      // Re-trigger deep synchronization to fetch latest scans timestamps and resources
      await fetchStateData();
    } catch (err) {
      console.error('Discovery Scanning Failure:', err);
    } finally {
      setIsScanning(false);
    }
  };

  // Action: Auto-remediate a vulnerability
  const handleResolveFinding = async (findingId: string) => {
    try {
      const response = await fetch(`/api/findings/resolve/${findingId}`, {
        method: 'POST'
      });
      const result = await response.json();
      if (result.success) {
        // Simple client side optimization: replace updated finding in state
        setFindings(prev => 
          prev.map(f => f.id === findingId ? { ...f, status: 'resolved' as const } : f)
        );
        // Refresh databases resource visibility status values
        await fetchStateData();
      }
    } catch (err) {
      console.error('Mitigation action execution failure:', err);
    }
  };

  // Action: Force baseline terraform alignment
  const handleResolveDrift = async (driftId: string) => {
    try {
      const response = await fetch(`/api/drift/resolve/${driftId}`, {
        method: 'POST'
      });
      const result = await response.json();
      if (result.success) {
        setDrifts(prev => prev.filter(d => d.id !== driftId));
        await fetchStateData();
      }
    } catch (err) {
      console.error('Baseline alignment synching failed:', err);
    }
  };

  // Action: Chat Prompt submission (Retrieval-Augmented Gemini Pro)
  const handleSendMessage = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatHistory(prev => [...prev, userMsg]);
    setIsAILoading(true);

    try {
      // Send RAG prompts safely proxying process environment GEMINI secrets
      const response = await fetch('/api/advisor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: text,
          chatHistory: chatHistory.slice(-6), // Keep sliding conversation window slim
          isBeginnerMode: isBeginnerMode
        })
      });

      const result = await response.json();
      if (result.success) {
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: result.text,
          timestamp: new Date().toLocaleTimeString()
        };
        setChatHistory(prev => [...prev, aiMsg]);
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      console.error('Advisor feedback retrieval failed:', error);
      const errMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: `**Notice**: Failed to communicate with the advisor server: ${error.message} \nPlease check backend environments.`,
        timestamp: new Date().toLocaleTimeString()
      };
      setChatHistory(prev => [...prev, errMsg]);
    } finally {
      setIsAILoading(false);
    }
  };

  const handleClearNotifications = async () => {
    try {
      await fetch('/api/notifications/clear', { method: 'POST' });
      setNotifications([]);
    } catch (err) {
      console.error('Failed clearing log alerts:', err);
    }
  };

  if (!isAuthenticated) {
    return (
      <LandingPage 
        onLoginSuccess={(email) => {
          setUserEmail(email);
          setIsAuthenticated(true);
        }} 
      />
    );
  }

  return (
    <div className="flex h-screen bg-[#07080a] font-sans antialiased overflow-hidden select-none text-slate-100">
      
      {/* 1. Left Persistent Sidebar Menu Panel */}
      <aside className="w-64 bg-[#090a0d] border-r border-[#1f212f] flex flex-col justify-between shrink-0 h-full hidden md:flex">
        <div className="flex-1 overflow-y-auto space-y-6 py-6 pr-0.5">
          {/* Logo Brand Header */}
          <div className="px-6 flex items-center gap-3">
            <div className="p-2 bg-blue-600 text-white rounded-md font-bold flex items-center justify-center hover:scale-105 transition-transform w-8 h-8">
              <div className="w-4 h-4 border-2 border-white rounded-sm rotate-45"></div>
            </div>
            <div>
              <h1 className="font-bold text-white text-base tracking-tight leading-normal">
                CloudGuardian <span className="text-blue-400">AI</span>
              </h1>
              <span className="text-[9px] text-slate-500 font-bold tracking-widest block font-mono uppercase">enterprise control</span>
            </div>
          </div>

          {/* Navigation Items Categories */}
          <div className="px-3 space-y-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Control Tower</span>
            
            {[
              { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
              { id: 'settings', label: 'Cloud Connections', icon: <Settings className="h-4 w-4" /> },
              { id: 'inventory', label: 'Cloud Resources', icon: <Search className="h-4 w-4" /> }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold tracking-wide transition-all ${
                  activeTab === item.id
                    ? 'bg-blue-600/15 text-white border border-blue-500/40 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/20'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          <div className="px-3 space-y-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Guardrails scans</span>

            {[
              { id: 'security', label: 'Security Risks', icon: <ShieldCheck className="h-4 w-4" /> },
              { id: 'cost', label: 'Potential Savings', icon: <DollarSign className="h-4 w-4" /> },
              { id: 'drift', label: 'Terraform Drift', icon: <GitCompare className="h-4 w-4" /> }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold tracking-wide transition-all ${
                  activeTab === item.id
                    ? 'bg-blue-600/15 text-white border border-blue-500/40 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/20'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          <div className="px-3 space-y-1">
            <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 block mb-2">Architect advisor</span>

            {[
              { id: 'ai-advisor', label: 'Ask CloudGuardian AI', icon: <Brain className="h-4 w-4" /> },
              { id: 'blueprint', label: 'Reports & Blueprint', icon: <Layers className="h-4 w-4" /> }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-xs font-semibold tracking-wide transition-all ${
                  activeTab === item.id
                    ? 'bg-blue-600/15 text-white border border-blue-500/40 font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/20'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer info in sidebar */}
        <div className="p-4 border-t border-[#1f212f]">
          <div className="p-3 bg-slate-900/60 rounded-lg text-[11px] leading-relaxed text-slate-450 text-slate-400">
            <span className="text-blue-400 font-bold block mb-1">Enterprise Plan</span>
            Scanning all connected subnets globally.
          </div>
        </div>
      </aside>

      {/* 2. Right Workspace Content area */}
      <main className="flex-1 flex flex-col h-full bg-[#07080a] overflow-hidden relative">
        
        {/* Top Header bar with status checking alerts */}
        <header className="h-16 bg-[#090a0d] border-b border-[#1f212f] px-6 flex items-center justify-between text-slate-200 shrink-0 z-10 shadow-sm">
          <div>
            {/* Header Title reflecting active tab */}
            <h2 className="text-sm font-bold tracking-tight uppercase text-slate-400 flex items-center gap-1.5 font-sans">
              <span>CloudGuardian</span>
              <span className="text-[10px] font-mono font-bold px-1.5 bg-[#14151f] border border-[#232537] text-blue-400 rounded lowercase">
                /{activeTab}
              </span>
            </h2>
          </div>

          {/* Right Header items */}
          <div className="flex items-center gap-4">
            {/* Mobile Navigation Selector (Only visible under medium screens) */}
            <div className="md:hidden flex items-center">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="bg-[#0d0e12] border border-[#232537] text-xs text-blue-400 font-bold px-3 py-1.5 rounded focus:outline-none"
              >
                <option value="dashboard">Dashboard</option>
                <option value="settings">Cloud Connections</option>
                <option value="inventory">Cloud Resources</option>
                <option value="security">Security Risks</option>
                <option value="cost">Potential Savings</option>
                <option value="drift">Terraform Drift</option>
                <option value="ai-advisor">Ask CloudGuardian AI</option>
                <option value="blueprint">Reports & Blueprint</option>
              </select>
            </div>

            {/* Audit log warning indicator */}
            <div className="relative h-9 w-9 flex items-center justify-center bg-[#0d0e12] border border-[#1f212f] hover:bg-[#151622] rounded-lg shrink-0 cursor-pointer text-slate-300 shadow-sm transition-colors">
              <button 
                type="button"
                onClick={() => setHasNotificationsDropdown(!hasNotificationsDropdown)}
                className="relative"
              >
                <Bell className="h-4.5 w-4.5 hover:text-white transition-colors" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute -top-1.5 -right-1.5 h-2 w-2.5 rounded-full bg-orange-500 border border-[#0d0e12] animate-pulse" />
                )}
              </button>

              {/* Event Logs Dropdown */}
              {hasNotificationsDropdown && (
                <div className="absolute right-0 top-11 w-80 bg-[#0d0e12] border border-[#1f212f] rounded-xl shadow-2xl p-4.5 z-40 text-left space-y-3.5 text-slate-200">
                  <div className="flex items-center justify-between border-b border-[#1f212f] pb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Incident subnets</span>
                    <button 
                      onClick={handleClearNotifications}
                      className="text-[10px] text-blue-400 hover:text-blue-300 font-bold"
                    >
                      Clear Audits
                    </button>
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-2.5 pr-0.5 scrollbar-thin">
                    {notifications.map(n => (
                      <div key={n.id} className="text-xs border-l-2 border-slate-600 pl-2">
                        <span className="font-semibold text-slate-200 block">{n.title}</span>
                        <span className="text-slate-400 text-[11px] block mt-0.5">{n.message}</span>
                      </div>
                    ))}
                    {notifications.length === 0 && (
                      <span className="text-xs text-slate-400 italic block text-center py-4">No active incident alerts.</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Explanatory Mode Control Switch */}
            <div className="flex items-center bg-[#090a0d] p-0.5 rounded-lg border border-[#1f212f] shadow-sm gap-1">
              <button
                type="button"
                onClick={() => setIsBeginnerMode(true)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  isBeginnerMode
                    ? 'bg-blue-600 text-white shadow font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Simplified friendly descriptions & active education boxes"
              >
                Beginner Mode
              </button>
              <button
                type="button"
                onClick={() => setIsBeginnerMode(false)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  !isBeginnerMode
                    ? 'bg-[#1f212f] text-white shadow font-extrabold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Deep technical context, exact Terraform specs & AWS CLI hooks"
              >
                Professional Mode
              </button>
            </div>

            {/* Avatar or user profile widget info */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0d0e12] border border-[#1f212f] rounded-lg shadow-sm">
                <div className="h-6 w-6 rounded-full bg-blue-950/50 border border-blue-500/20 flex items-center justify-center text-[10px] text-blue-400 font-bold uppercase shadow-inner">
                  {userEmail ? userEmail.charAt(0) : 'Y'}
                </div>
                <span className="text-xs font-semibold text-slate-300 hidden sm:inline">
                  {userEmail ? userEmail.split('@')[0] : 'yuvicardy18'}
                </span>
              </div>
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setUserEmail('');
                }}
                className="p-2 bg-[#0d0e12] hover:bg-slate-900 border border-[#1f212f] text-slate-400 hover:text-rose-400 rounded-lg shadow-sm transition-all flex items-center justify-center cursor-pointer hover:border-rose-900/40"
                title="Log Out of CloudGuardian Control Tower"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {/* 3. Primary active view render router */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <div className="max-w-7xl mx-auto h-full">
            {activeTab === 'dashboard' && (
              <DashboardHome 
                accounts={accounts}
                resources={resources}
                findings={findings}
                notifications={notifications}
                setActiveTab={setActiveTab}
                triggerScanAll={handleScanAll}
                isScanning={isScanning}
                isBeginnerMode={isBeginnerMode}
                setIsBeginnerMode={setIsBeginnerMode}
              />
            )}

            {activeTab === 'settings' && (
              <CloudConnector 
                accounts={accounts}
                onConnectAccount={handleConnectAccount}
                onDisconnectAccount={handleDisconnectAccount}
              />
            )}

            {activeTab === 'inventory' && (
              <InventoryList 
                resources={resources}
                isBeginnerMode={isBeginnerMode}
              />
            )}

            {activeTab === 'security' && (
              <SecurityAlerts 
                findings={findings}
                onResolveFinding={handleResolveFinding}
                isBeginnerMode={isBeginnerMode}
              />
            )}

            {activeTab === 'cost' && (
              <CostCards 
                resources={resources}
                findings={findings}
                onResolveFinding={handleResolveFinding}
                isBeginnerMode={isBeginnerMode}
              />
            )}

            {activeTab === 'drift' && (
              <DriftPanel 
                drifts={drifts}
                onResolveDrift={handleResolveDrift}
                isBeginnerMode={isBeginnerMode}
              />
            )}

            {activeTab === 'ai-advisor' && (
              <ChatAgent 
                chatHistory={chatHistory}
                onSendMessage={handleSendMessage}
                isAILoading={isAILoading}
                isBeginnerMode={isBeginnerMode}
              />
            )}

            {activeTab === 'blueprint' && (
              <ArchitectureViewer />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
