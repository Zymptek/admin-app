'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { getAdminLoginPageContent } from '@/requests/strapi';
import { FormField } from '@/requests/strapi';
import Image from 'next/image';

export default function LoginPage() {
  const {
    data: loginContent,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ['admin-login-page'],
    queryFn: getAdminLoginPageContent,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
  });

  console.log('Debug:', {
    isLoading,
    isFetching,
    hasData: !!loginContent,
    error,
    loginContent,
  });

  // Show loading only if we're actually loading and don't have data yet
  if ((isLoading || isFetching) && !loginContent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md">
          <Card className="shadow-sm border">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading login page...</p>
                <p className="text-xs text-muted-foreground mt-2">
                  Debug: isLoading={isLoading.toString()}, isFetching=
                  {isFetching.toString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-md">
          <Card className="shadow-sm border">
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-destructive mb-4">
                  Failed to load login page content
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Error: {error.message || 'Unknown error'}
                </p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // The data structure is different - it's directly in data, not data.attributes
  const { title, description, logo, form } = loginContent?.data || {};

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        {logo?.url && (
          <div className="mb-4">
            <Image
              src={`${process.env.NEXT_PUBLIC_STRAPI_URL}${logo.url}`}
              alt={logo?.alternativeText || 'Logo'}
              className="h-12 w-auto mx-auto"
              width={100}
              height={100}
            />
          </div>
        )}
        <Card className="shadow-sm border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-6">
              {form?.fields &&
                form.fields.length > 0 &&
                form.fields.map((field: FormField) => (
                  <div key={field.name} className="space-y-3">
                    <label
                      htmlFor={field.name}
                      className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      {field.label}
                    </label>
                    <div className="relative">
                      <Input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        placeholder={field.placeholder}
                        autoComplete={
                          field.type === 'email' ? 'email' : 'current-password'
                        }
                        required={field.required}
                        className="h-12 px-4 text-base border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm shadow-sm hover:shadow-md focus:shadow-lg"
                      />
                    </div>
                  </div>
                ))}
              {form?.buttonText && (
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold rounded-xl bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {form.buttonText}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
