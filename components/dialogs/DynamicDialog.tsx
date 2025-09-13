'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DynamicForm } from '@/components/forms';
import {
  FormComponent,
  FormData,
  FormSubmissionResult,
} from '@/requests/strapi/types';

interface DynamicDialogProps {
  // Dialog configuration
  trigger?: React.ReactNode;
  title: string;
  description?: string;

  // Form configuration
  formConfig: FormComponent;

  // Data handling
  existingData?: FormData;
  mode?: 'create' | 'edit';

  // Callbacks
  onSubmit: (
    data: FormData
  ) => Promise<FormSubmissionResult> | FormSubmissionResult;
  onSuccess?: (data: FormData) => void;

  // UI customization
  className?: string;
  disabled?: boolean;
  maxWidth?:
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl';

  // Programmatic control
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * Generic Dynamic Dialog Component
 * Can be used for any create/edit form scenario
 */
export function DynamicDialog({
  trigger,
  title,
  description,
  formConfig,
  existingData,
  mode = 'create',
  onSubmit,
  onSuccess,
  className = '',
  disabled = false,
  maxWidth = '2xl',
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: DynamicDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use controlled or internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  const handleSubmit = async (
    data: FormData
  ): Promise<FormSubmissionResult> => {
    setIsSubmitting(true);

    try {
      const result = await onSubmit(data);

      if (result.success) {
        // Call success callback if provided
        if (onSuccess) {
          onSuccess(data);
        }

        // Close dialog on success
        setOpen(false);
      }

      return result;
    } catch (error) {
      console.error('Form submission error:', error);
      return {
        success: false,
        message: 'An error occurred. Please try again.',
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMaxWidthClass = () => {
    const maxWidthMap = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
      '2xl': 'max-w-2xl',
      '3xl': 'max-w-3xl',
      '4xl': 'max-w-4xl',
      '5xl': 'max-w-5xl',
      '6xl': 'max-w-6xl',
      '7xl': 'max-w-7xl',
    };
    return maxWidthMap[maxWidth];
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={`${getMaxWidthClass()} max-h-[90vh] overflow-y-auto ${className}`}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <div className="mt-4">
          <DynamicForm
            formConfig={formConfig}
            onSubmit={handleSubmit}
            existingData={existingData}
            mode={mode}
            disabled={disabled || isSubmitting}
            className="border-0 shadow-none"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
