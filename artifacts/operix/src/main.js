import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './index.css';
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
console.log('🔑 Clerk Debug:');
console.log('  VITE_CLERK_PUBLISHABLE_KEY:', clerkPubKey);
console.log('  Value exists:', !!clerkPubKey);
console.log('  Value type:', typeof clerkPubKey);
if (!clerkPubKey) {
    console.error('❌ Clerk publishable key is missing! Check Railway env vars.');
}
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx(ClerkProvider, { publishableKey: clerkPubKey, children: _jsx(App, {}) }) }));
