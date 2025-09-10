import { Card, CardContent } from '../../../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../components/ui/tabs';
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
} from 'lucide-react';

const disputes = [
  {
    id: 'DSP-001',
    orderNumber: 'ORD-20240301-456',
    buyer: 'TechCorp Inc',
    seller: 'Global Parts Supply',
    issue: 'Product quality mismatch',
    amount: '$12,450',
    status: 'Open',
    priority: 'High',
    submittedDate: '2024-03-01',
    daysOpen: 2,
    lastActivity: '2 hours ago',
  },
  {
    id: 'DSP-002',
    orderNumber: 'ORD-20240228-789',
    buyer: 'Innovate Technologies',
    seller: 'Euro Precision Tools',
    issue: 'Delayed delivery',
    amount: '$8,750',
    status: 'In Review',
    priority: 'Medium',
    submittedDate: '2024-02-28',
    daysOpen: 3,
    lastActivity: '1 day ago',
  },
  {
    id: 'DSP-003',
    orderNumber: 'ORD-20240227-123',
    buyer: 'Tech Solutions Ltd',
    seller: 'Nordic Supply Chain',
    issue: 'Wrong product shipped',
    amount: '$15,200',
    status: 'Resolved',
    priority: 'High',
    submittedDate: '2024-02-27',
    daysOpen: 0,
    lastActivity: 'Resolved 1 day ago',
  },
  {
    id: 'DSP-004',
    orderNumber: 'ORD-20240226-567',
    buyer: 'Manufacturing Plus',
    seller: 'Asian Electronics Co',
    issue: 'Payment processing error',
    amount: '$6,300',
    status: 'Escalated',
    priority: 'Critical',
    submittedDate: '2024-02-26',
    daysOpen: 5,
    lastActivity: '4 hours ago',
  },
];

const stats = [
  {
    title: 'Open Disputes',
    value: '12',
    icon: AlertTriangle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20',
  },
  {
    title: 'In Review',
    value: '8',
    icon: Clock,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
  },
  {
    title: 'Resolved Today',
    value: '15',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
  },
  {
    title: 'Escalated',
    value: '3',
    icon: XCircle,
    color: 'text-red-600',
    bgColor: 'bg-red-50 dark:bg-red-950/20',
  },
];

export function DisputeResolution() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2">Dispute Resolution Center</h2>
          <p className="text-muted-foreground">
            Manage and resolve marketplace disputes efficiently
          </p>
        </div>
        <Button>Create Report</Button>
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
                    <p className="text-sm text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-xl">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Disputes</TabsTrigger>
          <TabsTrigger value="open">Open</TabsTrigger>
          <TabsTrigger value="review">In Review</TabsTrigger>
          <TabsTrigger value="escalated">Escalated</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dispute ID</TableHead>
                    <TableHead>Parties</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Days Open</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disputes.map((dispute) => (
                    <TableRow key={dispute.id}>
                      <TableCell>
                        <div>
                          <div className="text-sm">{dispute.id}</div>
                          <div className="text-xs text-muted-foreground">
                            {dispute.orderNumber}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm">
                            <span className="text-muted-foreground">
                              Buyer:
                            </span>{' '}
                            {dispute.buyer}
                          </div>
                          <div className="text-sm">
                            <span className="text-muted-foreground">
                              Seller:
                            </span>{' '}
                            {dispute.seller}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm max-w-48">
                        {dispute.issue}
                      </TableCell>
                      <TableCell className="text-sm">
                        {dispute.amount}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            dispute.status === 'Open'
                              ? 'destructive'
                              : dispute.status === 'In Review'
                                ? 'secondary'
                                : dispute.status === 'Resolved'
                                  ? 'default'
                                  : 'outline'
                          }
                        >
                          {dispute.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            dispute.priority === 'Critical'
                              ? 'destructive'
                              : dispute.priority === 'High'
                                ? 'secondary'
                                : 'outline'
                          }
                        >
                          {dispute.priority}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {dispute.status === 'Resolved'
                          ? '-'
                          : `${dispute.daysOpen} days`}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <MessageSquare className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          {dispute.status !== 'Resolved' && (
                            <Button size="sm">Resolve</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="open">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Open disputes will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Disputes under review will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="escalated">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                <XCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Escalated disputes will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Resolved disputes will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
