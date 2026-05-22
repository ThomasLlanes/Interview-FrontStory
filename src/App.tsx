import { FormEvent, useEffect, useMemo, useState } from "react";
import { CampaignForm } from "./presentation/CampaignForm";
import { CampaignTable } from "./presentation/CampaignTable";
import { DashboardHeader } from "./presentation/DashboardHeader";
import { emptyCampaignForm } from "./components/constants";
import { loadCampaigns, saveCampaigns } from "./components/storage";
import { getProfit, sortCampaigns } from "./components/sorting";
import type { Campaign, CampaignFormValues, SortKey, SortState } from "./models/types";
import { validateCampaign } from "./components/validation";

function App() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => loadCampaigns());
  const [formValues, setFormValues] = useState<CampaignFormValues>(emptyCampaignForm);
  const [hasEndDate, setHasEndDate] = useState(true);
  const [formError, setFormError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<CampaignFormValues>(emptyCampaignForm);
  const [editError, setEditError] = useState("");
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

  const updateCampaignField = (
    field: keyof CampaignFormValues,
    value: string,
  ) => {
    setFormError("");
    setFormValues((current) => ({
      ...current,
      [field]: parseCampaignFieldValue(field, value),
    }));
  };

  const handleEndDateToggle = (nextHasEndDate: boolean) => {
    setHasEndDate(nextHasEndDate);
    if (!nextHasEndDate) {
      updateCampaignField("endDate", "");
    }
  };

  const addCampaign = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const error = validateCampaign(formValues, { requiresEndDate: hasEndDate });
    if (error) {
      setFormError(error);
      return;
    }

    setCampaigns((current) => [
      ...current,
      {
        ...formValues,
        id: crypto.randomUUID(),
        endDate: hasEndDate ? formValues.endDate : "",
        name: formValues.name.trim(),
      },
    ]);
    setFormValues(emptyCampaignForm);
    setHasEndDate(true);
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
    if (editingId === id) {
      closeEditSheet();
    }
  };

  const startEditing = (campaign: Campaign) => {
    setEditingId((current) => (current === campaign.id ? null : campaign.id));
    setEditValues({
      name: campaign.name,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      clicks: campaign.clicks,
      cost: campaign.cost,
      revenue: campaign.revenue,
    });
    setEditError("");
  };

  const updateEditField = (field: keyof CampaignFormValues, value: string) => {
    setEditError("");
    setEditValues((current) => ({
      ...current,
      [field]: parseCampaignFieldValue(field, value),
    }));
  };

  const saveEdit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const error = validateCampaign(editValues, {
      requiresEndDate: Boolean(editValues.endDate),
    });
    if (error) {
      setEditError(error);
      return;
    }

    setCampaigns((current) =>
      current.map((campaign) =>
        campaign.id === editingId
          ? {
              ...campaign,
              ...editValues,
              name: editValues.name.trim(),
            }
          : campaign,
      ),
    );
    closeEditSheet();
  };

  const closeEditSheet = () => {
    setEditingId(null);
    setEditError("");
  };

  return (
    <main className="app-shell">
      <DashboardHeader totals={totals} />

      <section className="workspace">
        <CampaignForm
          error={formError}
          hasEndDate={hasEndDate}
          values={formValues}
          onSubmit={addCampaign}
          onToggleEndDate={handleEndDateToggle}
          onUpdateField={updateCampaignField}
        />

        <CampaignTable
          campaigns={sortedCampaigns}
          editError={editError}
          editingId={editingId}
          editValues={editValues}
          sort={sort}
          onCancelEdit={closeEditSheet}
          onDeleteCampaign={deleteCampaign}
          onSaveEdit={saveEdit}
          onSort={handleSort}
          onStartEditing={startEditing}
          onUpdateEditField={updateEditField}
        />
      </section>
    </main>
  );
}

const parseCampaignFieldValue = (
  field: keyof CampaignFormValues,
  value: string,
) => (field === "clicks" || field === "cost" || field === "revenue" ? Number(value) : value);

export default App;
