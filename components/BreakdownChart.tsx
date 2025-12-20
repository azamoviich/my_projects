import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { TaxResult, UserProfile } from '../types';
import { COLORS } from '../constants';

interface BreakdownChartProps {
  taxResult: TaxResult;
  expenses: UserProfile['expenses'];
}

const BreakdownChart: React.FC<BreakdownChartProps> = ({ taxResult, expenses }) => {
  const netMonthly = taxResult.netIncomeThisMonth;
  const totalExpenses = (Object.values(expenses) as number[]).reduce((a, b) => a + b, 0);
  const remaining = Math.max(0, netMonthly - totalExpenses);

  const data = Object.entries(expenses).map(([key, value]) => ({
    name: key,
    value: value as number,
    color: COLORS[key] || COLORS.Other
  })).filter(d => d.value > 0);

  if (remaining > 0) {
    data.push({ name: 'Remaining/Savings', value: remaining, color: COLORS.Savings });
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            stroke="#0f172a" 
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => new Intl.NumberFormat('ru-RU').format(Math.round(value)) + ' UZS'}
            contentStyle={{ backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155', color: '#f8fafc' }}
          />
          <Legend iconType="circle" layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: '11px', color: '#cbd5e1' }}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BreakdownChart;