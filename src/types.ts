export type ItemCategory = 
  | 'Electronics'
  | 'Books'
  | 'ID Card'
  | 'Wallet'
  | 'Keys'
  | 'Clothing'
  | 'Accessories'
  | 'Documents'
  | 'Other';

export type ItemStatus = 'Lost' | 'Found' | 'Returned';

export interface LostFoundItem {
  id: number;
  item_name: string;
  description: string;
  category: ItemCategory;
  status: ItemStatus;
  location: string;
  date_lost_found: string;
  reported_by: string;
  student_email: string;
  phone: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface ItemFormData {
  item_name: string;
  description: string;
  category: ItemCategory;
  status: ItemStatus;
  location: string;
  date_lost_found: string;
  reported_by: string;
  student_email: string;
  phone: string;
  image_url?: string;
}

export interface DashboardStats {
  total: number;
  lost: number;
  found: number;
  returned: number;
  by_category: Record<string, number>;
}

export interface ValidationErrors {
  [key: string]: string;
}
