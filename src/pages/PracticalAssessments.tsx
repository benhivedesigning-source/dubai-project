import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { LOCATIONS } from '../data/mockData';
import { PracticalAssessment, ChecklistItem } from '../types';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  RotateCcw, 
  Check, 
  X, 
  Building2, 
  AlertOctagon, 
  UploadCloud, 
  FileText, 
  ChevronRight,
  ShieldCheck,
  UserCheck,
  Search
} from 'lucide-react';

export const PracticalAssessments: React.FC = () => {
  const { 
    filteredAssessments, 
    employees, 
    courses, 
    user, 
    submitPracticalAssessment, 
    openEmployeeDetails,
    showToast,
    language 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'awaiting' | 'scheduled' | 'completed' | 'retraining_required'>('awaiting');
  const [search, setSearch] = useState('');

  // Active Assessment Evaluation Drawer/Modal State
  const [activeEvaluation, setActiveEvaluation] = useState<PracticalAssessment | null>(null);
  const [evalChecklist, setEvalChecklist] = useState<ChecklistItem[]>([]);
  const [evalObservations, setEvalObservations] = useState('');
  const [evalDecision, setEvalDecision] = useState<'pass' | 'needs_retraining'>('pass');
  const [evalRetrainReason, setEvalRetrainReason] = useState('');
  const [simulatedEvidenceFile, setSimulatedEvidenceFile] = useState<string | null>(null);

  // Tabbed assessments
  const tabbedAssessments = useMemo(() => {
    return filteredAssessments.filter((pra) => {
      const matchesTab = pra.status === activeTab;
      const emp = employees.find((e) => e.id === pra.employeeId);
      const matchesSearch = 
        pra.taskTitle.toLowerCase().includes(search.toLowerCase()) ||
        (emp?.name.toLowerCase().includes(search.toLowerCase()) || false);
      return matchesTab && matchesSearch;
    });
  }, [filteredAssessments, activeTab, search, employees]);

  // Open assessment evaluation
  const handleStartEvaluation = (pra: PracticalAssessment) => {
    setActiveEvaluation(pra);
    setEvalChecklist(JSON.parse(JSON.stringify(pra.checklist)));
    setEvalObservations(pra.supervisorObservations || '');
    setEvalDecision(pra.decision || 'pass');
    setEvalRetrainReason(pra.retrainingReason || '');
    setSimulatedEvidenceFile(pra.evidenceUploaded ? (pra.evidenceFileName || 'signed_worksheet.pdf') : null);
  };

  // Critical items check logic:
  // Cannot Pass if ANY critical item is 'needs_improvement' or 'not_observed'
  const failedOrUnobservedCriticalItems = useMemo(() => {
    return evalChecklist.filter((item) => item.isCritical && item.status !== 'pass');
  }, [evalChecklist]);

  const canPass = failedOrUnobservedCriticalItems.length === 0;

  const handleSubmitEvaluation = () => {
    if (!activeEvaluation) return;

    if (evalDecision === 'pass' && !canPass) {
      showToast(
        'Validation Protocol Error',
        `Cannot award Pass: ${failedOrUnobservedCriticalItems.length} mandatory critical checklist item(s) are failed or unobserved.`,
        'critical'
      );
      return;
    }

    if (evalDecision === 'needs_retraining' && !evalRetrainReason.trim()) {
      showToast(
        'Reason Required',
        'You must document specific justification for requiring operator retraining.',
        'warning'
      );
      return;
    }

    submitPracticalAssessment(
      activeEvaluation.id,
      evalDecision,
      evalChecklist,
      evalObservations,
      evalRetrainReason
    );

    setActiveEvaluation(null);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#007F82] uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#79E8CE]" />
            <span>Field Observation & Competency Sign-Off</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-extrabold text-[#111C28] mt-1">
            Practical Supervisor Assessments
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Hands-on machine and warehouse floor verification by certified supervisors
          </p>
        </div>

        <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-amber-900 text-xs max-w-md">
          <p className="font-semibold text-[11px] leading-tight">
            Compliance Notice: All checklist criteria represent illustrative material requiring Dubai HSE validation before legally binding operation.
          </p>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="border-b border-slate-200 flex items-center justify-between gap-4 overflow-x-auto text-xs">
        <div className="flex items-center gap-2">
          {[
            { id: 'awaiting', label: 'Awaiting Assessment', count: filteredAssessments.filter(p => p.status === 'awaiting').length, icon: AlertTriangle, color: 'text-amber-700' },
            { id: 'scheduled', label: 'Scheduled', count: filteredAssessments.filter(p => p.status === 'scheduled').length, icon: Clock, color: 'text-blue-700' },
            { id: 'completed', label: 'Completed (Certified)', count: filteredAssessments.filter(p => p.status === 'completed').length, icon: CheckCircle2, color: 'text-emerald-700' },
            { id: 'retraining_required', label: 'Retraining Required', count: filteredAssessments.filter(p => p.status === 'retraining_required').length, icon: RotateCcw, color: 'text-[#D74757]' },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-3 px-3.5 font-semibold transition-all border-b-2 whitespace-nowrap ${
                  isActive
                    ? 'border-[#007F82] text-[#007F82] bg-teal-50/20'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${tab.color}`} />
                <span>{tab.label}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 font-bold">
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Search */}
        <div className="relative w-56 hidden md:block pb-2">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search operator or task..."
            className="w-full pl-8 pr-3 py-1.5 bg-[#F4F7F8] border border-slate-200 rounded-lg text-xs"
          />
        </div>
      </div>

      {/* Assessment Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
            <tr>
              <th className="p-3.5 pl-4">Practical Task</th>
              <th className="p-3.5">Assigned Employee</th>
              <th className="p-3.5">Facility Location</th>
              <th className="p-3.5">Assessor / Supervisor</th>
              <th className="p-3.5">Date</th>
              <th className="p-3.5">Checklist Items</th>
              <th className="p-3.5 text-right pr-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tabbedAssessments.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-500">
                  No assessments found in this queue.
                </td>
              </tr>
            ) : (
              tabbedAssessments.map((pra) => {
                const emp = employees.find((e) => e.id === pra.employeeId);
                const loc = LOCATIONS.find((l) => l.id === pra.location);
                const criticalCount = pra.checklist.filter((c) => c.isCritical).length;

                return (
                  <tr key={pra.id} className="hover:bg-slate-50">
                    <td className="p-3.5 pl-4">
                      <div>
                        <span className="font-bold text-slate-900 block">{pra.taskTitle}</span>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {pra.id}</span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div
                        onClick={() => emp && openEmployeeDetails(emp.id)}
                        className="cursor-pointer hover:underline"
                      >
                        <span className="font-semibold text-slate-800">{emp?.name || 'Operator'}</span>
                        <span className="block text-[10px] text-slate-400">{emp?.role}</span>
                      </div>
                    </td>

                    <td className="p-3.5 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{loc?.name || 'Jebel Ali'}</span>
                      </div>
                    </td>

                    <td className="p-3.5 text-slate-700 font-medium">
                      {pra.supervisorName}
                    </td>

                    <td className="p-3.5 font-mono text-slate-600">
                      {pra.completedDate || pra.scheduledDate}
                    </td>

                    <td className="p-3.5 font-mono">
                      <span>{pra.checklist.length} items</span>
                      <span className="text-[10px] text-red-600 ml-1.5 font-semibold">({criticalCount} Critical)</span>
                    </td>

                    <td className="p-3.5 text-right pr-4">
                      <button
                        onClick={() => handleStartEvaluation(pra)}
                        className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 ml-auto ${
                          pra.status === 'awaiting'
                            ? 'bg-[#007F82] hover:bg-[#006e71] text-white shadow-sm'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <ClipboardCheck className="w-3.5 h-3.5" />
                        <span>{pra.status === 'awaiting' ? 'Start Assessment' : 'View Checklist'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Interactive Assessment Evaluation Workspace Modal */}
      {activeEvaluation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col border border-slate-200 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 bg-[#111C28] text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#007F82] text-white font-bold uppercase tracking-wider">
                    Practical Evaluation Workspace
                  </span>
                  <span className="text-xs text-slate-400">Assessor: {user?.name || 'Tariq Al-Hashemi'}</span>
                </div>
                <h3 className="font-extrabold text-base text-white mt-1">
                  {activeEvaluation.taskTitle}
                </h3>
              </div>
              <button onClick={() => setActiveEvaluation(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Operator and Course Banner */}
            <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Candidate</span>
                <span className="font-bold text-slate-900">
                  {employees.find(e => e.id === activeEvaluation.employeeId)?.name || 'Operator'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Facility Location</span>
                <span className="font-semibold text-slate-800">
                  {LOCATIONS.find(l => l.id === activeEvaluation.location)?.name}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Observation Date</span>
                <span className="font-mono font-semibold text-slate-800">
                  {activeEvaluation.scheduledDate}
                </span>
              </div>
            </div>

            {/* Checklist Body */}
            <div className="p-6 overflow-y-auto flex-1 text-xs space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm text-[#111C28]">
                    HSE Operational Checklist
                  </h4>
                  <span className="text-[11px] text-slate-500 italic">
                    Critical items must be passed to certify overall competence.
                  </span>
                </div>

                <div className="space-y-3">
                  {evalChecklist.map((item, idx) => (
                    <div
                      key={item.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        item.isCritical
                          ? item.status === 'pass'
                            ? 'bg-emerald-50/40 border-emerald-300'
                            : 'bg-red-50/40 border-red-300'
                          : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-400 text-[11px]">#{idx + 1}</span>
                            <span className="font-semibold text-slate-900 leading-snug">{item.task}</span>
                            {item.isCritical && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-[#D74757] uppercase font-mono tracking-wider shrink-0">
                                Required Critical
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Tri-state buttons */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...evalChecklist];
                              updated[idx].status = 'pass';
                              setEvalChecklist(updated);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                              item.status === 'pass'
                                ? 'bg-[#007F82] text-white shadow-sm'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                            }`}
                          >
                            Pass
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...evalChecklist];
                              updated[idx].status = 'needs_improvement';
                              setEvalChecklist(updated);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                              item.status === 'needs_improvement'
                                ? 'bg-[#D99824] text-white shadow-sm'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                            }`}
                          >
                            Needs Imp.
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...evalChecklist];
                              updated[idx].status = 'not_observed';
                              setEvalChecklist(updated);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                              item.status === 'not_observed'
                                ? 'bg-slate-800 text-white shadow-sm'
                                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                            }`}
                          >
                            Not Observed
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Supervisor Observations Text */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Supervisor Field Observations & Notes
                </label>
                <textarea
                  rows={3}
                  value={evalObservations}
                  onChange={(e) => setEvalObservations(e.target.value)}
                  placeholder="Record exact operational remarks, equipment telemetry notes, or physical observations..."
                  className="w-full px-3.5 py-2.5 bg-[#F4F7F8] border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#007F82]"
                />
              </div>

              {/* Evidence Upload Simulation */}
              <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 block">Practical Evidence & Signed Worksheet</span>
                  <span className="text-[11px] text-slate-500">
                    {simulatedEvidenceFile ? `Attached: ${simulatedEvidenceFile}` : 'Optional photo or physical sign-off sheet'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSimulatedEvidenceFile('worksheet_photo_verified.jpg');
                    showToast('Evidence Uploaded', 'Sample photo attachment attached to audit manifest.', 'info');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-[#007F82] text-xs font-semibold text-slate-700 flex items-center gap-1.5"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-[#007F82]" />
                  <span>Attach Evidence</span>
                </button>
              </div>

              {/* Decision Section */}
              <div className="p-4 rounded-xl bg-[#F4F7F8] border border-slate-200 space-y-3">
                <span className="font-bold text-slate-900 block">Final Competency Decision:</span>

                <div className="grid grid-cols-2 gap-3">
                  <label className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                    evalDecision === 'pass' ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-slate-200'
                  }`}>
                    <input
                      type="radio"
                      name="eval-dec"
                      checked={evalDecision === 'pass'}
                      onChange={() => setEvalDecision('pass')}
                      className="mt-0.5 text-emerald-600"
                    />
                    <div>
                      <span className="font-bold text-emerald-900">Pass (Certified Operator)</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">Authorizes independent operation and issues safety certificate.</p>
                    </div>
                  </label>

                  <label className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-2.5 ${
                    evalDecision === 'needs_retraining' ? 'bg-red-50 border-red-500' : 'bg-white border-slate-200'
                  }`}>
                    <input
                      type="radio"
                      name="eval-dec"
                      checked={evalDecision === 'needs_retraining'}
                      onChange={() => setEvalDecision('needs_retraining')}
                      className="mt-0.5 text-red-600"
                    />
                    <div>
                      <span className="font-bold text-red-900">Retraining Required</span>
                      <p className="text-[10px] text-slate-500 mt-0.5">Flags worker record and suspends independent machinery handling.</p>
                    </div>
                  </label>
                </div>

                {/* Critical Validation Warning when Pass selected but critical items failed */}
                {evalDecision === 'pass' && !canPass && (
                  <div className="p-3 rounded-lg bg-red-100 border border-red-300 text-red-900 flex items-center gap-2">
                    <AlertOctagon className="w-4 h-4 text-[#D74757] shrink-0" />
                    <span className="font-semibold text-[11px]">
                      Validation Block: {failedOrUnobservedCriticalItems.length} required critical items are not passed. You cannot award a Pass decision.
                    </span>
                  </div>
                )}

                {/* Reason for Retraining input */}
                {evalDecision === 'needs_retraining' && (
                  <div>
                    <label className="block font-bold text-red-900 mb-1">
                      Mandatory Reason for Retraining *
                    </label>
                    <input
                      type="text"
                      required
                      value={evalRetrainReason}
                      onChange={(e) => setEvalRetrainReason(e.target.value)}
                      placeholder="e.g. Failed critical blind-spot horn safety check. Requires 4 hours supervised simulator."
                      className="w-full px-3 py-2 bg-white border border-red-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-400"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
              <span className="text-slate-500">
                Sign-off: <strong>{user?.name || 'Assessor'}</strong> &bull; Dubai Logistics HSE Log
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveEvaluation(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-200 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmitEvaluation}
                  disabled={evalDecision === 'pass' && !canPass}
                  className="px-5 py-2 font-bold text-white bg-[#007F82] hover:bg-[#006e71] disabled:opacity-40 rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Submit Sign-Off & Update Audit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
