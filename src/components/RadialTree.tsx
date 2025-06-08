import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { NodeData } from "../types/tree";

interface RadialTreeProps {
  data: NodeData;
  width?: number;
  height?: number;
  onNodeClick?: (text: string) => void;
}

const RadialTree: React.FC<RadialTreeProps> = ({
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
          height: containerWidth, // 1:1 비율 유지
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
    const margin = 60;

    const treeLayout = d3
      .tree<NodeData>()
      .size([2 * Math.PI, radius - margin])
      .separation(() => 1.5);

    const root = d3.hierarchy<NodeData>(
      data
    ) as d3.HierarchyPointNode<NodeData>;
    treeLayout(root);

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // 방사형 그라데이션
    // const radialGradient = svg
    //   .append("defs")
    //   .append("radialGradient")
    //   .attr("id", "circleGradient")
    //   .attr("cx", "50%")
    //   .attr("cy", "50%")
    //   .attr("r", "50%");

    // radialGradient
    //   .append("stop")
    //   .attr("offset", "0%")
    //   .attr("stop-color", "#92B44C");

    // radialGradient
    //   .append("stop")
    //   .attr("offset", "100%")
    //   .attr("stop-color", "white");

    // 블러 필터 강화
    const blurFilter = svg
      .append("defs")
      .append("filter")
      .attr("id", "edge-blur")
      .append("feGaussianBlur")
      .attr("stdDeviation", "5")
      .attr("result", "blur");

    svg
      .append("circle")
      .attr("cx", dimensions.width / 2)
      .attr("cy", dimensions.height / 2)
      .attr("r", radius)
      .attr("fill", "url(#circleGradient)")
      .attr("stroke", "rgba(255, 255, 255, 0.6)")
      .attr("stroke-width", 8)
      .style("filter", "url(#edge-blur)");

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
        const sourceX = d.source.y * Math.cos(d.source.x - Math.PI / 2);
        const sourceY = d.source.y * Math.sin(d.source.x - Math.PI / 2);
        const targetX = d.target.y * Math.cos(d.target.x - Math.PI / 2);
        const targetY = d.target.y * Math.sin(d.target.x - Math.PI / 2);
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

    node
      .append("circle")
      .attr("r", (d) => d.data.value * 25 + 15)
      .attr("fill", (d) => {
        switch (d.depth) {
          case 0:
            return "#92B44C";
          case 1:
            return "#BBD38A";
          default:
            return "#E2F1C4";
        }
      })
      // .attr("fill", (d) => {
      //   return "transparent";
      // })
      // .attr("stroke", "rgba(255, 255, 255, 0.8)") // 테두리 색상을 약간 투명하게
      // .attr("stroke-width", 4) // 테두리 두께 증가
      .style("filter", "url(#blur-effect)") // 블러 필터 적용
      .style("cursor", "pointer");

    // node
    //   .append("text")
    //   .attr("text-anchor", "middle")
    //   .attr("alignment-baseline", "middle")
    //   .attr("transform", (d) => `rotate(${-((d.x * 180) / Math.PI - 90)})`)
    //   .style("font-size", (d) => `${d.data.value * 10 + 8}px`)
    //   .style("fill", "#000") // 기본 색
    //   .style("cursor", "pointer")
    //   .text((d) => d.data.id);

    // node
    //   .on("mouseenter", function (event, d) {
    //     d3.select(this)
    //       .select("text")
    //       .style("font-weight", "bold")
    //       .style("fill", "#2563EB"); // 파란색 글씨
    //   })
    //   .on("mouseleave", function (event, d) {
    //     d3.select(this)
    //       .select("circle")
    //       // .attr("stroke", "#fff") // 원래 테두리
    //       .attr("stroke-width", 2);

    //     d3.select(this)
    //       .select("text")
    //       .style("font-weight", "normal")
    //       .style("fill", "#000"); // 원래 텍스트 색
    //   })
    //   .on("click", (event, d) => {
    //     if (onNodeClick) {
    //       onNodeClick(d.data.id);
    //     }
    //   });
    // 노드 텍스트 부분을 수정
    node
      .append("foreignObject")
      .attr("width", 100) // 텍스트 영역의 최대 너비
      .attr("height", 100) // 텍스트 영역의 최대 높이
      .attr("x", -50) // 중앙 정렬을 위해 너비의 절반만큼 왼쪽으로 이동
      .attr("y", -50) // 중앙 정렬을 위해 높이의 절반만큼 위로 이동
      .attr("transform", (d) => `rotate(${-((d.x * 180) / Math.PI - 90)})`)
      .append("xhtml:div")
      .style("width", "100%")
      .style("height", "100%")
      .style("display", "flex")
      .style("align-items", "center")
      .style("justify-content", "center")
      .style("text-align", "center")
      // .style("font-size", (d) => `${d.data.value * 10 + 8}px`)
      .style("font-size", (d) => {
        if (d.depth === 0) return "16px";
        if (d.depth === 1) return "14px";
        return "12px";
      })
      .style("color", "#000")
      .style("cursor", "pointer")
      .style("word-wrap", "break-word")
      .style("overflow-wrap", "break-word")
      .style("hyphens", "auto")
      .html((d) => d.data.id);

    // 호버 효과 수정
    node
      .on("mouseenter", function (event, d) {
        d3.select(this)
          .select("foreignObject div")
          // .style("font-weight", "semibold")
          .style("color", "#2563EB");

        d3.select(this).select("circle").attr("stroke-width", 3);
      })
      .on("mouseleave", function (event, d) {
        d3.select(this)
          .select("foreignObject div")
          .style("font-weight", "normal")
          .style("color", "#000");

        d3.select(this).select("circle").attr("stroke-width", 2);
      })
      .on("click", (event, d) => {
        if (onNodeClick) {
          onNodeClick(d.data.id);
        }
      });
  }, [data, dimensions.width, dimensions.height, onNodeClick]);

  return (
    <div ref={containerRef} className="w-full border">
      {/* <div className="p-8"> */}
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        style={{ maxWidth: "100%", height: "auto" }}
      />
      {/* </div> */}
    </div>
  );
};

export default RadialTree;
