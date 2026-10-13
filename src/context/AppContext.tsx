import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { 
  Employee, 
  Course, 
  CourseAssignment, 
  PracticalAssessment, 
  Qualification, 
  SafetyDocument, 
  ActivityLog,
  NotificationItem,
  UserRole,
  Language,
  LocationId
} from '../types';
import { 
  INITIAL_EMPLOYEES, 
  INITIAL_COURSES, 
  INITIAL_ASSIGNMENTS, 
  INITIAL_PRACTICAL_ASSESSMENTS, 
  INITIAL_QUALIFICATIONS, 
  INITIAL_SAFETY_DOCS, 
  INITIAL_ACTIVITY_LOGS,
  LOCATIONS
} from '../data/mockData';
import { translations } from '../translations';

export type ScreenId = 
  | 'login'
  | 'dashboard'
  | 'employees'
  | 'employee_details'
  | 'course_management'
  | 'training_assignments'
  | 'practical_assessments'
  | 'reports'
  | 'ai_course_builder'
  | 'certificates'
  | 'safety_knowledge'
  | 'settings';

export interface UserSession {
  name: string;
  nameAr: string;
  email: string;
  role: UserRole;
  avatar: string;
  title: string;
  location?: LocationId;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'critical';
}

interface AppContextType {
  // Navigation & User
  currentScreen: ScreenId;
  setCurrentScreen: (screen: ScreenId) => void;
  selectedEmployeeId: string | null;
  setSelectedEmployeeId: (id: string | null) => void;
  openEmployeeDetails: (id: string) => void;
  user: UserSession | null;
  setUser: (user: UserSession | null) => void;
  loginAs: (role: UserRole) => void;
  logout: () => void;
  
  // Preferences
  language: Language;
  setLanguage: (lang: Language) => void;
  selectedLocation: LocationId;
  setSelectedLocation: (loc: LocationId) => void;
  t: typeof translations.en;
  
  // Data state
  employees: Employee[];
  courses: Course[];
  assignments: CourseAssignment[];
  practicalAssessments: PracticalAssessment[];
  qualifications: Qualification[];
  safetyDocs: SafetyDocument[];
  activityLogs: ActivityLog[];
  notifications: NotificationItem[];
  toasts: ToastMessage[];

  // Mutators
  addEmployee: (emp: Omit<Employee, 'id' | 'completedCoursesCount' | 'totalAssignedCourses' | 'overdueCount' | 'qualificationStatus'>) => void;
  updateEmployee: (emp: Employee) => void;
  addCourse: (course: Course) => void;
  updateCourse: (course: Course) => void;
  assignCoursesToEmployees: (courseIds: string[], employeeIds: string[], dueDate: string, reminderConfig: string) => void;
  updateAssignmentDueDate: (assignmentId: string, newDueDate: string) => void;
  simulateReminder: (assignmentId: string) => void;
  submitPracticalAssessment: (assessmentId: string, decision: 'pass' | 'needs_retraining', checklist: PracticalAssessment['checklist'], observations: string, reason?: string) => void;
  scheduleNewPracticalAssessment: (employeeId: string, courseId: string, taskTitle: string, scheduledDate: string, supervisorName: string) => void;
  recordQualification: (qual: Omit<Qualification, 'id'>) => void;
  approveSafetyDoc: (docId: string) => void;
  toggleDocAiAccess: (docId: string) => void;
  dismissToast: (id: string) => void;
  showToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  markNotificationsAsRead: () => void;
  resetDemoData: () => void;

  // Filtered views helper
  filteredEmployees: Employee[];
  filteredAssignments: CourseAssignment[];
  filteredAssessments: PracticalAssessment[];
}

const STORAGE_KEY = 'aeris_safety_lms_v1';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation & session state
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('login');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [selectedLocation, setSelectedLocation] = useState<LocationId>('all');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Default User session
  const [user, setUser] = useState<UserSession | null>(null);

  // Core Data loaded from localStorage or seeded
  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_employees`);
      return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
    } catch {
      return INITIAL_EMPLOYEES;
    }
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_courses`);
      return saved ? JSON.parse(saved) : INITIAL_COURSES;
    } catch {
      return INITIAL_COURSES;
    }
  });

  const [assignments, setAssignments] = useState<CourseAssignment[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_assignments`);
      return saved ? JSON.parse(saved) : INITIAL_ASSIGNMENTS;
    } catch {
      return INITIAL_ASSIGNMENTS;
    }
  });

  const [practicalAssessments, setPracticalAssessments] = useState<PracticalAssessment[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_practical`);
      return saved ? JSON.parse(saved) : INITIAL_PRACTICAL_ASSESSMENTS;
    } catch {
      return INITIAL_PRACTICAL_ASSESSMENTS;
    }
  });

  const [qualifications, setQualifications] = useState<Qualification[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_quals`);
      return saved ? JSON.parse(saved) : INITIAL_QUALIFICATIONS;
    } catch {
      return INITIAL_QUALIFICATIONS;
    }
  });

  const [safetyDocs, setSafetyDocs] = useState<SafetyDocument[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_docs`);
      return saved ? JSON.parse(saved) : INITIAL_SAFETY_DOCS;
    } catch {
      return INITIAL_SAFETY_DOCS;
    }
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_logs`);
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
    } catch {
      return INITIAL_ACTIVITY_LOGS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    { id: 'notif-1', title: 'Overdue Course Alert', message: 'Rashid Al-Nuaimi is 27 days overdue on HSE-204 Forklift Traffic Separation.', timestamp: '10m ago', type: 'alert', read: false, linkPage: 'employees' },
    { id: 'notif-2', title: 'Practical Assessment Scheduled', message: 'Reach Truck Pre-Shift Evaluation assigned for Oct 14 at Jebel Ali.', timestamp: '1h ago', type: 'info', read: false, linkPage: 'practical_assessments' },
    { id: 'notif-3', title: 'Qualification Expiring', message: 'Dubai Municipality Heavy Forklift License for Rashid Al-Nuaimi expires in 20 days.', timestamp: '3h ago', type: 'alert', read: false, linkPage: 'certificates' },
    { id: 'notif-4', title: 'HSE SOP Approved', message: 'SOP-LOG-042 Pallet Racking Safety v3.4 approved for AI Knowledge Base.', timestamp: '1d ago', type: 'success', read: true, linkPage: 'safety_knowledge' }
  ]);

  // Keep layout fixed in LTR (preventing jarring left/right shifts while translating content)
  useEffect(() => {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = language;
    if (language === 'ar') {
      document.body.classList.add('font-arabic');
    } else {
      document.body.classList.remove('font-arabic');
    }
  }, [language]);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_employees`, JSON.stringify(employees));
      localStorage.setItem(`${STORAGE_KEY}_courses`, JSON.stringify(courses));
      localStorage.setItem(`${STORAGE_KEY}_assignments`, JSON.stringify(assignments));
      localStorage.setItem(`${STORAGE_KEY}_practical`, JSON.stringify(practicalAssessments));
      localStorage.setItem(`${STORAGE_KEY}_quals`, JSON.stringify(qualifications));
      localStorage.setItem(`${STORAGE_KEY}_docs`, JSON.stringify(safetyDocs));
      localStorage.setItem(`${STORAGE_KEY}_logs`, JSON.stringify(activityLogs));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [employees, courses, assignments, practicalAssessments, qualifications, safetyDocs, activityLogs]);

  // Translation dictionary accessor
  const t = useMemo(() => translations[language], [language]);

  // Toast dispatch
  const showToast = (title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Login handler
  const loginAs = (role: UserRole) => {
    if (role === 'admin') {
      setUser({
        name: 'Fatima Al-Mansoor',
        nameAr: 'فاطمة المنصور',
        email: 'fatima.mansoor@aeris-logistics.ae',
        role: 'admin',
        avatar: 'FM',
        title: 'VP of Health, Safety & Environment',
        location: 'all'
      });
      setSelectedLocation('all');
    } else if (role === 'supervisor') {
      setUser({
        name: 'Tariq Al-Hashemi',
        nameAr: 'طارق الهاشمي',
        email: 'tariq.hashemi@aeris-logistics.ae',
        role: 'supervisor',
        avatar: 'TH',
        title: 'Operations Supervisor (Jebel Ali DC)',
        location: 'jebel_ali'
      });
      setSelectedLocation('jebel_ali');
    } else {
      setUser({
        name: 'Dr. Laila Al-Ketbi',
        nameAr: 'د. ليلى الكتبي',
        email: 'laila.ketbi@aeris-logistics.ae',
        role: 'hse_reviewer',
        avatar: 'LK',
        title: 'Senior HSE Compliance Reviewer',
        location: 'all'
      });
    }
    setCurrentScreen('dashboard');
    showToast(
      language === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Signed In Successfully',
      role === 'admin' 
        ? (language === 'ar' ? 'مرحباً فاطمة المنصور (صلاحيات مدير عام HSE)' : 'Welcome Fatima Al-Mansoor (HSE Director mode)')
        : (language === 'ar' ? 'مرحباً طارق الهاشمي (صلاحيات مشرف جبل علي)' : 'Welcome Tariq Al-Hashemi (Jebel Ali Supervisor mode)'),
      'success'
    );
  };

  const logout = () => {
    setUser(null);
    setCurrentScreen('login');
    showToast('Signed Out', 'You have securely signed out of AERIS Safety.', 'info');
  };

  const openEmployeeDetails = (empId: string) => {
    setSelectedEmployeeId(empId);
    setCurrentScreen('employee_details');
  };

  // Recalculate employee summary stats
  const syncEmployeeMetrics = (targetEmpId: string, updatedAssignments: CourseAssignment[]) => {
    const empAssignments = updatedAssignments.filter((a) => a.employeeId === targetEmpId);
    const completed = empAssignments.filter((a) => a.status === 'completed').length;
    const overdue = empAssignments.filter((a) => a.status === 'overdue').length;
    
    setEmployees((prev) => prev.map((emp) => {
      if (emp.id === targetEmpId) {
        return {
          ...emp,
          completedCoursesCount: completed,
          totalAssignedCourses: empAssignments.length,
          overdueCount: overdue
        };
      }
      return emp;
    }));
  };

  // Mutators
  const addEmployee = (newEmpData: Omit<Employee, 'id' | 'completedCoursesCount' | 'totalAssignedCourses' | 'overdueCount' | 'qualificationStatus'>) => {
    const newId = `emp-${Date.now()}`;
    const initials = newEmpData.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
    const newEmployee: Employee = {
      ...newEmpData,
      id: newId,
      initials,
      completedCoursesCount: 0,
      totalAssignedCourses: 1,
      overdueCount: 0,
      qualificationStatus: 'valid'
    };

    // Auto assign Induction Course (HSE-101)
    const initialAssignment: CourseAssignment = {
      id: `asg-${Date.now()}`,
      employeeId: newId,
      courseId: 'c1',
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'not_started',
      progressPercent: 0,
      attemptsCount: 0,
      remindersSent: 0
    };

    setEmployees((prev) => [newEmployee, ...prev]);
    setAssignments((prev) => [...prev, initialAssignment]);

    // Log activity
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      employeeId: newId,
      employeeName: newEmployee.name,
      actorName: user?.name || 'Administrator',
      type: 'assignment_created',
      description: `Added new employee ${newEmployee.name} (${newEmployee.role}) and assigned HSE-101 Induction.`,
      badgeType: 'info'
    };
    setActivityLogs((prev) => [newLog, ...prev]);

    showToast(
      language === 'ar' ? 'تمت إضافة الموظف' : 'Employee Added',
      `${newEmployee.name} added to ${LOCATIONS.find(l => l.id === newEmployee.location)?.name}.`,
      'success'
    );
  };

  const updateEmployee = (updatedEmp: Employee) => {
    setEmployees((prev) => prev.map((e) => (e.id === updatedEmp.id ? updatedEmp : e)));
    showToast('Employee Updated', `${updatedEmp.name}'s profile was updated.`, 'success');
  };

  const addCourse = (newCourse: Course) => {
    setCourses((prev) => [newCourse, ...prev]);
    showToast('Course Created', `Course "${newCourse.title}" created successfully.`, 'success');
  };

  const updateCourse = (updatedCourse: Course) => {
    setCourses((prev) => prev.map((c) => (c.id === updatedCourse.id ? updatedCourse : c)));
    showToast('Course Saved', `Course "${updatedCourse.title}" updated.`, 'success');
  };

  const assignCoursesToEmployees = (
    courseIds: string[], 
    employeeIds: string[], 
    dueDate: string, 
    _reminderConfig: string
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const newAssignments: CourseAssignment[] = [];

    courseIds.forEach((cId) => {
      employeeIds.forEach((eId) => {
        // Check if already assigned
        const exists = assignments.some((a) => a.courseId === cId && a.employeeId === eId);
        if (!exists) {
          newAssignments.push({
            id: `asg-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            employeeId: eId,
            courseId: cId,
            assignedDate: today,
            dueDate,
            status: 'not_started',
            progressPercent: 0,
            attemptsCount: 0,
            remindersSent: 0
          });
        }
      });
    });

    if (newAssignments.length === 0) {
      showToast('Assignment Note', 'Selected employees already have these courses assigned.', 'info');
      return;
    }

    const updatedAllAssignments = [...assignments, ...newAssignments];
    setAssignments(updatedAllAssignments);

    // Sync stats for affected employees
    employeeIds.forEach((eId) => {
      syncEmployeeMetrics(eId, updatedAllAssignments);
    });

    // Update course assignedCount
    setCourses((prev) => prev.map((c) => {
      if (courseIds.includes(c.id)) {
        return { ...c, assignedCount: c.assignedCount + employeeIds.length };
      }
      return c;
    }));

    // Activity log
    const courseNames = courses.filter((c) => courseIds.includes(c.id)).map((c) => c.title).join(', ');
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      actorName: user?.name || 'Administrator',
      type: 'assignment_created',
      description: `Assigned [${courseNames}] to ${employeeIds.length} employee(s). Due: ${dueDate}.`,
      badgeType: 'info'
    };
    setActivityLogs((prev) => [newLog, ...prev]);

    showToast(
      language === 'ar' ? 'تم تعيين التدريب بنجاح' : 'Training Assigned Successfully',
      `Assigned ${courseIds.length} course(s) to ${employeeIds.length} employee(s).`,
      'success'
    );
  };

  const updateAssignmentDueDate = (assignmentId: string, newDueDate: string) => {
    setAssignments((prev) => {
      const updated = prev.map((a) => {
        if (a.id === assignmentId) {
          const isOverdueNow = new Date(newDueDate) < new Date();
          return {
            ...a,
            dueDate: newDueDate,
            status: isOverdueNow ? ('overdue' as const) : a.progressPercent > 0 ? ('in_progress' as const) : ('not_started' as const)
          };
        }
        return a;
      });
      return updated;
    });
    showToast('Due Date Updated', `Assignment deadline adjusted to ${newDueDate}.`, 'info');
  };

  const simulateReminder = (assignmentId: string) => {
    const target = assignments.find((a) => a.id === assignmentId);
    if (!target) return;
    const emp = employees.find((e) => e.id === target.employeeId);
    const crs = courses.find((c) => c.id === target.courseId);

    setAssignments((prev) => prev.map((a) => {
      if (a.id === assignmentId) {
        return {
          ...a,
          remindersSent: a.remindersSent + 1,
          lastReminderDate: new Date().toISOString().split('T')[0]
        };
      }
      return a;
    }));

    showToast(
      'Reminder Dispatched (Demo)',
      `SMS & WhatsApp notification triggered for ${emp?.name || 'employee'} for course ${crs?.title}.`,
      'warning'
    );
  };

  const submitPracticalAssessment = (
    assessmentId: string, 
    decision: 'pass' | 'needs_retraining', 
    checklist: PracticalAssessment['checklist'], 
    observations: string,
    reason?: string
  ) => {
    const today = new Date().toISOString().split('T')[0];
    const assessor = user?.name || 'Tariq Al-Hashemi';

    setPracticalAssessments((prev) => prev.map((pra) => {
      if (pra.id === assessmentId) {
        return {
          ...pra,
          status: decision === 'pass' ? ('completed' as const) : ('retraining_required' as const),
          completedDate: today,
          checklist,
          supervisorObservations: observations,
          decision,
          retrainingReason: decision === 'needs_retraining' ? reason : undefined,
          signedOffBy: assessor,
          evidenceUploaded: true,
          evidenceFileName: `assessment_signoff_${pra.id}.pdf`
        };
      }
      return pra;
    }));

    const targetPra = practicalAssessments.find((p) => p.id === assessmentId);
    if (targetPra) {
      const emp = employees.find((e) => e.id === targetPra.employeeId);

      // Add activity log
      const newLog: ActivityLog = {
        id: `act-${Date.now()}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
        employeeId: targetPra.employeeId,
        employeeName: emp?.name,
        actorName: assessor,
        type: decision === 'pass' ? 'assessment_passed' : 'assessment_retrain',
        description: decision === 'pass'
          ? `Passed Practical Assessment: ${targetPra.taskTitle}. Sign-off recorded.`
          : `Practical Assessment: ${targetPra.taskTitle} requires retraining. Reason: ${reason}`,
        badgeType: decision === 'pass' ? 'success' : 'critical'
      };
      setActivityLogs((prev) => [newLog, ...prev]);

      // If passed, auto-complete related assignment if matching course
      if (decision === 'pass') {
        setAssignments((prev) => prev.map((a) => {
          if (a.employeeId === targetPra.employeeId && a.courseId === targetPra.courseId) {
            return {
              ...a,
              status: 'completed',
              progressPercent: 100,
              completedDate: today,
              scorePercent: 100
            };
          }
          return a;
        }));
        // Update employee completed stats
        syncEmployeeMetrics(targetPra.employeeId, assignments);

        // Add internal qualification cert
        const newCert: Qualification = {
          id: `qual-${Date.now()}`,
          employeeId: targetPra.employeeId,
          title: `Certified Operator: ${targetPra.taskTitle}`,
          type: 'internal_certificate',
          issuingOrganization: 'AERIS Safety Practical Accreditation',
          issueDate: today,
          status: 'valid',
          remindersEnabled: false
        };
        setQualifications((prev) => [newCert, ...prev]);
      }
    }

    showToast(
      decision === 'pass' ? 'Assessment Passed & Certified' : 'Retraining Required Recorded',
      decision === 'pass' 
        ? `Practical sign-off saved. Employee profile and reports updated.`
        : `Retraining alert dispatched to supervisor queue.`,
      decision === 'pass' ? 'success' : 'warning'
    );
  };

  const scheduleNewPracticalAssessment = (
    employeeId: string, 
    courseId: string, 
    taskTitle: string, 
    scheduledDate: string, 
    supervisorName: string
  ) => {
    const emp = employees.find((e) => e.id === employeeId);
    const crs = courses.find((c) => c.id === courseId);
    const defaultChecklist: PracticalAssessment['checklist'] = [
      { id: `c-1`, task: 'Verify personal PPE compliance (steel toes, Class 3 vest, safety glasses)', isCritical: true, status: 'not_observed' },
      { id: `c-2`, task: `Execute standard operational procedure for ${crs?.title || 'task'}`, isCritical: true, status: 'not_observed' },
      { id: `c-3`, task: 'Demonstrate active hazard scanning and blind-spot audible horn warning', isCritical: true, status: 'not_observed' },
      { id: `c-4`, task: 'Safe equipment parking, shut-down, and work zone housekeeping', isCritical: false, status: 'not_observed' },
    ];

    const newAssessment: PracticalAssessment = {
      id: `pra-${Date.now()}`,
      employeeId,
      courseId,
      taskTitle,
      location: emp?.location || 'jebel_ali',
      supervisorId: user?.role === 'supervisor' ? 'sup-1' : 'sup-1',
      supervisorName,
      scheduledDate,
      status: 'scheduled',
      checklist: defaultChecklist,
      supervisorObservations: `Scheduled assessment by ${user?.name || 'Supervisor'}.`
    };

    setPracticalAssessments((prev) => [newAssessment, ...prev]);

    showToast('Assessment Scheduled', `Practical assessment scheduled for ${emp?.name} on ${scheduledDate}.`, 'success');
  };

  const recordQualification = (qual: Omit<Qualification, 'id'>) => {
    const newQual: Qualification = {
      ...qual,
      id: `qual-${Date.now()}`
    };
    setQualifications((prev) => [newQual, ...prev]);

    // Update employee status if expiring
    if (newQual.status === 'expiring_soon' || newQual.status === 'expired') {
      setEmployees((prev) => prev.map((e) => {
        if (e.id === newQual.employeeId) {
          return { ...e, qualificationStatus: newQual.status as any };
        }
        return e;
      }));
    }

    showToast('Qualification Recorded', `Qualification "${newQual.title}" saved.`, 'success');
  };

  const approveSafetyDoc = (docId: string) => {
    setSafetyDocs((prev) => prev.map((d) => (d.id === docId ? { ...d, status: 'approved', availableToAi: true } : d)));
    showToast('SOP Approved', 'Procedure approved and synced to AI Knowledge Base.', 'success');
  };

  const toggleDocAiAccess = (docId: string) => {
    setSafetyDocs((prev) => prev.map((d) => (d.id === docId ? { ...d, availableToAi: !d.availableToAi } : d)));
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const resetDemoData = () => {
    localStorage.removeItem(`${STORAGE_KEY}_employees`);
    localStorage.removeItem(`${STORAGE_KEY}_courses`);
    localStorage.removeItem(`${STORAGE_KEY}_assignments`);
    localStorage.removeItem(`${STORAGE_KEY}_practical`);
    localStorage.removeItem(`${STORAGE_KEY}_quals`);
    localStorage.removeItem(`${STORAGE_KEY}_docs`);
    localStorage.removeItem(`${STORAGE_KEY}_logs`);

    setEmployees(INITIAL_EMPLOYEES);
    setCourses(INITIAL_COURSES);
    setAssignments(INITIAL_ASSIGNMENTS);
    setPracticalAssessments(INITIAL_PRACTICAL_ASSESSMENTS);
    setQualifications(INITIAL_QUALIFICATIONS);
    setSafetyDocs(INITIAL_SAFETY_DOCS);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);

    showToast('Demo Data Reset', 'All records have been restored to initial sample state.', 'info');
  };

  // Filtered views by selected location (and supervisor role restriction)
  const filteredEmployees = useMemo(() => {
    let list = employees;
    if (user?.role === 'supervisor') {
      // Supervisor Tariq sees his assigned employees primarily
      list = list.filter((e) => e.location === 'jebel_ali' || e.supervisorId === 'sup-1');
    } else if (selectedLocation !== 'all') {
      list = list.filter((e) => e.location === selectedLocation);
    }
    return list;
  }, [employees, selectedLocation, user]);

  const filteredAssignments = useMemo(() => {
    const validEmpIds = new Set(filteredEmployees.map((e) => e.id));
    return assignments.filter((a) => validEmpIds.has(a.employeeId));
  }, [assignments, filteredEmployees]);

  const filteredAssessments = useMemo(() => {
    let list = practicalAssessments;
    if (user?.role === 'supervisor') {
      list = list.filter((p) => p.location === 'jebel_ali' || p.supervisorId === 'sup-1');
    } else if (selectedLocation !== 'all') {
      list = list.filter((p) => p.location === selectedLocation);
    }
    return list;
  }, [practicalAssessments, selectedLocation, user]);

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        selectedEmployeeId,
        setSelectedEmployeeId,
        openEmployeeDetails,
        user,
        setUser,
        loginAs,
        logout,
        language,
        setLanguage,
        selectedLocation,
        setSelectedLocation,
        t,
        employees,
        courses,
        assignments,
        practicalAssessments,
        qualifications,
        safetyDocs,
        activityLogs,
        notifications,
        toasts,
        addEmployee,
        updateEmployee,
        addCourse,
        updateCourse,
        assignCoursesToEmployees,
        updateAssignmentDueDate,
        simulateReminder,
        submitPracticalAssessment,
        scheduleNewPracticalAssessment,
        recordQualification,
        approveSafetyDoc,
        toggleDocAiAccess,
        dismissToast,
        showToast,
        markNotificationsAsRead,
        resetDemoData,
        filteredEmployees,
        filteredAssignments,
        filteredAssessments
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
