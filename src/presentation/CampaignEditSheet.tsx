import { Save, X } from "lucide-react";
import { FormEvent } from "react";
import type { Campaign, CampaignFormValues } from "../models/types";

type CampaignEditSheetProps = {
  campaign: Campaign;
  error: string;
  values: CampaignFormValues;
  onCancel: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onUpdateField: (field: keyof CampaignFormValues, value: string) => void;
};

export function CampaignEditSheet({
  campaign,
  error,
  values,
  onCancel,
  onSubmit,
  onUpdateField,
}: CampaignEditSheetProps) {
  return (
    <tr className="detail-row">
      <td colSpan={8}>
        <form className="edit-sheet" onSubmit={onSubmit}>
          <div className="edit-sheet-heading">
            <div>
              <h3>Edit campaign details</h3>
              <p>Changes update the table and saved campaign data.</p>
            </div>
            <button type="button" className="ghost-action" onClick={onCancel}>
              <X aria-hidden="true" size={17} />
              Close
            </button>
          </div>

          <div className="edit-grid">
            <label>
              Campaign name
              <input
                name="editName"
                required
                value={values.name}
                onChange={(event) => onUpdateField("name", event.target.value)}
              />
            </label>
            <label>
              Start date
              <input
                name="editStartDate"
                type="date"
                required
                value={values.startDate}
                onChange={(event) => onUpdateField("startDate", event.target.value)}
              />
            </label>
            <label>
              End date
              <input
                name="editEndDate"
                type="date"
                disabled={!values.endDate}
                value={values.endDate}
                onChange={(event) => onUpdateField("endDate", event.target.value)}
              />
            </label>
            <label>
              Clicks
              <input
                name="editClicks"
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
                name="editCost"
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
                name="editRevenue"
                type="number"
                min="0"
                step="0.01"
                required
                value={values.revenue}
                onChange={(event) => onUpdateField("revenue", event.target.value)}
              />
            </label>
          </div>

          <label className="checkbox-field">
            <input
              type="checkbox"
              checked={!values.endDate}
              onChange={(event) =>
                onUpdateField(
                  "endDate",
                  event.target.checked ? "" : campaign.endDate || campaign.startDate,
                )
              }
            />
            Campaign is still running
          </label>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="primary-action sheet-action">
            <Save aria-hidden="true" size={18} />
            Save changes
          </button>
        </form>
      </td>
    </tr>
  );
}
