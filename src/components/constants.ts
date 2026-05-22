import type { CampaignFormValues, SortKey } from "../models/types";

export const emptyCampaignForm: CampaignFormValues = {
  name: "",
  startDate: "",
  endDate: "",
  clicks: 0,
  cost: 0,
  revenue: 0,
};

export const sortLabels: Record<SortKey, string> = {
  name: "Name",
  startDate: "Start date",
  endDate: "End date",
  profit: "Profit",
};
