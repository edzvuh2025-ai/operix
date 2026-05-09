import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { motion, AnimatePresence } from 'framer-motion';
export function Modal({ isOpen, onClose, title, children }) {
    return (_jsx(AnimatePresence, { children: isOpen && (_jsxs(_Fragment, { children: [_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black/50 z-40", onClick: onClose }), _jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 }, className: "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#0f1117] border border-[#1e2028] rounded-lg p-6 w-96 max-h-96 overflow-y-auto z-50", children: [_jsx("h2", { className: "text-xl font-bold mb-4", children: title }), children] })] })) }));
}
