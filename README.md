# api-handler

A TypeScript-based Axios wrapper for API calls, with optional toast notifications via [react-toastify](https://github.com/fkhadra/react-toastify). Supports both React and non-React projects.

## Features

- Factory function `createAPI()` for easy API client creation
- Optional `Authorization: Bearer <token>` header injection
- Optional toast notifications on success/error (configurable)
- Exposes common HTTP methods: `get`, `post`, `put`, `delete` (returns `res.data` only)
- Exports types for configuration
- Exports `ToastContainer` for convenience (but does **not** render it automatically)
- Works in both React and non-React projects (toast is a peer dependency)

## Installation

```
npm install api-handler axios
npm install --save-peer react-toastify # Only if you want toast notifications
```

## Usage

### 1. Basic API Client

```ts
import { createAPI } from "api-handler";

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

```tsx
import { createAPI, ToastContainer } from "api-handler";

const api = createAPI({
  baseURL: "https://api.example.com",
  withToast: true,
});

// In your app root:
function App() {
  return (
    <>
      <ToastContainer /> {/* Place this ONCE in your app root */}
      {/* ... */}
    </>
  );
}
```

**Note:** The package does NOT automatically render `<ToastContainer />`. You must place it in your app root if you want to see toasts.

### 4. Non-React Projects

You can use the API client without enabling `withToast`, or safely ignore the toast features.

## API

### `createAPI(config: CreateAPIConfig): API`

#### `CreateAPIConfig`

- `baseURL: string` (required)
- `getToken?: () => Promise<string | undefined> | string | undefined` (optional)
- `withToast?: boolean` (optional, default: false)

#### `API` methods

- `get<T>(url, config?)`
- `post<T>(url, data?, config?)`
- `put<T>(url, data?, config?)`
- `delete<T>(url, config?)`
- `instance` (the underlying Axios instance)

All methods return `res.data` only.

## Responsibility

- **This package:** API logic, token injection, toast trigger, and type safety.
- **You:** Place `<ToastContainer />` in your React app root if you want to see toasts.

## License

MIT
