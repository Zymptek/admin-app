import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Clock, FileText, Building } from "lucide-react";

const pendingVerifications = [
  {
    id: "1",
    companyName: "Nordic Supply Chain",
    contactPerson: "Lars Andersen",
    email: "lars@nordicsupply.no",
    country: "Norway",
    submittedDate: "2024-02-28",
    daysWaiting: 3,
    category: "Industrial Equipment",
    documentsSubmitted: 8,
    verificationLevel: "Standard",
  },
  {
    id: "2",
    companyName: "African Trade Solutions",
    contactPerson: "Amara Okafor",
    email: "amara@africantradesol.ng",
    country: "Nigeria",
    submittedDate: "2024-02-25",
    daysWaiting: 6,
    category: "Textiles & Apparel",
    documentsSubmitted: 12,
    verificationLevel: "Premium",
  },
  {
    id: "3",
    companyName: "Asia Pacific Electronics",
    contactPerson: "Kim Min-jun",
    email: "kim@apelectronics.kr",
    country: "South Korea",
    submittedDate: "2024-02-27",
    daysWaiting: 4,
    category: "Electronics",
    documentsSubmitted: 15,
    verificationLevel: "Premium",
  },
  {
    id: "4",
    companyName: "Green Energy Brazil",
    contactPerson: "Carlos Silva",
    email: "carlos@greenenergybr.com",
    country: "Brazil",
    submittedDate: "2024-02-26",
    daysWaiting: 5,
    category: "Renewable Energy",
    documentsSubmitted: 10,
    verificationLevel: "Standard",
  },
];

export function PendingVerifications() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2">Pending Seller Verifications</h2>
          <p className="text-muted-foreground">
            Review and approve new seller applications
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">Bulk Actions</Button>
          <Button>Review Queue</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Awaiting Review</p>
                <p className="text-xl">23</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Needs Documents</p>
                <p className="text-xl">8</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-0 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Building className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Approved Today</p>
                <p className="text-xl">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Waiting</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Documents</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingVerifications.map((verification) => (
                <TableRow key={verification.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${verification.companyName}`} />
                        <AvatarFallback>
                          {verification.companyName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm">{verification.companyName}</div>
                        <div className="text-xs text-muted-foreground">{verification.contactPerson}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{verification.category}</TableCell>
                  <TableCell className="text-sm">{verification.country}</TableCell>
                  <TableCell>
                    <Badge variant={verification.daysWaiting > 5 ? "destructive" : "secondary"}>
                      {verification.daysWaiting} days
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={verification.verificationLevel === "Premium" ? "default" : "outline"}>
                      {verification.verificationLevel}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{verification.documentsSubmitted} files</TableCell>
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
    </div>
  );
}