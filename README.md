# Discord Student Invitation Generator

This project is a web application designed to handle student email verification and related processes. It is built using modern web technologies and frameworks.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Scripts](#scripts)
- [Technologies Used](#technologies-used)
- [License](#license)

## Overview
The application provides functionality for verifying student emails, submitting GitHub and Discord usernames, and generating invites. It also includes a user-friendly interface with reusable components.

## Features
- Email verification system
- GitHub and Discord username submission
- Invite generation
- Modern UI components built with Tailwind CSS
- API routes for backend functionality

## Folder Structure
```
app/
  globals.css
  layout.tsx
  page.tsx
  providers.tsx
  api/
    generate-invite/
      route.ts
    submit-discord-username/
      route.ts
    submit-github-username/
      route.ts
    verify-email/
      route.ts
  github-success/
    page.tsx
  success/
    page.tsx
components/
  email-form.tsx
  github-username-form.tsx
  regenerate-invite.tsx
  theme-provider.tsx
  ui/
    accordion.tsx
    alert-dialog.tsx
    alert.tsx
    ...
hooks/
  use-mobile.tsx
  use-toast.tsx
lib/
  utils.ts
public/
styles/
  globals.css
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd student-email-verification
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the Development Server
Start the development server:
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

## Scripts
- `dev`: Starts the development server
- `build`: Builds the application for production
- `start`: Starts the production server

## Technologies Used
- **Next.js**: React framework for building server-side rendered and static web applications
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Supabase**: Backend-as-a-service for authentication and database
- **TypeScript**: Typed JavaScript for better developer experience

## License
This project is licensed under the MIT License. See the LICENSE file for details.
