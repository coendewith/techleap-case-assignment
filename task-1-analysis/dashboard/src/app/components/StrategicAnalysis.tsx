"use client";

import { useState, useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Cell,
    ComposedChart,
    Line,
    PieChart,
    Pie
} from "recharts";
import { Target, Zap, MapPin, Layers, Search, ChevronDown, Building2, Euro } from "lucide-react";

interface StrategicSplit {
    funding: {
        "Deep Tech": number;
        "Digital": number;
        "Other": number;
    };
    companies: {
        "Deep Tech": number;
        "Digital": number;
        "Other": number;
    };
}

interface HubData {
    city: string;
    company_count: number;
    total_funding: number;
    deep_tech_intensity_count: number;
    deep_tech_intensity_funding: number;
}

interface GeoData {
    city?: string;
    province?: string;
    company_count: number;
    total_funding: number;
    deep_tech_count: number;
    deep_tech_funding: number;
    deep_tech_intensity: number;
}

interface StrategicAnalysisProps {
    data: {
        split: StrategicSplit;
        hubs: HubData[];
        all_cities: GeoData[];
        provinces: GeoData[];
    };
}

const formatCurrency = (value: number) => {
    if (value >= 1e9) return `€${(value / 1e9).toFixed(1)}B`;
    if (value >= 1e6) return `€${(value / 1e6).toFixed(1)}M`;
    return `€${(value / 1e3).toFixed(0)}K`;
};

export default function StrategicAnalysis({ data }: StrategicAnalysisProps) {
    const [scope, setScope] = useState<'city' | 'province'>('city');
    const [selectedId, setSelectedId] = useState<string>("Amsterdam");
    const [searchTerm, setSearchTerm] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    if (!data) return null;

    // Region Explorer Logic
    const currentList = scope === 'city' ? data.all_cities : data.provinces;

    const filteredList = useMemo(() => {
        return currentList.filter(item => {
            const name = scope === 'city' ? item.city : item.province;
            return name?.toLowerCase().includes(searchTerm.toLowerCase());
        });
    }, [currentList, searchTerm, scope]);

    const selectedItem = useMemo(() => {
        return currentList.find(item => (scope === 'city' ? item.city : item.province) === selectedId) || currentList[0];
    }, [currentList, selectedId, scope]);

    // Hub Chart Data
    const hubChartData = [...data.hubs]
        .sort((a, b) => b.total_funding - a.total_funding)
        .map(hub => ({
            ...hub,
            intensity: Math.round(hub.deep_tech_intensity_funding)
        }));

    // Split Data
    const splitData = [
        { name: "Deep Tech", value: data.split.funding["Deep Tech"], color: "#ee3124" },
        { name: "Digital", value: data.split.funding["Digital"], color: "#38BDF8" },
        { name: "Other", value: data.split.funding["Other"], color: "#64748b" }
    ];

    return (
        <div className="space-y-8">
            <div className="bg-bg-secondary rounded-2xl border border-white/5 p-6 hover:border-accent-red/20 transition-colors">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
                            <Target className="text-accent-red" size={24} />
                            Strategic Deep Tech Analysis
                        </h2>
                        <p className="text-sm text-text-secondary mt-1">
                            Alignment with "State of Dutch Tech" Strongholds
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* 1. Deep Tech Quality Gap */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-bg-tertiary rounded-xl p-5 border border-white/5">
                            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                                <Layers size={16} className="text-text-muted" />
                                Funding Composition
                            </h3>
                            <div className="h-[180px] w-full relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={splitData}
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {splitData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value: any) => formatCurrency(value as number)}
                                            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                        />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-[60%] text-center">
                                    <div className="text-2xl font-bold text-white">43%</div>
                                    <div className="text-[10px] text-text-secondary uppercase tracking-wider">Deep Tech</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Hub Analysis */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2">
                                <MapPin size={16} className="text-text-muted" />
                                Top Hubs: Deep Tech Intensity
                            </h3>
                            <div className="flex items-center gap-4 text-xs">
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                                    <span className="text-text-muted">Total Funding</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <div className="w-2 h-2 rounded-full bg-accent-red"></div>
                                    <span className="text-white font-medium">Deep Tech %</span>
                                </div>
                            </div>
                        </div>

                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <ComposedChart data={hubChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <XAxis dataKey="city" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <YAxis yAxisId="left" orientation="left" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `€${(v / 1e6).toFixed(0)}M`} />
                                    <YAxis yAxisId="right" orientation="right" tick={{ fill: '#ee3124', fontSize: 10 }} axisLine={false} tickLine={false} unit="%" domain={[0, 100]} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#f8fafc' }}
                                        formatter={(value: any, name: any) => {
                                            if (name === "intensity") return [`${value}%`, "Deep Tech Share"];
                                            return [formatCurrency(value as number), "Total Funding"];
                                        }}
                                    />
                                    <Bar yAxisId="left" dataKey="total_funding" fill="#334155" radius={[4, 4, 0, 0]} barSize={40} />
                                    <Line yAxisId="right" type="monotone" dataKey="intensity" stroke="#ee3124" strokeWidth={3} dot={{ fill: "#ee3124", r: 4, stroke: "#0f172a" }} />
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* NEW: Region Explorer */}
            <div className="bg-bg-secondary rounded-2xl border border-white/5 p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
                            <Search className="text-accent-blue" size={24} />
                            Region Explorer
                        </h2>
                        <p className="text-sm text-text-secondary mt-1">
                            Explore Deep Tech performance by City or Province
                        </p>
                    </div>

                    {/* Controls */}
                    <div className="flex gap-2">
                        <div className="flex bg-bg-tertiary rounded-lg p-1 border border-white/5">
                            <button
                                onClick={() => { setScope('city'); setSearchTerm(""); }}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${scope === 'city' ? 'bg-accent-blue text-white shadow-sm' : 'text-text-secondary hover:text-white'}`}
                            >
                                City
                            </button>
                            <button
                                onClick={() => { setScope('province'); setSearchTerm(""); }}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${scope === 'province' ? 'bg-accent-blue text-white shadow-sm' : 'text-text-secondary hover:text-white'}`}
                            >
                                Province
                            </button>
                        </div>

                        <div className="relative">
                            <div
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center justify-between w-[200px] px-3 py-2 bg-bg-tertiary border border-white/10 rounded-lg cursor-pointer hover:border-accent-blue/50 text-sm text-white"
                            >
                                <span className="truncate">{selectedId}</span>
                                <ChevronDown size={14} className="text-text-muted" />
                            </div>

                            {dropdownOpen && (
                                <div className="absolute top-full right-0 mt-2 w-[240px] max-h-[300px] overflow-y-auto bg-bg-tertiary border border-white/10 rounded-xl shadow-xl z-50 p-2">
                                    <input
                                        type="text"
                                        autoFocus
                                        placeholder="Search..."
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm text-white mb-2 focus:outline-none focus:border-accent-blue"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <div className="space-y-1">
                                        {filteredList.map((item) => {
                                            const name = scope === 'city' ? item.city : item.province;
                                            return (
                                                <div
                                                    key={name}
                                                    onClick={() => {
                                                        setSelectedId(name || "");
                                                        setDropdownOpen(false);
                                                    }}
                                                    className={`px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${name === selectedId ? 'bg-accent-blue/20 text-accent-blue' : 'text-text-secondary hover:bg-white/5 hover:text-white'}`}
                                                >
                                                    {name}
                                                </div>
                                            );
                                        })}
                                        {filteredList.length === 0 && (
                                            <div className="px-3 py-2 text-xs text-text-muted text-center">No results found</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Selected Region Stats */}
                {selectedItem && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-bg-tertiary rounded-xl border border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                                <MapPin size={16} className="text-accent-blue" />
                                <span className="text-xs text-text-muted uppercase tracking-wider">Location</span>
                            </div>
                            <div className="text-lg font-bold text-white truncate">
                                {scope === 'city' ? selectedItem.city : selectedItem.province}
                            </div>
                            <div className="text-xs text-text-secondary mt-1">
                                {scope === 'city' ? selectedItem.province : 'Netherlands'}
                            </div>
                        </div>

                        <div className="p-4 bg-bg-tertiary rounded-xl border border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                                <Euro size={16} className="text-green-400" />
                                <span className="text-xs text-text-muted uppercase tracking-wider">Total Funding</span>
                            </div>
                            <div className="text-lg font-bold text-white">
                                {formatCurrency(selectedItem.total_funding)}
                            </div>
                            <div className="text-xs text-text-secondary mt-1">
                                {selectedItem.company_count} Companies
                            </div>
                        </div>

                        <div className="p-4 bg-bg-tertiary rounded-xl border border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                                <Zap size={16} className="text-accent-red" />
                                <span className="text-xs text-text-muted uppercase tracking-wider">Deep Tech Intensity</span>
                            </div>
                            <div className="text-lg font-bold text-white">
                                {selectedItem.deep_tech_intensity.toFixed(1)}%
                            </div>
                            <div className="text-xs text-text-secondary mt-1">
                                of companies are Deep Tech
                            </div>
                        </div>

                        <div className="p-4 bg-accent-red/10 rounded-xl border border-accent-red/20">
                            <div className="flex items-center gap-2 mb-2">
                                <Building2 size={16} className="text-accent-red" />
                                <span className="text-xs text-accent-red uppercase tracking-wider">Deep Tech Funding</span>
                            </div>
                            <div className="text-lg font-bold text-white">
                                {formatCurrency(selectedItem.deep_tech_funding)}
                            </div>
                            <div className="text-xs text-accent-red/80 mt-1">
                                {selectedItem.deep_tech_count} Deep Tech ventures
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
