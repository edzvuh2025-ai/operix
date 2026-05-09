import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function EmptyState({ icon: Icon, title, description }) {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center p-12 text-center", children: [_jsx(Icon, { className: "w-12 h-12 text-gray-500 mb-4" }), _jsx("h3", { className: "text-lg font-semibold mb-2", children: title }), _jsx("p", { className: "text-gray-400", children: description })] }));
}
