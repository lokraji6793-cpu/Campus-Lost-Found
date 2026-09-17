import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Search, 
  PlusCircle, 
  CheckCircle2, 
  Layers, 
  Info, 
  Menu, 
  X, 
  ShieldCheck, 
  HelpCircle,
  Database
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { to: '/', label: 'Home', icon: Layers },
    { to: '/report-lost', label: 'Report Lost', icon: HelpCircle },
    { to: '/report-found', label: 'Report Found', icon: CheckCircle2 },
    { to: '/items', label: 'All Items', icon: Search },
    { to: '/about', label: 'About', icon: Info },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-stone-900 flex items-center justify-center text-white shadow-sm group-hover:bg-amber-600 transition-colors duration-200">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-900 text-lg tracking-tight">
                  Campus Lost & Found
                </span>
                <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Database className="w-3 h-3 text-emerald-600" />
                  SQLite Active
                </span>
              </div>
              <p className="text-xs text-stone-500 font-medium">
                Find it. Report it. Return it.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link.to);
              const Icon = link.icon;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                    active
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-amber-400' : 'text-stone-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Quick Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <Link
              to="/report-lost"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Report Lost
            </Link>
            <Link
              to="/report-found"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Report Found
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-stone-200 bg-white px-4 pt-2 pb-5 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const active = isActive(link.to);
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                  active
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'text-amber-400' : 'text-stone-400'}`} />
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3 grid grid-cols-2 gap-2">
            <Link
              to="/report-lost"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold rounded-lg bg-red-50 text-red-700 border border-red-200 text-center"
            >
              <HelpCircle className="w-4 h-4" />
              Report Lost
            </Link>
            <Link
              to="/report-found"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold rounded-lg bg-emerald-600 text-white text-center"
            >
              <PlusCircle className="w-4 h-4" />
              Report Found
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
