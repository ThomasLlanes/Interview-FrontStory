import { ArrowDown, ArrowDownAZ, ArrowUp, ArrowUpAZ } from "lucide-react";
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

  return isAscending ? (
    <ArrowUp aria-hidden="true" className={className} size={16} />
  ) : (
    <ArrowDown aria-hidden="true" className={className} size={16} />
  );
}
