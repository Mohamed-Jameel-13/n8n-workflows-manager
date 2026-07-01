import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const data = [
  { day: "Mon", runs: 40 },
  { day: "Tue", runs: 52 },
  { day: "Wed", runs: 42 },
  { day: "Thu", runs: 70 },
  { day: "Fri", runs: 55 },
  { day: "Sat", runs: 30 },
  { day: "Sun", runs: 48 },
];

function WeeklyRunsChart() {
  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#9FEF00" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#9FEF00" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1f2937"
            vertical={false}
          />

          <XAxis dataKey="day" />
          <YAxis />

          <Tooltip />

          <Area
            type="monotone"
            dataKey="runs"
            stroke="#9FEF00"
            strokeWidth={3}
            fill="url(#gradient)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default WeeklyRunsChart;