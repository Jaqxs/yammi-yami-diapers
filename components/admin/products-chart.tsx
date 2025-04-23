"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"

interface ProductsChartProps {
  isLoading: boolean
  data: Array<{
    name: string
    sales: number
    percentage: number
  }>
}

export function ProductsChart({ isLoading, data }: ProductsChartProps) {
  const colors = ["#00AEEF", "#FF9F43", "#FF6B81", "#1E90FF", "#6C757D"]

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
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="name" type="category" width={150} />
          <Tooltip formatter={(value: number) => [`${value} units`, "Sales"]} />
          <Bar dataKey="sales" fill="#00AEEF" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
