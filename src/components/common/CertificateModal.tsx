import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Qualification, Employee, Course } from '../../types';
import { 
  ShieldCheck, 
  X, 
  QrCode, 
  Printer, 
  Download, 
  Award, 
  CheckCircle2,
  Globe
} from 'lucide-react';

interface CertificateModalProps {
  qualification: Qualification;
  employee?: Employee;
  course?: Course;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  qualification,
  employee,
  course,
  onClose
}) => {
  const { language, showToast } = useApp();

  // Mode: 'bilingual' (both EN & AR), 'en' (English), 'ar' (Arabic)
  const [certMode, setCertMode] = useState<'bilingual' | 'en' | 'ar'>(
    language === 'ar' ? 'ar' : 'bilingual'
  );

  const empNameEn = employee?.name || 'Rashid Al-Nuaimi';
  const empNameAr = employee?.nameAr || 'راشد النعيمي';
  const empCode = employee?.employeeCode || 'EMP-101';
  const empRole = employee?.role || 'Forklift Operator';

  // Titles
  const titleEn = course?.title || qualification.title;
  const titleAr = course?.titleAr || qualification.titleAr || 'اعتماد الكفاءة والسلامة المهنية';
  const orgEn = qualification.issuingOrganization || 'AERIS Safety Academy';
  const orgAr = qualification.issuingOrganizationAr || 'أكاديمية آيريس للسلامة اللوجستية';
  const serialNo = qualification.licenseNumber || `AER-${qualification.id.toUpperCase()}-2026`;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    showToast(
      certMode === 'ar' ? 'تحميل الشهادة الرقمية' : 'Digital Credential Export',
      certMode === 'ar'
        ? `تم تنزيل نسخة رقمية موثقة من الشهادة (${serialNo}) بنجاح.`
        : `Verified digital certificate PDF (${serialNo}) downloaded successfully.`,
      'success'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden relative my-8">
        {/* Certificate Top Control Bar (Non-print) */}
        <div className="no-print bg-slate-900 text-white px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Award className="w-4 h-4 text-[#79E8CE]" />
            <span className="font-mono text-[#79E8CE] tracking-wider uppercase">AERIS Credential Viewer</span>
          </div>

          {/* Language Switcher Buttons (Centered in control bar, zero layout shift) */}
          <div className="flex items-center bg-slate-800 p-0.5 rounded-xl border border-slate-700 text-xs">
            <button
              type="button"
              onClick={() => setCertMode('bilingual')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                certMode === 'bilingual'
                  ? 'bg-[#007F82] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              ثنائي اللغة (Bilingual)
            </button>
            <button
              type="button"
              onClick={() => setCertMode('en')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                certMode === 'en'
                  ? 'bg-[#007F82] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setCertMode('ar')}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                certMode === 'ar'
                  ? 'bg-[#007F82] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              العربية
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title="Print Certificate"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              title="Download Credential"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-red-500/80 text-slate-200 transition-colors ml-1"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate Inner Canvas (Symmetrical, balanced, stable LTR container) */}
        <div className="p-8 sm:p-10 relative bg-gradient-to-b from-[#FBFDFD] via-white to-[#F4F7F8] border-[6px] border-[#007F82]/20 m-4 rounded-2xl shadow-inner select-none print-card">
          {/* Architectural Coordinate Corner Markers */}
          <div className="absolute top-2.5 left-2.5 text-[9px] font-mono text-slate-300 select-none">
            + SEC-DXB-42
          </div>
          <div className="absolute top-2.5 right-2.5 text-[9px] font-mono text-slate-300 select-none">
            ISO-45001-UAE +
          </div>
          <div className="absolute bottom-2.5 left-2.5 text-[9px] font-mono text-slate-300 select-none">
            + AERIS-CONTROL
          </div>
          <div className="absolute bottom-2.5 right-2.5 text-[9px] font-mono text-slate-300 select-none">
            VERIFIED-AUDIT +
          </div>

          {/* Watermark Logistics Route SVG */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="cert-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#007F82" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cert-grid)" />
            <circle cx="50%" cy="50%" r="180" fill="none" stroke="#007F82" strokeWidth="2" strokeDasharray="6 4" />
          </svg>

          {/* Certificate Content - Clean Symmetrical Center Layout */}
          <div className="relative z-10 space-y-6 text-center">
            {/* Top Badge */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-[#007F82] font-mono text-[11px] font-bold tracking-widest uppercase shadow-sm">
                <ShieldCheck className="w-4 h-4 text-[#007F82]" />
                {certMode === 'en' && <span>Certificate of Safety Qualification</span>}
                {certMode === 'ar' && <span>شهادة اعتماد وتأهيل السلامة المهنية</span>}
                {certMode === 'bilingual' && (
                  <span>Certificate of Safety Qualification &bull; شهادة اعتماد السلامة المهنية</span>
                )}
              </div>
            </div>

            {/* Certificate Accreditation Header */}
            <div className="space-y-1.5 border-b border-slate-200 pb-5">
              <h1 className="text-xl sm:text-2xl font-extrabold text-[#111C28] tracking-tight">
                {certMode !== 'ar' && <div>AERIS LOGISTICS SAFETY ACCREDITATION</div>}
                {certMode !== 'en' && (
                  <div className="text-lg sm:text-xl font-bold text-[#007F82] mt-0.5">
                    اعتماد السلامة المهنية واللوجستية &bull; آيريس الإمارات
                  </div>
                )}
              </h1>
              <p className="text-xs text-slate-500 max-w-lg mx-auto">
                {certMode === 'en' && 'Authorized under Dubai Health, Safety and Environment Standards'}
                {certMode === 'ar' && 'معتمد وموثق وفق لوائح بلدية دبي ومعايير الصحة والسلامة والبيئة'}
                {certMode === 'bilingual' && (
                  <span>
                    Authorized under Dubai HSE Standards &bull; معتمد وفق معايير بلدية دبي للصحة والسلامة
                  </span>
                )}
              </p>
            </div>

            {/* Recipient Presentation */}
            <div className="py-2 space-y-2">
              <span className="text-xs font-mono tracking-widest text-slate-400 uppercase block">
                {certMode === 'en' && 'This is proudly certified to'}
                {certMode === 'ar' && 'نشهد بموجب هذا بأن المتدرب / الفني المعتمد'}
                {certMode === 'bilingual' && 'This is proudly certified to &bull; نشهد بموجب هذا بأن'}
              </span>

              {/* Recipient Name in Symmetrical Format */}
              <div className="space-y-0.5">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#007F82] tracking-tight underline decoration-[#79E8CE] decoration-2 underline-offset-6">
                  {certMode === 'ar' ? empNameAr : certMode === 'en' ? empNameEn : `${empNameEn} (${empNameAr})`}
                </h2>
                <p className="text-xs font-mono text-slate-500 pt-1">
                  ID: {empCode} &bull; {empRole}
                </p>
              </div>

              {/* Statement of Competence */}
              <p className="text-xs text-slate-600 max-w-lg mx-auto pt-2 leading-relaxed">
                {certMode === 'en' && 'For successfully demonstrating full competence, practical execution, and compliance with operational safety standards in:'}
                {certMode === 'ar' && 'قد أتم بنجاح استيفاء كافة متطلبات الكفاءة الفنية والتطبيق الميداني والامتثال لمعايير السلامة التشغيلية في:'}
                {certMode === 'bilingual' && (
                  <>
                    <span>For successfully demonstrating full competence and operational safety standards in:</span>
                    <span className="block text-slate-500 mt-0.5 text-[11px]">
                      قد أتم بنجاح استيفاء كافة متطلبات الكفاءة الفنية والتطبيق الميداني في:
                    </span>
                  </>
                )}
              </p>

              {/* Qualification / Course Title */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-sm max-w-xl mx-auto mt-2">
                <h3 className="text-base sm:text-lg font-extrabold text-[#111C28]">
                  {certMode === 'ar' ? titleAr : titleEn}
                </h3>
                {certMode === 'bilingual' && titleAr && titleAr !== titleEn && (
                  <p className="text-xs font-semibold text-[#007F82] mt-1">
                    {titleAr}
                  </p>
                )}
                <div className="text-[11px] text-slate-500 mt-1">
                  <span>{certMode === 'ar' ? orgAr : orgEn}</span>
                </div>
              </div>
            </div>

            {/* Meta Strip: Credential Serial, QR Code, and Official Seal Sign-off */}
            <div className="pt-4 border-t border-slate-200">
              <div className="grid grid-cols-3 items-center gap-2 p-3.5 rounded-xl bg-[#F4F7F8] border border-slate-200/90 text-xs">
                {/* Column 1: Serial & Dates (Left-aligned) */}
                <div className="text-left font-mono">
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider">
                    {certMode === 'ar' ? 'الرقم التسلسلي' : 'Credential Serial'}
                  </span>
                  <span className="font-bold text-slate-800 text-[11px]">{serialNo}</span>
                  <span className="text-[10px] text-slate-500 block mt-1">
                    {certMode === 'ar' ? `تاريخ الإصدار: ${qualification.issueDate}` : `Issued: ${qualification.issueDate}`}
                  </span>
                  {qualification.expiryDate && (
                    <span className="text-[10px] text-amber-700 block font-semibold">
                      {certMode === 'ar' ? `صالح لغاية: ${qualification.expiryDate}` : `Valid Thru: ${qualification.expiryDate}`}
                    </span>
                  )}
                </div>

                {/* Column 2: Verification QR Code (Centered) */}
                <div className="flex flex-col items-center justify-center">
                  <div className="p-1.5 bg-white rounded-lg border border-slate-300 shadow-sm">
                    <QrCode className="w-9 h-9 text-[#111C28]" />
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 mt-1 text-center">
                    {certMode === 'ar' ? 'امسح للتحقق' : 'Scan to Verify'}
                  </span>
                </div>

                {/* Column 3: Authority Sign-Off & Official Seal (Right-aligned) */}
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-mono">
                    {certMode === 'ar' ? 'سلطة الاعتماد' : 'HSE Authority'}
                  </span>
                  <span className="font-extrabold text-[#007F82] block text-[11px]">
                    {certMode === 'ar' ? 'فاطمة المنصور' : 'Fatima Al-Mansoor'}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    {certMode === 'ar' ? 'نائب رئيس السلامة والبيئة' : 'VP of HSE, AERIS UAE'}
                  </span>
                  <div className="mt-1 inline-flex items-center gap-1 text-[9px] font-mono text-emerald-700 font-bold px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>{certMode === 'ar' ? 'معتمد رسمياً' : 'Verified Seal'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Regulatory Compliance Footer */}
            <p className="text-[10px] text-slate-400 font-mono tracking-tight pt-1">
              {certMode === 'ar'
                ? 'وثيقة رسمية صادرة بموجب متطلبات بلدية دبي والدفاع المدني بدولة الإمارات العربية المتحدة • صالحة رقمياً'
                : 'Official Credential Registered under Dubai Municipality & Civil Defence Logistics Protocols • Digitally Valid'}
            </p>
          </div>
        </div>

        {/* Modal Bottom Close Button (Non-print) */}
        <div className="no-print p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
            <Globe className="w-3.5 h-3.5 text-[#007F82]" />
            <span>Format: {certMode.toUpperCase()} &bull; Stable Layout</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{certMode === 'ar' ? 'طباعة' : 'Print'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-[#007F82] hover:bg-[#006e71] text-white text-xs font-bold transition-all shadow-sm"
            >
              {certMode === 'ar' ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
