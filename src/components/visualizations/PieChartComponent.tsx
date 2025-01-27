import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface PieChartProps {
  results: {
    optionId: string;
    optionText: string;
    votes: number;
    percentage: number;
  }[];
}

const COLORS = ['#dc2626', '#2563eb']; // Blue and red for binary choices

export function PieChartComponent({ results }: PieChartProps) {
  const data = results.map((result) => ({
    name: result.optionText,
    value: result.votes,
    percentage: result.percentage.toFixed(1),
  }));

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name}: ${percentage}%`}
            outerRadius={150}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [`${value} votes`, 'Total']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
