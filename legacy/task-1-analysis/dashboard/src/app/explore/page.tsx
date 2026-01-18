"use client";

import { useEffect, useState } from "react";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Cell,
    AreaChart,
    Area,
    ReferenceLine,
} from "recharts";
import {
    Layers,
    Code,
    Dna,
    Leaf,
    Heart,
    Cpu,
    ArrowLeft,
} from "lucide-react";
import FunnelComparison from "../components/FunnelComparison";
import DutchMap from "../components/DutchMap";
import ScaleupComparison from "../components/ScaleupComparison";
import StrategicAnalysis from "../components/StrategicAnalysis";
import RegionalComparison from "../components/RegionalComparison";
import CohortAnalysis from "../components/CohortAnalysis";
import strategicAnalysisData from "../../../public/data/strategic_analysis.json";
import Link from "next/link";

// --- Interfaces ---

interface SurvivalData {
    round_name: string;
    global_survival_rate: number;
    dutch_survival_rate: number;
    uk_survival_rate?: number;
    germany_survival_rate?: number;
    france_survival_rate?: number;
}

interface SectorData {
    sector: string;
    company_count: number;
    total_funding: number;
    avg_funding: number;
    dutch_company_count: number;
}

interface TimelineData {
    year: number;
    company_count: number;
    total_funding: number;
}

interface OutcomeData {
    rounds: number;
    operating: number;
    acquired: number;
    closed: number;
}

interface PeerData {
    country: string;
    country_name: string;
    avg_funding: number;
    operating_rate: number;
}

interface DeepTechData {
    dutch: {
        deep_tech: { count: number; acquired_rate: number; avg_funding: number };
        digital: { count: number; acquired_rate: number; avg_funding: number };
    };
    headline_insights: {
        deep_tech_acquisition_advantage: number;
        dutch_vs_global_deep_tech_delta: number;
    };
}

// --- Helpers ---

const getSectorIcon = (sector: string) => {
    const s = sector.toLowerCase();
    if (s.includes("bio")) return <Dna size={18} />;
    if (s.includes("software")) return <Code size={18} />;
    if (s.includes("clean") || s.includes("energy")) return <Leaf size={18} />;
    if (s.includes("health")) return <Heart size={18} />;
    if (s.includes("hardware")) return <Cpu size={18} />;
    return <Layers size={18} />;
};

const formatCurrency = (value: number) => {
    if (value >= 1e9) return `€${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `€${(value / 1e6).toFixed(1)}M`;
    return `€${(value / 1e3).toFixed(0)}K`;
};

// --- Component ---

export default function ExplorePage() {
    const [survival, setSurvival] = useState<SurvivalData[]>([]);
    const [sectors, setSectors] = useState<SectorData[]>([]);
    const [timeline, setTimeline] = useState<TimelineData[]>([]);
    const [outcomes, setOutcomes] = useState<OutcomeData[]>([]);
    const [peers, setPeers] = useState<PeerData[]>([]);
    const [funnelComparison, setFunnelComparison] = useState<any>(null);
    const [cohorts, setCohorts] = useState<any[]>([]);
    const [regional, setRegional] = useState<any[]>([]);
    const [deepTech, setDeepTech] = useState<DeepTechData | null>(null);

    useEffect(() => {
        fetch("/data/survival.json").then((res) => res.json()).then(setSurvival);
        fetch("/data/sectors.json").then((res) => res.json()).then(setSectors);
        fetch("/data/timeline.json").then((res) => res.json()).then(setTimeline);
        fetch("/data/outcomes.json").then((res) => res.json()).then(setOutcomes);
        fetch("/data/peers.json").then((res) => res.json()).then(setPeers);
        fetch("/data/funnel_comparison.json").then((res) => res.json()).then(setFunnelComparison);
        fetch("/data/cohorts.json").then((res) => res.json()).then(setCohorts);
        fetch("/data/regional.json").then((res) => res.json()).then(setRegional);
        fetch("/data/deep_tech_analysis.json").then((res) => res.json()).then(setDeepTech);
    }, []);

    return (
        <div className="space-y-16">
            {/* Header */}
            <header className="border-b border-white/10 pb-8">
                <Link href="/" className="inline-flex items-center gap-2 text-text-secondary hover:text-white text-sm mb-4 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Briefing
                </Link>
                <div className="flex items-center gap-2 text-blue-400 text-sm font-medium mb-4">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    EXPLORATION MODE
                </div>
                <h1 className="text-4xl font-heading font-bold text-white mb-4">
                    Full Dataset Exploration
                </h1>
                <p className="text-text-secondary text-lg">
                    Expand on ideas, brainstorm insights, and dig deeper into the data
                </p>
            </header>

            {/* Deep Tech Advantage */}
            {deepTech && (
                <section className="bg-gradient-to-br from-green-900/20 to-bg-secondary border border-green-500/20 rounded-2xl p-8">
                    <h2 className="text-2xl font-heading font-bold text-white mb-6 flex items-center gap-3">
                        <Dna className="w-6 h-6 text-green-400" />
                        Deep Tech vs Digital Analysis
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-bg-primary/60 border border-green-500/30 rounded-xl p-6">
                            <p className="text-sm text-green-400 font-medium mb-2">DEEP TECH</p>
                            <p className="text-3xl font-heading font-bold text-white">{deepTech.dutch.deep_tech.acquired_rate}%</p>
                            <p className="text-sm text-text-secondary">Acquisition Rate</p>
                            <p className="text-xs text-text-muted mt-2">{deepTech.dutch.deep_tech.count} companies</p>
                        </div>
                        <div className="bg-bg-primary/60 border border-blue-500/30 rounded-xl p-6">
                            <p className="text-sm text-blue-400 font-medium mb-2">DIGITAL</p>
                            <p className="text-3xl font-heading font-bold text-white">{deepTech.dutch.digital.acquired_rate}%</p>
                            <p className="text-sm text-text-secondary">Acquisition Rate</p>
                            <p className="text-xs text-text-muted mt-2">{deepTech.dutch.digital.count} companies</p>
                        </div>
                        <div className="bg-bg-primary/60 border border-amber-500/30 rounded-xl p-6 flex flex-col justify-center">
                            <p className="text-lg text-white font-medium">
                                Deep Tech has <span className="text-green-400 font-bold">{deepTech.headline_insights.deep_tech_acquisition_advantage}x</span> higher exits
                            </p>
                            <p className="text-xs text-text-secondary mt-2">
                                +{deepTech.headline_insights.dutch_vs_global_deep_tech_delta}pp vs global
                            </p>
                        </div>
                    </div>
                </section>
            )}
            {/* Dutch Map - NEW! */}
            <section>
                <h2 className="text-2xl font-heading font-bold text-white mb-6">Regional Deep Dive</h2>
                <DutchMap data={strategicAnalysisData.provinces} />
            </section>

            {/* Funnel Comparison */}
            {funnelComparison && <FunnelComparison data={funnelComparison} />}

            {/* Scaleup Comparison */}
            <ScaleupComparison />

            {/* Survival Curve - Full European Comparison */}
            <section className="bg-bg-secondary border border-white/5 rounded-2xl p-8">
                <h2 className="text-2xl font-heading font-bold text-white mb-6">Survival Curve: European Comparison</h2>
                <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={survival}>
                            <XAxis dataKey="round_name" tick={{ fill: "#94A3B8", fontSize: 12 }} />
                            <YAxis tick={{ fill: "#94A3B8" }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#f8fafc" }}
                                formatter={(v: any, n: any) => [`${Number(v).toFixed(1)}%`, n.replace("_survival_rate", "").replace("_", " ")]}
                            />
                            <Legend />
                            <Line type="monotone" dataKey="dutch_survival_rate" stroke="#ee3124" strokeWidth={4} name="Netherlands" dot={{ fill: "#ee3124", r: 5 }} />
                            <Line type="monotone" dataKey="uk_survival_rate" stroke="#a855f7" strokeWidth={2} name="UK" dot={{ fill: "#a855f7", r: 3 }} />
                            <Line type="monotone" dataKey="germany_survival_rate" stroke="#f59e0b" strokeWidth={2} name="Germany" dot={{ fill: "#f59e0b", r: 3 }} />
                            <Line type="monotone" dataKey="france_survival_rate" stroke="#3b82f6" strokeWidth={2} name="France" dot={{ fill: "#3b82f6", r: 3 }} />
                            <Line type="monotone" dataKey="global_survival_rate" stroke="#64748b" strokeWidth={2} strokeDasharray="4 4" name="Global" dot={false} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* Strategic Analysis */}
            <StrategicAnalysis data={strategicAnalysisData} />

            {/* Top Sectors */}
            <section className="bg-bg-secondary border border-white/5 rounded-2xl p-8">
                <h2 className="text-2xl font-heading font-bold text-white mb-6">Top Ecosystem Sectors</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {sectors.slice(0, 8).map((sector, i) => (
                        <div key={sector.sector} className="p-4 bg-bg-primary rounded-xl border border-white/5 hover:border-accent-red/30 transition-colors">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-accent-red">{getSectorIcon(sector.sector)}</span>
                                <span className="text-xs text-text-muted">#{i + 1}</span>
                            </div>
                            <p className="font-bold text-white text-sm truncate">{sector.sector}</p>
                            <p className="text-xs text-text-secondary">{sector.company_count.toLocaleString()} companies</p>
                            <p className="text-xs text-accent-blue font-mono mt-1">{formatCurrency(sector.avg_funding)} avg</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Outcomes by Rounds */}
            <section className="bg-bg-secondary border border-white/5 rounded-2xl p-8">
                <h2 className="text-2xl font-heading font-bold text-white mb-6">Outcomes by Funding Rounds</h2>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={outcomes}>
                            <XAxis dataKey="rounds" tick={{ fill: "#94A3B8" }} />
                            <YAxis tick={{ fill: "#94A3B8" }} />
                            <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#f8fafc" }} />
                            <Legend />
                            <Bar dataKey="operating" stackId="a" fill="#3182ce" name="Operating" />
                            <Bar dataKey="acquired" stackId="a" fill="#38a169" name="Acquired" />
                            <Bar dataKey="closed" stackId="a" fill="#e53e3e" name="Closed" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* Peer Benchmark */}
            <section className="bg-bg-secondary border border-white/5 rounded-2xl p-8">
                <h2 className="text-2xl font-heading font-bold text-white mb-6">Peer Ecosystem Comparison</h2>
                <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={peers}>
                            <XAxis dataKey="country_name" tick={{ fill: "#94A3B8", fontSize: 11 }} />
                            <YAxis yAxisId="left" tick={{ fill: "#94A3B8" }} />
                            <YAxis yAxisId="right" orientation="right" tick={{ fill: "#94A3B8" }} />
                            <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#f8fafc" }} />
                            <Legend />
                            <Bar yAxisId="left" dataKey="avg_funding" fill="#38BDF8" name="Avg Funding" radius={[4, 4, 0, 0]}>
                                {peers.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.country === "NLD" ? "#ee3124" : "#38BDF8"} />
                                ))}
                            </Bar>
                            <Bar yAxisId="right" dataKey="operating_rate" fill="#38a169" name="Operating Rate (%)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* Timeline */}
            <section className="bg-bg-secondary border border-white/5 rounded-2xl p-8">
                <h2 className="text-2xl font-heading font-bold text-white mb-6">Funding Activity Over Time (2005-2014)</h2>
                <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={timeline}>
                            <defs>
                                <linearGradient id="colorCompanies" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ee3124" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#ee3124" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="year" tick={{ fill: "#94A3B8" }} />
                            <YAxis yAxisId="left" tick={{ fill: "#94A3B8" }} />
                            <YAxis yAxisId="right" orientation="right" tick={{ fill: "#94A3B8" }} tickFormatter={(v) => `€${(v / 1e9).toFixed(0)}B`} />
                            <Tooltip contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#f8fafc" }} />
                            <Legend />
                            <Area yAxisId="left" type="monotone" dataKey="company_count" stroke="#ee3124" fillOpacity={0.6} fill="url(#colorCompanies)" name="Companies" />
                            <Line yAxisId="right" type="monotone" dataKey="total_funding" stroke="#38a169" strokeWidth={3} name="Total Funding" dot={{ fill: "#38a169", r: 4 }} />
                            <ReferenceLine x={2008} stroke="#ef4444" strokeDasharray="3 3" label={{ value: "2008 Crisis", fill: "#ef4444", fontSize: 10 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </section>

            {/* Regional Comparison */}
            {regional.length > 0 && <RegionalComparison data={regional} />}

            {/* Cohort Analysis */}
            {cohorts.length > 0 && <CohortAnalysis data={cohorts} />}

            {/* Footer */}
            <footer className="text-center text-sm text-text-muted border-t border-white/5 pt-8">
                <Link href="/" className="text-accent-red hover:underline">← Back to Executive Briefing</Link>
            </footer>
        </div>
    );
}
