import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
export function GroupLayout() {
    return (_jsxs("div", { className: "flex h-screen", children: [_jsx(Sidebar, {}), _jsx("div", { className: "flex-1 overflow-y-auto bg-[#08090d]", children: _jsx(Outlet, {}) })] }));
}
