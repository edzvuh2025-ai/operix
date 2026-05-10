import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/clerk-react'
import { useGroups } from '../hooks/useGroups'

export default function LandingPage() {
  const navigate = useNavigate()
  const { groups, isLoading } = useGroups()

  useEffect(() => {
    // If already signed in, redirect to dashboard or onboarding
    if (!isLoading && groups && groups.length > 0) {
      // User has groups - go to first group's dashboard
      navigate(`/app/dashboard/${groups[0].id}`)
    } else if (!isLoading && groups?.length === 0) {
      // User has no groups - go to onboarding to create one
      navigate('/app/onboarding')
    }
  }, [isLoading, groups, navigate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <SignedOut>
        <div className="max-w-4xl mx-auto px-4 py-20">
          {/* Header */}
          <div className="text-center mb-20">
            <h1 className="text-5xl font-bold mb-4">Operix</h1>
            <p className="text-xl text-slate-300">The Operating System for Roblox Groups</p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
              <h3 className="text-lg font-semibold mb-2">Group Management</h3>
              <p className="text-slate-400">Manage multiple groups with ease</p>
            </div>
            <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
              <h3 className="text-lg font-semibold mb-2">Activity Tracking</h3>
              <p className="text-slate-400">Monitor all group activity in real-time</p>
            </div>
            <div className="p-6 bg-slate-800 rounded-lg border border-slate-700">
              <h3 className="text-lg font-semibold mb-2">AI-Powered Insights</h3>
              <p className="text-slate-400">Get smart recommendations using AI</p>
            </div>
          </div>

          {/* Pricing */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div className="p-8 bg-slate-800 rounded-lg border border-slate-700">
              <h4 className="text-xl font-semibold mb-4">Starter</h4>
              <p className="text-3xl font-bold mb-6">Free</p>
              <ul className="space-y-2 text-slate-300">
                <li>✓ 1 group</li>
                <li>✓ Basic analytics</li>
                <li>✓ Activity log</li>
              </ul>
            </div>
            <div className="p-8 bg-blue-900 rounded-lg border border-blue-700">
              <h4 className="text-xl font-semibold mb-4">Pro</h4>
              <p className="text-3xl font-bold mb-6">$9.99<span className="text-lg">/mo</span></p>
              <ul className="space-y-2 text-slate-300">
                <li>✓ Unlimited groups</li>
                <li>✓ Advanced analytics</li>
                <li>✓ AI insights</li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="flex gap-4 justify-center">
            <SignUpButton forceRedirectUrl="/app/onboarding">
              <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold">
                Sign Up
              </button>
            </SignUpButton>
            <SignInButton forceRedirectUrl="/app/onboarding">
              <button className="px-8 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold">
                Sign In
              </button>
            </SignInButton>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="flex items-center justify-center h-screen">
          <p className="text-slate-400">Redirecting...</p>
        </div>
      </SignedIn>
    </div>
  )
}
