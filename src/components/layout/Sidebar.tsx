import React, { useState } from 'react';
import { useApp, ScreenId } from '../../context/AppContext';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  BookOpen, 
  Sparkles, 
  Award, 
  FileText, 
  BarChart3, 
  Settings, 
  CalendarRange,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Compass,
  Building2
} from 'lucide-react';

interface NavItem {
  id: ScreenId;
  label: string;
  labelAr: string;
  icon: React.ElementType;
  badge?: string;
  isOptional?: boolean;
}

interface NavGroup {
  groupName: string;
  groupNameAr: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { currentScreen, setCurrentScreen, user, language } = useApp();
  const [collapsed, setCollapsed] = useState(false);

  const navGroups: NavGroup[] = [
    {
      groupName: 'Overview',
      groupNameAr: 'نظرة عامة',
      items: [
        { id: 'dashboard', label: 'Control Dashboard', labelAr: 'لوحة التحكم المركزية', icon: LayoutDashboard }
      ]
    },
    {
      groupName: 'People & Training',
      groupNameAr: 'الأفراد والتدريب',
      items: [
        { id: 'employees', label: 'Employees Directory', labelAr: 'سجل الموظفين', icon: Users },
        { id: 'training_assignments', label: 'Training Assignments', labelAr: 'تعيينات التدريب', icon: CalendarRange },
        { id: 'practical_assessments', label: 'Practical Assessments', labelAr: 'التقييمات الميدانية', icon: ClipboardCheck, badge: 'Supervisor' }
      ]
    },
    {
      groupName: 'Learning & Knowledge',
      groupNameAr: 'التعلم والمعرفة',
      items: [
        { id: 'course_management', label: 'Course Library', labelAr: 'مكتبة الدورات', icon: BookOpen },
        { id: 'ai_course_builder', label: 'AI Course Builder', labelAr: 'منشئ الدورات بالذكاء', icon: Sparkles, isOptional: true },
        { id: 'safety_knowledge', label: 'Safety Content & AI QA', labelAr: 'مكتبة إجراءات السلامة', icon: Compass, isOptional: true }
      ]
    },
    {
      groupName: 'Compliance',
      groupNameAr: 'الامتثال والتراخيص',
      items: [
        { id: 'certificates', label: 'Certificates & Licences', labelAr: 'الشهادات والتراخيص', icon: Award, isOptional: true },
        { id: 'reports', label: 'Compliance Reports', labelAr: 'تقارير الامتثال', icon: BarChart3 }
      ]
    },
    {
      groupName: 'Administration',
      groupNameAr: 'الإدارة',
      items: [
        { id: 'settings', label: 'System Settings', labelAr: 'إعدادات النظام', icon: Settings, isOptional: true }
      ]
    }
  ];

  return (
    <aside 
      className={`relative flex flex-col shrink-0 bg-[#111C28] text-slate-300 border-r border-[#1e2f42] transition-all duration-300 z-30 select-none ${
        collapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Background Kinetic Route Watermark Line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-5">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path 
            d="M 10 20 L 70 80 L 10 140 L 80 200 L 10 280 L 90 400 L 20 600" 
            stroke="#79E8CE" 
            strokeWidth="2" 
            fill="none" 
            className="animate-route-flow"
          />
        </svg>
      </div>

      {/* Brand Header */}
      <div className="h-20 flex items-center justify-between px-5 border-b border-[#1b2b3d] relative z-10">
        <div 
          onClick={() => setCurrentScreen('dashboard')} 
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#007F82] to-[#111C28] flex items-center justify-center border border-[#79E8CE]/30 shadow-md group-hover:border-[#79E8CE] transition-all">
            {/* Kinetic diamond emblem */}
            <ShieldCheck className="w-5 h-5 text-[#79E8CE]" />
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#79E8CE] animate-pulse" />
          </div>

          {!collapsed && (
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-lg text-white">
                  AERIS
                </span>
                <span className="text-[12px] font-medium px-2 py-0.5 rounded bg-[#007F82]/30 text-[#79E8CE] border border-[#007F82]/40">
                  Safety
                </span>
              </div>
              <span className="text-[13px] font-normal text-slate-400">
                Kinetic precision LMS
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Role / Hub Indicator Bar */}
      {!collapsed && (
        <div className="mx-4 mt-4 p-2.5 rounded-xl bg-gradient-to-r from-[#172534] to-[#121f2d] border border-slate-700/50 flex items-center gap-2.5 text-[13px]">
          <div className="w-2 h-2 rounded-full bg-[#79E8CE] shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-200 truncate">
              {user?.role === 'admin' 
                ? (language === 'ar' ? 'غرفة التحكم المركزية (مدير)' : 'Central HSE Control Room')
                : (language === 'ar' ? 'مشرف ميداني - جبل علي' : 'Supervisor Mode: Jebel Ali DC')}
            </p>
            <p className="text-[13px] font-normal text-slate-400 truncate">
              {user?.role === 'supervisor' ? 'Restricted to assigned staff' : 'Full UAE Logistics Access'}
            </p>
          </div>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!collapsed && (
              <div className="flex items-center justify-between px-3 mb-1.5">
                <span className="text-[13px] font-normal text-slate-400">
                  {language === 'ar' ? group.groupNameAr : group.groupName}
                </span>
              </div>
            )}

            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentScreen === item.id || 
                  (item.id === 'employees' && currentScreen === 'employee_details');

                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentScreen(item.id)}
                    className={`w-full group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-[#007F82] text-white shadow-md shadow-[#007F82]/20 font-medium'
                        : 'text-slate-300 hover:text-white hover:bg-[#1a2b3d]'
                    }`}
                    title={collapsed ? (language === 'ar' ? item.labelAr : item.label) : undefined}
                  >
                    {/* Active Route Pulse Needle */}
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-[#79E8CE] rounded-r-full" />
                    )}

                    <Icon
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-[#79E8CE]' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />

                    {!collapsed && (
                      <span className="flex-1 text-start truncate">
                        {language === 'ar' ? item.labelAr : item.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Hub Status */}
      <div className="p-4 border-t border-[#1b2b3d] bg-[#0c1520] relative">
        {!collapsed ? (
          <div className="flex items-center text-[13px] font-normal text-slate-400">
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5 text-[#007F82]" />
              <span>Dubai Logistics Zone</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[#79E8CE] animate-pulse" title="System Connected" />
          </div>
        )}
      </div>
    </aside>
  );
};
