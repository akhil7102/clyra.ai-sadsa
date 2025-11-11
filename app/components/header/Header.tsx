import { useStore } from '@nanostores/react';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import { Link, useNavigate } from '@remix-run/react';
import { chatStore } from '~/lib/stores/chat';
import { useUser, useSupabase } from '~/lib/auth/supabase-client';
import { classNames } from '~/utils/classNames';
const HeaderActionButtons = lazy(() => import('./HeaderActionButtons.client').then(m => ({ default: m.HeaderActionButtons })));
import { ControlPanel } from '~/components/@settings/core/ControlPanel';
const HistoryDropdown = lazy(() => import('./HistoryDropdown.client').then(m => ({ default: m.HistoryDropdown })));

export function Header() {
  const chat = useStore(chatStore);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const resourcesRef = useRef<HTMLLIElement | null>(null);
  const accountRef = useRef<HTMLDivElement | null>(null);
  const user = useUser();
  const { supabase } = useSupabase();
  const navigate = useNavigate();
  const displayName = user?.email?.split('@')[0] || 'User';
  const avatarInitial = (displayName?.charAt(0) || 'U').toUpperCase();
  
  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
      navigate('/sign-in');
    }
  };

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-control-panel-open', settingsOpen ? 'true' : 'false');
      document.documentElement.setAttribute('data-history-open', historyOpen ? 'true' : 'false');
    }
  }, [settingsOpen, historyOpen]);

  // Close dropdowns on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      const target = e.target as Node | null;
      if (resourcesRef.current && target && !resourcesRef.current.contains(target)) {
        setResourcesOpen(false);
      }
      if (accountRef.current && target && !accountRef.current.contains(target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl"
        style={{
          height: 'var(--header-height)',
          padding: '0.5rem 2rem',
          borderBottom: '2px solid #22c55e',
        }}
      >
        <nav className="flex justify-between items-center max-w-7xl mx-auto h-full">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-[1px] select-none hidden"
            onClick={(e) => {
              e.preventDefault();
              window.location.href = '/';
            }}
          >
            <img 
              src="/icon.png" 
              alt="Clyra.ai Icon" 
              className="rounded-lg"
              style={{
                width: '40px',
                height: '40px',
                objectFit: 'contain',
              }}
            />
            <img 
              src="/Clyra text-Picsart-BackgroundRemover.png" 
              alt="Clyra.ai Logo" 
              style={{
                height: 'calc(var(--header-height) + 8px)',
                width: 'auto',
                objectFit: 'contain',
                marginTop: '-4px',
                marginBottom: '-4px',
                display: 'block',
              }}
            />
          </Link>

          {/* Center Nav Links - Desktop */}
          <nav className="hidden md:flex flex-1 items-center justify-center">
            <ul className="flex items-center gap-8 text-sm">
              <li>
                <Link
                  to="/overview"
                  className="relative text-gray-300 hover:text-cyan-400 transition-colors duration-200 group"
                >
                  <span className="relative z-10">Overview</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link
                  to="/features"
                  className="relative text-gray-300 hover:text-cyan-400 transition-colors duration-200 group"
                >
                  <span className="relative z-10">Features</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
              <li className="relative" ref={resourcesRef}>
                <button
                  onClick={() => setResourcesOpen((v) => !v)}
                  className="flex items-center gap-1 text-gray-300 hover:text-cyan-400 transition-colors duration-200 group bg-transparent border-0 outline-none cursor-pointer"
                >
                  <span className="relative z-10">Resources</span>
                  <span className={classNames('i-ph:caret-down transition-transform text-xs', { 'rotate-180': resourcesOpen })} />
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
                </button>
                {resourcesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/50 to-blue-500/50 rounded-xl blur opacity-30" />
                      <div className="relative bg-gray-900/95 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden shadow-xl">
                        <Link to="/resources" className="block px-4 py-3 text-gray-300 hover:text-cyan-400 hover:bg-white/5 transition-all duration-200 border-b border-white/5" onClick={() => setResourcesOpen(false)}>
                          Resources Hub
                        </Link>
                        <Link to="/docs" className="block px-4 py-3 text-gray-300 hover:text-cyan-400 hover:bg-white/5 transition-all duration-200 border-b border-white/5" onClick={() => setResourcesOpen(false)}>
                          Docs
                        </Link>
                        <Link to="/blog" className="block px-4 py-3 text-gray-300 hover:text-cyan-400 hover:bg-white/5 transition-all duration-200 border-b border-white/5" onClick={() => setResourcesOpen(false)}>
                          Blog
                        </Link>
                        <Link to="/gallery" className="block px-4 py-3 text-gray-300 hover:text-cyan-400 hover:bg-white/5 transition-all duration-200" onClick={() => setResourcesOpen(false)}>
                          Community Showcase
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </li>
              <li>
                <Link
                  to="/guides"
                  className="relative text-gray-300 hover:text-cyan-400 transition-colors duration-200 group"
                >
                  <span className="relative z-10">Guides</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300" />
                </Link>
              </li>
            </ul>
          </nav>

          {/* Right Side - Auth & Account */}
          <div className="hidden md:flex items-center gap-4">
            {!user ? (
              <>
                <Link 
                  to="/sign-in" 
                  className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link 
                  to="/sign-up" 
                  className="relative overflow-hidden group bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 py-2 rounded-lg transition-all duration-200 border-0"
                >
                  <span className="relative z-10">Sign Up</span>
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                </Link>
              </>
            ) : (
              <div className="relative" ref={accountRef}>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full px-3 py-2 transition-all hover:bg-white/10 border"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                  }}
                  onClick={() => setAccountOpen((v) => !v)}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm"
                    style={{
                      background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                      boxShadow: '0 0 24px rgba(6, 182, 212, 0.5)',
                    }}
                  >
                    {avatarInitial}
                  </div>
                  <span className="hidden sm:inline text-white font-medium">{displayName}</span>
                  <span className={classNames('i-ph:caret-down transition-transform text-white/60', { 'rotate-180': accountOpen })} />
                </button>
                {accountOpen && (
                  <div
                    className="absolute right-0 mt-3 w-60 rounded-xl backdrop-blur-xl shadow-2xl overflow-hidden"
                    style={{
                      background: 'rgba(10, 10, 10, 0.95)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      boxShadow: '0 0 40px rgba(59, 130, 246, 0.2)',
                    }}
                  >
                    <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                      <p className="text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                        Signed in as
                      </p>
                      <p className="text-sm font-semibold mt-1" style={{ color: '#3b82f6' }}>
                        {displayName}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setSettingsOpen(true);
                        setAccountOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-[rgba(59,130,246,0.1)] transition-all bg-transparent border-0 outline-none cursor-pointer"
                      style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                    >
                      <span className="i-ph:gear-six text-lg" />
                      <span className="font-medium">Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        setHistoryOpen((v) => !v);
                        setAccountOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-[rgba(59,130,246,0.1)] transition-all bg-transparent border-0 outline-none cursor-pointer"
                      style={{ color: 'rgba(255, 255, 255, 0.9)' }}
                    >
                      <span className="i-ph:clock text-lg" />
                      <span className="font-medium">History</span>
                    </button>
                    <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', margin: '0.5rem 0' }} />
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-left hover:bg-red-500/10 transition-all bg-transparent border-0 outline-none cursor-pointer"
                      style={{ color: '#ef4444' }}
                    >
                      <span className="i-ph:sign-out text-lg" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
            {chat.started && (
              <ClientOnly>
                {() => (
                  <Suspense fallback={null}>
                    <div className="ml-2">
                      <HeaderActionButtons chatStarted={chat.started} />
                    </div>
                  </Suspense>
                )}
              </ClientOnly>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className={classNames('i-ph:list text-2xl transition-transform', { 'rotate-90': mobileOpen })} />
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            className="md:hidden px-4 py-6 border-t border-white/10 animate-in slide-in-from-top duration-200"
            style={{
              background: 'rgba(10, 10, 10, 0.98)',
            }}
          >
            <div className="flex flex-col gap-4">
              <Link to="/overview" className="text-gray-300 hover:text-cyan-400 transition-colors px-2 py-2" onClick={() => setMobileOpen(false)}>
                Overview
              </Link>
              <Link to="/features" className="text-gray-300 hover:text-cyan-400 transition-colors px-2 py-2" onClick={() => setMobileOpen(false)}>
                Features
              </Link>
              <Link to="/resources" className="text-gray-300 hover:text-cyan-400 transition-colors px-2 py-2" onClick={() => setMobileOpen(false)}>
                Resources
              </Link>
              <Link to="/guides" className="text-gray-300 hover:text-cyan-400 transition-colors px-2 py-2" onClick={() => setMobileOpen(false)}>
                Guides
              </Link>
              <Link to="/docs" className="text-gray-300 hover:text-cyan-400 transition-colors px-2 py-2" onClick={() => setMobileOpen(false)}>
                Docs
              </Link>
              <Link to="/blog" className="text-gray-300 hover:text-cyan-400 transition-colors px-2 py-2" onClick={() => setMobileOpen(false)}>
                Blog
              </Link>
              <Link to="/gallery" className="text-gray-300 hover:text-cyan-400 transition-colors px-2 py-2" onClick={() => setMobileOpen(false)}>
                Community Showcase
              </Link>
              {!user ? (
                <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/10">
                  <Link to="/sign-in" className="text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg transition-all text-center" onClick={() => setMobileOpen(false)}>
                    Sign In
                  </Link>
                  <Link to="/sign-up" className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-4 py-2 rounded-lg transition-all text-center" onClick={() => setMobileOpen(false)}>
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3 mt-4 pt-4 border-t border-white/10">
                  <button
                    onClick={() => {
                      setSettingsOpen(true);
                      setMobileOpen(false);
                    }}
                    className="text-gray-300 hover:text-cyan-400 transition-colors px-2 py-2 text-left bg-transparent border-0 outline-none"
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      setHistoryOpen((v) => !v);
                      setMobileOpen(false);
                    }}
                    className="text-gray-300 hover:text-cyan-400 transition-colors px-2 py-2 text-left bg-transparent border-0 outline-none"
                  >
                    History
                  </button>
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileOpen(false);
                    }}
                    className="text-red-400 hover:text-red-300 transition-colors px-2 py-2 text-left bg-transparent border-0 outline-none"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {historyOpen && (
          <Suspense fallback={null}>
            <HistoryDropdown open={historyOpen} onClose={() => setHistoryOpen(false)} />
          </Suspense>
        )}
      </header>
      <ControlPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
