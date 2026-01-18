import { Zap, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";

interface Recommendation {
    priority: number;
    title: string;
    description: string;
    impact: "High" | "Medium" | "Low";
    effort: "Quick Win" | "Substantial";
}

const recommendations: Recommendation[] = [
    {
        priority: 1,
        title: "Bridge the Valley of Death",
        description: "Create targeted bridge funding programs for post-seed, pre-Series A companies to improve conversion rates from 17% to 25%+.",
        impact: "High",
        effort: "Substantial",
    },
    {
        priority: 2,
        title: "Incentivize Follow-on Investment",
        description: "Tax incentives for investors who provide multiple funding rounds to the same company, increasing retention through later stages.",
        impact: "High",
        effort: "Substantial",
    },
    {
        priority: 3,
        title: "Deeptech Priority Support",
        description: "Prioritize deeptech (AI, biotech, semiconductors) given higher scale-up ratios aligned with Dutch sector strengths.",
        impact: "High",
        effort: "Quick Win",
    },
    {
        priority: 4,
        title: "Exit Preparation Programs",
        description: "Support programs that prepare companies for acquisition or IPO - successful exits attract more capital to the ecosystem.",
        impact: "Medium",
        effort: "Substantial",
    },
];

export default function PolicyRecommendations() {
    return (
        <div className="bg-bg-secondary border border-white/5 rounded-2xl p-8">
            <div className="flex items-start justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-heading font-bold text-white mb-2">
                        Policy Recommendations
                    </h2>
                    <p className="text-text-secondary text-sm">
                        Prioritized interventions based on data analysis
                    </p>
                </div>
                <div className="px-3 py-1 bg-bg-tertiary rounded-full text-xs font-mono text-text-secondary flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-accent-red" />
                    ACTIONABLE INSIGHTS
                </div>
            </div>

            <div className="space-y-4">
                {recommendations.map((rec) => (
                    <div
                        key={rec.priority}
                        className="flex items-start gap-4 p-4 bg-bg-primary/50 border border-white/5 rounded-xl hover:border-white/10 transition-colors group"
                    >
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-red/10 text-accent-red flex items-center justify-center font-heading font-bold text-sm border border-accent-red/20 group-hover:bg-accent-red/20 transition-colors">
                            {rec.priority}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-heading font-semibold text-white text-sm">
                                    {rec.title}
                                </h3>
                                <div className="flex items-center gap-2 ml-auto">
                                    <span
                                        className={`flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${rec.impact === "High"
                                            ? "bg-green-500/10 text-green-400 border border-green-500/20"
                                            : rec.impact === "Medium"
                                                ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20"
                                                : "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                                            }`}
                                    >
                                        <TrendingUp size={10} />
                                        {rec.impact} Impact
                                    </span>
                                    <span
                                        className={`flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${rec.effort === "Quick Win"
                                            ? "bg-bg-tertiary text-blue-400 border border-blue-500/20"
                                            : "bg-bg-tertiary text-purple-400 border border-purple-500/20"
                                            }`}
                                    >
                                        <Zap size={10} />
                                        {rec.effort}
                                    </span>
                                </div>
                            </div>
                            <p className="text-text-secondary text-xs leading-relaxed">
                                {rec.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
