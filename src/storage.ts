import { seedCampaigns } from "./data";
import type { Campaign } from "./types";

const STORAGE_KEY = "frontstory-campaigns";

const isCampaign = (value: unknown): value is Campaign => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const campaign = value as Record<string, unknown>;
  return (
    typeof campaign.id === "string" &&
    typeof campaign.name === "string" &&
    typeof campaign.startDate === "string" &&
    typeof campaign.endDate === "string" &&
    typeof campaign.clicks === "number" &&
    typeof campaign.cost === "number" &&
    typeof campaign.revenue === "number"
  );
};

export const loadCampaigns = (): Campaign[] => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return seedCampaigns;
    }

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.every(isCampaign) ? parsed : seedCampaigns;
  } catch {
    return seedCampaigns;
  }
};

export const saveCampaigns = (campaigns: Campaign[]) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(campaigns));
};
