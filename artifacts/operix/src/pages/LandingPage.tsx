import { SignUpButton, SignInButton, UserButton, useAuth } from '@clerk/clerk-react'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  const { isSignedIn } = useAuth()

  if (isSignedIn) {
    // User is logged in, should have been redirected by App.tsx routing
    // This shouldn't happen, but fallback to dashboard
    window.location.href = '/dashboard'
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#08090d] to-[#0f1117] text-white">
      {/* Navigation */}
      <nav className="border-b border-[#1e2028] backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
            Operix
          </div>
          <div className="flex gap-4">
            <SignInButton mode="modal">
              <Button variant="outline" className="border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6]/10">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal" redirectUrl="/onboarding">
              <Button className="bg-[#3b82f6] hover:bg-blue-600">
                Sign Up
              </Button>
            </SignUpButton>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          The Operating System for <span className="text-[#3b82f6]">Roblox Groups</span>
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Manage your Roblox group with powerful tools for automation, analytics, and team collaboration
        </p>
        <div className="flex gap-4 justify-center">
          <SignUpButton mode="modal" redirectUrl="/onboarding">
            <Button className="bg-[#3b82f6] hover:bg-blue-600 px-8 py-6 text-lg">
              Get Started Free
            </Button>
          </SignUpButton>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#0f1117] border border-[#1e2028] rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2">Team Management</h3>
            <p className="text-gray-400">Manage roles, permissions, and team members efficiently</p>
          </div>
          <div className="bg-[#0f1117] border border-[#1e2028] rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2">Activity Logging</h3>
            <p className="text-gray-400">Track all group activities with detailed audit logs</p>
          </div>
          <div className="bg-[#0f1117] border border-[#1e2028] rounded-lg p-6">
            <h3 className="text-xl font-bold mb-2">Analytics</h3>
            <p className="text-gray-400">Get insights into group performance and member engagement</p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#0f1117] border border-[#1e2028] rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Free</h3>
            <p className="text-3xl font-bold text-[#3b82f6] mb-6">$0</p>
            <ul className="space-y-3 text-gray-400 mb-8">
              <li>✓ Basic group management</li>
              <li>✓ Up to 5 team members</li>
              <li>✓ Activity logging</li>
            </ul>
            <SignUpButton mode="modal" redirectUrl="/onboarding">
              <Button className="w-full bg-[#3b82f6] hover:bg-blue-600">Get Started</Button>
            </SignUpButton>
          </div>
          <div className="bg-[#0f1117] border border-[#3b82f6] rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Pro</h3>
            <p className="text-3xl font-bold text-[#3b82f6] mb-6">$9.99<span className="text-lg text-gray-400">/month</span></p>
            <ul className="space-y-3 text-gray-400 mb-8">
              <li>✓ Everything in Free</li>
              <li>✓ Unlimited team members</li>
              <li>✓ Advanced analytics</li>
              <li>✓ Priority support</li>
            </ul>
            <SignUpButton mode="modal" redirectUrl="/onboarding">
              <Button className="w-full bg-[#3b82f6] hover:bg-blue-600">Upgrade to Pro</Button>
            </SignUpButton>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e2028] py-8 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-400">
          <p>&copy; 2024 Operix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
