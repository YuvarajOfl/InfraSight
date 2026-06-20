import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FileText, 
  Trash2, 
  Download, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  Calendar,
  Layers,
  ChevronDown,
  Sparkles,
  Printer
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? `http://${window.location.hostname}:8000` : 'http://localhost:8000');

interface TerraformFile {
  id: number;
  file_name: string;
  file_type: string;
  upload_time: string;
  status: string;
}

interface ReportItem {
  id: number;
  user_id: number;
  file_id: number | null;
  file_name: string | null;
  report_type: string;
  report_name: string;
  created_at: string;
}

export function Reports() {
  const { token } = useAuth();
  
  const [files, setFiles] = useState<TerraformFile[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<number | ''>('');
  const [selectedReportType, setSelectedReportType] = useState<string>('Complete Assessment');
  
  const [loading, setLoading] = useState<boolean>(true);
  const [generating, setGenerating] = useState<boolean>(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const fetchFiles = async () => {
    try {
      const response = await fetch(`${API_URL}/api/files`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        const parsedFiles = data.filter((f: any) => f.status === 'parsed');
        setFiles(parsedFiles);
        if (parsedFiles.length > 0) {
          setSelectedFileId(parsedFiles[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to load files", err);
    }
  };

  const fetchReports = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/reports`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setReports(data);
      }
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchFiles();
      fetchReports();
    }
  }, [token]);

  const triggerMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => {
      setMessage(null);
    }, 6000);
  };

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFileId) {
      triggerMessage('error', 'Please select a Terraform file first.');
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch(`${API_URL}/api/reports/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          file_id: selectedFileId,
          report_type: selectedReportType
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate report.');
      }

      triggerMessage('success', `'${selectedReportType}' compliance report generated successfully.`);
      fetchReports(true);
    } catch (err: any) {
      triggerMessage('error', err.message || 'Failed to generate PDF report.');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (reportId: number, reportName: string) => {
    try {
      const response = await fetch(`${API_URL}/api/reports/download/${reportId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error('Failed to download report file.');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = reportName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      triggerMessage('success', `Downloaded '${reportName}' successfully.`);
    } catch (err) {
      triggerMessage('error', 'Failed to retrieve physical report from disk.');
    }
  };

  const handleDelete = async (id: number, reportName: string) => {
    if (!window.confirm(`Are you sure you want to remove '${reportName}'? This will delete the database record and remove the file from the server disk.`)) {
      return;
    }
    
    try {
      const response = await fetch(`${API_URL}/api/reports/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        triggerMessage('success', `Deleted report '${reportName}' successfully.`);
        fetchReports(true);
      } else {
        triggerMessage('error', 'Failed to delete report.');
      }
    } catch (err) {
      triggerMessage('error', 'Connection error while deleting report.');
    }
  };

  const reportTypes = [
    'Executive Summary',
    'Security Audit',
    'Cost Optimization Report',
    'Complete Assessment'
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in relative z-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white tracking-tight sm:text-2xl">
            Reports & History
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Generate customized compliance report PDFs and maintain an audit history in your workspace.
          </p>
        </div>
        <button 
          onClick={() => fetchReports()}
          className="p-2 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-350 rounded-lg hover:text-white transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          title="Refresh Report History"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* Notifications */}
      {message && (
        <div className={`p-4 border rounded-xl text-xs flex items-start gap-2.5 transition-all shadow-lg ${
          message.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' 
            : 'bg-rose-500/10 border-rose-500/20 text-rose-300'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Report Generator Controls */}
      <div className="bg-slate-900/20 border border-white/5 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono pb-2 border-b border-white/5 flex items-center gap-2">
          <Printer className="h-4 w-4 text-pink-400" />
          <span>Generate Compliance PDF Report</span>
        </h3>
        
        {files.length === 0 ? (
          <p className="text-xs text-slate-500 italic py-2">
            No parsed Terraform files available. Please upload a state file before generating reports.
          </p>
        ) : (
          <form onSubmit={handleGenerateReport} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">Select Config File</label>
              <div className="relative">
                <select
                  value={selectedFileId}
                  onChange={(e) => setSelectedFileId(Number(e.target.value))}
                  className="w-full pl-3 pr-10 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-pink-500 appearance-none font-semibold cursor-pointer"
                >
                  {files.map(f => (
                    <option key={f.id} value={f.id}>{f.file_name}</option>
                  ))}
                </select>
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-550">
                  <ChevronDown className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">Report Template</label>
              <div className="relative">
                <select
                  value={selectedReportType}
                  onChange={(e) => setSelectedReportType(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 bg-slate-950 border border-white/10 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-pink-500 appearance-none font-semibold cursor-pointer"
                >
                  {reportTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-550">
                  <ChevronDown className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>

            <button
              type="submit"
              disabled={generating}
              className="py-2.5 bg-pink-600 hover:bg-pink-500 disabled:bg-pink-900/60 disabled:cursor-not-allowed text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-[0_0_15px_rgba(219,39,119,0.25)]"
            >
              {generating ? (
                <>
                  <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Compiling PDF...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Generate Report</span>
                </>
              )}
            </button>

          </form>
        )}
      </div>

      {/* Reports History List Table */}
      <div className="bg-slate-900/20 border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/5 bg-slate-950/20 flex justify-between items-center">
          <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 font-mono">Audit Log History</span>
          <span className="text-slate-500 font-mono text-[10px]">Total: <b>{reports.length}</b></span>
        </div>

        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-mono text-slate-500">Retrieving generated documents...</span>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-16 text-center">
            <div className="p-4 bg-white/5 rounded-full inline-block text-slate-500 mb-4">
              <FileText className="h-6 w-6" />
            </div>
            <p className="text-slate-400 text-sm font-bold">No reports available.</p>
            <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto leading-normal">
              Select an analyzed cloud state and click the generate button to record your first infrastructure audit.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-slate-950/40 text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                  <th className="py-3 px-6">Report File Details</th>
                  <th className="py-3 px-6">Audit Type</th>
                  <th className="py-3 px-6">Source Terraform File</th>
                  <th className="py-3 px-6">Generated Date</th>
                  <th className="py-3 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-white/[0.01] transition-all text-xs text-slate-350">
                    <td className="py-4 px-6 font-semibold text-slate-200">
                      <div className="flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-pink-400 shrink-0" />
                        <span className="truncate max-w-[200px] block" title={report.report_name}>
                          {report.report_name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-mono text-[10px] text-slate-450 uppercase tracking-wider font-semibold">
                      {report.report_type}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Layers className="h-3 w-3 text-slate-550 shrink-0" />
                        <span>{report.file_name || "Deleted State File"}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-500 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5 text-slate-650" />
                        <span>{new Date(report.created_at).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleDownload(report.id, report.report_name)}
                        className="p-1.5 border border-white/5 rounded-lg hover:bg-pink-500/10 hover:border-pink-900/30 text-slate-400 hover:text-pink-400 transition-colors cursor-pointer"
                        title="Download PDF report file"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(report.id, report.report_name)}
                        className="p-1.5 hover:bg-rose-500/10 border border-white/5 hover:border-rose-900/30 text-slate-400 hover:text-rose-450 rounded-lg transition-colors cursor-pointer"
                        title="Delete report history"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
