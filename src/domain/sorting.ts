import type { Campaign, SortState } from "./types";

export const getProfit = (campaign: Campaign) => campaign.revenue - campaign.cost;

export const sortCampaigns = (campaigns: Campaign[], sort: SortState) => {
  const direction = sort.direction === "asc" ? 1 : -1;

  return [...campaigns].sort((a, b) => {
    if (sort.key === "profit") {
      return (getProfit(a) - getProfit(b)) * direction;
    }

    if (sort.key === "name") {
      return a.name.localeCompare(b.name) * direction;
    }

    const dateA = a[sort.key] ? new Date(a[sort.key]).getTime() : Infinity;
    const dateB = b[sort.key] ? new Date(b[sort.key]).getTime() : Infinity;

    return (dateA - dateB) * direction;
  });
};
