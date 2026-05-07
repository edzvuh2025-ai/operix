import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function GroupLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 overflow-y-auto bg-[#08090d]">
        <Outlet />
      </div>
    </div>
  );
}
