"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type ChartData = {
  name: string;
  revenue: number;
};

export function RevenueChart({ data }: { data: ChartData[] }) {
  return (
    <div className="w-full h-75">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00f3ff" stopOpacity={0} />
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            dy={10}
          />
          
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `${value}€`}
            width={60}
          />
          
          <Tooltip
            contentStyle={{
              backgroundColor: "#0a0f1d",
              borderColor: "rgba(255,255,255,0.1)",
              borderRadius: "8px",
              color: "#fff",
            }}
            itemStyle={{ color: "#00f3ff", fontWeight: "bold" }}
            formatter={(value: any) => [`${Number(value).toFixed(2)} €`, "CA"]}
          />
          
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#00f3ff"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorRevenue)"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}