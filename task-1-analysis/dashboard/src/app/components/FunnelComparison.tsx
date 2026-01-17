"use client";

import { useState } from "react";
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
import { TrendingUp } from "lucide-react";

interface FunnelStage {
    stage: string;
    count: number;
    percentage: number;
    conversion_rate: number;
}

interface FunnelComparisonData {
    global: FunnelStage[];
    netherlands: FunnelStage[];
    usa: FunnelStage[];
    uk?: FunnelStage[];
    germany?: FunnelStage[];
    france?: FunnelStage[];
    sweden?: FunnelStage[];
    summary: {
        total_global: number;
        total_nl: number;
        total_usa: number;
    };
}

interface Props {
    data: FunnelComparisonData;
}

type CompareTarget = "usa" | "global" | "uk" | "germany" | "france" | "sweden";

export default function FunnelComparison({ data }: Props) {
    const [compareTarget, setCompareTarget] = useState<CompareTarget>("usa");

    if (!data || !data.netherlands) return null;

    // Create comparison data for chart
    const chartData = data.netherlands.map((nlStage, index) => {
        const targetStage = data[compareTarget]?.[index];
        return {
            stage: nlStage.stage,
            netherlands: nlStage.percentage,
            [compareTarget]: targetStage?.percentage || 0,
            nl_conversion: nlStage.conversion_rate,
            target_conversion: targetStage?.conversion_rate || 0,
            gap: (nlStage.percentage - (targetStage?.percentage || 0)).toFixed(1),
        };
    });

    const getTargetLabel = (target: CompareTarget) => {
        switch (target) {
            case "usa": return "USA (Benchmark)";
            case "global": return "Global Average";
            case "uk": return "United Kingdom";
            case "germany": return "Germany";
            case "france": return "France";
            case "sweden": return "Sweden";
            default: return target;
        }
    };

    const getTargetColor = (target: CompareTarget) => {
        switch (target) {
            case "usa": return "#38BDF8";
            case "global": return "#94A3B8";
            case "uk": return "#a855f7";
            case "germany": return "#f59e0b";
            case "france": return "#3b82f6";
            case "sweden": return "#10b981";
            default: return "#94A3B8";
        }
    };

    const targetLabel = getTargetLabel(compareTarget);
    const targetColor = getTargetColor(compareTarget);

    return (
        <div className="bg-bg-secondary border border-white/5 rounded-2xl p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-heading font-bold text-white mb-2">
                        Funding Funnel: Netherlands vs Benchmark
                    </h2>
                    <p className="text-text-secondary text-sm">
                        Compare Dutch startup progression through funding stages against benchmarks
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <label className="text-text-secondary text-sm">Compare to:</label>
                    <select
                        value={compareTarget}
                        onChange={(e) => setCompareTarget(e.target.value as CompareTarget)}
                        className="bg-bg-tertiary border border-white/10 rounded-lg px-4 py-2 text-text-primary text-sm focus:outline-none focus:border-accent-red/50"
                    >
                        <option value="usa">USA (Benchmark)</option>
                        <option value="global">Global Average</option>
                        <option value="uk">United Kingdom</option>
                        <option value="germany">Germany</option>
                        <option value="france">France</option>
                        <option value="sweden">Sweden</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Progression Rate (% reaching each stage) */}
                <div>
                    <h3 className="text-sm font-heading font-semibold text-white mb-4">
                        % of Companies Reaching Each Stage
                    </h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} layout="vertical">
                                <XAxis type="number" domain={[0, 100]} tick={{ fill: "#94A3B8", fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                                <YAxis dataKey="stage" type="category" width={80} tick={{ fill: "#94A3B8", fontSize: 11 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#162032", borderColor: "rgba(255,255,255,0.1)", color: "#F8FAFC" }}
                                    formatter={(value) => [`${value}%`, ""]}
                                />
                                <Legend />
                                <Bar dataKey="netherlands" fill="#ee3124" name="Netherlands" radius={[0, 4, 4, 0]} />
                                <Bar dataKey={compareTarget} fill={targetColor} name={targetLabel} radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Conversion Rates (stage-to-stage) */}
                <div>
                    <h3 className="text-sm font-heading font-semibold text-white mb-4">
                        Stage-to-Stage Conversion Rates
                    </h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData.slice(1)} layout="vertical">
                                <XAxis type="number" domain={[0, 100]} tick={{ fill: "#94A3B8", fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                                <YAxis dataKey="stage" type="category" width={80} tick={{ fill: "#94A3B8", fontSize: 11 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#1e293b", borderColor: "rgba(255,255,255,0.1)", color: "#F8FAFC" }}
                                    formatter={(value) => [`${value}%`, ""]}
                                />
                                <Legend />
                                <Bar dataKey="nl_conversion" fill="#ee3124" name="NL Conversion" radius={[0, 4, 4, 0]} />
                                <Bar dataKey="target_conversion" fill={targetColor} name={`${compareTarget === "usa" ? "USA" : "Global"} Conversion`} radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Key Insights */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-bg-primary/50 border border-white/5 rounded-lg p-4 text-center">
                    <p className="text-2xl font-heading font-bold text-white">{data.summary.total_nl}</p>
                    <p className="text-xs text-text-secondary">Dutch Companies</p>
                </div>
                <div className="bg-bg-primary/50 border border-white/5 rounded-lg p-4 text-center">
                    <p className="text-2xl font-heading font-bold text-white">
                        {data.netherlands[1]?.percentage.toFixed(1)}%
                    </p>
                    <p className="text-xs text-text-secondary">NL reach Series A</p>
                    <p className="text-xs text-accent-red mt-1">
                        vs {data[compareTarget]?.[1]?.percentage.toFixed(1)}% {compareTarget === "usa" ? "USA" : "Global"}
                    </p>
                </div>
                <div className="bg-bg-primary/50 border border-white/5 rounded-lg p-4 text-center">
                    <p className="text-2xl font-heading font-bold text-white">
                        {data.netherlands[3]?.percentage.toFixed(1)}%
                    </p>
                    <p className="text-xs text-text-secondary">NL reach Series C</p>
                    <p className="text-xs text-accent-red mt-1">
                        vs {data[compareTarget]?.[3]?.percentage.toFixed(1)}% {compareTarget === "usa" ? "USA" : "Global"}
                    </p>
                </div>
            </div>

            <div className="mt-4 p-4 bg-bg-tertiary border border-accent-red/20 rounded-lg text-xs text-text-secondary flex gap-3 items-start">
                <div className="p-1 bg-accent-red/10 rounded text-accent-red shrink-0 mt-0.5">
                    <TrendingUp size={14} />
                </div>
                <div>
                    <span className="text-white font-bold block mb-1">Policy Target</span>
                    Increase Series A conversion rate from{" "}
                    <span className="text-white font-medium">{data.netherlands[1]?.conversion_rate.toFixed(1)}%</span> to match USA benchmark of{" "}
                    <span className="text-white font-medium">{data.usa[1]?.conversion_rate.toFixed(1)}%</span> — this would unlock{" "}
                    <span className="text-white font-bold">~{Math.round(data.summary.total_nl * ((data.usa[1]?.percentage || 0) - (data.netherlands[1]?.percentage || 0)) / 100)}</span> additional Dutch scale-ups.
                </div>
            </div>
        </div>
    );
}
