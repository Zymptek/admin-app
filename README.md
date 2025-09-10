# Zymptek Admin App

A modern admin dashboard built with Next.js 15, React 19, and TypeScript for managing the Zymptek platform. This application provides comprehensive administrative tools for user management, product approvals, order analytics, and dispute resolution.

## 🚀 Local Installation

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun package manager

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd admin-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 📁 Project Structure

```
admin-app/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   └── login/               # Login page
│   ├── dashboard/               # Main dashboard
│   │   ├── components/          # Dashboard-specific components
│   │   │   ├── category-management.tsx
│   │   │   ├── dashboard-overview.tsx
│   │   │   ├── dispute-resolution.tsx
│   │   │   ├── order-analytics.tsx
│   │   │   ├── pending-verifications.tsx
│   │   │   ├── product-approvals.tsx
│   │   │   ├── reports.tsx
│   │   │   └── user-profiles.tsx
│   │   └── page.tsx             # Dashboard main page
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Home page
├── components/                   # Reusable components
│   ├── figma/                   # Figma-generated components
│   ├── layout/                  # Layout components
│   │   └── Navbar.tsx
│   ├── providers/               # Context providers
│   │   └── QueryProvider.tsx
│   └── ui/                      # shadcn/ui components (49 components)
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── aspect-ratio.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       ├── chart.tsx
│       ├── checkbox.tsx
│       ├── collapsible.tsx
│       ├── command.tsx
│       ├── context-menu.tsx
│       ├── dialog.tsx
│       ├── drawer.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── hover-card.tsx
│       ├── input-otp.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── menubar.tsx
│       ├── navigation-menu.tsx
│       ├── pagination.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       ├── resizable.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── sidebar.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── sonner.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── toggle-group.tsx
│       ├── toggle.tsx
│       ├── tooltip.tsx
│       ├── use-mobile.ts
│       └── utils.ts
├── lib/                         # Utility libraries
│   ├── queryClient.ts           # TanStack Query configuration
│   └── utils.ts                 # Utility functions
├── public/                      # Static assets
├── requests/                    # API request functions
├── components.json              # shadcn/ui configuration
├── next.config.ts               # Next.js configuration
├── package.json                 # Dependencies and scripts
├── tailwind.config.js           # Tailwind CSS configuration
└── tsconfig.json                # TypeScript configuration
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript 5
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI + shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Charts**: Recharts
- **Code Quality**: ESLint + Prettier + Husky

## 🎯 Key Features

- **Dashboard Overview**: Real-time analytics and metrics
- **User Management**: Comprehensive user profile management
- **Product Approvals**: Review and approve product listings
- **Order Analytics**: Track and analyze order data
- **Dispute Resolution**: Handle customer disputes and issues
- **Category Management**: Organize product categories
- **Reports**: Generate detailed reports and insights
- **Pending Verifications**: Manage verification workflows

## 🔧 Development

The project uses modern development practices:

- **Turbopack**: Fast bundling for development
- **TypeScript**: Full type safety
- **ESLint + Prettier**: Code quality and formatting
- **Husky**: Git hooks for quality checks
- **Component-based architecture**: Reusable UI components

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is private and proprietary to Zymptek.
