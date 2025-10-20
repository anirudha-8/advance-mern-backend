# 🧩 Error Handling in Express — Quiz Round

1️⃣.

Question:
In Express, where should your global error-handling middleware be registered?
A. Before route definitions
B. At the very top of app.js
C. After all routes and other middleware
D. It doesn’t matter

✅ Answer: C
🧠 Explanation: Error-handling middleware must come after all routes so any error raised during routing can be passed down to it.

---

2️⃣.

Question:
What is the default signature of an Express error-handling middleware?
A. (req, res, next)
B. (err, req, res, next)
C. (error, res)
D. (err, req)

✅ Answer: B
🧠 Explanation: The four-argument signature tells Express it’s an error-handling middleware

---

3️⃣.

Question:
Which method passes control to the next error-handling middleware?
A. throw
B. return
C. next(err)
D. res.send(err)

✅ Answer: C
🧠 Explanation: next(err) signals Express to skip normal middleware and invoke error handlers.

---

4️⃣.

Question:
How does Express handle errors thrown in asynchronous route handlers by default?
A. They’re automatically caught
B. They’re ignored silently
C. They crash the app
D. They’re logged automatically

✅ Answer: C
🧠 Explanation: Unhandled rejections or thrown async errors crash the process; you must call next(err) or use an async wrapper.

---

5️⃣.

Question:
What is the main purpose of the AppError custom class?
A. To style error messages
B. To create structured, reusable error objects with status codes
C. To replace Express’s default Error
D. To handle uncaught exceptions

✅ Answer: B
🧠 Explanation: A custom class standardizes error properties (message, statusCode, type) for consistent responses.

---

6️⃣.

Question:
Which of these is not a good production practice?
A. Logging errors to files
B. Returning detailed stack traces to the client
C. Handling operational errors gracefully
D. Sending consistent JSON error responses

✅ Answer: B
🧠 Explanation: Stack traces can expose sensitive information — never show them in production.

---

7️⃣.

Question:
What will happen if you forget to call next(err) inside a catch block in async code?
A. The error will vanish silently
B. The server will crash
C. The client receives a successful response
D. The route keeps waiting indefinitely

✅ Answer: B
🧠 Explanation: Unhandled rejections crash Node.js unless caught and forwarded with next(err).

---

8️⃣.

Question:
Which of the following code snippets defines a valid async wrapper utility?

```js
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);
```

✅ or ❌

✅ Answer: ✅
🧠 Explanation: This pattern ensures any rejected promise is automatically passed to Express’s error-handling middleware.

---

9️⃣.

Question:
Which Node.js events should be handled to catch global errors?
A. process.on('exit') and process.on('disconnect')
B. process.on('uncaughtException') and process.on('unhandledRejection')
C. process.on('SIGTERM') only
D. process.on('data')

✅ Answer: B
🧠 Explanation: These two events cover synchronous exceptions and unhandled promise rejections respectively.

---

🔟.

Question:
Which HTTP status code is most appropriate for a missing resource?
A. 400
B. 401
C. 404
D. 500

✅ Answer: C
🧠 Explanation: 404 = “Not Found”; used when the server can’t locate the requested resource.

---

## 🎯 Scoring Guide

|  Score | Skill Level                                |
| :----: | :----------------------------------------- |
|  0 – 4 | Review the notes again                     |
|  5 – 7 | Good — ready for practice problems         |
| 8 – 10 | Excellent — production-ready understanding |
