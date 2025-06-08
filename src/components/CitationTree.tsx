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

    // const radius = dimensions.width / 2;
    const radius = dimensions.width / 2;

    const treeLayout = d3
      .tree<CitationNodeData>()
      .size([2 * Math.PI, radius])
      .separation((a, b) => {
        const valueDiff = Math.abs(a.data.value - b.data.value);
        return 1 + valueDiff;
      });

    const root = d3.hierarchy(data);
    // 이 부분 추가!
    treeLayout(root);

    // const stepCount = root.height + 1;
    // const stepRadius = radius / stepCount;

    // [1] citation 기반 반지름 계산 함수
    const getRadius = (citation: number) => {
      const minSize = 15;
      const maxSize = 50;
      return minSize + (citation / 15) * (maxSize - minSize);
    };
    const distanceScale = d3
      .scaleLinear()
      .domain([1, 0]) // value=1 → 중심, 0 → 바깥
      .range([radius * 0.1, radius]);

    root.descendants().forEach((d) => {
      const point = d as d3.HierarchyPointNode<CitationNodeData>;
      const r = getRadius(d.data.citation);
      point.y = distanceScale(d.data.value) + r; // 거리 + 반지름
    });

    // // [2] 먼저 노드별 반지름을 구해둠
    // const radiusMap = new Map<d3.HierarchyNode<CitationNodeData>, number>();
    // root.descendants().forEach((d) => {
    //   radiusMap.set(d, getRadius(d.data.citation));
    // });

    // // [3] 위치 보정: 깊이 기반 거리 + value 기반 퍼짐 + 반지름 보정
    // root.descendants().forEach((d) => {
    //   const point = d as d3.HierarchyPointNode<CitationNodeData>;

    //   const base = stepRadius * d.depth;
    //   const offset = stepRadius * Math.pow(1 - d.data.value, 2); // 비선형 퍼짐
    //   const nodeRadius = radiusMap.get(point) ?? 0;

    //   point.y = base + offset + nodeRadius;
    // });

    // const MIN_DISTANCE = radius * 0.4; // 중심 최소 거리
    // const MAX_DISTANCE = radius;

    // const distanceScale = d3
    //   .scaleLinear()
    //   .domain([0, 1])
    //   .range([radius, radius * 0.4]); // ✅ 방향 반전됨

    // root.descendants().forEach((d) => {
    //   const point = d as d3.HierarchyPointNode<CitationNodeData>;
    //   point.y = distanceScale(d.data.value); // ⬅ value 기반 거리 재조정
    // });
    // const stepCount = root.height + 1; // 예: depth가 0,1,2면 step 3개

    // const stepRadius = radius / stepCount;

    // root.descendants().forEach((d) => {
    //   const point = d as d3.HierarchyPointNode<CitationNodeData>;
    //   const value = d.data.value;

    //   // 동일한 value라도 depth에 따라 시작 위치(offset)가 다름
    //   const base = stepRadius * d.depth;
    //   const offset = stepRadius * value;

    //   point.y = base + offset;
    // });

    // const stepCount = root.height + 1;
    // const stepRadius = radius / stepCount;

    // root.descendants().forEach((d) => {
    //   const point = d as d3.HierarchyPointNode<CitationNodeData>;

    //   const base = stepRadius * d.depth;
    //   const offset = stepRadius * (1 - d.data.value); // value가 1일수록 base에 가까움
    //   point.y = base + offset;
    // });

    // const stepCount = root.height + 1;
    // const stepRadius = radius / stepCount;
    // const EXPONENT = 2; // 값을 키울수록 민감도 증가 (예: 2 ~ 3)

    // root.descendants().forEach((d) => {
    //   const point = d as d3.HierarchyPointNode<CitationNodeData>;

    //   const base = stepRadius * d.depth;
    //   const nonlinear = Math.pow(1 - d.data.value, EXPONENT); // 강조
    //   point.y = base + stepRadius * nonlinear;
    // });

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

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
    g.selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#E5E7EB")
      .attr("stroke-width", 1.5)
      .attr("d", (d) => {
        const source = d.source as d3.HierarchyPointNode<CitationNodeData>;
        const target = d.target as d3.HierarchyPointNode<CitationNodeData>;

        const sourceX = source.y * Math.cos(source.x - Math.PI / 2);
        const sourceY = source.y * Math.sin(source.x - Math.PI / 2);
        const targetX = target.y * Math.cos(target.x - Math.PI / 2);
        const targetY = target.y * Math.sin(target.x - Math.PI / 2);

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
        const minSize = 15;
        const maxSize = 50;
        return minSize + (d.data.citation / 50) * (maxSize - minSize);
      })
      // .attr("r", (d) => d.data.citation * 3)

      // .attr("r", (d) => getRadius(d.data.citation)) // ✅ radiusMap과 동일 로직
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
      // .style("filter", "url(#blur-effect)") // 블러 필터 적용
      .style("cursor", "pointer");

    // 텍스트 (foreignObject 방식)
    node
      .append("foreignObject")
      .attr("width", 100)
      .attr("height", 100)
      .attr("x", -50)
      .attr("y", -50)
      .attr("transform", (d) => `rotate(${-((d.x * 180) / Math.PI - 90)})`)
      .append("xhtml:div")
      .style("width", "100%")
      .style("height", "100%")
      .style("display", "flex")
      .style("align-items", "center")
      .style("justify-content", "center")
      .style("text-align", "center")
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

    // 호버 & 클릭
    node
      .on("mouseenter", function (event, d) {
        d3.select(this).select("foreignObject div").style("color", "#2563EB");

        d3.select(this).select("circle").attr("stroke-width", 3);
      })
      .on("mouseleave", function (event, d) {
        d3.select(this).select("foreignObject div").style("color", "#000");

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
