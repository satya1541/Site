# SitePulse - Website Availability Monitoring

## Overview

SitePulse is a real-time website availability monitoring application with a glassmorphic, cyberpunk-inspired user interface. The application allows users to check website uptime, monitor response times, validate SSL certificates, and track detailed performance metrics including DNS, TCP, and TLS timing breakdowns.

The platform supports both single URL checks and batch monitoring of multiple websites, with a dashboard for managing saved websites and their monitoring status.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React with TypeScript for type-safe component development
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)

**UI Component System**
- Shadcn/ui component library with Radix UI primitives
- Tailwind CSS for utility-first styling with custom design tokens
- Framer Motion for animations and transitions
- Dark mode by default with glassmorphic design aesthetic

**State Management**
- TanStack Query (React Query) for server state management and caching
- Local component state with React hooks for UI interactions
- Custom hooks for reusable logic (e.g., `use-mobile`, `use-toast`)

**Design Philosophy**
- Professional enterprise-grade glassmorphic design with neon accents
- Cyberpunk-inspired color palette with electric blue and vibrant purple
- Backdrop blur effects and semi-transparent overlays
- Custom shadow and elevation system for depth
- Responsive layout with mobile-first considerations

### Backend Architecture

**Server Framework**
- Express.js as the HTTP server framework
- TypeScript for type safety across the stack
- ES modules for modern JavaScript module system

**API Design**
- RESTful API endpoints for website CRUD operations
- POST endpoint for URL checking with configurable options
- JSON request/response format
- Structured error handling with appropriate HTTP status codes

**URL Checking Engine**
- Custom implementation using axios for HTTP requests
- DNS lookup with Node.js built-in `dns` module
- Performance timing breakdown: DNS, TCP, and TLS handshake
- SSL certificate validation
- Configurable timeout, redirect following, and custom headers
- Detailed error capture and reporting

**Storage Layer**
- In-memory storage implementation (`MemStorage` class) as the default
- Interface-based design (`IStorage`) for easy database integration
- Drizzle ORM configured for PostgreSQL (ready for database provisioning)
- Schema definitions with Zod validation in shared directory

### Data Models

**Website Schema**
- `id`: Unique identifier
- `name`: Display name for the website
- `url`: Target URL to monitor
- `createdAt`: Timestamp of creation

**Check Options**
- `timeout`: Request timeout (1-30 seconds, default 5s)
- `followRedirects`: Boolean flag for redirect handling
- `validateSSL`: Boolean flag for SSL validation
- `customHeaders`: JSON string for additional HTTP headers

**Check Result**
- `url`: Checked URL
- `isReachable`: Boolean availability status
- `responseTime`: Total response time in milliseconds
- `ipAddress`: Resolved IP address
- `statusCode`: HTTP status code
- `sslValid`: SSL certificate validity
- `dnsTime`, `tcpTime`, `tlsTime`: Performance breakdown
- `error`: Error message if check failed

### Code Organization

**Monorepo Structure**
- `/client`: Frontend React application
  - `/src/components`: Reusable UI components
  - `/src/pages`: Page-level components
  - `/src/hooks`: Custom React hooks
  - `/src/lib`: Utility functions and shared logic
- `/server`: Backend Express application
  - `routes.ts`: API endpoint definitions
  - `url-checker.ts`: Core URL checking logic
  - `storage.ts`: Data persistence abstractions
- `/shared`: Shared TypeScript definitions
  - `schema.ts`: Zod schemas and TypeScript types

**Path Aliases**
- `@/`: Maps to `client/src/`
- `@shared/`: Maps to `shared/`
- Configured in both TypeScript and Vite for consistent imports

## External Dependencies

### Third-Party UI Libraries
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives (dialogs, dropdowns, tooltips, etc.)
- **Shadcn/ui**: Pre-built component library built on Radix UI
- **Framer Motion**: Animation library for smooth transitions and interactive elements
- **Lucide React**: Icon library for consistent iconography

### Data Fetching & State
- **TanStack Query**: Server state management with automatic caching, refetching, and synchronization
- **Axios**: HTTP client for making requests with interceptors and request configuration

### Validation & Type Safety
- **Zod**: Runtime type validation and schema definition
- **Drizzle Zod**: Integration between Drizzle ORM and Zod schemas

### Database (Configured but Not Required)
- **Drizzle ORM**: Type-safe SQL query builder and ORM
- **@neondatabase/serverless**: PostgreSQL driver optimized for serverless environments
- Database URL configured via environment variable `DATABASE_URL`
- Migration support through `drizzle-kit`

### Styling & Design
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Utility for creating variant-based component APIs
- **clsx** & **tailwind-merge**: Class name merging utilities

### Development Tools
- **TypeScript**: Static type checking across the entire codebase
- **Vite**: Fast development server with hot module replacement
- **ESBuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-***: Replit-specific development enhancements (error overlay, cartographer, dev banner)

### Fonts
- **Inter**: Primary font family loaded via Google Fonts CDN
- **Poppins**: Alternative font family for specific use cases

### Session & Storage
- **connect-pg-simple**: PostgreSQL session store for Express (configured but not actively used with in-memory storage)