import { useEffect, useState, useMemo } from "react";
import { PapersProps, SortKey, SortOrder } from "../types/paper";
import { usePapers } from "../hooks/usePapers";
import { usePaperClick } from "../hooks/usePaperClick";
import { PaperCard } from "../components/papers/PaperCard";
import { PaperFilters } from "../components/papers/PaperFilters";

export default function SPapers({ searchQuery }: PapersProps) {
  const { papers, isLoading, error } = usePapers(searchQuery);

  const [expandedAbstracts, setExpandedAbstracts] = useState<Set<string>>(
    new Set()
  );
  const [sortKey, setSortKey] = useState<SortKey>("simScore");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [fromYear, setFromYear] = useState<number | null>(null);
  const [toYear, setToYear] = useState<number | null>(null);
  const { handlePaperClick } = usePaperClick();

  const minAvailableYear = useMemo(
    () => Math.min(...papers.map((p) => p.year)),
    [papers]
  );
  const maxAvailableYear = useMemo(
    () => Math.max(...papers.map((p) => p.year)),
    [papers]
  );

  useEffect(() => {
    if (papers.length > 0) {
      setFromYear(minAvailableYear);
      setToYear(maxAvailableYear);
    }
  }, [papers, minAvailableYear, maxAvailableYear]);

  const sortedPapers = useMemo(() => {
    return [...papers].sort((a, b) => {
      const valueA = a[sortKey];
      const valueB = b[sortKey];
      if (sortOrder === "asc") {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });
  }, [papers, sortKey, sortOrder]);

  const filteredPapers = useMemo(() => {
    return sortedPapers.filter((p) => {
      if (fromYear !== null && p.year < fromYear) return false;
      if (toYear !== null && p.year > toYear) return false;
      return true;
    });
  }, [sortedPapers, fromYear, toYear]);

  const toggleAbstract = (paperId: string) => {
    setExpandedAbstracts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(paperId)) {
        newSet.delete(paperId);
      } else {
        newSet.add(paperId);
      }
      return newSet;
    });
  };

  if (isLoading)
    return <div className="text-center py-4">논문을 불러오는 중...</div>;
  if (error)
    return <div className="text-red-500 text-center py-4">{error}</div>;
  if (papers.length === 0)
    return <div className="text-center py-4">검색된 논문이 없습니다</div>;

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col w-full items-start justify-center gap-2 font-normal text-md mb-3">
        <div className="w-full bg-gray-100 rounded-md py-1 px-4 font-normal text-md">
          "{searchQuery}" 검색 결과
        </div>
        <PaperFilters
          sortKey={sortKey}
          sortOrder={sortOrder}
          fromYear={fromYear}
          toYear={toYear}
          minYear={minAvailableYear}
          maxYear={maxAvailableYear}
          onSortKeyChange={setSortKey}
          onSortOrderChange={setSortOrder}
          onFromYearChange={setFromYear}
          onToYearChange={setToYear}
        />
      </div>

      <div className="space-y-3 overflow-y-auto flex-1">
        {filteredPapers.map((paper) => (
          <PaperCard
            key={paper.paperId}
            paper={paper}
            isAbstractExpanded={expandedAbstracts.has(paper.paperId)}
            onAbstractToggle={() => toggleAbstract(paper.paperId)}
            onPaperClick={handlePaperClick}
          />
        ))}
      </div>
    </div>
  );
}
