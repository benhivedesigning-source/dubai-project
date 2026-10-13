import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Course, Lesson, QuizQuestion } from '../types';
import { 
  BookOpen, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  Plus, 
  Edit3, 
  Eye, 
  Clock, 
  Users, 
  Languages, 
  CheckCircle2, 
  FileCheck, 
  Layers, 
  X, 
  ChevronRight, 
  MoveUp, 
  MoveDown,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const CourseManagement: React.FC = () => {
  const { courses, addCourse, updateCourse, showToast, language } = useApp();

  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Course Editor State
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editorTab, setEditorTab] = useState<'details' | 'lessons' | 'assessment' | 'languages' | 'version' | 'publishing'>('details');

  // Learner Preview Modal
  const [previewModalCourse, setPreviewModalCourse] = useState<Course | null>(null);
  const [activePreviewLessonIndex, setActivePreviewLessonIndex] = useState(0);
  const [quizTestAnswer, setQuizTestAnswer] = useState<number | null>(null);

  // Filtered courses
  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'all' || c.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  // Open editor for new course
  const handleOpenNewCourse = () => {
    const newCourseTemplate: Course = {
      id: `crs-${Date.now()}`,
      code: `HSE-${Math.floor(500 + Math.random() * 400)}`,
      title: 'New Logistics Safety Standard',
      titleAr: 'معيار سلامة لوجستي جديد',
      description: 'Standard operating safety guidelines for Dubai logistics operations.',
      descriptionAr: 'إرشادات السلامة التشغيلية المعتمدة لعمليات دبي اللوجستية.',
      category: 'Equipment',
      targetRoles: ['Forklift Operator', 'Warehouse Associate'],
      durationMinutes: 30,
      languages: ['en', 'ar'],
      version: '1.0',
      status: 'draft',
      lastUpdated: new Date().toISOString().split('T')[0],
      assignedCount: 0,
      completionRate: 0,
      passMarkPercent: 80,
      lessons: [
        {
          id: `l-1`,
          title: 'Introduction & Scope',
          durationMinutes: 10,
          content: 'Overview of safety standards and zero-harm operational objectives.',
          type: 'interactive',
          order: 1
        }
      ],
      questions: [
        {
          id: `q-1`,
          question: 'What is the primary objective of this safety procedure?',
          options: ['Expedite delivery only', 'Protect worker safety and zero harm', 'Eliminate paperwork'],
          correctIndex: 1,
          explanation: 'Worker life and safety is the paramount objective.'
        }
      ]
    };
    setEditingCourse(newCourseTemplate);
    setEditorTab('details');
    setEditorOpen(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse({ ...course });
    setEditorTab('details');
    setEditorOpen(true);
  };

  const handleSaveCourse = () => {
    if (!editingCourse) return;
    const exists = courses.some((c) => c.id === editingCourse.id);
    if (exists) {
      updateCourse({
        ...editingCourse,
        lastUpdated: new Date().toISOString().split('T')[0]
      });
    } else {
      addCourse({
        ...editingCourse,
        lastUpdated: new Date().toISOString().split('T')[0]
      });
    }
    setEditorOpen(false);
  };

  // Reordering lessons
  const moveLesson = (index: number, direction: 'up' | 'down') => {
    if (!editingCourse) return;
    const newLessons = [...editingCourse.lessons];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newLessons.length) return;
    const temp = newLessons[index];
    newLessons[index] = newLessons[targetIndex];
    newLessons[targetIndex] = temp;
    // update orders
    newLessons.forEach((l, i) => { l.order = i + 1; });
    setEditingCourse({ ...editingCourse, lessons: newLessons });
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl lg:text-2xl font-extrabold text-[#111C28] tracking-tight">
            Safety Curriculum & Course Library
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Standardized HSE training modules, pass criteria, and regulatory version controls
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Card / Table Switcher */}
          <div className="bg-[#F4F7F8] p-1 rounded-xl border border-slate-200 flex items-center gap-1">
            <button
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'card' ? 'bg-white text-[#007F82] shadow-sm' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'table' ? 'bg-white text-[#007F82] shadow-sm' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={handleOpenNewCourse}
            className="px-4 py-2 rounded-xl bg-[#007F82] hover:bg-[#006e71] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-[#007F82]/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create Course</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or code (e.g. HSE-101)..."
            className="w-full pl-9 pr-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#007F82]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">All Categories</option>
            <option value="Induction">Induction</option>
            <option value="Equipment">Equipment Safety</option>
            <option value="Ergonomics">Ergonomics</option>
            <option value="Logistics">Logistics Operations</option>
            <option value="PPE & Health">PPE & Health</option>
            <option value="Emergency">Emergency</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">All Publishing Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft Edits</option>
            <option value="in_review">In HSE Review</option>
          </select>
        </div>
      </div>

      {/* Card View */}
      {viewMode === 'card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((crs) => (
            <div
              key={crs.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
            >
              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[#007F82] font-bold tracking-wider">
                    {crs.code}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                      v{crs.version}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      crs.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                      crs.status === 'in_review' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {crs.status}
                    </span>
                  </div>
                </div>

                <h3 className="font-extrabold text-base text-[#111C28] group-hover:text-[#007F82] transition-colors leading-snug">
                  {crs.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {crs.description}
                </p>

                {/* Target roles pill strip */}
                <div className="flex flex-wrap gap-1">
                  {crs.targetRoles.slice(0, 2).map((role, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-[#F4F7F8] text-slate-600 font-medium">
                      {role}
                    </span>
                  ))}
                  {crs.targetRoles.length > 2 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-400">
                      +{crs.targetRoles.length - 2}
                    </span>
                  )}
                </div>
              </div>

              {/* Bottom Meta & Actions */}
              <div className="px-5 py-3.5 bg-[#F8FAFC] border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{crs.durationMinutes} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-slate-400" />
                    <span>{crs.assignedCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Languages className="w-3 h-3 text-slate-400" />
                    <span>{crs.languages.join('/').toUpperCase()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setPreviewModalCourse(crs);
                      setActivePreviewLessonIndex(0);
                      setQuizTestAnswer(null);
                    }}
                    className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-600 hover:text-slate-900 transition-colors"
                    title="Learner View Preview"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleEditCourse(crs)}
                    className="p-1.5 rounded-lg hover:bg-slate-200/70 text-[#007F82] transition-colors"
                    title="Edit Curriculum"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-500 font-bold uppercase text-[11px]">
              <tr>
                <th className="p-3.5 pl-4">Code</th>
                <th className="p-3.5">Course Title</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Duration</th>
                <th className="p-3.5">Languages</th>
                <th className="p-3.5">Version</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Assigned</th>
                <th className="p-3.5 text-right pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCourses.map((crs) => (
                <tr key={crs.id} className="hover:bg-slate-50">
                  <td className="p-3.5 pl-4 font-mono font-bold text-[#007F82]">{crs.code}</td>
                  <td className="p-3.5 font-bold text-slate-900">
                    <p>{crs.title}</p>
                    <p className="text-[10px] text-slate-400 font-normal truncate max-w-sm">{crs.description}</p>
                  </td>
                  <td className="p-3.5 text-slate-600">{crs.category}</td>
                  <td className="p-3.5 font-mono">{crs.durationMinutes} mins</td>
                  <td className="p-3.5 font-mono">{crs.languages.join('/').toUpperCase()}</td>
                  <td className="p-3.5 font-mono">v{crs.version}</td>
                  <td className="p-3.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      crs.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {crs.status}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono">{crs.assignedCount}</td>
                  <td className="p-3.5 text-right pr-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setPreviewModalCourse(crs);
                          setActivePreviewLessonIndex(0);
                        }}
                        className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500"
                        title="Preview"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleEditCourse(crs)}
                        className="px-2.5 py-1 rounded bg-[#007F82] text-white font-semibold text-[11px]"
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Course Editor Modal / Drawer */}
      {editorOpen && editingCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-200 shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#007F82] uppercase tracking-wider">
                  Curriculum Editor &bull; {editingCourse.code}
                </span>
                <h3 className="font-extrabold text-base text-[#111C28]">
                  {editingCourse.title}
                </h3>
              </div>
              <button onClick={() => setEditorOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Editor Sub-tabs */}
            <div className="border-b border-slate-200 px-5 flex items-center gap-3 overflow-x-auto text-xs bg-white">
              {[
                { id: 'details', label: 'Course Details' },
                { id: 'lessons', label: `Lessons (${editingCourse.lessons.length})` },
                { id: 'assessment', label: `Assessment Quiz (${editingCourse.questions.length})` },
                { id: 'languages', label: 'Languages & RTL' },
                { id: 'version', label: 'Version History' },
                { id: 'publishing', label: 'Publishing' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setEditorTab(tab.id as any)}
                  className={`py-3 px-2 font-semibold border-b-2 transition-all whitespace-nowrap ${
                    editorTab === tab.id
                      ? 'border-[#007F82] text-[#007F82]'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* Tab: Details */}
              {editorTab === 'details' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Course Code</label>
                      <input
                        type="text"
                        value={editingCourse.code}
                        onChange={(e) => setEditingCourse({ ...editingCourse, code: e.target.value })}
                        className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Category</label>
                      <select
                        value={editingCourse.category}
                        onChange={(e) => setEditingCourse({ ...editingCourse, category: e.target.value as any })}
                        className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl"
                      >
                        <option value="Induction">Induction</option>
                        <option value="Equipment">Equipment Safety</option>
                        <option value="Ergonomics">Ergonomics</option>
                        <option value="Logistics">Logistics Operations</option>
                        <option value="PPE & Health">PPE & Health</option>
                        <option value="Emergency">Emergency</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Course Title (English)</label>
                    <input
                      type="text"
                      value={editingCourse.title}
                      onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Course Title (Arabic)</label>
                    <input
                      type="text"
                      value={editingCourse.titleAr}
                      onChange={(e) => setEditingCourse({ ...editingCourse, titleAr: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={editingCourse.description}
                      onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })}
                      className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Duration (Minutes)</label>
                      <input
                        type="number"
                        value={editingCourse.durationMinutes}
                        onChange={(e) => setEditingCourse({ ...editingCourse, durationMinutes: parseInt(e.target.value) || 30 })}
                        className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Pass Mark Benchmark (%)</label>
                      <input
                        type="number"
                        value={editingCourse.passMarkPercent}
                        onChange={(e) => setEditingCourse({ ...editingCourse, passMarkPercent: parseInt(e.target.value) || 80 })}
                        className="w-full px-3 py-2 bg-[#F4F7F8] border border-slate-200 rounded-xl font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Lessons */}
              {editorTab === 'lessons' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-slate-600">Reorder, edit, and append interactive safety lessons.</p>
                    <button
                      type="button"
                      onClick={() => {
                        const newLesson: Lesson = {
                          id: `l-${Date.now()}`,
                          title: `New Lesson Section`,
                          durationMinutes: 10,
                          content: 'Detailed procedure content and safety standards.',
                          type: 'interactive',
                          order: editingCourse.lessons.length + 1
                        };
                        setEditingCourse({
                          ...editingCourse,
                          lessons: [...editingCourse.lessons, newLesson]
                        });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#007F82] text-white font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Lesson</span>
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {editingCourse.lessons.map((lesson, idx) => (
                      <div key={lesson.id} className="p-3.5 rounded-xl border border-slate-200 bg-[#F4F7F8] space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-[#111C28] text-white flex items-center justify-center font-bold text-[10px] font-mono">
                              {idx + 1}
                            </span>
                            <input
                              type="text"
                              value={lesson.title}
                              onChange={(e) => {
                                const updated = [...editingCourse.lessons];
                                updated[idx].title = e.target.value;
                                setEditingCourse({ ...editingCourse, lessons: updated });
                              }}
                              className="px-2 py-1 bg-white border border-slate-200 rounded-lg font-bold text-slate-800"
                            />
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => moveLesson(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded hover:bg-slate-200 disabled:opacity-30"
                              title="Move Up"
                            >
                              <MoveUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveLesson(idx, 'down')}
                              disabled={idx === editingCourse.lessons.length - 1}
                              className="p-1 rounded hover:bg-slate-200 disabled:opacity-30"
                              title="Move Down"
                            >
                              <MoveDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <textarea
                          rows={2}
                          value={lesson.content}
                          onChange={(e) => {
                            const updated = [...editingCourse.lessons];
                            updated[idx].content = e.target.value;
                            setEditingCourse({ ...editingCourse, lessons: updated });
                          }}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Assessment Questions */}
              {editorTab === 'assessment' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-slate-600">Knowledge check questions required before practical field sign-off.</p>
                    <button
                      type="button"
                      onClick={() => {
                        const newQ: QuizQuestion = {
                          id: `q-${Date.now()}`,
                          question: 'New HSE Knowledge Verification Question',
                          options: ['Standard Option A', 'Correct Option B', 'Option C'],
                          correctIndex: 1,
                          explanation: 'Compliant with UAE logistics health and safety codes.'
                        };
                        setEditingCourse({
                          ...editingCourse,
                          questions: [...editingCourse.questions, newQ]
                        });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#007F82] text-white font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Question</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {editingCourse.questions.map((q, qIdx) => (
                      <div key={q.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-400">Q{qIdx + 1}:</span>
                          <input
                            type="text"
                            value={q.question}
                            onChange={(e) => {
                              const updated = [...editingCourse.questions];
                              updated[qIdx].question = e.target.value;
                              setEditingCourse({ ...editingCourse, questions: updated });
                            }}
                            className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-semibold"
                          />
                        </div>

                        <div className="space-y-1.5 pl-6">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct-${q.id}`}
                                checked={q.correctIndex === oIdx}
                                onChange={() => {
                                  const updated = [...editingCourse.questions];
                                  updated[qIdx].correctIndex = oIdx;
                                  setEditingCourse({ ...editingCourse, questions: updated });
                                }}
                                className="text-[#007F82]"
                              />
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => {
                                  const updated = [...editingCourse.questions];
                                  updated[qIdx].options[oIdx] = e.target.value;
                                  setEditingCourse({ ...editingCourse, questions: updated });
                                }}
                                className="flex-1 px-2.5 py-1 bg-white border border-slate-200 rounded-md text-xs"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Languages */}
              {editorTab === 'languages' && (
                <div className="space-y-4">
                  <p className="text-slate-600">Multilingual logistics workforce localization settings:</p>
                  <div className="space-y-2">
                    {[
                      { code: 'en', name: 'English (Primary UAE Logistics standard)' },
                      { code: 'ar', name: 'العربية (Arabic - UAE Ministry & Regulatory standard)' },
                      { code: 'ur', name: 'اردو (Urdu - Logistics Operator support)' }
                    ].map((lang) => (
                      <label key={lang.code} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white">
                        <input
                          type="checkbox"
                          checked={editingCourse.languages.includes(lang.code as any)}
                          onChange={(e) => {
                            const cur = editingCourse.languages;
                            const next = e.target.checked 
                              ? [...cur, lang.code as any]
                              : cur.filter(l => l !== lang.code);
                            setEditingCourse({ ...editingCourse, languages: next });
                          }}
                          className="w-4 h-4 text-[#007F82]"
                        />
                        <span className="font-semibold text-slate-800">{lang.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Version History */}
              {editorTab === 'version' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 leading-relaxed">
                    <p className="font-bold">Historical Completion Integrity:</p>
                    <p className="text-[11px] mt-0.5">
                      Publishing a new version updates future enrollments while preserving historical audits for workers certified under previous revisions.
                    </p>
                  </div>

                  <div className="space-y-2 font-mono">
                    <div className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                      <div>
                        <span className="font-bold text-slate-900">v{editingCourse.version} (Active Draft)</span>
                        <p className="text-[10px] text-slate-500 font-sans">Edited today by HSE Lead</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold font-sans">
                        In Progress
                      </span>
                    </div>

                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-slate-600">
                      <div>
                        <span className="font-bold">v1.0 (Historical Archive)</span>
                        <p className="text-[10px] font-sans">Certified 24 completions</p>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200 text-slate-600 font-sans">
                        Archived
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: Publishing */}
              {editorTab === 'publishing' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-slate-200 bg-[#F4F7F8] space-y-3">
                    <span className="font-bold text-slate-900 block">Publication Workflow</span>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200">
                        <input
                          type="radio"
                          name="pub-status"
                          checked={editingCourse.status === 'draft'}
                          onChange={() => setEditingCourse({ ...editingCourse, status: 'draft' })}
                          className="text-[#007F82]"
                        />
                        <div>
                          <span className="font-bold text-slate-800">Draft</span>
                          <p className="text-[10px] text-slate-500">Only visible to administrators and curriculum authors.</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200">
                        <input
                          type="radio"
                          name="pub-status"
                          checked={editingCourse.status === 'in_review'}
                          onChange={() => setEditingCourse({ ...editingCourse, status: 'in_review' })}
                          className="text-[#007F82]"
                        />
                        <div>
                          <span className="font-bold text-slate-800">In HSE Review</span>
                          <p className="text-[10px] text-slate-500">Submitted to Dubai HSE Reviewer committee for sign-off.</p>
                        </div>
                      </label>

                      <label className="flex items-center gap-2 p-2 rounded-lg bg-white border border-slate-200">
                        <input
                          type="radio"
                          name="pub-status"
                          checked={editingCourse.status === 'published'}
                          onChange={() => setEditingCourse({ ...editingCourse, status: 'published' })}
                          className="text-[#007F82]"
                        />
                        <div>
                          <span className="font-bold text-emerald-800">Published</span>
                          <p className="text-[10px] text-slate-500">Live across all UAE facilities for assignment and verification.</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-end gap-2 text-xs">
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-200 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCourse}
                className="px-5 py-2 font-bold text-white bg-[#007F82] hover:bg-[#006e71] rounded-xl shadow-md"
              >
                Save Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Learner View Preview Modal */}
      {previewModalCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#111C28] text-white rounded-2xl max-w-2xl w-full p-6 border border-slate-700 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#007F82] text-white font-bold">
                  Learner Simulation
                </span>
                <h3 className="font-bold text-sm text-white">
                  {previewModalCourse.code} &bull; {previewModalCourse.title}
                </h3>
              </div>
              <button onClick={() => setPreviewModalCourse(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Lesson Slide Preview */}
            <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Lesson {activePreviewLessonIndex + 1} of {previewModalCourse.lessons.length}</span>
                <span>{previewModalCourse.durationMinutes} min runtime</span>
              </div>

              <h4 className="text-lg font-bold text-[#79E8CE]">
                {previewModalCourse.lessons[activePreviewLessonIndex]?.title || 'Safety Module Overview'}
              </h4>

              <p className="text-xs text-slate-300 leading-relaxed min-h-[70px]">
                {previewModalCourse.lessons[activePreviewLessonIndex]?.content || 'Content not specified.'}
              </p>

              {/* Sample Quiz Interaction if on last lesson */}
              {activePreviewLessonIndex === previewModalCourse.lessons.length - 1 && previewModalCourse.questions.length > 0 && (
                <div className="mt-4 p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-3 text-xs">
                  <div className="flex items-center gap-1.5 text-[#79E8CE] font-bold">
                    <HelpCircle className="w-4 h-4" />
                    <span>Knowledge Check:</span>
                  </div>
                  <p className="font-semibold text-white">
                    {previewModalCourse.questions[0].question}
                  </p>
                  <div className="space-y-1.5">
                    {previewModalCourse.questions[0].options.map((opt, oIdx) => (
                      <button
                        key={oIdx}
                        onClick={() => setQuizTestAnswer(oIdx)}
                        className={`w-full p-2.5 rounded-lg text-left text-xs transition-all flex items-center justify-between ${
                          quizTestAnswer === oIdx
                            ? oIdx === previewModalCourse.questions[0].correctIndex
                              ? 'bg-emerald-950 border border-emerald-500 text-emerald-200'
                              : 'bg-red-950 border border-red-500 text-red-200'
                            : 'bg-slate-900/60 border border-slate-700 hover:border-slate-500 text-slate-200'
                        }`}
                      >
                        <span>{opt}</span>
                        {quizTestAnswer === oIdx && (
                          <span className="font-bold text-[10px]">
                            {oIdx === previewModalCourse.questions[0].correctIndex ? 'Correct' : 'Incorrect'}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                disabled={activePreviewLessonIndex === 0}
                onClick={() => setActivePreviewLessonIndex(prev => Math.max(0, prev - 1))}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 disabled:opacity-30 text-xs font-semibold"
              >
                Previous Slide
              </button>

              <button
                disabled={activePreviewLessonIndex === previewModalCourse.lessons.length - 1}
                onClick={() => setActivePreviewLessonIndex(prev => Math.min(previewModalCourse.lessons.length - 1, prev + 1))}
                className="px-4 py-1.5 rounded-lg bg-[#007F82] hover:bg-[#006e71] text-white text-xs font-bold"
              >
                Next Slide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
