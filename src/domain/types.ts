export type Campaign = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  clicks: number;
  cost: number;
  revenue: number;
};

export type CampaignFormValues = Omit<Campaign, "id">;

export type SortKey = "name" | "startDate" | "endDate" | "profit";

export type SortDirection = "asc" | "desc";

export type SortState = {
  key: SortKey;
  direction: SortDirection;
};
