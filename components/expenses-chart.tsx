"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function ExpensesChart({ data }: { data: { name: string, total: number }[] }) {
  // Si pas de données, on affiche un graphique vide propre
  const hasData = data.some(d => d.total > 0);

  return (
    <div className="h-75 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f87171" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#9ca3af" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            dy={10}
          />
          <YAxis 
            stroke="#9ca3af" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `${value}€`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#151c2e', borderColor: '#ffffff20', borderRadius: '8px' }}
            itemStyle={{ color: '#f87171', fontWeight: 'bold' }}
            formatter={(value: any) => [`${Number(value).toFixed(2)} €`, 'Dépenses']}
          />
          <Area 
            type="monotone" 
            dataKey="total" 
            stroke="#f87171" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorExpenses)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}