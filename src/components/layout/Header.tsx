import React, { useState, useRef, useEffect } from 'react';
import { useApp, ScreenId } from '../../context/AppContext';
import { LOCATIONS } from '../../data/mockData';
import { LocationId } from '../../types';
import { 
  Search, 
  Bell, 
  Globe, 
  MapPin, 
  ChevronDown, 
  LogOut, 
  RefreshCw, 
  UserCheck, 
  ShieldAlert, 
  CheckCheck,
  ArrowRight,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    currentScreen, 
    setCurrentScreen, 
    user, 
    loginAs, 
    logout, 
    language, 
    setLanguage, 
    selectedLocation, 
    setSelectedLocation,
    notifications,
    markNotificationsAsRead,
    employees,
    courses,
    safetyDocs,
    openEmployeeDetails,
    resetDemoData
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Global search filtering
  const searchResults = React.useMemo(() => {
    if (!searchQuery.trim()) return { employees: [], courses: [], docs: [] };
    const q = searchQuery.toLowerCase();
    return {
      employees: employees.filter(e => e.name.toLowerCase().includes(q) || e.employeeCode.toLowerCase().includes(q) || e.role.toLowerCase().includes(q)).slice(0, 3),
      courses: courses.filter(c => c.title.toLowerCase().includes(c.title.toLowerCase()) && (c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q))).slice(0, 3),
      docs: safetyDocs.filter(d => d.title.toLowerCase().includes(q) || d.docCode.toLowerCase().includes(q)).slice(0, 2)
    };
  }, [searchQuery, employees, courses, safetyDocs]);

  const hasResults = 
    searchResults.employees.length > 0 || 
    searchResults.courses.length > 0 || 
    searchResults.docs.length > 0;

  // Title mapping
  const screenTitles: Record<ScreenId, { en: string; ar: string; category: string; categoryAr: string }> = {
    login: { en: 'Sign In', ar: 'تسجيل الدخول', category: 'Authentication', categoryAr: 'التحقق' },
    dashboard: { en: 'Operational Control Room', ar: 'غرفة التحكم بالسلامة', category: 'Overview', categoryAr: 'نظرة عامة' },
    employees: { en: 'Employee Directory', ar: 'سجل الموظفين والتدريب', category: 'People & Training', categoryAr: 'الأفراد والتدريب' },
    employee_details: { en: 'Employee Profile & Audit', ar: 'ملف الموظف وسجل الكفاءة', category: 'People & Training', categoryAr: 'الأفراد والتدريب' },
    course_management: { en: 'Course Library & Curriculum', ar: 'مكتبة المناهج والدورات', category: 'Learning & Knowledge', categoryAr: 'التعلم والمعرفة' },
    training_assignments: { en: 'Training Assignments', ar: 'تعيينات التدريب والمهام', category: 'People & Training', categoryAr: 'الأفراد والتدريب' },
    practical_assessments: { en: 'Practical Field Assessments', ar: 'التقييمات الميدانية للمشرفين', category: 'People & Training', categoryAr: 'الأفراد والتدريب' },
    reports: { en: 'Compliance & Audit Reports', ar: 'تقارير الامتثال والتدقيق', category: 'Compliance', categoryAr: 'الامتثال' },
    ai_course_builder: { en: 'AI Document-to-Course Builder', ar: 'منشئ الدورات بالذكاء الاصطناعي', category: 'Learning & Knowledge', categoryAr: 'التعلم والمعرفة' },
    certificates: { en: 'Certificates & Qualifications', ar: 'الشهادات والتراخيص المهنية', category: 'Compliance', categoryAr: 'الامتثال' },
    safety_knowledge: { en: 'Safety Content & AI Knowledge Base', ar: 'مكتبة الإجراءات والذكاء المعتمد', category: 'Learning & Knowledge', categoryAr: 'التعلم والمعرفة' },
    settings: { en: 'System Settings & Governance', ar: 'إعدادات النظام والحوكمة', category: 'Administration', categoryAr: 'الإدارة' }
  };

  const currentMeta = screenTitles[currentScreen] || screenTitles.dashboard;

  return (
    <header className="h-18 bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 px-6 flex items-center justify-between gap-4">
      {/* Left: Breadcrumbs & Page Title */}
      <div className="flex flex-col min-w-0">
        <div className="flex items-center gap-1.5 text-[13px] text-slate-500 font-normal">
          <span>{language === 'ar' ? currentMeta.categoryAr : currentMeta.category}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#007F82] font-medium">
            {language === 'ar' ? currentMeta.ar : currentMeta.en}
          </span>
        </div>
        <h1 className="text-[18px] lg:text-[20px] font-semibold text-[#111C28] truncate">
          {language === 'ar' ? currentMeta.ar : currentMeta.en}
        </h1>
      </div>

      {/* Middle: Global Search */}
      <div className="relative flex-1 max-w-md hidden md:block" ref={searchRef}>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            placeholder={language === 'ar' ? 'بحث عن موظف، دورة، أو إجراء سلامة...' : 'Search employees, courses, SOPs...'}
            className="w-full pl-9 pr-4 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl text-[14px] text-[#111C28] placeholder-slate-400 font-normal focus:outline-none focus:ring-2 focus:ring-[#007F82]/30 focus:border-[#007F82] transition-all"
          />
        </div>

        {/* Global Search Popover */}
        {searchOpen && searchQuery.trim() && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-40 animate-in fade-in slide-in-from-top-2">
            {!hasResults ? (
              <div className="p-4 text-center text-xs text-slate-500">
                No matching results found for &ldquo;{searchQuery}&rdquo;
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 p-2 text-xs">
                {searchResults.employees.length > 0 && (
                  <div className="p-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Employees</span>
                    <div className="mt-1 space-y-1">
                      {searchResults.employees.map((emp) => (
                        <div
                          key={emp.id}
                          onClick={() => {
                            openEmployeeDetails(emp.id);
                            setSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="p-2 rounded-lg hover:bg-[#F4F7F8] cursor-pointer flex items-center justify-between transition-colors"
                        >
                          <div>
                            <p className="font-semibold text-slate-800">{emp.name}</p>
                            <p className="text-[11px] text-slate-500">{emp.role} &bull; {emp.employeeCode}</p>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-50 text-[#007F82] border border-teal-200">
                            View Profile
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.courses.length > 0 && (
                  <div className="p-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Courses</span>
                    <div className="mt-1 space-y-1">
                      {searchResults.courses.map((crs) => (
                        <div
                          key={crs.id}
                          onClick={() => {
                            setCurrentScreen('course_management');
                            setSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="p-2 rounded-lg hover:bg-[#F4F7F8] cursor-pointer flex items-center justify-between transition-colors"
                        >
                          <div>
                            <p className="font-semibold text-slate-800">{crs.title}</p>
                            <p className="text-[11px] text-slate-500">{crs.code} &bull; {crs.durationMinutes} mins</p>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            Course Library
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.docs.length > 0 && (
                  <div className="p-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Safety SOPs</span>
                    <div className="mt-1 space-y-1">
                      {searchResults.docs.map((doc) => (
                        <div
                          key={doc.id}
                          onClick={() => {
                            setCurrentScreen('safety_knowledge');
                            setSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="p-2 rounded-lg hover:bg-[#F4F7F8] cursor-pointer flex items-center justify-between transition-colors"
                        >
                          <div>
                            <p className="font-semibold text-slate-800">{doc.title}</p>
                            <p className="text-[11px] text-slate-500">{doc.docCode} &bull; v{doc.version}</p>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Knowledge Base
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Controls: Location Filter, Notifs, Language, User Menu */}
      <div className="flex items-center gap-3">
        {/* Location Selector */}
        <div className="relative">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F4F7F8] border border-slate-200 rounded-xl text-[14px] font-normal text-slate-700 hover:border-slate-300">
            <MapPin className="w-3.5 h-3.5 text-[#007F82]" />
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value as LocationId)}
              className="bg-transparent border-none text-[14px] font-normal focus:outline-none cursor-pointer pr-1"
            >
              <option value="all">{language === 'ar' ? 'جميع الفروع والمنشآت' : 'All Facilities (Dubai/Sharjah)'}</option>
              {LOCATIONS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {language === 'ar' ? loc.nameAr : loc.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Language Switcher */}
        <button
          onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-[#F4F7F8] text-[14px] font-medium text-slate-700 transition-colors"
          title="Switch Language (English / العربية)"
        >
          <Globe className="w-3.5 h-3.5 text-[#007F82]" />
          <span>{language === 'en' ? 'العربية' : 'English'}</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl border border-slate-200 hover:bg-[#F4F7F8] text-slate-600 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#D74757] text-white text-[10px] font-semibold flex items-center justify-center animate-pulse tabular-nums">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-40 animate-in fade-in slide-in-from-top-2">
              <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <span className="font-semibold text-[14px] text-slate-800">Operational alerts</span>
                <button
                  onClick={markNotificationsAsRead}
                  className="text-[13px] text-[#007F82] hover:underline flex items-center gap-1 font-normal"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => {
                      if (notif.linkPage) setCurrentScreen(notif.linkPage as ScreenId);
                      setNotifOpen(false);
                    }}
                    className={`p-3 text-[14px] cursor-pointer hover:bg-slate-50 transition-colors ${
                      !notif.read ? 'bg-teal-50/40' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-slate-900">{notif.title}</span>
                      <span className="text-[12px] text-slate-400 tabular-nums">{notif.timestamp}</span>
                    </div>
                    <p className="text-[13px] text-slate-600 mt-1 leading-normal font-normal">{notif.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Role Switch Menu */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 p-1.5 pl-2.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-[#007F82] text-white flex items-center justify-center font-semibold text-[12px] shadow-sm">
              {user?.avatar || 'AD'}
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-[14px] font-medium text-[#111C28] leading-tight">
                {language === 'ar' ? user?.nameAr : user?.name}
              </span>
              <span className="text-[13px] text-slate-500 font-normal">
                {user?.role === 'admin' 
                  ? 'HSE Director (Admin)' 
                  : user?.role === 'supervisor' 
                  ? 'Ops Supervisor' 
                  : 'HSE Reviewer'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-0.5" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden z-40 p-2 text-xs">
              <div className="p-2 border-b border-slate-100">
                <p className="font-bold text-slate-900">{user?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-50 text-[#007F82] border border-teal-200">
                  <UserCheck className="w-3 h-3" />
                  {user?.role === 'admin' ? 'Full Admin Access' : user?.role === 'supervisor' ? 'Jebel Ali Supervisor' : 'Reviewer Preview'}
                </div>
              </div>

              {/* Role Switcher */}
              <div className="p-1 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2">Switch Demo Persona</span>
                <button
                  onClick={() => {
                    loginAs('admin');
                    setUserMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                    user?.role === 'admin' ? 'bg-[#007F82] text-white' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-xs">Fatima Al-Mansoor</p>
                    <p className={`text-[10px] ${user?.role === 'admin' ? 'text-teal-100' : 'text-slate-500'}`}>Admin / HSE Director</p>
                  </div>
                  {user?.role === 'admin' && <div className="w-2 h-2 rounded-full bg-[#79E8CE]" />}
                </button>

                <button
                  onClick={() => {
                    loginAs('supervisor');
                    setUserMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                    user?.role === 'supervisor' ? 'bg-[#007F82] text-white' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-xs">Tariq Al-Hashemi</p>
                    <p className={`text-[10px] ${user?.role === 'supervisor' ? 'text-teal-100' : 'text-slate-500'}`}>Operations Supervisor</p>
                  </div>
                  {user?.role === 'supervisor' && <div className="w-2 h-2 rounded-full bg-[#79E8CE]" />}
                </button>

                <button
                  onClick={() => {
                    loginAs('hse_reviewer');
                    setUserMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                    user?.role === 'hse_reviewer' ? 'bg-[#007F82] text-white' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div>
                    <p className="font-semibold text-xs">Dr. Laila Al-Ketbi</p>
                    <p className={`text-[10px] ${user?.role === 'hse_reviewer' ? 'text-teal-100' : 'text-slate-500'}`}>HSE Reviewer Mode</p>
                  </div>
                  {user?.role === 'hse_reviewer' && <div className="w-2 h-2 rounded-full bg-[#79E8CE]" />}
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1 mt-1 space-y-1">
                <button
                  onClick={() => {
                    resetDemoData();
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-lg text-slate-600 hover:bg-slate-100 text-xs transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reset Demo Data</span>
                </button>

                <button
                  onClick={() => {
                    logout();
                    setUserMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-2 p-2 rounded-lg text-[#D74757] hover:bg-red-50 text-xs transition-colors font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
