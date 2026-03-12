export type BookingStatus = 'pending' | 'in-progress' | 'done';

export interface Booking {
  id: string;
  customerName: string;
  car: string;
  mods: string[];
  status: BookingStatus;
  date: string;
  totalPrice: number;
  notes?: string;
}

export interface Order {
  id: string;
  customerName: string;
  car: string;
  bodyColor: string;
  finishType: string;
  windowTint: number;
  rimColor: string;
  caliperColor: string;
  mods: string[];
  totalPrice: number;
  date: string;
}
