export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  discount?: number; // percentage
  shipping: 'free' | 'fixed' | 'cod';
  image: string;
  additionalImages?: string[];
  isNew?: boolean;
  isSuspended?: boolean;
}

export interface Category {
  id: string;
  label: string;
  icon?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface DepositOrder {
  id: string; // e.g. "ORD-98234"
  date: string; // e.g. "2023.11.24 (금)"
  depositorName: string;
  amount: number;
  bankName: string;
  status: 'PENDING' | 'PAID' | 'PREPARING' | 'SHIPPED';
  time: string; // e.g. "14:15"
  items: CartItem[];
  shippingAddress: {
    receiver: string;
    phone: string;
    address: string;
  };
  trackingNumber?: string;
}

export type AppView =
  | 'HOME'
  | 'SHOP'
  | 'PRODUCT_DETAIL'
  | 'CART'
  | 'CHECKOUT'
  | 'MYPAGE'
  | 'ORDER_DETAIL'
  | 'ADMIN_LOGIN'
  | 'ADMIN_DASHBOARD'
  | 'ADMIN_DEPOSIT'
  | 'ADMIN_PRODUCT_REG';

export interface SmsLog {
  id: string;
  sender: string;
  receiver: string;
  message: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED';
}

export interface BankAccount {
  bankName: string;
  accountNumber: string;
  holderName: string;
}

export interface Banner {
  imageUrl: string;
  phrase: string;
}


