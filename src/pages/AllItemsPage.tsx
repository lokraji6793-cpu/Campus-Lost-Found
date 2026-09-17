import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  RotateCcw, 
  PlusCircle, 
  HelpCircle, 
  Database, 
  Loader2, 
  SlidersHorizontal,
  X,
  Layers
} from 'lucide-react';
import { LostFoundItem } from '../types';
import { getItems, deleteItem, markReturned, resetSampleData } from '../api';
import { ItemCard } from '../components/ItemCard';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { NotificationToast, ToastMessage } from '../components/NotificationToast';
import { CATEGORIES, STATUSES } from '../constants';

export const AllItemsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter state synced with URL query
  const querySearch = searchParams.get('search') || '';
  const queryStatus = searchParams.get('status') || 'All';
  const queryCategory = searchParams.get('category') || 'All';
  const queryOrdering = searchParams.get('ordering') || '-id';

  const [search, setSearch] = useState(querySearch);
  const [status, setStatus] = useState(queryStatus);
  const [category, setCategory] = useState(queryCategory);
  const [ordering, setOrdering] = useState(queryOrdering);

  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Deletion modal
  const [itemToDelete, setItemToDelete] = useState<LostFoundItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Fetch items from Django backend REST API
  const fetchItemsData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getItems({
        search: search.trim() || undefined,
        status: status !== 'All' ? status : undefined,
        category: category !== 'All' ? category : undefined,
        ordering,
      });
      setItems(data);
    } catch (err: any) {
      console.error('Error fetching items from API:', err);
      setError(err.message || 'Unable to connect to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger fetch when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    if (status !== 'All') params.set('status', status);
    if (category !== 'All') params.set('category', category);
    if (ordering !== '-id') params.set('ordering', ordering);
    setSearchParams(params, { replace: true });

    fetchItemsData();
  }, [search, status, category, ordering]);

  const handleClearFilters = () => {
    setSearch('');
    setStatus('All');
    setCategory('All');
    setOrdering('-id');
  };

  const handleMarkReturned = async (item: LostFoundItem) => {
    try {
      await markReturned(item.id);
      setToast({
        id: Date.now().toString(),
        type: 'success',
        message: `Item marked as returned successfully.`,
      });
      fetchItemsData();
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
        message: `Item #${itemToDelete.id} removed from database successfully.`,
      });
      setItemToDelete(null);
      fetchItemsData();
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

  const handleResetSampleData = async () => {
    if (window.confirm('Reset database to default sample records? Any custom items will be restored to initial sample set.')) {
      try {
        setIsLoading(true);
        await resetSampleData();
        setToast({
          id: Date.now().toString(),
          type: 'success',
          message: 'Database sample records restored successfully.',
        });
        handleClearFilters();
        fetchItemsData();
      } catch (err: any) {
        setToast({
          id: Date.now().toString(),
          type: 'error',
          message: err.message || 'Failed to reset sample data.',
        });
      }
    }
  };

  const hasActiveFilters = search.trim() !== '' || status !== 'All' || category !== 'All';

  return (
    <div className="space-y-8">
      {/* Page Title & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
              All Campus Items
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-stone-100 text-stone-700 border border-stone-200">
              {items.length} records
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Browse, search, filter, update, or resolve lost and found items.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleResetSampleData}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors"
            title="Reset database with standard college sample data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Samples
          </button>
          
          <Link
            to="/report-lost"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-700 text-white shadow-xs transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Report Lost
          </Link>

          <Link
            to="/report-found"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Report Found
          </Link>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative sm:col-span-2 lg:col-span-1">
            <input
              id="search-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search item, location, student..."
              className="w-full pl-10 pr-8 py-2 rounded-lg border border-stone-300 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-900"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="filter-status" className="sr-only">Filter by Status</label>
            <select
              id="filter-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-200"
            >
              <option value="All">Status: All Records</option>
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  Status: {st}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label htmlFor="filter-category" className="sr-only">Filter by Category</label>
            <select
              id="filter-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-200"
            >
              <option value="All">Category: All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Ordering Sort */}
          <div>
            <label htmlFor="filter-ordering" className="sr-only">Sort Order</label>
            <select
              id="filter-ordering"
              value={ordering}
              onChange={(e) => setOrdering(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-stone-200"
            >
              <option value="-id">Sort: Recently Added (Newest)</option>
              <option value="id">Sort: Oldest Added First</option>
              <option value="-date_lost_found">Sort: Event Date (Latest)</option>
              <option value="date_lost_found">Sort: Event Date (Earliest)</option>
            </select>
          </div>
        </div>

        {/* Active Filters Tag Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 text-xs">
            <span className="font-semibold text-stone-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Active filters:
            </span>
            {search.trim() && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-800 border border-stone-200">
                Search: "{search}"
                <button type="button" onClick={() => setSearch('')}>
                  <X className="w-3 h-3 text-stone-500 hover:text-stone-900" />
                </button>
              </span>
            )}
            {status !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-800 border border-stone-200">
                Status: {status}
                <button type="button" onClick={() => setStatus('All')}>
                  <X className="w-3 h-3 text-stone-500 hover:text-stone-900" />
                </button>
              </span>
            )}
            {category !== 'All' && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-stone-100 text-stone-800 border border-stone-200">
                Category: {category}
                <button type="button" onClick={() => setCategory('All')}>
                  <X className="w-3 h-3 text-stone-500 hover:text-stone-900" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-amber-700 hover:underline font-semibold ml-2 cursor-pointer"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Main Items Display Area */}
      {isLoading ? (
        <div className="py-20 text-center space-y-3 bg-white rounded-2xl border border-stone-200">
          <Loader2 className="w-8 h-8 animate-spin text-stone-400 mx-auto" />
          <p className="text-sm font-semibold text-stone-700">Loading items...</p>
        </div>
      ) : error ? (
        <div className="p-8 text-center bg-red-50 rounded-2xl border border-red-200 space-y-3">
          <p className="text-sm font-semibold text-red-800">{error}</p>
          <button
            onClick={fetchItemsData}
            className="px-4 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700"
          >
            Retry Connection
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="py-20 text-center space-y-4 bg-white rounded-2xl border border-stone-200 p-8">
          <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <Search className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-base font-bold text-stone-900">
              {hasActiveFilters ? 'No matching items found.' : 'No lost or found items have been reported yet.'}
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-md mx-auto leading-relaxed">
              {hasActiveFilters
                ? 'Try adjusting your search terms or clearing status and category filters to see more results.'
                : 'Get started by reporting an item you lost or found on campus.'}
            </p>
          </div>
          <div className="flex items-center justify-center gap-3 pt-2">
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={handleClearFilters}
                className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
              >
                Clear Filters
              </button>
            ) : (
              <Link
                to="/report-lost"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 text-white text-xs font-bold hover:bg-stone-800"
              >
                Report an Item
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onDeleteRequest={(target) => setItemToDelete(target)}
              onMarkReturned={handleMarkReturned}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={Boolean(itemToDelete)}
        item={itemToDelete}
        isDeleting={isDeleting}
        onCancel={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Notification Toast */}
      <NotificationToast
        toast={toast}
        onDismiss={() => setToast(null)}
      />
    </div>
  );
};
