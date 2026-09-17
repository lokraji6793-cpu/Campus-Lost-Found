import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  HelpCircle, 
  CheckCircle2, 
  Layers, 
  ArrowRight, 
  Clock, 
  RotateCcw, 
  ShieldCheck, 
  Database,
  Sparkles,
  Loader2
} from 'lucide-react';
import { LostFoundItem, DashboardStats } from '../types';
import { getStats, getItems, markReturned, deleteItem } from '../api';
import { ItemCard } from '../components/ItemCard';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { NotificationToast, ToastMessage } from '../components/NotificationToast';
import { CATEGORIES } from '../constants';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentItems, setRecentItems] = useState<LostFoundItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Deletion modal state
  const [itemToDelete, setItemToDelete] = useState<LostFoundItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast state
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [statsData, itemsData] = await Promise.all([
        getStats(),
        getItems({ ordering: '-id' }),
      ]);
      setStats(statsData);
      setRecentItems(itemsData.slice(0, 6));
    } catch (err: any) {
      console.error('Error loading dashboard data:', err);
      setError(err.message || 'Unable to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (selectedCategory !== 'All') params.set('category', selectedCategory);
    navigate(`/items?${params.toString()}`);
  };

  const handleMarkReturned = async (item: LostFoundItem) => {
    try {
      await markReturned(item.id);
      setToast({
        id: Date.now().toString(),
        type: 'success',
        message: `"${item.item_name}" marked as returned successfully.`,
      });
      loadDashboardData();
    } catch (err: any) {
      setToast({
        id: Date.now().toString(),
        type: 'error',
        message: err.message || 'Failed to mark item as returned.',
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await deleteItem(itemToDelete.id);
      setToast({
        id: Date.now().toString(),
        type: 'success',
        message: `Item #${itemToDelete.id} removed from database.`,
      });
      setItemToDelete(null);
      loadDashboardData();
    } catch (err: any) {
      setToast({
        id: Date.now().toString(),
        type: 'error',
        message: err.message || 'Failed to delete item.',
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 text-white p-8 sm:p-12 lg:p-16 shadow-xl border border-stone-800">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-800/80 border border-stone-700/80 text-amber-400 text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5" />
            Official College Student Services
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Campus Lost & Found
            </h1>
            <p className="text-lg sm:text-xl text-amber-300 font-medium">
              "Find it. Report it. Return it."
            </p>
          </div>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Helping students find lost belongings and return found items. 
            Connect with campus security and fellow students to quickly reunite 
            with wallets, keys, electronics, ID cards, and textbooks.
          </p>

          {/* Hero Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              id="hero-btn-report-lost"
              to="/report-lost"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold shadow-lg shadow-red-900/30 transition-all hover:translate-y-[-1px]"
            >
              <HelpCircle className="w-4 h-4" />
              Report Lost Item
            </Link>

            <Link
              id="hero-btn-report-found"
              to="/report-found"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-lg shadow-emerald-900/30 transition-all hover:translate-y-[-1px]"
            >
              <CheckCircle2 className="w-4 h-4" />
              Report Found Item
            </Link>

            <Link
              id="hero-btn-view-all"
              to="/items"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-sm font-bold border border-stone-700 transition-all"
            >
              <Layers className="w-4 h-4" />
              View All Items
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Dynamic Database Statistics Cards */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-stone-900">
              Campus Inventory Statistics
            </h2>
            <p className="text-xs text-stone-500 font-medium">
              Live metrics synchronized from SQLite database via Django REST API
            </p>
          </div>
          <button
            type="button"
            onClick={loadDashboardData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 border border-stone-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Refresh Stats
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Total Items */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs hover:border-stone-300 transition-all">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Items</span>
              <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
                <Database className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-stone-900">
              {isLoading ? '...' : stats?.total ?? 0}
            </div>
            <p className="mt-1 text-xs text-stone-500">
              Total records logged in database
            </p>
          </div>

          {/* Card 2: Lost Items */}
          <div className="bg-white rounded-2xl p-5 border border-red-200/80 shadow-xs hover:border-red-300 transition-all bg-gradient-to-br from-white to-red-50/30">
            <div className="flex items-center justify-between text-red-700 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Lost Items</span>
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">
                <HelpCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-red-700">
              {isLoading ? '...' : stats?.lost ?? 0}
            </div>
            <p className="mt-1 text-xs text-red-600/80">
              Awaiting recovery & return
            </p>
          </div>

          {/* Card 3: Found Items */}
          <div className="bg-white rounded-2xl p-5 border border-emerald-200/80 shadow-xs hover:border-emerald-300 transition-all bg-gradient-to-br from-white to-emerald-50/30">
            <div className="flex items-center justify-between text-emerald-700 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Found Items</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-emerald-700">
              {isLoading ? '...' : stats?.found ?? 0}
            </div>
            <p className="mt-1 text-xs text-emerald-600/80">
              In campus possession / safe custody
            </p>
          </div>

          {/* Card 4: Returned Items */}
          <div className="bg-white rounded-2xl p-5 border border-blue-200/80 shadow-xs hover:border-blue-300 transition-all bg-gradient-to-br from-white to-blue-50/30">
            <div className="flex items-center justify-between text-blue-700 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Returned Items</span>
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-blue-700">
              {isLoading ? '...' : stats?.returned ?? 0}
            </div>
            <p className="mt-1 text-xs text-blue-600/80">
              Successfully reunited with owners
            </p>
          </div>
        </div>
      </section>

      {/* 3. Fast Interactive Search & Category Filter Bar */}
      <section className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Quick search by item name, location, or student name..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-stone-300 bg-stone-50/50 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-900 transition-all"
              />
              <Search className="w-5 h-5 text-stone-400 absolute left-3.5 top-3.5" />
            </div>

            <div className="w-full md:w-56">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-stone-300 bg-white text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-900"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-6 py-3 rounded-xl bg-stone-900 text-white font-semibold text-sm hover:bg-stone-800 transition-colors shadow-xs shrink-0 cursor-pointer"
            >
              Search Items
            </button>
          </div>

          {/* Category Pills shortcut */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            <span className="text-xs font-semibold text-stone-500 mr-1">Popular categories:</span>
            {CATEGORIES.slice(0, 5).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  navigate(`/items?category=${encodeURIComponent(cat)}`);
                }}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>
        </form>
      </section>

      {/* 4. Recently Reported Items */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900">
                Recently Reported Items
              </h2>
              <p className="text-xs text-stone-500">
                Latest submissions reported on campus
              </p>
            </div>
          </div>

          <Link
            to="/items"
            className="inline-flex items-center gap-1 text-sm font-semibold text-stone-900 hover:text-amber-700 transition-colors"
          >
            View All ({stats?.total ?? 0})
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {isLoading ? (
          <div className="py-16 text-center space-y-3 bg-white rounded-2xl border border-stone-200">
            <Loader2 className="w-8 h-8 animate-spin text-stone-400 mx-auto" />
            <p className="text-sm font-medium text-stone-600">Loading items from database...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-200 space-y-3">
            <p className="text-sm font-semibold text-red-800">{error}</p>
            <button
              onClick={loadDashboardData}
              className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700"
            >
              Retry Connection
            </button>
          </div>
        ) : recentItems.length === 0 ? (
          <div className="py-16 text-center space-y-4 bg-white rounded-2xl border border-stone-200">
            <HelpCircle className="w-12 h-12 text-stone-300 mx-auto" />
            <div>
              <h3 className="text-base font-bold text-stone-900">No items reported yet</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                No lost or found items have been reported yet. Be the first to register a lost or found item.
              </p>
            </div>
            <Link
              to="/report-lost"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 text-white text-xs font-bold"
            >
              Report an Item
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentItems.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onDeleteRequest={(target) => setItemToDelete(target)}
                onMarkReturned={handleMarkReturned}
              />
            ))}
          </div>
        )}
      </section>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(itemToDelete)}
        item={itemToDelete}
        isDeleting={isDeleting}
        onCancel={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Notifications */}
      <NotificationToast
        toast={toast}
        onDismiss={() => setToast(null)}
      />
    </div>
  );
};
