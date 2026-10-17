import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, ShoppingCart, Users, Package, FileText, FileCode2, Ticket, Percent } from "lucide-react";

export default function OverviewCards({ data }: { data: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Revenue Card */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border-blue-500/20 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Net Revenue</CardTitle>
          <div className="h-8 w-8 bg-blue-500/20 rounded-full flex items-center justify-center">
            <DollarSign className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">${data.revenue.net.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Gross: ${data.revenue.gross.toFixed(2)}
          </p>
        </CardContent>
      </Card>

      {/* Orders Card */}
      <Card className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Total Orders</CardTitle>
          <div className="h-8 w-8 bg-emerald-500/20 rounded-full flex items-center justify-center">
            <ShoppingCart className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{data.orders.total}</div>
          <p className="text-xs text-muted-foreground mt-1 flex gap-2">
            <span className="text-yellow-600 dark:text-yellow-400">{data.orders.pending} Pending</span>
            <span className="text-emerald-600 dark:text-emerald-400">{data.orders.delivered} Delivered</span>
          </p>
        </CardContent>
      </Card>

      {/* Customers Card */}
      <Card className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border-purple-500/20 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Customers</CardTitle>
          <div className="h-8 w-8 bg-purple-500/20 rounded-full flex items-center justify-center">
            <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{data.customers.total}</div>
          <p className="text-xs text-muted-foreground mt-1 flex gap-2">
            <span className="text-purple-600 dark:text-purple-400">{data.customers.active} Active</span>
            <span className="text-destructive">{data.customers.blocked} Blocked</span>
          </p>
        </CardContent>
      </Card>

      {/* Products Card */}
      <Card className="bg-gradient-to-br from-orange-500/10 to-orange-600/5 border-orange-500/20 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-orange-600 dark:text-orange-400">Products & Catalog</CardTitle>
          <div className="h-8 w-8 bg-orange-500/20 rounded-full flex items-center justify-center">
            <Package className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">{data.products.total}</div>
          <p className="text-xs text-muted-foreground mt-1 flex gap-2">
            <span className="text-orange-600 dark:text-orange-400">{data.products.active} Active Items</span>
          </p>
        </CardContent>
      </Card>

      {/* Secondary Metrics Row */}
      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Quotes Generated</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">{data.quotes.total}</div>
          <p className="text-xs text-muted-foreground">{data.quotes.approved} Approved</p>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Gerber Reviews</CardTitle>
          <FileCode2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">{data.gerbers.total}</div>
          <p className="text-xs text-muted-foreground">{data.gerbers.approved} Approved</p>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
          <Ticket className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">{data.tickets.total}</div>
          <p className="text-xs text-destructive">{data.tickets.open} Open</p>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Coupons</CardTitle>
          <Percent className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl font-bold">{data.coupons.active}</div>
          <p className="text-xs text-muted-foreground">out of {data.coupons.total} total</p>
        </CardContent>
      </Card>

    </div>
  );
}
