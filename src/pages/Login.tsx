import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft,
  Check,
  CheckCircle2, 
  AlertCircle,
  Shield,
  Layers,
  ShieldCheck
} from 'lucide-react';

export const Login: React.FC = () => {
  const { loginAs, showToast, language, setLanguage } = useApp();
  const [email, setEmail] = useState('fatima.mansoor@aeris-logistics.ae');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const isArabic = language === 'ar';

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.toLowerCase().includes('supervisor') || email.toLowerCase().includes('tariq')) {
      loginAs('supervisor');
    } else {
      loginAs('admin');
    }
  };

  const handleDemoLogin = (role: 'admin' | 'supervisor') => {
    loginAs(role);
    showToast(
      isArabic ? 'تم تسجيل الدخول بنجاح' : 'Workspace Connected',
      isArabic 
        ? (role === 'admin' ? 'تم الدخول كمدير للسلامة (فاطمة منصور)' : 'تم الدخول كمشرف HSE (طارق الهاشمي)')
        : (role === 'admin' ? 'Signed in as Safety Director (Fatima Mansoor)' : 'Signed in as Senior HSE Supervisor (Tariq Al-Hashemi)'),
      'success'
    );
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSent(true);
    setTimeout(() => {
      setForgotModalOpen(false);
      setForgotSent(false);
      setForgotEmail('');
      showToast(
        isArabic ? 'تم إرسال رابط إعادة التعيين' : 'Password Reset Sent',
        isArabic ? 'تحقق من بريدك الإلكتروني للتعليمات' : 'Check your inbox for safety credentials reset instructions.',
        'info'
      );
    }, 1500);
  };

  return (
    <div 
      dir={isArabic ? 'rtl' : 'ltr'}
      className={`relative min-h-screen w-full bg-[#F4F7F8] text-[#111C28] flex flex-col justify-between overflow-x-hidden selection:bg-[#007F82]/20 selection:text-[#007F82] ${isArabic ? 'font-arabic' : 'font-sans'}`}
    >
      {/* ========================================================================= */}
      {/* GEOMETRIC ARTWORK: PRIMARY TEAL & BRAND ACCENT MOTIFS (Screen Edges)      */}
      {/* ========================================================================= */}
      
      {/* 1. Upper-Right Area: Brand Primary Teal Quarter-Circle (Cropped) */}
      <div 
        className={`pointer-events-none absolute top-0 z-0 overflow-hidden ${
          isArabic ? 'left-0' : 'right-0'
        }`}
        aria-hidden="true"
      >
        <div 
          className={`w-[260px] h-[260px] sm:w-[380px] sm:h-[380px] md:w-[480px] md:h-[480px] lg:w-[540px] lg:h-[540px] bg-[#007F82] transform transition-transform duration-1000 ease-out animate-orbit opacity-95 shadow-2xl ${
            isArabic 
              ? 'rounded-br-full -translate-x-12 -translate-y-12 sm:-translate-x-16 sm:-translate-y-16' 
              : 'rounded-bl-full translate-x-12 -translate-y-12 sm:translate-x-16 sm:-translate-y-16'
          }`}
        >
          {/* Subtle concentric Swiss geometric arc cutout with brand mint border */}
          <div 
            className={`w-[82%] h-[82%] border border-[#79E8CE]/40 animate-spin-slow ${
              isArabic ? 'rounded-br-full' : 'rounded-bl-full'
            }`} 
          />
          {/* Inner fine hairline arc */}
          <div 
            className={`w-[60%] h-[60%] border border-white/30 -mt-[42%] animate-pulse-circle ${
              isArabic ? 'rounded-br-full mr-[20%]' : 'rounded-bl-full ml-[20%]'
            }`} 
          />
        </div>
      </div>

      {/* 2. Lower-Left Area: Mint / Soft Teal Circular Form (Partially Cropped) */}
      <div 
        className={`pointer-events-none absolute bottom-0 z-0 overflow-hidden ${
          isArabic ? 'right-0' : 'left-0'
        }`}
        aria-hidden="true"
      >
        <div 
          className={`w-[220px] h-[220px] sm:w-[320px] sm:h-[320px] md:w-[420px] md:h-[420px] bg-[#79E8CE]/35 rounded-full transform transition-transform duration-1000 ease-out animate-float-slow-reverse backdrop-blur-xs ${
            isArabic 
              ? 'translate-x-16 translate-y-20 sm:translate-x-24 sm:translate-y-28' 
              : '-translate-x-16 translate-y-20 sm:-translate-x-24 sm:-translate-y-28'
          }`}
        >
          {/* Fine concentric graphic ring with slow spin */}
          <div className="absolute inset-6 rounded-full border border-[#007F82]/30 animate-spin-slow" />
          <div className="absolute inset-16 rounded-full border border-[#007F82]/20 animate-pulse-circle" />
        </div>
      </div>



      {/* ========================================================================= */}
      {/* HEADER: Wordmark on Left, Language Switcher on Right                      */}
      {/* ========================================================================= */}
      <header className="relative z-10 w-full px-6 sm:px-10 lg:px-14 pt-6 sm:pt-8 flex items-center justify-between animate-slide-up opacity-0 [animation-fill-mode:forwards]">
        {/* AERIS Safety Wordmark */}
        <div className="flex items-center gap-3 group cursor-default">
          <div className="relative">
            <div className="absolute -inset-1 rounded-xl bg-[#007F82]/30 animate-pulse-ring" />
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#007F82] to-[#111C28] text-white flex items-center justify-center font-bold text-lg shadow-md border border-[#79E8CE]/40 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
              <ShieldCheck className="w-5 h-5 text-[#79E8CE]" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-lg sm:text-xl tracking-tight text-[#111C28]">
                AERIS
              </span>
              <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded-[4px] bg-[#007F82] text-white shadow-xs transition-transform duration-200 hover:scale-105">
                SAFETY
              </span>
            </div>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center bg-white/95 p-1 rounded-xl border border-[#D5E0E4] shadow-xs backdrop-blur-xs transition-all hover:border-[#007F82]/50">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-[13px] font-medium transition-all duration-200 ${
              language === 'en'
                ? 'bg-[#007F82] text-white shadow-xs font-semibold scale-102'
                : 'text-[#111C28]/70 hover:text-[#111C28] hover:bg-[#F4F7F8]'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLanguage('ar')}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-[13px] font-medium transition-all duration-200 ${
              language === 'ar'
                ? 'bg-[#007F82] text-white shadow-xs font-semibold font-arabic scale-102'
                : 'text-[#111C28]/70 hover:text-[#111C28] hover:bg-[#F4F7F8] font-arabic'
            }`}
          >
            العربية
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN CONTENT: Centered Directly On Canvas (NO Enclosing Card)            */}
      {/* ========================================================================= */}
      <main className="relative z-10 w-full flex-1 flex flex-col items-center justify-center px-5 sm:px-8 py-10 sm:py-12">
        <div className="w-full max-w-[400px] flex flex-col items-center text-center animate-slide-up opacity-0 [animation-fill-mode:forwards] [animation-delay:150ms]">
          
          {/* 1. Compact “Safety training workspace” Label */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/95 border border-[#D5E0E4] text-[#111C28] text-xs sm:text-[13px] font-medium mb-3 shadow-xs transition-transform duration-300 hover:scale-105">
            <span className="w-2 h-2 rounded-full bg-[#007F82] animate-pulse" />
            <span>
              {isArabic ? 'مساحة عمل التدريب والسلامة' : 'Safety training workspace'}
            </span>
          </div>

          {/* 2. Large, Confident Heading */}
          <h1 className="text-2xl sm:text-[32px] md:text-[34px] font-semibold text-[#111C28] tracking-tight leading-[1.2] mb-2">
            {isArabic ? 'هل أنت مستعد لمناوبتك القادمة؟' : 'Ready for your next shift?'}
          </h1>

          {/* 3. Supporting Text */}
          <p className="text-[15px] sm:text-base text-[#111C28]/75 leading-relaxed mb-7 max-w-[340px]">
            {isArabic 
              ? 'سجّل الدخول للحفاظ على تدريب وجاهزية فريقك للعمليات الآمنة.' 
              : 'Sign in to keep your team trained and prepared.'}
          </p>

          {/* 4. Login Form (approx 380-400px wide, no card container) */}
          <form onSubmit={handleCustomSubmit} className="w-full text-start flex flex-col gap-4">
            
            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
              <label 
                htmlFor="login-email" 
                className="text-[13px] sm:text-[14px] font-medium text-[#111C28]"
              >
                {isArabic ? 'عنوان البريد الإلكتروني' : 'Email address'}
              </label>
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isArabic ? 'اسمك@aeris-logistics.ae' : 'name@aeris-logistics.ae'}
                className="w-full h-11 sm:h-12 px-3.5 bg-white text-[#111C28] placeholder-[#111C28]/40 text-[14px] sm:text-[15px] rounded-[10px] border border-[#D5E0E4] focus:outline-none focus:border-[#007F82] focus:ring-2 focus:ring-[#007F82]/20 transition-all shadow-xs"
              />
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
              <label 
                htmlFor="login-password" 
                className="text-[13px] sm:text-[14px] font-medium text-[#111C28]"
              >
                {isArabic ? 'كلمة المرور' : 'Password'}
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className={`w-full h-11 sm:h-12 px-3.5 bg-white text-[#111C28] placeholder-[#111C28]/40 text-[14px] sm:text-[15px] rounded-[10px] border border-[#D5E0E4] focus:outline-none focus:border-[#007F82] focus:ring-2 focus:ring-[#007F82]/20 transition-all shadow-xs ${
                    isArabic ? 'pl-11' : 'pr-11'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute top-1/2 -translate-y-1/2 p-2 text-[#111C28]/50 hover:text-[#007F82] transition-colors ${
                    isArabic ? 'left-1.5' : 'right-1.5'
                  }`}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-[13px] pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <div 
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-all ${
                    rememberMe 
                      ? 'bg-[#007F82] border-[#007F82] text-white' 
                      : 'border-[#111C28]/30 bg-white'
                  }`}
                >
                  {rememberMe && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
                <span 
                  onClick={() => setRememberMe(!rememberMe)}
                  className="text-[#111C28]/80 hover:text-[#111C28] font-normal"
                >
                  {isArabic ? 'تذكرني' : 'Remember me'}
                </span>
              </label>

              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className="text-[#111C28]/75 hover:text-[#007F82] underline underline-offset-2 transition-colors font-medium"
              >
                {isArabic ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
              </button>
            </div>

            {/* High-contrast Primary Teal “Sign in” Button */}
            <button
              type="submit"
              className="mt-1 w-full h-12 bg-[#007F82] hover:bg-[#006B6E] active:scale-[0.99] text-white font-medium text-[15px] sm:text-base rounded-[10px] shadow-md shadow-[#007F82]/25 flex items-center justify-center gap-2 transition-all cursor-pointer group"
            >
              <span>{isArabic ? 'تسجيل الدخول' : 'Sign in'}</span>
              {isArabic ? (
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              ) : (
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              )}
            </button>

            {/* Subtle Divider: “Explore the workspace” */}
            <div className="relative my-2 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-[#D5E0E4]" />
              </div>
              <div className="relative bg-[#F4F7F8] px-3">
                <span className="text-[12px] sm:text-[13px] font-medium text-[#111C28]/60 uppercase tracking-wider">
                  {isArabic ? 'استكشف مساحة العمل' : 'Explore the workspace'}
                </span>
              </div>
            </div>

            {/* Two Secondary Demo Buttons in Styled Card Tones */}
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="h-11 px-3 bg-white hover:bg-[#EEF3F5] active:scale-[0.98] border border-[#D5E0E4] rounded-[10px] text-[#111C28] text-[13px] sm:text-[14px] font-medium flex items-center justify-center gap-1.5 transition-all shadow-xs group"
              >
                <Shield className="w-3.5 h-3.5 text-[#007F82] transition-transform group-hover:scale-110" />
                <span>{isArabic ? 'عرض المسؤول' : 'Admin demo'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('supervisor')}
                className="h-11 px-3 bg-white hover:bg-[#EEF3F5] active:scale-[0.98] border border-[#D5E0E4] rounded-[10px] text-[#111C28] text-[13px] sm:text-[14px] font-medium flex items-center justify-center gap-1.5 transition-all shadow-xs group"
              >
                <Layers className="w-3.5 h-3.5 text-[#111C28]/70 transition-transform group-hover:scale-110" />
                <span>{isArabic ? 'عرض المشرف' : 'Supervisor demo'}</span>
              </button>
            </div>

          </form>

        </div>
      </main>

      {/* ========================================================================= */}
      {/* FORGOT PASSWORD MODAL: Styled in Primary Color Theme                      */}
      {/* ========================================================================= */}
      {forgotModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111C28]/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setForgotModalOpen(false)}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-white border border-[#D5E0E4] rounded-2xl p-6 sm:p-7 shadow-2xl text-start"
          >
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-[#007F82]/10 text-[#007F82] flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-[#111C28]">
                {isArabic ? 'استعادة بيانات المرور' : 'Reset Safety Credentials'}
              </h3>
            </div>

            <p className="text-[14px] text-[#111C28]/70 mb-5 leading-relaxed">
              {isArabic 
                ? 'أدخل بريدك الإلكتروني المسجل في أيريس وسنرسل لك تعليمات استعادة كلمة المرور.'
                : 'Enter your verified safety workspace email address to receive password reset instructions.'}
            </p>

            <form onSubmit={handleForgotSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-[#111C28]">
                  {isArabic ? 'البريد الإلكتروني' : 'Work Email'}
                </label>
                <input 
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@aeris-logistics.ae"
                  className="w-full h-11 px-3.5 bg-white text-[#111C28] text-sm rounded-[10px] border border-[#D5E0E4] focus:outline-none focus:border-[#007F82] focus:ring-2 focus:ring-[#007F82]/20"
                />
              </div>

              <div className="flex items-center justify-end gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-[#111C28]/70 hover:text-[#111C28] hover:bg-[#EEF3F5] transition-colors"
                >
                  {isArabic ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={forgotSent}
                  className="px-5 py-2 rounded-lg text-sm font-medium bg-[#007F82] hover:bg-[#006B6E] text-white transition-colors flex items-center gap-2 shadow-sm shadow-[#007F82]/20 cursor-pointer"
                >
                  {forgotSent ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{isArabic ? 'جارٍ الإرسال...' : 'Sending...'}</span>
                    </>
                  ) : (
                    <span>{isArabic ? 'إرسال الرابط' : 'Send Reset Link'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
