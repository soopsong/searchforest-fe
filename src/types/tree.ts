export type GraphStyle = "radial" | "citation";

// 기존 트리 데이터 타입
export interface NodeData {
  id: string;
  value: number;
  citation: number;
  children?: NodeData[];
}
