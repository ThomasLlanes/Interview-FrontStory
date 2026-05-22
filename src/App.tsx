import { ArrowDownAZ, ArrowDownWideNarrow, Plus, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { formatCurrency, formatDate, formatNumber } from "./formatters";
import { loadCampaigns, saveCampaigns } from "./storage";
import { getProfit, sortCampaigns } from "./sorting";
import type { Campaign, CampaignFormValues, SortKey, SortState } from "./types";

const emptyForm: CampaignFormValues = {
  name: "",
  startDate: "",
  endDate: "",
  clicks: 0,
  cost: 0,
  revenue: 0,
};

const sortLabels: Record<SortKey, string> = {
  name: "Name",
  startDate: "Start date",
  endDate: "End date",
  profit: "Profit",
};

function App() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => loadCampaigns());
  const [formValues, setFormValues] = useState<CampaignFormValues>(emptyForm);
  const [formError, setFormError] = useState("");
  const [sort, setSort] = useState<SortState>({ key: "profit", direction: "desc" });

  useEffect(() => {
    saveCampaigns(campaigns);
  }, [campaigns]);

  const sortedCampaigns = useMemo(
    () => sortCampaigns(campaigns, sort),
    [campaigns, sort],
  );

  const totals = useMemo(
    () =>
      campaigns.reduce(
        (summary, campaign) => ({
          clicks: summary.clicks + campaign.clicks,
          cost: summary.cost + campaign.cost,
          revenue: summary.revenue + campaign.revenue,
          profit: summary.profit + getProfit(campaign),
        }),
        { clicks: 0, cost: 0, revenue: 0, profit: 0 },
      ),
    [campaigns],
  );

  const updateField = (field: keyof CampaignFormValues, value: string) => {
    setFormError("");
    setFormValues((current) => ({
      ...current,
      [field]:
        field === "clicks" || field === "cost" || field === "revenue"
          ? Number(value)
          : value,
    }));
  };

  const validateForm = () => {
    if (!formValues.name.trim()) {
      return "Campaign name is required.";
    }

    if (!formValues.startDate || !formValues.endDate) {
      return "Start and end dates are required.";
    }

    if (formValues.endDate < formValues.startDate) {
      return "End date must be after the start date.";
    }

    if (
      formValues.clicks < 0 ||
      formValues.cost < 0 ||
      formValues.revenue < 0
    ) {
      return "Clicks, cost, and revenue cannot be negative.";
    }

    return "";
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const error = validateForm();
    if (error) {
      setFormError(error);
      return;
    }

    setCampaigns((current) => [
      ...current,
      {
        ...formValues,
        id: crypto.randomUUID(),
        name: formValues.name.trim(),
      },
    ]);
    setFormValues(emptyForm);
  };

  const handleSort = (key: SortKey) => {
    setSort((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const deleteCampaign = (id: string) => {
    setCampaigns((current) => current.filter((campaign) => campaign.id !== id));
  };

  return (
    <main className="app-shell">
      <section className="dashboard-heading">
        <div>
          <p className="eyebrow">Campaign management</p>
          <h1>Campaign Cost & Revenue Report</h1>
        </div>
        <div className="summary-grid" aria-label="Campaign totals">
          <SummaryMetric label="Clicks" value={formatNumber(totals.clicks)} />
          <SummaryMetric label="Cost" value={formatCurrency(totals.cost)} />
          <SummaryMetric label="Revenue" value={formatCurrency(totals.revenue)} />
          <SummaryMetric label="Profit" value={formatCurrency(totals.profit)} tone={totals.profit >= 0 ? "positive" : "negative"} />
        </div>
      </section>

      <section className="workspace">
        <form className="campaign-form" onSubmit={handleSubmit} noValidate>
          <div className="form-heading">
            <Plus aria-hidden="true" size={20} />
            <h2>Add campaign</h2>
          </div>

          <label>
            Campaign name
            <input
              id="campaign-name"
              name="name"
              required
              value={formValues.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="Q3 acquisition push"
            />
          </label>

          <div className="field-row">
            <label>
              Start date
              <input
                id="campaign-start-date"
                name="startDate"
                type="date"
                required
                value={formValues.startDate}
                onChange={(event) => updateField("startDate", event.target.value)}
              />
            </label>
            <label>
              End date
              <input
                id="campaign-end-date"
                name="endDate"
                type="date"
                required
                value={formValues.endDate}
                onChange={(event) => updateField("endDate", event.target.value)}
              />
            </label>
          </div>

          <div className="field-row">
            <label>
              Clicks
              <input
                id="campaign-clicks"
                name="clicks"
                type="number"
                min="0"
                required
                value={formValues.clicks}
                onChange={(event) => updateField("clicks", event.target.value)}
              />
            </label>
            <label>
              Cost
              <input
                id="campaign-cost"
                name="cost"
                type="number"
                min="0"
                step="0.01"
                required
                value={formValues.cost}
                onChange={(event) => updateField("cost", event.target.value)}
              />
            </label>
            <label>
              Revenue
              <input
                id="campaign-revenue"
                name="revenue"
                type="number"
                min="0"
                step="0.01"
                required
                value={formValues.revenue}
                onChange={(event) => updateField("revenue", event.target.value)}
              />
            </label>
          </div>

          {formError && <p className="form-error">{formError}</p>}

          <button type="submit" className="primary-action">
            <Plus aria-hidden="true" size={18} />
            Add campaign
          </button>
        </form>

        <section className="table-panel" aria-labelledby="campaign-table-title">
          <div className="table-toolbar">
            <div>
              <h2 id="campaign-table-title">Campaigns</h2>
              <p>{campaigns.length} active report rows</p>
            </div>
            <div className="sort-actions" aria-label="Sort campaigns">
              {(Object.keys(sortLabels) as SortKey[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  className={sort.key === key ? "sort-button active" : "sort-button"}
                  onClick={() => handleSort(key)}
                >
                  {key === "name" ? (
                    <ArrowDownAZ aria-hidden="true" size={16} />
                  ) : (
                    <ArrowDownWideNarrow aria-hidden="true" size={16} />
                  )}
                  {sortLabels[key]}
                </button>
              ))}
            </div>
          </div>

          {sortedCampaigns.length ? (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Start</th>
                    <th>End</th>
                    <th className="numeric">Clicks</th>
                    <th className="numeric">Cost</th>
                    <th className="numeric">Revenue</th>
                    <th className="numeric">Profit</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {sortedCampaigns.map((campaign) => {
                    const profit = getProfit(campaign);
                    return (
                      <tr key={campaign.id}>
                        <td className="campaign-name">{campaign.name}</td>
                        <td>{formatDate(campaign.startDate)}</td>
                        <td>{formatDate(campaign.endDate)}</td>
                        <td className="numeric">{formatNumber(campaign.clicks)}</td>
                        <td className="numeric">{formatCurrency(campaign.cost)}</td>
                        <td className="numeric">{formatCurrency(campaign.revenue)}</td>
                        <td className={profit >= 0 ? "numeric profit-positive" : "numeric profit-negative"}>
                          {formatCurrency(profit)}
                        </td>
                        <td className="action-cell">
                          <button
                            type="button"
                            className="icon-button"
                            aria-label={`Delete ${campaign.name}`}
                            onClick={() => deleteCampaign(campaign.id)}
                          >
                            <Trash2 aria-hidden="true" size={17} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <h3>No campaigns yet</h3>
              <p>Add a campaign to start tracking cost, revenue, and profit.</p>
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

type SummaryMetricProps = {
  label: string;
  value: string;
  tone?: "positive" | "negative";
};

function SummaryMetric({ label, value, tone }: SummaryMetricProps) {
  return (
    <article className={`summary-card ${tone ?? ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

export default App;
