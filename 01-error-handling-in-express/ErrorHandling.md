# 🛑 Error Handling in Express

## 📘 Overview

Error handling in Express ensures that your application can gracefully manage failures—such as invalid requests, database errors, or server bugs—without crashing.
A well-structured error-handling system helps you:

- Maintain app stability

- Provide meaningful feedback to clients

- Simplify debugging

- Protect sensitive information

---

### 🧩 Types of Errors

1. Operational Errors:

- Expected and manageable.

- Examples: invalid input, failed network requests, missing routes, or authentication errors.

2. Programming Errors:

- Caused by bugs in the code (undefined variables, syntax issues, etc.).

- Should be detected and fixed, not handled at runtime.

---

## ⚙️ The Express Error-Handling Flow

1. Synchronous Errors

```js
app.get('/user', (req, res) => {
  throw new Error('Something went wrong!');
});
```

Express automatically catches thrown errors from synchronous routes and passes them to the error-handling middleware.

2. Asynchronous Errors

```js
app.get('/data', async (req, res, next) => {
  try {
    const data = await getData();
    res.json(data);
  } catch (err) {
    next(err); // pass to error middleware
  }
});
```

For async routes, we must manually call next(err) or use an async wrapper utility.

---

🪄 Creating a Global Error Handler

A global error handler catches all errors in one place.

```js
// errorHandler.js
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
  });
};
```

Register it at the bottom of your middleware stack:

```js
import express from 'express';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// ... routes here

app.use(errorHandler);
```

---

## 💡 Creating Custom Error Classes

Custom errors provide more control and cleaner code.

```js
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}
```

Usage:

```js
import { AppError } from './utils/AppError.js';

app.get('/profile', (req, res, next) => {
  const user = null;
  if (!user) return next(new AppError('User not found', 404));
});
```

---

## 🧰 Utility Function — Async Wrapper

Eliminates repetitive try-catch blocks for async routes.

```js
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

Example:

```js
app.get('/posts', asyncHandler(async (req, res) => {
  const posts = await getPosts();
  res.json(posts);
}));
```

---

## 🧠 Best Practices

|  #  | Practice                                                  | Why                                 |
| :-: | --------------------------------------------------------- | ----------------------------------- |
|  1  | Always send consistent error responses (JSON format)      | Easier for frontend/API consumers   |
|  2  | Don’t leak internal details or stack traces in production | Security concern                    |
|  3  | Use a centralized error-handling middleware               | Avoids duplicated logic             |
|  4  | Separate operational vs programming errors                | Different recovery strategies       |
|  5  | Create reusable custom error classes                      | Cleaner, readable code              |
|  6  | Log errors with a logger (e.g., `winston`, `pino`)        | Better monitoring                   |
|  7  | Handle unhandled rejections & exceptions globally         | Prevent app crashes                 |
|  8  | Wrap async routes with a helper                           | Avoid repetitive `try/catch` blocks |
|  9  | Send proper HTTP status codes                             | Communicates error type accurately  |
|  10 | Test your error responses                                 | Ensures predictable client behavior |

---

## 🪶 Handling Uncaught Errors in Node.js

```js
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});
```

These global listeners protect against runtime crashes caused by unexpected issues.

---

## 🧱 Example Project Folder (for Reference)

```js
01_Error_Handling/
├── src/
│   ├── controllers/
│   │   └── userController.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── utils/
│   │   └── AppError.js
│   │   └── asyncHandler.js
│   ├── app.js
│   └── server.js
└── package.json
```

---

## 🔍 Quick Recap

- Error Handling Middleware: app.use((err, req, res, next) => {...})

- Custom Error Class: Extend Error with statusCode

- Async Wrapper: Simplifies async error catching

- Global Handlers: Catch unhandledRejection & uncaughtException

- Goal: Stability, security, and cleaner debugging.
