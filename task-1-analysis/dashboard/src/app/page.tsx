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
  ReferenceLine,
} from "recharts";
import {
  AlertTriangle,
  TrendingUp,
  Building2,
  HelpCircle,
  ArrowRight,
  Database,
  Users,
  MessageSquare,
  Compass,
} from "lucide-react";
import Link from "next/link";

// --- Interfaces ---

interface OverviewData {
  total_companies: number;
  dutch_companies: number;
  dutch_operating_rate: number;
  dutch_avg_rounds: number;
  avg_rounds: number;
  operating_rate: number;
}

interface SurvivalData {
  round_name: string;
  global_survival_rate: number;
  dutch_survival_rate: number;
  usa_survival_rate: number;
  uk_survival_rate: number;
}

interface OutcomeData {
  rounds: number;
  operating: number;
  acquired: number;
  closed: number;
}

interface DeepTechData {
  time_to_scale: {
    single_round_pct: number;
    single_round_count: number;
  };
}

// --- Component ---

export default function HomePage() {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [survival, setSurvival] = useState<SurvivalData[]>([]);
  const [outcomes, setOutcomes] = useState<OutcomeData[]>([]);
  const [deepTech, setDeepTech] = useState<DeepTechData | null>(null);

  useEffect(() => {
    fetch("/data/overview.json").then((res) => res.json()).then(setOverview);
    fetch("/data/survival.json").then((res) => res.json()).then(setSurvival);
    fetch("/data/outcomes.json").then((res) => res.json()).then(setOutcomes);
    fetch("/data/deep_tech_analysis.json").then((res) => res.json()).then(setDeepTech);
  }, []);

  if (!overview || !deepTech) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-pulse text-text-muted font-heading text-xl">LOADING...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-8">

      {/* Header - Briefing Style */}
      <header className="border-b border-white/10 pb-8">
        <div className="flex items-center gap-2 text-red-400 text-sm font-medium mb-4">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          DATA BRIEFING
        </div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4">
          Dutch Startup Ecosystem Analysis
        </h1>
        <p className="text-text-secondary text-lg">
          For the Ministry of Economic Affairs • Based on Crunchbase data (2005-2014)
        </p>
      </header>

      {/* Key Numbers - At a Glance */}
      <section className="grid grid-cols-3 gap-6">
        <div className="text-center p-6 bg-bg-secondary rounded-xl border border-white/5">
          <p className="text-4xl font-heading font-bold text-white">{overview.dutch_companies}</p>
          <p className="text-sm text-text-secondary mt-1">Dutch Companies</p>
          <p className="text-xs text-text-muted mt-1">in dataset</p>
        </div>
        <div className="text-center p-6 bg-bg-secondary rounded-xl border border-white/5">
          <p className="text-4xl font-heading font-bold text-white">{overview.dutch_operating_rate.toFixed(0)}%</p>
          <p className="text-sm text-text-secondary mt-1">Operating Rate</p>
          <p className="text-xs text-green-400 mt-1">vs {overview.operating_rate.toFixed(0)}% global</p>
        </div>
        <div className="text-center p-6 bg-bg-secondary rounded-xl border border-white/5">
          <p className="text-4xl font-heading font-bold text-white">{overview.dutch_avg_rounds.toFixed(2)}</p>
          <p className="text-sm text-text-secondary mt-1">Avg Funding Rounds</p>
          <p className="text-xs text-amber-400 mt-1">vs USA 1.85</p>
        </div>
      </section>

      {/* INSIGHT 1: The Valley of Death */}
      <section className="bg-bg-secondary border border-white/5 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-500/20 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold text-white">Insight 1: The Valley of Death is Real</h2>
            <p className="text-text-secondary text-sm">Most startups never secure follow-on funding</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-5xl font-heading font-bold text-red-400 mb-2">
              {deepTech.time_to_scale.single_round_pct.toFixed(0)}%
            </p>
            <p className="text-lg text-white mb-4">of Dutch startups never get a second funding round</p>
            <p className="text-text-secondary text-sm leading-relaxed">
              Of {overview.dutch_companies} Dutch companies in our dataset, {deepTech.time_to_scale.single_round_count} received only one round of funding.
              The drop-off between Seed and Series A represents the critical intervention point.
            </p>
          </div>



          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={survival}>
                <XAxis dataKey="round_name" tick={{ fill: "#94A3B8", fontSize: 11 }} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#f8fafc" }}
                  formatter={(value: any, name: any) => [`${Number(value).toFixed(1)}%`, name]}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                <Line type="monotone" dataKey="dutch_survival_rate" stroke="#ee3124" strokeWidth={3} name="Netherlands" dot={{ fill: "#ee3124", r: 4 }} />
                <Line type="monotone" dataKey="usa_survival_rate" stroke="#3b82f6" strokeWidth={2} name="USA" dot={false} strokeDasharray="3 3" />
                <Line type="monotone" dataKey="uk_survival_rate" stroke="#a855f7" strokeWidth={2} name="UK" dot={false} strokeDasharray="3 3" />
                <Line type="monotone" dataKey="global_survival_rate" stroke="#64748b" strokeWidth={1} name="Global" dot={false} strokeDasharray="1 3" />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-xs text-text-muted text-center mt-2">Survival rate by funding round</p>
          </div>
        </div>
      </section>

      {/* INSIGHT 2: More Rounds = Better Outcomes */}
      <section className="bg-bg-secondary border border-white/5 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold text-white">Insight 2: More Funding Rounds = Better Outcomes</h2>
            <p className="text-text-secondary text-sm">Sustained investment support drives successful exits</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-lg text-white mb-4">
              Companies with <span className="text-green-400 font-bold">4+ funding rounds</span> have{" "}
              <span className="text-green-400 font-bold">3x higher</span> acquisition rates than single-round companies.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center p-3 bg-bg-primary rounded-lg">
                <span className="text-text-secondary">1 round</span>
                <span className="text-white font-mono">4.5% acquired</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-bg-primary rounded-lg">
                <span className="text-text-secondary">3 rounds</span>
                <span className="text-white font-mono">9.8% acquired</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                <span className="text-green-400">5+ rounds</span>
                <span className="text-green-400 font-mono font-bold">14.2% acquired</span>
              </div>
            </div>
          </div>

          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={outcomes.slice(0, 6)}>
                <XAxis dataKey="rounds" tick={{ fill: "#94A3B8", fontSize: 11 }} label={{ value: "Funding Rounds", position: "insideBottom", offset: -5, fill: "#94A3B8", fontSize: 10 }} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#f8fafc" }}
                  formatter={(value: any) => [`${value}%`, ""]}
                />
                <Bar dataKey="acquired" fill="#22c55e" name="Acquired %" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-text-muted text-center mt-2">Acquisition rate by funding rounds</p>
          </div>
        </div>
      </section>

      {/* INSIGHT 3: Netherlands is Competitive but Underfunded */}
      <section className="bg-bg-secondary border border-white/5 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Building2 className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold text-white">Insight 3: Netherlands is Competitive but Underfunded</h2>
            <p className="text-text-secondary text-sm">Strong survival rates, but fewer funding rounds than peers</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="p-6 bg-bg-primary rounded-xl border border-green-500/20">
            <p className="text-sm text-green-400 font-medium mb-2">STRENGTH</p>
            <p className="text-3xl font-heading font-bold text-white mb-1">{overview.dutch_operating_rate.toFixed(0)}%</p>
            <p className="text-sm text-text-secondary">Operating rate</p>
            <p className="text-xs text-green-400 mt-2">+{(overview.dutch_operating_rate - overview.operating_rate).toFixed(0)}pp above global average</p>
          </div>
          <div className="p-6 bg-bg-primary rounded-xl border border-amber-500/20">
            <p className="text-sm text-amber-400 font-medium mb-2">OPPORTUNITY</p>
            <p className="text-3xl font-heading font-bold text-white mb-1">{overview.dutch_avg_rounds.toFixed(2)}</p>
            <p className="text-sm text-text-secondary">Average funding rounds</p>
            <p className="text-xs text-amber-400 mt-2">vs USA (1.85) and Israel (1.78)</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-sm text-text-secondary">
            <span className="text-blue-400 font-bold">Implication:</span> Dutch startups survive well, but need more follow-on investment to reach their potential.
            Bridging the gap to USA-level funding rounds could unlock significant value.
          </p>
        </div>
      </section>

      {/* Policy Implications - Concise */}
      <section className="bg-gradient-to-br from-red-900/20 to-bg-secondary border border-red-500/20 rounded-2xl p-8">
        <h2 className="text-2xl font-heading font-bold text-white mb-6 flex items-center gap-3">
          <ArrowRight className="w-6 h-6 text-red-400" />
          Policy Implications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-bg-primary/50 rounded-lg border border-white/5">
            <p className="text-white font-medium mb-1">Bridge the Valley of Death</p>
            <p className="text-sm text-text-secondary">Create bridge funding for post-seed, pre-Series A companies</p>
          </div>
          <div className="p-4 bg-bg-primary/50 rounded-lg border border-white/5">
            <p className="text-white font-medium mb-1">Incentivize Follow-on Investment</p>
            <p className="text-sm text-text-secondary">Tax incentives for investors providing multiple rounds</p>
          </div>
        </div>
      </section>

      {/* WHAT'S MISSING - Critical Section */}
      <section className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-500/20 rounded-lg">
            <HelpCircle className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-white">What's Missing</h2>
        </div>

        <p className="text-text-secondary mb-6">
          This analysis has important limitations. Here's what we couldn't answer and what would help:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-medium">
              <Database className="w-4 h-4" />
              Data Gaps
            </div>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span>Data ends in <strong className="text-white">2014</strong> — 10+ years old</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span>No investor concentration metrics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span>No exit valuations or multiples</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span>No revenue/employee growth data</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-medium">
              <Database className="w-4 h-4" />
              Data We Need
            </div>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span><strong className="text-white">Dealroom</strong> for current Dutch ecosystem</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span><strong className="text-white">KvK</strong> data for company health metrics</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span>Patent/publication data for innovation metrics</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-medium">
              <MessageSquare className="w-4 h-4" />
              Who to Talk To
            </div>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span>Dutch VC fund managers</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span>Founders who failed to raise Series A</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span>Techleap ecosystem experts</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 p-4 bg-bg-primary/50 rounded-lg border border-amber-500/10">
          <p className="text-sm text-text-secondary">
            <span className="text-amber-400 font-bold">Note on Wennink Report:</span> The report identifies 4 strategic domains
            (Digital/AI, Security, Energy/Climate, Life Sciences). This dataset predates those frameworks and cannot directly
            validate those priorities. Integration with current Dealroom data is recommended.
          </p>
        </div>
      </section>

      {/* Explore More */}
      <section className="bg-bg-secondary border border-blue-500/20 rounded-2xl p-8 text-center">
        <Compass className="w-10 h-10 text-blue-400 mx-auto mb-4" />
        <h2 className="text-2xl font-heading font-bold text-white mb-2">Want to Dig Deeper?</h2>
        <p className="text-text-secondary mb-6 max-w-md mx-auto">
          Explore the full dataset with sector analysis, European comparisons, cohort trends, and more.
        </p>
        <Link
          href="/explore"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-all"
        >
          Open Exploration Mode
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center text-sm text-text-muted border-t border-white/5 pt-8">
        <p>Analysis conducted using Python (pandas) and Next.js/Recharts</p>
        <p className="mt-1">Data source: Startup Investments (Crunchbase) via Kaggle • 2005-2014</p>
      </footer>
    </div>
  );
}
