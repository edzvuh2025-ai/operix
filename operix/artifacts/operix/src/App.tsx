import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { Topbar } from './components/layout/Topbar';
import { GroupLayout } from './components/layout/GroupLayout';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage from './pages/DashboardPage';
import StaffPage from './pages/StaffPage';
import CasesPage from './pages/CasesPage';
import SessionsPage from './pages/SessionsPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <Topbar />
        <Routes>
          <Route path="/" element={<OnboardingPage />} />
          <Route element={<GroupLayout />}>
            <Route path="/dashboard/:groupId" element={<DashboardPage />} />
            <Route path="/groups/:groupId/staff" element={<StaffPage />} />
            <Route path="/groups/:groupId/cases" element={<CasesPage />} />
            <Route path="/groups/:groupId/sessions" element={<SessionsPage />} />
            <Route path="/groups/:groupId/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </SignedIn>
    </BrowserRouter>
  );
}
