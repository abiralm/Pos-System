"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { getDashboardCharts } from "../../services/dashboard_api";
import { SalesChartDataPoint } from "../../types/dashboard_types";
import { Calendar, ChevronDown } from "lucide-react";

export default function RevenueAnalytics() {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [salesData, setSalesData] = useState<SalesChartDataPoint[]>([]);
    const [range, setRange] = useState<string>("7d");
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // Fetch data when range changes
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const data = await getDashboardCharts(range);
                setSalesData(data.sales_chart);
            } catch (error) {
                console.error("Failed to fetch sales charts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [range]);

    // Redraw D3 Chart
    useEffect(() => {
        if (!svgRef.current || salesData.length === 0) return;

        const margin = { top: 50, right: 20, bottom: 40, left: 50 };
        
        // Make it responsive or fixed
        const containerWidth = containerRef.current?.getBoundingClientRect().width || 600;
        const width = containerWidth - margin.left - margin.right;
        const height = 350 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        svg
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom);

        const g = svg
            .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`);

        // X Scale
        const x = d3
            .scaleBand()
            .domain(salesData.map((d) => d.date))
            .range([0, width])
            .padding(0.35);

        // Y Scale
        const maxRevenue = d3.max(salesData, (d) => d.revenue) ?? 0;
        const y = d3
            .scaleLinear()
            .domain([0, maxRevenue === 0 ? 1000 : maxRevenue * 1.25])
            .nice()
            .range([height, 0]);

        // Horizontal Gridlines
        const makeYGridlines = () => d3.axisLeft(y).ticks(5);
        g.append("g")
            .attr("class", "grid text-zinc-100 dark:text-zinc-800")
            .style("stroke-dasharray", "3,3")
            .style("opacity", 0.5)
            .call(
                makeYGridlines()
                    .tickSize(-width)
                    .tickFormat(() => "")
            );

        // X Axis
        g.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x).tickSize(0))
            .call((gAxis) => gAxis.select(".domain").remove()) // remove axis line
            .selectAll("text")
            .attr("class", "text-zinc-500 dark:text-zinc-400 font-medium")
            .attr("dy", "12px")
            .style("font-size", "12px");

        // Y Axis
        g.append("g")
            .call(
                d3.axisLeft(y)
                    .ticks(5)
                    .tickSize(0)
                    .tickFormat((d) => {
                        const val = +d;
                        if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
                        return `${val}`;
                    })
            )
            .call((gAxis) => gAxis.select(".domain").remove()) // remove axis line
            .selectAll("text")
            .attr("class", "text-zinc-400 dark:text-zinc-500 font-medium")
            .attr("dx", "-6px")
            .style("font-size", "12px");

        // Custom Tooltip Div
        const tooltip = d3
            .select(containerRef.current)
            .append("div")
            .style("position", "absolute")
            .style("pointer-events", "none")
            .style("background", "rgba(24, 24, 27, 0.95)")
            .style("color", "white")
            .style("padding", "8px 12px")
            .style("border-radius", "12px")
            .style("font-size", "12px")
            .style("font-weight", "500")
            .style("box-shadow", "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)")
            .style("opacity", 0)
            .style("transition", "opacity 0.2s ease");

        // Find max element to display the highlight pin & badge
        let maxElement = salesData[0];
        salesData.forEach((d) => {
            if (d.revenue > maxElement.revenue) {
                maxElement = d;
            }
        });

        // Bars
        const bars = g.selectAll(".bar")
            .data(salesData)
            .enter()
            .append("g")
            .attr("class", "bar-group");

        bars.append("rect")
            .attr("x", (d) => x(d.date)!)
            .attr("y", (d) => y(d.revenue))
            .attr("width", x.bandwidth())
            .attr("height", (d) => height - y(d.revenue))
            .attr("fill", (d) => d.date === maxElement.date && maxElement.revenue > 0 ? "#e04e22" : "#ea580c") // Warm orange/red highlight
            .attr("opacity", (d) => d.date === maxElement.date && maxElement.revenue > 0 ? 1 : 0.85)
            .attr("rx", 6) // rounded corners
            .attr("ry", 6)
            .on("mouseover", function (event, d) {
                d3.select(this)
                    .transition()
                    .duration(150)
                    .attr("opacity", 1)
                    .attr("fill", "#ea580c");

                tooltip
                    .style("opacity", 1)
                    .html(
                        `<div class="space-y-1">
                            <div class="text-zinc-400 text-[10px] uppercase font-bold tracking-wider">${d.date}</div>
                            <div class="flex items-center gap-2">
                                <span class="w-2 h-2 rounded-full bg-orange-500"></span>
                                <span>Sales: <strong class="text-orange-300">$${d.revenue.toLocaleString()}</strong></span>
                            </div>
                            <div class="text-zinc-300 text-[11px]">${d.orders} orders placed</div>
                        </div>`
                    );
            })
            .on("mousemove", (event) => {
                const [mx, my] = d3.pointer(event, containerRef.current);
                tooltip
                    .style("left", `${mx + 15}px`)
                    .style("top", `${my - 45}px`);
            })
            .on("mouseleave", function (event, d) {
                d3.select(this)
                    .transition()
                    .duration(150)
                    .attr("fill", d.date === maxElement.date && maxElement.revenue > 0 ? "#e04e22" : "#ea580c")
                    .attr("opacity", d.date === maxElement.date && maxElement.revenue > 0 ? 1 : 0.85);

                tooltip.style("opacity", 0);
            });

        // Add Peak Sales highlight Badge above the peak bar, exactly as in the layout
        if (maxElement && maxElement.revenue > 0) {
            const peakX = x(maxElement.date)! + x.bandwidth() / 2;
            const peakY = y(maxElement.revenue);

            // Draw indicator line/pulse dot
            const pinGroup = g.append("g")
                .attr("class", "peak-pin")
                .attr("transform", `translate(${peakX}, ${peakY})`);

            // Outer ring
            pinGroup.append("circle")
                .attr("r", 7)
                .attr("fill", "#e04e22")
                .attr("opacity", 0.4)
                .attr("class", "animate-ping");

            // Inner white dot with red border
            pinGroup.append("circle")
                .attr("r", 4)
                .attr("fill", "#ffffff")
                .attr("stroke", "#e04e22")
                .attr("stroke-width", 2);

            // Text popover badge (offset upward)
            const badgeGroup = g.append("g")
                .attr("class", "peak-badge")
                .attr("transform", `translate(${peakX}, ${peakY - 24})`);

            const badgeText = `$${maxElement.revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
            
            // Temporary text to measure width
            const tempText = badgeGroup.append("text")
                .attr("text-anchor", "middle")
                .attr("font-size", "11px")
                .attr("font-weight", "bold")
                .text(badgeText);

            const textWidth = 50; // Approximated for layout safety
            tempText.remove();

            // Draw rect background for text
            badgeGroup.append("rect")
                .attr("x", -textWidth / 2 - 6)
                .attr("y", -16)
                .attr("width", textWidth + 12)
                .attr("height", 22)
                .attr("rx", 6)
                .attr("fill", "#e04e22");

            // Draw little triangle pointer at bottom
            badgeGroup.append("polygon")
                .attr("points", "-4,-5 4,-5 0,0")
                .attr("fill", "#e04e22")
                .attr("transform", "translate(0, 11)");

            // Add text label
            badgeGroup.append("text")
                .attr("text-anchor", "middle")
                .attr("y", -1)
                .attr("fill", "#ffffff")
                .attr("font-size", "11px")
                .attr("font-weight", "bold")
                .attr("font-family", "sans-serif")
                .text(badgeText);
        }

        return () => {
            tooltip.remove();
        };
    }, [salesData, range]);

    const rangeLabels: Record<string, string> = {
        "7d": "This Week",
        "30d": "This Month",
    };

    return (
        <div 
            ref={containerRef} 
            className="relative bg-white dark:bg-zinc-900 p-6 rounded-3xl shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col w-full h-450px"
        >
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-zinc-950 dark:text-zinc-50">Revenue</h2>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-full text-sm font-medium bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                    >
                        <Calendar className="w-4 h-4 text-zinc-500" />
                        <span>{rangeLabels[range]}</span>
                        <ChevronDown className="w-4 h-4 text-zinc-400" />
                    </button>

                    {dropdownOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 rounded-2xl shadow-lg z-30 py-1 overflow-hidden">
                            <button
                                onClick={() => {
                                    setRange("7d");
                                    setDropdownOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                            >
                                This Week
                            </button>
                            {/* <button
                                onClick={() => {
                                    setRange("30d");
                                    setDropdownOpen(false);
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900"
                            >
                                This Month
                            </button> */}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex-1 flex items-center justify-center min-h-0">
                {loading ? (
                    <div className="text-sm text-zinc-400 animate-pulse">Loading analytics...</div>
                ) : salesData.length === 0 ? (
                    <div className="text-sm text-zinc-400">No data available for this range.</div>
                ) : (
                    <svg ref={svgRef} className="w-full h-full"></svg>
                )}
            </div>
        </div>
    );
}
