import React from 'react';
import { Header } from '../header/Header';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function PageLayout({ children, title, description }: PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-bolt-elements-background-depth-1 relative overflow-hidden">
      <Header />
      {/* Semi-circular radial gradient background */}
      <div 
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse 80% 50% at 50% 110%, rgba(6, 182, 212, 0.25) 0%, rgba(59, 130, 246, 0.15) 30%, transparent 70%)',
        }}
      />
      {/* Additional glow layer */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-bolt-elements-background-depth-2/40 to-transparent blur-2xl z-0" />
      
      <main className="relative z-[1] flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={{ paddingTop: 'calc(var(--header-height) + 3rem)' }}>
        {title && (
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-bolt-elements-textPrimary mb-4">
              {title}
            </h1>
            {description && (
              <p className="text-lg text-bolt-elements-textSecondary max-w-3xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}
        <div className="w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
