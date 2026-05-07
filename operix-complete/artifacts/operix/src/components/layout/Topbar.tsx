import React from 'react';
import { Link } from 'react-router-dom';
import { UserButton, useAuth } from '@clerk/clerk-react';

export function Topbar() {
  const { isSignedIn } = useAuth();

  return (
    <div className="bg-[#0f1117] border-b border-[#1e2028] p-4">
      <div className="flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-blue-600">
          Operix
        </Link>
        {isSignedIn && <UserButton afterSignOutUrl="/" />}
      </div>
    </div>
  );
}
