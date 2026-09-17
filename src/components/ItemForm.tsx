import React, { useState, useEffect } from 'react';
import { 
  Loader2, 
  HelpCircle, 
  CheckCircle2, 
  Tag, 
  MapPin, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  Image as ImageIcon, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { ItemFormData, ItemCategory, ItemStatus, ValidationErrors } from '../types';
import { CATEGORIES, STATUSES } from '../constants';

interface ItemFormProps {
  initialData?: Partial<ItemFormData>;
  forcedStatus?: ItemStatus;
  isEditMode?: boolean;
  submitButtonText: string;
  isSubmitting: boolean;
  onSubmit: (data: ItemFormData) => void;
  onCancel?: () => void;
  serverErrors?: ValidationErrors;
}

export const ItemForm: React.FC<ItemFormProps> = ({
  initialData,
  forcedStatus,
  isEditMode = false,
  submitButtonText,
  isSubmitting,
  onSubmit,
  onCancel,
  serverErrors,
}) => {
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState<ItemFormData>({
    item_name: initialData?.item_name || '',
    description: initialData?.description || '',
    category: initialData?.category || 'Electronics',
    status: forcedStatus || initialData?.status || 'Lost',
    location: initialData?.location || '',
    date_lost_found: initialData?.date_lost_found || today,
    reported_by: initialData?.reported_by || '',
    student_email: initialData?.student_email || '',
    phone: initialData?.phone || '',
    image_url: initialData?.image_url || '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [imagePreviewError, setImagePreviewError] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        status: forcedStatus || initialData.status || prev.status,
      }));
    }
  }, [initialData, forcedStatus]);

  useEffect(() => {
    if (serverErrors && Object.keys(serverErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...serverErrors }));
    }
  }, [serverErrors]);

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.item_name.trim()) {
      newErrors.item_name = 'Item name is required.';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required.';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required.';
    }

    if (!formData.status) {
      newErrors.status = 'Status is required.';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required.';
    }

    if (!formData.date_lost_found) {
      newErrors.date_lost_found = 'Date is required.';
    }

    if (!formData.reported_by.trim()) {
      newErrors.reported_by = 'Student name is required.';
    }

    // Email validation
    const email = formData.student_email.trim();
    if (!email) {
      newErrors.student_email = 'Student email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.student_email = 'Please enter a valid email address.';
    }

    // Phone validation (7 to 15 digits)
    const phone = formData.phone.trim().replace(/[\s\-\(\)\+]/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    } else if (!/^\d{7,15}$/.test(phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
    if (name === 'image_url') {
      setImagePreviewError(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Banner indicating mode */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-200">
        <div className="flex items-center gap-2">
          {formData.status === 'Lost' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
              <HelpCircle className="w-3.5 h-3.5" /> Reporting Lost Belonging
            </span>
          ) : formData.status === 'Found' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> Reporting Found Belonging
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              <CheckCircle2 className="w-3.5 h-3.5" /> Status: Returned
            </span>
          )}
        </div>
        <span className="text-xs text-stone-500 font-medium">* Required fields</span>
      </div>

      {/* Item Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Item Name */}
        <div className="md:col-span-2">
          <label htmlFor="item_name" className="block text-sm font-semibold text-stone-900 mb-1">
            Item Name *
          </label>
          <input
            type="text"
            id="item_name"
            name="item_name"
            value={formData.item_name}
            onChange={handleChange}
            placeholder="e.g. Sony Wireless Earbuds, Black Leather Wallet, Student ID Card"
            className={`w-full px-4 py-2.5 rounded-lg border text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 transition-all ${
              errors.item_name
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                : 'border-stone-300 focus:border-stone-900 focus:ring-stone-200 bg-white'
            }`}
          />
          {errors.item_name && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.item_name}
            </p>
          )}
        </div>

        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-stone-900 mb-1">
            Category *
          </label>
          <div className="relative">
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-stone-300 bg-white text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-900"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <Tag className="w-4 h-4 text-stone-400 absolute right-3 top-3 pointer-events-none" />
          </div>
          {errors.category && (
            <p className="mt-1 text-xs text-red-600">{errors.category}</p>
          )}
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status" className="block text-sm font-semibold text-stone-900 mb-1">
            Status *
          </label>
          {forcedStatus ? (
            <div className="w-full px-4 py-2.5 rounded-lg border border-stone-200 bg-stone-100 text-sm font-semibold text-stone-700 flex items-center justify-between">
              <span>{formData.status}</span>
              <span className="text-xs text-stone-400">(Auto-assigned)</span>
            </div>
          ) : (
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-lg border border-stone-300 bg-white text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-900"
            >
              {STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          )}
          {errors.status && (
            <p className="mt-1 text-xs text-red-600">{errors.status}</p>
          )}
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-semibold text-stone-900 mb-1">
            Campus Location *
          </label>
          <div className="relative">
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Central Library 2nd Floor, Canteen Table 8, Classroom 302"
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 transition-all ${
                errors.location
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                  : 'border-stone-300 focus:border-stone-900 focus:ring-stone-200 bg-white'
              }`}
            />
            <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          </div>
          {errors.location && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.location}
            </p>
          )}
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date_lost_found" className="block text-sm font-semibold text-stone-900 mb-1">
            {formData.status === 'Lost' ? 'Date Lost *' : formData.status === 'Found' ? 'Date Found *' : 'Date Lost / Found *'}
          </label>
          <div className="relative">
            <input
              type="date"
              id="date_lost_found"
              name="date_lost_found"
              value={formData.date_lost_found}
              onChange={handleChange}
              max={today}
              className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm text-stone-900 focus:outline-none focus:ring-2 transition-all ${
                errors.date_lost_found
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                  : 'border-stone-300 focus:border-stone-900 focus:ring-stone-200 bg-white'
              }`}
            />
            <Calendar className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
          </div>
          {errors.date_lost_found && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.date_lost_found}
            </p>
          )}
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor="description" className="block text-sm font-semibold text-stone-900 mb-1">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide distinct details, markings, brand name, color, scratches, contents, or circumstances..."
            className={`w-full px-4 py-2.5 rounded-lg border text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 transition-all ${
              errors.description
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/20'
                : 'border-stone-300 focus:border-stone-900 focus:ring-stone-200 bg-white'
            }`}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.description}
            </p>
          )}
        </div>
      </div>

      {/* Reporter Contact Information Section */}
      <div className="pt-4 border-t border-stone-200">
        <h4 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
          <User className="w-4 h-4 text-amber-600" />
          Student / Reporter Information
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Student Name */}
          <div>
            <label htmlFor="reported_by" className="block text-xs font-semibold text-stone-700 mb-1">
              Student Full Name *
            </label>
            <div className="relative">
              <input
                type="text"
                id="reported_by"
                name="reported_by"
                value={formData.reported_by}
                onChange={handleChange}
                placeholder="e.g. Alex Rivera"
                className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 ${
                  errors.reported_by
                    ? 'border-red-300 focus:ring-red-200 bg-red-50/20'
                    : 'border-stone-300 focus:ring-stone-200'
                }`}
              />
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </div>
            {errors.reported_by && (
              <p className="mt-1 text-xs text-red-600">{errors.reported_by}</p>
            )}
          </div>

          {/* Student Email */}
          <div>
            <label htmlFor="student_email" className="block text-xs font-semibold text-stone-700 mb-1">
              College Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                id="student_email"
                name="student_email"
                value={formData.student_email}
                onChange={handleChange}
                placeholder="student@campus.edu"
                className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 ${
                  errors.student_email
                    ? 'border-red-300 focus:ring-red-200 bg-red-50/20'
                    : 'border-stone-300 focus:ring-stone-200'
                }`}
              />
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </div>
            {errors.student_email && (
              <p className="mt-1 text-xs text-red-600">{errors.student_email}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phone" className="block text-xs font-semibold text-stone-700 mb-1">
              Phone Number *
            </label>
            <div className="relative">
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 9876543210"
                className={`w-full pl-9 pr-3 py-2 rounded-lg border text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 ${
                  errors.phone
                    ? 'border-red-300 focus:ring-red-200 bg-red-50/20'
                    : 'border-stone-300 focus:ring-stone-200'
                }`}
              />
              <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            </div>
            {errors.phone && (
              <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Optional Photo URL */}
      <div className="pt-4 border-t border-stone-200">
        <label htmlFor="image_url" className="block text-sm font-semibold text-stone-900 mb-1">
          Item Image URL <span className="text-xs font-normal text-stone-500">(Optional)</span>
        </label>
        <div className="relative">
          <input
            type="url"
            id="image_url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="https://example.com/photo.jpg or Unsplash photo URL"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-stone-300 text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-900 bg-white"
          />
          <ImageIcon className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
        </div>
        <p className="mt-1 text-xs text-stone-500">
          Paste a valid image web address. Leave empty if no photo is available.
        </p>

        {/* Live Image Preview */}
        {formData.image_url && !imagePreviewError && (
          <div className="mt-3 flex items-center gap-3 p-3 rounded-lg bg-stone-50 border border-stone-200">
            <img
              src={formData.image_url}
              alt="Preview"
              referrerPolicy="no-referrer"
              onError={() => setImagePreviewError(true)}
              className="w-16 h-16 rounded-md object-cover border border-stone-300 shrink-0"
            />
            <div className="text-xs text-stone-600">
              <span className="font-semibold text-emerald-700">Image Preview Loaded</span>
              <p className="truncate max-w-sm text-stone-400">{formData.image_url}</p>
            </div>
          </div>
        )}
      </div>

      {/* Form Submission Buttons */}
      <div className="pt-6 border-t border-stone-200 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
        {onCancel && (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onCancel}
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-stone-300 text-sm font-semibold text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
        )}

        <button
          id="btn-submit-form"
          type="submit"
          disabled={isSubmitting}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold text-white shadow-xs transition-all cursor-pointer disabled:opacity-50 ${
            formData.status === 'Lost'
              ? 'bg-red-600 hover:bg-red-700'
              : formData.status === 'Found'
              ? 'bg-emerald-600 hover:bg-emerald-700'
              : 'bg-stone-900 hover:bg-stone-800'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            submitButtonText
          )}
        </button>
      </div>
    </form>
  );
};
