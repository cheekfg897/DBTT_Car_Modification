export type BookingStatus = 'pending' | 'in-progress' | 'done';

export type LogisticsType = 'self-drive' | 'pickup-dropoff' | 'pickup-rental';

import type { CarCustomization } from './customization';

export interface AppointmentBooking {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  car: string;
  carPlate: string;
  services: string[];
  date: string;
  timeSlot: string;
  logistics: LogisticsType;
  pickupAddress?: string;
  pickupTimePreference?: 'morning' | 'afternoon';
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
  savedDesign?: CarCustomization;
  createdAt: string;
}

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
