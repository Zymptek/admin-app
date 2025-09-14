'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod'; // Not used directly
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { FormFieldRenderer } from './FormFieldRenderer';
import {
  FormComponent,
  FormData,
  FormSubmissionResult,
} from '@/requests/strapi/types';
import {
  generateFormSchema,
  generateDefaultValues,
  mergeFormDataWithDefaults,
  transformDataForForm,
} from '@/lib/formSchemaGenerator';

interface DynamicFormProps {
  formConfig: FormComponent;
  onSubmit: (
    data: FormData
  ) => Promise<FormSubmissionResult> | FormSubmissionResult;
  initialValues?: FormData;
  existingData?: FormData; // For edit scenarios - existing data from API
  className?: string;
  disabled?: boolean;
  mode?: 'create' | 'edit'; // Form mode to determine behavior
}

/**
 * Dynamic form component that renders forms based on Strapi configuration
 * Supports all field types defined in Strapi form components
 */
export function DynamicForm({
  formConfig,
  onSubmit,
  initialValues,
  existingData,
  className = '',
  disabled = false,
  mode = 'create',
}: DynamicFormProps) {
  // Generate Zod schema from Strapi config
  const formSchema = generateFormSchema(formConfig.formFields);

  // Determine form values based on mode and data
  const getFormValues = () => {
    if (mode === 'edit' && existingData) {
      // For edit mode, merge existing data with defaults
      const transformedData = transformDataForForm(
        formConfig.formFields,
        existingData
      );
      return mergeFormDataWithDefaults(formConfig.formFields, transformedData);
    } else if (initialValues) {
      // For create mode with initial values
      return {
        ...generateDefaultValues(formConfig.formFields),
        ...initialValues,
      };
    } else {
      // For create mode without initial values
      return generateDefaultValues(formConfig.formFields);
    }
  };

  const defaultValues = getFormValues();

  const form = useForm<Record<string, unknown>>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: formConfig.validationMode,
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: Record<string, unknown>) => {
    if (disabled || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await onSubmit(data);

      if (result.success) {
        toast.success(result.message || formConfig.successMessage);
        form.reset();
      } else {
        toast.error(result.message || formConfig.errorMessage);

        // Set field-specific errors if provided
        if (result.errors) {
          result.errors.forEach((error) => {
            form.setError(error.field as keyof Record<string, unknown>, {
              type: 'manual',
              message: error.message,
            });
          });
        }
      }
    } catch (error) {
      console.error('Form submission error:', error);
      toast.error(formConfig.errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    form.reset(defaultValues);
    toast.info('Form reset');
  };

  // Get appropriate title and button text based on mode
  const getFormTitle = () => {
    if (mode === 'edit') {
      return `Edit ${formConfig.componentTitle}`;
    }
    return formConfig.componentTitle;
  };

  const getSubmitButtonText = () => {
    if (mode === 'edit') {
      return isSubmitting ? 'Updating...' : 'Update';
    }
    return isSubmitting ? 'Submitting...' : formConfig.submitButtonText;
  };

  // Sort fields by fieldOrder
  const sortedFields = [...formConfig.formFields].sort(
    (a, b) => a.fieldOrder - b.fieldOrder
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          {getFormTitle()}
        </CardTitle>
        {formConfig.componentDescription && (
          <CardDescription className="text-center">
            {formConfig.componentDescription}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              {sortedFields.map((field) => (
                <FormFieldRenderer
                  key={field.id}
                  field={field}
                  control={form.control}
                  name={field.fieldKey as keyof Record<string, unknown>}
                  disabled={disabled}
                />
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                disabled={disabled || isSubmitting}
                className="flex-1 cursor-pointer"
                size="lg"
              >
                {getSubmitButtonText()}
              </Button>

              {formConfig.showResetButton && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={disabled || isSubmitting}
                  className="flex-1 sm:flex-none cursor-pointer"
                  size="lg"
                >
                  {formConfig.resetButtonText}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
