# axios-helper-kit

A TypeScript-based Axios wrapper for API calls, with optional toast notifications via [react-toastify](https://github.com/fkhadra/react-toastify). Supports both React and non-React projects.

## Features

- Factory function `createAPI()` for easy API client creation
- Optional `Authorization: Bearer <token>` header injection
- Optional toast notifications on success/error (configurable with custom messages)
- Exposes common HTTP methods: `get`, `post`, `put`, `delete` (returns `res.data` only)
- Exports types for configuration
- Exports `APIToastContainer` component for React projects
- Works in both React and non-React projects (toast is a peer dependency)

## Installation

```bash
npm install axios-helper-kit axios react-toastify
```

## Usage

### 1. Basic API Client

```ts
import { createAPI } from "axios-helper-kit";

const api = createAPI({ baseURL: "https://api.example.com" });

// Usage
const data = await api.get("/users");
```

### 2. With Auth Token

```ts
const api = createAPI({
  baseURL: "https://api.example.com",
  getToken: () => localStorage.getItem("token"),
});
```

### 3. With Toast Notifications (React projects)

**⚠️ IMPORTANT: You MUST import the CSS and render the APIToastContainer component!**

```tsx
import { createAPI, APIToastContainer } from "axios-helper-kit";
import "react-toastify/dist/ReactToastify.css"; // 🚨 REQUIRED CSS IMPORT

const api = createAPI({
  baseURL: "https://api.example.com",
  withToast: true,
});

// In your app root:
function App() {
  return (
    <>
      {/* 🚨 REQUIRED: Place APIToastContainer ONCE in your app root */}
      <APIToastContainer />
      {/* Your app content */}
      <div>Your app content...</div>
    </>
  );
}
```

### 4. Custom Toast Messages

```tsx
const api = createAPI({
  baseURL: "https://api.example.com",
  withToast: true,
  successMessage: "Operation completed successfully! ✅",
  errorMessage: "Something went wrong! ❌",
  // Or use functions for dynamic messages
  successMessage: (response) => `Success: ${response.data.message}`,
  errorMessage: (error) =>
    `Error: ${error.response?.data?.message || error.message}`,
});
```

### 5. Toast Options

```tsx
const api = createAPI({
  baseURL: "https://api.example.com",
  withToast: true,
  toastOptions: {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    theme: "light",
  },
});
```

### 6. Non-React Projects

You can use the API client without enabling `withToast`:

```ts
const api = createAPI({
  baseURL: "https://api.example.com",
  withToast: false, // No toast notifications
});
```

## API

### `createAPI(config: CreateAPIConfig): API`

#### `CreateAPIConfig`

- `baseURL: string` (required)
- `getToken?: () => Promise<string | undefined> | string | undefined` (optional)
- `withToast?: boolean` (optional, default: true)
- `successMessage?: string | ((res: AxiosResponse) => string)` (optional)
- `errorMessage?: string | ((err: any) => string)` (optional)
- `toastOptions?: ToastOptions` (optional)
- `deduplicateToasts?: boolean` (optional, default: true)

#### `API` methods

- `get<T>(url, config?)` - GET request
- `post<T>(url, data?, config?)` - POST request
- `put<T>(url, data?, config?)` - PUT request
- `delete<T>(url, config?)` - DELETE request
- `instance` - Direct access to the underlying Axios instance

All methods return `res.data` only (not the full response object).

## Components

### `APIToastContainer`

React component that renders the toast container. Must be placed in your app root.

```tsx
import { APIToastContainer } from "axios-helper-kit";

// Basic usage
<APIToastContainer />

// With custom props
<APIToastContainer
  position="bottom-right"
  autoClose={3000}
  theme="dark"
/>
```

## Requirements for Toast Notifications

1. **Install react-toastify**: `npm install react-toastify`
2. **Import CSS**: `import 'react-toastify/dist/ReactToastify.css';`
3. **Render component**: `<APIToastContainer />` in your app root
4. **Enable toasts**: `withToast: true` in createAPI config

## Responsibility

- **This package:** API logic, token injection, toast triggering, and type safety
- **You:** Import the CSS and place `<APIToastContainer />` in your React app root

## License

MIT
