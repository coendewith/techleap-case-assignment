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
  TrendingDown,
  Building2,
  HelpCircle,
  ArrowRight,
  Database,
  Users,
  MessageSquare,
  Compass,
  Clock,
  Lightbulb,
  Target,
  Banknote,
  Brain,
  Briefcase,
  Home,
  Wallet,
  Shield,
  Calendar,
  MapPin,
  DollarSign,
  Zap,
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

interface TimeBetweenRoundsData {
  global_median_months: number;
  dutch_median_months: number;
  by_country: {
    country: string;
    country_name: string;
    median_months: number;
    mean_months: number;
    company_count: number;
  }[];
}

interface ExternalFactorsData {
  ecb_rates: {
    year: number;
    ecb_rate: number;
    dutch_funding_m: number;
    period: string;
  }[];
  policy_timeline: {
    year: number;
    policy: string;
    description: string;
    effect: string;
    in_dataset: boolean;
  }[];
  summary: {
    insight: string;
    pre_crisis_funding: string;
    crisis_funding: string;
    recovery_funding: string;
    crisis_drop_pct: number;
  };
}

interface StakeholdersData {
  policymakers: {
    title: string;
    key_question: string;
    constraints: { name: string; description: string; icon: string }[];
    metrics: { name: string; source: string }[];
    implication: string;
  };
  founders: {
    title: string;
    key_question: string;
    opportunity_cost: {
      alternative_salary: string;
      founder_salary: string;
      implicit_bet: string;
    };
    decision_factors: { name: string; description: string; icon: string }[];
    lifestyle_vs_exit: {
      description: string;
      implication: string;
    };
  };
}

// --- Component ---

export default function HomePage() {
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [survival, setSurvival] = useState<SurvivalData[]>([]);
  const [outcomes, setOutcomes] = useState<OutcomeData[]>([]);
  const [deepTech, setDeepTech] = useState<DeepTechData | null>(null);
  const [timeBetweenRounds, setTimeBetweenRounds] = useState<TimeBetweenRoundsData | null>(null);
  const [externalFactors, setExternalFactors] = useState<ExternalFactorsData | null>(null);
  const [stakeholders, setStakeholders] = useState<StakeholdersData | null>(null);

  useEffect(() => {
    fetch("/data/overview.json").then((res) => res.json()).then(setOverview);
    fetch("/data/survival.json").then((res) => res.json()).then(setSurvival);
    fetch("/data/outcomes.json").then((res) => res.json()).then(setOutcomes);
    fetch("/data/deep_tech_analysis.json").then((res) => res.json()).then(setDeepTech);
    fetch("/data/time_between_rounds.json").then((res) => res.json()).then(setTimeBetweenRounds);
    fetch("/data/external_factors.json").then((res) => res.json()).then(setExternalFactors);
    fetch("/data/stakeholders.json").then((res) => res.json()).then(setStakeholders);
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

      {/* INSIGHT 1: Funding Rounds Matter Most (HIGH CONFIDENCE) */}
      <section className="bg-gradient-to-br from-green-900/20 to-bg-secondary border border-green-500/20 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <TrendingUp className="w-6 h-6 text-green-400" />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold text-white">Insight 1: The Only Metric That Matters</h2>
            <p className="text-text-secondary text-sm">More funding rounds = 2x better outcomes</p>
          </div>
          <div className="ml-auto px-3 py-1 bg-green-500/20 rounded-full">
            <span className="text-xs text-green-400 font-medium">HIGH CONFIDENCE • n=48,163</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-bg-primary rounded-xl border-2 border-green-500/30">
                <p className="text-xs text-text-muted mb-1">4+ ROUNDS</p>
                <p className="text-4xl font-heading font-bold text-green-400">10%</p>
                <p className="text-sm text-text-secondary">acquisition rate</p>
                <p className="text-xs text-text-muted mt-2">n=3,872 companies</p>
              </div>
              <div className="p-4 bg-bg-primary rounded-xl border border-white/10">
                <p className="text-xs text-text-muted mb-1">1 ROUND</p>
                <p className="text-4xl font-heading font-bold text-gray-400">5%</p>
                <p className="text-sm text-text-secondary">acquisition rate</p>
                <p className="text-xs text-text-muted mt-2">n=31,443 companies</p>
              </div>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              This is the <span className="text-white font-bold">most robust finding</span> in the dataset. Companies that secure 4+ funding rounds have{" "}
              <span className="text-green-400 font-bold">2x higher acquisition rates</span> than those with only one round.
            </p>
          </div>

          <div className="flex flex-col justify-center space-y-3">
            <div className="p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <p className="text-xs text-indigo-400 font-medium">FOR POLICYMAKERS</p>
              </div>
              <p className="text-sm text-text-secondary">
                Focus interventions on helping companies COMPLETE rounds, not just raising more capital per round. Track round completion, not just € invested.
              </p>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <p className="text-xs text-amber-400 font-medium">FOR FOUNDERS</p>
              </div>
              <p className="text-sm text-text-secondary">
                Optimize for getting to the next round, not maximizing round size. 65% of companies never get Round 2—that&apos;s where the battle is won.
              </p>
            </div>
            <div className="p-3 bg-bg-primary rounded-lg">
              <p className="text-xs text-text-muted">
                Statistical power: Global dataset • Large sample sizes • Consistent across all years
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INSIGHT 3: The 6.2% Problem (MEDIUM CONFIDENCE) */}
      <section className="bg-gradient-to-br from-amber-900/20 to-bg-secondary border border-amber-500/20 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-500/20 rounded-lg">
            <TrendingDown className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold text-white">Insight 3: The Graduation Gap</h2>
            <p className="text-text-secondary text-sm">Worst Seed→Series A conversion in Europe</p>
          </div>
          <div className="ml-auto px-3 py-1 bg-amber-500/20 rounded-full">
            <span className="text-xs text-amber-400 font-medium">MEDIUM CONFIDENCE • n=97</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <p className="text-6xl font-heading font-bold text-amber-400 mb-2">6.2%</p>
            <p className="text-lg text-white mb-4">of Dutch seed-funded companies reach Series A</p>
            <p className="text-text-secondary text-sm mb-4">
              Of <span className="text-white">97 Dutch companies</span> that raised seed, only{" "}
              <span className="text-amber-400 font-bold">6 reached Series A</span>. This isn&apos;t a &quot;scale-up gap&quot;—it&apos;s a graduation gap.
            </p>
            <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <p className="text-xs text-amber-400 font-medium">THE INTERVENTION POINT</p>
              <p className="text-sm text-text-secondary mt-1">
                The problem isn&apos;t Series A/B. It&apos;s the 12-24 months after seed. What&apos;s killing companies before they get there?
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-text-muted mb-3 font-medium uppercase">Seed→Series A Conversion by Country</p>
            <div className="space-y-2">
              {[
                { country: "Israel", rate: 21.9, color: "text-green-400" },
                { country: "USA", rate: 16.1, color: "text-blue-400" },
                { country: "Germany", rate: 12.1, color: "text-purple-400" },
                { country: "France", rate: 9.5, color: "text-cyan-400" },
                { country: "UK", rate: 8.2, color: "text-pink-400" },
                { country: "Netherlands", rate: 6.2, color: "text-amber-400" },
              ].map((c) => (
                <div key={c.country} className="flex items-center gap-3">
                  <span className="text-sm text-text-secondary w-24">{c.country}</span>
                  <div className="flex-1 h-6 bg-bg-primary rounded-full overflow-hidden">
                    <div
                      className={`h-full ${c.country === "Netherlands" ? "bg-amber-500" : "bg-gray-600"}`}
                      style={{ width: `${(c.rate / 25) * 100}%` }}
                    />
                  </div>
                  <span className={`text-sm font-mono ${c.country === "Netherlands" ? c.color + " font-bold" : "text-text-secondary"}`}>
                    {c.rate}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stakeholder implications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-amber-500/10">
          <div className="p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <p className="text-xs text-indigo-400 font-medium">FOR POLICYMAKERS</p>
            </div>
            <p className="text-sm text-text-secondary">
              Create a post-seed bridge fund (€10-15M range). The metric: move conversion from 6.2% to 12% (Germany level). ~€50M over 3 years, measurable by KvK/RVO data.
            </p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <p className="text-xs text-amber-400 font-medium">FOR FOUNDERS</p>
            </div>
            <p className="text-sm text-text-secondary">
              Don&apos;t assume follow-on. Plan 18-24 month runway after seed. If you haven&apos;t hit milestones for Series A by month 12, start alternative planning (bridge, pivot, or orderly wind-down).
            </p>
          </div>
        </div>
      </section>

      {/* INSIGHT 2: Capital Efficiency Paradox (HIGH CONFIDENCE) */}
      <section className="bg-gradient-to-br from-purple-900/20 to-bg-secondary border border-purple-500/20 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-500/20 rounded-lg">
            <DollarSign className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold text-white">Insight 2: Capital Doesn&apos;t Fix This</h2>
            <p className="text-text-secondary text-sm">300x more money = only 4 percentage points better</p>
          </div>
          <div className="ml-auto px-3 py-1 bg-green-500/20 rounded-full">
            <span className="text-xs text-green-400 font-medium">HIGH CONFIDENCE • n=40,000+</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-bg-primary rounded-xl border border-white/10">
                <p className="text-xs text-text-muted mb-1">MICRO-CAP ROUNDS</p>
                <p className="text-2xl font-heading font-bold text-white">$47K</p>
                <p className="text-sm text-text-secondary">avg per round</p>
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-3xl font-heading font-bold text-green-400">89.4%</p>
                  <p className="text-xs text-text-muted">success rate</p>
                </div>
              </div>
              <div className="p-4 bg-bg-primary rounded-xl border border-purple-500/30">
                <p className="text-xs text-text-muted mb-1">MEGA-CAP ROUNDS</p>
                <p className="text-2xl font-heading font-bold text-purple-400">$14.6M</p>
                <p className="text-sm text-text-secondary">avg per round</p>
                <div className="mt-3 pt-3 border-t border-white/10">
                  <p className="text-3xl font-heading font-bold text-green-400">93.7%</p>
                  <p className="text-xs text-text-muted">success rate</p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <p className="text-lg text-white text-center">
                <span className="text-purple-400 font-bold">300x</span> more capital ={" "}
                <span className="text-purple-400 font-bold">4.3pp</span> better outcomes
              </p>
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-3">
            <p className="text-text-secondary text-sm leading-relaxed">
              This challenges the Silicon Valley &quot;spray capital&quot; model. Once you cross a minimum threshold (~$300K),{" "}
              <span className="text-white font-bold">founder quality matters exponentially more than funding size</span>.
            </p>
            <div className="p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <p className="text-xs text-indigo-400 font-medium">FOR POLICYMAKERS</p>
              </div>
              <p className="text-sm text-text-secondary">
                Shift from &quot;more capital&quot; programs to founder support (mentorship, networks, soft landing programs). €1M on founder development may outperform €10M in new funds. Harder to measure but higher ROI.
              </p>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <p className="text-xs text-amber-400 font-medium">FOR FOUNDERS</p>
              </div>
              <p className="text-sm text-text-secondary">
                Don&apos;t over-raise. Taking €5M when you need €500K creates board pressure, dilution, and misaligned incentives. Capital efficiency matters more than headline rounds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* INSIGHT 4: 2008 Crisis Impact (MEDIUM CONFIDENCE) */}
      <section className="bg-gradient-to-br from-red-900/30 to-bg-secondary border border-red-500/20 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-red-500/20 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold text-white">Insight 4: 2008 Crisis Impact</h2>
            <p className="text-text-secondary text-sm">Dutch ecosystem more fragile during macro shocks</p>
          </div>
          <div className="ml-auto px-3 py-1 bg-amber-500/20 rounded-full">
            <span className="text-xs text-amber-400 font-medium">MEDIUM CONFIDENCE • n=~50/cohort</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-bg-primary rounded-xl border border-green-500/20">
                <p className="text-xs text-text-muted mb-1">PRE-CRISIS (before 2007)</p>
                <p className="text-4xl font-heading font-bold text-green-400">14.7%</p>
                <p className="text-sm text-text-secondary">exit rate</p>
              </div>
              <div className="p-4 bg-bg-primary rounded-xl border-2 border-red-500/30">
                <p className="text-xs text-text-muted mb-1">CRISIS COHORT (2007-2009)</p>
                <p className="text-4xl font-heading font-bold text-red-400">5.6%</p>
                <p className="text-sm text-text-secondary">exit rate</p>
              </div>
            </div>
            <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20 text-center">
              <p className="text-3xl font-heading font-bold text-red-400">-62%</p>
              <p className="text-sm text-text-secondary">drop in exit rates</p>
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-lg text-white mb-4">
              Dutch founders hit <span className="text-red-400 font-bold">1.5x harder</span> than US peers
            </p>
            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between items-center p-3 bg-bg-primary rounded-lg">
                <span className="text-text-secondary">Netherlands</span>
                <span className="text-red-400 font-mono font-bold">-62% drop</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-bg-primary rounded-lg">
                <span className="text-text-secondary">USA</span>
                <span className="text-white font-mono">-40% drop</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stakeholder implications */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-red-500/10">
          <div className="p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <p className="text-xs text-indigo-400 font-medium">FOR POLICYMAKERS</p>
            </div>
            <p className="text-sm text-text-secondary">
              Build counter-cyclical capital reserves now. When next crisis hits, activate emergency bridge programs within 90 days. The 2007-2009 cohort faced structural disadvantages for years.
            </p>
          </div>
          <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <p className="text-xs text-amber-400 font-medium">FOR FOUNDERS</p>
            </div>
            <p className="text-sm text-text-secondary">
              If you&apos;re raising during economic uncertainty, extend your runway aggressively. Crisis cohorts have structurally worse outcomes—plan for 24+ months, not 18.
            </p>
          </div>
        </div>
      </section>

      {/* What Else We Found - Supporting Insights */}
      <section className="bg-bg-secondary border border-white/5 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <Zap className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-white">What Else We Found</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-bg-primary rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <p className="text-lg font-heading font-bold text-white">47% of NL Funding</p>
              <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs rounded">Policy</span>
            </div>
            <p className="text-sm text-blue-400 font-mono mb-2">O3b + Mobileye</p>
            <p className="text-xs text-text-secondary">
              Two companies ($1.37B + $515M) = nearly half of all Dutch funding. <span className="text-indigo-300">Policymakers: don&apos;t use headline numbers to benchmark success.</span>
            </p>
          </div>

          <div className="p-4 bg-bg-primary rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <p className="text-lg font-heading font-bold text-white">Speed Isn&apos;t the Problem</p>
              <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs rounded">Policy</span>
            </div>
            <p className="text-sm text-green-400 font-mono mb-2">14.4 vs 12.6 months</p>
            <p className="text-xs text-text-secondary">
              Dutch funding velocity is competitive. <span className="text-indigo-300">Policymakers: don&apos;t waste resources on &quot;accelerating&quot; fundraising—focus on completion rates.</span>
            </p>
          </div>

          <div className="p-4 bg-bg-primary rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <p className="text-lg font-heading font-bold text-white">Sector Concentration</p>
              <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs rounded">Policy</span>
            </div>
            <p className="text-sm text-amber-400 font-mono mb-2">Top 3 = 50% of funding</p>
            <p className="text-xs text-text-secondary">
              Ecosystem too dependent on specific sectors. <span className="text-indigo-300">Policymakers: build sector diversification into portfolio strategy.</span>
            </p>
          </div>

          <div className="p-4 bg-bg-primary rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <p className="text-lg font-heading font-bold text-white">The Zombie Problem</p>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded">Founders</span>
            </div>
            <p className="text-sm text-red-400 font-mono mb-2">85.9% &quot;operating&quot;</p>
            <p className="text-xs text-text-secondary">
              Many &quot;operating&quot; companies are actually stalled. <span className="text-amber-300">Founders: be honest about whether you&apos;re growing or just surviving.</span>
            </p>
          </div>

          <div className="p-4 bg-bg-primary rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <p className="text-lg font-heading font-bold text-white">Software Underweight</p>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded">Founders</span>
            </div>
            <p className="text-sm text-purple-400 font-mono mb-2">Lower % than global</p>
            <p className="text-xs text-text-secondary">
              SaaS is scalable and exportable with low capital requirements. <span className="text-amber-300">Founders: consider SaaS as a faster path to scale in NL.</span>
            </p>
          </div>

          <div className="p-4 bg-bg-primary rounded-xl border border-white/5 hover:border-white/10 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <p className="text-lg font-heading font-bold text-white">More Rounds = Only Signal</p>
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 text-xs rounded">Founders</span>
            </div>
            <p className="text-sm text-cyan-400 font-mono mb-2">4+ rounds = 3x exits</p>
            <p className="text-xs text-text-secondary">
              Companies with 4+ rounds have 3x higher acquisition rates. <span className="text-amber-300">Founders: optimize for follow-on, not just initial raise.</span>
            </p>
          </div>
        </div>
      </section>

      {/* NEW: External Factors - ECB Rates & Policy Timeline */}
      {externalFactors && (
        <section className="bg-bg-secondary border border-white/5 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-cyan-500/20 rounded-lg">
              <Banknote className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold text-white">Insight 5: External Factors Matter</h2>
              <p className="text-text-secondary text-sm">Interest rates and policy context shaped the ecosystem</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-lg text-white mb-4">
                ECB rates dropped from <span className="text-cyan-400 font-bold">4%</span> to{" "}
                <span className="text-cyan-400 font-bold">0.05%</span> but funding recovery was slow.
              </p>
              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between items-center p-3 bg-bg-primary rounded-lg">
                  <span className="text-text-secondary">Pre-Crisis (2005-07)</span>
                  <span className="text-white font-mono">{externalFactors.summary.pre_crisis_funding}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <span className="text-red-400">Crisis (2008-09)</span>
                  <span className="text-red-400 font-mono">{externalFactors.summary.crisis_funding} (-{externalFactors.summary.crisis_drop_pct}%)</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <span className="text-green-400">Recovery (2010-14)</span>
                  <span className="text-green-400 font-mono">{externalFactors.summary.recovery_funding}</span>
                </div>
              </div>
              <p className="text-text-secondary text-sm">
                <span className="text-cyan-400 font-bold">Key Insight:</span> {externalFactors.summary.insight}
              </p>
            </div>

            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={externalFactors.ecb_rates}>
                  <XAxis dataKey="year" tick={{ fill: "#94A3B8", fontSize: 11 }} />
                  <YAxis yAxisId="left" tick={{ fill: "#94A3B8", fontSize: 11 }} domain={[0, 150]} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fill: "#94A3B8", fontSize: 11 }} domain={[0, 5]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1e293b", borderColor: "#334155", color: "#f8fafc" }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "11px" }} />
                  <Bar yAxisId="left" dataKey="dutch_funding_m" fill="#ee3124" name="Funding ($M)" opacity={0.7} />
                  <Line yAxisId="right" type="monotone" dataKey="ecb_rate" stroke="#22d3ee" strokeWidth={3} name="ECB Rate (%)" dot={{ fill: "#22d3ee", r: 4 }} />
                  <ReferenceLine yAxisId="left" x={2008} stroke="#64748b" strokeDasharray="3 3" label={{ value: "Crisis", fill: "#94A3B8", fontSize: 10 }} />
                </LineChart>
              </ResponsiveContainer>
              <p className="text-xs text-text-muted text-center mt-2">Dutch funding vs ECB interest rates</p>
            </div>
          </div>

          {/* Policy Timeline */}
          <div className="mt-6 p-4 bg-bg-primary rounded-lg">
            <p className="text-sm text-text-secondary mb-3 font-medium">Policy Timeline Context</p>
            <div className="flex flex-wrap gap-2">
              {externalFactors.policy_timeline.map((policy) => (
                <div
                  key={policy.year}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    policy.effect === "positive"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : policy.effect === "negative"
                      ? "bg-red-500/20 text-red-400 border border-red-500/30"
                      : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                  }`}
                >
                  {policy.year}: {policy.policy}
                </div>
              ))}
            </div>
            <p className="text-xs text-text-muted mt-3">
              We cannot prove causation. Proper analysis requires panel regression or synthetic control methods.
            </p>
          </div>

          {/* Stakeholder implications for external factors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-cyan-500/10">
            <div className="p-3 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <p className="text-xs text-indigo-400 font-medium">FOR POLICYMAKERS</p>
              </div>
              <p className="text-sm text-text-secondary">
                Policy effects (Innovation Box, 30% ruling) take 3-5 years to show up in funding data. Budget cycles are shorter than impact cycles—commit to long-term programs.
              </p>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                <p className="text-xs text-amber-400 font-medium">FOR FOUNDERS</p>
              </div>
              <p className="text-sm text-text-secondary">
                Macro conditions outside your control affect outcomes. 2007-2009 founders had 62% worse exit rates through no fault of their own. Factor market timing into your risk assessment.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Stakeholder Summary - The Key Questions */}
      {stakeholders && (
        <section className="bg-gradient-to-br from-indigo-900/20 to-bg-secondary border border-indigo-500/20 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Brain className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-heading font-bold text-white">The Questions That Matter</h2>
              <p className="text-text-secondary text-sm">Each stakeholder asks fundamentally different questions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Policymakers Key Question */}
            <div className="p-6 bg-bg-primary rounded-xl border border-indigo-500/10">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="w-5 h-5 text-indigo-400" />
                <span className="text-indigo-400 text-sm font-medium">POLICYMAKER</span>
              </div>
              <p className="text-xl text-white italic mb-4">&quot;{stakeholders.policymakers.key_question}&quot;</p>
              <div className="space-y-2 text-sm text-text-secondary">
                <p>This shapes everything: risk aversion, program design, metrics.</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {stakeholders.policymakers.constraints.map((c) => (
                    <span key={c.name} className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded text-xs text-indigo-300">
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Founders Key Question */}
            <div className="p-6 bg-bg-primary rounded-xl border border-amber-500/10">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-amber-400" />
                <span className="text-amber-400 text-sm font-medium">FOUNDER</span>
              </div>
              <p className="text-xl text-white italic mb-4">&quot;{stakeholders.founders.key_question}&quot;</p>
              <div className="space-y-2 text-sm text-text-secondary">
                <p>This shapes location, runway planning, hiring decisions.</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {stakeholders.founders.decision_factors.map((f) => (
                    <span key={f.name} className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded text-xs text-amber-300">
                      {f.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Why insights matter differently */}
          <div className="mt-6 p-4 bg-bg-primary/50 rounded-lg border border-white/5">
            <p className="text-sm text-text-secondary">
              <span className="text-white font-bold">Why we separated implications above:</span> The same finding means different things to different people.
              &quot;Leiden beats Amsterdam&quot; tells policymakers to fund research clusters; it tells founders to weigh location trade-offs.
              Data without context for your role is just noise.
            </p>
          </div>
        </section>
      )}

      {/* Policy Implications - Concise */}
      <section className="bg-gradient-to-br from-red-900/20 to-bg-secondary border border-red-500/20 rounded-2xl p-8">
        <h2 className="text-2xl font-heading font-bold text-white mb-6 flex items-center gap-3">
          <Target className="w-6 h-6 text-red-400" />
          Policy Implications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-bg-primary/50 rounded-lg border border-white/5">
            <p className="text-white font-medium mb-1">Bridge the Valley of Death</p>
            <p className="text-sm text-text-secondary">Co-investment fund for post-seed, pre-Series A (target: increase conversion from 17% to 25%)</p>
          </div>
          <div className="p-4 bg-bg-primary/50 rounded-lg border border-white/5">
            <p className="text-white font-medium mb-1">Incentivize Follow-on Investment</p>
            <p className="text-sm text-text-secondary">Tax credits for investors providing 2+ rounds to same company</p>
          </div>
          <div className="p-4 bg-bg-primary/50 rounded-lg border border-white/5">
            <p className="text-white font-medium mb-1">De-risk Early Stage</p>
            <p className="text-sm text-text-secondary">Loan guarantees for seed-stage investors to increase appetite</p>
          </div>
          <div className="p-4 bg-bg-primary/50 rounded-lg border border-white/5">
            <p className="text-white font-medium mb-1">Sector Focus</p>
            <p className="text-sm text-text-secondary">Prioritize Biotech, Software, Enterprise where Netherlands shows strength</p>
          </div>
        </div>
      </section>

      {/* Founder Recommendations - NEW */}
      <section className="bg-gradient-to-br from-amber-900/20 to-bg-secondary border border-amber-500/20 rounded-2xl p-8">
        <h2 className="text-2xl font-heading font-bold text-white mb-6 flex items-center gap-3">
          <Lightbulb className="w-6 h-6 text-amber-400" />
          What This Means for Founders
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-bg-primary/50 rounded-lg border border-amber-500/10">
            <p className="text-amber-400 font-medium mb-1">Plan 18-24 Months Runway</p>
            <p className="text-sm text-text-secondary">65% of companies never get a second round. Don&apos;t assume follow-on is guaranteed.</p>
          </div>
          <div className="p-4 bg-bg-primary/50 rounded-lg border border-amber-500/10">
            <p className="text-amber-400 font-medium mb-1">Target 3+ Rounds Before Exit</p>
            <p className="text-sm text-text-secondary">Companies with 4+ rounds have 3x higher acquisition rates. Build for the long game.</p>
          </div>
          <div className="p-4 bg-bg-primary/50 rounded-lg border border-amber-500/10">
            <p className="text-amber-400 font-medium mb-1">Start Fundraising 6 Months Early</p>
            <p className="text-sm text-text-secondary">Median time between rounds is 12-15 months. Begin outreach while runway is healthy.</p>
          </div>
          <div className="p-4 bg-bg-primary/50 rounded-lg border border-amber-500/10">
            <p className="text-amber-400 font-medium mb-1">Consider Ecosystem Access</p>
            <p className="text-sm text-text-secondary">Amsterdam dominates Dutch funding. Location matters for investor access and talent.</p>
          </div>
        </div>
      </section>

      {/* WHAT'S MISSING - Critical Section */}
      <section className="bg-amber-500/5 border border-amber-500/20 rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-500/20 rounded-lg">
            <HelpCircle className="w-6 h-6 text-amber-400" />
          </div>
          <h2 className="text-2xl font-heading font-bold text-white">What&apos;s Missing</h2>
        </div>

        <p className="text-text-secondary mb-6">
          This analysis has important limitations. Here&apos;s what we couldn&apos;t answer and what would help:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <span>No investor names or concentration</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span>No exit valuations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span>No employee growth data</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-400 font-medium">
              <AlertTriangle className="w-4 h-4" />
              External Factors Not Captured
            </div>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <span className="text-red-400">•</span>
                <span><strong className="text-white">Interest rates</strong> (2008 crisis impact)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">•</span>
                <span><strong className="text-white">Regulations</strong> (EU, Dutch policy)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">•</span>
                <span><strong className="text-white">Talent supply</strong> (ICT shortage)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">•</span>
                <span><strong className="text-white">Competitor hubs</strong> (Berlin, London)</span>
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
                <span><strong className="text-white">Dealroom</strong> for current ecosystem</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span><strong className="text-white">KvK</strong> for company health</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span>Patent/publication data</span>
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
                <span>Founders who failed Series A</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400">•</span>
                <span>Techleap ecosystem experts</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/20">
            <p className="text-sm text-text-secondary">
              <span className="text-red-400 font-bold">Selection Bias Warning:</span> Crunchbase over-indexes US/English-language companies.
              Dutch coverage may be incomplete, particularly for companies that never raised institutional funding or closed before gaining visibility.
            </p>
          </div>
          <div className="p-4 bg-bg-primary/50 rounded-lg border border-amber-500/10">
            <p className="text-sm text-text-secondary">
              <span className="text-amber-400 font-bold">Note:</span> This dataset predates current strategic frameworks (Wennink Report domains).
              Validate findings with current Dealroom data before policy decisions.
            </p>
          </div>
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
