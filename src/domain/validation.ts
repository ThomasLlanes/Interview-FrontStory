import type { CampaignFormValues } from "./types";

export const validateCampaign = (
  values: CampaignFormValues,
  options: { requiresEndDate: boolean },
) => {
  if (!values.name.trim()) {
    return "Campaign name is required.";
  }

  if (!values.startDate) {
    return "Start date is required.";
  }

  if (options.requiresEndDate && !values.endDate) {
    return "End date is required unless the campaign is still running.";
  }

  if (values.endDate && values.endDate <= values.startDate) {
    return "End date must be after the start date.";
  }

  if (values.clicks < 0 || values.cost < 0 || values.revenue < 0) {
    return "Clicks, cost, and revenue cannot be negative.";
  }

  return "";
};
