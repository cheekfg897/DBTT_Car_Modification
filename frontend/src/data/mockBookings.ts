import type { Booking } from '../types/booking';

export const INITIAL_BOOKINGS: Booking[] = [
  { id: 'BK-001', customerName: 'Alex Chen', car: 'Toyota Supra MK5', mods: ['exhaust-catback', 'spoiler-ducktail'], status: 'pending', date: '2026-03-11', totalPrice: 1400, notes: 'Customer prefers matte finish' },
  { id: 'BK-002', customerName: 'Jordan Lee', car: 'Nissan GTR R35', mods: ['bodykit-widebody', 'exhaust-titanium', 'spoiler-gt'], status: 'pending', date: '2026-03-11', totalPrice: 8600, notes: 'Full build — priority customer' },
  { id: 'BK-003', customerName: 'Sam Rodriguez', car: 'BMW M4', mods: ['hood-carbon', 'sideskirt-carbon'], status: 'pending', date: '2026-03-12', totalPrice: 3400 },
  { id: 'BK-004', customerName: 'Casey Kim', car: 'Toyota Supra MK5', mods: ['exhaust-valved'], status: 'in-progress', date: '2026-03-10', totalPrice: 3200, notes: 'Valved exhaust install in bay 2' },
  { id: 'BK-005', customerName: 'Morgan Tan', car: 'Porsche 911 GT3', mods: ['bodykit-carbon', 'spoiler-swan'], status: 'in-progress', date: '2026-03-10', totalPrice: 10000 },
  { id: 'BK-006', customerName: 'Riley Patel', car: 'Mercedes AMG GT', mods: ['exhaust-titanium', 'hood-vented'], status: 'in-progress', date: '2026-03-09', totalPrice: 3300 },
  { id: 'BK-007', customerName: 'Avery Singh', car: 'Toyota Supra MK5', mods: ['spoiler-ducktail', 'sideskirt-sport'], status: 'done', date: '2026-03-08', totalPrice: 1250 },
  { id: 'BK-008', customerName: 'Drew Williams', car: 'BMW M4', mods: ['bodykit-street', 'exhaust-catback'], status: 'done', date: '2026-03-08', totalPrice: 3500 },
  { id: 'BK-009', customerName: 'Jamie Park', car: 'Nissan GTR R35', mods: ['hood-carbon', 'spoiler-gt', 'exhaust-titanium'], status: 'done', date: '2026-03-07', totalPrice: 5600 },
  { id: 'BK-010', customerName: 'Quinn Davis', car: 'Toyota Supra MK5', mods: ['exhaust-catback', 'spoiler-ducktail', 'sideskirt-sport'], status: 'done', date: '2026-03-07', totalPrice: 2050 },
  { id: 'BK-011', customerName: 'Taylor Wong', car: 'Porsche 911 GT3', mods: ['bodykit-widebody'], status: 'pending', date: '2026-03-12', totalPrice: 5200 },
  { id: 'BK-012', customerName: 'Skyler Nakamura', car: 'Mercedes AMG GT', mods: ['exhaust-valved', 'hood-carbon'], status: 'pending', date: '2026-03-13', totalPrice: 5200 },
  { id: 'BK-013', customerName: 'Reese Thompson', car: 'BMW M4', mods: ['sideskirt-carbon', 'spoiler-swan'], status: 'in-progress', date: '2026-03-10', totalPrice: 3200 },
  { id: 'BK-014', customerName: 'Blake Ishida', car: 'Toyota Supra MK5', mods: ['bodykit-street', 'exhaust-titanium', 'spoiler-gt', 'hood-vented'], status: 'pending', date: '2026-03-14', totalPrice: 7000 },
  { id: 'BK-015', customerName: 'Parker Liu', car: 'Nissan GTR R35', mods: ['exhaust-catback'], status: 'done', date: '2026-03-06', totalPrice: 1000 },
  { id: 'BK-016', customerName: 'Hayden Okonkwo', car: 'Mercedes AMG GT', mods: ['spoiler-gt', 'bodykit-street'], status: 'in-progress', date: '2026-03-09', totalPrice: 3900 },
  { id: 'BK-017', customerName: 'Cameron Reyes', car: 'BMW M4', mods: ['hood-vented', 'exhaust-catback'], status: 'done', date: '2026-03-05', totalPrice: 1900 },
  { id: 'BK-018', customerName: 'Dakota Chu', car: 'Toyota Supra MK5', mods: ['bodykit-carbon'], status: 'pending', date: '2026-03-15', totalPrice: 8200 },
];
