import { SignUp } from "@clerk/react";

export default function SignUpPage() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  
  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-background">
      {/* Left side - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-sidebar border-r border-border p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/20 via-background to-background -z-10" />
        
        <div>
          <img src={`${basePath}/logo.svg`} alt="Operix" className="h-8 mb-12" />
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4">
            Start scaling your group.
          </h1>
          <p className="text-muted-foreground text-lg max-w-md">
            Create an account to set up your first intelligence dashboard and bring order to chaos.
          </p>
        </div>
      </div>
      
      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-background relative">
        {/* Mobile logo */}
        <div className="absolute top-6 left-6 md:hidden">
          <img src={`${basePath}/logo.svg`} alt="Operix" className="h-6" />
        </div>
        
        <div className="w-full max-w-md">
          <SignUp 
            routing="path" 
            path={`${basePath}/sign-up`} 
            signInUrl={`${basePath}/sign-in`} 
          />
        </div>
      </div>
    </div>
  );
}
