import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

interface NodeData {
  id: string;
  value: number;
  children?: NodeData[];
}

interface RadialTreeProps {
  data: NodeData;
  width?: number;
  height?: number;
}

const RadialTree: React.FC<RadialTreeProps> = ({
  data,
  width = 600,
  height = 600,
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const radius = width / 2;

    const treeLayout = d3
      .tree<NodeData>()
      .size([2 * Math.PI, radius - 40])
      .separation(() => 1.5);

    const root = d3.hierarchy<NodeData>(
      data
    ) as d3.HierarchyPointNode<NodeData>;
    treeLayout(root);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // 필터 정의 추가
    const filter = svg
      .append("defs")
      .append("filter")
      .attr("id", "blur-effect")
      .append("feGaussianBlur")
      .attr("stdDeviation", "2")
      .attr("result", "blur");

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    // ✅ 링크 요소 (사용됨)

    const link = g
      .selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1.5)
      .attr("d", (d) => {
        const sourceX = d.source.y * Math.cos(d.source.x - Math.PI / 2);
        const sourceY = d.source.y * Math.sin(d.source.x - Math.PI / 2);
        const targetX = d.target.y * Math.cos(d.target.x - Math.PI / 2);
        const targetY = d.target.y * Math.sin(d.target.x - Math.PI / 2);
        return `M${sourceX},${sourceY}L${targetX},${targetY}`;
      });

    // ✅ 노드 요소
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

    node
      .append("circle")
      .attr("r", (d) => d.data.value * 25 + 15)
      .attr("fill", (d) => {
        if (d.depth === 0) return "#92B44C";
        if (d.depth === 1) return "#BBD38A";
        return "#E2F1C4";
      })
      .attr("stroke", "rgba(255, 255, 255, 0.8)") // 테두리 색상을 약간 투명하게
      .attr("stroke-width", 4) // 테두리 두께 증가
      .style("filter", "url(#blur-effect)") // 블러 필터 적용
      .style("cursor", "pointer");

    node
      .append("text")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("transform", (d) => `rotate(${-((d.x * 180) / Math.PI - 90)})`)
      .style("font-size", (d) => `${d.data.value * 8 + 8}px`)
      .style("fill", "#000") // 기본 색
      .style("cursor", "pointer")
      .text((d) => d.data.id);

    node
      .on("mouseenter", function (event, d) {
        d3.select(this)
          .select("text")
          .style("font-weight", "bold")
          .style("fill", "#2563EB"); // 파란색 글씨
      })
      .on("mouseleave", function (event, d) {
        d3.select(this)
          .select("circle")
          .attr("stroke", "#fff") // 원래 테두리
          .attr("stroke-width", 2);

        d3.select(this)
          .select("text")
          .style("font-weight", "normal")
          .style("fill", "#000"); // 원래 텍스트 색
      })
      .on("click", (event, d) => {
        const searchQuery = d.data.id;
        window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      });
  }, [data, width, height]);

  return <svg ref={svgRef} width={width} height={height} />;
};

export default RadialTree;
