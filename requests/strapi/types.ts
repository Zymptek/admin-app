/**
 * TypeScript interfaces for Strapi API responses
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

// Form field structure
export interface FormField {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  required: boolean;
}

// Form structure
export interface Form {
  id: number;
  buttonText: string;
  fields?: FormField[];
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
  description: string;
  logo: Logo;
  form: Form;
}

// Login page API response
export type LoginPageResponse = StrapiSingleResponse<LoginPageContent>;
