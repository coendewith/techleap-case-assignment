import {
    TrendingUp,
    Target,
    ShieldAlert,
    FileText
} from "lucide-react";

interface PolicyContext {
    label: string;
    value: string;
    detail: string;
    icon: any;
}

const contexts: PolicyContext[] = [
    {
        label: "Investment Gap",
        value: "€151-187B",
        detail: "needed by 2035 for growth",
        icon: TrendingUp
    },
    {
        label: "Critical Tech",
        value: "4 domains",
        detail: "AI, Health, Energy, Security",
        icon: ShieldAlert
    },
    {
        label: "Productivity",
        value: "1.5-2%",
        detail: "annual growth target",
        icon: Target
    },
];

export default function WenninkInsights() {
    return (
        <div className="bg-bg-tertiary/50 border border-white/5 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <FileText size={16} className="text-text-muted" />
                    <h3 className="text-sm font-heading font-semibold text-white">
                        Policy Context (Wennink Report, Dec 2025)
                    </h3>
                </div>
                <span className="text-xs text-text-muted">Source: rapport_wennink_12december2025.pdf</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
                {contexts.map((ctx) => (
                    <div key={ctx.label} className="text-center group">
                        <div className="flex justify-center mb-2 text-text-muted group-hover:text-accent-red transition-colors">
                            <ctx.icon size={24} />
                        </div>
                        <p className="text-lg font-heading font-bold text-white">{ctx.value}</p>
                        <p className="text-xs text-text-secondary">{ctx.label}</p>
                        <p className="text-xs text-text-muted">{ctx.detail}</p>
                    </div>
                ))}
            </div>
            <p className="mt-4 text-xs text-text-muted border-t border-white/5 pt-3">
                Note: The Crunchbase dataset covers 2005-2014. Policy connections are based on structural patterns.
            </p>
        </div>
    );
}
