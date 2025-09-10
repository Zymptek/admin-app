# Basic Strapi Integration Setup

This is a **minimal and dynamic** Strapi integration that allows you to create forms and content that automatically adapts based on your Strapi configuration.

## 🎯 **What This Setup Provides:**

### **1. Dynamic Forms**

- Forms are completely configured in Strapi
- Add/remove fields, validation, and styling without touching code
- Supports: text, email, password, number, textarea, select, checkbox, radio, date
- Automatic validation based on Strapi configuration

### **2. Dynamic Content**

- Fetch any content from Strapi with simple hooks
- No need to define types for every content type
- Automatic caching with React Query

## 🚀 **Quick Start:**

### **1. Environment Setup**

Your `.env.local` is already configured:

```env
NEXT_PUBLIC_STRAPI_URL=https://dev.strapi.zymptek.com
STRAPI_API_TOKEN=your-api-token-here
```

### **2. Using Dynamic Forms**

```tsx
import { DynamicForm } from '@/components/DynamicForm';

// This form is completely configured in Strapi
<DynamicForm
  formName="contact-form"
  onSubmit={(data) => {
    console.log('Form data:', data);
    // Handle form submission
  }}
/>;
```

### **3. Using Dynamic Content**

```tsx
import { useStrapiContent } from '@/hooks/useStrapi';

function MyComponent() {
  const { data, isLoading } = useStrapiContent('navigation-items');

  if (isLoading) return <div>Loading...</div>;

  return (
    <nav>
      {data?.data?.map((item) => (
        <a key={item.id} href={item.attributes.url}>
          {item.attributes.name}
        </a>
      ))}
    </nav>
  );
}
```

## 📋 **Setting Up Content Types in Strapi:**

### **1. Form Configuration Content Type**

Create a content type called `form-configs` with these fields:

```json
{
  "name": "Text",
  "fields": "JSON" // Array of form field configurations
}
```

**Example field configuration:**

```json
[
  {
    "id": "email",
    "name": "email",
    "type": "email",
    "label": "Email Address",
    "placeholder": "Enter your email",
    "required": true,
    "validation": {
      "pattern": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
    },
    "order": 1
  },
  {
    "id": "message",
    "name": "message",
    "type": "textarea",
    "label": "Message",
    "placeholder": "Enter your message",
    "required": true,
    "validation": {
      "minLength": 10,
      "maxLength": 500
    },
    "order": 2
  }
]
```

### **2. Any Other Content Type**

You can create any content type in Strapi and fetch it with:

```tsx
const { data } = useStrapiContent('your-content-type');
```

## 🔧 **Available Components:**

### **DynamicForm**

- Renders forms based on Strapi configuration
- Automatic validation
- Loading states
- Error handling

### **useStrapiContent Hook**

- Fetches any content from Strapi
- Automatic caching
- Loading and error states

### **useStrapiContentById Hook**

- Fetches single content item by ID

## 📝 **Example Usage:**

### **Contact Page with Dynamic Form:**

```tsx
export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1>Contact Us</h1>
      <DynamicForm
        formName="contact-form"
        onSubmit={async (data) => {
          await fetch('/api/contact', {
            method: 'POST',
            body: JSON.stringify(data),
          });
        }}
      />
    </div>
  );
}
```

### **Dynamic Navigation:**

```tsx
export function Navigation() {
  const { data: navItems } = useStrapiContent('navigation-items');

  return (
    <nav>
      {navItems?.data?.map((item) => (
        <a key={item.id} href={item.attributes.url}>
          {item.attributes.name}
        </a>
      ))}
    </nav>
  );
}
```

## 🎨 **Form Field Types Supported:**

- `text` - Text input
- `email` - Email input with validation
- `password` - Password input
- `number` - Number input
- `textarea` - Multi-line text
- `select` - Dropdown selection
- `checkbox` - Single checkbox
- `radio` - Radio button group
- `date` - Date picker

## ✅ **Benefits:**

1. **No Code Changes** - Add new forms/fields in Strapi only
2. **Automatic Validation** - Configure validation rules in Strapi
3. **Type Safe** - Full TypeScript support
4. **Cached** - React Query handles caching automatically
5. **Responsive** - Forms adapt to different screen sizes
6. **Accessible** - Built with accessibility in mind

## 🚀 **Next Steps:**

1. Set up your content types in Strapi
2. Add your API token to `.env.local`
3. Start using `DynamicForm` and `useStrapiContent` in your components
4. Configure forms and content in Strapi admin panel

This setup gives you the flexibility to manage all your forms and content through Strapi without touching any code!
