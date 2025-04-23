"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface RegionsChartProps {
  isLoading: boolean
  data: Array<{
    region: string
    sales: number
    percentage: number
  }>
}

export function RegionsChart({ isLoading, data }: RegionsChartProps) {
  const COLORS = ["#00AEEF", "#FF9F43", "#FF6B81", "#1E90FF", "#6C757D"]

  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="w-full h-full bg-gray-200 animate-pulse rounded"></div>
      </div>
    )
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="sales"
            nameKey="region"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [`TZS ${value.toLocaleString()}`, "Sales"]} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
