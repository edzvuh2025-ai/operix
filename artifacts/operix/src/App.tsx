import { Router, Route } from "wouter";
import { useAuth } from "@clerk/react";
import { useEffect } from "react";

import LandingPage from "@/pages/LandingPage";
import SignInPage from "@/pages/SignInPage";
import SignUpPage from "@/pages/SignUpPage";
import DashboardPage from "@/pages/DashboardPage";
import CasesPage from "@/pages/CasesPage";
import CaseDetailPage from "@/pages/CaseDetailPage";
import StaffPage from "@/pages/StaffPage";
import StaffProfilePage from "@/pages/StaffProfilePage";
import SessionsPage from "@/pages/SessionsPage";
import SettingsPage from "@/pages/SettingsPage";
import AutomationPage from "@/pages/AutomationPage";
import NotFoundPage from "@/pages/NotFoundPage";
import OnboardingPage from "@/pages/OnboardingPage";
import { GroupProvider, useGroupContext } from "@/lib/group-context";

function AppRoutes() {
  const { isSignedIn, isLoaded } = useAuth();
  const { groups } = useGroupContext();

  // Redirect logged-in users to dashboard or onboarding
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const path = window.location.pathname;
    const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
    
    // If already on dashboard or authenticated routes, don't redirect
    if (path.startsWith(basePath + "/dashboard") || 
        path.startsWith(basePath + "/cases") ||
        path.startsWith(basePath + "/staff") ||
        path.startsWith(basePath + "/sessions") ||
        path.startsWith(basePath + "/settings") ||
        path.startsWith(basePath + "/automation") ||
        path.startsWith(basePath + "/onboarding")) {
      return;
    }

    // If on landing/sign-in/sign-up and authenticated, redirect to dashboard or onboarding
    if (path === basePath || path === basePath + "/" || 
        path.startsWith(basePath + "/sign-in") || 
        path.startsWith(basePath + "/sign-up")) {
      if (groups.length === 0) {
        window.location.href = basePath + "/onboarding";
      } else {
        window.location.href = basePath + "/dashboard";
      }
    }
  }, [isSignedIn, isLoaded, groups]);

  if (!isLoaded) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <Router base={import.meta.env.BASE_URL}>
      <Route path="/" component={LandingPage} />
      <Route path="/sign-in/*" component={SignInPage} />
      <Route path="/sign-up/*" component={SignUpPage} />
      
      {isSignedIn && (
        <>
          <Route path="/onboarding" component={OnboardingPage} />
          <Route path="/dashboard" component={DashboardPage} />
          <Route path="/cases" component={CasesPage} />
          <Route path="/cases/:caseId" component={CaseDetailPage} />
          <Route path="/staff" component={StaffPage} />
          <Route path="/staff/:staffId" component={StaffProfilePage} />
          <Route path="/sessions" component={SessionsPage} />
          <Route path="/settings" component={SettingsPage} />
          <Route path="/automation" component={AutomationPage} />
        </>
      )}

      <Route component={NotFoundPage} />
    </Router>
  );
}

export default function App() {
  return (
    <GroupProvider>
      <AppRoutes />
    </GroupProvider>
  );
}
