import { jsx as _jsx } from "react/jsx-runtime";
import { cn } from '@/lib/utils';
export function Card({ className, ...props }) {
    return _jsx("div", { className: cn('bg-[#0f1117] rounded-lg border border-[#1e2028] p-4', className), ...props });
}
export function CardHeader({ className, ...props }) {
    return _jsx("div", { className: cn('mb-4', className), ...props });
}
export function CardTitle({ className, ...props }) {
    return _jsx("h2", { className: cn('text-xl font-bold text-white', className), ...props });
}
export function CardContent({ className, ...props }) {
    return _jsx("div", { className: cn('', className), ...props });
}
