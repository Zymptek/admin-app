'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
import { Search, MoreHorizontal, Users, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import { DynamicDialog } from '../../../components/dialogs';
import { FormData, FormSubmissionResult } from '../../../requests/strapi';
import {
  useUserProfilesPageContent,
  useUsers,
  useCreateUser,
  useUpdateUser,
} from '../../../hooks';
import {
  transformUserFormConfig,
  transformUserToFormDataDynamic,
  transformFormDataToUser,
  transformUserForDisplay,
  calculateUserStatistics,
} from '../../../lib/formConfigTransformer';
import { toast } from 'sonner';
import { UserProfilesSkeleton } from './skeletons/user-profiles-skeleton';

export const UserProfilesDynamic = React.memo(function UserProfilesDynamic() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [editingUser, setEditingUser] = useState<FormData | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [currentPage] = useState(1);
  const [pageSize] = useState(10);

  // Debounce search term to reduce API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch page content from Strapi
  const {
    data: pageContent,
    isLoading: contentLoading,
    error: contentError,
  } = useUserProfilesPageContent();

  // Fetch users from backend with debounced search
  const {
    data: usersResponse,
    isLoading: usersLoading,
    error: usersError,
  } = useUsers({
    page: currentPage,
    limit: pageSize,
    search: debouncedSearchTerm || undefined,
  });

  // Mutations
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();

  // Extract users from the backend response with memoization
  const users = useMemo(() => {
    console.log('Raw usersResponse:', usersResponse);
    const userList = usersResponse?.users || [];
    console.log('Extracted users:', userList);
    if (userList.length > 0) {
      console.log('First user structure:', userList[0]);
    }
    return userList;
  }, [usersResponse]);

  // Transform and filter users with memoization (always call this hook)
  const { filteredUsers } = useMemo(() => {
    if (!users || users.length === 0) {
      return { filteredUsers: [] };
    }

    const transformed = users.map(transformUserForDisplay);

    // Client-side filtering for immediate feedback (since we have debounced API search)
    const filtered = transformed.filter(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (user: any) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.country.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return { filteredUsers: filtered };
  }, [users, searchTerm]);

  // Calculate statistics (always call this hook)
  const statistics = useMemo(() => {
    if (!users || users.length === 0) {
      return {
        totalUsers: 0,
        activeSellers: 0,
        activeBuyers: 0,
        suspendedUsers: 0,
        pendingUsers: 0,
      };
    }
    return calculateUserStatistics(users);
  }, [users]);

  // Show loading state with skeleton
  if (contentLoading || usersLoading) {
    return <UserProfilesSkeleton />;
  }

  // Show error state
  if (contentError || usersError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600">
            Error Loading Data
          </h3>
          <p className="text-gray-600 mt-2">
            {contentError?.message ||
              usersError?.message ||
              'Failed to load user profiles'}
          </p>
        </div>
      </div>
    );
  }

  if (!pageContent || !usersResponse) {
    return <UserProfilesSkeleton />;
  }

  // Handle user creation/update
  const handleUserSubmit = async (
    data: FormData
  ): Promise<FormSubmissionResult> => {
    try {
      const isEdit = editingUser !== null;

      // Validate required fields for creation
      if (!isEdit) {
        if (!data.email || !data.password || !data.userType) {
          return {
            success: false,
            message:
              'Email, password, and user type are required for new users.',
          };
        }
      }

      const userData = transformFormDataToUser(data, !isEdit);

      // Debug logging for development
      console.log('Form data received:', data);
      console.log('Transformed user data:', userData);

      // Additional validation for userType
      if (
        userData.userType &&
        !['buyer', 'seller', 'admin'].includes(userData.userType)
      ) {
        console.error('Invalid userType:', userData.userType);
        return {
          success: false,
          message: 'User type must be buyer, seller, or admin.',
        };
      }

      if (isEdit) {
        await updateUserMutation.mutateAsync({
          id: editingUser.id as string,
          userData,
        });
        setEditingUser(null);
        return {
          success: true,
          message: pageContent.editUserForm.successMessage,
        };
      } else {
        await createUserMutation.mutateAsync(userData);
        return {
          success: true,
          message: pageContent.createUserForm.successMessage,
        };
      }
    } catch (error: unknown) {
      console.error('User submission error:', error);

      // Extract meaningful error message from the error
      let errorMessage = 'An error occurred. Please try again.';

      if (error instanceof Error) {
        // Check if it's a validation error from the backend
        if (error.message.includes('User type must be')) {
          errorMessage = 'User type must be buyer, seller, or admin.';
        } else if (error.message.includes('email')) {
          errorMessage = 'Please provide a valid email address.';
        } else if (error.message.includes('password')) {
          errorMessage = 'Please provide a valid password.';
        } else {
          errorMessage = error.message;
        }
      }

      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  // Normalize form data to match select options
  const normalizeFormDataForSelects = (
    formData: Record<string, unknown>,
    formConfig: {
      formFields?: Array<{ fieldKey: string; selectOptions?: string }>;
    }
  ) => {
    const normalizedData = { ...formData };

    // Find userType field in the form config
    const userTypeField = formConfig.formFields?.find(
      (field) => field.fieldKey === 'userType'
    );
    if (userTypeField && userTypeField.selectOptions) {
      const options = userTypeField.selectOptions
        .split(',')
        .map((option: string) => option.trim())
        .filter(Boolean);

      // Try to match the current userType value with available options
      if (formData.userType && options.length > 0) {
        const matchingOption = options.find(
          (option: string) =>
            option.toLowerCase() === formData.userType.toLowerCase()
        );
        if (matchingOption) {
          normalizedData.userType = matchingOption;
          console.log(
            `Normalized userType from "${formData.userType}" to "${matchingOption}"`
          );
        } else {
          console.warn(
            `No matching option found for userType "${formData.userType}" in options:`,
            options
          );
        }
      }
    }

    return normalizedData;
  };

  // Handle edit user
  const handleEditUser = (displayUser: { id: string }) => {
    // Find the original user data by ID from the original users array
    const originalUser = users.find(
      (u: { id: string }) => u.id === displayUser.id
    );

    if (!originalUser) {
      console.error('Original user not found for ID:', displayUser.id);
      toast.error('User data not found. Please refresh and try again.');
      return;
    }

    console.log('Display user:', displayUser);
    console.log('Original user:', originalUser);

    // Use dynamic transformation based on form configuration
    let formData = transformUserToFormDataDynamic(
      originalUser,
      editFormConfig.formFields
    );
    console.log('Dynamic form data for editing:', formData);

    // Normalize form data to match select options
    formData = normalizeFormDataForSelects(formData, pageContent.editUserForm);
    console.log('Final normalized form data for editing:', formData);

    setEditingUser(formData);
    setEditDialogOpen(true);
  };

  // Handle suspend user (currently disabled)
  const handleSuspendUser = async () => {
    toast.info('Suspend account functionality is currently not available');
  };

  // Handle unsuspend user (currently disabled)
  const handleUnsuspendUser = async () => {
    toast.info('Unsuspend account functionality is currently not available');
  };

  // Handle edit dialog close
  const handleEditDialogClose = (open: boolean) => {
    setEditDialogOpen(open);
    if (!open) {
      setEditingUser(null);
    }
  };

  // Transform form configs
  const createFormConfig = transformUserFormConfig(
    pageContent.createUserForm,
    'create'
  );
  const editFormConfig = transformUserFormConfig(
    pageContent.editUserForm,
    'edit'
  );

  // Debug: Log the form field configurations
  console.log('Create form fields:', createFormConfig.formFields);
  console.log('Edit form fields:', editFormConfig.formFields);

  // Get visible columns
  const visibleColumns = pageContent.tableColumns
    .filter((col) => col.isVisible)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  // Get visible statistics cards
  const visibleStatsCards = pageContent.statisticsCards
    .filter((card) => card.isVisible)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {pageContent.pageTitle}
          </h1>
          <p className="text-muted-foreground mt-1">
            {pageContent.pageDescription}
          </p>
        </div>
        <div className="flex space-x-3">
          {pageContent.enableExport && (
            <Button variant="outline">Export Users</Button>
          )}

          {pageContent.enableAddUser && (
            <DynamicDialog
              trigger={
                <Button className="shadow-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              }
              title={pageContent.createUserForm.formTitle}
              description={pageContent.createUserForm.formDescription}
              formConfig={createFormConfig}
              onSubmit={handleUserSubmit}
              maxWidth={pageContent.createUserForm.dialogWidth}
            />
          )}

          {/* Edit User Dialog - Controlled by state */}
          <DynamicDialog
            title={pageContent.editUserForm.formTitle}
            description={pageContent.editUserForm.formDescription}
            formConfig={editFormConfig}
            existingData={editingUser || undefined}
            mode="edit"
            onSubmit={handleUserSubmit}
            open={editDialogOpen}
            onOpenChange={handleEditDialogClose}
            maxWidth={pageContent.editUserForm.dialogWidth}
          />
        </div>
      </div>

      {/* Statistics Cards */}
      {pageContent.showStatisticsCards && (
        <div className="grid gap-4 md:grid-cols-4">
          {visibleStatsCards.map((card) => {
            const value = statistics[card.dataType];
            const colorClasses = {
              green:
                'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
              blue: 'from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
              purple:
                'from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20',
              orange:
                'from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20',
              red: 'from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20',
            };

            return (
              <Card
                key={card.id}
                className={`border-0 shadow-lg bg-gradient-to-br ${colorClasses[card.cardColor]}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p
                        className={`text-sm font-medium text-${card.cardColor}-700 dark:text-${card.cardColor}-400`}
                      >
                        {card.cardTitle}
                      </p>
                      <p
                        className={`text-3xl font-bold text-${card.cardColor}-900 dark:text-${card.cardColor}-100`}
                      >
                        {value}
                      </p>
                      {card.cardDescription && (
                        <p
                          className={`text-xs text-${card.cardColor}-600 dark:text-${card.cardColor}-500 mt-1`}
                        >
                          {card.cardDescription}
                        </p>
                      )}
                    </div>
                    <Users className={`h-8 w-8 text-${card.cardColor}-600`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Users Table */}
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
              {pageContent.enableSearch && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-9 w-64 bg-white shadow-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              )}
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
                {visibleColumns.map((column) => (
                  <TableHead key={column.id}>{column.columnName}</TableHead>
                ))}
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map(
                (
                  user: any // eslint-disable-line @typescript-eslint/no-explicit-any
                ) => (
                  <TableRow key={user.id}>
                    {visibleColumns.map((column) => (
                      <TableCell key={column.id}>
                        {column.dataField === 'name' && (
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`}
                              />
                              <AvatarFallback>
                                {user.name
                                  .split(' ')
                                  .map((n: string) => n[0])
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
                        )}
                        {column.dataField === 'type' && (
                          <Badge
                            variant={
                              user.type === 'seller'
                                ? 'default'
                                : user.type === 'buyer'
                                  ? 'secondary'
                                  : user.type === 'admin'
                                    ? 'destructive'
                                    : 'outline'
                            }
                          >
                            {user.type}
                          </Badge>
                        )}
                        {column.dataField === 'status' && (
                          <Badge
                            variant={
                              user.status === 'active'
                                ? 'default'
                                : user.status === 'pending_verification'
                                  ? 'secondary'
                                  : 'destructive'
                            }
                            className={`text-xs ${
                              user.status === 'active'
                                ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/20 dark:text-green-400'
                                : user.status === 'pending_verification'
                                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400'
                                  : 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400'
                            }`}
                          >
                            {user.status}
                          </Badge>
                        )}
                        {!['name', 'type', 'status'].includes(
                          column.dataField
                        ) && (
                          <span className="text-sm">
                            {user[column.dataField] || 'N/A'}
                          </span>
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditUser(user)}
                          >
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem>Contact</DropdownMenuItem>
                          {user.status === 'suspended' ? (
                            <DropdownMenuItem
                              onClick={() => handleUnsuspendUser()}
                            >
                              Unsuspend Account
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleSuspendUser()}
                            >
                              Suspend Account
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
});
