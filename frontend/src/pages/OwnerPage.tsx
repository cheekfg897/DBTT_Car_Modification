import { DashboardStats }       from '../components/owner/DashboardStats';
import { LiveBookingsKPIs }    from '../components/owner/LiveBookingsKPIs';
import { UpliftKPIs }           from '../components/owner/UpliftKPIs';
import { ProjectionChart }      from '../components/owner/ProjectionChart';
import { RevenueChart }         from '../components/owner/RevenueChart';
import { ServiceBreakdown }     from '../components/owner/ServiceBreakdown';
import { AOVByService }         from '../components/owner/AOVByService';
import { BudgetBandCard }       from '../components/owner/BudgetBandCard';
import { CrossSellPanel }       from '../components/owner/CrossSellPanel';
import { StylePreferenceChart } from '../components/owner/StylePreferenceChart';
import { PopularCombos }        from '../components/worker/PopularCombos';
import { TrendInsights }        from '../components/owner/TrendInsights';
import { SupplyAlerts }         from '../components/owner/SupplyAlerts';

export function OwnerPage() {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-white tracking-wide" style={{ fontFamily: "'Russo One', sans-serif" }}>
        Business Dashboard
      </h1>

      {/* Operational KPIs */}
      <DashboardStats />

      {/* Live bookings from the booking system */}
      <LiveBookingsKPIs />

      {/* Digital transformation projection KPIs */}
      <UpliftKPIs />

      {/* Revenue projection: historical + baseline vs digital */}
      <ProjectionChart />

      {/* Monthly revenue + service category breakdown */}
      <div className="grid grid-cols-2 gap-6">
        <RevenueChart />
        <ServiceBreakdown />
      </div>

      {/* AOV by service + budget band distribution */}
      <div className="grid grid-cols-2 gap-6">
        <AOVByService />
        <BudgetBandCard />
      </div>

      {/* Cross-sell rules + popular bundles + style preferences */}
      <div className="grid grid-cols-3 gap-6">
        <CrossSellPanel />
        <PopularCombos />
        <StylePreferenceChart />
      </div>

      {/* Color/finish trends + inventory alerts */}
      <TrendInsights />
      <SupplyAlerts />
    </div>
  );
}
