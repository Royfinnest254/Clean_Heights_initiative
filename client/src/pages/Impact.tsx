import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ReferenceLine,
  Legend,
} from "recharts";

// ── Chart Data ─────────────────────────────────────────────
const wasteData = [
  { site: "Iten Public Park", kg: 45 },
  { site: "Iten Water Reserve", kg: 15 },
  { site: "Kipgorgotich Water Point", kg: 3 },
  { site: "Kamebur Viewpoint", kg: 0 },
  { site: "Escarpment", kg: 0 },
];

const budgetData = [
  { name: "Field Operations & Restoration", value: 45, color: "#1B4332" },
  { name: "Community Engagement", value: 30, color: "#40916C" },
  { name: "Programme Management", value: 15, color: "#C08A3E" },
  { name: "Monitoring, Evaluation & Learning", value: 10, color: "#4A4D4A" },
];

const volunteerData = [
  { date: "2 Feb", volunteers: 3 },
  { date: "9 Feb", volunteers: 5 },
  { date: "20 Feb", volunteers: 8 },
  { date: "23 Feb", volunteers: 11 },
  { date: "27 Feb", volunteers: 9 },
];

const litterData = [
  { site: "Kamelur Viewpoint", bags: 3 },
  { site: "Water Reserve", bags: 5 },
  { site: "Public Park", bags: 6 },
  { site: "Escarpment", bags: 6 },
  { site: "Kipgorgotich", bags: 4 },
];

// ── Activity Log ────────────────────────────────────────────
const activityLog = [
  { date: "2 Feb 2026", location: "Kamelur Viewpoint Escarpment", bags: 3, waste: "—", volunteers: 3 },
  { date: "9 Feb 2026", location: "Iten Water Reserve", bags: 5, waste: "15 kg", volunteers: 5 },
  { date: "20 Feb 2026", location: "Iten Public Park", bags: 6, waste: "45 kg", volunteers: 8 },
  { date: "23 Feb 2026", location: "Escarpment", bags: 6, waste: "—", volunteers: 11 },
  { date: "27 Feb 2026", location: "Kipgorgotich Water Point", bags: 4, waste: "3 kg", volunteers: 9 },
];

// custom tooltip for charts
const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-[#E9EDEA] rounded-none px-4 py-3 shadow-xl text-xs uppercase tracking-widest font-bold">
        <p className="text-[#1B4332] mb-1">{label || payload[0].name}</p>
        <p className="text-[#C08A3E]">
          {payload[0].value}
          {payload[0].name === "volunteers" ? " personnel" : payload[0].name === "kg" ? " net kg" : " units"}
        </p>
      </div>
    );
  }
  return null;
};

const PieTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white border border-[#E9EDEA] rounded-none px-4 py-3 shadow-xl text-xs uppercase tracking-widest font-bold max-w-xs">
        <p className="text-[#1B4332] mb-1">{payload[0].name}</p>
        <p className="text-[#C08A3E]">{payload[0].value}% Allocation</p>
      </div>
    );
  }
  return null;
};

// custom dot annotation for line chart
const PeakDot = (props: any) => {
  const { cx, cy, payload } = props;
  if (payload.volunteers === 11) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={8} fill="#2D6A4F" stroke="#fff" strokeWidth={2} />
        <text x={cx} y={cy - 16} textAnchor="middle" fill="#2D6A4F" fontSize={11} fontWeight={600}>
          Peak
        </text>
      </g>
    );
  }
  return <circle cx={cx} cy={cy} r={4} fill="#2D6A4F" stroke="#fff" strokeWidth={2} />;
};

export default function Impact() {
  return (
    <div className="min-h-screen bg-[#F8FBF8] text-[#1A1C1A]">
      <Navigation />

      {/* ── Page Header ── */}
      <section className="pt-32 pb-16 bg-white border-b border-[#E9EDEA]">
        <div className="container mx-auto px-4">
          <span className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-[#C08A3E] mb-6 block">
            Impact Analysis
          </span>
          <h1 className="text-[#1B4332] mb-6 leading-tight">Evidence & Results</h1>
          <p className="text-[#4A4D4A] max-w-2xl text-lg leading-relaxed">
            Transparent, data-driven reporting on every clean-up and intervention. Every
            figure below comes directly from CHI's verified field logs from February 2026.
          </p>
        </div>
      </section>

      {/* ── Summary Stat Cards ── */}
      <section className="chi-section-sm bg-[#1B4332] border-y border-[#2D6A4F]" aria-labelledby="stats-cards-heading">
        <div className="container mx-auto px-4">
          <h2 id="stats-cards-heading" className="sr-only">Summary Performance Indicators</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { value: "24", label: "Waste Units", suffix: "" },
              { value: "63", label: "Net kg Recovered", suffix: " kg" },
              { value: "35", label: "Personnel Deployments", suffix: "" },
              { value: "5", label: "Ecological Sites", suffix: "" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-white text-5xl font-extrabold tracking-tight mb-3 font-serif italic">{value}</p>
                <p className="text-[#C08A3E] text-[10px] font-extrabold uppercase tracking-[0.2em]">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Charts ── */}
      <section className="chi-section bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">

            {/* Chart 1 — Waste by Site (Horizontal Bar) */}
            <div>
              <span className="text-sm font-bold uppercase tracking-[0.2em] text-[#C08A3E]">March 2026 Intelligence Report</span>
              <h2 className="text-[#1B4332] mb-8 text-3xl">Net Waste Distribution</h2>
              <div className="h-px bg-[#E9EDEA] mb-12" />
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={wasteData} layout="vertical" margin={{ left: 10, right: 30, top: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="px 3" stroke="#E9EDEA" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10, fill: "#4A4D4A", fontWeight: "bold" }} unit=" kg" axisLine={false} tickLine={false} />
                  <YAxis
                    type="category"
                    dataKey="site"
                    tick={{ fontSize: 10, fill: "#1A1C1A", fontWeight: "bold" }}
                    width={140}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "#F8FBF8" }} />
                  <Bar dataKey="kg" fill="#1B4332" radius={0} maxBarSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Chart 2 — Budget Allocation (Donut) */}
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-[#C08A3E] mb-4 block">Transparency 002</span>
              <h2 className="text-[#1B4332] mb-8 text-3xl">Strategic Spend</h2>
              <div className="h-px bg-[#E9EDEA] mb-12" />
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={budgetData}
                    cx="50%"
                    cy="45%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {budgetData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend
                    iconType="square"
                    iconSize={8}
                    verticalAlign="bottom"
                    formatter={(value) => (
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#4A4D4A] ml-2">{value}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Chart 3 — Volunteer Growth (Line) */}
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-[#C08A3E] mb-4 block">Momentum 003</span>
              <h2 className="text-[#1B4332] mb-8 text-3xl">Personnel Engagement</h2>
              <div className="h-px bg-[#E9EDEA] mb-12" />
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={volunteerData} margin={{ left: 0, right: 20, top: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E9EDEA" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: "#4A4D4A", fontWeight: "bold" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#4A4D4A", fontWeight: "bold" }} allowDecimals={false} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} />
                  <ReferenceLine
                    y={11}
                    stroke="#C08A3E"
                    strokeDasharray="4 4"
                    label={{
                      value: "Operational Peak",
                      position: "insideTopLeft",
                      fontSize: 10,
                      fill: "#C08A3E",
                      fontWeight: "800"
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="volunteers"
                    stroke="#1B4332"
                    strokeWidth={4}
                    dot={{ r: 0 }}
                    activeDot={{ r: 6, stroke: "#1B4332", fill: "#fff", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Chart 4 — Litter Bags by Site (Column) */}
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-[#C08A3E] mb-4 block">Action 004</span>
              <h2 className="text-[#1B4332] mb-8 text-3xl">Units per Catchment</h2>
              <div className="h-px bg-[#E9EDEA] mb-12" />
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={litterData} margin={{ left: 0, right: 20, top: 5, bottom: 50 }}>
                  <CartesianGrid strokeDasharray="px 3" stroke="#E9EDEA" vertical={false} />
                  <XAxis
                    dataKey="site"
                    tick={{ fontSize: 9, fill: "#1A1C1A", fontWeight: "bold" }}
                    angle={-25}
                    textAnchor="end"
                    interval={0}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis tick={{ fontSize: 10, fill: "#4A4D4A", fontWeight: "bold" }} allowDecimals={false} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: "#F8FBF8" }} />
                  <Bar dataKey="bags" fill="#40916C" radius={0} maxBarSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </section>

      {/* ── Activity Log Table ── */}
      <section className="chi-section bg-[#F8FBF8] border-y border-[#E9EDEA]" aria-labelledby="activity-log-heading">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-xl">
               <span className="text-[10px] font-extrabold uppercase tracking-[0.4em] text-[#C08A3E] mb-4 block">Operational Ledger</span>
               <h2 id="activity-log-heading" className="text-[#1B4332] mb-6">
                 Clean-up Activity Log
               </h2>
               <p className="text-[#4A4D4A]">
                 Primary verification record of all field operations conducted during the February 2026 reporting period.
               </p>
            </div>
            <div className="h-px bg-[#E9EDEA] flex-grow hidden md:block mx-8 mb-4" />
            <div className="text-right">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#1A1C1A]">Verified by Chairperson</span>
            </div>
          </div>
          
          <div className="overflow-x-auto rounded-none border border-[#E9EDEA] bg-white">
            <table className="chi-table !border-none" aria-label="February 2026 activity log">
              <thead className="border-b-2 border-[#1B4332]">
                <tr>
                  <th className="!bg-white !text-[#1B4332] uppercase tracking-[0.2em] text-[10px] font-black border-r border-[#E9EDEA]">Date</th>
                  <th className="!bg-white !text-[#1B4332] uppercase tracking-[0.2em] text-[10px] font-black border-r border-[#E9EDEA]">Catchment Zone</th>
                  <th className="!bg-white !text-[#1B4332] uppercase tracking-[0.2em] text-[10px] font-black border-r border-[#E9EDEA]">Units (Bags)</th>
                  <th className="!bg-white !text-[#1B4332] uppercase tracking-[0.2em] text-[10px] font-black border-r border-[#E9EDEA]">Net mass (kg)</th>
                  <th className="!bg-white !text-[#1B4332] uppercase tracking-[0.2em] text-[10px] font-black">Personnel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9EDEA]">
                {activityLog.map((row, i) => (
                  <tr key={i} className="hover:bg-[#F8FBF8] transition-colors">
                    <td className="whitespace-nowrap font-bold text-xs border-r border-[#E9EDEA]">{row.date}</td>
                    <td className="text-xs font-medium border-r border-[#E9EDEA]">{row.location}</td>
                    <td className="text-xs font-bold border-r border-[#E9EDEA]">{row.bags}</td>
                    <td className="text-xs font-bold border-r border-[#E9EDEA]">{row.waste}</td>
                    <td className="text-xs font-bold">{row.volunteers}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-[#1B4332] bg-[#F8FBF8]">
                <tr className="totals-row !bg-[#F8FBF8]">
                  <td colSpan={2} className="text-xs font-black uppercase tracking-widest border-r border-[#E9EDEA]">Cumulative Total</td>
                  <td className="text-xs font-black border-r border-[#E9EDEA]">24 Bags</td>
                  <td className="text-xs font-black border-r border-[#E9EDEA]">63 kg</td>
                  <td className="text-xs font-black">36 Man-hours</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>

      {/* ── Download CTA ── */}
      <section className="py-24 bg-white" aria-labelledby="download-heading">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto border-2 border-dashed border-[#E9EDEA] p-16">
            <h2 id="download-heading" className="text-[#1B4332] mb-6 text-3xl">
              Download Formal Field Report
            </h2>
            <p className="text-[#4A4D4A] mb-10 max-w-xl mx-auto leading-relaxed">
              The full February 2026 disclosure report includes detailed site methodology, 
              verified logistics data, and technical ecosystem observations.
            </p>
            <a
              href="#"
              className="chi-btn chi-btn-primary px-12 group"
              aria-label="Download February 2026 Field Report PDF (coming soon)"
              onClick={(e) => e.preventDefault()}
            >
              <svg className="w-5 h-5 mr-3 group-hover:translate-y-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              February 2026 Data Release (PDF)
            </a>
            <p className="text-[#C08A3E] text-[10px] font-extrabold uppercase tracking-widest mt-6">Awaiting Official Client Review</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
