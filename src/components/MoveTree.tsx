import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { CitationNodeData } from "../../types";

interface CitationTreeProps {
  data: CitationNodeData;
  onNodeClick: (node: CitationNodeData) => void;
}

export default function CitationTree({ data, onNodeClick }: CitationTreeProps) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const gRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    if (!data) return;

    const width = 800;
    const height = 800;
    const radius = width / 2 - 100;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);
    gRef.current = g.node();

    const root = d3.hierarchy(data);
    const tree = d3.tree<CitationNodeData>().size([2 * Math.PI, radius]);
    tree(root);

    // distance calculation (depth + value based)
    const stepCount = root.height + 1;
    const stepRadius = radius / stepCount;
    root.descendants().forEach((d) => {
      const value = d.data.value;
      const base = stepRadius * d.depth;
      const offset = stepRadius * value;
      (d as any).y = base + offset;
    });

    const linkGenerator = d3
      .linkRadial()
      .angle((d: any) => d.x)
      .radius((d: any) => d.y);

    g.selectAll("path.link")
      .data(root.links())
      .join("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#ccc")
      .attr("stroke-width", 1.5)
      .attr("d", (d) => linkGenerator(d as any));

    const node = g
      .selectAll("g.node")
      .data(root.descendants())
      .join("g")
      .attr("class", "node")
      .attr(
        "transform",
        (d) => `rotate(${(d.x * 180) / Math.PI - 90}) translate(${d.y},0)`
      )
      .on("click", (event, d) => onNodeClick(d.data));

    node.append("circle").attr("r", 4).attr("fill", "#69b3a2");

    node
      .append("text")
      .attr("dy", "0.31em")
      .attr("x", (d) => (d.x < Math.PI === !d.children ? 6 : -6))
      .attr("text-anchor", (d) =>
        d.x < Math.PI === !d.children ? "start" : "end"
      )
      .attr("transform", (d) => (d.x >= Math.PI ? "rotate(180)" : null))
      .text((d) => d.data.name)
      .style("font", "12px sans-serif");
  }, [data]);

  useEffect(() => {
    if (!svgRef.current || !gRef.current) return;

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 4])
      .on("zoom", (event) => {
        d3.select(gRef.current).attr("transform", event.transform.toString());
      });

    d3.select(svgRef.current).call(zoom);
  }, []);

  return <svg ref={svgRef} width={800} height={800} />;
}
