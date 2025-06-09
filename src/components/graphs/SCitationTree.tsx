import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { CitationNodeData } from "../../types/tree";

interface CitationTreeProps {
  data: CitationNodeData;
  width?: number;
  height?: number;
  onNodeClick?: (text: string) => void;
}

interface PositionedNode extends d3.HierarchyNode<CitationNodeData> {
  x?: number; // angle (radian)
  y?: number; // radius
}

const CitationTree: React.FC<CitationTreeProps> = ({ data, onNodeClick }) => {
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

    const root = d3.hierarchy<CitationNodeData>(data);
    const maxDepth = root.height;

    function assignPolarPosition(
      node: PositionedNode,
      startAngle: number,
      endAngle: number,
      depth: number,
      parentRadius: number
    ) {
      const angle = (startAngle + endAngle) / 2;
      // const rScale = d3
      //   .scaleLinear()
      //   .domain([0, maxDepth])
      //   .range([radius * 0.1, radius]);
      node.x = angle;
      // node.y = rScale(depth);

      const offset = d3
        .scalePow()
        .exponent(2.5)
        .domain([1, 0])
        .range([20, 200])(node.data.value); // value 작을수록 offset ↑

      node.y = parentRadius + offset;

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

    const g = svg
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
          g.attr("transform", event.transform);
        })
    );

    g.selectAll(".link")
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

    const node = g
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

    node
      .append("circle")
      // .attr("r", (d) => 15 + (d.data.citation / 20) * 35)
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

    node
      .append("text")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .attr("transform", (d) => `rotate(${-(d.x ?? 0) * (180 / Math.PI) + 90})`)
      .style("font-size", (d) =>
        d.depth === 0 ? "16px" : d.depth === 1 ? "14px" : "12px"
      )
      .style("fill", "#000")
      .text((d) => d.data.id)
      .style("pointer-events", "none");

    node
      .on("mouseenter", function (event, d) {
        d3.select(this).select("text").style("fill", "#2563EB");
        d3.select(this).select("circle").attr("stroke-width", 3);
      })
      .on("mouseleave", function (event, d) {
        d3.select(this).select("text").style("fill", "#000");
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
