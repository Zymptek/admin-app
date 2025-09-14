import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../../components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { Badge } from '../../../components/ui/badge';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../../../components/ui/avatar';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import {
  Search,
  MoreHorizontal,
  Users,
  AlertTriangle,
  Plus,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { DynamicDialog } from '../../../components/dialogs';
import { getUserFormConfig } from '../../../lib/formConfigs';
import { FormData, FormSubmissionResult } from '../../../requests/strapi/types';

// Initial users data
const initialUsers = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah@techcorp.com',
    type: 'Buyer',
    company: 'TechCorp Inc',
    country: 'Singapore',
    status: 'Active',
    joinDate: '2024-01-15',
    orders: 23,
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    email: 'marcus@globalparts.mx',
    type: 'Seller',
    company: 'Global Parts Supply',
    country: 'Mexico',
    status: 'Active',
    joinDate: '2023-11-08',
    orders: 187,
  },
  {
    id: '3',
    name: 'Aisha Nakamura',
    email: 'aisha@innovatetech.jp',
    type: 'Buyer',
    company: 'Innovate Technologies',
    country: 'Japan',
    status: 'Pending',
    joinDate: '2024-02-20',
    orders: 5,
  },
  {
    id: '4',
    name: 'Heinrich Weber',
    email: 'h.weber@europrecision.de',
    type: 'Seller',
    company: 'Euro Precision Tools',
    country: 'Germany',
    status: 'Active',
    joinDate: '2023-09-12',
    orders: 342,
  },
  {
    id: '5',
    name: 'Priya Sharma',
    email: 'priya@techsolutions.in',
    type: 'Buyer',
    company: 'Tech Solutions Ltd',
    country: 'India',
    status: 'Suspended',
    joinDate: '2023-12-03',
    orders: 12,
  },
];

export function UserProfiles() {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<FormData | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const totalUsers = users.length;
  const activeSellers = users.filter(
    (user) => user.type === 'Seller' && user.status === 'Active'
  ).length;
  const activeBuyers = users.filter(
    (user) => user.type === 'Buyer' && user.status === 'Active'
  ).length;
  const pendingUsers = users.filter((user) => user.status === 'Pending').length;

  // Handle user creation/update
  const handleUserSubmit = async (
    data: FormData
  ): Promise<FormSubmissionResult> => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock validation for email uniqueness
      const mockExistingEmails = ['admin@zymptek.com', 'test@example.com'];
      const isEdit = editingUser !== null;
      const isEmailChanged = isEdit && editingUser.email !== data.email;

      if (isEmailChanged || !isEdit) {
        if (mockExistingEmails.includes(data.email as string)) {
          return {
            success: false,
            message:
              'Email address is already in use. Please choose a different email.',
            errors: [
              { field: 'email', message: 'This email is already registered' },
            ],
          };
        }
      }

      const user = {
        id: isEdit ? (editingUser.id as string) : `user-${Date.now()}`,
        name: data.name as string,
        email: data.email as string,
        type: data.userType as string,
        company: (data.company as string) || 'N/A',
        country: (data.country as string) || 'N/A',
        status: 'Active' as const,
        joinDate: isEdit
          ? (editingUser.joinDate as string)
          : new Date().toISOString().split('T')[0],
        orders: isEdit ? (editingUser.orders as number) : 0,
      };

      if (isEdit) {
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u.id === editingUser.id ? user : u))
        );
        setEditingUser(null);
      } else {
        setUsers((prevUsers) => [user, ...prevUsers]);
      }

      return {
        success: true,
        message: isEdit
          ? 'User updated successfully!'
          : 'User created successfully!',
      };
    } catch (error) {
      console.error('User submission error:', error);
      return {
        success: false,
        message: 'An error occurred. Please try again.',
      };
    }
  };

  // Handle edit user
  const handleEditUser = (user: {
    id: string;
    name: string;
    email: string;
    type: string;
    company: string;
    country: string;
    joinDate: string;
    orders: number;
  }) => {
    setEditingUser({
      id: user.id,
      name: user.name,
      email: user.email,
      userType: user.type,
      company: user.company,
      country: user.country,
      joinDate: user.joinDate,
      orders: user.orders,
    });
    setEditDialogOpen(true);
  };

  // Handle edit dialog close
  const handleEditDialogClose = (open: boolean) => {
    setEditDialogOpen(open);
    if (!open) {
      setEditingUser(null);
    }
  };

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

          {/* Create User Dialog */}
          <DynamicDialog
            trigger={
              <Button className="shadow-sm">
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            }
            title="Create New User"
            description="Add a new user to your marketplace platform."
            formConfig={getUserFormConfig('create')}
            onSubmit={handleUserSubmit}
            maxWidth="2xl"
          />

          {/* Edit User Dialog - Controlled by state */}
          <DynamicDialog
            title="Edit User"
            description="Update user information and permissions."
            formConfig={getUserFormConfig('edit')}
            existingData={editingUser || undefined}
            mode="edit"
            onSubmit={handleUserSubmit}
            open={editDialogOpen}
            onOpenChange={handleEditDialogClose}
            maxWidth="2xl"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-400">
                  Total Users
                </p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                  {totalUsers}
                </p>
                <p className="text-xs text-green-600 dark:text-green-500 mt-1">
                  +12.5% from last month
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                  Active Sellers
                </p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  {activeSellers}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-500 mt-1">
                  +8.2% this week
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-400">
                  Active Buyers
                </p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                  {activeBuyers}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-500 mt-1">
                  +15.1% this week
                </p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-400">
                  Pending Review
                </p>
                <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                  {pendingUsers}
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-500 mt-1">
                  Needs attention
                </p>
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
              <CardDescription>
                A list of all users in your marketplace
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  className="pl-9 w-64 bg-white shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="sm">
                Filter
              </Button>
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
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                        />
                        <AvatarFallback>
                          {user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm">{user.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.type === 'Seller' ? 'default' : 'secondary'}
                      className={
                        user.type === 'Seller'
                          ? 'bg-primary/10 text-primary hover:bg-primary/20'
                          : ''
                      }
                    >
                      {user.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {user.company}
                  </TableCell>
                  <TableCell className="text-sm">{user.country}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === 'Active'
                          ? 'default'
                          : user.status === 'Pending'
                            ? 'secondary'
                            : 'destructive'
                      }
                      className={`text-xs ${
                        user.status === 'Active'
                          ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400'
                          : user.status === 'Pending'
                            ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400'
                            : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400'
                      }`}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {user.orders}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>
                          Edit User
                        </DropdownMenuItem>
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
