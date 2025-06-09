// src/components/PaperFilters.tsx
import { PAPER_SORT_OPTIONS, SORT_ORDER_OPTIONS } from "../../config/constants";
import { SortKey, SortOrder } from "../../types/paper";

interface PaperFiltersProps {
  sortKey: SortKey;
  sortOrder: SortOrder;
  fromYear: number | null;
  toYear: number | null;
  minYear: number;
  maxYear: number;
  onSortKeyChange: (key: SortKey) => void;
  onSortOrderChange: (order: SortOrder) => void;
  onFromYearChange: (year: number) => void;
  onToYearChange: (year: number) => void;
}

export function PaperFilters({
  sortKey,
  sortOrder,
  fromYear,
  toYear,
  minYear,
  maxYear,
  onSortKeyChange,
  onSortOrderChange,
  onFromYearChange,
  onToYearChange,
}: PaperFiltersProps) {
  return (
    <div className="flex items-center gap-4 text-sm pl-2">
      <div className="flex items-center gap-2">
        <span>정렬 기준</span>
        <select
          className="bg-white border border-gray-300 rounded px-2 py-0.5"
          value={sortKey}
          onChange={(e) => onSortKeyChange(e.target.value as SortKey)}
        >
          {PAPER_SORT_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      {/* ... 나머지 필터 UI ... */}
      <div className="flex items-center gap-2">
        <span>정렬 순서</span>
        <select
          className="bg-white border border-gray-300 rounded px-2 py-0.5"
          value={sortOrder}
          onChange={(e) =>
            onSortOrderChange(e.target.value as typeof sortOrder)
          }
        >
          {SORT_ORDER_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center gap-2">
        <span>연도</span>
        <select
          value={fromYear ?? undefined}
          onChange={(e) => onFromYearChange(Number(e.target.value))}
          className="bg-white border border-gray-300 rounded px-2 py-0.5"
        >
          {Array.from(
            { length: maxYear - minYear + 1 },
            (_, i) => minYear + i
          ).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <span>~</span>
        <select
          value={toYear ?? undefined}
          onChange={(e) => onToYearChange(Number(e.target.value))}
          className="bg-white border border-gray-300 rounded px-2 py-0.5"
        >
          {Array.from(
            { length: maxYear - minYear + 1 },
            (_, i) => minYear + i
          ).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
