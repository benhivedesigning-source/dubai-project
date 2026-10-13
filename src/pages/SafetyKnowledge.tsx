import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SafetyDocument } from '../types';
import { 
  Compass, 
  FileText, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Upload, 
  Plus, 
  Eye, 
  ToggleLeft, 
  ToggleRight, 
  X, 
  ShieldCheck, 
  HelpCircle,
  Building2,
  BookOpen
} from 'lucide-react';

export const SafetyKnowledge: React.FC = () => {
  const { safetyDocs, approveSafetyDoc, toggleDocAiAccess, showToast, language } = useApp();

  const [search, setSearch] = useState('');
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<SafetyDocument | null>(null);

  // "Ask Approved Knowledge" Demo Panel State
  const [askQuery, setAskQuery] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [qaResult, setQaResult] = useState<{
    answer: string;
    sourceTitle?: string;
    sourceCode?: string;
    section?: string;
    found: boolean;
  } | null>(null);

  const suggestedQuestions = [
    'What is the maximum stacking height in Jebel Ali racking?',
    'What PPE is mandatory in battery charging bays?',
    'What is the heat stress break protocol above 45°C?',
    'Can forklift operators use mobile phones while driving?'
  ];

  // Simulated Grounded Knowledge Responses
  const handleAskQuestion = (questionText: string) => {
    setAskQuery(questionText);
    setIsAsking(true);
    setQaResult(null);

    setTimeout(() => {
      setIsAsking(false);

      if (questionText.includes('stacking height') || questionText.includes('racking')) {
        setQaResult({
          answer: 'The maximum allowable pallet stacking height in temperature-controlled deep-freeze bays is 9.2 meters with minimum 150mm upright clearance. Heavy bulk cartons exceeding 500 kg must strictly remain at Level 1 or Level 2 beam positions.',
          sourceTitle: 'Pallet Racking & High-Reach Safety in Temperature Controlled Facilities',
          sourceCode: 'SOP-LOG-042 v3.4',
          section: 'Section 4.2: Maximum Bay Elevation & Upright Load Tolerance',
          found: true
        });
      } else if (questionText.includes('battery charging') || questionText.includes('PPE')) {
        setQaResult({
          answer: 'Mandatory PPE in battery charging bays comprises full-face polycarbonate shields, acid-resistant neoprene aprons, and rubber gauntlet gloves. Eye wash fountains must deliver 15 minutes of uninterrupted flushing within 10 seconds travel.',
          sourceTitle: 'Electric Forklift Battery Charging Station Safety & Eyewash Protocols',
          sourceCode: 'SOP-OPS-099 v1.9',
          section: 'Section 2.1: Acid Splash Containment & Ventilation Requirements',
          found: true
        });
      } else if (questionText.includes('heat stress') || questionText.includes('45°C')) {
        setQaResult({
          answer: 'Under MoHRE Summer Regulations and AERIS SOP-UAE-005, outdoor cross-dock operations are halted between 12:30 PM and 3:00 PM. In ambient temperatures exceeding 45°C, workers receive mandatory 15-minute shaded rest breaks every 45 minutes with chilled electrolyte solution replenishment.',
          sourceTitle: 'MoHRE Mid-Day Work Ban & Summer Thermal Management Protocol',
          sourceCode: 'SOP-UAE-005 v4.0',
          section: 'Section 3.1: Mid-Day Stoppage & WBGT Thermal Alert Index',
          found: true
        });
      } else {
        // No approved source found state
        setQaResult({
          answer: 'No approved procedure or HSE SOP currently addresses this specific query in the active AERIS knowledge base. Please consult your on-site HSE Officer.',
          found: false
        });
      }
    }, 700);
  };

  const filteredDocs = safetyDocs.filter((d) => 
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.docCode.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#007F82] uppercase tracking-wider font-mono">
            <Compass className="w-4 h-4" />
            <span>Controlled Knowledge Governance &bull; Prototype Module</span>
          </div>
          <h2 className="text-xl lg:text-2xl font-extrabold text-[#111C28] mt-1">
            Safety Content & AI Knowledge Base
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Controlled SOP repository and verified answers cited directly from approved safety documents
          </p>
        </div>

        <button
          onClick={() => showToast('Demo Upload', 'Document upload wizard is simulated in this prototype.', 'info')}
          className="px-4 py-2 rounded-xl bg-[#007F82] hover:bg-[#006e71] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#007F82]/20 transition-all self-start sm:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Procedure</span>
        </button>
      </div>

      {/* "Ask Approved Knowledge" Demo Panel */}
      <div className="bg-gradient-to-br from-[#111C28] via-[#162433] to-[#0c1622] rounded-2xl p-6 text-white border border-[#223547] shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#007F82] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-[#79E8CE]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white">Ask Approved Safety Knowledge</h3>
              <p className="text-[11px] text-slate-300">
                Grounded answers strictly cited from approved AERIS UAE Standard Operating Procedures
              </p>
            </div>
          </div>

          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#79E8CE]/20 text-[#79E8CE] border border-[#79E8CE]/30">
            Simulated Grounding
          </span>
        </div>

        {/* Input & Search */}
        <div className="relative">
          <input
            type="text"
            value={askQuery}
            onChange={(e) => setAskQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAskQuestion(askQuery)}
            placeholder="Type a safety question (e.g. 'What is the maximum stacking height in Jebel Ali?')..."
            className="w-full pl-4 pr-24 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#79E8CE] transition-all"
          />
          <button
            type="button"
            onClick={() => handleAskQuestion(askQuery)}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#007F82] hover:bg-[#006e71] text-white text-xs font-bold transition-all"
          >
            Ask AI
          </button>
        </div>

        {/* Suggested Queries Pills */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="text-slate-400 text-[11px] font-semibold self-center">Try prompt:</span>
          {suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleAskQuestion(q)}
              className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] border border-slate-700 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>

        {/* AI QA Output */}
        {isAsking && (
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-center text-xs text-slate-400 animate-pulse">
            Scanning 5 approved logistics SOPs for cited clauses...
          </div>
        )}

        {qaResult && !isAsking && (
          <div className="p-4 rounded-xl bg-slate-900/90 border border-[#79E8CE]/40 space-y-3 text-xs animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#79E8CE] flex items-center gap-1.5">
                {qaResult.found ? <ShieldCheck className="w-4 h-4" /> : <AlertCircle className="w-4 h-4 text-amber-400" />}
                {qaResult.found ? 'Approved Knowledge Response' : 'No Approved Source Found'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Confidence: 99.4% Verified</span>
            </div>

            <p className="text-slate-200 leading-relaxed font-sans text-xs">
              {qaResult.answer}
            </p>

            {qaResult.found && (
              <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
                <span>Citation: <strong className="text-white">{qaResult.sourceCode}</strong> &bull; {qaResult.sourceTitle}</span>
                <span className="text-[#79E8CE]">{qaResult.section}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controlled Document Library Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden text-xs">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-sm text-[#111C28]">Controlled Safety Procedures</h3>
          <span className="text-[11px] text-slate-500">Only Approved documents are indexed for AI retrieval</span>
        </div>

        <table className="w-full text-left">
          <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
            <tr>
              <th className="p-3.5 pl-4">Document Code & Title</th>
              <th className="p-3.5">Category</th>
              <th className="p-3.5">Owner</th>
              <th className="p-3.5">Version</th>
              <th className="p-3.5">Effective Date</th>
              <th className="p-3.5">Approval Status</th>
              <th className="p-3.5">AI Access</th>
              <th className="p-3.5 text-right pr-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredDocs.map((doc) => (
              <tr key={doc.id} className="hover:bg-slate-50">
                <td className="p-3.5 pl-4">
                  <div>
                    <span className="font-bold text-slate-900 block">{doc.title}</span>
                    <span className="text-[10px] text-[#007F82] font-mono">{doc.docCode}</span>
                  </div>
                </td>

                <td className="p-3.5 text-slate-600">{doc.category}</td>
                <td className="p-3.5 text-slate-600">{doc.owner}</td>
                <td className="p-3.5 font-mono">v{doc.version}</td>
                <td className="p-3.5 font-mono text-slate-500">{doc.effectiveDate}</td>

                <td className="p-3.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                    doc.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                    'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    {doc.status.replace('_', ' ')}
                  </span>
                </td>

                <td className="p-3.5">
                  <button
                    onClick={() => toggleDocAiAccess(doc.id)}
                    className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-700"
                    title="Toggle AI Knowledge Retrieval"
                  >
                    {doc.availableToAi ? (
                      <>
                        <ToggleRight className="w-5 h-5 text-[#007F82]" />
                        <span className="text-[#007F82]">Enabled</span>
                      </>
                    ) : (
                      <>
                        <ToggleLeft className="w-5 h-5 text-slate-400" />
                        <span className="text-slate-400">Disabled</span>
                      </>
                    )}
                  </button>
                </td>

                <td className="p-3.5 text-right pr-4">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setSelectedDocForPreview(doc)}
                      className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-600"
                      title="Preview Document Text"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    {doc.status !== 'approved' && (
                      <button
                        onClick={() => approveSafetyDoc(doc.id)}
                        className="px-2.5 py-1 rounded bg-[#007F82] text-white font-semibold text-[10px]"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Document Text Preview Modal */}
      {selectedDocForPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="font-mono text-xs text-[#007F82] font-bold">{selectedDocForPreview.docCode}</span>
                <h3 className="font-bold text-sm text-[#111C28]">{selectedDocForPreview.title}</h3>
              </div>
              <button onClick={() => setSelectedDocForPreview(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 font-mono text-[11px] leading-relaxed">
              <p className="font-bold text-slate-900 font-sans">Procedure Snippet:</p>
              <p>{selectedDocForPreview.contentSnippet}</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedDocForPreview(null)}
                className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
