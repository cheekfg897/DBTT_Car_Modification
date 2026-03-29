import { MOCK_ORDERS } from '../data/mockOrders';
import { getMod, getColor } from '../utils/dataLookup';

export interface ComboInsight {
  modA: string;
  modB: string;
  frequency: number;
  label: string;
}

export interface TrendInsight {
  title: string;
  description: string;
  change: number;
  type: 'up' | 'down';
}


export interface MonthlyRevenue {
  month: string;
  revenue: number;
}

export interface CategoryBreakdown {
  name: string;
  value: number;
}

export function getPopularCombos(): ComboInsight[] {
  const pairCounts = new Map<string, number>();
  const orders = MOCK_ORDERS;

  for (const order of orders) {
    for (let i = 0; i < order.mods.length; i++) {
      for (let j = i + 1; j < order.mods.length; j++) {
        const key = [order.mods[i], order.mods[j]].sort().join('|');
        pairCounts.set(key, (pairCounts.get(key) || 0) + 1);
      }
    }
  }

  const combos: ComboInsight[] = [];
  for (const [key, count] of pairCounts) {
    const [a, b] = key.split('|');
    const modA = getMod(a);
    const modB = getMod(b);
    if (modA && modB && count >= 3) {
      const freq = Math.round((count / orders.length) * 100);
      combos.push({
        modA: modA.name,
        modB: modB.name,
        frequency: freq,
        label: `${modA.name} + ${modB.name} booked together ${freq}% of the time`,
      });
    }
  }

  return combos.sort((a, b) => b.frequency - a.frequency).slice(0, 5);
}

export function getMonthlyRevenue(): MonthlyRevenue[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const revenueByMonth = new Map<string, number>();

  for (const month of months) revenueByMonth.set(month, 0);

  for (const order of MOCK_ORDERS) {
    const monthIdx = parseInt(order.date.split('-')[1]) - 1;
    if (monthIdx >= 0 && monthIdx < months.length) {
      const month = months[monthIdx];
      revenueByMonth.set(month, (revenueByMonth.get(month) || 0) + order.totalPrice);
    }
  }

  return months.map((month) => ({
    month,
    revenue: revenueByMonth.get(month) || 0,
  }));
}

export function getCategoryBreakdown(): CategoryBreakdown[] {
  const categories = new Map<string, number>();

  for (const order of MOCK_ORDERS) {
    // Base services
    categories.set('Respray', (categories.get('Respray') || 0) + 150);
    categories.set('Window Tint', (categories.get('Window Tint') || 0) + 100);
    categories.set('Rim Color', (categories.get('Rim Color') || 0) + 200);
    categories.set('Caliper Color', (categories.get('Caliper Color') || 0) + 100);

    for (const modId of order.mods) {
      const mod = getMod(modId);
      if (mod) {
        const cat = mod.category.charAt(0).toUpperCase() + mod.category.slice(1);
        categories.set(cat, (categories.get(cat) || 0) + mod.price);
      }
    }
  }

  return Array.from(categories.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function getTrendInsights(): TrendInsight[] {
  const insights: TrendInsight[] = [];

  // Color trends: compare month 5+6 vs month 3+4
  const recentOrders = MOCK_ORDERS.filter((o) => {
    const m = parseInt(o.date.split('-')[1]);
    return m >= 4;
  });
  const olderOrders = MOCK_ORDERS.filter((o) => {
    const m = parseInt(o.date.split('-')[1]);
    return m <= 3;
  });

  const recentColorCounts = new Map<string, number>();
  const olderColorCounts = new Map<string, number>();
  for (const o of recentOrders) recentColorCounts.set(o.bodyColor, (recentColorCounts.get(o.bodyColor) || 0) + 1);
  for (const o of olderOrders) olderColorCounts.set(o.bodyColor, (olderColorCounts.get(o.bodyColor) || 0) + 1);

  for (const [color, recentCount] of recentColorCounts) {
    const olderCount = olderColorCounts.get(color) || 1;
    const change = Math.round(((recentCount - olderCount) / olderCount) * 100);
    if (Math.abs(change) >= 20) {
      const preset = getColor(color);
      const name = preset?.name || color;
      insights.push({
        title: `${name} ${change > 0 ? 'Rising' : 'Declining'}`,
        description: `${name} requests ${change > 0 ? 'up' : 'down'} ${Math.abs(change)}% compared to earlier months`,
        change,
        type: change > 0 ? 'up' : 'down',
      });
    }
  }

  // Finish trends
  const recentFinish = new Map<string, number>();
  const olderFinish = new Map<string, number>();
  for (const o of recentOrders) recentFinish.set(o.finishType, (recentFinish.get(o.finishType) || 0) + 1);
  for (const o of olderOrders) olderFinish.set(o.finishType, (olderFinish.get(o.finishType) || 0) + 1);

  for (const [finish, recentCount] of recentFinish) {
    const olderCount = olderFinish.get(finish) || 1;
    const change = Math.round(((recentCount - olderCount) / olderCount) * 100);
    if (Math.abs(change) >= 20) {
      insights.push({
        title: `${finish.charAt(0).toUpperCase() + finish.slice(1)} Finish ${change > 0 ? 'Trending Up' : 'Cooling Off'}`,
        description: `${finish} finish orders ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(change)}%`,
        change,
        type: change > 0 ? 'up' : 'down',
      });
    }
  }

  return insights.sort((a, b) => Math.abs(b.change) - Math.abs(a.change)).slice(0, 6);
}


export function getKPIStats() {
  const totalRevenue = MOCK_ORDERS.reduce((sum, o) => sum + o.totalPrice, 0);
  const thisMonth = MOCK_ORDERS.filter((o) => o.date.startsWith('2026-03'));
  const ordersThisMonth = thisMonth.length;
  const avgOrderValue = Math.round(totalRevenue / MOCK_ORDERS.length);

  const modCounts = new Map<string, number>();
  for (const o of MOCK_ORDERS) {
    for (const m of o.mods) {
      modCounts.set(m, (modCounts.get(m) || 0) + 1);
    }
  }
  let topModId = '';
  let topCount = 0;
  for (const [id, count] of modCounts) {
    if (count > topCount) { topModId = id; topCount = count; }
  }
  const topService = getMod(topModId)?.name || 'N/A';

  return { totalRevenue, ordersThisMonth, avgOrderValue, topService };
}
