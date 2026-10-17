"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function RevenueAnalytics({ data }: { data: any }) {
  // Mocking time-series for the Area Chart based on the aggregate data
  // In a real scenario, the backend should return array of {date, gross, net}
  const chartData = [
    { name: "Jan", gross: data.gross * 0.05, net: data.net * 0.05 },
    { name: "Feb", gross: data.gross * 0.08, net: data.net * 0.08 },
    { name: "Mar", gross: data.gross * 0.12, net: data.net * 0.12 },
    { name: "Apr", gross: data.gross * 0.10, net: data.net * 0.10 },
    { name: "May", gross: data.gross * 0.15, net: data.net * 0.15 },
    { name: "Jun", gross: data.gross * 0.20, net: data.net * 0.20 },
    { name: "Jul", gross: data.gross * 0.15, net: data.net * 0.15 },
  ];

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Revenue Analytics</CardTitle>
        <CardDescription>Gross vs Net revenue over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorGross" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorNet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
              />
              <Area type="monotone" dataKey="gross" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorGross)" name="Gross Revenue" />
              <Area type="monotone" dataKey="net" stroke="#10b981" fillOpacity={1} fill="url(#colorNet)" name="Net Revenue" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
