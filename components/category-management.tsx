import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Search, Plus, TrendingUp, Package, Users, DollarSign } from "lucide-react";

const categories = [
  {
    id: "1",
    name: "Electronics & Technology",
    subcategories: 45,
    products: 12847,
    sellers: 234,
    monthlyRevenue: 2450000,
    growth: 15.2,
    status: "Active",
    description: "Consumer and industrial electronics",
  },
  {
    id: "2",
    name: "Industrial Equipment",
    subcategories: 32,
    products: 8956,
    sellers: 189,
    monthlyRevenue: 1980000,
    growth: 8.7,
    status: "Active",
    description: "Manufacturing and industrial machinery",
  },
  {
    id: "3",
    name: "Textiles & Apparel",
    subcategories: 28,
    products: 15632,
    sellers: 312,
    monthlyRevenue: 1650000,
    growth: 23.1,
    status: "Active",
    description: "Clothing, fabrics, and textile products",
  },
  {
    id: "4",
    name: "Automotive Parts",
    subcategories: 18,
    products: 6789,
    sellers: 145,
    monthlyRevenue: 1420000,
    growth: 12.8,
    status: "Active",
    description: "Vehicle components and accessories",
  },
  {
    id: "5",
    name: "Renewable Energy",
    subcategories: 12,
    products: 3456,
    sellers: 87,
    monthlyRevenue: 980000,
    growth: 31.2,
    status: "Growing",
    description: "Solar, wind, and sustainable energy solutions",
  },
  {
    id: "6",
    name: "Healthcare & Medical",
    subcategories: 15,
    products: 2345,
    sellers: 65,
    monthlyRevenue: 750000,
    growth: -2.1,
    status: "Review",
    description: "Medical devices and healthcare equipment",
  },
];

const pendingCategories = [
  {
    id: "1",
    name: "Smart Home Technology",
    requestedBy: "TechCorp Inc",
    submittedDate: "2024-02-28",
    potentialProducts: 450,
    description: "IoT devices and smart home automation",
    status: "Pending Review",
  },
  {
    id: "2",
    name: "3D Printing Materials",
    requestedBy: "Innovation Labs",
    submittedDate: "2024-02-25",
    potentialProducts: 230,
    description: "Filaments, resins, and 3D printing supplies",
    status: "Under Evaluation",
  },
];

export function CategoryManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2">Category Management</h2>
          <p className="text-muted-foreground">
            Organize and optimize your marketplace categories
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Category
          </Button>
          <Button>Category Analytics</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Categories</p>
                <p className="text-xl">47</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Sellers</p>
                <p className="text-xl">1,032</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/20 dark:to-purple-900/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-xl">$9.2M</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Growth</p>
                <p className="text-xl">+14.8%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Categories</TabsTrigger>
          <TabsTrigger value="pending">Pending Requests</TabsTrigger>
          <TabsTrigger value="analytics">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search categories..."
                    className="pl-9"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Sellers</TableHead>
                    <TableHead>Revenue</TableHead>
                    <TableHead>Growth</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div>
                          <div className="text-sm">{category.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {category.subcategories} subcategories
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {category.products.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-sm">
                        {category.sellers}
                      </TableCell>
                      <TableCell className="text-sm">
                        ${(category.monthlyRevenue / 1000000).toFixed(1)}M
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={category.growth > 0 ? "default" : "destructive"}
                            className="text-xs"
                          >
                            {category.growth > 0 ? "+" : ""}{category.growth}%
                          </Badge>
                          {category.growth > 0 && (
                            <TrendingUp className="h-3 w-3 text-green-600" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            category.status === "Active" ? "default" :
                            category.status === "Growing" ? "secondary" :
                            "outline"
                          }
                        >
                          {category.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Edit</Button>
                          <Button size="sm" variant="outline">View</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card className="border-0 shadow-sm">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category Name</TableHead>
                    <TableHead>Requested By</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Potential Products</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div>
                          <div className="text-sm">{category.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {category.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{category.requestedBy}</TableCell>
                      <TableCell className="text-sm">{category.submittedDate}</TableCell>
                      <TableCell className="text-sm">{category.potentialProducts}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{category.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">Review</Button>
                          <Button size="sm">Approve</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6 md:grid-cols-2">
            {categories.slice(0, 4).map((category) => (
              <Card key={category.id} className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{category.name}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Product Coverage</span>
                    <span>{((category.products / 20000) * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={(category.products / 20000) * 100} className="h-2" />
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Products</p>
                      <p>{category.products.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Growth</p>
                      <p className={category.growth > 0 ? "text-green-600" : "text-red-600"}>
                        {category.growth > 0 ? "+" : ""}{category.growth}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}