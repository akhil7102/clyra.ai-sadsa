import React from 'react';
import { Header } from '../header/Header';
import { Footer } from './Footer';
import BackgroundRays from '../ui/BackgroundRays';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function PageLayout({ children, title, description }: PageLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen w-full bg-bolt-elements-background-depth-1">
      <BackgroundRays />
      <Header />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
      <Footer />
    </div>
  );
}
