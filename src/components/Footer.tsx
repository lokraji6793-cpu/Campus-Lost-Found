import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Database, Code2, CheckCircle2, FileText } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-white font-bold text-lg tracking-tight">
                Campus Lost & Found
              </span>
            </div>
            <p className="text-stone-400 text-sm max-w-md leading-relaxed">
              "Find it. Report it. Return it." — A college campus management system designed 
              to streamline the tracking, searching, and reuniting of lost personal belongings 
              with their student owners.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-stone-400">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-800 border border-stone-700">
                <Code2 className="w-3.5 h-3.5 text-blue-400" /> React 19 Frontend
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-800 border border-stone-700">
                <FileText className="w-3.5 h-3.5 text-emerald-400" /> Django REST Framework
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-stone-800 border border-stone-700">
                <Database className="w-3.5 h-3.5 text-amber-400" /> SQLite Database
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-200">
              Navigation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Dashboard & Stats
                </Link>
              </li>
              <li>
                <Link to="/report-lost" className="hover:text-white transition-colors">
                  Report Lost Item
                </Link>
              </li>
              <li>
                <Link to="/report-found" className="hover:text-white transition-colors">
                  Report Found Item
                </Link>
              </li>
              <li>
                <Link to="/items" className="hover:text-white transition-colors">
                  Browse All Items
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  Architecture & Viva Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: REST API Specifications */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-200">
              REST API Endpoints
            </h3>
            <div className="space-y-1.5 font-mono text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 font-bold">GET</span>
                <span>/api/items/</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-bold">POST</span>
                <span>/api/items/</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-amber-900/60 text-amber-300 font-bold">PUT</span>
                <span>/api/items/{'{id}'}/</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-red-900/60 text-red-300 font-bold">DEL</span>
                <span>/api/items/{'{id}'}/</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-300 font-bold">POST</span>
                <span>/api/items/{'{id}'}/mark_returned/</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Campus Lost & Found Management System. Academic Full-Stack Project.</p>
          <div className="flex items-center gap-4 mt-3 sm:mt-0">
            <span className="inline-flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> CRUD Functional
            </span>
            <span>SQLite v3</span>
            <span>Django REST Framework</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
