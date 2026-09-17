import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Calendar, 
  User, 
  Eye, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  Tag, 
  Image as ImageIcon 
} from 'lucide-react';
import { LostFoundItem } from '../types';
import { CATEGORY_COLORS, STATUS_STYLES } from '../constants';

interface ItemCardProps {
  item: LostFoundItem;
  onDeleteRequest: (item: LostFoundItem) => void;
  onMarkReturned?: (item: LostFoundItem) => void;
  isProcessingReturned?: boolean;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  onDeleteRequest,
  onMarkReturned,
  isProcessingReturned = false,
}) => {
  const [imageError, setImageError] = useState(false);
  const statusStyle = STATUS_STYLES[item.status] || STATUS_STYLES.Lost;
  const categoryStyle = CATEGORY_COLORS[item.category] || CATEGORY_COLORS.Other;

  return (
    <div 
      id={`item-card-${item.id}`}
      className="group bg-white rounded-xl border border-stone-200 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
    >
      <div>
        {/* Card Header Media */}
        <div className="relative h-48 bg-stone-100 overflow-hidden border-b border-stone-100">
          {item.image_url && !imageError ? (
            <img
              src={item.image_url}
              alt={item.item_name}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 gap-2 bg-gradient-to-br from-stone-50 to-stone-100">
              <ImageIcon className="w-10 h-10 stroke-1 text-stone-300" />
              <span className="text-xs font-medium text-stone-400">No Image Provided</span>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${statusStyle.badge} backdrop-blur-xs shadow-xs`}>
              <span className={`w-2 h-2 rounded-full ${statusStyle.dot}`} />
              {item.status}
            </span>
          </div>

          {/* Category Tag */}
          <div className="absolute top-3 right-3">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${categoryStyle.bg} ${categoryStyle.text} border ${categoryStyle.border} shadow-xs`}>
              <Tag className="w-3 h-3" />
              {item.category}
            </span>
          </div>
        </div>

        {/* Card Body Details */}
        <div className="p-5">
          <h3 className="text-lg font-bold text-stone-900 group-hover:text-amber-700 transition-colors line-clamp-1">
            {item.item_name}
          </h3>

          <p className="mt-1.5 text-xs text-stone-600 line-clamp-2 leading-relaxed">
            {item.description}
          </p>

          <div className="mt-4 pt-3 border-t border-stone-100 space-y-2 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span className="truncate font-medium text-stone-700">{item.location}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                <span>{item.date_lost_found}</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-500">
                <User className="w-3.5 h-3.5 text-stone-400" />
                <span className="truncate max-w-[120px]">{item.reported_by}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="px-5 py-3.5 bg-stone-50/80 border-t border-stone-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <Link
            id={`btn-view-${item.id}`}
            to={`/items/${item.id}`}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-white border border-stone-200 hover:bg-stone-100 hover:text-stone-900 transition-colors shadow-2xs"
            title="View full details"
          >
            <Eye className="w-3.5 h-3.5 text-stone-500" />
            View
          </Link>

          <Link
            id={`btn-edit-${item.id}`}
            to={`/items/${item.id}/edit`}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors shadow-2xs"
            title="Edit item details"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-700" />
            Edit
          </Link>

          <button
            id={`btn-delete-${item.id}`}
            type="button"
            onClick={() => onDeleteRequest(item)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors shadow-2xs cursor-pointer"
            title="Delete item"
          >
            <Trash2 className="w-3.5 h-3.5 text-red-600" />
            Delete
          </button>
        </div>

        {item.status !== 'Returned' && onMarkReturned && (
          <button
            id={`btn-return-${item.id}`}
            type="button"
            disabled={isProcessingReturned}
            onClick={() => onMarkReturned(item)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer disabled:opacity-50"
            title="Mark this item as Returned"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Returned</span>
          </button>
        )}
      </div>
    </div>
  );
};
