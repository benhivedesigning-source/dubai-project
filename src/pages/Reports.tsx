import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { LOCATIONS } from '../data/mockData';
import { 
  BarChart3, 
  FileText, 
  Download, 
  Printer, 
  Filter, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Users, 
  Eye, 
  X,
  TrendingUp,
  Award
} from 'lucide-react';

export const Reports: React.FC = () => {
  const { 
    employees, 
    courses, 
    assignments, 
    practicalAssessments, 
    qualifications,
    showToast,
    language 
  } = useApp();

  const [activeReportTab, setActiveReportTab] = useState<
    'completion' | 'overdue' | 'performance' | 'practical' | 'expiry' | 'location_comparison'
  >('completion');

  // Filters
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState('all');

  // Export Preview Modal
  const [exportPreviewOpen, setExportPreviewOpen] = useState(false);

  // Filtered employees for report
  const filteredReportEmps = useMemo(() => {
    return employees.filter((e) => {
      const matchLoc = selectedLocation === 'all' || e.location === selectedLocation;
      const matchRole = selectedRole === 'all' || e.role === selectedRole;
      return matchLoc && matchRole;
    });
  }, [employees, selectedLocation, selectedRole]);

  const filteredEmpIds = useMemo(() => new Set(filteredReportEmps.map(e => e.id)), [filteredReportEmps]);

  // Filtered assignments for report
  const filteredReportAssignments = useMemo(() => {
    return assignments.filter((a) => {
      const matchEmp = filteredEmpIds.has(a.employeeId);
      const matchCourse = selectedCourse === 'all' || a.courseId === selectedCourse;
      return matchEmp && matchCourse;
    });
  }, [assignments, filteredEmpIds, selectedCourse]);

  // Derived Report Metrics
  const totalAssigned = filteredReportAssignments.length;
  const completedCount = filteredReportAssignments.filter(a => a.status === 'completed').length;
  const overdueCount = filteredReportAssignments.filter(a => a.status === 'overdue').length;
  const inProgressCount = filteredReportAssignments.filter(a => a.status === 'in_progress').length;
  const completionRate = totalAssigned > 0 ? Math.round((completedCount / totalAssigned) * 100) : 0;

  // Real CSV Generator Download
  const handleDownloadCsv = () => {
    let headers: string[] = [];
    let rows: string[][] = [];
    const reportTitle = activeReportTab.replace('_', ' ').toUpperCase();

    if (activeReportTab === 'completion' || activeReportTab === 'overdue') {
      headers = ['Employee Code', 'Employee Name', 'Role', 'Facility', 'Course', 'Status', 'Due Date', 'Progress %'];
      rows = filteredReportAssignments.map((a) => {
        const emp = employees.find(e => e.id === a.employeeId);
        const crs = courses.find(c => c.id === a.courseId);
        const loc = LOCATIONS.find(l => l.id === emp?.location);
        return [
          emp?.employeeCode || '',
          emp?.name || '',
          emp?.role || '',
          loc?.name || '',
          crs?.title || '',
          a.status,
          a.dueDate,
          `${a.progressPercent}%`
        ];
      });
    } else if (activeReportTab === 'practical') {
      headers = ['Employee Name', 'Task', 'Location', 'Supervisor', 'Date', 'Status', 'Decision'];
      rows = practicalAssessments.filter(p => filteredEmpIds.has(p.employeeId)).map((p) => {
        const emp = employees.find(e => e.id === p.employeeId);
        const loc = LOCATIONS.find(l => l.id === p.location);
        return [
          emp?.name || '',
          p.taskTitle,
          loc?.name || '',
          p.supervisorName,
          p.scheduledDate,
          p.status,
          p.decision || 'pending'
        ];
      });
    } else {
      headers = ['Employee Name', 'Licence/Cert', 'Type', 'Issuing Body', 'Expiry Date', 'Status'];
      rows = qualifications.filter(q => filteredEmpIds.has(q.employeeId)).map((q) => {
        const emp = employees.find(e => e.id === q.employeeId);
        return [
          emp?.name || '',
          q.title,
          q.type,
          q.issuingOrganization,
          q.expiryDate || 'N/A',
          q.status
        ];
      });
    }

    const csvContent = [
      `AERIS Safety LMS - ${reportTitle} Report`,
      `Generated: ${new Date().toISOString()}`,
      `Scope: Location=${selectedLocation}, Role=${selectedRole}`,
      '',
      headers.join(','),
      ...rows.map(row => row.map(v => `"${(v || '').replace(/"/g, '""')}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `aeris_safety_${activeReportTab}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Report Exported', `CSV file successfully downloaded.`, 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl lg:text-2xl font-extrabold text-[#111C28] tracking-tight">
            Compliance & Audit Intelligence
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Official health, safety and statutory regulatory records for Dubai Ministry and Internal HSE Audits
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setExportPreviewOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-[#007F82]" />
            <span>Export Preview</span>
          </button>

          <button
            onClick={handleDownloadCsv}
            className="px-3.5 py-2 rounded-xl bg-[#007F82] hover:bg-[#006e71] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#007F82]/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-[#79E8CE]" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Filter Ribbon */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs no-print">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" />
            <span>Report Scope:</span>
          </div>

          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-3 py-1.5 bg-[#F4F7F8] border border-slate-200 rounded-xl font-medium focus:outline-none"
          >
            <option value="all">All Facilities</option>
            {LOCATIONS.map((l) => (
              <option key={l.id} value={l.id}>{l.name}</option>
            ))}
          </select>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-3 py-1.5 bg-[#F4F7F8] border border-slate-200 rounded-xl font-medium focus:outline-none"
          >
            <option value="all">All Logistics Roles</option>
            <option value="Forklift Operator">Forklift Operator</option>
            <option value="Warehouse Associate">Warehouse Associate</option>
            <option value="Driver">Driver</option>
            <option value="Loading Supervisor">Loading Supervisor</option>
            <option value="HSE Officer">HSE Officer</option>
          </select>

          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-3 py-1.5 bg-[#F4F7F8] border border-slate-200 rounded-xl font-medium focus:outline-none"
          >
            <option value="all">All Safety Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
            ))}
          </select>
        </div>

        <span className="text-[11px] font-mono text-slate-400">
          Audited Period: Year 2026 Q3/Q4
        </span>
      </div>

      {/* Report Sub-Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs no-print">
        {[
          { id: 'completion', label: 'Completion Report', icon: CheckCircle2 },
          { id: 'overdue', label: `Overdue Training (${overdueCount})`, icon: AlertTriangle },
          { id: 'performance', label: 'Assessment Scores', icon: BarChart3 },
          { id: 'practical', label: 'Practical Outcomes', icon: FileText },
          { id: 'expiry', label: 'Qualification Expiry', icon: Award },
          { id: 'location_comparison', label: 'Location & Role Comparison', icon: Building2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeReportTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveReportTab(tab.id as any)}
              className={`flex items-center gap-2 py-3 px-3.5 font-semibold transition-all border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-[#007F82] text-[#007F82] bg-teal-50/20'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Printable Report Header Container */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm print-card space-y-6">
        {/* Print Only Header */}
        <div className="hidden print:block border-b border-slate-300 pb-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">AERIS Safety LMS &bull; Compliance Report</h1>
              <p className="text-xs text-slate-600">Dubai Logistics HSE Management & Control</p>
            </div>
            <span className="font-mono text-xs">{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Metric Ribbon Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#F4F7F8] border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Audited Roster</span>
            <span className="text-2xl font-extrabold text-[#111C28] font-mono mt-1 block">
              {filteredReportEmps.length}
            </span>
            <span className="text-[10px] text-slate-500">Personnel in active scope</span>
          </div>

          <div className="p-4 rounded-xl bg-teal-50/60 border border-teal-200">
            <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider block">Completion Rate</span>
            <span className="text-2xl font-extrabold text-[#007F82] font-mono mt-1 block">
              {completionRate}%
            </span>
            <span className="text-[10px] text-teal-700">{completedCount} of {totalAssigned} verified</span>
          </div>

          <div className="p-4 rounded-xl bg-red-50/60 border border-red-200">
            <span className="text-[10px] font-bold text-red-800 uppercase tracking-wider block">Overdue Modules</span>
            <span className="text-2xl font-extrabold text-[#D74757] font-mono mt-1 block">
              {overdueCount}
            </span>
            <span className="text-[10px] text-red-700">Requires escalation</span>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
            <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">In Progress</span>
            <span className="text-2xl font-extrabold text-[#659BFF] font-mono mt-1 block">
              {inProgressCount}
            </span>
            <span className="text-[10px] text-blue-700">Active enrollments</span>
          </div>
        </div>

        {/* Detailed Audit Table depending on Active Report Tab */}
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
              <tr>
                <th className="p-3 pl-4">Personnel ID</th>
                <th className="p-3">Employee Name</th>
                <th className="p-3">Role</th>
                <th className="p-3">Facility</th>
                <th className="p-3">Course / Task</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right pr-4">Score/Progress</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReportAssignments.map((a) => {
                const emp = employees.find(e => e.id === a.employeeId);
                const crs = courses.find(c => c.id === a.courseId);
                const loc = LOCATIONS.find(l => l.id === emp?.location);

                return (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="p-3 pl-4 font-mono text-slate-500">{emp?.employeeCode}</td>
                    <td className="p-3 font-semibold text-slate-900">{emp?.name}</td>
                    <td className="p-3 text-slate-600">{emp?.role}</td>
                    <td className="p-3 text-slate-600">{loc?.name}</td>
                    <td className="p-3 font-medium text-slate-800">{crs?.title}</td>
                    <td className="p-3 font-mono">{a.dueDate}</td>
                    <td className="p-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        a.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                        a.status === 'overdue' ? 'bg-red-100 text-[#D74757]' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="p-3 text-right pr-4 font-mono font-bold">
                      {a.scorePercent ? `${a.scorePercent}%` : `${a.progressPercent}%`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Export Preview Modal */}
      {exportPreviewOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in no-print">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 border border-slate-200 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-[#111C28]">Audit Export Manifest Preview</h3>
              <button onClick={() => setExportPreviewOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 font-mono text-[11px]">
              <p>Dataset: AERIS_HSE_{activeReportTab.toUpperCase()}_2026.csv</p>
              <p>Records: {filteredReportAssignments.length} rows</p>
              <p>Location Filter: {selectedLocation}</p>
              <p>Encoding: UTF-8 with RFC 4180 standard</p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setExportPreviewOpen(false)}
                className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  setExportPreviewOpen(false);
                  handleDownloadCsv();
                }}
                className="px-5 py-2 font-bold text-white bg-[#007F82] hover:bg-[#006e71] rounded-xl"
              >
                Download CSV Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
