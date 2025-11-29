# React Login Template

A simple React template with login functionality and password encryption.

## Features

- React 18 with TypeScript
- TailwindCSS for styling
- Login page with email and password
- Password encryption using bcryptjs
- Dashboard with user information
- Responsive design
- API service setup ready

## Prerequisites

- Node.js 16+ and npm/yarn

## Getting Started

1. **Clone or download this template**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

4. **Access the application:**
   - Open http://localhost:3000 in your browser

## Environment Variables

Create a `.env` file in the root directory:

```
REACT_APP_API_URL=http://localhost:3000/api
```

## Features Overview

### Login Component
- Email and password input fields
- Client-side validation
- Password hashing with bcryptjs
- Error handling

### Dashboard Component
- Displays user information
- Logout functionality

### API Service
- Axios-based HTTP client
- Configured for backend integration
- Ready for authentication endpoints

## Customization

1. Update API endpoints in `src/services/api.ts`
2. Modify styling in component CSS files
3. Add authentication token management
4. Implement proper backend integration
5. Add registration/signup functionality

## Production Build

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Project Structure

```
src/
├── components/
│   ├── Login.tsx            # Login component
│   ├── Login.css
│   ├── Dashboard.tsx        # Dashboard component
│   └── Dashboard.css
├── services/
│   └── api.ts               # API service
├── App.tsx                  # Main app component
├── App.css
├── index.tsx                # Entry point
└── index.css
```

## Notes

- Password hashing is demonstrated client-side for the template
- In production, always hash passwords on the backend
- Implement proper JWT or session-based authentication
- Add secure token storage (httpOnly cookies recommended)
