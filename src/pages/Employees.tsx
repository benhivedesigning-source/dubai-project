import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { LOCATIONS } from '../data/mockData';
import { Employee, JobRole, LocationId, QualificationStatus, TrainingStatus } from '../types';
import { 
  Search, 
  Filter, 
  Plus, 
  Upload, 
  Download, 
  UserCheck, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  MoreHorizontal, 
  Edit3, 
  CalendarRange,
  X,
  FileSpreadsheet,
  Check,
  Building2,
  Users
} from 'lucide-react';

export const Employees: React.FC = () => {
  const { 
    filteredEmployees, 
    openEmployeeDetails, 
    addEmployee, 
    updateEmployee, 
    setCurrentScreen,
    assignCoursesToEmployees,
    courses,
    showToast,
    language,
    t
  } = useApp();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all'); // all, complete, overdue, in_progress

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalEmployee, setEditModalEmployee] = useState<Employee | null>(null);
  const [importCsvModalOpen, setImportCsvModalOpen] = useState(false);
  const [bulkAssignModalOpen, setBulkAssignModalOpen] = useState(false);
  const [selectedCourseForAssign, setSelectedCourseForAssign] = useState<string>('c1');
  const [assignDueDate, setAssignDueDate] = useState<string>(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // New Employee Form State
  const [newEmp, setNewEmp] = useState({
    name: '',
    nameAr: '',
    employeeCode: `AER-${Math.floor(3000 + Math.random() * 900)}`,
    email: '',
    role: 'Warehouse Associate' as JobRole,
    location: 'jebel_ali' as LocationId,
    supervisorId: 'sup-1',
    supervisorName: 'Tariq Al-Hashemi',
    status: 'active' as const,
    joinDate: new Date().toISOString().split('T')[0]
  });

  // Filtered employees calculation
  const displayedEmployees = useMemo(() => {
    return filteredEmployees.filter((emp) => {
      const matchesSearch = 
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        (emp.nameAr && emp.nameAr.includes(search)) ||
        emp.employeeCode.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase());

      const matchesLocation = locationFilter === 'all' || emp.location === locationFilter;
      const matchesRole = roleFilter === 'all' || emp.role === roleFilter;

      let matchesStatus = true;
      if (statusFilter === 'overdue') matchesStatus = emp.overdueCount > 0;
      else if (statusFilter === 'completed') matchesStatus = emp.completedCoursesCount === emp.totalAssignedCourses;
      else if (statusFilter === 'in_progress') matchesStatus = emp.completedCoursesCount < emp.totalAssignedCourses && emp.overdueCount === 0;

      return matchesSearch && matchesLocation && matchesRole && matchesStatus;
    });
  }, [filteredEmployees, search, locationFilter, roleFilter, statusFilter]);

  // Bulk selection toggles
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(displayedEmployees.map((e) => e.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // Add Employee Submission
  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmp.name.trim() || !newEmp.email.trim()) {
      showToast('Validation Error', 'Please complete the required name and email fields.', 'critical');
      return;
    }

    addEmployee({
      name: newEmp.name,
      nameAr: newEmp.nameAr || newEmp.name,
      employeeCode: newEmp.employeeCode,
      email: newEmp.email,
      role: newEmp.role,
      location: newEmp.location,
      supervisorId: newEmp.supervisorId,
      supervisorName: newEmp.supervisorName,
      status: newEmp.status,
      joinDate: newEmp.joinDate,
      initials: newEmp.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    });

    setAddModalOpen(false);
    // Reset form
    setNewEmp({
      name: '',
      nameAr: '',
      employeeCode: `AER-${Math.floor(3000 + Math.random() * 900)}`,
      email: '',
      role: 'Warehouse Associate',
      location: 'jebel_ali',
      supervisorId: 'sup-1',
      supervisorName: 'Tariq Al-Hashemi',
      status: 'active',
      joinDate: new Date().toISOString().split('T')[0]
    });
  };

  // Edit Employee Submission
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModalEmployee) return;
    updateEmployee(editModalEmployee);
    setEditModalEmployee(null);
  };

  // Bulk Assign Handler
  const handleBulkAssign = () => {
    if (selectedIds.length === 0) return;
    assignCoursesToEmployees([selectedCourseForAssign], selectedIds, assignDueDate, '7_days_before');
    setBulkAssignModalOpen(false);
    setSelectedIds([]);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-extrabold text-[#111C28] tracking-tight">
            {t.workforceDirectory}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t.workforceSubtitle} ({filteredEmployees.length} {language === 'ar' ? 'موظف' : 'personnel'})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setImportCsvModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold flex items-center gap-2 shadow-sm transition-all"
          >
            <Upload className="w-3.5 h-3.5 text-[#007F82]" />
            <span>{t.importCsv}</span>
          </button>

          <button
            onClick={() => setAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#007F82] hover:bg-[#006e71] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#007F82]/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addEmployee}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'ar' ? 'بحث بالاسم، الرقم الوظيفي، أو البريد...' : 'Search by name, ID (e.g. AER-3012), or email...'}
            className="w-full pl-9 pr-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#007F82]/30 focus:border-[#007F82]"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">{t.allLocations}</option>
            {LOCATIONS.map((loc) => (
              <option key={loc.id} value={loc.id}>{language === 'ar' ? loc.nameAr : loc.name}</option>
            ))}
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">{t.allRoles}</option>
            <option value="Forklift Operator">{language === 'ar' ? 'مشغل رافعة شوكية' : 'Forklift Operator'}</option>
            <option value="Warehouse Associate">{language === 'ar' ? 'مساعد مستودع' : 'Warehouse Associate'}</option>
            <option value="Driver">{language === 'ar' ? 'سائق' : 'Driver'}</option>
            <option value="Loading Supervisor">{language === 'ar' ? 'مشرف تحميل' : 'Loading Supervisor'}</option>
            <option value="HSE Officer">{language === 'ar' ? 'مسؤول سلامة (HSE)' : 'HSE Officer'}</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">{t.allStatuses}</option>
            <option value="overdue">{language === 'ar' ? 'تدريب متأخر فقط' : 'Overdue Training Only'}</option>
            <option value="completed">{language === 'ar' ? 'مكتمل 100%' : '100% Completed'}</option>
            <option value="in_progress">{language === 'ar' ? 'قيد التنفيذ' : 'In Progress'}</option>
          </select>

          {(search || locationFilter !== 'all' || roleFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearch('');
                setLocationFilter('all');
                setRoleFilter('all');
                setStatusFilter('all');
              }}
              className="px-2.5 py-2 text-slate-500 hover:text-slate-800 font-medium"
            >
              {language === 'ar' ? 'إعادة ضبط التصفية' : 'Reset Filters'}
            </button>
          )}
        </div>
      </div>

      {/* Bulk Action Ribbon when selected */}
      {selectedIds.length > 0 && (
        <div className="bg-[#111C28] text-white rounded-xl px-4 py-3 flex items-center justify-between animate-in fade-in slide-in-from-top-1 text-xs shadow-lg">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-[#79E8CE] animate-pulse" />
            <span className="font-bold">
              {language === 'ar' 
                ? `تم تحديد ${selectedIds.length} موظف` 
                : `${selectedIds.length} employee${selectedIds.length > 1 ? 's' : ''} selected`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setBulkAssignModalOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-[#007F82] hover:bg-[#006e71] text-white font-bold transition-colors flex items-center gap-1.5"
            >
              <CalendarRange className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? `تعيين تدريب للمحددين (${selectedIds.length})` : `Assign Training to Selected (${selectedIds.length})`}</span>
            </button>
            <button
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              {t.clear}
            </button>
          </div>
        </div>
      )}

      {/* Employees Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold text-[11px] sticky top-0">
                <th className="p-3.5 pl-4 w-10">
                  <input
                    type="checkbox"
                    checked={displayedEmployees.length > 0 && selectedIds.length === displayedEmployees.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded text-[#007F82] focus:ring-[#007F82]"
                  />
                </th>
                <th className="p-3.5">{language === 'ar' ? 'الموظف' : 'Employee'}</th>
                <th className="p-3.5">{language === 'ar' ? 'الوظيفة اللوجستية' : 'Job Role'}</th>
                <th className="p-3.5">{language === 'ar' ? 'المنشأة / المركز' : 'Facility / Hub'}</th>
                <th className="p-3.5">{language === 'ar' ? 'المشرف' : 'Supervisor'}</th>
                <th className="p-3.5 w-48">{language === 'ar' ? 'إنجاز التدريب' : 'Training Completion'}</th>
                <th className="p-3.5">{language === 'ar' ? 'المتأخرات' : 'Overdue'}</th>
                <th className="p-3.5">{language === 'ar' ? 'الترخيص / المؤهل' : 'Licence / Qual'}</th>
                <th className="p-3.5 text-right pr-4">{language === 'ar' ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {displayedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-slate-500">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-semibold">{language === 'ar' ? 'لم يتم العثور على موظفين مطابقين.' : 'No employees matched your filter criteria.'}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{language === 'ar' ? 'جرب تعديل شروط البحث أو الفلاتر.' : 'Try resetting the search or filter selectors.'}</p>
                  </td>
                </tr>
              ) : (
                displayedEmployees.map((emp) => {
                  const isSelected = selectedIds.includes(emp.id);
                  const completionPercent = emp.totalAssignedCourses > 0
                    ? Math.round((emp.completedCoursesCount / emp.totalAssignedCourses) * 100)
                    : 100;
                  const loc = LOCATIONS.find((l) => l.id === emp.location);

                  return (
                    <tr
                      key={emp.id}
                      className={`hover:bg-[#F4F7F8]/80 transition-colors ${
                        isSelected ? 'bg-teal-50/50' : ''
                      }`}
                    >
                      <td className="p-3.5 pl-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(emp.id)}
                          className="w-4 h-4 rounded text-[#007F82] focus:ring-[#007F82]"
                        />
                      </td>

                      {/* Employee Details */}
                      <td className="p-3.5">
                        <div 
                          onClick={() => openEmployeeDetails(emp.id)}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#111C28] to-[#007F82] text-white flex items-center justify-center font-bold font-mono text-xs shadow-sm">
                            {emp.initials}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 group-hover:text-[#007F82] group-hover:underline">
                              {language === 'ar' ? emp.nameAr : emp.name}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                              <span>{emp.employeeCode}</span>
                              <span>&bull;</span>
                              <span>{emp.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Job Role */}
                      <td className="p-3.5 font-medium text-slate-800">
                        {emp.role}
                      </td>

                      {/* Facility */}
                      <td className="p-3.5 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[140px]" title={loc?.name}>
                            {language === 'ar' ? loc?.nameAr : loc?.name}
                          </span>
                        </div>
                      </td>

                      {/* Supervisor */}
                      <td className="p-3.5 text-slate-600">
                        {emp.supervisorName}
                      </td>

                      {/* Training Progress Bar */}
                      <td className="p-3.5">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="font-bold text-slate-800">{completionPercent}%</span>
                            <span className="text-slate-400">
                              {emp.completedCoursesCount}/{emp.totalAssignedCourses} {language === 'ar' ? 'مكتمل' : 'completed'}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                completionPercent === 100
                                  ? 'bg-[#007F82]'
                                  : emp.overdueCount > 0
                                  ? 'bg-[#D74757]'
                                  : 'bg-[#659BFF]'
                              }`}
                              style={{ width: `${completionPercent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Overdue Count */}
                      <td className="p-3.5 font-mono">
                        {emp.overdueCount > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-[#D74757]">
                            <AlertCircle className="w-3 h-3" />
                            {emp.overdueCount} {language === 'ar' ? 'متأخر' : 'Overdue'}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">{language === 'ar' ? 'لا يوجد' : 'None'}</span>
                        )}
                      </td>

                      {/* Qualification Status */}
                      <td className="p-3.5">
                        {emp.qualificationStatus === 'valid' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            {t.valid}
                          </span>
                        )}
                        {emp.qualificationStatus === 'expiring_soon' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            {t.expiringSoon}
                          </span>
                        )}
                        {emp.qualificationStatus === 'expired' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-[#D74757] border border-red-200">
                            {t.expired}
                          </span>
                        )}
                        {emp.qualificationStatus === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-600">
                            {language === 'ar' ? 'قيد المراجعة' : 'Pending Review'}
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right pr-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditModalEmployee(emp)}
                            className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-500 hover:text-slate-900 transition-colors"
                            title={t.edit}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => openEmployeeDetails(emp.id)}
                            className="px-2.5 py-1 rounded-lg bg-[#007F82]/10 hover:bg-[#007F82] text-[#007F82] hover:text-white font-semibold text-[11px] transition-all flex items-center gap-1"
                          >
                            <span>{language === 'ar' ? 'الملف' : 'Profile'}</span>
                            <ChevronRight className="w-3 h-3" />
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

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <span>{language === 'ar' ? `عرض ${displayedEmployees.length} من أصل ${filteredEmployees.length} موظف مسجل` : `Showing ${displayedEmployees.length} of ${filteredEmployees.length} registered personnel`}</span>
          <span className="font-mono text-[11px]">AERIS Master Directory Active</span>
        </div>
      </div>

      {/* Add Employee Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#007F82]" />
                <h3 className="font-bold text-base text-[#111C28]">Add New Logistics Employee</h3>
              </div>
              <button onClick={() => setAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={newEmp.name}
                    onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                    placeholder="e.g. Tariq Al-Nuaimi"
                    className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#007F82]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name (Arabic)</label>
                  <input
                    type="text"
                    value={newEmp.nameAr}
                    onChange={(e) => setNewEmp({ ...newEmp, nameAr: e.target.value })}
                    placeholder="e.g. طارق النعيمي"
                    className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#007F82]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Employee Code</label>
                  <input
                    type="text"
                    value={newEmp.employeeCode}
                    onChange={(e) => setNewEmp({ ...newEmp, employeeCode: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={newEmp.email}
                    onChange={(e) => setNewEmp({ ...newEmp, email: e.target.value })}
                    placeholder="name@aeris-logistics.ae"
                    className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#007F82]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Job Role</label>
                  <select
                    value={newEmp.role}
                    onChange={(e) => setNewEmp({ ...newEmp, role: e.target.value as JobRole })}
                    className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="Warehouse Associate">Warehouse Associate</option>
                    <option value="Forklift Operator">Forklift Operator</option>
                    <option value="Driver">Driver</option>
                    <option value="Loading Supervisor">Loading Supervisor</option>
                    <option value="HSE Officer">HSE Officer</option>
                    <option value="Operations Supervisor">Operations Supervisor</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Facility</label>
                  <select
                    value={newEmp.location}
                    onChange={(e) => setNewEmp({ ...newEmp, location: e.target.value as LocationId })}
                    className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl focus:outline-none"
                  >
                    {LOCATIONS.map((l) => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Assigned Supervisor</label>
                  <input
                    type="text"
                    value={newEmp.supervisorName}
                    onChange={(e) => setNewEmp({ ...newEmp, supervisorName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Joining Date</label>
                  <input
                    type="date"
                    value={newEmp.joinDate}
                    onChange={(e) => setNewEmp({ ...newEmp, joinDate: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-[11px] leading-relaxed">
                <span className="font-bold">Automated Onboarding:</span> Adding this employee will automatically provision their profile and assign the mandatory <strong>HSE-101 Warehouse Safety Induction</strong> course with a 14-day due date.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#007F82] hover:bg-[#006e71] rounded-xl shadow-md"
                >
                  Create & Assign Induction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Employee Modal */}
      {editModalEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-[#111C28]">
                Edit Employee: {editModalEmployee.name}
              </h3>
              <button onClick={() => setEditModalEmployee(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editModalEmployee.name}
                  onChange={(e) => setEditModalEmployee({ ...editModalEmployee, name: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Job Role</label>
                  <select
                    value={editModalEmployee.role}
                    onChange={(e) => setEditModalEmployee({ ...editModalEmployee, role: e.target.value as JobRole })}
                    className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl"
                  >
                    <option value="Warehouse Associate">Warehouse Associate</option>
                    <option value="Forklift Operator">Forklift Operator</option>
                    <option value="Driver">Driver</option>
                    <option value="Loading Supervisor">Loading Supervisor</option>
                    <option value="HSE Officer">HSE Officer</option>
                    <option value="Operations Supervisor">Operations Supervisor</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Facility</label>
                  <select
                    value={editModalEmployee.location}
                    onChange={(e) => setEditModalEmployee({ ...editModalEmployee, location: e.target.value as LocationId })}
                    className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl"
                  >
                    {LOCATIONS.map((l) => (
                      <option key={l.id} value={l.id}>{l.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Supervisor Name</label>
                  <input
                    type="text"
                    value={editModalEmployee.supervisorName}
                    onChange={(e) => setEditModalEmployee({ ...editModalEmployee, supervisorName: e.target.value })}
                    className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={editModalEmployee.status}
                    onChange={(e) => setEditModalEmployee({ ...editModalEmployee, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl"
                  >
                    <option value="active">Active</option>
                    <option value="on_leave">On Leave</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditModalEmployee(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#007F82] hover:bg-[#006e71] rounded-xl shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV Import Preview Modal */}
      {importCsvModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#007F82]" />
                <h3 className="font-bold text-base text-[#111C28]">Batch Workforce Import Preview</h3>
              </div>
              <button onClick={() => setImportCsvModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Standardized format for Dubai Logistics ERP & HRMS import. The following 3 records were parsed from sample batch template:
            </p>

            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#F4F7F8] text-slate-600 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-2.5">Code</th>
                    <th className="p-2.5">Name</th>
                    <th className="p-2.5">Role</th>
                    <th className="p-2.5">Facility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  <tr>
                    <td className="p-2.5">AER-3910</td>
                    <td className="p-2.5 font-sans font-semibold text-slate-900">Salim Al-Nuaimi</td>
                    <td className="p-2.5 font-sans">Forklift Operator</td>
                    <td className="p-2.5 font-sans">Jebel Ali DC</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">AER-3911</td>
                    <td className="p-2.5 font-sans font-semibold text-slate-900">Hassan Raza</td>
                    <td className="p-2.5 font-sans">Warehouse Associate</td>
                    <td className="p-2.5 font-sans">Dubai South Hub</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">AER-3912</td>
                    <td className="p-2.5 font-sans font-semibold text-slate-900">Ananya Roy</td>
                    <td className="p-2.5 font-sans">Loading Supervisor</td>
                    <td className="p-2.5 font-sans">Al Quoz Whse</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-xs pt-2">
              <span className="text-slate-400 font-mono">Format: UTF-8 CSV with UAE residency ID mapping</span>
              <button
                type="button"
                onClick={() => {
                  showToast('Import Simulation', '3 sample employee records successfully integrated into local directory.', 'success');
                  setImportCsvModalOpen(false);
                }}
                className="px-4 py-2 font-bold text-white bg-[#007F82] hover:bg-[#006e71] rounded-xl"
              >
                Confirm Import (Demo)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Assign Modal */}
      {bulkAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-[#111C28]">
                Assign Course to {selectedIds.length} Employees
              </h3>
              <button onClick={() => setBulkAssignModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Course to Assign</label>
                <select
                  value={selectedCourseForAssign}
                  onChange={(e) => setSelectedCourseForAssign(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl focus:outline-none font-medium"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assignment Due Date</label>
                <input
                  type="date"
                  value={assignDueDate}
                  onChange={(e) => setAssignDueDate(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-600">
                Selected employees: {selectedIds.length}. This updates their profile records and recalculates facility training completion.
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
              <button
                type="button"
                onClick={() => setBulkAssignModalOpen(false)}
                className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkAssign}
                className="px-5 py-2 font-bold text-white bg-[#007F82] hover:bg-[#006e71] rounded-xl shadow-md"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
