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
 * Normalize userType value to match common select option formats
 */
function normalizeUserType(userType: string): string {
  if (!userType) return '';

  // Common variations and their normalized forms
  const userTypeMap: Record<string, string> = {
    buyer: 'buyer',
    Buyer: 'buyer',
    BUYER: 'buyer',
    seller: 'seller',
    Seller: 'seller',
    SELLER: 'seller',
    admin: 'admin',
    Admin: 'admin',
    ADMIN: 'admin',
  };

  return userTypeMap[userType] || userType;
}

/**
 * Transform backend user data to form data format (legacy function - use transformUserToFormDataDynamic)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformUserToFormData(user: any): Record<string, unknown> {
  const formData = {
    // Handle both single name field and separate firstName/lastName fields
    name:
      user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.firstName || user.lastName || '',
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    // Normalize userType to ensure it matches select options
    userType: normalizeUserType(user.userType || ''),
    company: user.companyName || user.company || '',
    country: user.country || '',
    phone: user.phone || '',
    // Include ID for editing
    id: user.id || '',
    // Include other fields that might be needed
    status: user.status || '',
    emailVerified: user.emailVerified || false,
    profileComplete: user.profileComplete || false,
  };

  return formData;
}

/**
 * Dynamically transform backend user data to form data based on Strapi form configuration
 */

export function transformUserToFormDataDynamic(
  user: Record<string, unknown>,
  formFields: Array<{ fieldKey: string }>
): Record<string, unknown> {
  const formData: Record<string, unknown> = {
    // Always include ID for editing
    id: user.id || '',
  };

  // Map each form field to user data
  formFields.forEach((field) => {
    const fieldKey = field.fieldKey;
    let value: unknown = '';

    // Map field keys to user data properties
    switch (fieldKey) {
      case 'firstName':
        value = String(user.firstName || '');
        break;
      case 'lastName':
        value = String(user.lastName || '');
        break;
      case 'name': {
        // Handle both single name field and separate firstName/lastName fields
        const firstName = String(user.firstName || '');
        const lastName = String(user.lastName || '');
        value =
          firstName && lastName
            ? `${firstName} ${lastName}`
            : firstName || lastName || '';
        break;
      }
      case 'email':
        value = String(user.email || '');
        break;
      case 'userType':
        value = normalizeUserType(String(user.userType || ''));
        break;
      case 'company':
      case 'companyName':
        value = String(user.companyName || user.company || '');
        break;
      case 'companyCode':
        value = String(user.companyCode || '');
        break;
      case 'country':
        value = String(user.country || '');
        break;
      case 'phone':
        value = String(user.phone || '');
        break;
      case 'password':
        // Don't populate password field for editing
        value = '';
        break;
      case 'status':
        value = String(user.status || '');
        break;
      case 'emailVerified':
        value = Boolean(user.emailVerified);
        break;
      case 'profileComplete':
        value = Boolean(user.profileComplete);
        break;
      default:
        // For any other fields, try to map directly from user data
        value = String(user[fieldKey] || user[fieldKey.toLowerCase()] || '');
    }

    formData[fieldKey] = value;
  });

  return formData;
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

  // Handle name fields - prioritize separate firstName/lastName over single name field
  if (formData.firstName || formData.lastName) {
    userData.firstName = formData.firstName || '';
    userData.lastName = formData.lastName || '';
  } else if (formData.name) {
    // Fallback to single name field - split into firstName and lastName
    const nameParts = (formData.name as string).split(' ');
    userData.firstName = nameParts[0];
    if (nameParts.length > 1) {
      userData.lastName = nameParts.slice(1).join(' ');
    }
  }

  // Map other fields with validation
  if (formData.email) {
    const email = formData.email as string;
    // Basic email validation
    if (email.includes('@') && email.includes('.')) {
      userData.email = email;
    } else {
      console.warn(`Invalid email format: "${email}"`);
      userData.email = email; // Still pass it through, let backend handle validation
    }
  }
  if (formData.password && isCreate) userData.password = formData.password;

  // Handle userType with proper validation
  if (formData.userType) {
    const userType = formData.userType as string;
    // Validate userType against allowed values
    const validUserTypes = ['buyer', 'seller', 'admin'];
    if (validUserTypes.includes(userType.toLowerCase())) {
      userData.userType = userType.toLowerCase();
    } else {
      // Default to buyer if invalid userType is provided
      console.warn(
        `Invalid userType "${userType}" provided. Defaulting to "buyer".`
      );
      userData.userType = 'buyer';
    }
  } else if (isCreate) {
    // Default userType for new users if not provided
    userData.userType = 'buyer';
  }

  // Map company fields
  if (formData.company) userData.companyName = formData.company;
  if (formData.companyName) userData.companyName = formData.companyName;
  if (formData.companyCode) userData.companyCode = formData.companyCode;
  if (formData.country) userData.country = formData.country;
  if (formData.phone) userData.phone = formData.phone;

  return userData;
}

/**
 * Transform user data for display in table with safe defaults
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function transformUserForDisplay(user: any): any {
  // Safe date formatting
  const formatJoinDate = (dateValue: unknown): string => {
    if (!dateValue) return 'N/A';

    const date = new Date(dateValue as string);
    if (isNaN(date.getTime())) {
      return 'N/A';
    }

    try {
      return date.toISOString().split('T')[0];
    } catch {
      return 'N/A';
    }
  };

  return {
    id: user?.id || 'N/A',
    name:
      user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : user?.firstName || user?.lastName || 'N/A',
    email: user?.email || 'N/A',
    type: user?.userType || 'N/A',
    company: user?.companyName || 'N/A',
    country: user?.country || 'N/A',
    status: user?.status || 'N/A',
    joinDate: formatJoinDate(user?.createdAt),
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
