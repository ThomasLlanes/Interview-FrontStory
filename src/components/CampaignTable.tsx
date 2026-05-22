import { Fragment, FormEvent } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { sortLabels } from "../domain/constants";
import { getProfit } from "../domain/sorting";
import type { Campaign, CampaignFormValues, SortKey, SortState } from "../domain/types";
import { formatCurrency, formatDate, formatNumber } from "../shared/formatters";
import { CampaignEditSheet } from "./CampaignEditSheet";
import { SortIcon } from "./SortIcon";

type CampaignTableProps = {
  campaigns: Campaign[];
  editError: string;
  editingId: string | null;
  editValues: CampaignFormValues;
  sort: SortState;
  onCancelEdit: () => void;
  onDeleteCampaign: (id: string) => void;
  onSaveEdit: (event: FormEvent<HTMLFormElement>) => void;
  onSort: (key: SortKey) => void;
  onStartEditing: (campaign: Campaign) => void;
  onUpdateEditField: (field: keyof CampaignFormValues, value: string) => void;
};

export function CampaignTable({
  campaigns,
  editError,
  editingId,
  editValues,
  sort,
  onCancelEdit,
  onDeleteCampaign,
  onSaveEdit,
  onSort,
  onStartEditing,
  onUpdateEditField,
}: CampaignTableProps) {
  return (
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
              aria-pressed={sort.key === key}
              onClick={() => onSort(key)}
            >
              <SortIcon sort={sort} sortKey={key} />
              {sortLabels[key]}
            </button>
          ))}
        </div>
      </div>

      {campaigns.length ? (
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
              {campaigns.map((campaign) => {
                const profit = getProfit(campaign);
                return (
                  <Fragment key={campaign.id}>
                    <tr className={editingId === campaign.id ? "editing-row" : ""}>
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
                          className="icon-button edit-button"
                          aria-label={`Edit ${campaign.name}`}
                          aria-expanded={editingId === campaign.id}
                          onClick={() => onStartEditing(campaign)}
                        >
                          <Pencil aria-hidden="true" size={17} />
                        </button>
                        <button
                          type="button"
                          className="icon-button"
                          aria-label={`Delete ${campaign.name}`}
                          onClick={() => onDeleteCampaign(campaign.id)}
                        >
                          <Trash2 aria-hidden="true" size={17} />
                        </button>
                      </td>
                    </tr>
                    {editingId === campaign.id && (
                      <CampaignEditSheet
                        campaign={campaign}
                        error={editError}
                        values={editValues}
                        onCancel={onCancelEdit}
                        onSubmit={onSaveEdit}
                        onUpdateField={onUpdateEditField}
                      />
                    )}
                  </Fragment>
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
  );
}
