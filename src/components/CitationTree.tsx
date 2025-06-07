import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { CitationNodeData } from "../types/tree";

interface CitationTreeProps {
  data: CitationNodeData;
  width?: number;
  height?: number;
  onNodeClick?: (text: string) => void;
}

const CitationTree: React.FC<CitationTreeProps> = ({
  data,
  width,
  height,
  onNodeClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        setDimensions({
          width: containerWidth,
          height: containerWidth,
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (!svgRef.current || dimensions.width === 0) return;

    const radius = dimensions.width / 2;
    const maxCitation =
      d3.max(d3.hierarchy(data).descendants(), (d) => d.data.citation) || 1;

    const treeLayout = d3
      .tree<CitationNodeData>()
      .size([2 * Math.PI, radius - 40])
      .separation((a, b) => {
        const valueDiff = Math.abs(a.data.value - b.data.value);
        return 1 + valueDiff;
      });

    const root = d3.hierarchy(data);
    treeLayout(root);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr(
        "transform",
        `translate(${dimensions.width / 2}, ${dimensions.height / 2})`
      );

    // 링크
    const link = g
      .selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#E5E7EB")
      .attr("stroke-width", 1.5)
      .attr("d", (d) => {
        // 부모 노드의 위치
        const sourceX = d.source.y * Math.cos(d.source.x - Math.PI / 2);
        const sourceY = d.source.y * Math.sin(d.source.x - Math.PI / 2);

        // 자식 노드의 위치 계산 시 value 반영
        // value가 1에 가까울수록 부모와 가까워지도록 조정
        const targetDistance = d.target.y * (1 - d.target.data.value);
        const targetX = targetDistance * Math.cos(d.target.x - Math.PI / 2);
        const targetY = targetDistance * Math.sin(d.target.x - Math.PI / 2);

        return `M${sourceX},${sourceY}L${targetX},${targetY}`;
      });

    // 노드
    const node = g
      .selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr(
        "transform",
        (d) => `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0)`
      );

    // 노드 원
    node
      .append("circle")
      .attr("r", (d) => {
        // citation 값이 1~50 사이이므로, 이를 적절한 크기로 매핑
        const minSize = 15; // 최소 크기
        const maxSize = 35; // 최대 크기
        const citationSize =
          minSize + (d.data.citation / 20) * (maxSize - minSize);
        return citationSize;
      })
      .attr("fill", (d) => {
        // 계층별 색상 적용
        switch (d.depth) {
          case 0: // 최상위 계층
            return "#4B5563"; // 진한 회색
          case 1: // 중간 계층
            return "#9CA3AF"; // 중간 회색
          default: // 최하위 계층
            return "#D1D5DB"; // 연한 회색
        }
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer");

    // 텍스트 크기도 citation 값에 맞게 조정
    node
      .append("text")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("transform", (d) => `rotate(${-((d.x * 180) / Math.PI - 90)})`)
      .style("font-size", (d) => {
        // citation 값이 1~50 사이이므로, 이를 적절한 폰트 크기로 매핑
        const minSize = 8; // 최소 폰트 크기
        const maxSize = 16; // 최대 폰트 크기
        const fontSize = minSize + (d.data.citation / 50) * (maxSize - minSize);
        return `${fontSize}px`;
      })
      .style("fill", "#000")
      .style("cursor", "pointer")
      .text((d) => d.data.id);

    // 호버 효과
    node
      .on("mouseenter", function (event, d) {
        d3.select(this)
          .select("text")
          .style("font-weight", "bold")
          .style("fill", "#2563EB");

        d3.select(this).select("circle").attr("stroke-width", 3);
      })
      .on("mouseleave", function (event, d) {
        d3.select(this)
          .select("text")
          .style("font-weight", "normal")
          .style("fill", "#000");

        d3.select(this).select("circle").attr("stroke-width", 2);
      })
      .on("click", (event, d) => {
        if (onNodeClick) {
          onNodeClick(d.data.id);
        }
      });
  }, [data, dimensions.width, dimensions.height, onNodeClick]);

  return (
    <div ref={containerRef} className="w-full">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{ maxWidth: "100%", height: "auto" }}
      />
    </div>
  );
};

export default CitationTree;
