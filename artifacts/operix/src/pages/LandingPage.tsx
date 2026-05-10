import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth, SignUpButton, SignInButton } from "@clerk/clerk-react";
import { useEffect } from "react";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      navigate("/app/onboarding");
    }
  }, [isSignedIn, isLoaded, navigate]);

  if (!isLoaded) {
    return <div className="min-h-screen bg-background flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-700 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-400">Operix</div>
          <div className="flex gap-3">
            <SignInButton mode="modal">
              <Button variant="ghost" className="text-slate-300 hover:text-white">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal" afterSignUpUrl="/app/onboarding">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Get Started
              </Button>
            </SignUpButton>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            The Operating System for{" "}
            <span className="text-blue-400">Roblox Groups</span>
          </h1>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Manage your Roblox group with powerful tools for staff management, moderation, analytics, and automation.
          </p>
          <div className="flex gap-4 justify-center">
            <SignUpButton mode="modal" afterSignUpUrl="/app/onboarding">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                Start Free
              </Button>
            </SignUpButton>
            <Button size="lg" variant="outline" className="border-slate-600 text-white hover:bg-slate-800 px-8">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            Powerful Features for Group Managers
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 hover:border-blue-400 transition">
              <div className="text-blue-400 text-3xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-white mb-2">Staff Management</h3>
              <p className="text-slate-400">
                Organize and manage your staff hierarchy with role-based permissions and activity tracking.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 hover:border-blue-400 transition">
              <div className="text-blue-400 text-3xl mb-4">🛡️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Moderation Tools</h3>
              <p className="text-slate-400">
                Advanced moderation features to keep your group safe and maintain community standards.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 hover:border-blue-400 transition">
              <div className="text-blue-400 text-3xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-white mb-2">Analytics & Insights</h3>
              <p className="text-slate-400">
                Track group activity, member engagement, and key metrics in real-time dashboards.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 hover:border-blue-400 transition">
              <div className="text-blue-400 text-3xl mb-4">⚙️</div>
              <h3 className="text-xl font-semibold text-white mb-2">Automation Rules</h3>
              <p className="text-slate-400">
                Create custom automation rules to handle repetitive tasks and improve efficiency.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 hover:border-blue-400 transition">
              <div className="text-blue-400 text-3xl mb-4">🔔</div>
              <h3 className="text-xl font-semibold text-white mb-2">Real-time Notifications</h3>
              <p className="text-slate-400">
                Stay updated with real-time notifications for important group events and activities.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 hover:border-blue-400 transition">
              <div className="text-blue-400 text-3xl mb-4">🔐</div>
              <h3 className="text-xl font-semibold text-white mb-2">Enterprise Security</h3>
              <p className="text-slate-400">
                Bank-level security with encryption, audit logs, and permission controls.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Group Management?
          </h2>
          <p className="text-xl text-slate-400 mb-8">
            Join thousands of Roblox group managers using Operix to streamline their operations.
          </p>
          <SignUpButton mode="modal" afterSignUpUrl="/app/onboarding">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
              Get Started Free
            </Button>
          </SignUpButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-slate-500 text-sm">
          <p>&copy; 2024 Operix. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
