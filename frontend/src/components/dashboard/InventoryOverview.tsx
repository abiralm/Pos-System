"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { getDashboardTopProducts, getDashboardLowStock } from "../../services/dashboard_api";
import { TopProduct, LowStockProduct } from "../../types/dashboard_types";
import { AlertTriangle, TrendingUp, Archive } from "lucide-react";

export default function InventoryOverview() {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
    const [lowStock, setLowStock] = useState<LowStockProduct[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingStock, setLoadingStock] = useState(true);

    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                const data = await getDashboardTopProducts();
                setTopProducts(data.top_selling_products);
            } catch (error) {
                console.error("Failed to fetch top products:", error);
            } finally {
                setLoadingProducts(false);
            }
        };

        const fetchLowStock = async () => {
            try {
                const data = await getDashboardLowStock();
                setLowStock(data.low_stock_products);
            } catch (error) {
                console.error("Failed to fetch low stock products:", error);
            } finally {
                setLoadingStock(false);
            }
        };

        fetchTopProducts();
        fetchLowStock();
    }, []);

    // Draw Donut Pie Chart using D3
    useEffect(() => {
        if (!svgRef.current || topProducts.length === 0) return;

        const containerWidth = svgRef.current.parentElement?.getBoundingClientRect().width || 250;
        const width = Math.min(containerWidth, 240);
        const height = width;
        const radius = width / 2;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        svg.attr("width", width).attr("height", height);

        const g = svg
            .append("g")
            .attr("transform", `translate(${width / 2}, ${height / 2})`);

        // Custom premium color scheme
        const colors = ["#1b4332", "#40916c", "#74c69d", "#b7e4c7","d8f3dc"];
        const color = d3
            .scaleOrdinal<string>()
            .domain(topProducts.map((d) => d.name))
            .range(colors.slice(0, topProducts.length));

        const pie = d3
            .pie<TopProduct>()
            .sort(null)
            .value((d) => d.total_revenue);

        const arc = d3
            .arc<d3.PieArcDatum<TopProduct>>()
            .innerRadius(radius * 0.6) // Donut chart
            .outerRadius(radius * 0.95)
            .cornerRadius(4);

        const arcHover = d3
            .arc<d3.PieArcDatum<TopProduct>>()
            .innerRadius(radius * 0.55)
            .outerRadius(radius * 1.0)
            .cornerRadius(6);

        const pieData = pie(topProducts);

        // Tooltip
        const tooltip = d3
            .select(containerRef.current)
            .append("div")
            .style("position", "absolute")
            .style("pointer-events", "none")
            .style("background", "rgba(24, 24, 27, 0.95)")
            .style("color", "white")
            .style("padding", "6px 10px")
            .style("border-radius", "8px")
            .style("font-size", "11px")
            .style("box-shadow", "0 4px 6px -1px rgb(0 0 0 / 0.1)")
            .style("opacity", 0)
            .style("z-index", "10")
            .style("transition", "opacity 0.2s ease");

        g.selectAll("path")
            .data(pieData)
            .enter()
            .append("path")
            .attr("d", arc)
            .attr("fill", (d) => color(d.data.name)!)
            .attr("stroke", "#ffffff")
            .attr("stroke-width", 2)
            .style("cursor", "pointer")
            .on("mouseover", function (event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("d", arcHover);
                
                tooltip
                    .style("opacity", 1)
                    .html(
                        `<strong>${d.data.name}</strong><br/>Revenue: $${d.data.total_revenue.toLocaleString()}<br/>Qty Sold: ${d.data.total_quantity}`
                    );
            })
            .on("mousemove", (event) => {
                const [mx, my] = d3.pointer(event, containerRef.current);
                tooltip
                    .style("left", `${mx + 12}px`)
                    .style("top", `${my - 24}px`);
            })
            .on("mouseleave", function () {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("d", arc);
                tooltip.style("opacity", 0);
            });

        return () => {
            tooltip.remove();
        };
    }, [topProducts]);

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(val);
    };

    return (
        <div ref={containerRef} className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Top Selling Products */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-[#40916c]" />
                    <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">Top selling products</h2>
                </div>

                {loadingProducts ? (
                    <div className="py-12 text-center text-sm text-zinc-400 animate-pulse">Loading top products...</div>
                ) : topProducts.length === 0 ? (
                    <div className="py-12 text-center text-sm text-zinc-400">No data available.</div>
                ) : (
                    <div className="flex flex-col md:flex-row items-center justify-around gap-6">
                        <div className="relative flex justify-center items-center">
                            <svg ref={svgRef}></svg>
                        </div>
                        <div className="flex-1 space-y-3 w-full">
                            {topProducts.slice(0, 5).map((p, idx) => {
                                const colors = ["#1b4332", "#40916c", "#74c69d", "#b7e4c7","d8f3dc"];
                                return (
                                    <div key={p.product_id} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2 max-w-150px truncate">
                                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: colors[idx % colors.length] }}></span>
                                            <span className="text-zinc-700 dark:text-zinc-300 font-semibold truncate">{p.name}</span>
                                        </div>
                                        <div className="flex gap-4 text-xs font-medium text-zinc-500 dark:text-zinc-400 shrink-0">
                                            <span>{p.total_quantity} sold</span>
                                            <span className="font-bold text-zinc-900 dark:text-zinc-50">{formatCurrency(p.total_revenue)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
            </div>

            {/* Low Stock Products */}
            <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 shadow-sm border border-zinc-100 dark:border-zinc-800 flex flex-col justify-between">
                <div className="flex items-center gap-2 mb-4">
                    <Archive className="w-5 h-5 text-[#40916c]" />
                    <h2 className="text-lg font-bold text-zinc-950 dark:text-zinc-50">Low stock products</h2>
                </div>

                {loadingStock ? (
                    <div className="py-12 text-center text-sm text-zinc-400 animate-pulse">Loading alerts...</div>
                ) : lowStock.length === 0 ? (
                    <div className="py-12 text-center text-sm text-zinc-400">Inventory is healthy. No warnings!</div>
                ) : (
                    <div className="space-y-4">
                        {lowStock.slice(0, 5).map((p) => (
                            <div key={p.id} className="flex items-center justify-between border-b border-zinc-50 dark:border-zinc-800/40 pb-2 last:border-0 last:pb-0">
                                <div>
                                    <div className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{p.name}</div>
                                    <div className="text-xs text-zinc-400 dark:text-zinc-500">Product ID: #{p.id}</div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                        p.stock <= 5 
                                            ? "bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400" 
                                            : "bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400"
                                    }`}>
                                        {p.stock} left
                                    </span>
                                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-50">${p.price.toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
