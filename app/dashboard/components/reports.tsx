import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import { Calendar } from '../../../components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../../../components/ui/popover';
import {
  CalendarIcon,
  Download,
  FileText,
  BarChart3,
  TrendingUp,
  Users,
  Package,
} from 'lucide-react';
import { format } from 'date-fns';
import { useState } from 'react';

const reportTemplates = [
  {
    id: '1',
    name: 'Monthly Sales Report',
    description: 'Comprehensive sales data and revenue analytics',
    category: 'Sales',
    frequency: 'Monthly',
    lastGenerated: '2024-03-01',
    icon: BarChart3,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
  },
  {
    id: '2',
    name: 'User Activity Report',
    description: 'User engagement and behavior analysis',
    category: 'Users',
    frequency: 'Weekly',
    lastGenerated: '2024-02-28',
    icon: Users,
    color: 'text-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950/20',
  },
  {
    id: '3',
    name: 'Product Performance',
    description: 'Product listings, views, and conversion rates',
    category: 'Products',
    frequency: 'Daily',
    lastGenerated: '2024-03-02',
    icon: Package,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
  },
  {
    id: '4',
    name: 'Financial Summary',
    description: 'Revenue, fees, and payment processing data',
    category: 'Finance',
    frequency: 'Monthly',
    lastGenerated: '2024-03-01',
    icon: TrendingUp,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20',
  },
];

const recentReports = [
  {
    id: '1',
    name: 'February 2024 Sales Report',
    type: 'Sales',
    generatedDate: '2024-03-01',
    size: '2.4 MB',
    format: 'PDF',
    status: 'Ready',
  },
  {
    id: '2',
    name: 'Q1 2024 User Analytics',
    type: 'Users',
    generatedDate: '2024-02-29',
    size: '1.8 MB',
    format: 'Excel',
    status: 'Ready',
  },
  {
    id: '3',
    name: 'Product Performance - Week 9',
    type: 'Products',
    generatedDate: '2024-02-28',
    size: '945 KB',
    format: 'PDF',
    status: 'Ready',
  },
  {
    id: '4',
    name: 'Dispute Resolution Summary',
    type: 'Operations',
    generatedDate: '2024-02-27',
    size: '1.2 MB',
    format: 'Excel',
    status: 'Processing',
  },
];

export function Reports() {
  const [date, setDate] = useState<Date>();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="mb-2">Reports & Analytics</h2>
          <p className="text-muted-foreground">
            Generate and manage marketplace reports
          </p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Custom Report
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {reportTemplates.map((template) => {
          const Icon = template.icon;
          return (
            <Card
              key={template.id}
              className={`border-0 ${template.bgColor} hover:shadow-md transition-shadow cursor-pointer`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon className={`h-6 w-6 ${template.color}`} />
                  <Badge variant="outline" className="text-xs">
                    {template.frequency}
                  </Badge>
                </div>
                <CardTitle className="text-base">{template.name}</CardTitle>
                <CardDescription className="text-sm">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="text-xs text-muted-foreground">
                    Last generated: {template.lastGenerated}
                  </div>
                  <Button size="sm" className="w-full">
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Quick Report Generator</CardTitle>
            <CardDescription>
              Generate custom reports with specific parameters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div>
                <label className="text-sm">Report Type</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales Report</SelectItem>
                    <SelectItem value="users">User Analytics</SelectItem>
                    <SelectItem value="products">
                      Product Performance
                    </SelectItem>
                    <SelectItem value="finance">Financial Summary</SelectItem>
                    <SelectItem value="disputes">Dispute Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm">Date Range</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <label className="text-sm">Format</label>
                <Select defaultValue="pdf">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                    <SelectItem value="csv">CSV File</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>
              Download or view recently generated reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm">{report.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {report.generatedDate} • {report.size} •{' '}
                          {report.format}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        report.status === 'Ready' ? 'default' : 'secondary'
                      }
                      className="text-xs"
                    >
                      {report.status}
                    </Badge>
                    {report.status === 'Ready' && (
                      <Button size="sm" variant="outline">
                        <Download className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Scheduled Reports</CardTitle>
          <CardDescription>
            Automated reports sent to your team regularly
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm">Weekly Sales Summary</h4>
                <Badge variant="secondary">Active</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Every Monday at 9:00 AM
              </p>
              <p className="text-xs text-muted-foreground">
                Recipients: admin@marketplace.com
              </p>
            </div>

            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm">Monthly Financial Report</h4>
                <Badge variant="secondary">Active</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                1st of each month at 8:00 AM
              </p>
              <p className="text-xs text-muted-foreground">
                Recipients: finance@marketplace.com
              </p>
            </div>

            <div className="p-4 border rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm">Daily Dispute Summary</h4>
                <Badge variant="outline">Paused</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Daily at 6:00 PM</p>
              <p className="text-xs text-muted-foreground">
                Recipients: support@marketplace.com
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
