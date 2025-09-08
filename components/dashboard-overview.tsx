import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { TrendingUp, TrendingDown, Users, ShoppingCart, AlertTriangle, CheckCircle, DollarSign, Globe, Package, UserCheck, MoreHorizontal } from "lucide-react";

const stats = [
  {
    title: "Total Revenue",
    value: "$2.4M",
    change: "+20.1%",
    trend: "up",
    description: "from last month",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-900/10",
    progress: 85,
  },
  {
    title: "Active Users",
    value: "12,847",
    change: "+12.5%",
    trend: "up", 
    description: "buyers and sellers",
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-900/10",
    progress: 72,
  },
  {
    title: "Monthly Orders",
    value: "8,429",
    change: "+18.2%",
    trend: "up",
    description: "this month",
    icon: ShoppingCart,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-900/10",
    progress: 64,
  },
  {
    title: "Global Reach",
    value: "47",
    change: "+3",
    trend: "up",
    description: "countries active",
    icon: Globe,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-900/10",
    progress: 90,
  },
];

const quickActions = [
  { name: "Review Products", count: 23, icon: Package, href: "#" },
  { name: "Verify Sellers", count: 8, icon: UserCheck, href: "#" },
  { name: "Resolve Disputes", count: 5, icon: AlertTriangle, href: "#" },
];

const recentActivity = [
  {
    id: 1,
    action: "New seller application",
    user: "TechCorp Industries",
    time: "2 minutes ago",
    status: "pending",
  },
  {
    id: 2,
    action: "Large order placed",
    user: "Global Manufacturing",
    time: "5 minutes ago", 
    status: "success",
  },
  {
    id: 3,
    action: "Dispute resolved",
    user: "Euro Precision Tools",
    time: "12 minutes ago",
    status: "resolved",
  },
  {
    id: 4,
    action: "Product approved",
    user: "Green Energy Solutions", 
    time: "18 minutes ago",
    status: "approved",
  },
];

export function DashboardOverview() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl tracking-tight">Good morning, Admin</h1>
          <p className="text-muted-foreground mt-2">
            Here&apos;s what&apos;s happening with your marketplace today.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">Download Report</Button>
          <Button>View Analytics</Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
              <div className={`absolute inset-0 ${stat.bgColor} opacity-50`} />
              <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="space-y-1">
                  <CardTitle className="text-sm text-muted-foreground font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <span className="text-3xl font-bold">{stat.value}</span>
                    <Badge 
                      variant={stat.trend === "up" ? "default" : "secondary"}
                      className={`text-xs ${stat.trend === "up" ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" : ""}`}
                    >
                      {stat.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {stat.change}
                    </Badge>
                  </div>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent className="relative pt-0">
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{stat.progress}%</span>
                    </div>
                    <Progress value={stat.progress} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>
              Items that need your immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <div key={action.name} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{action.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {action.count} pending
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="font-semibold">
                    {action.count}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle className="text-lg">Recent Activity</CardTitle>
              <CardDescription>
                Latest updates from your marketplace
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'pending' ? 'bg-yellow-500' :
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'resolved' ? 'bg-blue-500' :
                    'bg-purple-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.user}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}