import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, ArrowLeft } from 'lucide-react';
import { ItemFormData, ValidationErrors } from '../types';
import { createItem } from '../api';
import { ItemForm } from '../components/ItemForm';
import { NotificationToast, ToastMessage } from '../components/NotificationToast';

export const ReportLostPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverErrors, setServerErrors] = useState<ValidationErrors>({});
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const handleSubmit = async (data: ItemFormData) => {
    setIsSubmitting(true);
    setServerErrors({});
    try {
      // Ensure status is explicitly Lost
      const submissionData: ItemFormData = {
        ...data,
        status: 'Lost',
      };

      const newItem = await createItem(submissionData);
      
      setToast({
        id: Date.now().toString(),
        type: 'success',
        message: `Lost item "${newItem.item_name}" reported successfully! Redirecting...`,
      });

      // Redirect to All Items page after brief confirmation
      setTimeout(() => {
        navigate('/items');
      }, 1000);
    } catch (err: any) {
      console.error('Error reporting lost item:', err);
      if (err.validationErrors) {
        setServerErrors(err.validationErrors);
      }
      setToast({
        id: Date.now().toString(),
        type: 'error',
        message: err.message || 'Unable to submit lost item report. Please try again.',
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
          POST /api/items/ (status: "Lost")
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-100">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shrink-0">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-stone-900 tracking-tight">
              Report Lost Item
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Fill in the details of the item you misplaced on campus. Status will automatically be set to <strong className="text-red-600">Lost</strong>.
            </p>
          </div>
        </div>

        <ItemForm
          forcedStatus="Lost"
          submitButtonText="Submit Lost Item"
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
