export type UserRole = 'admin' | 'supervisor' | 'hse_reviewer';

export type Language = 'en' | 'ar';

export type LocationId = 'all' | 'jebel_ali' | 'dubai_south' | 'al_quoz' | 'sharjah';

export interface LocationInfo {
  id: LocationId;
  name: string;
  nameAr: string;
  code: string;
  city: string;
}

export type JobRole = 
  | 'Warehouse Associate'
  | 'Forklift Operator'
  | 'Driver'
  | 'Loading Supervisor'
  | 'HSE Officer'
  | 'Operations Supervisor';

export type TrainingStatus = 'completed' | 'in_progress' | 'overdue' | 'not_started';

export type QualificationStatus = 'valid' | 'expiring_soon' | 'expired' | 'pending';

export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  nameAr: string;
  email: string;
  role: JobRole;
  location: LocationId;
  supervisorId: string;
  supervisorName: string;
  avatar?: string;
  initials: string;
  joinDate: string;
  status: 'active' | 'on_leave' | 'inactive';
  completedCoursesCount: number;
  totalAssignedCourses: number;
  overdueCount: number;
  qualificationStatus: QualificationStatus;
}

export interface Lesson {
  id: string;
  title: string;
  titleAr?: string;
  durationMinutes: number;
  content: string;
  type: 'video' | 'interactive' | 'sop_read';
  order: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  questionAr?: string;
  options: string[];
  optionsAr?: string[];
  correctIndex: number;
  explanation: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  titleAr: string;
  description: string;
  descriptionAr: string;
  category: 'Induction' | 'Equipment' | 'Ergonomics' | 'Logistics' | 'PPE & Health' | 'Emergency';
  targetRoles: JobRole[];
  durationMinutes: number;
  languages: ('en' | 'ar' | 'ur')[];
  version: string;
  status: 'published' | 'draft' | 'in_review' | 'archived';
  lastUpdated: string;
  assignedCount: number;
  completionRate: number;
  passMarkPercent: number;
  lessons: Lesson[];
  questions: QuizQuestion[];
  isAiGenerated?: boolean;
}

export interface CourseAssignment {
  id: string;
  employeeId: string;
  courseId: string;
  assignedDate: string;
  dueDate: string;
  status: TrainingStatus;
  progressPercent: number;
  completedDate?: string;
  scorePercent?: number;
  attemptsCount: number;
  remindersSent: number;
  lastReminderDate?: string;
}

export type AssessmentResultDecision = 'pass' | 'needs_retraining';

export interface ChecklistItem {
  id: string;
  task: string;
  isCritical: boolean; // Critical must pass for overall pass
  status: 'pass' | 'needs_improvement' | 'not_observed';
  notes?: string;
}

export interface PracticalAssessment {
  id: string;
  employeeId: string;
  courseId: string;
  taskTitle: string;
  location: LocationId;
  supervisorId: string;
  supervisorName: string;
  scheduledDate: string;
  completedDate?: string;
  status: 'awaiting' | 'scheduled' | 'completed' | 'retraining_required';
  checklist: ChecklistItem[];
  supervisorObservations: string;
  decision?: AssessmentResultDecision;
  retrainingReason?: string;
  evidenceUploaded?: boolean;
  evidenceFileName?: string;
  signedOffBy?: string;
}

export interface Qualification {
  id: string;
  employeeId: string;
  title: string;
  titleAr?: string;
  type: 'internal_certificate' | 'external_qualification';
  issuingOrganization: string;
  issuingOrganizationAr?: string;
  licenseNumber?: string;
  issueDate: string;
  expiryDate?: string;
  status: 'valid' | 'expiring_soon' | 'expired' | 'no_expiry';
  documentUrl?: string;
  remindersEnabled: boolean;
}

export interface SafetyDocument {
  id: string;
  docCode: string;
  title: string;
  category: 'SOP' | 'Regulatory' | 'Emergency' | 'Equipment Safety';
  owner: string;
  language: 'en' | 'ar' | 'bilingual';
  version: string;
  effectiveDate: string;
  reviewDate: string;
  status: 'approved' | 'under_review' | 'archived';
  availableToAi: boolean;
  contentSnippet: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  employeeId?: string;
  employeeName?: string;
  actorName: string;
  type: 'course_completed' | 'assignment_created' | 'assessment_passed' | 'assessment_retrain' | 'qualification_added' | 'doc_approved';
  description: string;
  badgeType: 'success' | 'warning' | 'info' | 'critical';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'alert' | 'success' | 'info';
  read: boolean;
  linkPage?: string;
}
