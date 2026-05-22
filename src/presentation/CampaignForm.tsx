import { Plus } from "lucide-react";
import { FormEvent } from "react";
import type { CampaignFormValues } from "../models/types";

type CampaignFormProps = {
  error: string;
  hasEndDate: boolean;
  values: CampaignFormValues;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onToggleEndDate: (hasEndDate: boolean) => void;
  onUpdateField: (field: keyof CampaignFormValues, value: string) => void;
};

export function CampaignForm({
  error,
  hasEndDate,
  values,
  onSubmit,
  onToggleEndDate,
  onUpdateField,
}: CampaignFormProps) {
  return (
    <form className="campaign-form" onSubmit={onSubmit} noValidate>
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
          value={values.name}
          onChange={(event) => onUpdateField("name", event.target.value)}
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
            value={values.startDate}
            onChange={(event) => onUpdateField("startDate", event.target.value)}
          />
        </label>
        <label>
          End date
          <input
            id="campaign-end-date"
            name="endDate"
            type="date"
            required={hasEndDate}
            disabled={!hasEndDate}
            value={values.endDate}
            onChange={(event) => onUpdateField("endDate", event.target.value)}
          />
        </label>
      </div>

      <label className="checkbox-field">
        <input
          type="checkbox"
          checked={!hasEndDate}
          onChange={(event) => onToggleEndDate(!event.target.checked)}
        />
        Campaign is still running
      </label>

      <div className="field-row">
        <label>
          Clicks
          <input
            id="campaign-clicks"
            name="clicks"
            type="number"
            min="0"
            required
            value={values.clicks}
            onChange={(event) => onUpdateField("clicks", event.target.value)}
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
            value={values.cost}
            onChange={(event) => onUpdateField("cost", event.target.value)}
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
            value={values.revenue}
            onChange={(event) => onUpdateField("revenue", event.target.value)}
          />
        </label>
      </div>

      {error && <p className="form-error">{error}</p>}

      <button type="submit" className="primary-action">
        <Plus aria-hidden="true" size={18} />
        Add campaign
      </button>
    </form>
  );
}
