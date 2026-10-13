import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Course, JobRole } from '../types';
import { 
  Sparkles, 
  FileText, 
  UploadCloud, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Layers, 
  Check, 
  X, 
  AlertCircle,
  BookOpen,
  HelpCircle,
  ClipboardCheck,
  Send,
  Eye
} from 'lucide-react';

interface BuiltInSop {
  id: string;
  code: string;
  title: string;
  category: string;
  snippet: string;
  suggestedRoles: JobRole[];
}

export const AICourseBuilder: React.FC = () => {
  const { addCourse, showToast, language } = useApp();

  // Step in workflow
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Selected SOP
  const builtInSops: BuiltInSop[] = [
    {
      id: 'sop-1',
      code: 'SOP-LOG-042',
      title: 'Pallet Racking & High-Reach Safety in Temperature Controlled Facilities',
      category: 'Equipment',
      snippet: 'Covers cold-chain warehouse high-bay racking rules. Section 4.2 dictates maximum allowable stack height of 9.2 meters with 150mm upright clearance. Section 5.1 mandates anti-fog polycarbonate visors in -22°C deep-freeze chambers. A minimum of 3-meter pedestrian clearance is enforced across all transit aisles.',
      suggestedRoles: ['Forklift Operator', 'Loading Supervisor']
    },
    {
      id: 'sop-2',
      code: 'SOP-DXB-018',
      title: 'Hazardous Material Handling & Chemical Segregation in JAFZA Freezone',
      category: 'Logistics',
      snippet: 'JAFZA Port and Freezone Authority chemical segregation compliance. Section 3.8 requires class 3 flammable liquids to be isolated with 6-meter fire barriers or FM-approved cabinets. Spill kits must be rated for minimum 250 liters solvent containment.',
      suggestedRoles: ['Warehouse Associate', 'HSE Officer']
    },
    {
      id: 'sop-3',
      code: 'SOP-OPS-099',
      title: 'Electric Forklift Battery Charging Station Safety & Eyewash Protocols',
      category: 'Equipment',
      snippet: 'Battery charging zones require continuous hydrogen exhaust extraction at minimum 10 air changes per hour. Mandatory PPE includes face shields, neoprene aprons, and rubber gauntlet gloves. Emergency eyewash units must deliver 15 minutes of uninterrupted flushing within 10 seconds travel distance.',
      suggestedRoles: ['Forklift Operator', 'Warehouse Associate']
    }
  ];

  const [selectedSop, setSelectedSop] = useState<BuiltInSop>(builtInSops[0]);
  const [courseLanguage, setCourseLanguage] = useState<'bilingual' | 'en' | 'ar'>('bilingual');
  const [selectedRoles, setSelectedRoles] = useState<JobRole[]>(['Forklift Operator', 'Warehouse Associate']);

  // Generation Animation States
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationPhase, setGenerationPhase] = useState<
    'reading' | 'identifying' | 'drafting' | 'preparing' | 'done'
  >('reading');

  // Generated Course Output (Draft)
  const [generatedDraft, setGeneratedDraft] = useState<{
    title: string;
    objectives: string[];
    lessons: Array<{ title: string; duration: string; content: string }>;
    quiz: Array<{ question: string; options: string[]; answer: number }>;
    practicalChecklist: Array<{ task: string; isCritical: boolean }>;
    sourceRef: string;
    approvalStatus: 'pending_hse_review' | 'approved' | 'changes_requested';
    reviewerComments?: string;
  } | null>(null);

  // Approval Modal
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [reviewNote, setReviewNote] = useState('');

  // Start generation trigger
  const handleStartGeneration = () => {
    setIsGenerating(true);
    setGenerationPhase('reading');

    setTimeout(() => {
      setGenerationPhase('identifying');
    }, 900);

    setTimeout(() => {
      setGenerationPhase('drafting');
    }, 1900);

    setTimeout(() => {
      setGenerationPhase('preparing');
    }, 2900);

    setTimeout(() => {
      setGenerationPhase('done');
      setIsGenerating(false);

      // Deterministic realistic generated safety course based on selected SOP
      setGeneratedDraft({
        title: `${selectedSop.title} - Operational Mastery`,
        objectives: [
          'Verify mandatory PPE inspection criteria and thermal protective barriers.',
          'Execute safe 3-meter pedestrian clear zone protocols in narrow transit bays.',
          'Identify critical containment limits and 15-minute emergency reporting triggers.'
        ],
        lessons: [
          {
            title: 'Hazard Recognition & Environmental Baselines',
            duration: '12 mins',
            content: `Derived from ${selectedSop.code}: Operators must verify perimeter markers, sensor alarms, and climate barrier strip doors prior to entry.`
          },
          {
            title: 'Mechanical Clearances & Operational Speed Limits',
            duration: '15 mins',
            content: `Strict adherence to 10 km/h indoor travel limits and maintaining minimum 150mm fork ground clearance across cross-dock threshold plates.`
          },
          {
            title: 'Emergency Containment & First Responder Protocols',
            duration: '10 mins',
            content: 'Immediate supervisor notification within 15 minutes. Secure exclusion perimeter until HSE Officer signs clearance log.'
          }
        ],
        quiz: [
          {
            question: `Under ${selectedSop.code}, what is the mandatory pedestrian buffer clearance?`,
            options: ['1.0 meter', '3.0 meters buffer', '0.5 meters'],
            answer: 1
          },
          {
            question: 'What is the required reporting window for a high-potential near-miss?',
            options: ['Within 15 minutes', 'End of working week', 'Next shift turnover'],
            answer: 0
          }
        ],
        practicalChecklist: [
          { task: 'Conduct complete pre-operational hazard sweep and floor friction test', isCritical: true },
          { task: 'Check mechanical interlocking signals before passing threshold bay', isCritical: true },
          { task: 'Sound audible horn twice before crossing blind-spot mirror zones', isCritical: false }
        ],
        sourceRef: `${selectedSop.code} v3.4 - Dubai Logistics HSE Control`,
        approvalStatus: 'pending_hse_review'
      });

      setCurrentStep(3);
    }, 3800);
  };

  // Submit to Course Management library
  const handlePublishToLibrary = () => {
    if (!generatedDraft) return;

    const newCourse: Course = {
      id: `crs-ai-${Date.now()}`,
      code: `HSE-${Math.floor(600 + Math.random() * 300)}`,
      title: generatedDraft.title,
      titleAr: 'دورة سلامة معتمدة بالذكاء الاصطناعي',
      description: `Course generated from ${selectedSop.code}. Fully verified by HSE Reviewer.`,
      descriptionAr: 'منهاج تدريبي معتمد من إجراءات السلامة الميدانية.',
      category: 'Equipment',
      targetRoles: selectedRoles,
      durationMinutes: 35,
      languages: ['en', 'ar'],
      version: '1.0',
      status: generatedDraft.approvalStatus === 'approved' ? 'published' : 'in_review',
      lastUpdated: new Date().toISOString().split('T')[0],
      assignedCount: 0,
      completionRate: 0,
      passMarkPercent: 85,
      isAiGenerated: true,
      lessons: generatedDraft.lessons.map((l, i) => ({
        id: `l-ai-${i}`,
        title: l.title,
        durationMinutes: 12,
        content: l.content,
        type: 'interactive',
        order: i + 1
      })),
      questions: generatedDraft.quiz.map((q, i) => ({
        id: `q-ai-${i}`,
        question: q.question,
        options: q.options,
        correctIndex: q.answer,
        explanation: `Validated against source SOP ${selectedSop.code}.`
      }))
    };

    addCourse(newCourse);
    showToast(
      'Curriculum Synchronized',
      `Course "${generatedDraft.title}" added to Course Library (${newCourse.status.toUpperCase()}).`,
      'success'
    );
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#007F82] uppercase tracking-wider font-mono">
            <Sparkles className="w-4 h-4 text-[#79E8CE]" />
            <span>AI Document-to-Course Synthesis &bull; Prototype Module</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-extrabold text-[#111C28] mt-1">
            Standard Operating Procedure (SOP) Course Builder
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Convert complex UAE logistics safety documents into interactive lesson modules and practical checklists
          </p>
        </div>

        <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-teal-50 text-[#007F82] border border-teal-200 font-bold self-start sm:self-auto">
          Demo Generation Mode &bull; Human Review Required
        </span>
      </div>

      {/* Stepper Wizard Indicator */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex items-center justify-between text-xs">
        {[
          { num: 1, label: 'Select or Upload SOP' },
          { num: 2, label: 'Configure Objectives & Audience' },
          { num: 3, label: 'Review Generated Course & Checklist' },
          { num: 4, label: 'HSE Committee Approval' },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
              currentStep === s.num ? 'bg-[#007F82] text-white shadow-sm' :
              currentStep > s.num ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
            }`}>
              {s.num}
            </div>
            <span className={`font-semibold hidden sm:inline ${currentStep === s.num ? 'text-[#007F82]' : 'text-slate-500'}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1 & 2: Selection & Configuration */}
      {currentStep < 3 && !isGenerating && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Built-In SOP Selector (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#111C28]">
                1. Select Verified Safety Operating Procedure (SOP)
              </h3>
              <span className="text-[11px] text-slate-400">Pre-loaded Dubai Logistics Standards</span>
            </div>

            <div className="space-y-3">
              {builtInSops.map((sop) => {
                const isSelected = selectedSop.id === sop.id;
                return (
                  <div
                    key={sop.id}
                    onClick={() => setSelectedSop(sop)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-teal-50/50 border-[#007F82] shadow-sm'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#007F82]">{sop.code}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">{sop.category}</span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 mt-1">{sop.title}</h4>
                      </div>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        isSelected ? 'bg-[#007F82] border-[#007F82] text-white' : 'border-slate-300'
                      }`}>
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {sop.snippet}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Custom Upload Dropzone Simulation */}
            <div className="p-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-800 block">Upload Internal Warehouse Document</span>
                <span className="text-[11px] text-slate-500">Supports .PDF, .DOCX, or OSHA safety logs (Simulated)</span>
              </div>
              <button
                type="button"
                onClick={() => showToast('Demo Upload', 'Uploaded sample SOP: SOP-ALQ-RACK-09.pdf', 'info')}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 font-semibold flex items-center gap-1.5"
              >
                <UploadCloud className="w-3.5 h-3.5 text-[#007F82]" />
                <span>Upload SOP</span>
              </button>
            </div>
          </div>

          {/* Right: Synthesis Configuration (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-5 text-xs flex flex-col justify-between">
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-[#111C28]">
                2. Target Audience & Parameters
              </h3>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Curriculum Language</label>
                <select
                  value={courseLanguage}
                  onChange={(e) => setCourseLanguage(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl"
                >
                  <option value="bilingual">Bilingual (English & Arabic)</option>
                  <option value="en">English Only</option>
                  <option value="ar">العربية (Arabic Only)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Intended Job Roles</label>
                <div className="space-y-2">
                  {(['Forklift Operator', 'Warehouse Associate', 'Loading Supervisor', 'Driver'] as JobRole[]).map((role) => (
                    <label key={role} className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                      <input
                        type="checkbox"
                        checked={selectedRoles.includes(role)}
                        onChange={(e) => {
                          setSelectedRoles(prev => 
                            e.target.checked ? [...prev, role] : prev.filter(r => r !== role)
                          );
                        }}
                        className="text-[#007F82]"
                      />
                      <span>{role}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 leading-relaxed text-[11px]">
                <span className="font-bold">Human-in-the-Loop Safeguard:</span> Generated safety courses remain in draft review until authorized Dubai HSE Reviewer approves the knowledge questions.
              </div>
            </div>

            <button
              type="button"
              onClick={handleStartGeneration}
              className="w-full py-3 px-4 rounded-xl bg-[#007F82] hover:bg-[#006e71] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#007F82]/20 flex items-center justify-center gap-2 transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#79E8CE]" />
              <span>Generate Safety Course Draft</span>
            </button>
          </div>
        </div>
      )}

      {/* Restrained Animated Generation Sequence */}
      {isGenerating && (
        <div className="bg-white rounded-2xl p-12 border border-slate-200 shadow-sm max-w-xl mx-auto text-center space-y-6">
          <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-[#79E8CE]/30 border-t-[#007F82] animate-spin" />
            <Sparkles className="w-7 h-7 text-[#007F82] animate-pulse" />
          </div>

          <div>
            <h3 className="font-extrabold text-base text-[#111C28]">
              Analyzing SOP & Synthesizing Curriculum
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Parsing {selectedSop.code} against UAE Health & Safety Standards
            </p>
          </div>

          <div className="space-y-2.5 max-w-md mx-auto text-xs text-left">
            <div className={`flex items-center gap-2.5 p-2.5 rounded-xl transition-all ${
              generationPhase === 'reading' ? 'bg-teal-50 text-[#007F82] font-bold' : 'text-slate-400'
            }`}>
              <CheckCircle2 className="w-4 h-4 text-[#007F82]" />
              <span>1. Reading source document text and hazard tables...</span>
            </div>

            <div className={`flex items-center gap-2.5 p-2.5 rounded-xl transition-all ${
              generationPhase === 'identifying' ? 'bg-teal-50 text-[#007F82] font-bold' : 'text-slate-400'
            }`}>
              <CheckCircle2 className="w-4 h-4 text-[#007F82]" />
              <span>2. Identifying key HSE risk zones and critical limits...</span>
            </div>

            <div className={`flex items-center gap-2.5 p-2.5 rounded-xl transition-all ${
              generationPhase === 'drafting' ? 'bg-teal-50 text-[#007F82] font-bold' : 'text-slate-400'
            }`}>
              <CheckCircle2 className="w-4 h-4 text-[#007F82]" />
              <span>3. Drafting 3 bite-sized lessons with practical rules...</span>
            </div>

            <div className={`flex items-center gap-2.5 p-2.5 rounded-xl transition-all ${
              generationPhase === 'preparing' ? 'bg-teal-50 text-[#007F82] font-bold' : 'text-slate-400'
            }`}>
              <CheckCircle2 className="w-4 h-4 text-[#007F82]" />
              <span>4. Preparing quiz and supervisor practical sign-off items...</span>
            </div>
          </div>
        </div>
      )}

      {/* Step 3 & 4: Split Workspace Review and Approval */}
      {currentStep >= 3 && generatedDraft && (
        <div className="space-y-6">
          {/* Action Header Ribbon */}
          <div className="bg-[#111C28] text-white p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                generatedDraft.approvalStatus === 'approved' ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500' :
                generatedDraft.approvalStatus === 'changes_requested' ? 'bg-amber-500/30 text-amber-300 border border-amber-500' :
                'bg-blue-500/30 text-blue-300 border border-blue-500'
              }`}>
                {generatedDraft.approvalStatus.replace('_', ' ').toUpperCase()}
              </span>
              <span className="text-slate-300">
                Source Document: <strong>{generatedDraft.sourceRef}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setApprovalModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold transition-all flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#79E8CE]" />
                <span>HSE Review Preview</span>
              </button>

              <button
                type="button"
                onClick={handlePublishToLibrary}
                className="px-4 py-1.5 rounded-xl bg-[#007F82] hover:bg-[#006e71] text-white font-bold transition-all shadow-sm flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Publish to Library</span>
              </button>
            </div>
          </div>

          {/* Split Workspace: Left Source SOP, Right Generated Curriculum */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Source Document (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#007F82]" />
                  <span className="font-bold text-slate-800">Source Standard Operating Document</span>
                </div>
                <span className="font-mono text-slate-400">{selectedSop.code}</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 font-mono text-[11px] text-slate-700 leading-relaxed max-h-[500px] overflow-y-auto">
                <p className="font-bold text-slate-900 font-sans text-xs">{selectedSop.title}</p>
                <p>{selectedSop.snippet}</p>
                <p className="text-slate-500 pt-2 border-t border-slate-200 font-sans">
                  Referenced Clauses: ISO 45001 &bull; Dubai Municipality Code of Construction & Logistics &bull; UAE Civil Defence Order 2026.
                </p>
              </div>
            </div>

            {/* Right Column: Generated Draft Course (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-5 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#007F82]" />
                  <span className="font-bold text-slate-800">Generated Safety Course Curriculum</span>
                </div>
                <span className="text-[10px] font-mono text-[#007F82] font-bold">Generated Draft</span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-[#111C28]">{generatedDraft.title}</h3>
                <div className="mt-2 space-y-1">
                  <span className="font-bold text-slate-700 block">Learning Objectives:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                    {generatedDraft.objectives.map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Generated Lessons */}
              <div className="space-y-3 pt-2">
                <span className="font-bold text-slate-800 block">Lesson Units ({generatedDraft.lessons.length}):</span>
                {generatedDraft.lessons.map((lesson, i) => (
                  <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-[#F4F7F8] space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{i + 1}. {lesson.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{lesson.duration}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-[11px]">{lesson.content}</p>
                  </div>
                ))}
              </div>

              {/* Generated Knowledge Checks */}
              <div className="space-y-2 pt-2">
                <span className="font-bold text-slate-800 block">Knowledge Check Questions:</span>
                {generatedDraft.quiz.map((q, i) => (
                  <div key={i} className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                    <p className="font-semibold text-slate-900">Q{i + 1}: {q.question}</p>
                    <div className="flex flex-wrap gap-2 text-[11px]">
                      {q.options.map((opt, oIdx) => (
                        <span key={oIdx} className={`px-2 py-0.5 rounded ${oIdx === q.answer ? 'bg-emerald-100 text-emerald-800 font-bold' : 'bg-white border text-slate-600'}`}>
                          {opt}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Generated Practical Checklist */}
              <div className="space-y-2 pt-2">
                <span className="font-bold text-slate-800 block">Practical Floor Checklist:</span>
                {generatedDraft.practicalChecklist.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="font-medium text-slate-800">{item.task}</span>
                    {item.isCritical && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-[#D74757]">
                        Critical
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HSE Reviewer Approval Modal */}
      {approvalModalOpen && generatedDraft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#007F82]" />
                <h3 className="font-bold text-base text-[#111C28]">Dubai HSE Committee Approval</h3>
              </div>
              <button onClick={() => setApprovalModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-slate-600 leading-relaxed">
              As an authorized safety reviewer, inspect the generated curriculum against Dubai regulatory frameworks before releasing to frontline operations.
            </p>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Reviewer Remarks & Verification Notes</label>
              <textarea
                rows={3}
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                placeholder="e.g. Verified compliance with JAFZA Freezone Article 14 chemical storage standards."
                className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setGeneratedDraft({
                    ...generatedDraft,
                    approvalStatus: 'changes_requested',
                    reviewerComments: reviewNote || 'Clarify temperature thresholds in lesson 2.'
                  });
                  setApprovalModalOpen(false);
                  showToast('Changes Requested', 'Reviewer feedback recorded. Curriculum marked for revision.', 'warning');
                }}
                className="px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold border border-amber-200"
              >
                Request Revisions
              </button>

              <button
                type="button"
                onClick={() => {
                  setGeneratedDraft({
                    ...generatedDraft,
                    approvalStatus: 'approved',
                    reviewerComments: reviewNote || 'Approved for UAE logistics publication.'
                  });
                  setApprovalModalOpen(false);
                  showToast('Curriculum Approved', 'Safety course approved by HSE reviewer for publication.', 'success');
                }}
                className="px-5 py-2 rounded-xl bg-[#007F82] hover:bg-[#006e71] text-white font-bold shadow-md"
              >
                Approve & Certify
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
