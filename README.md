# ValiNow

ValiNow is a high-end startup idea validation platform built with Next.js, Supabase, and modern web technologies. The platform provides comprehensive analysis of business ideas with a focus on user experience and security.

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS, Shadcn UI
- **Backend**: Next.js API Routes, Supabase
- **Authentication**: Supabase Auth with Google OAuth
- **Database**: Supabase PostgreSQL
- **Styling**: TailwindCSS with custom design system
- **Deployment**: Vercel

## Project Structure

```
src/
├── app/                    # Next.js 13+ app directory
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected dashboard routes
│   └── api/               # API routes
├── components/            # Reusable UI components
│   ├── ui/               # Shadcn UI components
│   └── features/         # Feature-specific components
├── lib/                   # Core functionality
│   ├── supabase/         # Supabase client and utilities
│   └── utils/            # Helper functions
├── types/                # TypeScript type definitions
├── schemas/              # Zod validation schemas
├── services/             # Business logic services
└── styles/               # Global styles and Tailwind config
```

## Features

- **Authentication**: Secure login with Google OAuth
- **User Management**: Profile management and session handling
- **Protected Routes**: Role-based access control
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: Built with Shadcn UI components

## Setup

1. Clone the repository:
   ```bash
   git clone [repository-url]
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Set up Supabase:
   - Create a new Supabase project
   - Enable Google OAuth in the Authentication settings
   - Configure the appropriate redirect URLs
   - Set up the database schema

5. Configure Google OAuth:
   - Create a project in Google Cloud Console
   - Set up OAuth 2.0 credentials
   - Add authorized redirect URIs
   - Add the client ID and secret to Supabase

## Development

1. Start the development server:
   ```bash
   npm run dev
   ```

2. The application will be available at `http://localhost:3000`

## Authentication Flow

1. Users can sign in with Google OAuth
2. Session is managed by Supabase Auth
3. Protected routes are handled by middleware
4. User state is available throughout the application

## API Routes

### Authentication
- `/api/auth/callback` - OAuth callback handler
- `/api/auth/session` - Session management

### Protected Routes
All dashboard routes are protected and require authentication:
- `/dashboard` - Main dashboard
- `/dashboard/profile` - User profile
- `/dashboard/settings` - User settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Deployment

The application is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Add the required environment variables
3. Deploy the application

## License

MIT 