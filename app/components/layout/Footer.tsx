import React from 'react';
import { Link } from '@remix-run/react';

export function Footer() {
  return (
    <footer className="w-full border-t border-bolt-elements-borderColor/50 bg-bolt-elements-background-depth-1/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-10 md:pb-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-bolt-elements-textPrimary font-semibold mb-4 flex items-center gap-2">
              <span>Clyra.ai</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded-full text-white bg-gradient-to-r from-[#4DA8FF] to-[#2C8CFF]">
                BETA
              </span>
            </h3>
          </div>
          
          <div>
            <h3 className="text-bolt-elements-textPrimary font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/docs" 
                  className="text-accent-700 dark:text-accent-300 hover:text-[#4DA8FF] transition-colors"
                >
                  Docs
                </Link>
              </li>
              <li>
                <Link 
                  to="/blog" 
                  className="text-accent-700 dark:text-accent-300 hover:text-[#4DA8FF] transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  to="/gallery" 
                  className="text-accent-700 dark:text-accent-300 hover:text-[#4DA8FF] transition-colors"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link 
                  to="/api-status" 
                  className="text-accent-700 dark:text-accent-300 hover:text-[#4DA8FF] transition-colors"
                >
                  API Status
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-bolt-elements-textPrimary font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/about" 
                  className="text-accent-700 dark:text-accent-300 hover:text-[#4DA8FF] transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link 
                  to="/privacy" 
                  className="text-accent-700 dark:text-accent-300 hover:text-[#4DA8FF] transition-colors"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link 
                  to="/terms" 
                  className="text-accent-700 dark:text-accent-300 hover:text-[#4DA8FF] transition-colors"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link 
                  to="/careers" 
                  className="text-accent-700 dark:text-accent-300 hover:text-[#4DA8FF] transition-colors"
                >
                  Careers
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-bolt-elements-textPrimary font-semibold mb-4">Social</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="#discord" 
                  className="text-accent-700 dark:text-accent-300 hover:text-[#4DA8FF] transition-colors"
                >
                  Discord
                </a>
              </li>
              <li>
                <a 
                  href="#linkedin" 
                  className="text-accent-700 dark:text-accent-300 hover:text-[#4DA8FF] transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a 
                  href="#twitter" 
                  className="text-accent-700 dark:text-accent-300 hover:text-[#4DA8FF] transition-colors"
                >
                  Twitter/X
                </a>
              </li>
              <li>
                <a 
                  href="#youtube" 
                  className="text-accent-700 dark:text-accent-300 hover:text-[#4DA8FF] transition-colors"
                >
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-accent-100/20 pt-6 text-center">
          <p className="text-sm text-accent-700 dark:text-accent-300">
            © 2025 Clyra.ai — Empowering developers to build with intelligence.
          </p>
        </div>
      </div>
    </footer>
  );
}
