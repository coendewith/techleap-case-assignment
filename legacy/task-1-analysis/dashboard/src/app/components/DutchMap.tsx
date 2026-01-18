"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Euro,
    Building2,
    Dna,
    Zap,
    MapPin
} from "lucide-react";

interface ProvinceStat {
    province: string;
    company_count: number;
    total_funding: number;
    deep_tech_count: number;
    deep_tech_funding: number;
    deep_tech_intensity: number;
    highlight: string;
}

interface DutchMapProps {
    data: ProvinceStat[];
}

const DutchMap: React.FC<DutchMapProps> = ({ data }) => {
    const [selectedProvince, setSelectedProvince] = useState<ProvinceStat | null>(null);

    // Helper to find data for a province
    const getProvData = (name: string) => {
        return data.find((p) => p.province === name) || {
            province: name,
            company_count: 0,
            total_funding: 0,
            deep_tech_count: 0,
            deep_tech_funding: 0,
            deep_tech_intensity: 0,
            highlight: "No Data"
        };
    };

    // Helper to get color intensity
    const getColor = (stats: ProvinceStat) => {
        if (stats.company_count === 0) return "bg-slate-800 text-slate-500 border-slate-700";
        if (stats.total_funding > 1000000000) return "bg-red-600 text-white border-red-400"; // Hot (>1B)
        if (stats.total_funding > 100000000) return "bg-red-500/80 text-white border-red-400"; // Warm (>100M)
        if (stats.total_funding > 10000000) return "bg-red-500/50 text-white border-red-400"; // Moderate (>10M)
        return "bg-slate-700 text-slate-300 border-slate-600"; // Low activity
    };

    // Abbreviations mapping
    const abbr: Record<string, string> = {
        "Friesland": "FR", "Groningen": "GR", "Drenthe": "DR",
        "North Holland": "NH", "Flevoland": "FL", "Overijssel": "OV",
        "South Holland": "ZH", "Utrecht": "UT", "Gelderland": "GE",
        "Zeeland": "ZE", "North Brabant": "NB", "Limburg": "LI"
    };

    const renderTile = (name: string) => {
        const stats = getProvData(name);
        return (
            <div
                className={`
          relative w-full aspect-square rounded-lg border-2 
          flex flex-col items-center justify-center cursor-pointer transition-all duration-200
          hover:scale-105 hover:z-10 hover:shadow-lg hover:border-white
          ${getColor(stats)}
          ${selectedProvince?.province === name ? 'ring-2 ring-white scale-105 z-20 shadow-xl' : ''}
        `}
                onClick={() => setSelectedProvince(stats)}
            >
                <span className="text-xl font-bold">{abbr[name]}</span>
                <span className="text-xs font-mono mt-1 opacity-80">{stats.company_count}</span>
            </div>
        );
    };

    const formatCurrency = (val: number) => {
        if (val >= 1e9) return `€${(val / 1e9).toFixed(1)}B`;
        if (val >= 1e6) return `€${(val / 1e6).toFixed(1)}M`;
        return `€${(val / 1e3).toFixed(0)}K`;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* MAP GRID */}
            <div>
                <div className="bg-bg-secondary p-8 rounded-2xl border border-white/5">
                    <h3 className="text-lg font-bold text-white mb-6 uppercase tracking-wider flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-accent-red" />
                        Regional Intensity Map
                    </h3>

                    {/* NL TILE GRID LAYOUT (4 cols x 4 rows) */}
                    <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
                        {/* ROW 1 */}
                        <div className="col-span-1"></div>
                        <div className="col-span-1"></div>
                        <div className="col-span-1">{renderTile("Friesland")}</div>
                        <div className="col-span-1">{renderTile("Groningen")}</div>

                        {/* ROW 2 */}
                        <div className="col-span-1"></div>
                        <div className="col-span-1">{renderTile("North Holland")}</div>
                        <div className="col-span-1">{renderTile("Flevoland")}</div>
                        <div className="col-span-1">{renderTile("Drenthe")}</div>

                        {/* ROW 3 */}
                        <div className="col-span-1">{renderTile("South Holland")}</div>
                        <div className="col-span-1">{renderTile("Utrecht")}</div>
                        <div className="col-span-1">{renderTile("Gelderland")}</div>
                        <div className="col-span-1">{renderTile("Overijssel")}</div>

                        {/* ROW 4 */}
                        <div className="col-span-1">{renderTile("Zeeland")}</div>
                        <div className="col-span-1">{renderTile("North Brabant")}</div>
                        <div className="col-span-1">{renderTile("Limburg")}</div>
                        <div className="col-span-1 relative">
                            {/* Legend in the empty corner */}
                            <div className="absolute inset-0 flex flex-col justify-end text-[10px] text-text-muted p-1">
                                <div className="flex items-center gap-1"><div className="w-2 h-2 bg-red-600 rounded-sm"></div> &gt;€1B</div>
                                <div className="flex items-center gap-1 mt-0.5"><div className="w-2 h-2 bg-red-500/50 rounded-sm"></div> &gt;€10M</div>
                                <div className="flex items-center gap-1 mt-0.5"><div className="w-2 h-2 bg-slate-700 rounded-sm"></div> Low</div>
                            </div>
                        </div>
                    </div>
                    <p className="text-center text-xs text-text-muted mt-6">
                        Click a province for detailed deep dive analysis
                    </p>
                </div>
            </div>

            {/* DETAIL CARD */}
            <div className="h-full">
                <AnimatePresence mode="wait">
                    {selectedProvince ? (
                        <motion.div
                            key={selectedProvince.province}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-bg-primary border border-white/10 rounded-2xl p-6 h-full shadow-2xl relative overflow-hidden"
                        >

                            {/* Header */}
                            <div className="flex items-start justify-between mb-8 relative z-10">
                                <div>
                                    <div className="text-sm text-text-muted uppercase tracking-widest mb-1">Province Analysis</div>
                                    <h2 className="text-3xl font-heading font-bold text-white">{selectedProvince.province}</h2>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className="px-3 py-1 bg-accent-blue/10 text-accent-blue rounded-full text-sm font-medium border border-accent-blue/20">
                                            {selectedProvince.highlight}
                                        </span>
                                    </div>
                                </div>
                                {/* Background Insight Icon */}
                                <div className="p-4 bg-white/5 rounded-2xl">
                                    {selectedProvince.deep_tech_intensity > 25 ? <Dna className="w-8 h-8 text-green-400" /> : <Building2 className="w-8 h-8 text-blue-400" />}
                                </div>
                            </div>

                            {/* Main Key Stats */}
                            <div className="grid grid-cols-2 gap-4 mb-8 relative z-10">
                                <div className="p-4 bg-bg-secondary rounded-xl">
                                    <div className="flex items-center gap-2 text-text-secondary text-sm mb-1">
                                        <Building2 className="w-4 h-4" /> Startups
                                    </div>
                                    <div className="text-2xl font-bold text-white">{selectedProvince.company_count}</div>
                                </div>
                                <div className="p-4 bg-bg-secondary rounded-xl">
                                    <div className="flex items-center gap-2 text-text-secondary text-sm mb-1">
                                        <Euro className="w-4 h-4" /> Total Funding
                                    </div>
                                    <div className="text-2xl font-bold text-white">{formatCurrency(selectedProvince.total_funding)}</div>
                                </div>
                                <div className="p-4 bg-bg-secondary rounded-xl border border-green-500/20">
                                    <div className="flex items-center gap-2 text-green-400 text-sm mb-1">
                                        <Dna className="w-4 h-4" /> Deep Tech
                                    </div>
                                    <div className="text-2xl font-bold text-white">{selectedProvince.deep_tech_count}</div>
                                    <div className="text-xs text-text-muted mt-1">{selectedProvince.deep_tech_intensity.toFixed(1)}% intensity</div>
                                </div>
                                <div className="p-4 bg-bg-secondary rounded-xl border border-green-500/20">
                                    <div className="flex items-center gap-2 text-green-400 text-sm mb-1">
                                        <Euro className="w-4 h-4" /> Deep Tech Cap
                                    </div>
                                    <div className="text-2xl font-bold text-white">{formatCurrency(selectedProvince.deep_tech_funding)}</div>
                                </div>
                            </div>

                            {/* Generated Insight Text */}
                            <div className="relative z-10 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                <h4 className="flex items-center gap-2 text-blue-400 font-bold mb-2">
                                    <Zap className="w-4 h-4" /> Regional Insight
                                </h4>
                                <p className="text-sm text-text-secondary leading-relaxed">
                                    {selectedProvince.company_count === 0
                                        ? "No data available for this region in the 2005-2014 dataset."
                                        : selectedProvince.deep_tech_intensity > 30
                                            ? `${selectedProvince.province} shows exceptional Deep Tech specialization, with ${(selectedProvince.deep_tech_intensity).toFixed(0)}% of companies in advanced sectors.`
                                            : selectedProvince.total_funding > 100000000
                                                ? `A major economic engine. Capital is concentrated here, driving significant scale-up activity.`
                                                : `An emerging cluster with ${selectedProvince.company_count} active startups. Potential for growth with targeted ecosystem support.`
                                    }
                                </p>
                            </div>

                            {/* Decorative Background Blob */}
                            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-accent-blue/10 rounded-full blur-3xl pointer-events-none" />

                        </motion.div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-white/5 rounded-2xl bg-bg-secondary/50">
                            <MapPin className="w-12 h-12 text-slate-600 mb-4" />
                            <h3 className="text-xl font-bold text-slate-400">Select a Province</h3>
                            <p className="text-slate-500 max-w-xs mx-auto mt-2">
                                Click on the map grid to view detailed strategy insights for that region.
                            </p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default DutchMap;
