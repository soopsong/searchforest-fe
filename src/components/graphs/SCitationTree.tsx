import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { NodeData } from "../../types/tree";

interface TreeProps {
  data: NodeData;
  width?: number;
  height?: number;
  onNodeClick?: (text: string) => void;
}

interface PositionedNode extends d3.HierarchyNode<NodeData> {
  x?: number; // angle (radian)
  y?: number; // radius
}

const CitationTree: React.FC<TreeProps> = ({ data, onNodeClick }) => {
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
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const root = d3.hierarchy<NodeData>(data);

    function assignPolarPosition(
      node: PositionedNode,
      startAngle: number,
      endAngle: number,
      depth: number,
      parentRadius: number
    ) {
      const angle = (startAngle + endAngle) / 2;
      node.x = angle;

      const offsetScale = d3
        .scalePow()
        .exponent(3.0)
        .domain([1, 0])
        .range([radius * 0.1, radius * 0.9]);

      node.y = parentRadius + offsetScale(node.data.value);

      const children = node.children || [];
      const anglePerChild =
        (endAngle - startAngle) / Math.max(children.length, 1);
      children.forEach((child, i) => {
        assignPolarPosition(
          child as PositionedNode,
          startAngle + i * anglePerChild,
          startAngle + (i + 1) * anglePerChild,
          depth + 1,
          node.y ?? 0
        );
      });
    }

    assignPolarPosition(root as PositionedNode, 0, 2 * Math.PI, 0, 0);

    const zoomWrapper = svg.append("g").attr("class", "zoom-wrapper");
    const graphContainer = zoomWrapper
      .append("g")
      .attr("class", "graph-container")
      .attr(
        "transform",
        `translate(${dimensions.width / 2}, ${dimensions.height / 2})`
      );

    svg.call(
      d3
        .zoom<SVGSVGElement, unknown>()
        .scaleExtent([0.5, 5])
        .on("zoom", (event) => {
          zoomWrapper.attr("transform", event.transform);
        })
    );

    graphContainer
      .selectAll(".link")
      .data(root.links())
      .enter()
      .append("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#E5E7EB")
      .attr("stroke-width", 1.5)
      .attr("d", (d) => {
        const sx =
          (d.source.y ?? 0) * Math.cos((d.source.x ?? 0) - Math.PI / 2);
        const sy =
          (d.source.y ?? 0) * Math.sin((d.source.x ?? 0) - Math.PI / 2);
        const tx =
          (d.target.y ?? 0) * Math.cos((d.target.x ?? 0) - Math.PI / 2);
        const ty =
          (d.target.y ?? 0) * Math.sin((d.target.x ?? 0) - Math.PI / 2);
        return `M${sx},${sy}L${tx},${ty}`;
      });

    const node = graphContainer
      .selectAll(".node")
      .data(root.descendants())
      .enter()
      .append("g")
      .attr("class", "node")
      .attr("transform", (d) => {
        const angle = (d.x ?? 0) * (180 / Math.PI) - 90;
        return `rotate(${angle}) translate(${d.y},0)`;
      });

    const allNodes = root.descendants();
    const maxCitation = d3.max(allNodes, (d) => d.data.citation) ?? 50;

    const getRadius = (citation: number) => {
      const minSize = 15;
      const maxSize = 60;
      return minSize + (citation / maxCitation) * (maxSize - minSize);
    };

    // Tooltip container
    const tooltip = d3
      .select(containerRef.current)
      .append("div")
      .style("position", "absolute")
      .style("padding", "4px 6px")
      .style("background-color", "rgba(107, 114, 128, 0.5)") // 투명도 있는 회색 (#6B7280)
      .style("color", "#fff")
      .style("border-radius", "6px")
      .style("font-size", "13px")
      .style("pointerEvents", "none")
      .style("opacity", 0);

    node
      .append("circle")
      .attr("r", (d) => getRadius(d.data.citation))
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
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer");

    // node
    //   .append("text")
    //   .attr("text-anchor", "middle")
    //   .attr("alignment-baseline", "middle")
    //   .attr("transform", (d) => `rotate(${-(d.x ?? 0) * (180 / Math.PI) + 90})`)
    //   .style("font-size", (d) =>
    //     d.depth === 0 ? "16px" : d.depth === 1 ? "14px" : "12px"
    //   )
    //   .style("fill", "#000")
    //   .text((d) => d.data.id)
    //   .style("pointer-events", "none");
    node
      .append("foreignObject")
      .attr("width", 100) // 고정 너비
      .attr("height", 100) // 고정 높이
      .attr("x", -50) // 중앙 정렬을 위해 width의 절반
      .attr("y", -50) // 중앙 정렬을 위해 height의 절반
      .append("xhtml:div")
      .style("transform", (d) => {
        const angle = -(d.x ?? 0) * (180 / Math.PI) + 90;
        return `rotate(${angle}deg)`;
      }) // 역회전 적용
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

    node
      .on("mouseenter", function (event, d) {
        d3.select(this).select("text").style("fill", "#2563EB");
        d3.select(this).select("circle").attr("stroke-width", 3);
        tooltip
          .style("opacity", 1)
          .html(`총 인용수: ${d.data.citation}`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 20}px`);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 20}px`);
      })
      .on("mouseleave", function (event, d) {
        d3.select(this).select("text").style("fill", "#000");
        d3.select(this).select("circle").attr("stroke-width", 2);
        tooltip.style("opacity", 0);
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
