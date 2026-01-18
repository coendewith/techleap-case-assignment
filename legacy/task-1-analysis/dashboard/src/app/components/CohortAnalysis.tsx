"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";

interface CohortData {
  founded_year: number;
  company_count: number;
  avg_funding: number;
  avg_rounds: number;
  operating_rate: number;
  acquired_rate: number;
}

interface CohortAnalysisProps {
  data: CohortData[];
}

export default function CohortAnalysis({ data }: CohortAnalysisProps) {
  return (
    <div className="bg-bg-secondary border border-white/5 rounded-2xl p-8">
      <h2 className="text-2xl font-heading font-bold text-white mb-2">Cohort Analysis: Companies by Founding Year</h2>
      <p className="text-text-secondary text-sm mb-6">
        Track how different founding year cohorts performed in terms of funding and outcomes
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Average Funding by Cohort */}
        <div>
          <h3 className="text-lg font-heading font-semibold text-white mb-4">Average Funding by Cohort</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="founded_year" tick={{ fill: "#94A3B8", fontSize: 12 }} />
                <YAxis
                  tick={{ fill: "#94A3B8" }}
                  tickFormatter={(value) => `$${(value / 1e6).toFixed(0)}M`}
                />
                <Tooltip
                  contentStyle={{ backgroundColor: "#162032", borderColor: "rgba(255,255,255,0.1)", color: "#F8FAFC" }}
                  formatter={(value: any) => [`$${(value / 1e6).toFixed(1)}M`, "Avg Funding"]}
                />
                <Line
                  type="monotone"
                  dataKey="avg_funding"
                  stroke="#38BDF8"
                  strokeWidth={3}
                  dot={{ fill: "#38BDF8", r: 5 }}
                  name="Average Funding"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Operating Rate by Cohort */}
        <div>
          <h3 className="text-lg font-heading font-semibold text-white mb-4">Operating Rate by Cohort</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="founded_year" tick={{ fill: "#94A3B8", fontSize: 12 }} />
                <YAxis tick={{ fill: "#94A3B8" }} label={{ value: "Operating Rate (%)", angle: -90, position: "insideLeft" }} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", borderColor: "rgba(255,255,255,0.1)", color: "#F8FAFC" }}
                  formatter={(value: any) => [`${value}%`, "Operating Rate"]}
                />
                <Line
                  type="monotone"
                  dataKey="operating_rate"
                  stroke="#38a169"
                  strokeWidth={3}
                  dot={{ fill: "#38a169", r: 5 }}
                  name="Operating Rate"
                />
                <Line
                  type="monotone"
                  dataKey="acquired_rate"
                  stroke="#FF5500"
                  strokeWidth={3}
                  dot={{ fill: "#FF5500", r: 5 }}
                  name="Acquired Rate"
                />
                <Legend />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Cohort Summary Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="text-left py-3 px-4 text-text-secondary font-semibold">Cohort</th>
              <th className="text-right py-3 px-4 text-text-secondary font-semibold">Companies</th>
              <th className="text-right py-3 px-4 text-text-secondary font-semibold">Avg Funding</th>
              <th className="text-right py-3 px-4 text-text-secondary font-semibold">Avg Rounds</th>
              <th className="text-right py-3 px-4 text-text-secondary font-semibold">Operating %</th>
              <th className="text-right py-3 px-4 text-text-secondary font-semibold">Acquired %</th>
            </tr>
          </thead>
          <tbody>
            {data.map((cohort) => (
              <tr key={cohort.founded_year} className="border-b border-white/5 hover:bg-bg-tertiary transition-colors">
                <td className="py-3 px-4 text-white font-medium">{cohort.founded_year}</td>
                <td className="py-3 px-4 text-right text-text-primary">{cohort.company_count.toLocaleString("en-US")}</td>
                <td className="py-3 px-4 text-right text-text-primary">${(cohort.avg_funding / 1e6).toFixed(1)}M</td>
                <td className="py-3 px-4 text-right text-text-primary">{cohort.avg_rounds.toFixed(2)}</td>
                <td className="py-3 px-4 text-right text-green-400">{cohort.operating_rate.toFixed(1)}%</td>
                <td className="py-3 px-4 text-right text-orange-400">{cohort.acquired_rate.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
