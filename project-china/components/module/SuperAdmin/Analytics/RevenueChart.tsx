"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const revenueByRange: Record<string, { name: string; total: number }[]> = {
  today: [{ name: "Today", total: 0 }],
  "7days": [
    { name: "Mon", total: 120 },
    { name: "Tue", total: 180 },
    { name: "Wed", total: 140 },
    { name: "Thu", total: 220 },
    { name: "Fri", total: 160 },
    { name: "Sat", total: 90 },
    { name: "Sun", total: 110 },
  ],
  "30days": [
    { name: "Week 1", total: 720 },
    { name: "Week 2", total: 940 },
    { name: "Week 3", total: 810 },
    { name: "Week 4", total: 1020 },
  ],
  year: [
    { name: "Jan", total: 1200 },
    { name: "Feb", total: 1800 },
    { name: "Mar", total: 2100 },
    { name: "Apr", total: 1950 },
    { name: "May", total: 2400 },
    { name: "Jun", total: 2600 },
    { name: "Jul", total: 2200 },
    { name: "Aug", total: 2500 },
    { name: "Sep", total: 2300 },
    { name: "Oct", total: 2800 },
    { name: "Nov", total: 3100 },
    { name: "Dec", total: 3400 },
  ],
};

export function RevenueChart() {
  const [timeRange, setTimeRange] = useState("year");
  const chartData = revenueByRange[timeRange] ?? revenueByRange.year;

  return (
    <Card className="col-span-1 lg:col-span-4">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>
            Showing total revenue for the selected period
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="30days">Last 30 Days</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full mt-4 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="name"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Area
                type="monotone"
                dataKey="total"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorTotal)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
