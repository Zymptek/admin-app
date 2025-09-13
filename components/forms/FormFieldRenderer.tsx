'use client';

import React from 'react';
import { Control, FieldPath, FieldValues } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormField as StrapiFormField } from '@/requests/strapi/types';

interface FormFieldRendererProps<T extends FieldValues> {
  field: StrapiFormField;
  control: Control<T>;
  name: FieldPath<T>;
  disabled?: boolean;
}

/**
 * Dynamic form field renderer that renders different field types based on Strapi configuration
 */
export function FormFieldRenderer<T extends FieldValues>({
  field,
  control,
  name,
  disabled = false,
}: FormFieldRendererProps<T>) {
  const isFieldDisabled = disabled || field.isDisabled;

  const renderField = () => {
    switch (field.fieldType) {
      case 'text':
      case 'email':
      case 'password':
        return (
          <Input
            type={field.fieldType}
            placeholder={field.placeholder}
            disabled={isFieldDisabled}
            autoComplete={
              field.fieldType === 'email'
                ? 'email'
                : field.fieldType === 'password'
                  ? 'current-password'
                  : 'off'
            }
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            placeholder={field.placeholder}
            disabled={isFieldDisabled}
            min={field.minValue}
            max={field.maxValue}
          />
        );

      case 'textarea':
        return (
          <Textarea
            placeholder={field.placeholder}
            disabled={isFieldDisabled}
            rows={4}
          />
        );

      case 'select':
        const options =
          field.selectOptions
            ?.split(',')
            .map((option) => option.trim())
            .filter(Boolean) || [];
        return (
          <Select disabled={isFieldDisabled}>
            <SelectTrigger>
              <SelectValue
                placeholder={field.placeholder || 'Select an option'}
              />
            </SelectTrigger>
            <SelectContent>
              {options.map((option, index) => (
                <SelectItem key={index} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <Checkbox
            disabled={isFieldDisabled}
            className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
        );

      default:
        return (
          <Input
            type="text"
            placeholder={field.placeholder}
            disabled={isFieldDisabled}
          />
        );
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      rules={{
        required: field.isRequired ? `${field.fieldLabel} is required` : false,
        minLength: field.minLength
          ? {
              value: field.minLength,
              message:
                field.errorMessage ||
                `Minimum ${field.minLength} characters required`,
            }
          : undefined,
        maxLength: field.maxLength
          ? {
              value: field.maxLength,
              message:
                field.errorMessage ||
                `Maximum ${field.maxLength} characters allowed`,
            }
          : undefined,
        min: field.minValue
          ? {
              value: field.minValue,
              message:
                field.errorMessage || `Minimum value is ${field.minValue}`,
            }
          : undefined,
        max: field.maxValue
          ? {
              value: field.maxValue,
              message:
                field.errorMessage || `Maximum value is ${field.maxValue}`,
            }
          : undefined,
        pattern:
          field.fieldType === 'email'
            ? {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message:
                  field.errorMessage || 'Please enter a valid email address',
              }
            : undefined,
      }}
      render={({ field: formField }) => (
        <FormItem>
          <FormLabel className="text-sm font-medium">
            {field.fieldLabel}
            {field.isRequired && (
              <span className="text-destructive ml-1">*</span>
            )}
          </FormLabel>
          <FormControl>
            {field.fieldType === 'checkbox' ? (
              <div className="flex items-center space-x-2">
                <Checkbox
                  {...formField}
                  checked={formField.value || false}
                  disabled={isFieldDisabled}
                  className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {field.fieldLabel}
                </label>
              </div>
            ) : (
              React.cloneElement(renderField() as React.ReactElement, {
                ...formField,
              })
            )}
          </FormControl>
          {field.helpText && (
            <FormDescription className="text-xs text-muted-foreground">
              {field.helpText}
            </FormDescription>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
