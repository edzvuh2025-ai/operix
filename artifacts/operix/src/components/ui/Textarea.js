import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@/lib/utils';
export function Textarea({ className, ...props }) {
    return (_jsx("textarea", { className: cn('w-full px-3 py-2 bg-[#1e2028] border border-[#2d2e35] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none', className), ...props }));
}
