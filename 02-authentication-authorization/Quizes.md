# ⚔️ Quiz: Authentication & Authorization

Q1.

**In a full-stack web app, which of the following best describes the difference between authentication and authorization?**

A) Authentication checks what actions a user can perform, while authorization verifies who the user is.

B) Authentication verifies who the user is, while authorization determines what the user can do.

C) Both authentication and authorization mean the same in backend systems.

---

Q2.

**Which HTTP status code is most appropriate for unauthorized access due to invalid credentials?**

A) 401 Unauthorized

B) 403 Forbidden

C) 404 Not Found

---

Q3.

**You’re implementing JWT-based login in Node.js. What’s the main advantage of JWTs over traditional session cookies?**

A) JWTs are stored on the server, reducing client complexity.

B) JWTs are stateless, allowing scalable distributed authentication.

C) JWTs never expire, so users stay logged in forever.

---

Q4.

**What’s the purpose of the bcrypt library in authentication systems?**

A) Encrypting passwords using AES algorithm.

B) Hashing passwords securely before storing in the database.

C) Sending passwords safely over HTTP.

---

Q5.

**When using JWTs, where should you never store your token?**

A) In HTTP-only cookies

B) In localStorage

C) In Authorization headers

---

Q6.

**Identify what’s wrong in the code snippet below:**

```js
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
res.cookie('token', token, { httpOnly: false });
```

A) The JWT_SECRET should not be in environment variables.

B) The token should not be stored in a cookie at all.

C) httpOnly should be true to prevent XSS attacks.

---

Q7.

**Which middleware pattern is correct for protecting routes in Express?**

A)

```js
app.get('/profile', (req, res) => verifyToken, (req, res) => res.send('Profile'));
```

B)

```js
app.get('/profile', verifyToken, (req, res) => res.send('Profile'));
```

C)

```js
app.get('/profile', res.send('Profile'), verifyToken);
```

---

Q8.

**In a role-based authorization system, which is the best practice?**

A) Checking user role only on the frontend.

B) Enforcing role-based checks in both backend and frontend.

C) Storing all roles directly in the JWT without validation.

---

Q9.

**If a user logs out, which step ensures complete logout security in a JWT-based system?**

A) Deleting JWT from localStorage only.

B) Adding the JWT to a server-side blacklist until it expires.

C) JWTs cannot be invalidated; logout isn’t possible.

---

Q10.

**What’s a secure and scalable way to issue access and refresh tokens?**

A) Store both in localStorage for easy access.

B) Store access token in memory and refresh token in an HTTP-only cookie.

C) Always store both in the database for every user request.

---
---

## ⚔️ Quiz Answers Review & Explanations

Q1 → ✅ B

"*Authentication verifies who the user is, while authorization determines what the user can do.*"

**Explanation:**

- Authentication = Identity check (username/password, OTP, token).

- Authorization = Permission check (what routes/resources a user can access).

- 🧩 Think: “Authen = Identity, Authori = Access rights.”

---

Q2 → ✅ A

"*401 Unauthorized*"

**Explanation:**

- 401 Unauthorized: credentials are missing or invalid.

- 403 Forbidden: user is authenticated but lacks permission.

- 404 Not Found: resource doesn’t exist.

- ⚔️ Remember: 401 = “Who are you?”, 403 = “You can’t do that.”

---

Q3 → ✅ B

"*JWTs are stateless, allowing scalable distributed authentication.*"

**Explanation:**

- JWTs don’t need server memory to track sessions.

- They work perfectly across distributed systems (like
- microservices).

- 💡 Stateless = scale effortlessly.

---

Q4 → ✅ B

"*Hashing passwords securely before storing in the database.*"

**Explanation:**

- bcrypt hashes, not encrypts — meaning it’s one-way and irreversible.

- Never store plaintext or even base64 passwords.

- 🧠 Hash before save; compare on login.

---

Q5 → ✅ B

"*In localStorage*"

**Explanation:**

- localStorage is accessible via JavaScript → prone to XSS attacks.

- Best practice: use HTTP-only cookies for tokens, especially refresh tokens.

- 🔐 If JS can read it, hackers can too.

---

Q6 → ✅ C

"*httpOnly should be true to prevent XSS attacks.*"

**Explanation:**

- httpOnly: true ensures the cookie isn’t accessible via JS (document.cookie).

- The given code made it false, exposing it to theft.

- ⚠️ Never expose your auth cookie to client-side scripts.

---

Q7 → ✅ B

*`app.get('/profile', verifyToken, (req, res) => res.send('Profile'));`*

**Explanation:**

- Middleware must be placed before the route handler.

- Express runs functions from left → right.

- 🧩 Order matters: verify first, respond later.

---

Q8 → ✅ B

"*Enforcing role-based checks in both backend and frontend.*"

**Explanation:**

- Frontend restrictions are for UX only (hiding buttons).

- Backend checks are non-negotiable for real security.
⚔️ Frontend = cosmetics, Backend = enforcement.

---

Q9 → ✅ B

"*Adding the JWT to a server-side blacklist until it expires.*"

**Explanation:**

- JWTs are stateless, but you can manually invalidate them using a blacklist or short expiry time + refresh token flow.

- 🔄 Blacklist = temporary memory of “bad” tokens.

---

Q10 → ✅ B

"*Store access token in memory and refresh token in an HTTP-only cookie.*"

**Explanation:**

- Access token = short-lived (minutes)

- Refresh token = long-lived (days) and must be HTTP-only

- This ensures secure re-authentication without constant login.

- 🧠 Short life for access, safe storage for refresh.
