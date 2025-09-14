# Backend API

Simple, focused API files for backend communication.

## Structure

```
backend/
├── auth.ts           # Authentication functions
├── users.ts          # User/Admin functions
├── types.ts          # TypeScript types
├── index.ts          # Main exports
└── README.md         # This file
```

## Files

### Auth (`auth.ts`)

- `signIn(credentials)` - Admin sign in
- `signOut(accessToken)` - Admin sign out
- `refreshToken(refreshToken)` - Refresh access token

### Users (`users.ts`)

- `getProfile(accessToken)` - Get admin profile
- `getDashboard(accessToken)` - Get dashboard data

## Usage

```typescript
// Import functions
import { signIn, getDashboard } from '@/requests/backend';

// With React Query
import { useQuery, useMutation } from '@tanstack/react-query';

const { data } = useQuery({
  queryKey: ['dashboard'],
  queryFn: () => getDashboard(accessToken),
  enabled: !!accessToken,
});
```

## Configuration

Set `NEXT_PUBLIC_API_URL` environment variable:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```
