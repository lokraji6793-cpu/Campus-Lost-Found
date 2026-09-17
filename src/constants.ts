import { ItemCategory, ItemStatus } from './types';

export const CATEGORIES: ItemCategory[] = [
  'Electronics',
  'Books',
  'ID Card',
  'Wallet',
  'Keys',
  'Clothing',
  'Accessories',
  'Documents',
  'Other',
];

export const STATUSES: ItemStatus[] = ['Lost', 'Found', 'Returned'];

export const CATEGORY_COLORS: Record<ItemCategory, { bg: string; text: string; border: string }> = {
  Electronics: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  Books: { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  'ID Card': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  Wallet: { bg: 'bg-stone-100', text: 'text-stone-800', border: 'border-stone-300' },
  Keys: { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200' },
  Clothing: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  Accessories: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  Documents: { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
  Other: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' },
};

export const STATUS_STYLES: Record<ItemStatus, { badge: string; dot: string; label: string }> = {
  Lost: {
    badge: 'bg-red-50 text-red-700 border-red-200 ring-1 ring-red-600/10',
    dot: 'bg-red-500',
    label: 'Lost',
  },
  Found: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-600/10',
    dot: 'bg-emerald-500',
    label: 'Found',
  },
  Returned: {
    badge: 'bg-blue-50 text-blue-700 border-blue-200 ring-1 ring-blue-600/10',
    dot: 'bg-blue-500',
    label: 'Returned',
  },
};
