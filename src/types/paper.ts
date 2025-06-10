export interface Paper {
  paperId: string;
  title: string;
  summary: string;
  abstractText: string;
  pdfUrl: string;
  citationCount: number;
  authors: string[];
  year: number;
  simScore: number;
  s2FieldsOfStudy: string[];
}

export interface PapersProps {
  searchQuery: string;
}

export type SortKey = "simScore" | "citationCount" | "year";
export type SortOrder = "asc" | "desc";
