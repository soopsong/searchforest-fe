import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface BubbleData {
  name: string;
  value: number;
  group: number;
}

interface BubbleChartProps {
  data: BubbleData[];
  width?: number;
  height?: number;
}

// d3 시뮬레이션용 좌표 속성 확장
type SimNode = BubbleData & d3.SimulationNodeDatum;

export default function BubbleChart({
  data,
  width = 800,
  height = 600,
}: BubbleChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const size = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value) || 0])
      .range([4, 40]);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // 노드 복사
    const nodes: SimNode[] = data.map((d) => ({ ...d }));

    const simulation = d3
      .forceSimulation(nodes)
      .force("charge", d3.forceManyBody().strength(1))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force(
        "collision",
        d3.forceCollide<SimNode>().radius((d) => size(d.value) + 1)
      );

    const bubbles = svg
      .append("g")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .call(
        d3
          .drag<SVGGElement, SimNode>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    bubbles
      .append("circle")
      .attr("r", (d) => size(d.value))
      .style("fill", (d) => color(d.group.toString()))
      .style("fill-opacity", 0.7)
      .style("stroke", "#fff")
      .style("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", function () {
        d3.select(this).style("stroke", "#3B82F6");
      })
      .on("mouseout", function () {
        d3.select(this).style("stroke", "#fff");
      })
      .on("click", (event, d) => {
        console.log("버블 클릭됨: ", d.name);
      });

    bubbles
      .append("text")
      .text((d) => d.name)
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .style("fill", "#fff")
      .style("cursor", "pointer");

    simulation.on("tick", () => {
      bubbles.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(
      event: d3.D3DragEvent<SVGGElement, SimNode, SimNode>,
      d: SimNode
    ) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(
      event: d3.D3DragEvent<SVGGElement, SimNode, SimNode>,
      d: SimNode
    ) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(
      event: d3.D3DragEvent<SVGGElement, SimNode, SimNode>,
      d: SimNode
    ) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }, [data, width, height]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="border border-gray-200 rounded-lg"
    />
  );
}
