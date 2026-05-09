import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@/lib/utils';
export function Select({ className, children, ...props }) {
    return (_jsx("select", { className: cn('w-full px-3 py-2 bg-[#1e2028] border border-[#2d2e35] rounded-lg text-white focus:outline-none focus:border-blue-500', className), ...props, children: children }));
}
