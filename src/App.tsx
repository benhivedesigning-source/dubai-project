/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/common/ToastContainer';

// Screens
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Employees } from './pages/Employees';
import { EmployeeDetails } from './pages/EmployeeDetails';
import { CourseManagement } from './pages/CourseManagement';
import { TrainingAssignments } from './pages/TrainingAssignments';
import { PracticalAssessments } from './pages/PracticalAssessments';
import { Reports } from './pages/Reports';
import { AICourseBuilder } from './pages/AICourseBuilder';
import { Certificates } from './pages/Certificates';
import { SafetyKnowledge } from './pages/SafetyKnowledge';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { currentScreen, user } = useApp();

  // If on login screen or not logged in, show Login
  if (currentScreen === 'login' || !user) {
    return (
      <main className="min-h-screen w-full bg-[#F4F7F8]">
        <Login />
        <ToastContainer />
      </main>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#F4F7F8] overflow-hidden text-[#111C28]">
      {/* Kinetic Precision Collapsible Sidebar */}
      <Sidebar />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto relative focus:outline-none">
          {currentScreen === 'dashboard' && <Dashboard />}
          {currentScreen === 'employees' && <Employees />}
          {currentScreen === 'employee_details' && <EmployeeDetails />}
          {currentScreen === 'course_management' && <CourseManagement />}
          {currentScreen === 'training_assignments' && <TrainingAssignments />}
          {currentScreen === 'practical_assessments' && <PracticalAssessments />}
          {currentScreen === 'reports' && <Reports />}
          {currentScreen === 'ai_course_builder' && <AICourseBuilder />}
          {currentScreen === 'certificates' && <Certificates />}
          {currentScreen === 'safety_knowledge' && <SafetyKnowledge />}
          {currentScreen === 'settings' && <SettingsPage />}
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
