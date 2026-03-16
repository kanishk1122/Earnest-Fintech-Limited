# TaskFlow: Professional Task Management System

TaskFlow is a high-performance, full-stack task management application built with a modern technology stack. It provides users with a seamless experience for organizing their personal tasks with secure authentication and advanced management features.

## 🚀 Technical Stack

### Backend API
- **Runtime**: Node.js & TypeScript
- **Framework**: Express.js
- **ORM**: Prisma
- **Database**: SQLite (Development) / PostgreSQL (Production ready)
- **Security**: JWT (Access & Refresh Tokens), bcrypt password hashing
- **Validation**: Zod

### Frontend Web App
- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Vanilla CSS (Premium custom design system)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **API Client**: Axios with automatic interceptors for token refresh

## ✨ Key Features

- **Advanced Search & Filtering**: Real-time debounced search by title/description and status filtering.
- **Robust Authentication**: Secure registration, login, and silent token refresh logic.
- **Dynamic Dashboard**: Responsive task list with elegant card designs and status toggling.
- **Pagination System**: Efficient server-side pagination with batch loading.
- **Premium UI/UX**: Custom-crafted aesthetics including glassmorphism, smooth transitions, and dark/light mode foundations.

## 🛠️ Project Structure

```text
/
├── backend/            # Express.js Server
│   ├── prisma/         # Schema and Migrations
│   ├── src/
│   │   ├── controllers/# Business Logic
│   │   ├── middleware/ # Auth & Validation
│   │   ├── routes/     # API Endpoints
│   │   └── utils/      # Shared Utilities
├── frontend/           # Next.js Application
│   ├── src/
│   │   ├── app/        # Pages & Layouts
│   │   ├── components/ # Reusable UI Components
│   │   ├── context/    # Global State (Auth)
│   │   ├── hooks/      # Custom Hooks (Debounce)
│   │   └── lib/        # API Client Config
```

## 🚥 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository** (or navigate to the project folder).
2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   # Create a .env file with DATABASE_URL, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET
   npx prisma db push
   npm run dev
   ```
3. **Setup Frontend**:
   ```bash
   cd frontend
   npm install
   # Create a .env.local with NEXT_PUBLIC_API_URL=http://localhost:5000
   npm run dev
   ```

## 📂 Documentation

- **Full Walkthrough**: [project_walkthrough.md](file:///C:/Users/kansihk%20soni/.gemini/antigravity/brain/008bcd14-feec-4188-abe2-b600f2e6cf42/project_walkthrough.md)
- **Backend API Endpoints**:
  - `POST /auth/register` - User Registration
  - `POST /auth/login` - User Login (returns tokens)
  - `POST /auth/refresh` - Refresh Access Token
  - `GET /tasks` - Fetch Paginated/Filtered Tasks
  - `POST /tasks` - Create Task
  - `PATCH /tasks/:id` - Update Task
  - `DELETE /tasks/:id` - Delete Task
  - `PATCH /tasks/:id/toggle` - Toggle Completion Status
