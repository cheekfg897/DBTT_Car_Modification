import { DashboardStats } from '../components/owner/DashboardStats';
import { RevenueChart } from '../components/owner/RevenueChart';
import { ServiceBreakdown } from '../components/owner/ServiceBreakdown';
import { TrendInsights } from '../components/owner/TrendInsights';
import { SupplyAlerts } from '../components/owner/SupplyAlerts';

export function OwnerPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white">Business Dashboard</h1>
      <DashboardStats />
      <div className="grid grid-cols-2 gap-6">
        <RevenueChart />
        <ServiceBreakdown />
      </div>
      <TrendInsights />
      <SupplyAlerts />
    </div>
  );
}
