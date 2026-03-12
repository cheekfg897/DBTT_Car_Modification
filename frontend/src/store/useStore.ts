import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CarCustomization, FinishType } from '../types/customization';
import type { Booking, BookingStatus } from '../types/booking';
import { DEFAULT_CUSTOMIZATION } from '../types/customization';
import { INITIAL_BOOKINGS } from '../data/mockBookings';

export type Role = 'customer' | 'worker' | 'owner';

interface AppState {
  // Role
  role: Role;
  setRole: (role: Role) => void;

  // Car customization
  customization: CarCustomization;
  setBodyColor: (color: string) => void;
  setFinishType: (finish: FinishType) => void;
  setWindowTint: (tint: number) => void;
  setRimColor: (color: string) => void;
  setCaliperColor: (color: string) => void;
  toggleMod: (modId: string) => void;
  resetCustomization: () => void;

  // Bookings (worker)
  bookings: Booking[];
  advanceBookingStatus: (id: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      role: 'customer',
      setRole: (role) => set({ role }),

      customization: DEFAULT_CUSTOMIZATION,
      setBodyColor: (color) =>
        set((state) => ({ customization: { ...state.customization, bodyColor: color } })),
      setFinishType: (finish) =>
        set((state) => ({ customization: { ...state.customization, finishType: finish } })),
      setWindowTint: (tint) =>
        set((state) => ({ customization: { ...state.customization, windowTint: tint } })),
      setRimColor: (color) =>
        set((state) => ({ customization: { ...state.customization, rimColor: color } })),
      setCaliperColor: (color) =>
        set((state) => ({ customization: { ...state.customization, caliperColor: color } })),
      toggleMod: (modId) =>
        set((state) => {
          const mods = state.customization.selectedMods.includes(modId)
            ? state.customization.selectedMods.filter((id) => id !== modId)
            : [...state.customization.selectedMods, modId];
          return { customization: { ...state.customization, selectedMods: mods } };
        }),
      resetCustomization: () => set({ customization: DEFAULT_CUSTOMIZATION }),

      bookings: INITIAL_BOOKINGS,
      advanceBookingStatus: (id) =>
        set((state) => ({
          bookings: state.bookings.map((b) => {
            if (b.id !== id) return b;
            const next: Record<BookingStatus, BookingStatus> = {
              'pending': 'in-progress',
              'in-progress': 'done',
              'done': 'done',
            };
            return { ...b, status: next[b.status] };
          }),
        })),
    }),
    {
      name: 'los-santos-customs-storage',
      partialize: (state) => ({
        customization: state.customization,
        bookings: state.bookings,
        role: state.role,
      }),
    }
  )
);
