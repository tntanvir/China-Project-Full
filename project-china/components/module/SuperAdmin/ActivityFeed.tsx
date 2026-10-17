"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, CheckCircle, UserPlus, FileCode2, ShieldAlert, Package, LogIn, Activity as ActivityIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Activity = {
  id: string;
  action: string;
  message: string;
  createdAt: string;
  user?: { name: string, role: string };
};

const getActivityIcon = (action: string) => {
  if (action.includes("ORDER")) return <ShoppingCart className="h-4 w-4 text-blue-500" />;
  if (action.includes("PAYMENT")) return <CheckCircle className="h-4 w-4 text-green-500" />;
  if (action.includes("LOGIN")) return <LogIn className="h-4 w-4 text-slate-500" />;
  if (action.includes("REGISTER") || action.includes("USER")) return <UserPlus className="h-4 w-4 text-purple-500" />;
  if (action.includes("GERBER")) return <FileCode2 className="h-4 w-4 text-orange-500" />;
  if (action.includes("TICKET")) return <ShieldAlert className="h-4 w-4 text-red-500" />;
  if (action.includes("PRODUCT")) return <Package className="h-4 w-4 text-teal-500" />;
  return <ActivityIcon className="h-4 w-4 text-muted-foreground" />;
};

export function ActivityFeed() {
  const [activities] = useState<Activity[]>([
    {
      id: "api-removed",
      action: "API_REMOVED",
      message: "Live backend activity has been disabled.",
      createdAt: new Date().toISOString(),
    },
  ]);

  return (
    <Card className="col-span-1 lg:col-span-3">
      <CardHeader>
        <CardTitle>Live Activity</CardTitle>
        <CardDescription>Real-time platform events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {activities.length > 0 ? activities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 animate-in slide-in-from-left-2 fade-in duration-300">
              <div className="rounded-full bg-muted p-2">
                {getActivityIcon(activity.action)}
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium leading-none">
                  {activity.user ? `${activity.user.name}: ` : ""}{activity.action.replace(/_/g, " ")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          )) : (
            <p className="text-sm text-muted-foreground">No recent activity.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

