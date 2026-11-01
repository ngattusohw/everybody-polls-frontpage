import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import type { ResultOption } from '@/lib/backend';

const COLORS = ['#0f766e', '#e0a52e', '#7c6bb1', '#367da5', '#bd6173', '#6b7c45'];

export function PieChartComponent({ results }: { results: ResultOption[] }) {
  const data = results.map(result => ({
    id: result.optionId,
    name: result.optionText,
    value: result.votes,
  }));

  return (
    <div className="h-[320px] w-full" role="img" aria-label="Vote distribution. Exact counts are listed in the table below.">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="46%" innerRadius="47%" outerRadius="75%" paddingAngle={2} dataKey="value">
            {data.map((option, index) => <Cell key={option.id} fill={COLORS[index % COLORS.length]} />)}
          </Pie>
          <Tooltip formatter={value => [`${Number(value).toLocaleString()} votes`, 'Responses']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
