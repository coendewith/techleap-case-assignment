"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { TrendingDown, DollarSign, Target, AlertTriangle } from "lucide-react";

// Data for findings
const graduationData = [
  { country: "Israel", rate: 21.9 },
  { country: "USA", rate: 16.1 },
  { country: "Germany", rate: 12.1 },
  { country: "France", rate: 9.5 },
  { country: "UK", rate: 8.2 },
  { country: "Netherlands", rate: 6.2 },
];

const capitalData = [
  { level: "$47K", rate: 89.4, label: "Low" },
  { level: "$280K", rate: 90.8, label: "Mid-Low" },
  { level: "$1.2M", rate: 91.2, label: "Mid-High" },
  { level: "$14.6M", rate: 93.7, label: "High" },
];

const roundsData = [
  { rounds: "1", rate: 5.3, n: 31443 },
  { rounds: "2", rate: 9.2, n: 8976 },
  { rounds: "3", rate: 11.6, n: 3872 },
  { rounds: "4", rate: 10.9, n: 1889 },
  { rounds: "5+", rate: 9.8, n: 1682 },
];

const limitations = [
  { issue: "Outdated Data", detail: "Data ends 2014", impact: "HIGH" },
  { issue: "No Exit Values", detail: "Acquisition ≠ good outcome", impact: "MEDIUM" },
  { issue: "Small NL Sample", detail: "n=97 seed companies", impact: "MEDIUM" },
  { issue: "No Founder Data", detail: "May be actual driver", impact: "HIGH" },
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-6 px-8">
        <h1 className="text-2xl font-bold text-slate-900">
          Dutch Startup Ecosystem Analysis
        </h1>
        <p className="text-slate-600 mt-1">
          3 Key Findings from Crunchbase Data (2005-2014)
        </p>
      </header>

      {/* Key Numbers */}
      <section className="px-8 py-6">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: "Companies Analyzed", value: "48,163" },
            { label: "Dutch Companies", value: "305" },
            { label: "Dutch Seed→A Rate", value: "6.2%" },
            { label: "Median Dutch Funding", value: "$740K" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-lg p-4 border border-slate-200">
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
              <div className="text-sm text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Findings Tabs */}
      <section className="px-8 py-4">
        <div className="flex gap-2 mb-4">
          {[
            { icon: TrendingDown, label: "Graduation Gap", color: "amber" },
            { icon: DollarSign, label: "Capital Paradox", color: "purple" },
            { icon: Target, label: "Rounds Matter", color: "green" },
          ].map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === i
                  ? `bg-${tab.color}-100 text-${tab.color}-800 border-2 border-${tab.color}-300`
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Finding Content */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          {activeTab === 0 && (
            <Finding1 />
          )}
          {activeTab === 1 && (
            <Finding2 />
          )}
          {activeTab === 2 && (
            <Finding3 />
          )}
        </div>
      </section>

      {/* So What */}
      <section className="px-8 py-6">
        <div className="bg-slate-800 text-white rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">So What?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-amber-400 mb-2">For Policymakers</h3>
              <ul className="space-y-1 text-slate-300 text-sm">
                <li>• Don&apos;t add more seed capital—NL has a graduation problem, not a capital problem</li>
                <li>• Focus on the 12-24 month window after seed</li>
                <li>• Invest in matching, not money</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-green-400 mb-2">For Founders</h3>
              <ul className="space-y-1 text-slate-300 text-sm">
                <li>• Plan for 24-month runway post-seed</li>
                <li>• Optimize for rounds, not round size</li>
                <li>• Build Series A relationships 12 months early</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-slate-700 rounded-lg">
            <p className="text-sm font-medium">
              Core Recommendation: Focus on helping companies COMPLETE rounds (better matching),
              not raising MORE capital per round.
            </p>
          </div>
        </div>
      </section>

      {/* Limitations */}
      <section className="px-8 py-6">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="text-lg font-bold text-amber-800">What This Data Cannot Tell Us</h2>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {limitations.map((lim, i) => (
              <div key={i} className="bg-white rounded-lg p-3 border border-amber-100">
                <div className="font-medium text-slate-900">{lim.issue}</div>
                <div className="text-sm text-slate-500">{lim.detail}</div>
                <div className={`text-xs mt-1 ${lim.impact === "HIGH" ? "text-red-600" : "text-amber-600"}`}>
                  {lim.impact} impact
                </div>
              </div>
            ))}
          </div>
          <p className="text-sm text-amber-700 mt-4">
            This analysis provides directional insights, not definitive answers.
            Validate with current Dealroom data.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-4 text-center text-slate-500 text-sm border-t border-slate-200">
        Analysis by Coen de With | Data: Crunchbase via Kaggle (2005-2014)
      </footer>
    </div>
  );
}

// Finding 1: Graduation Gap
function Finding1() {
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-slate-900">Finding 1: The Graduation Gap</h3>
        <p className="text-slate-600">Dutch Seed→Series A conversion is the worst in Europe</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={graduationData} layout="vertical">
              <XAxis type="number" domain={[0, 25]} tickFormatter={(v) => `${v}%`} />
              <YAxis type="category" dataKey="country" width={80} />
              <Tooltip formatter={(v: number) => `${v}%`} />
              <Bar dataKey="rate" radius={4}>
                {graduationData.map((entry, i) => (
                  <Cell key={i} fill={entry.country === "Netherlands" ? "#ef4444" : "#22c55e"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col justify-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="text-3xl font-bold text-red-600">6.2%</div>
            <div className="text-sm text-red-700">Dutch Seed→Series A rate</div>
          </div>
          <div className="bg-slate-100 rounded-lg p-4">
            <div className="text-lg font-bold text-slate-700">vs 16.1% USA</div>
            <div className="text-sm text-slate-500">Only 6 of 97 Dutch seed companies reached Series A</div>
          </div>
          <p className="text-sm text-slate-600 mt-4">
            <strong>Confidence:</strong> MEDIUM (n=97 Dutch seed companies)
          </p>
        </div>
      </div>
      <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <strong className="text-amber-800">Implication:</strong>{" "}
        <span className="text-amber-700">
          The intervention point isn&apos;t Series A capital. It&apos;s the 12-24 months after seed.
        </span>
      </div>
    </div>
  );
}

// Finding 2: Capital Paradox
function Finding2() {
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-slate-900">Finding 2: Capital Doesn&apos;t Fix It</h3>
        <p className="text-slate-600">300x more money = only 4 percentage points better outcomes</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={capitalData}>
              <XAxis dataKey="level" />
              <YAxis domain={[85, 95]} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v: number) => `${v}%`} />
              <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                {capitalData.map((entry, i) => (
                  <Cell key={i} fill={i === 3 ? "#8b5cf6" : "#3b82f6"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col justify-center">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
            <div className="text-3xl font-bold text-purple-600">300x</div>
            <div className="text-sm text-purple-700">More capital ($14.6M vs $47K)</div>
          </div>
          <div className="bg-slate-100 rounded-lg p-4">
            <div className="text-lg font-bold text-slate-700">= 4.3pp better</div>
            <div className="text-sm text-slate-500">93.7% vs 89.4% success rate</div>
          </div>
          <p className="text-sm text-slate-600 mt-4">
            <strong>Confidence:</strong> HIGH (n=40,000+ companies)
          </p>
        </div>
      </div>
      <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <strong className="text-purple-800">Implication:</strong>{" "}
        <span className="text-purple-700">
          Beyond ~$300K, founder quality matters exponentially more than funding size.
        </span>
      </div>
    </div>
  );
}

// Finding 3: Rounds Matter
function Finding3() {
  return (
    <div>
      <div className="mb-4">
        <h3 className="text-xl font-bold text-slate-900">Finding 3: Rounds Matter, Not Amount</h3>
        <p className="text-slate-600">4+ funding rounds = 2x better acquisition rates</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={roundsData}>
              <XAxis dataKey="rounds" />
              <YAxis domain={[0, 15]} tickFormatter={(v) => `${v}%`} />
              <Tooltip
                formatter={(v: number, name: string, props: { payload: { n: number } }) => [
                  `${v}% (n=${props.payload.n.toLocaleString()})`,
                  "Acquisition Rate"
                ]}
              />
              <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
                {roundsData.map((entry, i) => (
                  <Cell key={i} fill={i === 0 ? "#ef4444" : i >= 3 ? "#22c55e" : "#3b82f6"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col justify-center">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="text-3xl font-bold text-green-600">2x</div>
            <div className="text-sm text-green-700">Better acquisition rate (4+ rounds)</div>
          </div>
          <div className="bg-slate-100 rounded-lg p-4">
            <div className="text-lg font-bold text-slate-700">10% vs 5%</div>
            <div className="text-sm text-slate-500">4+ rounds vs 1 round acquisition rate</div>
          </div>
          <p className="text-sm text-slate-600 mt-4">
            <strong>Confidence:</strong> HIGH (n=48,163 companies)
          </p>
        </div>
      </div>
      <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
        <strong className="text-green-800">Implication:</strong>{" "}
        <span className="text-green-700">
          Focus on helping companies COMPLETE rounds, not raising more per round.
        </span>
      </div>
    </div>
  );
}
