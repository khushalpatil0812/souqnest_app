# SouqNest - Unified Frontend

Single React + Vite application with role-based routing for both public and admin interfaces.

## 🏗️ Architecture

```
frontend-merged/
├── src/
│   ├── pages/
│   │   ├── public/        # Public-facing pages
│   │   │   ├── Home.jsx
│   │   │   ├── Shop.jsx
│   │   │   ├── Listings.jsx
│   │   │   ├── Blogs.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── RFQForm.jsx
│   │   │   └── BecomePartner.jsx
│   │   └── admin/         # Admin-only pages
│   │       ├── Login.jsx
│   │       ├── Dashboard.jsx
│   │       ├── Products.jsx
│   │       ├── Suppliers.jsx
│   │       ├── Categories.jsx
│   │       ├── Partners.jsx
│   │       ├── Listings.jsx
│   │       ├── RFQs.jsx
│   │       ├── ContactForms.jsx
│   │       ├── Blogs.jsx
│   │       └── Settings.jsx
│   ├── components/
│   │   ├── common/        # Shared UI components
│   │   └── layout/        # Layout components
│   ├── layouts/           # Page layouts
│   ├── routes/            # Routing configuration
│   │   ├── AppRoutes.jsx
│   │   └── ProtectedRoute.jsx
│   ├── services/          # API services
│   │   └── api.js         # Unified Axios instance
│   ├── context/           # React Context
│   │   └── AuthContext.jsx
│   ├── hooks/             # Custom hooks
│   └── utils/             # Utility functions
├── vite.config.js
└── package.json
```

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### 3. Run Development Server
```bash
npm run dev
```

Application runs on `http://localhost:5174` (or next available port)

### 4. Build for Production
```bash
npm run build
```

### 5. Preview Production Build
```bash
npm run preview
```

## 🌐 Routes

### Public Routes
- `/` - Home page
- `/shop` - Product shop
- `/listings` - Supplier listings
- `/blogs` - Blog posts
- `/contact` - Contact form
- `/rfq` - Request for Quotation
- `/become-partner` - Partner registration

### Admin Routes (Protected)
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard
- `/admin/products` - Manage products
- `/admin/suppliers` - Manage suppliers
- `/admin/categories` - Manage categories
- `/admin/partners` - Manage partners
- `/admin/listings` - Manage listings
- `/admin/rfqs` - Manage RFQs
- `/admin/contact-forms` - View contact submissions
- `/admin/blogs` - Manage blogs
- `/admin/settings` - System settings

## 🔐 Authentication

### Admin Access
- Only users with `SUPER_ADMIN` role can access admin routes
- Login at `/admin/login`
- Token stored in localStorage
- Automatic redirect to login if unauthorized

### Auth Context
```javascript
import { useAuth } from './context/AuthContext';

const { user, login, logout, isAdmin, loading } = useAuth();
```

## 📡 API Configuration

### Base URL
Configured via environment variable:
```env
VITE_API_URL=http://localhost:5000/api/v1
```

### Axios Instance
```javascript
import api from './services/api';

// Automatically includes Authorization header
const response = await api.get('/products');
```

### API Endpoints

#### Public APIs
- `GET /products` - List products
- `GET /products/:slug` - Product details
- `GET /suppliers` - List suppliers
- `GET /suppliers/:id` - Supplier details
- `GET /categories` - List categories
- `GET /categories/tree` - Category tree
- `GET /industries` - List industries
- `POST /rfq` - Submit RFQ

#### Admin APIs (Requires Authentication)
- `POST /auth/login` - Admin login
- `GET /admin/dashboard` - Dashboard stats
- All CRUD operations for products, suppliers, categories, industries

## 🛠️ Tech Stack

- **React 19.2** - UI library
- **Vite 7.3** - Build tool & dev server
- **React Router DOM 7.13** - Client-side routing
- **Axios 1.13.5** - HTTP client
- **Tailwind CSS 3.4** - Utility-first CSS
- **React Icons 5.5** - Icon library

## 📝 Key Features

✅ Single unified application
✅ Role-based route protection
✅ Automatic auth token management
✅ Centralized API configuration
✅ Fast HMR with Vite
✅ Clean folder structure
✅ Preserved all existing functionality
✅ No unnecessary rewrites

## 🎯 Migration Notes

This project was created by merging two separate React applications:
- `frontend/admin` (Vite + React)
- `frontend/user` (CRA + React)

All components and functionality have been preserved. Code was reorganized but not rewritten.

## 🔧 Development

### Run Linter
```bash
npm run lint
```

### File Naming Conventions
- **Components**: PascalCase (`UserProfile.jsx`)
- **Services**: camelCase (`apiClient.js`)
- **Folders**: lowercase

## 🚦 Testing the Application

1. **Public Routes**: Visit `http://localhost:5174/` and navigate through public pages
2. **Admin Routes**: 
   - Visit `http://localhost:5174/admin/login`
   - Login with admin credentials
   - Access should be granted only to users with `SUPER_ADMIN` role

## 📚 Next Steps

- [ ] Add unit tests (Vitest)
- [ ] Add E2E tests (Playwright)
- [ ] Implement forgot password
- [ ] Add user profile management
- [ ] Implement real-time notifications
- [ ] Add error boundaries
- [ ] Optimize bundle size

---

**Server Running**: http://localhost:5174  
**Build**: Production-ready
**Status**: ✅ Fully functional
