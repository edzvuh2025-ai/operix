import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs(BrowserRouter, { children: [_jsx(SignedOut, { children: _jsx(RedirectToSignIn, {}) }), _jsxs(SignedIn, { children: [_jsx(Topbar, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(OnboardingPage, {}) }), _jsxs(Route, { element: _jsx(GroupLayout, {}), children: [_jsx(Route, { path: "/dashboard/:groupId", element: _jsx(DashboardPage, {}) }), _jsx(Route, { path: "/groups/:groupId/staff", element: _jsx(StaffPage, {}) }), _jsx(Route, { path: "/groups/:groupId/cases", element: _jsx(CasesPage, {}) }), _jsx(Route, { path: "/groups/:groupId/sessions", element: _jsx(SessionsPage, {}) }), _jsx(Route, { path: "/groups/:groupId/settings", element: _jsx(SettingsPage, {}) })] }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/" }) })] })] })] }));
}
