# 🛑 Error Handling in Express

## 📖 Overview

This section covers how to handle errors gracefully in an Express.js application.
It focuses on writing production-level error-handling code that improves app stability, user experience, and maintainability.

---

## 🎯 Learning Outcomes

By the end of this topic, you will be able to:

- Understand the difference between operational and programming errors.

- Implement a global error-handling middleware in Express.

- Create custom error classes for flexible error management.

- Build and use an async handler utility to avoid repetitive try/catch blocks.

- Handle unhandled exceptions and promise rejections at the Node.js process level.

- Send consistent and secure error responses to clients.

- Apply best practices for error logging, structuring, and debugging.

---

## 🏗️ Folder Structure

```js
01_Error_Handling/
├── src/
│   ├── controllers/
│   │   └── userController.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── utils/
│   │   ├── AppError.js
│   │   └── asyncHandler.js
│   ├── app.js
│   └── server.js
└── package.json
```

---

⚙️ Setup Instructions

1. Initialize the project:

    ```js
    npm init -y
    npm i express
    ```

2. Create your folder structure as shown above.

3. Add a basic Express server (`app.js` and `server.js`).

4. Implement the error handling logic following the code examples in ErrorHandling.md.

5. Run the server:

    ```js
    npm start
    ```

---

## 💡 Key Concepts Covered

| Concept                     | Description                                              |
| :-------------------------- | :------------------------------------------------------- |
| **Global Error Middleware** | Centralized function that handles all app errors         |
| **Custom Error Class**      | Class-based error representation with status codes       |
| **Async Wrapper**           | Utility to handle async route errors without try/catch   |
| **Process Handlers**        | Catch uncaught exceptions & unhandled promise rejections |
| **Logging & Security**      | Prevents sensitive info leaks, simplifies debugging      |

---

## 🧭 Best Practices

- Always return consistent JSON responses for errors.

- Never expose internal error details in production.

- Use AppError class for standardized error objects.

- Log every error using libraries like winston or pino.

- Wrap async routes with asyncHandler.

- Test your error scenarios thoroughly.
