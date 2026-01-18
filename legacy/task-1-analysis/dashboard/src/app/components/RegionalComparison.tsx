"use client";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Cell,
    ReferenceLine,
} from "recharts";
import { Info, Map as MapIcon, TrendingUp, Users } from "lucide-react";

interface RegionData {
    region: string;
    company_count: number;
    total_funding: number;
    avg_funding: number;
    avg_rounds: number;
    operating_rate: number;
}

interface RegionalComparisonProps {
    data: RegionData[];
}

const formatCurrency = (value: number) => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    return `$${(value / 1e3).toFixed(0)}K`;
};

export default function RegionalComparison({ data }: RegionalComparisonProps) {
    if (!data || data.length === 0) return null;

    // Color mapping - highlight Netherlands
    const getBarColor = (region: string) => {
        if (region === "Netherlands") return "#ee3124";
        if (region === "United States") return "#38BDF8";
        if (region === "Germany") return "#63b3ed";
        return "#94A3B8";
    };

    // Find Netherlands stats for comparison
    const netherlands = data.find((d) => d.region === "Netherlands");
    const usa = data.find((d) => d.region === "United States");

    return (
        <div className="bg-bg-secondary border border-white/5 rounded-2xl p-8">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-heading font-bold text-white mb-2">
                        Regional Comparison
                    </h2>
                    <p className="text-text-secondary text-sm">
                        Netherlands vs USA, Germany, Rest of Europe, Asia, and China
                    </p>
                </div>
                <div className="px-3 py-1 bg-bg-tertiary rounded-full text-xs font-mono text-text-secondary">
                    GLOBAL BENCHMARKING
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Average Funding Comparison */}
                <div>
                    <h3 className="text-sm font-heading font-semibold text-white mb-4">
                        Average Funding per Company
                    </h3>
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} layout="vertical">
                                <XAxis
                                    type="number"
                                    tick={{ fill: "#94A3B8", fontSize: 11 }}
                                    tickFormatter={(v) => formatCurrency(v)}
                                />
                                <YAxis
                                    dataKey="region"
                                    type="category"
                                    width={100}
                                    tick={{ fill: "#94A3B8", fontSize: 11 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#162032",
                                        borderColor: "rgba(255,255,255,0.1)",
                                        color: "#F8FAFC",
                                    }}
                                    formatter={(value) => [formatCurrency(value as number), "Avg Funding"]}
                                />
                                <Bar dataKey="avg_funding" radius={[0, 4, 4, 0]}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={getBarColor(entry.region)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Operating Rate Comparison */}
                <div>
                    <h3 className="text-sm font-heading font-semibold text-white mb-4">
                        Operating Rate (% of Companies Still Active)
                    </h3>
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} layout="vertical">
                                <XAxis
                                    type="number"
                                    domain={[0, 100]}
                                    tick={{ fill: "#94A3B8", fontSize: 11 }}
                                    tickFormatter={(v) => `${v}%`}
                                />
                                <YAxis
                                    dataKey="region"
                                    type="category"
                                    width={100}
                                    tick={{ fill: "#94A3B8", fontSize: 11 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#1e293b",
                                        borderColor: "rgba(255,255,255,0.1)",
                                        color: "#F8FAFC",
                                    }}
                                    formatter={(value) => [`${(value as number).toFixed(1)}%`, "Operating Rate"]}
                                />
                                <Bar dataKey="operating_rate" radius={[0, 4, 4, 0]}>
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={getBarColor(entry.region)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Key Insights */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="bg-bg-tertiary border border-accent-red/20 rounded-lg p-3 flex items-start gap-3">
                    <div className="p-2 bg-accent-red/10 rounded-md text-accent-red">
                        <MapIcon size={16} />
                    </div>
                    <div>
                        <span className="text-white font-bold block mb-1">Netherlands</span>
                        <span className="text-text-secondary">
                            {netherlands && formatCurrency(netherlands.avg_funding)} avg funding,{" "}
                            {netherlands?.operating_rate.toFixed(1)}% operating
                        </span>
                    </div>
                </div>
                <div className="bg-bg-tertiary border border-white/5 rounded-lg p-3 flex items-start gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-md text-blue-400">
                        <TrendingUp size={16} />
                    </div>
                    <div>
                        <span className="text-white font-bold block mb-1">vs USA</span>
                        <span className="text-text-secondary">
                            {usa && netherlands && (
                                <>
                                    {((netherlands.avg_funding / usa.avg_funding) * 100).toFixed(0)}% of US avg funding
                                </>
                            )}
                        </span>
                    </div>
                </div>
                <div className="bg-bg-tertiary border border-white/5 rounded-lg p-3 flex items-start gap-3">
                    <div className="p-2 bg-green-500/10 rounded-md text-green-400">
                        <Users size={16} />
                    </div>
                    <div>
                        <span className="text-white font-bold block mb-1">Sample Size</span>
                        <span className="text-text-secondary">
                            {data.map((d) => `${d.region.substring(0, 3)}: ${d.company_count}`).join(", ")}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
