# Proact Infotech Jobs

A modern, interactive job board application built with React, Vite, Tailwind CSS, and Supabase. Features a dynamic 3D hero section, interactive particle backgrounds, and a seamless application process.

## Features

- **Interactive UI**: 3D hero sphere using Three.js and custom shaders, interactive particle backgrounds, and smooth scroll animations.
- **Job Listings**: Browse and filter available job opportunities.
- **Application System**: Apply for jobs and track your applications.
- **Authentication**: Secure user authentication powered by Supabase.
- **Responsive Design**: Fully responsive layout optimized for all devices.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **3D & Animations**: Three.js (react-three-fiber), Framer Motion
- **Backend & Database**: Supabase

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or bun

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_PROJECT_ID=""
   VITE_SUPABASE_PUBLISHABLE_KEY=""
   VITE_SUPABASE_URL=""
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

## Project Structure

- `src/components/`: Reusable UI components (including 3D elements and backgrounds).
- `src/features/`: Domain-specific modules (jobs, auth, apply, contact).
- `src/pages/`: Main application routes.
- `src/integrations/`: Third-party service integrations (Supabase).
- `supabase/`: Database configuration and setup scripts.
