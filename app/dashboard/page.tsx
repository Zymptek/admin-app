"use client"
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Package,
  MessageSquareWarning,
  BarChart3,
  FolderTree,
  FileText,
  Settings,
  Bell,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { DashboardOverview } from "@/components/dashboard-overview";
import { UserProfiles } from "@/components/user-profiles";
import { PendingVerifications } from "@/components/pending-verifications";
import { ProductApprovals } from "@/components/product-approvals";
import { DisputeResolution } from "@/components/dispute-resolution";
import { OrderAnalytics } from "@/components/order-analytics";
import { CategoryManagement } from "@/components/category-management";
import { Reports } from "@/components/reports";

const navigation = [
  {
    id: "overview",
    name: "Overview",
    icon: LayoutDashboard,
    component: DashboardOverview,
  },
  {
    id: "users",
    name: "User Profiles",
    icon: Users,
    component: UserProfiles,
  },
  {
    id: "verifications",
    name: "Seller Verification",
    icon: UserCheck,
    component: PendingVerifications,
  },
  {
    id: "products",
    name: "Product Approvals",
    icon: Package,
    component: ProductApprovals,
  },
  {
    id: "disputes",
    name: "Dispute Center",
    icon: MessageSquareWarning,
    component: DisputeResolution,
  },
  {
    id: "analytics",
    name: "Order Analytics",
    icon: BarChart3,
    component: OrderAnalytics,
  },
  {
    id: "categories",
    name: "Categories",
    icon: FolderTree,
    component: CategoryManagement,
  },
  {
    id: "reports",
    name: "Reports",
    icon: FileText,
    component: Reports,
  },
];

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("overview");

  const ActiveComponent =
    navigation.find((nav) => nav.id === activeSection)
      ?.component || DashboardOverview;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar className="border-r bg-white shadow-lg">
          <SidebarHeader className="border-b bg-gradient-to-r from-primary/5 to-primary/10 p-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold">M</span>
              </div>
              <div>
                <h1 className="font-semibold text-foreground">
                  Marketplace Admin
                </h1>
                <p className="text-xs text-muted-foreground">
                  B2B Trading Platform
                </p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-3">
            <div className="space-y-1">
              <div className="px-3 py-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Main Menu
                </p>
              </div>
              <SidebarMenu>
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        onClick={() =>
                          setActiveSection(item.id)
                        }
                        isActive={isActive}
                        className={`w-full rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "hover:bg-accent hover:shadow-sm"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="font-medium">
                          {item.name}
                        </span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>

              <div className="my-6 border-t" />

              <div className="px-3 py-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  System
                </p>
              </div>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton className="w-full rounded-lg hover:bg-accent hover:shadow-sm transition-all duration-200">
                    <Settings className="h-4 w-4" />
                    <span className="font-medium">
                      Settings
                    </span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="border-b bg-white/80 backdrop-blur-xl sticky top-0 z-40 shadow-sm">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center space-x-4">
                <SidebarTrigger />
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search orders, customers, products..."
                    className="pl-9 w-80 bg-white border-0 shadow-sm focus:shadow-md transition-shadow"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative"
                >
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </Button>
                <div className="flex items-center space-x-3 pl-4 border-l">
                  <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin" />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium">
                      Admin User
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Marketplace Admin
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="flex-1 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="p-8">
              <ActiveComponent />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}