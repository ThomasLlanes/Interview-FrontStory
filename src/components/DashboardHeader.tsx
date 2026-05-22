import { formatCurrency, formatNumber } from "../shared/formatters";
import { SummaryMetric } from "./SummaryMetric";

type DashboardTotals = {
  clicks: number;
  cost: number;
  revenue: number;
  profit: number;
};

type DashboardHeaderProps = {
  totals: DashboardTotals;
};

export function DashboardHeader({ totals }: DashboardHeaderProps) {
  return (
    <section className="dashboard-heading">
      <div>
        <p className="eyebrow">Campaign management</p>
        <h1>Campaign Cost & Revenue Report</h1>
      </div>
      <div className="summary-grid" aria-label="Campaign totals">
        <SummaryMetric label="Clicks" value={formatNumber(totals.clicks)} />
        <SummaryMetric label="Cost" value={formatCurrency(totals.cost)} />
        <SummaryMetric label="Revenue" value={formatCurrency(totals.revenue)} />
        <SummaryMetric
          label="Profit"
          value={formatCurrency(totals.profit)}
          tone={totals.profit >= 0 ? "positive" : "negative"}
        />
      </div>
    </section>
  );
}
