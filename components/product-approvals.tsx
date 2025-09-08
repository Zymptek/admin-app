import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Clock, Eye, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

const pendingProducts = [
  {
    id: "1",
    name: "Industrial Grade 3D Printer",
    seller: "TechManufacturing Co",
    category: "Industrial Equipment",
    price: "$15,450",
    submittedDate: "2024-03-01",
    daysWaiting: 2,
    images: 8,
    description: "High-precision industrial 3D printer for metal components",
    status: "Pending Review",
    priority: "Standard",
    sku: "IND-3DP-001",
  },
  {
    id: "2", 
    name: "Organic Cotton Fabric Rolls",
    seller: "EcoTextiles Ltd",
    category: "Textiles & Apparel",
    price: "$45/meter",
    submittedDate: "2024-02-29",
    daysWaiting: 3,
    images: 12,
    description: "100% organic cotton fabric for sustainable fashion",
    status: "Documentation Required",
    priority: "Standard",
    sku: "TEX-OCF-045",
  },
  {
    id: "3",
    name: "Solar Panel Array System",
    seller: "GreenEnergy Solutions",
    category: "Renewable Energy", 
    price: "$8,750",
    submittedDate: "2024-02-28",
    daysWaiting: 4,
    images: 15,
    description: "Complete 5kW solar panel system with inverters",
    status: "Quality Check",
    priority: "High",
    sku: "SOL-PAN-5KW",
  },
  {
    id: "4",
    name: "Automotive Engine Components",
    seller: "PrecisionParts Inc",
    category: "Automotive Parts",
    price: "$1,250",
    submittedDate: "2024-02-27",
    daysWaiting: 5,
    images: 6,
    description: "High-performance engine components for luxury vehicles",
    status: "Compliance Review",
    priority: "High",
    sku: "AUTO-ENG-LP01",
  },
  {
    id: "5",
    name: "Medical Grade Protective Equipment",
    seller: "HealthTech Supplies",
    category: "Healthcare & Medical",
    price: "$125/unit",
    submittedDate: "2024-02-26",
    daysWaiting: 6,
    images: 10,
    description: "FDA approved protective equipment for healthcare workers",
    status: "Certification Pending",
    priority: "Critical",
    sku: "MED-PPE-001",
  },
];

const stats = [
  {
    title: "Awaiting Review",
    value: "156",
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/20",
  },
  {
    title: "In Review",
    value: "43",
    icon: Eye,
    color: "text-blue-600", 
    bgColor: "bg-blue-50 dark:bg-blue-950/20",
  },
  {
    title: "Approved Today",
    value: "28",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/20",
  },
  {
    title: "Rejected",
    value: "7",
    icon: XCircle,
    color: "text-red-600",
    bgColor: "bg-red-50 dark:bg-red-950/20",
  },
];

export function ProductApprovals() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2">Product Approvals</h2>
          <p className="text-muted-foreground">
            Review and approve new product listings
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Bulk Actions</Button>
          <Button>Review Queue</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className={`border-0 ${stat.bgColor}`}>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-xl">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="inreview">In Review</TabsTrigger>
          <TabsTrigger value="approved">Recently Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Waiting</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                            <ImageWithFallback 
                              src={`https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&auto=format`}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                          <div>
                            <div className="text-sm max-w-48 truncate">{product.name}</div>
                            <div className="text-xs text-muted-foreground">{product.sku}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${product.seller}`} />
                            <AvatarFallback className="text-xs">
                              {product.seller.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{product.seller}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{product.category}</TableCell>
                      <TableCell className="text-sm">{product.price}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            product.status === "Pending Review" ? "secondary" :
                            product.status === "Quality Check" ? "default" :
                            product.status === "Documentation Required" ? "outline" :
                            "secondary"
                          }
                          className="text-xs"
                        >
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={
                            product.priority === "Critical" ? "destructive" :
                            product.priority === "High" ? "secondary" :
                            "outline"
                          }
                          className="text-xs"
                        >
                          {product.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={product.daysWaiting > 5 ? "destructive" : "secondary"}>
                          {product.daysWaiting} days
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            Review
                          </Button>
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

        <TabsContent value="inreview">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Products currently under review will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Recently approved products will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                <XCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Rejected products will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Approval Guidelines</CardTitle>
          <CardDescription>
            Key criteria for product approval process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <h4 className="text-sm">Quality Standards</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Product must meet minimum quality requirements and industry standards
              </p>
            </div>

            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <h4 className="text-sm">Documentation</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Complete product specifications, certifications, and compliance documents
              </p>
            </div>

            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-blue-600" />
                <h4 className="text-sm">Content Review</h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Accurate descriptions, proper categorization, and appropriate images
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}