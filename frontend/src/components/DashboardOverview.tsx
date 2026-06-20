import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User as UserIcon, 
  ShieldAlert, 
  Layers, 
  FileText, 
  FileCode,
  UserCheck,
  Coins,
  Sparkles,
  Activity,
  History
} from 'lucide-react';

import { API_URL } from '../config';

interface DashboardStats {
  total_files: number;
  total_resources: number;
  security_findings: number;
  cost_findings: number;
  potential_savings: number;
  ai_recommendations: number;
  reports_generated: number;
}

interface ActivityLog {
  text: string;
  timestamp: string;
  type: 'upload' | 'ai' | 'report';
}

export function DashboardOverview() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats>({
    total_files: 0,
    total_resources: 0,
    security_findings: 0,
    cost_findings: 0,
    potential_savings: 0.0,
    ai_recommendations: 0,
    reports_generated: 0
  });

  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const headers = { 'Authorization': `Bearer ${token}` };
        
        // Fetch stats
        const statsRes = await fetch(`${API_URL}/api/dashboard/stats`, { headers });
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
        
        // Fetch activity
        const activityRes = await fetch(`${API_URL}/api/dashboard/activity`, { headers });
        if (activityRes.ok) {
          const activityData = await activityRes.json();
          setActivities(activityData);
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in relative z-10">
      
      {/* Row 1: Welcome & Profile Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Welcome Card */}
        <div className="md:col-span-2 p-6 bg-gradient-to-br from-slate-900 to-indigo-950/40 border border-white/5 rounded-2xl flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-400 border border-blue-500/25 px-2 py-0.5 rounded text-[9px] font-bold font-mono tracking-wider uppercase">
              Control Tower Overview
            </div>
            <h3 className="text-xl font-extrabold text-white tracking-tight sm:text-2xl">
              Welcome, {user?.name || 'Operator'}
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-lg font-normal">
              You are successfully authenticated. Welcome to InfraSight. Navigate using the sidebar workspace to manage Terraform configs, inspect security vulnerabilities, estimate cost metrics, and consult Gemini AI compliance advisor.
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
            <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Authenticated with Identity Token Provider</span>
          </div>
        </div>

        {/* Profile Detail Card */}
        <div className="p-6 bg-slate-900/50 border border-white/5 rounded-2xl flex flex-col items-center text-center justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-2 font-mono text-[45px] text-white/[0.01] pointer-events-none select-none font-bold">
            PROFILE
          </div>
          <div className="space-y-3.5 flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-blue-950 border border-white/10 p-0.5 flex items-center justify-center overflow-hidden shadow-2xl">
              {user?.profile_picture ? (
                <img src={user.profile_picture} alt={user?.name} className="h-full w-full object-cover rounded-full" />
              ) : (
                <UserIcon className="h-8 w-8 text-blue-400" />
              )}
            </div>
            <div>
              <h4 className="font-bold text-white text-base leading-snug">{user?.name}</h4>
              <p className="text-xs text-slate-450 text-slate-400 block truncate mt-0.5">{user?.email}</p>
            </div>
          </div>
          <div className="w-full pt-4 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-slate-500 mt-4">
            <span>ID: #{user?.id}</span>
            <span>Joined: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</span>
          </div>
        </div>

      </div>

      {/* Row 2: Executive Summary Cards Grid */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">
          Executive Summary
        </h3>
        
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-24 bg-white/[0.01] border border-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            
            {/* Card 1: Total Terraform Files */}
            <div 
              onClick={() => navigate('/dashboard/files')}
              className="p-4 bg-white/[0.01] border border-white/5 hover:border-blue-500/20 rounded-xl cursor-pointer transition-all hover:bg-slate-900/25 flex flex-col justify-between"
            >
              <div className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">Total Files</div>
              <div className="text-xl font-extrabold text-white mt-2 font-mono">{stats.total_files}</div>
              <div className="text-[9px] text-slate-550 text-slate-550 mt-1 flex items-center gap-1 font-mono">
                <FileCode className="h-2.5 w-2.5 text-blue-400" />
                <span>Uploaded</span>
              </div>
            </div>

            {/* Card 2: Total Resources */}
            <div 
              onClick={() => navigate('/dashboard/analysis')}
              className="p-4 bg-white/[0.01] border border-white/5 hover:border-indigo-500/20 rounded-xl cursor-pointer transition-all hover:bg-slate-900/25 flex flex-col justify-between"
            >
              <div className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">Resources</div>
              <div className="text-xl font-extrabold text-white mt-2 font-mono">{stats.total_resources}</div>
              <div className="text-[9px] text-slate-555 mt-1 flex items-center gap-1 font-mono text-slate-500">
                <Layers className="h-2.5 w-2.5 text-indigo-400" />
                <span>Managed</span>
              </div>
            </div>

            {/* Card 3: Security Findings */}
            <div 
              onClick={() => navigate('/dashboard/analysis')}
              className="p-4 bg-white/[0.01] border border-white/5 hover:border-rose-500/20 rounded-xl cursor-pointer transition-all hover:bg-slate-900/25 flex flex-col justify-between"
            >
              <div className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">Sec Findings</div>
              <div className="text-xl font-extrabold text-white mt-2 font-mono">{stats.security_findings}</div>
              <div className="text-[9px] mt-1 flex items-center gap-1 font-mono text-slate-500">
                <ShieldAlert className="h-2.5 w-2.5 text-rose-400" />
                <span>Vulnerabilities</span>
              </div>
            </div>

            {/* Card 4: Cost Findings */}
            <div 
              onClick={() => navigate('/dashboard/analysis')}
              className="p-4 bg-white/[0.01] border border-white/5 hover:border-emerald-500/20 rounded-xl cursor-pointer transition-all hover:bg-slate-900/25 flex flex-col justify-between"
            >
              <div className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">Cost Findings</div>
              <div className="text-xl font-extrabold text-white mt-2 font-mono">{stats.cost_findings}</div>
              <div className="text-[9px] mt-1 flex items-center gap-1 font-mono text-slate-500">
                <Coins className="h-2.5 w-2.5 text-emerald-400" />
                <span>Opportunities</span>
              </div>
            </div>

            {/* Card 5: Potential Savings */}
            <div 
              onClick={() => navigate('/dashboard/analysis')}
              className="p-4 bg-white/[0.01] border border-white/5 hover:border-emerald-500/20 rounded-xl cursor-pointer transition-all hover:bg-slate-900/25 flex flex-col justify-between"
            >
              <div className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">Savings</div>
              <div className="text-sm font-extrabold text-emerald-400 mt-2.5 font-mono">${stats.potential_savings.toFixed(2)}/mo</div>
              <div className="text-[9px] mt-1 flex items-center gap-1 font-mono text-slate-500">
                <Coins className="h-2.5 w-2.5 text-emerald-400" />
                <span>Waste Potential</span>
              </div>
            </div>

            {/* Card 6: AI Recommendations */}
            <div 
              onClick={() => navigate('/dashboard/ai-advisor')}
              className="p-4 bg-white/[0.01] border border-white/5 hover:border-teal-500/20 rounded-xl cursor-pointer transition-all hover:bg-slate-900/25 flex flex-col justify-between"
            >
              <div className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">AI Advices</div>
              <div className="text-xl font-extrabold text-white mt-2 font-mono">{stats.ai_recommendations}</div>
              <div className="text-[9px] mt-1 flex items-center gap-1 font-mono text-slate-500">
                <Sparkles className="h-2.5 w-2.5 text-teal-400" />
                <span>Consultations</span>
              </div>
            </div>

            {/* Card 7: Reports Generated */}
            <div 
              onClick={() => navigate('/dashboard/reports')}
              className="p-4 bg-white/[0.01] border border-white/5 hover:border-pink-500/20 rounded-xl cursor-pointer transition-all hover:bg-slate-900/25 flex flex-col justify-between"
            >
              <div className="text-[10px] font-bold text-slate-500 uppercase font-mono tracking-wider">Reports</div>
              <div className="text-xl font-extrabold text-white mt-2 font-mono">{stats.reports_generated}</div>
              <div className="text-[9px] mt-1 flex items-center gap-1 font-mono text-slate-500">
                <FileText className="h-2.5 w-2.5 text-pink-400" />
                <span>Persistent PDFs</span>
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Row 3: Recent Activity Widget */}
      <div className="bg-slate-900/20 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4.5 border-b border-white/5 bg-slate-950/20 flex items-center gap-2">
          <Activity className="h-4.5 w-4.5 text-blue-400" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono">Recent Operations Audit Log</span>
        </div>

        {loading ? (
          <div className="p-8 flex items-center justify-center gap-2">
            <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-slate-500 font-mono">Reading activity logs...</span>
          </div>
        ) : activities.length === 0 ? (
          <div className="p-12 text-center">
            <div className="p-3 bg-white/5 rounded-full inline-block text-slate-500 mb-3">
              <History className="h-5 w-5" />
            </div>
            <p className="text-slate-400 text-xs font-bold font-mono">No recent activity logged.</p>
            <p className="text-slate-600 text-[10px] mt-0.5">Actions like uploads, PDF creations, and AI consultations will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.02]">
            {activities.map((act, index) => (
              <div key={index} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.01] transition-all text-xs">
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg border ${
                    act.type === 'upload' 
                      ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
                      : act.type === 'report' 
                      ? 'bg-pink-500/10 border-pink-500/20 text-pink-400'
                      : 'bg-teal-500/10 border-teal-500/20 text-teal-400'
                  }`}>
                    {act.type === 'upload' && <FileCode className="h-3.5 w-3.5" />}
                    {act.type === 'report' && <FileText className="h-3.5 w-3.5" />}
                    {act.type === 'ai' && <Sparkles className="h-3.5 w-3.5" />}
                  </div>
                  <span className="font-semibold text-slate-200">{act.text}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-500">{new Date(act.timestamp).toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
