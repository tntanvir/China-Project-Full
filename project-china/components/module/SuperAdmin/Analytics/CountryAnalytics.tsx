"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const topCountries = [
  { name: "USA", revenue: 45231, percentage: 45, code: "US" },
  { name: "UK", revenue: 21450, percentage: 21, code: "GB" },
  { name: "Canada", revenue: 15300, percentage: 15, code: "CA" },
  { name: "Germany", revenue: 10200, percentage: 10, code: "DE" },
  { name: "Australia", revenue: 9050, percentage: 9, code: "AU" },
];

export default function CountryAnalytics() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Top Countries by Revenue</CardTitle>
        <CardDescription>Geographic distribution of sales</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6 mt-2">
          {topCountries.map((country) => (
            <div key={country.code} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 font-medium">
                  <span className="text-xl leading-none">
                    {/* Simple flag emoji fallback based on region indicator symbols */}
                    {String.fromCodePoint(
                      ...country.code.toUpperCase().split('').map(c => 127397 + c.charCodeAt(0))
                    )}
                  </span>
                  {country.name}
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-muted-foreground">${country.revenue.toLocaleString()}</span>
                  <span className="font-bold w-10 text-right">{country.percentage}%</span>
                </div>
              </div>
              <Progress value={country.percentage} className="h-2" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
