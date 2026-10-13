import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { LOCATIONS } from '../data/mockData';
import { Qualification } from '../types';
import { 
  ArrowLeft, 
  Building2, 
  UserCheck, 
  Mail, 
  Calendar, 
  Award, 
  ClipboardCheck, 
  BookOpen, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Plus, 
  FileText, 
  TrendingUp, 
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Check,
  Eye
} from 'lucide-react';
import { CertificateModal } from '../components/common/CertificateModal';

export const EmployeeDetails: React.FC = () => {
  const { 
    selectedEmployeeId, 
    employees, 
    courses, 
    assignments, 
    practicalAssessments, 
    qualifications, 
    activityLogs,
    setCurrentScreen,
    assignCoursesToEmployees,
    scheduleNewPracticalAssessment,
    recordQualification,
    showToast,
    language
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'assigned_courses' | 'assessment_results' | 'qualifications' | 'practical_signoffs' | 'activity_history'
  >('overview');

  // Certificate Modal Preview
  const [previewCert, setPreviewCert] = useState<Qualification | null>(null);

  // Modals for actions
  const [assignCourseModalOpen, setAssignCourseModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState('c2');
  const [dueDate, setDueDate] = useState(
    new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  const [schedulePraModalOpen, setSchedulePraModalOpen] = useState(false);
  const [praCourseId, setPraCourseId] = useState('c2');
  const [praTaskTitle, setPraTaskTitle] = useState('Reach Truck Pre-Shift Evaluation');
  const [praDate, setPraDate] = useState(
    new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  const [recordQualModalOpen, setRecordQualModalOpen] = useState(false);
  const [qualTitle, setQualTitle] = useState('Dubai Civil Defence Fire Warden');
  const [qualOrg, setQualOrg] = useState('Dubai Civil Defence');
  const [qualExpiry, setQualExpiry] = useState(
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Active employee resolution (default to emp-101 if none selected)
  const employee = useMemo(() => {
    return employees.find((e) => e.id === selectedEmployeeId) || employees[0];
  }, [employees, selectedEmployeeId]);

  const loc = LOCATIONS.find((l) => l.id === employee?.location);

  // Filtered relations
  const empAssignments = useMemo(() => {
    return assignments.filter((a) => a.employeeId === employee?.id);
  }, [assignments, employee]);

  const empAssessments = useMemo(() => {
    return practicalAssessments.filter((p) => p.employeeId === employee?.id);
  }, [practicalAssessments, employee]);

  const empQualifications = useMemo(() => {
    return qualifications.filter((q) => q.employeeId === employee?.id);
  }, [qualifications, employee]);

  const empLogs = useMemo(() => {
    return activityLogs.filter((l) => l.employeeId === employee?.id);
  }, [activityLogs, employee]);

  if (!employee) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>No employee selected.</p>
        <button onClick={() => setCurrentScreen('employees')} className="mt-4 px-4 py-2 bg-[#007F82] text-white rounded-xl">
          Return to Directory
        </button>
      </div>
    );
  }

  const completionRate = empAssignments.length > 0
    ? Math.round(
        (empAssignments.filter((a) => a.status === 'completed').length / empAssignments.length) * 100
      )
    : 100;

  // Handlers
  const handleAssignCourse = (e: React.FormEvent) => {
    e.preventDefault();
    assignCoursesToEmployees([selectedCourseId], [employee.id], dueDate, '7_days_before');
    setAssignCourseModalOpen(false);
  };

  const handleSchedulePractical = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleNewPracticalAssessment(employee.id, praCourseId, praTaskTitle, praDate, employee.supervisorName);
    setSchedulePraModalOpen(false);
  };

  const handleRecordQual = (e: React.FormEvent) => {
    e.preventDefault();
    recordQualification({
      employeeId: employee.id,
      title: qualTitle,
      type: 'external_qualification',
      issuingOrganization: qualOrg,
      issueDate: new Date().toISOString().split('T')[0],
      expiryDate: qualExpiry,
      status: 'valid',
      remindersEnabled: true
    });
    setRecordQualModalOpen(false);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Back button */}
      <div>
        <button
          onClick={() => setCurrentScreen('employees')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#007F82] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Workforce Directory</span>
        </button>
      </div>

      {/* Prominent Profile Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Avatar and Info */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#111C28] to-[#007F82] text-white flex items-center justify-center font-extrabold text-xl font-mono shadow-md border-2 border-white shrink-0">
              {employee.initials}
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl lg:text-2xl font-extrabold text-[#111C28]">
                  {employee.name}
                </h2>
                <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-bold border border-slate-200">
                  {employee.employeeCode}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                  Active
                </span>
              </div>

              <p className="text-xs font-semibold text-[#007F82] mt-0.5">
                {employee.role}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2.5">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>{loc?.name || 'Dubai Hub'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Supervisor: <strong>{employee.supervisorName}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Joined: {employee.joinDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="p-3 rounded-xl bg-[#F4F7F8] border border-slate-200 text-center min-w-[110px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Compliance
              </span>
              <span className="text-xl font-extrabold font-mono text-[#007F82]">
                {completionRate}%
              </span>
              <span className="text-[10px] text-slate-500 block">
                {empAssignments.filter(a => a.status === 'completed').length}/{empAssignments.length} courses
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setAssignCourseModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#007F82] hover:bg-[#006e71] text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Assign Course</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSchedulePraModalOpen(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-[#007F82] text-slate-700 text-xs font-semibold transition-all flex items-center gap-1"
                >
                  <ClipboardCheck className="w-3.5 h-3.5 text-[#007F82]" />
                  <span>Assess</span>
                </button>
                <button
                  onClick={() => setRecordQualModalOpen(true)}
                  className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-300 hover:border-[#007F82] text-slate-700 text-xs font-semibold transition-all flex items-center gap-1"
                >
                  <Award className="w-3.5 h-3.5 text-[#007F82]" />
                  <span>Record Lic</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
        {[
          { id: 'overview', label: 'Overview', icon: TrendingUp },
          { id: 'assigned_courses', label: `Assigned Courses (${empAssignments.length})`, icon: BookOpen },
          { id: 'assessment_results', label: 'Assessment Results', icon: FileText },
          { id: 'qualifications', label: `Qualifications (${empQualifications.length})`, icon: Award },
          { id: 'practical_signoffs', label: `Practical Sign-offs (${empAssessments.length})`, icon: ClipboardCheck },
          { id: 'activity_history', label: 'Activity History', icon: Clock },
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
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Course Status</span>
              <div className="flex items-baseline gap-2 font-mono">
                <span className="text-2xl font-extrabold text-[#111C28]">
                  {empAssignments.filter(a => a.status === 'completed').length}
                </span>
                <span className="text-xs text-slate-500">/ {empAssignments.length} verified</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#007F82] rounded-full" style={{ width: `${completionRate}%` }} />
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Field Practical Sign-Offs</span>
              <div className="flex items-baseline gap-2 font-mono">
                <span className="text-2xl font-extrabold text-[#007F82]">
                  {empAssessments.filter(a => a.status === 'completed').length}
                </span>
                <span className="text-xs text-slate-500">certified</span>
              </div>
              <p className="text-[11px] text-slate-500">
                {empAssessments.filter(a => a.status === 'awaiting').length} pending evaluation
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Statutory Licences</span>
              <div className="flex items-baseline gap-2 font-mono">
                <span className="text-2xl font-extrabold text-slate-900">
                  {empQualifications.length}
                </span>
                <span className="text-xs text-slate-500">records</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Status: <strong className="text-emerald-700 capitalize">{employee.qualificationStatus.replace('_', ' ')}</strong>
              </p>
            </div>
          </div>

          {/* Overdue alert banner if any */}
          {employee.overdueCount > 0 && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-xs text-red-900">
              <AlertCircle className="w-5 h-5 text-[#D74757] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Critical Attention Required</h4>
                <p className="mt-0.5 text-slate-700">
                  This employee has {employee.overdueCount} overdue safety training assignment(s). Under Dubai Logistics safety mandate, high-risk warehouse equipment operation is restricted until compliance re-certification is completed.
                </p>
              </div>
            </div>
          )}

          {/* Quick Recent Courses Preview */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-[#111C28]">Active Training Curriculum</h3>
            <div className="divide-y divide-slate-100 text-xs">
              {empAssignments.map((a) => {
                const crs = courses.find((c) => c.id === a.courseId);
                return (
                  <div key={a.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{crs?.title || 'Safety Course'}</p>
                      <p className="text-[11px] text-slate-500 font-mono">Due: {a.dueDate} &bull; Attempts: {a.attemptsCount}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        a.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                        a.status === 'overdue' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {a.status.toUpperCase()}
                      </span>
                      <span className="font-mono font-bold">{a.progressPercent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Assigned Courses */}
      {activeTab === 'assigned_courses' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
              <tr>
                <th className="p-3.5">Course Title</th>
                <th className="p-3.5">Assigned Date</th>
                <th className="p-3.5">Due Date</th>
                <th className="p-3.5">Progress</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Score</th>
                <th className="p-3.5 text-right pr-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {empAssignments.map((a) => {
                const crs = courses.find((c) => c.id === a.courseId);
                return (
                  <tr key={a.id} className="hover:bg-slate-50">
                    <td className="p-3.5 font-bold text-slate-900">
                      {crs?.code} - {crs?.title}
                    </td>
                    <td className="p-3.5 font-mono text-slate-600">{a.assignedDate}</td>
                    <td className="p-3.5 font-mono font-semibold text-slate-800">{a.dueDate}</td>
                    <td className="p-3.5 w-36">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#007F82]" style={{ width: `${a.progressPercent}%` }} />
                        </div>
                        <span className="font-mono">{a.progressPercent}%</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        a.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                        a.status === 'overdue' ? 'bg-red-100 text-[#D74757]' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono font-bold">
                      {a.scorePercent ? `${a.scorePercent}%` : '-'}
                    </td>
                    <td className="p-3.5 text-right pr-4">
                      {a.status === 'completed' ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> {language === 'ar' ? 'معتمد' : 'Certified'}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setPreviewCert({
                                id: `crt-${a.id}`,
                                employeeId: employee.id,
                                title: crs?.title || 'Safety Certification',
                                titleAr: crs?.titleAr || 'اعتماد السلامة المهنية',
                                type: 'internal_certificate',
                                issuingOrganization: 'AERIS Safety Academy',
                                issuingOrganizationAr: 'أكاديمية آيريس للسلامة',
                                licenseNumber: `AER-${crs?.code || 'CRS'}-${employee.employeeCode}`,
                                issueDate: a.completedDate || '2026-10-01',
                                status: 'valid',
                                remindersEnabled: false
                              });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-[#007F82] font-bold text-[10px] flex items-center gap-1 transition-colors"
                            title="View Official Certificate"
                          >
                            <Eye className="w-3 h-3" />
                            <span>{language === 'ar' ? 'عرض الشهادة' : 'View Cert'}</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            showToast('Curriculum Preview', `Opening module "${crs?.title}" learner player.`, 'info');
                            setCurrentScreen('course_management');
                          }}
                          className="px-2.5 py-1 rounded bg-[#007F82] text-white font-semibold text-[11px]"
                        >
                          Review Content
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Assessment Results */}
      {activeTab === 'assessment_results' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4 text-xs">
          <h3 className="font-bold text-sm text-[#111C28]">Knowledge Check & Quiz Results</h3>
          <p className="text-slate-500">Official HSE exam scores and attempt histories recorded in AERIS testing engine.</p>

          <div className="space-y-3">
            {empAssignments.filter(a => a.scorePercent !== undefined).map((a) => {
              const crs = courses.find(c => c.id === a.courseId);
              return (
                <div key={a.id} className="p-4 rounded-xl border border-slate-200 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{crs?.title}</h4>
                    <p className="text-[11px] text-slate-500">Completed on: {a.completedDate} &bull; Attempts: {a.attemptsCount}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-extrabold font-mono text-[#007F82]">{a.scorePercent}%</span>
                    <span className="block text-[10px] text-slate-400">Pass benchmark: {crs?.passMarkPercent || 80}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Qualifications */}
      {activeTab === 'qualifications' && (
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#111C28]">Accreditations & Regulatory Licences</h3>
            <button
              onClick={() => setRecordQualModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#007F82] text-white font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record New Licence</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {empQualifications.map((q) => (
              <div key={q.id} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase font-bold">
                      {q.type === 'internal_certificate' ? 'Internal Certificate' : 'Statutory License'}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900 mt-1.5">{q.title}</h4>
                    <p className="text-slate-500 text-[11px]">{q.issuingOrganization}</p>
                  </div>
                  <Award className="w-5 h-5 text-[#007F82]" />
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                  <div>
                    <span className="text-slate-400 block">{language === 'ar' ? 'تاريخ الإصدار' : 'Issue Date'}</span>
                    <span className="font-semibold text-slate-700">{q.issueDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{language === 'ar' ? 'تاريخ الانتهاء' : 'Expiry Date'}</span>
                    <span className="font-semibold text-slate-700">{q.expiryDate || (language === 'ar' ? 'صلاحية غير محددة' : 'No Expiry')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{language === 'ar' ? 'الحالة' : 'Status'}</span>
                    <span className={`font-bold capitalize ${
                      q.status === 'valid' ? 'text-emerald-700' :
                      q.status === 'expiring_soon' ? 'text-amber-700' : 'text-[#D74757]'
                    }`}>
                      {q.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => setPreviewCert(q)}
                      className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-[#007F82] font-bold text-[10px] flex items-center gap-1 transition-colors shadow-sm"
                      title="View Official Certificate"
                    >
                      <Eye className="w-3 h-3" />
                      <span>{language === 'ar' ? 'الشهادة' : 'View Cert'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 5: Practical Sign-offs */}
      {activeTab === 'practical_signoffs' && (
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#111C28]">Supervisor On-Site Evaluations</h3>
            <button
              onClick={() => setSchedulePraModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-[#007F82] text-white font-bold flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Schedule Assessment</span>
            </button>
          </div>

          <div className="space-y-3">
            {empAssessments.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
                No practical evaluations recorded yet.
              </div>
            ) : (
              empAssessments.map((pra) => (
                <div key={pra.id} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{pra.taskTitle}</h4>
                      <p className="text-slate-500 text-[11px]">Assessor: {pra.supervisorName} &bull; Date: {pra.scheduledDate}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      pra.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                      pra.status === 'retraining_required' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {pra.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  {pra.supervisorObservations && (
                    <div className="p-3 rounded-xl bg-[#F4F7F8] text-slate-700 italic border border-slate-200">
                      &ldquo;{pra.supervisorObservations}&rdquo;
                    </div>
                  )}

                  {pra.retrainingReason && (
                    <div className="p-2.5 rounded-xl bg-red-50 text-red-900 font-semibold border border-red-200">
                      Retraining Notice: {pra.retrainingReason}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <span>Evidence attached: {pra.evidenceUploaded ? (pra.evidenceFileName || 'Verified') : 'Pending'}</span>
                    <button
                      onClick={() => setCurrentScreen('practical_assessments')}
                      className="text-[#007F82] font-semibold hover:underline"
                    >
                      Open in Assessment Workspace &rarr;
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab 6: Activity History */}
      {activeTab === 'activity_history' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4 text-xs">
          <h3 className="font-bold text-sm text-[#111C28]">Chronological Compliance Timeline</h3>
          <div className="relative border-l-2 border-slate-200 ml-3 pl-4 space-y-6">
            {empLogs.length === 0 ? (
              <p className="text-slate-400">No activity logged yet.</p>
            ) : (
              empLogs.map((log) => (
                <div key={log.id} className="relative">
                  <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-[#007F82] border-2 border-white" />
                  <span className="text-[10px] font-mono text-slate-400">{log.timestamp}</span>
                  <p className="font-bold text-slate-800 mt-0.5">{log.actorName}</p>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">{log.description}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal: Assign Course */}
      {assignCourseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 text-xs">
            <h3 className="font-bold text-base text-[#111C28]">Assign Course to {employee.name}</h3>
            <form onSubmit={handleAssignCourse} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Safety Module</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Completion Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAssignCourseModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#007F82] hover:bg-[#006e71] rounded-xl shadow-md"
                >
                  Assign Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Schedule Practical Assessment */}
      {schedulePraModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 text-xs">
            <h3 className="font-bold text-base text-[#111C28]">Schedule Practical Field Sign-Off</h3>
            <form onSubmit={handleSchedulePractical} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Practical Task</label>
                <input
                  type="text"
                  value={praTaskTitle}
                  onChange={(e) => setPraTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Course Association</label>
                <select
                  value={praCourseId}
                  onChange={(e) => setPraCourseId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Observation Date</label>
                <input
                  type="date"
                  value={praDate}
                  onChange={(e) => setPraDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSchedulePraModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#007F82] hover:bg-[#006e71] rounded-xl shadow-md"
                >
                  Schedule Evaluation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Record Qualification */}
      {recordQualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4 text-xs">
            <h3 className="font-bold text-base text-[#111C28]">Record Regulatory Licence</h3>
            <form onSubmit={handleRecordQual} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Licence / Certificate Name</label>
                <input
                  type="text"
                  required
                  value={qualTitle}
                  onChange={(e) => setQualTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Issuing Authority</label>
                <input
                  type="text"
                  required
                  value={qualOrg}
                  onChange={(e) => setQualOrg(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={qualExpiry}
                  onChange={(e) => setQualExpiry(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl font-mono"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRecordQualModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#007F82] hover:bg-[#006e71] rounded-xl shadow-md"
                >
                  Save Licence
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Official Certificate (CRT) Modal Preview */}
      {previewCert && (
        <CertificateModal
          qualification={previewCert}
          employee={employee}
          course={courses.find(c => c.title === previewCert.title || c.titleAr === previewCert.titleAr)}
          onClose={() => setPreviewCert(null)}
        />
      )}
    </div>
  );
};
