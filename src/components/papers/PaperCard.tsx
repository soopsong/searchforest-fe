import { Paper } from "../../types/paper";
import UpIcon from "../icons/UpIcon";
import DownIcon from "../icons/DownIcon";

interface PaperCardProps {
  paper: Paper;
  isAbstractExpanded: boolean;
  onAbstractToggle: () => void;
  onPaperClick: (paper: Paper) => void;
}

export function PaperCard({
  paper,
  isAbstractExpanded,
  onAbstractToggle,
  onPaperClick,
}: PaperCardProps) {
  return (
    <div className="block bg-white rounded-lg hover:bg-gray-50 transition-colors">
      <div
        key={paper.paperId}
        className="block bg-white p-2 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="flex justify-between items-start">
          <a
            href={paper.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onPaperClick(paper)}
            className="flex-1"
          >
            <h3 className="text-md font-medium">
              <span className="text-gray-900 hover:text-primary hover:underline cursor-pointer transition-colors duration-100">
                {paper.title}
              </span>
            </h3>
          </a>
        </div>
        <p className="text-gray-600 mb-1 text-md">{paper.authors.join(", ")}</p>
        <div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">인용수: {paper.citationCount}</span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-500">{paper.field}</span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-500">{paper.year}</span>
            <span className="text-gray-500">|</span>
            <span className="text-primary">
              유사도: {paper.simScore.toFixed(2)}
            </span>
          </div>
          <p className="text-gray-700 text-sm">{paper.summary}</p>
          {paper.abstractText && (
            <>
              {isAbstractExpanded && (
                <p className="text-gray-700 mt-2 text-sm">
                  {paper.abstractText}
                </p>
              )}
              <button
                onClick={onAbstractToggle}
                className="text-sm text-primary-500 hover:font-medium flex items-center gap-1 mt-1"
              >
                {isAbstractExpanded ? "초록 접기" : "초록 보기"}
                {isAbstractExpanded ? (
                  <UpIcon className="w-[10px] text-primary-500" />
                ) : (
                  <DownIcon className="w-[10px] text-primary-500" />
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
