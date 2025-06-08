export type GraphStyle = "radial" | "citation";

// 기존 트리 데이터 타입
export interface NodeData {
  id: string;
  value: number;
  children?: NodeData[];
}

// citation이 추가된 새로운 트리 데이터 타입
export interface CitationNodeData {
  id: string;
  value: number; // 부모 노드와의 연관도
  citation: number; // 인용 수
  children?: CitationNodeData[];
}
