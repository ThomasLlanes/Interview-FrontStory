import {
  ArrowDownAZ,
  ArrowUpAZ,
  CalendarArrowDown,
  CalendarArrowUp,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type { SortKey, SortState } from "../domain/types";

type SortIconProps = {
  sort: SortState;
  sortKey: SortKey;
};

export function SortIcon({ sort, sortKey }: SortIconProps) {
  const isActive = sort.key === sortKey;
  const isAscending = isActive && sort.direction === "asc";
  const className = `sort-icon ${isActive ? "active" : ""}`;

  if (sortKey === "name") {
    return isAscending ? (
      <ArrowUpAZ aria-hidden="true" className={className} size={16} />
    ) : (
      <ArrowDownAZ aria-hidden="true" className={className} size={16} />
    );
  }

  if (sortKey === "startDate" || sortKey === "endDate") {
    return isAscending ? (
      <CalendarArrowUp aria-hidden="true" className={className} size={16} />
    ) : (
      <CalendarArrowDown aria-hidden="true" className={className} size={16} />
    );
  }

  return isAscending ? (
    <TrendingUp aria-hidden="true" className={className} size={16} />
  ) : (
    <TrendingDown aria-hidden="true" className={className} size={16} />
  );
}
