"use client";

import { TrendingUp, AlertCircle, Building2 } from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
    ReferenceLine,
} from "recharts";

interface ScaleupData {
    country: string;
    seed_to_a: number;
    a_to_b: number;
    b_to_c: number;
    overall_scaleup: number;
}

// Calculated from funnel_comparison.json data
const scaleupData: ScaleupData[] = [
    { country: "Netherlands", seed_to_a: 36.1, a_to_b: 62.9, b_to_c: 27.3, overall_scaleup: 2.0 },
    { country: "USA", seed_to_a: 80.1, a_to_b: 63.4, b_to_c: 55.3, overall_scaleup: 7.0 },
    { country: "Global", seed_to_a: 62.8, a_to_b: 59.3, b_to_c: 50.4, overall_scaleup: 5.3 },
    { country: "Germany", seed_to_a: 58.2, a_to_b: 55.1, b_to_c: 48.3, overall_scaleup: 4.8 },
    { country: "UK", seed_to_a: 65.4, a_to_b: 61.2, b_to_c: 52.1, overall_scaleup: 5.8 },
];

// Domestic participation data (from State of Dutch Tech report)
const domesticParticipation = [
    { range: "<€10M", domestic_pct: 78, foreign_pct: 22 },
    { range: "€10-25M", domestic_pct: 61, foreign_pct: 39 },
    { range: "€25-50M", domestic_pct: 42, foreign_pct: 58 },
    { range: "€50-100M", domestic_pct: 15, foreign_pct: 85 },
    { range: ">€100M", domestic_pct: 8, foreign_pct: 92 },
];

export default function ScaleupComparison() {
    return (
        <div className="space-y-8">
            {/* Scaleup Ratio Comparison */}
            <div className="bg-bg-secondary border border-white/5 rounded-2xl p-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-heading font-bold text-white mb-2">
                        Scaleup Ratios: Netherlands vs Key Ecosystems
                    </h2>
                    <p className="text-text-secondary text-sm">
                        Stage-to-stage conversion rates: Higher = more companies successfully scaling
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Seed → Series A */}
                    <div>
                        <h3 className="text-sm font-heading font-semibold text-white mb-4">
                            Seed → Series A Conversion
                        </h3>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={scaleupData} layout="vertical">
                                    <XAxis type="number" domain={[0, 100]} tick={{ fill: "#94A3B8", fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                                    <YAxis dataKey="country" type="category" width={100} tick={{ fill: "#94A3B8", fontSize: 11 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "#1e293b", borderColor: "rgba(255,255,255,0.1)", color: "#F8FAFC" }}
                                        formatter={(value) => [`${value}%`, "Conversion Rate"]}
                                    />
                                    <ReferenceLine x={50} stroke="#94A3B8" strokeDasharray="3 3" label={{ value: "50% target", fill: "#94A3B8", fontSize: 10 }} />
                                    <Bar dataKey="seed_to_a" radius={[0, 4, 4, 0]}>
                                        {scaleupData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.country.includes("Netherlands") ? "#ee3124" : "#38BDF8"}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-2 p-2 bg-accent-red/10 border border-accent-red/20 rounded text-xs">
                            <span className="text-accent-red font-bold">Gap:</span> NL at 36.1% vs USA 80.1% —
                            <span className="text-white"> 44pp improvement needed</span>
                        </div>
                    </div>

                    {/* Overall Scaleup Rate */}
                    <div>
                        <h3 className="text-sm font-heading font-semibold text-white mb-4">
                            Overall Scaleup Rate (% reaching Series C+)
                        </h3>
                        <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={scaleupData} layout="vertical">
                                    <XAxis type="number" domain={[0, 10]} tick={{ fill: "#94A3B8", fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                                    <YAxis dataKey="country" type="category" width={100} tick={{ fill: "#94A3B8", fontSize: 11 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: "#162032", borderColor: "rgba(255,255,255,0.1)", color: "#F8FAFC" }}
                                        formatter={(value) => [`${value}%`, "Scaleup Rate"]}
                                    />
                                    <Bar dataKey="overall_scaleup" radius={[0, 4, 4, 0]}>
                                        {scaleupData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.country.includes("Netherlands") ? "#ee3124" : "#38BDF8"}
                                            />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="mt-2 p-3 bg-bg-tertiary border border-accent-red/20 rounded-lg text-xs text-text-secondary flex gap-2 items-center">
                            <AlertCircle size={14} className="text-accent-red shrink-0" />
                            <span>
                                <span className="text-white font-bold">Key Issue:</span> Only 2.0% of NL startups reach Series C+ vs 7.0% in USA
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Domestic Participation */}
            <div className="bg-bg-secondary border border-white/5 rounded-2xl p-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-heading font-bold text-white mb-2">
                        Domestic vs Foreign Investor Participation by Round Size
                    </h2>
                    <p className="text-text-secondary text-sm">
                        Dutch investors dominate small rounds but drop sharply in larger financing — indicating capital gap
                    </p>
                </div>

                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={domesticParticipation}>
                            <XAxis dataKey="range" tick={{ fill: "#94A3B8", fontSize: 11 }} />
                            <YAxis tick={{ fill: "#94A3B8" }} tickFormatter={(v) => `${v}%`} domain={[0, 100]} />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#162032", borderColor: "rgba(255,255,255,0.1)", color: "#F8FAFC" }}
                                formatter={(value) => [`${value}%`, ""]}
                            />
                            <Bar dataKey="domestic_pct" stackId="a" fill="#ee3124" name="Dutch Investors" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="foreign_pct" stackId="a" fill="#38BDF8" name="Foreign Investors" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-bg-primary/50 border border-white/5 rounded-lg p-4 text-center">
                        <p className="text-3xl font-heading font-bold text-accent-red">78%</p>
                        <p className="text-xs text-text-secondary">Dutch participation</p>
                        <p className="text-xs text-white font-medium">in &lt;€10M rounds</p>
                    </div>
                    <div className="bg-bg-primary/50 border border-accent-red/30 rounded-lg p-4 text-center">
                        <p className="text-3xl font-heading font-bold text-accent-red">-63pp</p>
                        <p className="text-xs text-text-secondary">Drop from small to large</p>
                        <p className="text-xs text-white font-medium">78% → 15%</p>
                    </div>
                    <div className="bg-bg-primary/50 border border-white/5 rounded-lg p-4 text-center">
                        <p className="text-3xl font-heading font-bold text-accent-blue">92%</p>
                        <p className="text-xs text-text-secondary">Foreign participation</p>
                        <p className="text-xs text-white font-medium">in &gt;€100M rounds</p>
                    </div>
                </div>

                <div className="mt-4 p-3 bg-bg-tertiary border border-accent-red/20 rounded-lg text-xs text-text-secondary flex gap-2 items-start">
                    <TrendingUp size={14} className="text-accent-red shrink-0 mt-0.5" />
                    <div>
                        <span className="text-white font-bold">Policy Implication:</span> The sharp drop in domestic participation
                        (61% → 15% in €50-100M range) indicates Dutch capital markets cannot support late-stage scaling —
                        aligning with Wennink Report's call for increased institutional investment.
                    </div>
                </div>
            </div>

            {/* Scaleup Ratio Trend Over Time */}
            <div className="bg-bg-secondary border border-white/5 rounded-2xl p-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-heading font-bold text-white mb-2">
                        Dutch Scaleup Ratio: Progress vs Targets
                    </h2>
                    <p className="text-text-secondary text-sm">
                        NL almost doubled its scaleup ratio (13% → 21.5%) but still lags EU and US benchmarks
                    </p>
                </div>

                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={[
                                { name: "NL (2019)", value: 13, fill: "#94A3B8" },
                                { name: "NL (2024)", value: 21.5, fill: "#ee3124" },
                                { name: "EU Avg", value: 23, fill: "#38BDF8" },
                                { name: "USA", value: 54, fill: "#38a169" },
                            ]}
                        >
                            <XAxis dataKey="name" tick={{ fill: "#94A3B8", fontSize: 11 }} />
                            <YAxis tick={{ fill: "#94A3B8" }} tickFormatter={(v) => `${v}%`} domain={[0, 60]} />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#162032", borderColor: "rgba(255,255,255,0.1)", color: "#F8FAFC" }}
                                formatter={(value) => [`${value}%`, "Scaleup Ratio"]}
                            />
                            <ReferenceLine y={23} stroke="#38BDF8" strokeDasharray="3 3" label={{ value: "EU Target", fill: "#38BDF8", fontSize: 10, position: "right" }} />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {[
                                    { fill: "#94A3B8" },
                                    { fill: "#ee3124" },
                                    { fill: "#38BDF8" },
                                    { fill: "#38a169" },
                                ].map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-bg-primary/50 border border-white/5 rounded-lg p-4 text-center">
                        <p className="text-2xl font-heading font-bold text-text-muted">13%</p>
                        <p className="text-xs text-text-secondary">NL (2019)</p>
                    </div>
                    <div className="bg-bg-primary/50 border border-accent-red/30 rounded-lg p-4 text-center">
                        <p className="text-2xl font-heading font-bold text-accent-red">21.5%</p>
                        <p className="text-xs text-text-secondary">NL (2024)</p>
                        <p className="text-xs text-green-400">+65% growth</p>
                    </div>
                    <div className="bg-bg-primary/50 border border-white/5 rounded-lg p-4 text-center">
                        <p className="text-2xl font-heading font-bold text-accent-blue">23%</p>
                        <p className="text-xs text-text-secondary">EU Average</p>
                        <p className="text-xs text-accent-red">-1.5pp gap</p>
                    </div>
                    <div className="bg-bg-primary/50 border border-white/5 rounded-lg p-4 text-center">
                        <p className="text-2xl font-heading font-bold text-green-400">54%</p>
                        <p className="text-xs text-text-secondary">USA</p>
                        <p className="text-xs text-accent-red">-32.5pp gap</p>
                    </div>
                </div>
            </div>

            {/* European VC Market Position */}
            <div className="bg-bg-secondary border border-white/5 rounded-2xl p-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-heading font-bold text-white mb-2">
                        European VC Market Rankings
                    </h2>
                    <p className="text-text-secondary text-sm">
                        Netherlands holds 4th position despite domestic investment decline
                    </p>
                </div>

                <div className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={[
                                { country: "UK", market_size: 15 },
                                { country: "France", market_size: 8.2 },
                                { country: "Germany", market_size: 7.5 },
                                { country: "Netherlands", market_size: 3.8 },
                                { country: "Sweden", market_size: 2.9 },
                                { country: "Spain", market_size: 1.8 },
                            ]}
                            layout="vertical"
                        >
                            <XAxis type="number" tick={{ fill: "#94A3B8", fontSize: 11 }} tickFormatter={(v) => `€${v}B`} />
                            <YAxis dataKey="country" type="category" width={110} tick={{ fill: "#94A3B8", fontSize: 11 }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#162032", borderColor: "rgba(255,255,255,0.1)", color: "#F8FAFC" }}
                                formatter={(value) => [`€${value}B`, "Market Size"]}
                            />
                            <Bar dataKey="market_size" radius={[0, 4, 4, 0]}>
                                {[0, 1, 2, 3, 4, 5].map((index) => (
                                    <Cell key={`cell-${index}`} fill={index === 3 ? "#ee3124" : "#38BDF8"} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-bg-primary/50 border border-accent-red/30 rounded-lg p-4 text-center">
                        <p className="text-3xl font-heading font-bold text-accent-red">#4</p>
                        <p className="text-xs text-white font-medium">NL Rank in EU</p>
                    </div>
                    <div className="bg-bg-primary/50 border border-white/5 rounded-lg p-4 text-center">
                        <p className="text-3xl font-heading font-bold text-white">€3.8B</p>
                        <p className="text-xs text-text-secondary">NL Market Size</p>
                    </div>
                    <div className="bg-bg-primary/50 border border-white/5 rounded-lg p-4 text-center">
                        <p className="text-3xl font-heading font-bold text-accent-blue">€15B</p>
                        <p className="text-xs text-text-secondary">UK (Leader)</p>
                    </div>
                    <div className="bg-bg-primary/50 border border-white/5 rounded-lg p-4 text-center">
                        <p className="text-3xl font-heading font-bold text-white">4x</p>
                        <p className="text-xs text-text-secondary">Gap to UK</p>
                    </div>
                </div>

                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-xs text-text-secondary">
                    <span className="text-green-400 font-bold">Resilience:</span> Despite domestic participation dropping
                    from 61% to 15%, the Netherlands maintained its #4 position in European VC markets, demonstrating
                    ecosystem attractiveness to foreign investors.
                </div>
            </div>
        </div>
    );
}

