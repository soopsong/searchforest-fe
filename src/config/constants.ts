export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://52.78.34.56:9090";

export const PAPER_SORT_OPTIONS = [
  { value: "simScore", label: "유사도" },
  { value: "citationCount", label: "인용수" },
  { value: "year", label: "연도" },
] as const;

export const SORT_ORDER_OPTIONS = [
  { value: "desc", label: "내림차순" },
  { value: "asc", label: "오름차순" },
] as const;
