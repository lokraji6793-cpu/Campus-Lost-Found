import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Edit3, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { LostFoundItem, ItemFormData, ValidationErrors } from '../types';
import { getItem, updateItem } from '../api';
import { ItemForm } from '../components/ItemForm';
import { NotificationToast, ToastMessage } from '../components/NotificationToast';

export const EditItemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [item, setItem] = useState<LostFoundItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState<ValidationErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    const fetchExisting = async () => {
      if (!id) return;
      setIsLoading(true);
      setError(null);
      try {
        const data = await getItem(id);
        setItem(data);
      } catch (err: any) {
        console.error('Error fetching item for editing:', err);
        setError(err.message || 'Item not found.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExisting();
  }, [id]);

  const handleSubmit = async (formData: ItemFormData) => {
    if (!id) return;
    setIsSubmitting(true);
    setServerErrors({});
    try {
      const updated = await updateItem(id, formData);
      setToast({
        id: Date.now().toString(),
        type: 'success',
        message: `Item "${updated.item_name}" updated successfully! Redirecting...`,
      });

      setTimeout(() => {
        navigate(`/items/${id}`);
      }, 1000);
    } catch (err: any) {
      console.error('Error updating item:', err);
      if (err.validationErrors) {
        setServerErrors(err.validationErrors);
      }
      setToast({
        id: Date.now().toString(),
        type: 'error',
        message: err.message || 'Unable to update item. Please check the inputs.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center space-y-3 bg-white rounded-2xl border border-stone-200">
        <Loader2 className="w-8 h-8 animate-spin text-stone-400 mx-auto" />
        <p className="text-sm font-semibold text-stone-700">Loading item for edit...</p>
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
          Cannot edit this item because it does not exist or was deleted.
        </p>
        <button
          onClick={() => navigate('/items')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-stone-900 text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Items
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <span className="text-xs font-mono text-stone-400">
          PUT /api/items/{item.id}/
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shrink-0">
            <Edit3 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
              Edit Item Record #{item.id}
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Update item information, change status, or edit student reporter contact details.
            </p>
          </div>
        </div>

        <ItemForm
          initialData={{
            item_name: item.item_name,
            description: item.description,
            category: item.category,
            status: item.status,
            location: item.location,
            date_lost_found: item.date_lost_found,
            reported_by: item.reported_by,
            student_email: item.student_email,
            phone: item.phone,
            image_url: item.image_url,
          }}
          isEditMode={true}
          submitButtonText="Update Item"
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/items/${item.id}`)}
          serverErrors={serverErrors}
        />
      </div>

      <NotificationToast
        toast={toast}
        onDismiss={() => setToast(null)}
      />
    </div>
  );
};
