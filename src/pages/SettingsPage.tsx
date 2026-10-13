import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LOCATIONS } from '../data/mockData';
import { 
  Settings, 
  Building2, 
  Users, 
  Languages, 
  ShieldCheck, 
  Bell, 
  Palette, 
  RefreshCw, 
  Check, 
  Save,
  Lock,
  Globe,
  X
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { resetDemoData, showToast, language, setLanguage } = useApp();

  const [activeTab, setActiveTab] = useState<'branding' | 'permissions' | 'notifications' | 'locations'>('branding');

  // Form states
  const [brandName, setBrandName] = useState('AERIS Safety');
  const [brandTagline, setBrandTagline] = useState('Safer teams. Smarter operations.');
  const [reminderIntervals, setReminderIntervals] = useState<string[]>(['30', '15', '7']);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);

  const handleSaveSettings = () => {
    showToast('Settings Saved', 'System configuration updated successfully.', 'success');
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#007F82] uppercase tracking-wider font-mono">
            <Settings className="w-4 h-4" />
            <span>Enterprise Governance &bull; Prototype Module</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-extrabold text-[#111C28] mt-1">
            System Settings & LMS Configuration
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage corporate branding, facility parameters, notification intervals, and role matrices
          </p>
        </div>

        <button
          onClick={handleSaveSettings}
          className="px-4 py-2 rounded-xl bg-[#007F82] hover:bg-[#006e71] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#007F82]/20 transition-all self-start sm:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>Save Configuration</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-3 overflow-x-auto text-xs">
        {[
          { id: 'branding', label: 'Company Branding', icon: Palette },
          { id: 'permissions', label: 'Role & Permissions Matrix', icon: Lock },
          { id: 'notifications', label: 'Notification & Expiry Rules', icon: Bell },
          { id: 'locations', label: 'Facilities & Logistics Hubs', icon: Building2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-3 font-semibold border-b-2 transition-all flex items-center gap-2 ${
                isActive
                  ? 'border-[#007F82] text-[#007F82]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Branding */}
      {activeTab === 'branding' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-6 text-xs max-w-3xl">
          <div>
            <h3 className="font-bold text-sm text-[#111C28]">LMS Branding & Identity</h3>
            <p className="text-slate-500">Customize the corporate name, tagline, and operational identity.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Product Brand Name</label>
              <input
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Corporate Tagline</label>
              <input
                type="text"
                value={brandTagline}
                onChange={(e) => setBrandTagline(e.target.value)}
                className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl"
              />
            </div>

            {/* Kinetic Precision Color Palette Swatches */}
            <div>
              <label className="block font-semibold text-slate-700 mb-2">Kinetic Precision Palette</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl border border-slate-200 flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#007F82]" />
                  <div>
                    <span className="font-bold block">Deep Teal</span>
                    <span className="text-[10px] font-mono text-slate-400">#007F82</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#79E8CE]" />
                  <div>
                    <span className="font-bold block">Electric Mint</span>
                    <span className="text-[10px] font-mono text-slate-400">#79E8CE</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#111C28]" />
                  <div>
                    <span className="font-bold block">Midnight Blue</span>
                    <span className="text-[10px] font-mono text-slate-400">#111C28</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-lg bg-[#659BFF]" />
                  <div>
                    <span className="font-bold block">Sky Accent</span>
                    <span className="text-[10px] font-mono text-slate-400">#659BFF</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Role & Permissions Matrix */}
      {activeTab === 'permissions' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4 text-xs">
          <div>
            <h3 className="font-bold text-sm text-[#111C28]">Role-Based Access Control (RBAC) Matrix</h3>
            <p className="text-slate-500">Defines capabilities for Admin (HSE Director), Field Supervisor, and HSE Reviewer.</p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left">
              <thead className="bg-[#F8FAFC] border-b border-slate-200 font-bold text-slate-600">
                <tr>
                  <th className="p-3 pl-4">System Capability</th>
                  <th className="p-3 text-center">Admin (HSE Director)</th>
                  <th className="p-3 text-center">Supervisor (Field Lead)</th>
                  <th className="p-3 text-center">HSE Reviewer</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: 'View All UAE Facilities & Hubs', admin: true, sup: false, hse: true },
                  { name: 'Assign Training to Cohorts & Individuals', admin: true, sup: true, hse: false },
                  { name: 'Execute Practical Machine Sign-Offs', admin: true, sup: true, hse: true },
                  { name: 'Approve AI-Generated Safety Curriculum', admin: true, sup: false, hse: true },
                  { name: 'Export Statutory Dubai Audit Manifests', admin: true, sup: false, hse: true },
                  { name: 'Edit System & Branding Configuration', admin: true, sup: false, hse: false }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="p-3 pl-4 font-semibold text-slate-800">{row.name}</td>
                    <td className="p-3 text-center">
                      {row.admin ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                    </td>
                    <td className="p-3 text-center">
                      {row.sup ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                    </td>
                    <td className="p-3 text-center">
                      {row.hse ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Notifications & Reminders */}
      {activeTab === 'notifications' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-5 text-xs max-w-3xl">
          <div>
            <h3 className="font-bold text-sm text-[#111C28]">Regulatory Expiry & Escalation Triggers</h3>
            <p className="text-slate-500">Configure reminder lead times before statutory licenses expire.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-2">License Expiry Reminder Intervals</label>
              <div className="flex flex-wrap gap-3">
                {['60', '30', '15', '7'].map((days) => {
                  const isChecked = reminderIntervals.includes(days);
                  return (
                    <label key={days} className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-[#F4F7F8] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          setReminderIntervals(prev => 
                            e.target.checked ? [...prev, days] : prev.filter(d => d !== days)
                          );
                        }}
                        className="text-[#007F82]"
                      />
                      <span className="font-bold text-slate-800">{days} Days Prior</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsEnabled}
                  onChange={(e) => setSmsEnabled(e.target.checked)}
                  className="text-[#007F82]"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Operator Mobile SMS & WhatsApp Notifications</span>
                  <span className="text-[11px] text-slate-500">Dispatches localized Arabic/English alert messages for overdue and scheduled evaluations.</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailEnabled}
                  onChange={(e) => setEmailEnabled(e.target.checked)}
                  className="text-[#007F82]"
                />
                <div>
                  <span className="font-bold text-slate-900 block">Supervisor Daily Digest Email</span>
                  <span className="text-[11px] text-slate-500">Summarizes awaiting practical evaluations and expiring equipment licenses.</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Locations */}
      {activeTab === 'locations' && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4 text-xs">
          <div>
            <h3 className="font-bold text-sm text-[#111C28]">Active Logistics Facilities & Freezone Hubs</h3>
            <p className="text-slate-500">Configured operational sites across Dubai and Sharjah.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LOCATIONS.map((loc) => (
              <div key={loc.id} className="p-4 rounded-xl border border-slate-200 bg-[#F4F7F8] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{loc.name}</span>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white text-[#007F82] font-semibold border border-slate-200">
                    {loc.code}
                  </span>
                </div>
                <p className="text-slate-500 text-[11px]">{loc.nameAr} &bull; {loc.city}, UAE</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
