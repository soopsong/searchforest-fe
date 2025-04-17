import React from "react";

// 각 노드의 데이터 타입 정의
interface NodeData {
  id: string;
  value: number;
  children?: NodeData[];
}

// 각 노드를 렌더링하는 재귀 컴포넌트
interface TreeNodeProps {
  node: NodeData;
  depth?: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, depth = 0 }) => {
  return (
    <div style={{ marginLeft: depth * 24 }}>
      <div
        style={{
          padding: "6px 12px",
          borderRadius: "8px",
          background: "#DCFCE7",
          fontWeight: "bold",
          display: "inline-block",
          fontSize: `${12 + node.value * 4}px`,
          color: "#2C2525",
        }}
      >
        {node.id}
      </div>

      {/* 자식 노드가 있다면 재귀 렌더링 */}
      {node.children && (
        <div style={{ marginTop: "8px" }}>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

// 트리 전체를 시작하는 컴포넌트
interface TreeGraphProps {
  data: NodeData;
}

const TreeGraph: React.FC<TreeGraphProps> = ({ data }) => {
  return (
    <div>
      <TreeNode node={data} />
    </div>
  );
};

export default TreeGraph;
