import { SignIn } from "@clerk/react";

export default function SignInPage() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  
  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background">
      {/* Left side - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-sidebar border-r border-border p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/20 via-background to-background -z-10" />
        
        <div>
          <img src={`${basePath}/logo.svg`} alt="Operix" className="h-8 mb-12" />
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
            Welcome back to command.
          </h1>
          <p className="text-muted-foreground text-lg max-w-md">
            Sign in to access your intelligence dashboard and manage your group operations.
          </p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <div className="h-4 w-4 bg-primary rounded-sm" />
            </div>
            <div>
              <p className="font-medium text-sm text-white">Enterprise Grade</p>
              <p className="text-xs text-muted-foreground">Secure & reliable infrastructure</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background relative">
        {/* Mobile logo */}
        <div className="absolute top-6 left-6 md:hidden">
          <img src={`${basePath}/logo.svg`} alt="Operix" className="h-6" />
        </div>
        
        <div className="w-full max-w-md">
          <SignIn 
            routing="path" 
            path={`${basePath}/sign-in`} 
            signUpUrl={`${basePath}/sign-up`} 
          />
        </div>
      </div>
    </div>
  );
}
