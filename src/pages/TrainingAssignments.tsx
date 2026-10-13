import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { LOCATIONS } from '../data/mockData';
import { CourseAssignment, JobRole, LocationId } from '../types';
import { 
  CalendarRange, 
  Search, 
  Filter, 
  Plus, 
  Send, 
  Edit3, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Users, 
  Building2, 
  Check, 
  X, 
  ChevronRight,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const TrainingAssignments: React.FC = () => {
  const { 
    assignments, 
    employees, 
    courses, 
    updateAssignmentDueDate, 
    simulateReminder, 
    assignCoursesToEmployees,
    openEmployeeDetails,
    showToast,
    language 
  } = useApp();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');

  // Guided Wizard Modal State
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Wizard selections
  const [wizardSelectedCourseIds, setWizardSelectedCourseIds] = useState<string[]>(['c1']);
  const [wizardTargetType, setWizardTargetType] = useState<'individual' | 'group'>('group');
  const [wizardGroupRole, setWizardGroupRole] = useState<string>('all');
  const [wizardGroupLocation, setWizardGroupLocation] = useState<string>('all');
  const [wizardSelectedEmpIds, setWizardSelectedEmpIds] = useState<string[]>([]);
  const [wizardDueDate, setWizardDueDate] = useState<string>(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [wizardReminderConfig, setWizardReminderConfig] = useState<string>('standard');

  // Edit Due Date Modal
  const [editDueModalItem, setEditDueModalItem] = useState<CourseAssignment | null>(null);
  const [newDueDateInput, setNewDueDateInput] = useState('');

  // View Assigned Employees Modal
  const [viewGroupModalCourseId, setViewGroupModalCourseId] = useState<string | null>(null);

  // Filtered Assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter((asg) => {
      const emp = employees.find((e) => e.id === asg.employeeId);
      const crs = courses.find((c) => c.id === asg.courseId);

      const matchesSearch = 
        (emp?.name.toLowerCase().includes(search.toLowerCase()) || false) ||
        (crs?.title.toLowerCase().includes(search.toLowerCase()) || false) ||
        (crs?.code.toLowerCase().includes(search.toLowerCase()) || false);

      const matchesStatus = statusFilter === 'all' || asg.status === statusFilter;
      const matchesCourse = courseFilter === 'all' || asg.courseId === courseFilter;

      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [assignments, employees, courses, search, statusFilter, courseFilter]);

  // Affected employees calculation for the wizard
  const affectedEmployees = useMemo(() => {
    if (wizardTargetType === 'individual') {
      return employees.filter((e) => wizardSelectedEmpIds.includes(e.id));
    }
    return employees.filter((e) => {
      const matchRole = wizardGroupRole === 'all' || e.role === wizardGroupRole;
      const matchLoc = wizardGroupLocation === 'all' || e.location === wizardGroupLocation;
      return matchRole && matchLoc;
    });
  }, [employees, wizardTargetType, wizardSelectedEmpIds, wizardGroupRole, wizardGroupLocation]);

  // Open Wizard
  const handleOpenWizard = () => {
    setWizardSelectedCourseIds(['c1']);
    setWizardTargetType('group');
    setWizardGroupRole('all');
    setWizardGroupLocation('all');
    setWizardSelectedEmpIds([]);
    setWizardDueDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setWizardStep(1);
    setWizardOpen(true);
  };

  const handleConfirmWizard = () => {
    const empIdsToAssign = affectedEmployees.map((e) => e.id);
    if (empIdsToAssign.length === 0) {
      showToast('Assignment Error', 'No employees selected for this assignment.', 'critical');
      return;
    }
    assignCoursesToEmployees(wizardSelectedCourseIds, empIdsToAssign, wizardDueDate, wizardReminderConfig);
    setWizardOpen(false);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-extrabold text-[#111C28] tracking-tight">
            Training Assignments & Schedules
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Active cohort enrollments, statutory deadlines, and automated UAE notification dispatches
          </p>
        </div>

        <button
          onClick={handleOpenWizard}
          className="px-4 py-2.5 rounded-xl bg-[#007F82] hover:bg-[#006e71] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#007F82]/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Training Assignment Wizard</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by employee or course name..."
            className="w-full pl-9 pr-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#007F82]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="overdue">Overdue Deadlines</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="not_started">Not Started</option>
          </select>

          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">All Courses</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Assignments Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden text-xs">
        <table className="w-full text-left">
          <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
            <tr>
              <th className="p-3.5 pl-4">Course</th>
              <th className="p-3.5">Assigned Employee</th>
              <th className="p-3.5">Facility Hub</th>
              <th className="p-3.5">Assigned Date</th>
              <th className="p-3.5">Due Date</th>
              <th className="p-3.5 w-36">Progress</th>
              <th className="p-3.5">Status</th>
              <th className="p-3.5 text-right pr-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredAssignments.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-500">
                  No matching training assignments found.
                </td>
              </tr>
            ) : (
              filteredAssignments.map((asg) => {
                const emp = employees.find((e) => e.id === asg.employeeId);
                const crs = courses.find((c) => c.id === asg.courseId);
                const loc = LOCATIONS.find((l) => l.id === emp?.location);

                return (
                  <tr key={asg.id} className="hover:bg-slate-50">
                    <td className="p-3.5 pl-4 font-bold text-slate-900">
                      <div>
                        <span>{crs?.title || 'Safety Module'}</span>
                        <span className="block text-[10px] text-[#007F82] font-mono">{crs?.code}</span>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div 
                        onClick={() => emp && openEmployeeDetails(emp.id)}
                        className="cursor-pointer hover:underline"
                      >
                        <span className="font-semibold text-slate-800">{emp?.name || 'Assigned Staff'}</span>
                        <span className="block text-[10px] text-slate-400 font-mono">{emp?.role}</span>
                      </div>
                    </td>

                    <td className="p-3.5 text-slate-600">
                      <span className="truncate max-w-[120px] block" title={loc?.name}>
                        {loc?.name || 'Dubai'}
                      </span>
                    </td>

                    <td className="p-3.5 font-mono text-slate-500">{asg.assignedDate}</td>

                    <td className="p-3.5 font-mono font-semibold">
                      <span className={asg.status === 'overdue' ? 'text-[#D74757]' : 'text-slate-800'}>
                        {asg.dueDate}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="font-bold">{asg.progressPercent}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              asg.status === 'completed' ? 'bg-[#007F82]' :
                              asg.status === 'overdue' ? 'bg-[#D74757]' : 'bg-[#659BFF]'
                            }`}
                            style={{ width: `${asg.progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        asg.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                        asg.status === 'overdue' ? 'bg-red-100 text-[#D74757]' :
                        asg.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {asg.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="p-3.5 text-right pr-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setEditDueModalItem(asg);
                            setNewDueDateInput(asg.dueDate);
                          }}
                          className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-600 hover:text-slate-900"
                          title="Edit Due Date"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => simulateReminder(asg.id)}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] flex items-center gap-1"
                          title="Simulate SMS/Email Reminder"
                        >
                          <Send className="w-3 h-3 text-[#007F82]" />
                          <span>Remind</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Multi-Step Guided Assign Training Modal */}
      {wizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#007F82] font-mono">
                  Guided Workflow &bull; Step {wizardStep} of 5
                </span>
                <h3 className="font-extrabold text-base text-[#111C28]">
                  {wizardStep === 1 && 'Step 1: Select Safety Course Curriculum'}
                  {wizardStep === 2 && 'Step 2: Choose Workforce Target Audience'}
                  {wizardStep === 3 && 'Step 3: Set Mandatory Due Date'}
                  {wizardStep === 4 && 'Step 4: Configure Reminder Automation'}
                  {wizardStep === 5 && 'Step 5: Review & Confirm Assignment'}
                </h3>
              </div>
              <button onClick={() => setWizardOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step Indicators */}
            <div className="px-6 py-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-[11px]">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="flex items-center gap-1.5">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                    wizardStep === s ? 'bg-[#007F82] text-white' :
                    wizardStep > s ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-700'
                  }`}>
                    {s}
                  </div>
                  <span className={`font-semibold hidden sm:inline ${wizardStep === s ? 'text-[#007F82]' : 'text-slate-500'}`}>
                    {s === 1 ? 'Courses' : s === 2 ? 'Audience' : s === 3 ? 'Due Date' : s === 4 ? 'Reminders' : 'Confirm'}
                  </span>
                </div>
              ))}
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto flex-1 text-xs space-y-4">
              {/* Step 1: Select Courses */}
              {wizardStep === 1 && (
                <div className="space-y-3">
                  <p className="text-slate-600 font-medium">Select one or more safety courses for this cohort:</p>
                  <div className="space-y-2 max-h-72 overflow-y-auto">
                    {courses.map((crs) => {
                      const isSelected = wizardSelectedCourseIds.includes(crs.id);
                      return (
                        <div
                          key={crs.id}
                          onClick={() => {
                            setWizardSelectedCourseIds((prev) =>
                              prev.includes(crs.id) ? prev.filter((i) => i !== crs.id) : [...prev, crs.id]
                            );
                          }}
                          className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                            isSelected ? 'bg-teal-50 border-[#007F82]' : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900">{crs.title}</span>
                              <span className="font-mono text-[10px] text-[#007F82] font-semibold">{crs.code}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5">{crs.durationMinutes} mins &bull; {crs.category}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                            isSelected ? 'bg-[#007F82] border-[#007F82] text-white' : 'border-slate-300'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Choose Audience */}
              {wizardStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 font-bold cursor-pointer">
                      <input
                        type="radio"
                        checked={wizardTargetType === 'group'}
                        onChange={() => setWizardTargetType('group')}
                        className="text-[#007F82]"
                      />
                      <span>Target Role / Facility Cohort</span>
                    </label>
                    <label className="flex items-center gap-2 font-bold cursor-pointer">
                      <input
                        type="radio"
                        checked={wizardTargetType === 'individual'}
                        onChange={() => setWizardTargetType('individual')}
                        className="text-[#007F82]"
                      />
                      <span>Select Individual Employees</span>
                    </label>
                  </div>

                  {wizardTargetType === 'group' ? (
                    <div className="grid grid-cols-2 gap-3 p-4 bg-[#F4F7F8] rounded-xl border border-slate-200">
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Filter by Job Role</label>
                        <select
                          value={wizardGroupRole}
                          onChange={(e) => setWizardGroupRole(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                        >
                          <option value="all">All Logistics Roles</option>
                          <option value="Forklift Operator">Forklift Operators</option>
                          <option value="Warehouse Associate">Warehouse Associates</option>
                          <option value="Driver">Drivers</option>
                          <option value="Loading Supervisor">Loading Supervisors</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">Filter by Facility Location</label>
                        <select
                          value={wizardGroupLocation}
                          onChange={(e) => setWizardGroupLocation(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl"
                        >
                          <option value="all">All Facilities</option>
                          {LOCATIONS.map((loc) => (
                            <option key={loc.id} value={loc.id}>{loc.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto border border-slate-200 rounded-xl p-2">
                      {employees.map((emp) => {
                        const isSelected = wizardSelectedEmpIds.includes(emp.id);
                        return (
                          <div
                            key={emp.id}
                            onClick={() => {
                              setWizardSelectedEmpIds(prev => 
                                prev.includes(emp.id) ? prev.filter(i => i !== emp.id) : [...prev, emp.id]
                              );
                            }}
                            className={`p-2 rounded-lg flex items-center justify-between cursor-pointer ${
                              isSelected ? 'bg-teal-50 text-[#007F82]' : 'hover:bg-slate-50 text-slate-800'
                            }`}
                          >
                            <span className="font-semibold">{emp.name} ({emp.role})</span>
                            <input type="checkbox" checked={isSelected} readOnly className="text-[#007F82]" />
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Dynamic Affected Workforce Preview */}
                  <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 flex items-center justify-between">
                    <div>
                      <span className="font-bold">Affected Workforce: </span>
                      <span><strong>{affectedEmployees.length} personnel</strong> match this filter</span>
                    </div>
                    <span className="text-[11px] font-mono font-bold text-[#007F82]">
                      Live Calculation
                    </span>
                  </div>
                </div>
              )}

              {/* Step 3: Due Dates */}
              {wizardStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Mandatory Training Due Date</label>
                    <input
                      type="date"
                      value={wizardDueDate}
                      onChange={(e) => setWizardDueDate(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#F4F7F8] border border-slate-200 rounded-xl font-mono text-sm"
                    />
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
                    Calculated interval: {Math.max(1, Math.round((new Date(wizardDueDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))} days remaining from today.
                  </div>
                </div>
              )}

              {/* Step 4: Reminder Automation */}
              {wizardStep === 4 && (
                <div className="space-y-3">
                  <p className="text-slate-600">Automated notification schedule dispatched to operator handsets via SMS & email:</p>
                  <div className="space-y-2">
                    {[
                      { id: 'standard', title: 'Standard Schedule (Recommended)', desc: '7 days before, 3 days before, and 24 hours prior to deadline.' },
                      { id: 'accelerated', title: 'Accelerated High-Priority', desc: 'Daily notification beginning 5 days before due date.' },
                      { id: 'none', title: 'Manual Only', desc: 'No automatic alerts; supervisor manual trigger only.' }
                    ].map((rem) => (
                      <label key={rem.id} className="p-3 rounded-xl border border-slate-200 bg-white flex items-start gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="rem-config"
                          checked={wizardReminderConfig === rem.id}
                          onChange={() => setWizardReminderConfig(rem.id)}
                          className="mt-0.5 text-[#007F82]"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{rem.title}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{rem.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: Review & Confirm */}
              {wizardStep === 5 && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-[#111C28] text-white space-y-3">
                    <span className="text-[10px] font-mono text-[#79E8CE] uppercase font-bold tracking-wider">
                      Batch Assignment Confirmation Summary
                    </span>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block">Courses Selected</span>
                        <span className="font-bold text-slate-200">
                          {wizardSelectedCourseIds.length} course(s)
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Audience Size</span>
                        <span className="font-bold text-[#79E8CE]">
                          {affectedEmployees.length} logistics personnel
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Completion Deadline</span>
                        <span className="font-bold text-slate-200 font-mono">
                          {wizardDueDate}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Reminder Protocol</span>
                        <span className="font-bold text-slate-200 capitalize">
                          {wizardReminderConfig}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-slate-700 block mb-1">Affected Personnel Preview (First 5):</span>
                    <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 max-h-36 overflow-y-auto text-[11px]">
                      {affectedEmployees.slice(0, 5).map((e) => (
                        <div key={e.id} className="p-2 flex items-center justify-between">
                          <span className="font-semibold text-slate-800">{e.name}</span>
                          <span className="text-slate-500">{e.role} &bull; {e.location}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Navigation */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
              <button
                type="button"
                disabled={wizardStep === 1}
                onClick={() => setWizardStep((prev) => (prev > 1 ? (prev - 1 as any) : prev))}
                className="px-4 py-2 font-semibold text-slate-600 disabled:opacity-30"
              >
                Back
              </button>

              {wizardStep < 5 ? (
                <button
                  type="button"
                  onClick={() => setWizardStep((prev) => (prev < 5 ? (prev + 1 as any) : prev))}
                  className="px-5 py-2 font-bold text-white bg-[#007F82] hover:bg-[#006e71] rounded-xl flex items-center gap-1.5"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmWizard}
                  className="px-6 py-2 font-bold text-white bg-[#007F82] hover:bg-[#006e71] rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Execute Training Rollout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Due Date Modal */}
      {editDueModalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-slate-200 shadow-2xl space-y-4 text-xs">
            <h3 className="font-bold text-sm text-[#111C28]">Adjust Assignment Deadline</h3>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">New Due Date</label>
              <input
                type="date"
                value={newDueDateInput}
                onChange={(e) => setNewDueDateInput(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl font-mono"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditDueModalItem(null)}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  updateAssignmentDueDate(editDueModalItem.id, newDueDateInput);
                  setEditDueModalItem(null);
                }}
                className="px-4 py-1.5 bg-[#007F82] text-white font-bold rounded-lg"
              >
                Update Date
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
