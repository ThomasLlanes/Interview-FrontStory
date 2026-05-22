import type { Campaign } from "../models/types";

export const seedCampaigns: Campaign[] = [
  {
    id: "camp-001",
    name: "Spring Launch",
    startDate: "2026-03-01",
    endDate: "2026-03-31",
    clicks: 18420,
    cost: 12450,
    revenue: 18980,
  },
  {
    id: "camp-002",
    name: "Creator Retargeting",
    startDate: "2026-04-05",
    endDate: "2026-04-26",
    clicks: 9210,
    cost: 6820,
    revenue: 10275,
  },
  {
    id: "camp-003",
    name: "Enterprise Awareness",
    startDate: "2026-05-01",
    endDate: "2026-05-20",
    clicks: 12680,
    cost: 15750,
    revenue: 14610,
  },
];
