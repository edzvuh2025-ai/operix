import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import { SignInButton } from '@clerk/clerk-react';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  // If already signed in, redirect to onboarding/dashboard
  React.useEffect(() => {
    if (isSignedIn) {
      navigate('/app/onboarding');
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#08090d] to-[#0f1117] flex items-center justify-center p-4">
      <div className="w-full max-w-lg text-center">
        <h1 className="text-5xl font-bold mb-4">Operix</h1>
        <p className="text-xl text-gray-300 mb-2">Manage your Roblox groups with ease</p>
        <p className="text-gray-400 mb-12">A powerful platform to organize, manage, and scale your gaming community</p>

        <div className="space-y-4">
          <SignInButton mode="modal" forceRedirectUrl="/app/onboarding">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg">
              Sign In
            </Button>
          </SignInButton>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#08090d] text-gray-400">New to Operix?</span>
            </div>
          </div>

          <SignInButton mode="modal" forceRedirectUrl="/app/onboarding">
            <Button variant="secondary" className="w-full py-3 text-lg">
              Create Account
            </Button>
          </SignInButton>
        </div>

        <p className="text-gray-500 text-sm mt-8">Sign in to create or manage your Roblox groups</p>
      </div>
    </div>
  );
}
