import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { LOCATIONS } from '../data/mockData';
import { LocationId } from '../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ClipboardCheck, 
  Award, 
  Users, 
  ArrowRight, 
  Clock, 
  TrendingUp, 
  AlertOctagon, 
  Building2, 
  Plus, 
  Sparkles, 
  Send, 
  Calendar,
  Filter,
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { 
    user, 
    setCurrentScreen, 
    openEmployeeDetails, 
    selectedLocation, 
    setSelectedLocation,
    filteredEmployees, 
    filteredAssignments, 
    filteredAssessments,
    qualifications,
    activityLogs,
    simulateReminder,
    language,
    t
  } = useApp();

  const [dateRange, setDateRange] = useState<'30d' | '90d' | 'ytd'>('30d');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Computed live metrics based on filtered records
  const totalEmployees = filteredEmployees.length;

  const totalAssigned = filteredAssignments.length;
  const completedAssignments = filteredAssignments.filter((a) => a.status === 'completed').length;
  const overdueAssignments = filteredAssignments.filter((a) => a.status === 'overdue').length;
  const inProgressAssignments = filteredAssignments.filter((a) => a.status === 'in_progress').length;
  const notStartedAssignments = filteredAssignments.filter((a) => a.status === 'not_started').length;

  const completionRate = totalAssigned > 0 
    ? Math.round((completedAssignments / totalAssigned) * 100) 
    : 0;

  // Pending practical assessments
  const pendingAssessments = filteredAssessments.filter(
    (a) => a.status === 'awaiting' || a.status === 'scheduled'
  ).length;

  // Expiring qualifications (< 30 days or marked expiring_soon)
  const expiringQualifications = useMemo(() => {
    const empIds = new Set(filteredEmployees.map((e) => e.id));
    return qualifications.filter(
      (q) => empIds.has(q.employeeId) && (q.status === 'expiring_soon' || q.status === 'expired')
    );
  }, [qualifications, filteredEmployees]);

  // Priority action list items
  const priorityItems = useMemo(() => {
    const items: Array<{
      id: string;
      employeeId: string;
      employeeName: string;
      issue: string;
      locationName: string;
      dueDate: string;
      actionLabel: string;
      actionType: 'assess' | 'remind' | 'renew';
      targetId: string;
      severity: 'critical' | 'warning';
    }> = [];

    // Overdue course assignments
    filteredAssignments
      .filter((a) => a.status === 'overdue')
      .slice(0, 3)
      .forEach((a) => {
        const emp = filteredEmployees.find((e) => e.id === a.employeeId);
        if (emp) {
          const loc = LOCATIONS.find((l) => l.id === emp.location);
          items.push({
            id: `p-asg-${a.id}`,
            employeeId: emp.id,
            employeeName: language === 'ar' ? emp.nameAr : emp.name,
            issue: language === 'ar' ? 'دورة تدريبية متأخرة' : 'Overdue compliance course',
            locationName: (language === 'ar' ? loc?.nameAr : loc?.name) || 'Dubai Hub',
            dueDate: a.dueDate,
            actionLabel: language === 'ar' ? 'إرسال تنبيه' : 'Dispatch Reminder',
            actionType: 'remind',
            targetId: a.id,
            severity: 'critical'
          });
        }
      });

    // Awaiting practical assessments
    filteredAssessments
      .filter((p) => p.status === 'awaiting')
      .slice(0, 2)
      .forEach((p) => {
        const emp = filteredEmployees.find((e) => e.id === p.employeeId);
        const loc = LOCATIONS.find((l) => l.id === p.location);
        items.push({
          id: `p-pra-${p.id}`,
          employeeId: p.employeeId,
          employeeName: (language === 'ar' ? emp?.nameAr : emp?.name) || (language === 'ar' ? 'مشغل معتمد' : 'Assigned Operator'),
          issue: p.taskTitle,
          locationName: (language === 'ar' ? loc?.nameAr : loc?.name) || 'Jebel Ali',
          dueDate: p.scheduledDate,
          actionLabel: language === 'ar' ? 'بدء التقييم' : 'Start Practical Review',
          actionType: 'assess',
          targetId: p.id,
          severity: 'warning'
        });
      });

    return items;
  }, [filteredAssignments, filteredAssessments, filteredEmployees, language]);

  // Operational rule-based summary text (accurate in EN and AR)
  const operationalSummary = useMemo(() => {
    const locObj = LOCATIONS.find((l) => l.id === selectedLocation);
    const locName = selectedLocation === 'all' 
      ? (language === 'ar' ? 'جميع المنشآت اللوجستية في الإمارات' : 'All UAE Logistics Hubs')
      : (language === 'ar' ? (locObj?.nameAr || locObj?.name) : locObj?.name) || 'Selected Hub';
    
    if (language === 'ar') {
      if (overdueAssignments > 0) {
        return `${locName}: معدل الامتثال التشغيلي يبلغ ${completionRate}% عبر ${totalEmployees} من الكوادر النشطة. يوجد حالياً ${overdueAssignments} مهمة تدريبية متأخرة، و ${pendingAssessments} تقييماً عملياً معلقاً يتطلب اعتماد المشرف هذا الأسبوع.`;
      }
      return `${locName}: المنشأة تعمل ضمن النطاق الأخضر الكامل لمعايير السلامة بمعدل إنجاز تدريبي عام ${completionRate}%. لا توجد أي متأخرات تدريبية مسجلة حالياً.`;
    }

    if (overdueAssignments > 0) {
      return `${locName}: Operational compliance stands at ${completionRate}% across ${totalEmployees} active personnel. ${overdueAssignments} course assignments are currently overdue, and ${pendingAssessments} practical machine sign-offs require supervisor evaluation this week.`;
    }
    return `${locName}: Facility operating within full green safety parameters at ${completionRate}% overall training completion. No overdue training flags currently logged.`;
  }, [selectedLocation, completionRate, totalEmployees, overdueAssignments, pendingAssessments, language]);

  // Location comparison data
  const locationComparison = useMemo(() => {
    return LOCATIONS.map((loc) => {
      const locEmps = filteredEmployees.filter((e) => e.location === loc.id);
      const locEmpIds = new Set(locEmps.map((e) => e.id));
      const locAsgs = filteredAssignments.filter((a) => locEmpIds.has(a.employeeId));
      const locCompleted = locAsgs.filter((a) => a.status === 'completed').length;
      const rate = locAsgs.length > 0 ? Math.round((locCompleted / locAsgs.length) * 100) : 85;
      return {
        id: loc.id,
        name: language === 'ar' ? loc.nameAr : loc.name,
        code: loc.code,
        employeesCount: locEmps.length,
        completionRate: rate,
        overdueCount: locAsgs.filter((a) => a.status === 'overdue').length
      };
    });
  }, [filteredEmployees, filteredAssignments, language]);

  return (
    <div className="p-6 lg:p-8 space-y-7 max-w-7xl mx-auto">
      {/* Top Greeting & Operational Summary */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm relative overflow-hidden">
        {/* Kinetic subtle corner lines */}
        <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <path d="M 100 0 L 0 100 M 100 30 L 30 100 M 100 60 L 60 100" stroke="#007F82" strokeWidth="2" fill="none" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-[13px] font-medium text-[#007F82]">
              <span className="w-2 h-2 rounded-full bg-[#79E8CE] animate-pulse" />
              <span>{t.controlRoomStatus}</span>
            </div>
            <h2 className="text-[28px] lg:text-[32px] font-semibold text-[#111C28] mt-1 leading-tight">
              {t.goodDay}{' '}
              {language === 'ar' ? (user?.nameAr || user?.name) : user?.name || 'Operations Lead'}
            </h2>
            <p className="text-[16px] text-slate-600 mt-2 max-w-3xl leading-relaxed font-normal">
              {operationalSummary}
            </p>
          </div>

          {/* Quick Action Shortcuts */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setCurrentScreen('training_assignments')}
              className="px-4 py-2.5 rounded-xl bg-[#007F82] text-white text-[14px] font-medium hover:bg-[#006e71] shadow-sm flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{t.assignTraining}</span>
            </button>
            <button
              onClick={() => setCurrentScreen('practical_assessments')}
              className="px-4 py-2.5 rounded-xl bg-white border border-slate-300 text-slate-700 hover:border-[#007F82] text-[14px] font-medium flex items-center gap-2 transition-all"
            >
              <ClipboardCheck className="w-4 h-4 text-[#007F82]" />
              <span>{language === 'ar' ? `التقييمات (${pendingAssessments})` : `Assessments (${pendingAssessments})`}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Filters Bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-[14px]">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-slate-500 font-normal text-[13px]">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>{language === 'ar' ? 'النطاق النشط:' : 'Active scope:'}</span>
            </div>

            {/* Location Select */}
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value as LocationId)}
              className="px-3 py-1.5 bg-[#F4F7F8] border border-slate-200 rounded-lg text-[14px] font-normal text-slate-800 focus:outline-none"
            >
              <option value="all">{t.allLocations}</option>
              {LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>{language === 'ar' ? loc.nameAr : loc.name}</option>
              ))}
            </select>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-1.5 bg-[#F4F7F8] border border-slate-200 rounded-lg text-[14px] font-normal text-slate-800 focus:outline-none"
            >
              <option value="all">{t.allRoles}</option>
              <option value="Forklift Operator">{language === 'ar' ? 'مشغلو الرافعات الشوكية' : 'Forklift Operators'}</option>
              <option value="Warehouse Associate">{language === 'ar' ? 'مساعدو المستودعات' : 'Warehouse Associates'}</option>
              <option value="Driver">{language === 'ar' ? 'السائقون' : 'Drivers'}</option>
              <option value="Loading Supervisor">{language === 'ar' ? 'مشرفو التحميل' : 'Loading Supervisors'}</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-[#F4F7F8] p-0.5 rounded-lg border border-slate-200">
            {(['30d', '90d', 'ytd'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setDateRange(r)}
                className={`px-3 py-1 rounded-md text-[13px] font-medium transition-all ${
                  dateRange === r ? 'bg-white text-[#007F82] shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Row 1: Distinctive Primary KPI Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Large Highlight Card: Training Completion Rate */}
        <div 
          onClick={() => setCurrentScreen('reports')}
          className="lg:col-span-4 bg-gradient-to-br from-[#111C28] via-[#162433] to-[#0d1620] rounded-2xl p-6 text-white border border-[#223547] shadow-lg flex flex-col justify-between cursor-pointer group hover:border-[#79E8CE]/60 transition-all"
        >
          <div>
            <div className="flex items-center justify-between text-[13px]">
              <span className="text-[#79E8CE] font-normal">
                {t.overallCompliance}
              </span>
              <span className="text-[12px] px-2 py-0.5 rounded-full bg-[#007F82]/40 text-[#79E8CE] border border-[#79E8CE]/30 font-normal">
                {language === 'ar' ? 'بيانات لحظية' : 'Live data'}
              </span>
            </div>

            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-[36px] lg:text-[40px] font-semibold tabular-nums text-white leading-none">
                {completionRate}%
              </span>
              <span className="text-[13px] text-slate-300 font-normal">
                {t.targetBenchmark}
              </span>
            </div>

            <p className="text-[14px] text-slate-300 mt-2.5 leading-relaxed font-normal">
              {language === 'ar' 
                ? `تم إتمام ${completedAssignments} من أصل ${totalAssigned} وحدة تدريبية عبر القوائم النشطة.`
                : `${completedAssignments} of ${totalAssigned} training modules completed across active rosters.`}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700/60">
            {/* Visual Progress Bar */}
            <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700">
              <div 
                className="h-full bg-gradient-to-r from-[#007F82] to-[#79E8CE] rounded-full transition-all duration-700"
                style={{ width: `${completionRate}%` }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-[13px] text-slate-300 group-hover:text-white transition-colors font-medium">
              <span>{t.inspectFullReports}</span>
              <ChevronRight className="w-4 h-4 text-[#79E8CE] group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* 4 Action-Focused KPI Metric Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card 2: Overdue Training */}
          <div 
            onClick={() => setCurrentScreen('employees')}
            className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-[#D74757]/60 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-normal text-slate-500">
                {t.overdueTraining}
              </span>
              <div className="w-8 h-8 rounded-xl bg-red-50 text-[#D74757] flex items-center justify-center">
                <AlertOctagon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-[32px] lg:text-[36px] font-semibold text-[#D74757] tabular-nums leading-none">
                  {overdueAssignments}
                </span>
                <span className="text-[13px] text-slate-400 font-normal">{language === 'ar' ? 'مهام تدريبية' : 'assignments'}</span>
              </div>
              <p className="text-[13px] text-slate-500 mt-1.5 font-normal">
                {t.requiringEscalation}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[14px] font-medium text-[#007F82] group-hover:translate-x-0.5 transition-transform">
              <span>{t.viewOverdueStaff}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Pending Practical Assessments */}
          <div 
            onClick={() => setCurrentScreen('practical_assessments')}
            className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-[#D99824]/60 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-normal text-slate-500">
                {t.pendingAssessments}
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-[#D99824] flex items-center justify-center">
                <ClipboardCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-[32px] lg:text-[36px] font-semibold text-[#D99824] tabular-nums leading-none">
                  {pendingAssessments}
                </span>
                <span className="text-[13px] text-slate-400 font-normal">{language === 'ar' ? 'تقييمات ميدانية' : 'evaluations'}</span>
              </div>
              <p className="text-[13px] text-slate-500 mt-1.5 font-normal">
                {t.supervisorPending}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[14px] font-medium text-[#007F82] group-hover:translate-x-0.5 transition-transform">
              <span>{t.reviewSupervisorQueue}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: Expiring Qualifications */}
          <div 
            onClick={() => setCurrentScreen('certificates')}
            className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-[#659BFF]/60 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-normal text-slate-500">
                {t.expiringLicences}
              </span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#659BFF] flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-[32px] lg:text-[36px] font-semibold text-[#111C28] tabular-nums leading-none">
                  {expiringQualifications.length}
                </span>
                <span className="text-[13px] text-slate-400 font-normal">{t.within30Days}</span>
              </div>
              <p className="text-[13px] text-slate-500 mt-1.5 font-normal">
                {language === 'ar' ? 'تراخيص بلدية دبي وهيئة الطرق' : 'Dubai Municipality & RTA certs'}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[14px] font-medium text-[#007F82] group-hover:translate-x-0.5 transition-transform">
              <span>{t.viewLicencesAndCerts}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 5: Active Workforce */}
          <div 
            onClick={() => setCurrentScreen('employees')}
            className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md hover:border-[#007F82]/60 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-normal text-slate-500">
                {t.activeWorkforce}
              </span>
              <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#007F82] flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <span className="text-[32px] lg:text-[36px] font-semibold text-[#111C28] tabular-nums leading-none">
                  {totalEmployees}
                </span>
                <span className="text-[13px] text-slate-400 font-normal">{language === 'ar' ? 'موظفاً لوجستياً' : 'logistics personnel'}</span>
              </div>
              <p className="text-[13px] text-slate-500 mt-1.5 font-normal">
                {t.across4Facilities}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[14px] font-medium text-[#007F82] group-hover:translate-x-0.5 transition-transform">
              <span>{t.openEmployeeRoster}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Charts & Breakdowns (Kinetic charts with SVG precision) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Completion Trend Chart (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[18px] lg:text-[20px] font-semibold text-[#111C28]">
                {t.trendTitle}
              </h3>
              <p className="text-[13px] font-normal text-slate-500 mt-0.5">
                {t.trendSubtitle}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[13px] text-[#007F82] font-medium">
              <TrendingUp className="w-4 h-4" />
              <span className="tabular-nums">{language === 'ar' ? '+12% مقارنة بالربع الأول' : '+12% vs Q1'}</span>
            </div>
          </div>

          {/* Precision SVG Kinetic Line Chart */}
          <div className="h-56 w-full relative pt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 500 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#007F82" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#007F82" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="0" y1="80" x2="500" y2="80" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="0" y1="130" x2="500" y2="130" stroke="#E2E8F0" strokeDasharray="3 3" />

              {/* Filled Area */}
              <path
                d="M 20 120 Q 100 110, 180 95 T 340 50 T 480 35 L 480 160 L 20 160 Z"
                fill="url(#chartGradient)"
              />

              {/* Curve Line */}
              <path
                d="M 20 120 Q 100 110, 180 95 T 340 50 T 480 35"
                fill="none"
                stroke="#007F82"
                strokeWidth="3"
                className="animate-route-flow"
              />

              {/* Waypoint Dots */}
              {[
                { x: 20, y: 120, label: language === 'ar' ? 'مايو' : 'May', val: '72%' },
                { x: 100, y: 110, label: language === 'ar' ? 'يونيو' : 'Jun', val: '76%' },
                { x: 180, y: 95, label: language === 'ar' ? 'يوليو' : 'Jul', val: '81%' },
                { x: 260, y: 75, label: language === 'ar' ? 'أغسطس' : 'Aug', val: '85%' },
                { x: 340, y: 50, label: language === 'ar' ? 'سبتمبر' : 'Sep', val: '89%' },
                { x: 480, y: 35, label: language === 'ar' ? 'أكتوبر' : 'Oct', val: `${completionRate}%` }
              ].map((pt, i) => (
                <g key={i}>
                  <circle cx={pt.x} cy={pt.y} r="5" fill="#ffffff" stroke="#007F82" strokeWidth="2.5" />
                  <circle cx={pt.x} cy={pt.y} r="2" fill="#79E8CE" />
                  <text x={pt.x} y="175" textAnchor="middle" fontSize="12" fill="#64748B" fontFamily="Source Sans 3, sans-serif">
                    {pt.label}
                  </text>
                  <text x={pt.x} y={pt.y - 10} textAnchor="middle" fontSize="12" fontWeight="600" fill="#0f172a" fontFamily="Source Sans 3, sans-serif">
                    {pt.val}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Legend Strip */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[13px] text-slate-500 font-normal">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#007F82]" />
                <span>{language === 'ar' ? 'الإنجازات المعتمدة' : 'Verified completions'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                <span>{language === 'ar' ? 'المعيار القياسي (80%)' : 'Benchmark (80%)'}</span>
              </div>
            </div>
            <span className="text-[#007F82] font-medium text-[13px]">
              {language === 'ar' ? 'محدث اليوم' : 'Updated today'}
            </span>
          </div>
        </div>

        {/* Training Status Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-[18px] lg:text-[20px] font-semibold text-[#111C28]">
              {t.statusAllocation}
            </h3>
            <p className="text-[13px] font-normal text-slate-500 mt-0.5">
              {t.statusAllocationSubtitle}
            </p>

            {/* Segmented Bar */}
            <div className="mt-5 w-full h-3 rounded-full overflow-hidden flex bg-slate-100 p-0.5 border border-slate-200">
              <div 
                style={{ width: `${(completedAssignments / (totalAssigned || 1)) * 100}%` }}
                className="bg-[#007F82] rounded-l-full"
                title={`Completed: ${completedAssignments}`}
              />
              <div 
                style={{ width: `${(inProgressAssignments / (totalAssigned || 1)) * 100}%` }}
                className="bg-[#659BFF]"
                title={`In Progress: ${inProgressAssignments}`}
              />
              <div 
                style={{ width: `${(overdueAssignments / (totalAssigned || 1)) * 100}%` }}
                className="bg-[#D74757]"
                title={`Overdue: ${overdueAssignments}`}
              />
              <div 
                style={{ width: `${(notStartedAssignments / (totalAssigned || 1)) * 100}%` }}
                className="bg-slate-300 rounded-r-full"
                title={`Not Started: ${notStartedAssignments}`}
              />
            </div>

            {/* Detail Rows */}
            <div className="mt-6 space-y-2.5 text-[14px]">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#007F82]" />
                  <span className="font-medium text-slate-700">{t.completed}</span>
                </div>
                <div className="flex items-center gap-2 tabular-nums">
                  <span className="font-semibold text-slate-900">{completedAssignments}</span>
                  <span className="text-[13px] text-slate-400">({totalAssigned ? Math.round((completedAssignments / totalAssigned) * 100) : 0}%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#659BFF]" />
                  <span className="font-medium text-slate-700">{t.inProgress}</span>
                </div>
                <div className="flex items-center gap-2 tabular-nums">
                  <span className="font-semibold text-slate-900">{inProgressAssignments}</span>
                  <span className="text-[13px] text-slate-400">({totalAssigned ? Math.round((inProgressAssignments / totalAssigned) * 100) : 0}%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-50/60 border border-red-100">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#D74757]" />
                  <span className="font-medium text-[#D74757]">{t.overdue}</span>
                </div>
                <div className="flex items-center gap-2 tabular-nums">
                  <span className="font-semibold text-[#D74757]">{overdueAssignments}</span>
                  <span className="text-[13px] text-red-400">({totalAssigned ? Math.round((overdueAssignments / totalAssigned) * 100) : 0}%)</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span className="font-medium text-slate-700">{t.notStarted}</span>
                </div>
                <div className="flex items-center gap-2 tabular-nums">
                  <span className="font-semibold text-slate-900">{notStartedAssignments}</span>
                  <span className="text-[13px] text-slate-400">({totalAssigned ? Math.round((notStartedAssignments / totalAssigned) * 100) : 0}%)</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setCurrentScreen('training_assignments')}
            className="mt-4 w-full py-2.5 text-[14px] font-medium text-[#007F82] bg-teal-50 hover:bg-teal-100/70 rounded-xl transition-colors text-center"
          >
            {language === 'ar' ? 'إدارة التعيينات النشطة ←' : 'Manage Active Assignments →'}
          </button>
        </div>
      </div>



      {/* Row 4: Expiring Qualifications & Recent Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Expiring Qualifications (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-[#111C28]">
                {t.upcomingExpiriesTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {t.upcomingExpiriesSubtitle}
              </p>
            </div>
            <Award className="w-4 h-4 text-[#D99824]" />
          </div>

          <div className="space-y-2.5">
            {expiringQualifications.length === 0 ? (
              <p className="text-xs text-slate-500">{language === 'ar' ? 'لا توجد تراخيص منتهية قريباً.' : 'No licenses expiring in the current window.'}</p>
            ) : (
              expiringQualifications.map((q) => {
                const emp = filteredEmployees.find((e) => e.id === q.employeeId);
                return (
                  <div key={q.id} className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs flex items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-slate-800">{q.title}</p>
                      <p className="text-[11px] text-slate-600">
                        {language === 'ar' ? (emp?.nameAr || emp?.name) : emp?.name} &bull; <span className="font-mono text-amber-800 font-semibold">{language === 'ar' ? 'ينتهي في:' : 'Expires:'} {q.expiryDate}</span>
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{q.issuingOrganization}</p>
                    </div>
                    <button
                      onClick={() => setCurrentScreen('certificates')}
                      className="px-2.5 py-1 text-[11px] font-bold text-amber-900 bg-white border border-amber-300 rounded-lg hover:bg-amber-100 transition-colors shrink-0"
                    >
                      {t.renew}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Activity Feed (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-extrabold text-sm text-[#111C28]">
                {t.auditFeedTitle}
              </h3>
              <p className="text-xs text-slate-500">
                {t.auditFeedSubtitle}
              </p>
            </div>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>

          <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
            {activityLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="py-2.5 text-xs flex items-start gap-3">
                <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                  log.badgeType === 'success' ? 'bg-[#007F82]' :
                  log.badgeType === 'critical' ? 'bg-[#D74757]' :
                  log.badgeType === 'warning' ? 'bg-[#D99824]' : 'bg-[#659BFF]'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 truncate">{log.actorName}</span>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5 leading-relaxed">{log.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
