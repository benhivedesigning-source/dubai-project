import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Qualification } from '../types';
import { CertificateModal } from '../components/common/CertificateModal';
import { 
  Award, 
  Plus, 
  Eye, 
  ShieldCheck, 
  X, 
  Bell, 
  Search, 
  Filter,
  CheckCircle2,
  Calendar,
  Building2,
  FileCheck2
} from 'lucide-react';

export const Certificates: React.FC = () => {
  const { 
    qualifications, 
    employees, 
    courses,
    recordQualification, 
    showToast, 
    language,
    t
  } = useApp();

  const [activeTab, setActiveTab] = useState<'internal' | 'external'>('internal');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Certificate Modal Preview
  const [previewCert, setPreviewCert] = useState<Qualification | null>(null);

  // Record External Qualification Modal
  const [recordModalOpen, setRecordModalOpen] = useState(false);
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [newTitle, setNewTitle] = useState('Dubai Civil Defence Fire Warden');
  const [newTitleAr, setNewTitleAr] = useState('شهادة مكافحة الحرائق وحراسة السلامة من الدفاع المدني بدبي');
  const [newOrg, setNewOrg] = useState('Dubai Civil Defence (DCD)');
  const [newOrgAr, setNewOrgAr] = useState('الإدارة العامة للدفاع المدني بدبي');
  const [newLicNumber, setNewLicNumber] = useState(`DCD-${Math.floor(10000 + Math.random() * 90000)}`);
  const [newIssueDate, setNewIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [newExpiryDate, setNewExpiryDate] = useState(
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  // Filtered qualifications
  const filteredQuals = useMemo(() => {
    return qualifications.filter((q) => {
      const matchType = activeTab === 'internal' 
        ? q.type === 'internal_certificate' 
        : q.type === 'external_qualification';

      const emp = employees.find(e => e.id === q.employeeId);
      const qTitle = (q.title || '').toLowerCase();
      const qTitleAr = (q.titleAr || '').toLowerCase();
      const empName = (emp?.name || '').toLowerCase();
      const empNameAr = (emp?.nameAr || '').toLowerCase();
      const licNo = (q.licenseNumber || '').toLowerCase();
      const s = search.toLowerCase();

      const matchSearch = 
        !s ||
        qTitle.includes(s) ||
        qTitleAr.includes(s) ||
        empName.includes(s) ||
        empNameAr.includes(s) ||
        licNo.includes(s);

      const matchStatus = statusFilter === 'all' || q.status === statusFilter;

      return matchType && matchSearch && matchStatus;
    });
  }, [qualifications, activeTab, search, statusFilter, employees]);

  // Submit new qualification
  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    recordQualification({
      employeeId: selectedEmpId,
      title: newTitle,
      titleAr: newTitleAr,
      type: 'external_qualification',
      issuingOrganization: newOrg,
      issuingOrganizationAr: newOrgAr,
      licenseNumber: newLicNumber,
      issueDate: newIssueDate,
      expiryDate: newExpiryDate,
      status: 'valid',
      remindersEnabled: true
    });
    setRecordModalOpen(false);
    showToast(
      language === 'ar' ? 'تم تسجيل المؤهل بنجاح' : 'Qualification Recorded',
      language === 'ar' ? `تم حفظ الترخيص الرسمي بنجاح (${newTitle})` : `Statutory qualification "${newTitle}" has been saved.`,
      'success'
    );
  };

  const getStatusBadge = (status: Qualification['status']) => {
    switch (status) {
      case 'valid':
        return (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {t.valid}
          </span>
        );
      case 'expiring_soon':
        return (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            {t.expiringSoon}
          </span>
        );
      case 'expired':
        return (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-red-50 text-[#D74757] border border-red-200">
            {t.expired}
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
            {t.valid}
          </span>
        );
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#007F82] uppercase tracking-wider font-mono">
            <Award className="w-4 h-4" />
            <span>
              {language === 'ar' ? 'الاعتمادات والتراخيص المهنية • معايير دبي' : 'Compliance Accreditations & Credentials • Prototype Module'}
            </span>
          </div>
          <h2 className="text-xl lg:text-2xl font-extrabold text-[#111C28] mt-1">
            {t.certificatesTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {t.certificatesSubtitle}
          </p>
        </div>

        <button
          onClick={() => setRecordModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#007F82] hover:bg-[#006e71] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#007F82]/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t.recordExternalQual}</span>
        </button>
      </div>

      {/* Main Tabs: Internal vs External */}
      <div className="border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('internal')}
            className={`py-3 px-3 font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'internal'
                ? 'border-[#007F82] text-[#007F82]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{t.internalCertsTab}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
              {qualifications.filter(q => q.type === 'internal_certificate').length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('external')}
            className={`py-3 px-3 font-semibold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'external'
                ? 'border-[#007F82] text-[#007F82]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>{t.externalQualsTab}</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-bold">
              {qualifications.filter(q => q.type === 'external_qualification').length}
            </span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex items-center gap-3 pb-2 sm:pb-0">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-[#F4F7F8] border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#007F82]"
            >
              <option value="all">{t.allStatusesLabel}</option>
              <option value="valid">{t.valid}</option>
              <option value="expiring_soon">{t.expiringSoon}</option>
              <option value="expired">{t.expired}</option>
            </select>
          </div>

          <div className="relative w-56 sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchCertPlaceholder}
              className="w-full pl-8 pr-3 py-1.5 bg-[#F4F7F8] border border-slate-200 rounded-xl text-xs text-[#111C28] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#007F82]/20 focus:border-[#007F82]"
            />
          </div>
        </div>
      </div>

      {/* Qualifications List Table (Clean, stable LTR layout without shifting) */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
              <tr>
                <th className="p-3.5 pl-4">{language === 'ar' ? 'مسمى الشهادة / الترخيص' : 'Credential Title'}</th>
                <th className="p-3.5">{language === 'ar' ? 'اسم الموظف' : 'Employee Name'}</th>
                <th className="p-3.5">{language === 'ar' ? 'الجهة المانحة' : 'Issuing Body'}</th>
                <th className="p-3.5">{t.issueDateLabel}</th>
                <th className="p-3.5">{t.expiryDateLabel}</th>
                <th className="p-3.5">{language === 'ar' ? 'حالة الصلاحية' : 'Status'}</th>
                <th className="p-3.5">{language === 'ar' ? 'التنبيهات' : 'Reminders'}</th>
                <th className="p-3.5 text-right pr-4">{language === 'ar' ? 'الإجراء' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQuals.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    {language === 'ar' ? 'لا توجد سجلات تطابق عوامل التصفية الحالية.' : 'No records match the current view.'}
                  </td>
                </tr>
              ) : (
                filteredQuals.map((qual) => {
                  const emp = employees.find(e => e.id === qual.employeeId);
                  const displayTitle = language === 'ar' && qual.titleAr ? qual.titleAr : qual.title;
                  const displayOrg = language === 'ar' && qual.issuingOrganizationAr ? qual.issuingOrganizationAr : qual.issuingOrganization;
                  const displayEmpName = language === 'ar' && emp?.nameAr ? emp.nameAr : emp?.name || 'Operator';

                  return (
                    <tr key={qual.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 pl-4">
                        <div>
                          <span className="font-bold text-slate-900 block">{displayTitle}</span>
                          <div className="flex items-center gap-2 mt-0.5">
                            {qual.licenseNumber && (
                              <span className="text-[10px] text-[#007F82] font-mono font-semibold">
                                #{qual.licenseNumber}
                              </span>
                            )}
                            {language === 'ar' && qual.titleAr && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                ({qual.title})
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 font-semibold text-slate-800">
                        <div>
                          <span>{displayEmpName}</span>
                          {emp && (
                            <span className="text-[10px] text-slate-400 block font-mono">
                              {emp.employeeCode}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3.5 text-slate-600">
                        {displayOrg}
                      </td>

                      <td className="p-3.5 font-mono text-slate-500">
                        {qual.issueDate}
                      </td>

                      <td className="p-3.5 font-mono font-semibold">
                        <span className={qual.status === 'expiring_soon' ? 'text-amber-800 font-bold' : qual.status === 'expired' ? 'text-[#D74757]' : 'text-slate-700'}>
                          {qual.expiryDate || (language === 'ar' ? 'صلاحية غير محددة' : 'No Expiry')}
                        </span>
                      </td>

                      <td className="p-3.5">
                        {getStatusBadge(qual.status)}
                      </td>

                      <td className="p-3.5">
                        <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                          <Bell className={`w-3 h-3 ${qual.remindersEnabled ? 'text-[#007F82]' : 'text-slate-300'}`} />
                          <span>{qual.remindersEnabled ? (language === 'ar' ? 'مفعل' : 'Enabled') : (language === 'ar' ? 'معطل' : 'Off')}</span>
                        </span>
                      </td>

                      <td className="p-3.5 text-right pr-4">
                        <button
                          onClick={() => setPreviewCert(qual)}
                          className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#007F82] font-bold text-[11px] transition-colors inline-flex items-center gap-1.5 shadow-sm"
                          title="Preview Official Certificate"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{t.viewCert}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Certificate (CRT) Modal Preview with Bilingual & Translation Controls */}
      {previewCert && (
        <CertificateModal
          qualification={previewCert}
          employee={employees.find(e => e.id === previewCert.employeeId)}
          course={courses.find(c => c.title === previewCert.title || c.titleAr === previewCert.titleAr)}
          onClose={() => setPreviewCert(null)}
        />
      )}

      {/* Record External Qualification Modal */}
      {recordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#007F82]" />
                <h3 className="font-bold text-sm text-[#111C28]">{t.recordExternalQual}</h3>
              </div>
              <button 
                onClick={() => setRecordModalOpen(false)} 
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleRecordSubmit} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">{t.selectEmployee}</label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#007F82]"
                >
                  {employees.map((e) => (
                    <option key={e.id} value={e.id}>
                      {language === 'ar' && e.nameAr ? `${e.nameAr} (${e.name})` : e.name} &bull; {e.role} ({e.employeeCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {language === 'ar' ? 'مسمى المؤهل أو الترخيص (الإنجليزية)' : 'Qualification Title (English)'}
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#007F82]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  {language === 'ar' ? 'مسمى المؤهل أو الترخيص (العربية)' : 'Qualification Title (Arabic)'}
                </label>
                <input
                  type="text"
                  value={newTitleAr}
                  onChange={(e) => setNewTitleAr(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#007F82]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.issuingAuthority} (EN)
                  </label>
                  <input
                    type="text"
                    required
                    value={newOrg}
                    onChange={(e) => setNewOrg(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#007F82]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    {t.issuingAuthority} (AR)
                  </label>
                  <input
                    type="text"
                    value={newOrgAr}
                    onChange={(e) => setNewOrgAr(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#007F82]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.licenseNumberLabel}</label>
                  <input
                    type="text"
                    value={newLicNumber}
                    onChange={(e) => setNewLicNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-1 focus:ring-[#007F82]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">{t.expiryDateLabel}</label>
                  <input
                    type="date"
                    value={newExpiryDate}
                    onChange={(e) => setNewExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl font-mono focus:outline-none focus:ring-1 focus:ring-[#007F82]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setRecordModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#007F82] hover:bg-[#006e71] rounded-xl shadow-md transition-all"
                >
                  {t.saveQual}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
