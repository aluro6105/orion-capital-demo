import React, { useEffect } from 'react';
import { createPageUrl } from '@/utils';

// Portal pages handle their own layout (sidebar + header).
// Chart page is full-screen.
// All other pages use the minimal legacy layout.
const PORTAL_PAGES = [
  'Dashboard', 'Portal_Charts', 'Portal_Portfolio', 'Portal_Trades',
  'Portal_Funding', 'Portal_KYC', 'Portal_Reports', 'Portal_Messages',
  'Portal_Support', 'Portal_Settings', 'Admin',
];

const PUBLIC_PAGES = ['Home', 'About', 'Product', 'Awards', 'Testimonials', 'FAQ'];

const FULLSCREEN_PAGES = ['Chart'];

export default function Layout({ children, currentPageName }) {
  // Si la página raíz es Chart sin símbolo, redirigir a Home
  if (currentPageName === 'Chart' && !window.location.search.includes('symbol')) {
    window.location.replace(createPageUrl('Home'));
    return null;
  }

  // Portal pages render their own complete layout
  if (PORTAL_PAGES.includes(currentPageName)) {
    return children;
  }

  // Full-screen pages (legacy chart)
  if (FULLSCREEN_PAGES.includes(currentPageName)) {
    return children;
  }

  // Public pages - no wrapper needed (they handle their own nav)
  if (PUBLIC_PAGES.includes(currentPageName)) {
    return children;
  }

  // Minimal layout for legacy pages
  return (
    <div className="min-h-screen bg-[#131722]">
      {children}
    </div>
  );
}