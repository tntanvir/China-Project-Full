"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function PaymentAnalytics({ data }: { data: any }) {
  const pieData = [
    { name: "Stripe", value: data.stripe, color: "#6366f1" },
    { name: "PayPal", value: data.paypal, color: "#0ea5e9" },
  ].filter(item => item.value > 0);

  // Fallback if no data
  const chartData = pieData.length > 0 ? pieData : [{ name: "No Payments", value: 1, color: "#cbd5e1" }];

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Payment Gateways</CardTitle>
        <CardDescription>Revenue distribution by payment method</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={0}
                outerRadius={100}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: any, name: any) => [`$${Number(value).toFixed(2)}`, name]}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
