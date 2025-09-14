import { z } from 'zod';
import { FormField } from '@/requests/strapi/types';

/**
 * Generates Zod validation schema from Strapi form field definitions
 */
export function generateFormSchema(
  fields: FormField[]
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const schemaObject: Record<string, z.ZodTypeAny> = {};

  fields
    .sort((a, b) => a.fieldOrder - b.fieldOrder)
    .forEach((field) => {
      let fieldSchema: z.ZodTypeAny;

      switch (field.fieldType) {
        case 'text':
          fieldSchema = z
            .string()
            .min(1, field.errorMessage || `${field.fieldLabel} is required`);
          break;

        case 'email':
          fieldSchema = z
            .string()
            .min(1, field.errorMessage || `${field.fieldLabel} is required`)
            .email(field.errorMessage || 'Please enter a valid email address');
          break;

        case 'password':
          fieldSchema = z
            .string()
            .min(1, field.errorMessage || `${field.fieldLabel} is required`)
            .min(
              field.minLength || 6,
              field.errorMessage ||
                `Password must be at least ${field.minLength || 6} characters`
            );
          break;

        case 'number':
          let num = z.coerce.number({
            error: field.errorMessage || `${field.fieldLabel} must be a number`,
          });
          if (typeof field.minValue === 'number') {
            num = num.min(
              field.minValue,
              field.errorMessage || `Minimum value is ${field.minValue}`
            );
          }
          if (typeof field.maxValue === 'number') {
            num = num.max(
              field.maxValue,
              field.errorMessage || `Maximum value is ${field.maxValue}`
            );
          }
          fieldSchema = num;
          break;

        case 'textarea':
          fieldSchema = z
            .string()
            .min(1, field.errorMessage || `${field.fieldLabel} is required`)
            .min(
              field.minLength || 0,
              field.errorMessage ||
                `Minimum ${field.minLength || 0} characters required`
            )
            .max(
              field.maxLength || 1000,
              field.errorMessage ||
                `Maximum ${field.maxLength || 1000} characters allowed`
            );
          break;

        case 'select': {
          //TODO: Later on add multiple select
          const options =
            field.selectOptions
              ?.split(',')
              .map((option) => option.trim())
              .filter(Boolean) || [];
          fieldSchema = z
            .string()
            .min(1, field.errorMessage || `${field.fieldLabel} is required`)
            .refine(
              (value) => options.includes(value),
              field.errorMessage || `Please select a valid option`
            );
          break;
        }

        case 'checkbox':
          fieldSchema = z.boolean();
          break;

        default:
          fieldSchema = z
            .string()
            .min(1, field.errorMessage || `${field.fieldLabel} is required`);
      }

      // Apply length constraints for string fields
      if (
        !['number', 'checkbox', 'password', 'textarea'].includes(
          field.fieldType
        )
      ) {
        if (field.minLength) {
          fieldSchema = (fieldSchema as z.ZodString).min(
            field.minLength,
            field.errorMessage ||
              `Minimum ${field.minLength} characters required`
          );
        }
        if (field.maxLength) {
          fieldSchema = (fieldSchema as z.ZodString).max(
            field.maxLength,
            field.errorMessage ||
              `Maximum ${field.maxLength} characters allowed`
          );
        }
      }

      // Make field optional; allow '' for string-like fields
      if (!field.isRequired) {
        if (
          ['text', 'email', 'password', 'textarea', 'select'].includes(
            field.fieldType
          )
        ) {
          fieldSchema = (fieldSchema as z.ZodString)
            .optional()
            .or(z.literal(''));
        } else {
          fieldSchema = fieldSchema.optional();
        }
      }

      schemaObject[field.fieldKey] = fieldSchema;
    });

  return z.object(schemaObject);
}

/**
 * Generates default form values from Strapi form field definitions
 * This creates empty/default values for new forms
 */
export function generateDefaultValues(
  fields: FormField[]
): Record<string, unknown> {
  const defaultValues: Record<string, unknown> = {};

  fields
    .sort((a, b) => a.fieldOrder - b.fieldOrder)
    .forEach((field) => {
      switch (field.fieldType) {
        case 'checkbox':
          defaultValues[field.fieldKey] = false;
          break;
        case 'number':
          defaultValues[field.fieldKey] = field.minValue || 0;
          break;
        case 'select':
          const options =
            field.selectOptions
              ?.split(',')
              .map((option) => option.trim())
              .filter(Boolean) || [];
          defaultValues[field.fieldKey] = options[0] || '';
          break;
        default:
          defaultValues[field.fieldKey] = '';
      }
    });

  return defaultValues;
}

/**
 * Merges existing data with form field defaults for edit scenarios
 * This properly handles edit forms where you have existing data
 */
export function mergeFormDataWithDefaults(
  fields: FormField[],
  existingData: Record<string, unknown> = {}
): Record<string, unknown> {
  const defaultValues = generateDefaultValues(fields);

  // Merge existing data with defaults, prioritizing existing data
  const mergedData: Record<string, unknown> = {};

  fields
    .sort((a, b) => a.fieldOrder - b.fieldOrder)
    .forEach((field) => {
      const fieldKey = field.fieldKey;

      // If existing data has this field, use it
      if (Object.prototype.hasOwnProperty.call(existingData, fieldKey)) {
        mergedData[fieldKey] = existingData[fieldKey];
      } else {
        // Otherwise use the default value
        mergedData[fieldKey] = defaultValues[fieldKey];
      }
    });

  return mergedData;
}

/**
 * Validates and transforms data for form fields
 * Ensures data types match field requirements
 */
export function transformDataForForm(
  fields: FormField[],
  data: Record<string, unknown>
): Record<string, unknown> {
  const transformedData: Record<string, unknown> = {};

  fields.forEach((field) => {
    const fieldKey = field.fieldKey;
    const value = data[fieldKey];

    if (value === null || value === undefined) {
      // Use default value if data is null/undefined
      const defaults = generateDefaultValues([field]);
      transformedData[fieldKey] = defaults[fieldKey];
      return;
    }

    switch (field.fieldType) {
      case 'number': {
        // Ensure number fields are actually numbers
        const numValue =
          typeof value === 'string' ? parseFloat(value) : (value as number);
        transformedData[fieldKey] = Number.isNaN(numValue as number)
          ? field.minValue || 0
          : numValue;
        break;
      }
      case 'checkbox':
        // Ensure checkbox fields are booleans
        transformedData[fieldKey] = Boolean(value);
        break;
      case 'select': {
        // Validate select values against available options
        const options =
          field.selectOptions
            ?.split(',')
            .map((option) => option.trim())
            .filter(Boolean) || [];
        transformedData[fieldKey] = options.includes(value as string)
          ? value
          : options[0] || '';
        break;
      }
      default:
        // For text fields, ensure they're strings
        transformedData[fieldKey] = String(value);
    }
  });

  return transformedData;
}

/**
 * Type-safe form data type generator
 */
export type FormDataFromSchema<T extends z.ZodSchema> = z.infer<T>;
