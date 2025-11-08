import { useStore } from '@nanostores/react';
import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { SignedIn, SignedOut, useClerk, useUser } from '@clerk/remix';
import { ClientOnly } from 'remix-utils/client-only';
import { Link } from '@remix-run/react';
import { chatStore } from '~/lib/stores/chat';
import { classNames } from '~/utils/classNames';
const HeaderActionButtons = lazy(() => import('./HeaderActionButtons.client').then(m => ({ default: m.HeaderActionButtons })));
import { ChatDescription } from '~/lib/persistence/ChatDescription.client';
import { ControlPanel } from '~/components/@settings/core/ControlPanel';
const HistoryDropdown = lazy(() => import('./HistoryDropdown.client').then(m => ({ default: m.HistoryDropdown })));

export function Header() {
  const chat = useStore(chatStore);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);
  const { user } = useUser();
  const { signOut } = useClerk();
  const resourcesRef = useRef<HTMLLIElement | null>(null);
  const accountRef = useRef<HTMLDivElement | null>(null);
  const displayName = (user?.fullName || user?.username || user?.primaryEmailAddress?.emailAddress || 'Account') as string;
  const avatarInitial = (displayName?.charAt(0) || 'A').toUpperCase();

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
      className={classNames(
        'sticky top-0 z-50 w-full',
        'bg-[#0b0b0c]/95 backdrop-blur-lg',
        'border-b border-[#66ffb2]/30 shadow-md shadow-black/20',
      )}
      style={{ height: 'var(--header-height)' }}
    >
      <div className="mx-auto max-w-7xl h-full px-3 sm:px-4 flex items-center justify-between">
        {/* Left: Logo */}
        <a href="/" className="flex items-center gap-2 select-none">
          <span className="text-xl font-semibold tracking-tight flex items-baseline">
            <span
              className="text-[#66ffb2]"
              style={{ textShadow: '0 0 10px rgba(102,255,178,0.8), 0 0 20px rgba(102,255,178,0.6), 0 0 30px rgba(102,255,178,0.4)' }}
            >
              Clyra
            </span>
            <span className="ml-0.5" style={{ color: '#a8ffcc' }}>.ai</span>
          </span>
        </a>

        {/* Center: Nav links (hidden on mobile) */}
        <nav className="hidden md:flex flex-1 items-center justify-center">
          <ul className="flex items-center gap-8 text-sm text-gray-300">
            <li>
              <Link prefetch="intent" to="#community" className="hover:text-white transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 hover:after:w-full after:bg-white/40 after:transition-all">Community</Link>
            </li>
            <li>
              <Link prefetch="intent" to="#enterprise" className="hover:text-white transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 hover:after:w-full after:bg-white/40 after:transition-all">Enterprise</Link>
            </li>
            <li className="relative" ref={resourcesRef}>
              <button
                className="flex items-center gap-1 bg-transparent appearance-none text-gray-300 hover:text-white transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 hover:after:w-full after:bg-white/40 after:transition-all outline-none focus:outline-none focus-visible:outline-none ring-0 border-0 cursor-pointer"
                onClick={() => setResourcesOpen((v) => !v)}
              >
                Resources <span className={classNames('i-ph:caret-down text-gray-400 transition-transform', { 'rotate-180': resourcesOpen })} />
              </button>
              <div
                className={classNames(
                  'absolute left-0 mt-2 w-44 bg-[#0b0b0c]/95 border border-[#66ffb2]/30 rounded-lg backdrop-blur-lg shadow-lg',
                  'transition-all duration-200 ease-out',
                  resourcesOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                )}
              >
                <Link prefetch="intent" to="/docs" className="block px-4 py-2 text-gray-300 hover:bg-white/10">Docs</Link>
                <Link prefetch="intent" to="/blog" className="block px-4 py-2 text-gray-300 hover:bg-white/10">Blog</Link>
                <Link prefetch="intent" to="/templates" className="block px-4 py-2 text-gray-300 hover:bg-white/10">Templates</Link>
              </div>
            </li>
            <li>
              <Link prefetch="intent" to="/careers" className="hover:text-white transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 hover:after:w-full after:bg-white/40 after:transition-all">Careers</Link>
            </li>
            <li>
              <Link prefetch="intent" to="/pricing" className="hover:text-white transition-colors relative after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:w-0 hover:after:w-full after:bg-white/40 after:transition-all">Pricing</Link>
            </li>
          </ul>
        </nav>

        {/* Right: Socials group with divider, then Account */}
        <div className="hidden md:flex items-center gap-3 text-gray-400">
          <SignedOut>
            <Link prefetch="intent" to="/sign-in" className="text-gray-300 hover:text-white transition-colors">Sign In</Link>
          </SignedOut>
          <SignedIn>
            <>
              <div className="flex items-center gap-4 pr-4 border-r border-[#66ffb2]/30">
                <a href="#discord" className="i-ph:discord-logo text-xl hover:text-gray-200 transition-colors" aria-label="Discord" />
                <a href="#youtube" className="i-ph:youtube-logo text-xl hover:text-gray-200 transition-colors" aria-label="YouTube" />
                <a href="#instagram" className="i-ph:instagram-logo text-xl hover:text-gray-200 transition-colors" aria-label="Instagram" />
                <a href="#linkedin" className="i-ph:linkedin-logo text-xl hover:text-gray-200 transition-colors" aria-label="LinkedIn" />
              </div>
              <div className="relative pl-4" ref={accountRef}>
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full px-2 py-1.5 bg-white/5 hover:bg-white/10 text-gray-200 transition-colors"
                  title={displayName}
                  onClick={() => setAccountOpen((v) => !v)}
                >
                  <div
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-[#66ffb2] to-[#a8ffcc] text-[#0a0a0f] flex items-center justify-center font-semibold"
                    style={{ boxShadow: '0 0 20px rgba(102,255,178,0.6), 0 0 40px rgba(168,255,204,0.4)' }}
                  >
                    {avatarInitial}
                  </div>
                  <span className="hidden sm:inline text-gray-200">{displayName}</span>
                  <span className={classNames('i-ph:caret-down transition-transform', { 'rotate-180': accountOpen })} />
                </button>
                <div
                  className={classNames(
                    'absolute right-0 mt-2 w-56 bg-[#0b0b0c]/95 rounded-lg border border-[#66ffb2]/20 backdrop-blur-lg text-gray-300',
                    'shadow-[0_0_15px_rgba(102,255,178,0.25)]',
                    'transition-all duration-200 ease-out',
                    accountOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                  )}
                >
                  <div className="px-4 py-3 border-b border-[#66ffb2]/20">
                    <p className="text-[10px] uppercase tracking-wider text-gray-400">Signed in as</p>
                    <p className="text-sm font-semibold text-[#66ffb2] mt-1">{displayName}</p>
                  </div>

                  <button
                    onClick={() => setSettingsOpen(true)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm bg-transparent appearance-none text-gray-300 hover:text-[#66ffb2] hover:bg-[#66ffb2]/10 transition-colors outline-none focus:outline-none focus-visible:outline-none ring-0 border-0"
                  >
                    <span className="i-ph:gear-six" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={() => setHistoryOpen((v) => !v)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm bg-transparent appearance-none text-gray-300 hover:text-[#66ffb2] hover:bg-[#66ffb2]/10 transition-colors"
                  >
                    <span className="i-ph:clock" />
                    <span>History</span>
                  </button>

                  <div className="border-t border-[#66ffb2]/20 mt-2" />

                  <button
                    onClick={() => signOut({ redirectUrl: '/' })}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm bg-transparent appearance-none text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors outline-none focus:outline-none focus-visible:outline-none ring-0 border-0"
                  >
                    <span className="i-ph:sign-out" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </>
          </SignedIn>
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

        {/* Mobile hamburger */}
        <button
          className="md:hidden inline-flex items-center justify-center h-9 w-9 rounded-md bg-white/5 hover:bg-white/10 text-gray-200"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className={classNames('i-ph:list text-xl transition-transform', { 'rotate-90': mobileOpen })} />
        </button>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#1f1f1f] bg-[#0B0B0C]/95 backdrop-blur px-3 py-3">
          <div className="flex flex-col gap-2 text-gray-300">
            <Link prefetch="intent" to="#community" className="py-2 hover:text-white">Community</Link>
            <Link prefetch="intent" to="#enterprise" className="py-2 hover:text-white">Enterprise</Link>
            <div>
              <button
                className="w-full text-left py-2 hover:text-white flex items-center justify-between bg-transparent appearance-none text-gray-300 outline-none focus:outline-none focus-visible:outline-none ring-0 border-0"
                onClick={() => setMobileResourcesOpen((v) => !v)}
              >
                <span>Resources</span>
                <span className={classNames('i-ph:caret-down text-gray-400 transition-transform', { 'rotate-180': mobileResourcesOpen })} />
              </button>
              <div className={classNames('ml-3 flex flex-col text-sm text-gray-300', mobileResourcesOpen ? 'animate-[fadeIn_150ms_ease] block' : 'hidden')}>
                <Link prefetch="intent" to="/docs" className="px-2 py-1 hover:bg-white/10 rounded">Docs</Link>
                <Link prefetch="intent" to="/blog" className="px-2 py-1 hover:bg-white/10 rounded">Blog</Link>
                <Link prefetch="intent" to="/templates" className="px-2 py-1 hover:bg-white/10 rounded">Templates</Link>
              </div>
            </div>
            <Link prefetch="intent" to="/careers" className="py-2 hover:text-white">Careers</Link>
            <Link prefetch="intent" to="/pricing" className="py-2 hover:text-white">Pricing</Link>
            <SignedOut>
              <Link prefetch="intent" to="/sign-in" className="py-2 hover:text-white">Sign In</Link>
            </SignedOut>
            <SignedIn>
              <button
                onClick={() => setSettingsOpen(true)}
                className="py-2 text-left px-3 bg-transparent appearance-none outline-none ring-0 border-0 text-gray-300 hover:text-[#66ffb2] hover:bg-[#66ffb2]/10 rounded"
              >
                Settings
              </button>
              <button
                onClick={() => setHistoryOpen((v) => !v)}
                className="py-2 text-left px-3 bg-transparent appearance-none outline-none ring-0 border-0 text-gray-300 hover:text-[#66ffb2] hover:bg-[#66ffb2]/10 rounded"
              >
                History
              </button>
              <button
                onClick={() => signOut({ redirectUrl: '/' })}
                className="py-2 text-left px-3 bg-transparent appearance-none outline-none ring-0 border-0 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded"
              >
                Log out
              </button>
            </SignedIn>
            <div className="flex items-center gap-3 pt-2 text-gray-400">
              <a href="#discord" className="i-ph:discord-logo text-xl hover:text-gray-200" aria-label="Discord" />
              <a href="#linkedin" className="i-ph:linkedin-logo text-xl hover:text-gray-200" aria-label="LinkedIn" />
              <a href="#youtube" className="i-ph:youtube-logo text-xl hover:text-gray-200" aria-label="YouTube" />
              <a href="#instagram" className="i-ph:instagram-logo text-xl hover:text-gray-200" aria-label="Instagram" />
            </div>
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
