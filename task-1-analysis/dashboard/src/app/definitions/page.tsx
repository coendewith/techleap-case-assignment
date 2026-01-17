import { Book, Ruler, Database, Info, GitBranch, Binary, Globe } from "lucide-react";

export default function DefinitionsPage() {
    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="border-b border-white/5 pb-8">
                <h1 className="text-4xl font-heading font-bold text-white mb-4">Definitions & Methodology</h1>
                <p className="text-text-secondary text-lg max-w-3xl">
                    Understanding the metrics, categorizations, and data sources used in this dashboard to analyze the Dutch startup ecosystem.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Deep Tech vs Digital */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="bg-bg-secondary rounded-2xl border border-white/5 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Binary className="text-accent-red" size={24} />
                            Sector Categorization
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">Deep Tech</h3>
                                <p className="text-sm text-text-secondary mb-4">
                                    Ventures based on substantial scientific advances and high-tech engineering. Characterized by long R&D cycles and high capital intensity.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        "Biotechnology",
                                        "Clean Technology",
                                        "Hardware",
                                        "Semiconductors",
                                        "Energy",
                                        "Advanced Materials",
                                        "Medical",
                                        "Health Care"
                                    ].map(tag => (
                                        <span key={tag} className="px-2 py-1 bg-accent-red/10 border border-accent-red/20 rounded text-xs text-accent-red">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white mb-3">Digital</h3>
                                <p className="text-sm text-text-secondary mb-4">
                                    Software-driven ventures focused on digital platforms, applications, and services. Characterized by faster scalability and lower initial capex.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        "Software",
                                        "E-Commerce",
                                        "Web",
                                        "Mobile",
                                        "Analytics",
                                        "Games",
                                        "Social Media"
                                    ].map(tag => (
                                        <span key={tag} className="px-2 py-1 bg-accent-blue/10 border border-accent-blue/20 rounded text-xs text-accent-blue">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-bg-tertiary rounded-xl border border-white/5 text-sm text-text-muted italic">
                            * Note: "Other" includes services, consulting, non-tech specific retail, and generic business categories.
                        </div>
                    </section>

                    {/* Key Metrics */}
                    <section className="bg-bg-secondary rounded-2xl border border-white/5 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Ruler className="text-green-400" size={24} />
                            Key Metrics
                        </h2>

                        <div className="space-y-6">
                            <div className="border-b border-white/5 pb-6 last:border-0 last:pb-0">
                                <h3 className="text-lg font-bold text-white mb-2">Scaleup Ratio</h3>
                                <p className="text-text-secondary text-sm mb-3">
                                    The percentage of startups that successfully graduate from one funding stage to the next (e.g., Seed → Series A).
                                </p>
                                <div className="bg-black/30 p-3 rounded-lg font-mono text-xs text-green-400">
                                    (Companies raised Series A / Companies raised Seed) * 100
                                </div>
                            </div>

                            <div className="border-b border-white/5 pb-6 last:border-0 last:pb-0">
                                <h3 className="text-lg font-bold text-white mb-2">Deep Tech Intensity</h3>
                                <p className="text-text-secondary text-sm mb-3">
                                    A measure of a hub's specialization in Deep Tech. Calculated as the share of either total funding volume or total company count attributed to Deep Tech sectors.
                                </p>
                                <div className="bg-black/30 p-3 rounded-lg font-mono text-xs text-accent-red">
                                    Intensity (Funding) = (Deep Tech Funding / Total Hub Funding) * 100
                                </div>
                            </div>

                            <div className="border-b border-white/5 pb-6 last:border-0 last:pb-0">
                                <h3 className="text-lg font-bold text-white mb-2">Operating Rate</h3>
                                <p className="text-text-secondary text-sm mb-3">
                                    The percentage of companies in the dataset that are currently 'operating' or have been 'acquired/IPOed'. Excludes 'closed' companies.
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Methodology Sidebar */}
                <div className="lg:col-span-1 space-y-8">
                    <section className="bg-bg-tertiary rounded-xl border border-white/5 p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Database size={18} className="text-text-muted" />
                            Data Sources
                        </h3>
                        <ul className="space-y-4 text-sm text-text-secondary">
                            <li className="flex gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent-blue mt-1.5 shrink-0"></span>
                                <span>
                                    <strong className="text-white block">VC Investments Dataset</strong>
                                    Proprietary export of Venture Capital deals involving Dutch and benchmark ecosystems (USA, UK, DE, FR).
                                </span>
                            </li>
                            <li className="flex gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent-blue mt-1.5 shrink-0"></span>
                                <span>
                                    <strong className="text-white block">State of Dutch Tech 2024</strong>
                                    Contextual insights and domestic participation statistics derived from the official 2024 report.
                                </span>
                            </li>
                            <li className="flex gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-accent-blue mt-1.5 shrink-0"></span>
                                <span>
                                    <strong className="text-white block">Wennink Report</strong>
                                    Strategic recommendations ("Focus on Strongholds") used to frame the Hub Analysis.
                                </span>
                            </li>
                        </ul>
                    </section>

                    <section className="bg-bg-tertiary rounded-xl border border-white/5 p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Globe size={18} className="text-text-muted" />
                            Geographic Scope
                        </h3>
                        <div className="text-sm text-text-secondary space-y-3">
                            <p>
                                <strong className="text-white">Netherlands:</strong> All cities with relevant dealflow. Top 5 Hubs (Amsterdam, Eindhoven, Rotterdam, Delft, Utrecht) analyzed specifically.
                            </p>
                            <p>
                                <strong className="text-white">Benchmarks:</strong>
                                <br />Global (Aggregate)
                                <br />USA (Mature Ecosystem)
                                <br />Germany, France, UK (European Peers)
                            </p>
                        </div>
                    </section>
                </div>

            </div>
        </div>
    );
}
