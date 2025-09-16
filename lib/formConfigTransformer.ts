/**
 * Utility functions to transform Strapi form configurations to DynamicForm format
 */

import { FormComponent, UserFormConfig } from '@/requests/strapi';

/**
 * Transform Strapi UserFormConfig to DynamicForm FormComponent format
 */
export function transformUserFormConfig(
  strapiForm: UserFormConfig,
  mode: 'create' | 'edit' = 'create'
): FormComponent {
  return {
    id: strapiForm.id,
    componentKey: `user-form-${mode}`,
    componentTitle: strapiForm.formTitle,
    componentDescription: strapiForm.formDescription,
    formFields: strapiForm.formFields.map((field) => ({
      id: field.id,
      fieldKey: field.fieldKey,
      fieldLabel: field.fieldLabel,
      fieldType: field.fieldType,
      placeholder: field.placeholder,
      helpText: field.helpText,
      isRequired: field.isRequired,
      isDisabled: field.isDisabled,
      fieldOrder: field.fieldOrder,
      selectOptions: field.selectOptions,
      minLength: field.minLength,
      maxLength: field.maxLength,
      minValue: field.minValue,
      maxValue: field.maxValue,
      errorMessage: field.errorMessage,
    })),
    submitButtonText: strapiForm.submitButtonText,
    resetButtonText: 'Clear Form',
    showResetButton: true,
    successMessage: strapiForm.successMessage,
    errorMessage: strapiForm.errorMessage,
    validationMode: 'onChange',
  };
}

/**
 * Transform backend user data to form data format
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformUserToFormData(user: any): Record<string, unknown> {
  return {
    name:
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.firstName || user.lastName || '',
    email: user.email || '',
    userType: user.userType || '',
    company: user.companyName || '',
    country: user.country || '',
    phone: user.phone || '',
  };
}

/**
 * Transform form data to backend user format
 */
export function transformFormDataToUser(
  formData: Record<string, unknown>,
  isCreate: boolean = false
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): any {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userData: any = {};

  // Handle name field - split into firstName and lastName
  if (formData.name) {
    const nameParts = (formData.name as string).split(' ');
    userData.firstName = nameParts[0];
    if (nameParts.length > 1) {
      userData.lastName = nameParts.slice(1).join(' ');
    }
  }

  // Map other fields
  if (formData.email) userData.email = formData.email;
  if (formData.password && isCreate) userData.password = formData.password;
  if (formData.userType) userData.userType = formData.userType;
  if (formData.company) userData.companyName = formData.company;
  if (formData.country) userData.country = formData.country;
  if (formData.phone) userData.phone = formData.phone;

  return userData;
}

/**
 * Transform user data for display in table
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformUserForDisplay(user: any): any {
  return {
    id: user.id,
    name:
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.firstName || user.lastName || 'N/A',
    email: user.email,
    type: user.userType,
    company: user.companyName || 'N/A',
    country: user.country || 'N/A',
    status: user.status,
    joinDate: user.createdAt
      ? new Date(user.createdAt).toISOString().split('T')[0]
      : 'N/A',
    orders: 0, // This would come from orders API
  };
}

/**
 * Get statistics data from users list
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function calculateUserStatistics(users: any[]): {
  totalUsers: number;
  activeSellers: number;
  activeBuyers: number;
  pendingUsers: number;
  suspendedUsers: number;
} {
  return {
    totalUsers: users.length,
    activeSellers: users.filter(
      (user) => user.userType === 'seller' && user.status === 'active'
    ).length,
    activeBuyers: users.filter(
      (user) => user.userType === 'buyer' && user.status === 'active'
    ).length,
    pendingUsers: users.filter((user) => user.status === 'pending_verification')
      .length,
    suspendedUsers: users.filter((user) => user.status === 'suspended').length,
  };
}
