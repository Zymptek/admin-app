/**
 * TypeScript interfaces for Strapi API responses
 * Updated to match actual Strapi schema structure
 */

// Base Strapi response structure
export interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

// Single item response
export interface StrapiSingleResponse<T> {
  data: T;
}

// Form field structure (matches Strapi form-field component)
export interface FormField {
  id: number;
  fieldKey: string;
  fieldLabel: string;
  fieldType:
    | 'text'
    | 'email'
    | 'password'
    | 'number'
    | 'textarea'
    | 'select'
    | 'checkbox';
  placeholder?: string;
  helpText?: string;
  isRequired: boolean;
  isDisabled: boolean;
  fieldOrder: number;
  selectOptions?: string; // Comma-separated options for select fields
  minLength?: number;
  maxLength?: number;
  minValue?: number;
  maxValue?: number;
  errorMessage?: string;
}

// Form component structure (matches Strapi form-component)
export interface FormComponent {
  id: number;
  componentKey: string;
  componentTitle: string;
  componentDescription?: string;
  formFields: FormField[];
  submitButtonText: string;
  resetButtonText: string;
  showResetButton: boolean;
  successMessage: string;
  errorMessage: string;
  validationMode: 'onChange' | 'onBlur' | 'onSubmit';
}

// Logo structure
export interface Logo {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string;
  url: string;
  width: number;
  height: number;
  size: number;
  mime: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

// Login page content structure (matches actual API response)
export interface LoginPageContent {
  id: number;
  documentId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  title: string;
  description?: string;
  logo?: Logo;
  form: FormComponent;
}

// Login page API response
export type LoginPageResponse = StrapiSingleResponse<LoginPageContent>;

// Generic form data type for form submission
export type FormData = Record<string, unknown>;

// Form validation error type
export interface FormValidationError {
  field: string;
  message: string;
}

// Form submission result
export interface FormSubmissionResult {
  success: boolean;
  message: string;
  errors?: FormValidationError[];
}
