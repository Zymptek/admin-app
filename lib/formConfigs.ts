import { FormComponent } from '@/requests/strapi/types';

/**
 * Predefined form configurations for common scenarios
 * These can be easily customized or extended
 */

export const getUserFormConfig = (
  mode: 'create' | 'edit' = 'create'
): FormComponent => ({
  id: 1,
  componentKey: 'user-management',
  componentTitle: mode === 'create' ? 'Create New User' : 'Edit User',
  componentDescription:
    mode === 'create'
      ? 'Add a new user to your marketplace platform.'
      : 'Update user information and permissions.',
  formFields: [
    {
      id: 1,
      fieldKey: 'name',
      fieldLabel: 'Full Name',
      fieldType: 'text',
      placeholder: 'Enter full name',
      isRequired: true,
      isDisabled: false,
      fieldOrder: 1,
      minLength: 2,
      maxLength: 100,
      errorMessage: 'Name must be between 2-100 characters',
    },
    {
      id: 2,
      fieldKey: 'email',
      fieldLabel: 'Email Address',
      fieldType: 'email',
      placeholder: 'Enter email address',
      isRequired: true,
      isDisabled: false,
      fieldOrder: 2,
      errorMessage: 'Please enter a valid email address',
    },
    {
      id: 3,
      fieldKey: 'password',
      fieldLabel: 'Password',
      fieldType: 'password',
      placeholder:
        mode === 'create'
          ? 'Create a secure password'
          : 'Leave blank to keep current password',
      isRequired: mode === 'create',
      isDisabled: false,
      fieldOrder: 3,
      minLength: 8,
      maxLength: 100,
      helpText:
        mode === 'create'
          ? 'Password must be at least 8 characters long'
          : 'Leave blank to keep current password',
      errorMessage: 'Password must be at least 8 characters long',
    },
    {
      id: 4,
      fieldKey: 'userType',
      fieldLabel: 'User Type',
      fieldType: 'select',
      placeholder: 'Select user type',
      isRequired: true,
      isDisabled: false,
      fieldOrder: 4,
      selectOptions: 'Buyer,Seller,Admin',
      helpText: 'Choose the role for this user',
      errorMessage: 'Please select a user type',
    },
    {
      id: 5,
      fieldKey: 'company',
      fieldLabel: 'Company',
      fieldType: 'text',
      placeholder: 'Enter company name',
      isRequired: false,
      isDisabled: false,
      fieldOrder: 5,
      maxLength: 100,
      helpText: 'Optional: Company or organization name',
    },
    {
      id: 6,
      fieldKey: 'country',
      fieldLabel: 'Country',
      fieldType: 'select',
      placeholder: 'Select country',
      isRequired: false,
      isDisabled: false,
      fieldOrder: 6,
      selectOptions:
        'United States,Canada,United Kingdom,Germany,France,Spain,Italy,Japan,Australia,India,Singapore,Mexico,Other',
      helpText: 'Optional: User location',
    },
  ],
  submitButtonText: mode === 'create' ? 'Create User' : 'Update User',
  resetButtonText: 'Clear Form',
  showResetButton: true,
  successMessage:
    mode === 'create'
      ? 'User created successfully!'
      : 'User updated successfully!',
  errorMessage:
    mode === 'create'
      ? 'Failed to create user. Please try again.'
      : 'Failed to update user. Please try again.',
  validationMode: 'onChange',
});

export const getCategoryFormConfig = (
  mode: 'create' | 'edit' = 'create'
): FormComponent => ({
  id: 2,
  componentKey: 'category-management',
  componentTitle: mode === 'create' ? 'Create New Category' : 'Edit Category',
  componentDescription:
    mode === 'create'
      ? 'Add a new product category to organize your marketplace.'
      : 'Update category information and settings.',
  formFields: [
    {
      id: 1,
      fieldKey: 'name',
      fieldLabel: 'Category Name',
      fieldType: 'text',
      placeholder: 'Enter category name',
      isRequired: true,
      isDisabled: false,
      fieldOrder: 1,
      minLength: 2,
      maxLength: 50,
      errorMessage: 'Category name must be between 2-50 characters',
    },
    {
      id: 2,
      fieldKey: 'description',
      fieldLabel: 'Description',
      fieldType: 'textarea',
      placeholder: 'Enter category description',
      isRequired: false,
      isDisabled: false,
      fieldOrder: 2,
      maxLength: 500,
      helpText: 'Optional: Brief description of this category',
    },
    {
      id: 3,
      fieldKey: 'parentCategory',
      fieldLabel: 'Parent Category',
      fieldType: 'select',
      placeholder: 'Select parent category (optional)',
      isRequired: false,
      isDisabled: false,
      fieldOrder: 3,
      selectOptions:
        'Electronics,Clothing,Books,Home & Garden,Health & Beauty,Sports & Outdoors,Toys & Games,Automotive,Food & Beverage,None',
      helpText:
        'Optional: Choose a parent category for hierarchical organization',
    },
    {
      id: 4,
      fieldKey: 'isActive',
      fieldLabel: 'Category is Active',
      fieldType: 'checkbox',
      isRequired: false,
      isDisabled: false,
      fieldOrder: 4,
      helpText: 'Check to make this category available for products',
    },
    {
      id: 5,
      fieldKey: 'sortOrder',
      fieldLabel: 'Sort Order',
      fieldType: 'number',
      placeholder: '0',
      isRequired: false,
      isDisabled: false,
      fieldOrder: 5,
      minValue: 0,
      maxValue: 999,
      helpText: 'Optional: Lower numbers appear first in category lists',
    },
  ],
  submitButtonText: mode === 'create' ? 'Create Category' : 'Update Category',
  resetButtonText: 'Clear Form',
  showResetButton: true,
  successMessage:
    mode === 'create'
      ? 'Category created successfully!'
      : 'Category updated successfully!',
  errorMessage:
    mode === 'create'
      ? 'Failed to create category. Please try again.'
      : 'Failed to update category. Please try again.',
  validationMode: 'onBlur',
});

export const getReportFormConfig = (
  mode: 'create' | 'edit' = 'create'
): FormComponent => ({
  id: 3,
  componentKey: 'report-management',
  componentTitle: mode === 'create' ? 'Generate New Report' : 'Edit Report',
  componentDescription:
    mode === 'create'
      ? 'Create a new report with custom parameters and filters.'
      : 'Update report settings and parameters.',
  formFields: [
    {
      id: 1,
      fieldKey: 'reportName',
      fieldLabel: 'Report Name',
      fieldType: 'text',
      placeholder: 'Enter report name',
      isRequired: true,
      isDisabled: false,
      fieldOrder: 1,
      minLength: 3,
      maxLength: 100,
      errorMessage: 'Report name must be between 3-100 characters',
    },
    {
      id: 2,
      fieldKey: 'reportType',
      fieldLabel: 'Report Type',
      fieldType: 'select',
      placeholder: 'Select report type',
      isRequired: true,
      isDisabled: false,
      fieldOrder: 2,
      selectOptions:
        'Sales Report,User Activity,Product Performance,Financial Summary,Order Analytics,Inventory Report',
      errorMessage: 'Please select a report type',
    },
    {
      id: 3,
      fieldKey: 'dateRange',
      fieldLabel: 'Date Range',
      fieldType: 'select',
      placeholder: 'Select date range',
      isRequired: true,
      isDisabled: false,
      fieldOrder: 3,
      selectOptions:
        'Last 7 days,Last 30 days,Last 3 months,Last 6 months,Last year,Custom range',
      helpText: 'Choose the time period for the report',
    },
    {
      id: 4,
      fieldKey: 'includeCharts',
      fieldLabel: 'Include Charts and Graphs',
      fieldType: 'checkbox',
      isRequired: false,
      isDisabled: false,
      fieldOrder: 4,
      helpText: 'Add visual charts to the report',
    },
    {
      id: 5,
      fieldKey: 'emailRecipients',
      fieldLabel: 'Email Recipients',
      fieldType: 'textarea',
      placeholder: 'Enter email addresses (one per line)',
      isRequired: false,
      isDisabled: false,
      fieldOrder: 5,
      maxLength: 1000,
      helpText: 'Optional: Email addresses to receive the report',
    },
    {
      id: 6,
      fieldKey: 'schedule',
      fieldLabel: 'Schedule',
      fieldType: 'select',
      placeholder: 'Select schedule',
      isRequired: false,
      isDisabled: false,
      fieldOrder: 6,
      selectOptions: 'One-time,Daily,Weekly,Monthly,Quarterly',
      helpText: 'Optional: Set up automatic report generation',
    },
  ],
  submitButtonText: mode === 'create' ? 'Generate Report' : 'Update Report',
  resetButtonText: 'Clear Form',
  showResetButton: true,
  successMessage:
    mode === 'create'
      ? 'Report generated successfully!'
      : 'Report updated successfully!',
  errorMessage:
    mode === 'create'
      ? 'Failed to generate report. Please try again.'
      : 'Failed to update report. Please try again.',
  validationMode: 'onSubmit',
});

/**
 * Generic form configuration builder
 * Allows creating custom form configs dynamically
 */
export const createFormConfig = (config: {
  key: string;
  title: string;
  description?: string;
  fields: Array<{
    key: string;
    label: string;
    type:
      | 'text'
      | 'email'
      | 'password'
      | 'number'
      | 'textarea'
      | 'select'
      | 'checkbox';
    required?: boolean;
    placeholder?: string;
    helpText?: string;
    options?: string; // For select fields
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
    errorMessage?: string;
  }>;
  submitText?: string;
  successMessage?: string;
  errorMessage?: string;
  mode?: 'create' | 'edit';
}): FormComponent => {
  const {
    key,
    title,
    description,
    fields,
    submitText,
    successMessage,
    errorMessage,
    mode = 'create',
  } = config;

  return {
    id: Date.now(), // Simple ID generation
    componentKey: key,
    componentTitle: title,
    componentDescription: description,
    formFields: fields.map((field, index) => ({
      id: index + 1,
      fieldKey: field.key,
      fieldLabel: field.label,
      fieldType: field.type,
      placeholder: field.placeholder,
      isRequired: field.required || false,
      isDisabled: false,
      fieldOrder: index + 1,
      minLength: field.minLength,
      maxLength: field.maxLength,
      minValue: field.minValue,
      maxValue: field.maxValue,
      selectOptions: field.options,
      helpText: field.helpText,
      errorMessage: field.errorMessage || `${field.label} is required`,
    })),
    submitButtonText: submitText || (mode === 'create' ? 'Create' : 'Update'),
    resetButtonText: 'Clear Form',
    showResetButton: true,
    successMessage:
      successMessage ||
      (mode === 'create' ? 'Created successfully!' : 'Updated successfully!'),
    errorMessage:
      errorMessage ||
      (mode === 'create'
        ? 'Failed to create. Please try again.'
        : 'Failed to update. Please try again.'),
    validationMode: 'onChange',
  };
};
