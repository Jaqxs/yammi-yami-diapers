"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Mock data for sales chart
const data = [
  { name: "Jan", total: 1500 },
  { name: "Feb", total: 2300 },
  { name: "Mar", total: 3200 },
  { name: "Apr", total: 4500 },
  { name: "May", total: 3800 },
  { name: "Jun", total: 5500 },
  { name: "Jul", total: 7000 },
  { name: "Aug", total: 6300 },
  { name: "Sep", total: 5800 },
  { name: "Oct", total: 6800 },
  { name: "Nov", total: 7500 },
  { name: "Dec", total: 9000 },
]

export function SalesChart() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip formatter={(value: number) => [`$${value}`, "Revenue"]} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
        <Bar dataKey="total" fill="#4299e1" radius={[4, 4, 0, 0]} className="fill-yammy-blue" />
      </BarChart>
    </ResponsiveContainer>
  )
}
