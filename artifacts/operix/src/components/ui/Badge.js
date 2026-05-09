import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@/lib/utils';
export function Badge({ className, variant = 'default', ...props }) {
    const variants = {
        default: 'bg-blue-600 text-white',
        success: 'bg-green-600 text-white',
        warning: 'bg-yellow-600 text-white',
        danger: 'bg-red-600 text-white',
    };
    return _jsx("span", { className: cn('inline-block px-3 py-1 rounded-full text-sm font-medium', variants[variant], className), ...props });
}
