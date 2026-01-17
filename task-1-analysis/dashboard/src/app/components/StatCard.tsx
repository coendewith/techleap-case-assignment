import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  suffix?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label: string;
  };
}

export default function StatCard({ label, value, suffix = "", icon: Icon, trend }: StatCardProps) {
  return (
    <div className="bg-bg-secondary/50 border border-white/5 rounded-xl p-6 relative overflow-hidden group hover:border-accent-red/30 transition-colors">
      {Icon && (
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-text-primary">
          <Icon size={48} strokeWidth={1.5} />
        </div>
      )}
      <p className="text-text-secondary text-xs uppercase tracking-wider font-semibold mb-2">{label}</p>
      <div className="flex items-baseline gap-1">
        <p className="text-3xl font-heading font-bold text-text-primary">
          {typeof value === "number" ? value.toLocaleString("en-US") : value}
        </p>
        {suffix && <span className="text-sm text-text-muted font-medium">{suffix}</span>}
      </div>
      {trend && (
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <span className={trend.value >= 0 ? "text-green-400" : "text-accent-red"}>
            {trend.value > 0 ? "+" : ""}{trend.value}%
          </span>
          <span className="text-text-muted">{trend.label}</span>
        </div>
      )}
    </div>
  );
}
