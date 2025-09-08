import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Search, MoreHorizontal, Users, AlertTriangle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

const users = [
  {
    id: "1",
    name: "Sarah Chen",
    email: "sarah@techcorp.com",
    type: "Buyer",
    company: "TechCorp Inc",
    country: "Singapore",
    status: "Active",
    joinDate: "2024-01-15",
    orders: 23,
  },
  {
    id: "2",
    name: "Marcus Rodriguez",
    email: "marcus@globalparts.mx",
    type: "Seller",
    company: "Global Parts Supply",
    country: "Mexico",
    status: "Active",
    joinDate: "2023-11-08",
    orders: 187,
  },
  {
    id: "3",
    name: "Aisha Nakamura",
    email: "aisha@innovatetech.jp",
    type: "Buyer",
    company: "Innovate Technologies",
    country: "Japan",
    status: "Pending",
    joinDate: "2024-02-20",
    orders: 5,
  },
  {
    id: "4",
    name: "Heinrich Weber",
    email: "h.weber@europrecision.de",
    type: "Seller",
    company: "Euro Precision Tools",
    country: "Germany",
    status: "Active",
    joinDate: "2023-09-12",
    orders: 342,
  },
  {
    id: "5",
    name: "Priya Sharma",
    email: "priya@techsolutions.in",
    type: "Buyer",
    company: "Tech Solutions Ltd",
    country: "India",
    status: "Suspended",
    joinDate: "2023-12-03",
    orders: 12,
  },
];

export function UserProfiles() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">User Profiles</h1>
          <p className="text-muted-foreground mt-1">
            Manage buyers and sellers across your marketplace
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">Export Users</Button>
          <Button className="shadow-sm">Add User</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-400">Total Users</p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">12,847</p>
                <p className="text-xs text-green-600 dark:text-green-500 mt-1">+12.5% from last month</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400">Active Sellers</p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">1,234</p>
                <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">+8.2% this week</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-400">Active Buyers</p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">11,613</p>
                <p className="text-xs text-purple-600 dark:text-purple-500 mt-1">+15.1% this week</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-400">Pending Review</p>
                <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">23</p>
                <p className="text-xs text-orange-600 dark:text-orange-500 mt-1">Needs attention</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4 bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">All Users</CardTitle>
              <CardDescription>A list of all users in your marketplace</CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-9 w-64 bg-white shadow-sm"
                />
              </div>
              <Button variant="outline" size="sm">Filter</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Orders</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                        <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.type === "Seller" ? "default" : "secondary"}
                      className={user.type === "Seller" ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}
                    >
                      {user.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-medium">{user.company}</TableCell>
                  <TableCell className="text-sm">{user.country}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        user.status === "Active" ? "default" : 
                        user.status === "Pending" ? "secondary" : 
                        "destructive"
                      }
                      className={`text-xs ${
                        user.status === "Active" ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400" :
                        user.status === "Pending" ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400" :
                        "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400"
                      }`}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-medium">{user.orders}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit User</DropdownMenuItem>
                        <DropdownMenuItem>Contact</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Suspend Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}