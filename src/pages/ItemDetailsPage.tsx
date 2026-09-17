import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Tag, 
  Clock, 
  Image as ImageIcon, 
  Loader2,
  AlertCircle
} from 'lucide-react';
import { LostFoundItem } from '../types';
import { getItem, deleteItem, markReturned } from '../api';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { NotificationToast, ToastMessage } from '../components/NotificationToast';
import { CATEGORY_COLORS, STATUS_STYLES } from '../constants';

export const ItemDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<LostFoundItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageError, setImageError] = useState(false);

  // Deletion modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const fetchItemDetails = async () => {
    if (!id) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getItem(id);
      setItem(data);
    } catch (err: any) {
      console.error('Error fetching item details:', err);
      setError(err.message || 'Item not found.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  const handleMarkReturned = async () => {
    if (!item) return;
    try {
      const result = await markReturned(item.id);
      setItem(result.item);
      setToast({
        id: Date.now().toString(),
        type: 'success',
        message: 'Item marked as returned successfully.',
      });
    } catch (err: any) {
      setToast({
        id: Date.now().toString(),
        type: 'error',
        message: err.message || 'Failed to mark item as returned.',
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!item) return;
    setIsDeleting(true);
    try {
      await deleteItem(item.id);
      setToast({
        id: Date.now().toString(),
        type: 'success',
        message: 'Item removed from database.',
      });
      setTimeout(() => {
        navigate('/items');
      }, 700);
    } catch (err: any) {
      setToast({
        id: Date.now().toString(),
        type: 'error',
        message: err.message || 'Failed to delete item.',
      });
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-3 bg-white rounded-2xl border border-stone-200">
        <Loader2 className="w-8 h-8 animate-spin text-stone-400 mx-auto" />
        <p className="text-sm font-semibold text-stone-700">Loading item details...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4 bg-white rounded-2xl border border-stone-200 p-8">
        <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mx-auto border border-red-200">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-stone-900">{error || 'Item Not Found'}</h2>
        <p className="text-xs text-stone-500">
          The requested item with ID #{id} does not exist in the database or may have been deleted.
        </p>
        <Link
          to="/items"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 text-white text-xs font-bold hover:bg-stone-800"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Items
        </Link>
      </div>
    );
  }

  const statusStyle = STATUS_STYLES[item.status] || STATUS_STYLES.Lost;
  const categoryStyle = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Other;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Breadcrumb & API Method indicator */}
      <div className="flex items-center justify-between">
        <Link
          to="/items"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Items
        </Link>

        <span className="text-xs font-mono text-stone-400">
          GET /api/items/{item.id}/
        </span>
      </div>

      {/* Main Details Card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column: Image view */}
          <div className="relative min-h-[300px] md:min-h-full bg-stone-100 flex items-center justify-center border-b md:border-b-0 md:border-r border-stone-200 overflow-hidden">
            {item.image_url && !imageError ? (
              <img
                src={item.image_url}
                alt={item.item_name}
                referrerPolicy="no-referrer"
                onError={() => setImageError(true)}
                className="w-full h-full object-cover max-h-[460px]"
              />
            ) : (
              <div className="p-8 text-center text-stone-400 space-y-2">
                <ImageIcon className="w-16 h-16 stroke-1 text-stone-300 mx-auto" />
                <p className="text-xs font-medium">No Image Uploaded</p>
                <p className="text-[11px] text-stone-400 max-w-xs">
                  A photo can be added anytime by clicking the Edit button.
                </p>
              </div>
            )}

            {/* Badges overlay */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusStyle.badge} backdrop-blur-md shadow-xs`}>
                <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
                {item.status}
              </span>
            </div>

            <div className="absolute top-4 right-4">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${categoryStyle.bg} ${categoryStyle.text} border ${categoryStyle.border} shadow-xs`}>
                <Tag className="w-3.5 h-3.5" />
                {item.category}
              </span>
            </div>
          </div>

          {/* Right Column: Detailed Info */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Record ID #{item.id}
                </span>
                <h1 className="text-2xl font-black text-stone-900 tracking-tight mt-0.5">
                  {item.item_name}
                </h1>
              </div>

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-1">
                  Item Description
                </h3>
                <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line bg-stone-50 p-3.5 rounded-xl border border-stone-100">
                  {item.description}
                </p>
              </div>

              {/* Event Location & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-stone-50 border border-stone-100">
                  <span className="text-stone-400 font-medium flex items-center gap-1 mb-1">
                    <MapPin className="w-3.5 h-3.5 text-stone-500" /> Location
                  </span>
                  <span className="font-semibold text-stone-900 block truncate">
                    {item.location}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-stone-50 border border-stone-100">
                  <span className="text-stone-400 font-medium flex items-center gap-1 mb-1">
                    <Calendar className="w-3.5 h-3.5 text-stone-500" /> Date Reported
                  </span>
                  <span className="font-semibold text-stone-900 block">
                    {item.date_lost_found}
                  </span>
                </div>
              </div>

              {/* Student Reporter Information */}
              <div className="border-t border-stone-100 pt-4 space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                  Reported By (Contact)
                </h3>
                <div className="space-y-1.5 text-xs text-stone-700">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-stone-400" />
                    <span className="font-semibold text-stone-900">{item.reported_by}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-stone-400" />
                    <a
                      href={`mailto:${item.student_email}`}
                      className="text-amber-700 hover:underline font-medium"
                    >
                      {item.student_email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-stone-400" />
                    <a
                      href={`tel:${item.phone}`}
                      className="text-amber-700 hover:underline font-medium"
                    >
                      {item.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Timestamp Audit Details */}
              <div className="border-t border-stone-100 pt-3 flex flex-wrap items-center justify-between text-[11px] text-stone-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Created: {new Date(item.created_at).toLocaleString()}
                </span>
                <span>
                  Updated: {new Date(item.updated_at).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-stone-100 flex flex-wrap items-center gap-2.5">
              <Link
                id="btn-details-edit"
                to={`/items/${item.id}/edit`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors shadow-2xs"
              >
                <Edit3 className="w-4 h-4 text-amber-700" />
                Edit Item
              </Link>

              <button
                id="btn-details-delete"
                type="button"
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors shadow-2xs cursor-pointer"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
                Delete Item
              </button>

              {item.status !== 'Returned' && (
                <button
                  id="btn-details-return"
                  type="button"
                  onClick={handleMarkReturned}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-xs ml-auto cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark as Returned
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        item={item}
        isDeleting={isDeleting}
        onCancel={() => setShowDeleteModal(false)}
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
