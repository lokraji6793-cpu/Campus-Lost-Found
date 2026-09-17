import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { ItemFormData, ValidationErrors } from '../types';
import { createItem } from '../api';
import { ItemForm } from '../components/ItemForm';
import { NotificationToast, ToastMessage } from '../components/NotificationToast';

export const ReportFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState<ValidationErrors>({});
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const handleSubmit = async (data: ItemFormData) => {
    setIsSubmitting(true);
    setServerErrors({});
    try {
      // Ensure status is explicitly Found
      const submissionData: ItemFormData = {
        ...data,
        status: 'Found',
      };

      const newItem = await createItem(submissionData);
      
      setToast({
        id: Date.now().toString(),
        type: 'success',
        message: `Found item "${newItem.item_name}" registered successfully! Redirecting...`,
      });

      // Redirect to All Items page
      setTimeout(() => {
        navigate('/items');
      }, 1000);
    } catch (err: any) {
      console.error('Error reporting found item:', err);
      if (err.validationErrors) {
        setServerErrors(err.validationErrors);
      }
      setToast({
        id: Date.now().toString(),
        type: 'error',
        message: err.message || 'Unable to submit found item report. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header Bar */}
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
          POST /api/items/ (status: "Found")
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
              Report Found Item
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Found an item on campus? Register it here so the rightful owner can verify and claim it. Status will automatically be set to <strong className="text-emerald-700">Found</strong>.
            </p>
          </div>
        </div>

        <ItemForm
          forcedStatus="Found"
          submitButtonText="Submit Found Item"
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/items')}
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
