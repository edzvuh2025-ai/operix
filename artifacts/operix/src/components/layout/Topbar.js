import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { UserButton, useAuth } from '@clerk/clerk-react';
export function Topbar() {
    const { isSignedIn } = useAuth();
    return (_jsx("div", { className: "bg-[#0f1117] border-b border-[#1e2028] p-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Link, { to: "/", className: "text-xl font-bold text-blue-600", children: "Operix" }), isSignedIn && _jsx(UserButton, { afterSignOutUrl: "/" })] }) }));
}
