"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function OrderAnalytics({ data }: { data: any }) {
  const pieData = [
    { name: "Pending", value: data.pending, color: "#f59e0b" },
    { name: "Production", value: data.production, color: "#3b82f6" },
    { name: "Delivered", value: data.delivered, color: "#10b981" },
    { name: "Cancelled", value: data.cancelled, color: "#ef4444" },
  ].filter(item => item.value > 0);

  // Fallback if no data
  const chartData = pieData.length > 0 ? pieData : [{ name: "No Orders", value: 1, color: "#cbd5e1" }];

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Order Distribution</CardTitle>
        <CardDescription>Breakdown by current order status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
