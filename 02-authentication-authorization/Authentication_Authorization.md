# 🪪 Authentication & Authorization — Detailed Notes

## Table of contents

1. Overview — AuthN vs AuthZ

2. Common approaches (Cookies & Sessions, Tokens, OAuth)

3. Password security — bcrypt + salting

4. JWT — structure, signing, verification, best practices

5. Session-based auth (express-session) & cookies

6. Role-Based Access Control (RBAC) patterns

7. Express middleware for protecting routes

8. Passport.js overview & common strategies

9. Refresh tokens, token rotation, logout patterns

10. Security best practices & operational tips

11. Example folder structure & quick implementation snippets

12. Further reading

---

## 1 — Overview: Authentication (AuthN) vs Authorization (AuthZ)

- **Authentication (AuthN)** answers: "Who are you?"
Example: username/password, OAuth login (Google), or a session cookie saying “this user is logged in.”

- **Authorization (AuthZ)** answers: "What are you allowed to do?"
Example: user roles (user/admin) or resource-level permissions (own-post vs edit-any-post).

- Diagram (flow simplified):

    ```js
    Client -> [AuthN: sign-in] -> Server validates -> issues credential (cookie/JWT)
    Client -> [Protected request w/ credential] -> Server checks credential -> applies AuthZ rules -> returns resource
    ```

---

## 2 — Common approaches

### 2.1 Cookie + Server Session (stateful)

- Server stores session state (e.g., in memory or Redis) keyed by session id.

- Browser stores a session cookie (HttpOnly). Each request sends cookie; server reads session id and looks up the user.

- Good for: apps where you want server-controlled session invalidation, easy to revoke.

- Pros: Easy to revoke, secure cookies, CSRF mitigations.

- Cons: Requires server-side state; harder to scale without shared store (Redis).

### 2.2 Token-based (stateless) — JWT

- Server issues JSON Web Token (JWT) that the client stores (usually in memory or secure cookie) and sends with each request (Authorization header Bearer <token>).

- Server verifies signature; no session state needed (stateless).

- Good for microservices, APIs.

- Pros: Scales easily, single token works across domains.

- Cons: Revocation/blacklisting harder, if stored in localStorage vulnerable to XSS (prefer HttpOnly cookie).

### 2.3 OAuth / Third-party identity providers

- Use providers (Google, GitHub) for authentication and optionally authorization.

- Good for fast onboarding and reducing friction.

---

## 3 — Password security: bcrypt + salting

- Never store plaintext passwords. Use bcrypt (or argon2 for stronger resistance).

- Install:

    ```js
    npm i bcrypt
    ```

- Example:

    ```js
    import bcrypt from 'bcrypt';

    const saltRounds = 12; // 10-14 is common; higher = slower/safer

    // Hashing
    const hashed = await bcrypt.hash(plainPassword, saltRounds);

    // Verifying
    const valid = await bcrypt.compare(candidatePassword, hashed);
    ```

- Tips:

  - Use saltRounds based on acceptable latency; 12 is a good baseline.

  - Always validate password strength (length, entropy) before hashing.

  - Re-hash with higher cost if policy changes — store metadata if needed.

---

## 4 — JWT: structure, signing, verifying, best practices

### JWT structure

- Header | Payload | Signature

- Base64Url(Header).Base64Url(Payload).Signature

- Header includes algorithm (e.g., alg: "HS256").

- Payload contains claims like sub (subject), iat, exp, roles, etc. Do not store secrets in payload.

## Creating and verifying (jsonwebtoken)

```js
npm i jsonwebtoken
```

```js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '15m'; // short-lived access token

// Signing
const token = jwt.sign(
  { sub: user.id, role: user.role },
  JWT_SECRET,
  { expiresIn: JWT_EXPIRES_IN }
);

// Verifying
try {
  const decoded = jwt.verify(token, JWT_SECRET);
  // decoded contains sub, role, iat, exp
} catch (err) {
  // handle invalid or expired token
}
```

## Security notes

- Keep JWT_SECRET secure and long (use env var).

- Prefer short-lived access tokens + refresh tokens.

- Do not put sensitive data in JWT payload (it is readable).

- For RS256 (asymmetric), use private key to sign and public key to verify — useful in distributed environments.

---

## 5 — Session-based auth (express-session) & cookies

### Install

```js
npm i express-session connect-redis
```

## Example

```js
import session from 'express-session';
import RedisStore from 'connect-redis';
import redisClient from './config/redisClient.js';

app.use(session({
  store: new (RedisStore(session))({ client: redisClient }),
  name: 'sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // only send cookie via HTTPS
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    sameSite: 'lax', // CSRF mitigation
  }
}));
```

## Notes

- Use `httpOnly` cookies to mitigate XSS.

- `sameSite` and CSRF tokens help defend cross-site attacks.

- Store sessions in Redis for horizontal scaling.

---

## 6 — Role-Based Access Control (RBAC) patterns

- **Simplest RBAC**: each user has a role string: ['user', 'moderator', 'admin'].

- Middleware example:

    ```js
    const restrictTo = (...allowedRoles) => (req, res, next) => {
    if (!req.user) return next(new AppError('Not authenticated', 401));
    if (!allowedRoles.includes(req.user.role)) {
        return next(new AppError('Permission denied', 403));
    }
    next();
    };
    ```

- Usage:

    ```js
    app.delete('/admin-only', protect, restrictTo('admin'), adminHandler);
    ```

- Advanced patterns:

  - Attribute-based access control (ABAC) — checks resource attributes.

  - Permission lists (fine-grained) vs. roles (coarse-grained).

---

## 7 — Express middleware for protecting routes

### Protect middleware (JWT example)

```js
import jwt from 'jsonwebtoken';
import AppError from '../utils/AppError.js';
import User from '../models/userModel.js';

export const protect = async (req, res, next) => {
  // 1) Get token
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) return next(new AppError('Not logged in', 401));

  // 2) Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return next(new AppError('Invalid token', 401));
  }

  // 3) Check user still exists
  const currentUser = await User.findById(decoded.sub);
  if (!currentUser) return next(new AppError('User no longer exists', 401));

  // 4) Attach user to request
  req.user = currentUser;
  next();
};
```

*Combine with `restrictTo` RBAC middleware for role protections.*

---

## 8 — Passport.js overview & common strategies

- Passport is middleware that abstracts different authentication strategies.

- Install:

    ```js
    npm i passport passport-local passport-google-oauth20
    ```

- Basic flow:

  - Configure a strategy (e.g., LocalStrategy for username/password).

  - passport.authenticate('local') handles verifying credentials and establishing session.

  - passport.serializeUser & passport.deserializeUser manage session user data.

- Local strategy example (brief):

    ```js
    import passport from 'passport';
    import { Strategy as LocalStrategy } from 'passport-local';
    import User from '../models/userModel.js';
    import bcrypt from 'bcrypt';

    passport.use(new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
        try {
        const user = await User.findOne({ email }).select('+password');
        if (!user) return done(null, false, { message: 'Incorrect email' });
        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return done(null, false, { message: 'Incorrect password' });
        return done(null, user);
        } catch (err) {
        done(err);
        }
    }
    ));
    ```

- Google OAuth (high level):

  - Use passport-google-oauth20. Redirect users to Google login, handle callback, find or create user by provider id.

- When to use Passport:

  - Good for session-based apps or when you want plug-and-play strategies.

  - For token-based APIs, custom middleware plus JWT is often simpler.

---

## 9 — Refresh tokens, rotation & logout patterns

## Refresh token design

- Access token: short-lived (e.g., 15m). Sent to API with each request.

- Refresh token: long-lived (e.g., 7d). Stored securely (HttpOnly cookie) and used to obtain new access tokens.

## Flow

1. Client authenticates -> server issues access token + refresh token.

2. When access token expires, client sends refresh token to /auth/refresh endpoint.

3. Server validates refresh token (optionally check DB or store a token identifier) and issues new access token (and sometimes a new refresh token).

## Refresh token storage

- Store in database (or Redis) as allowlist for revocation, or store a rotation id for secure rotation.

- Use HttpOnly cookie for refresh tokens to protect from XSS.

## Logout

- Remove refresh token from DB (invalidate it), clear cookies on client.

## Token rotation

- When using rotation, issue a new refresh token on each refresh and invalidate the previous one (good for security against token theft).

---

## 10 — Security best practices & operational tips

- Use HTTPS in production (set secure cookies).

- Store secrets (JWT_SECRET, SESSION_SECRET) in env vars/secret manager.

- Use short-lived access tokens; store refresh tokens server-side or in HttpOnly cookies.

- Implement rate limiting on auth endpoints (prevent brute force): express-rate-limit.

- Enforce strong password policy & optional multi-factor authentication (MFA).

- Use Content Security Policy (CSP) and secure headers (helmet).

- Sanitize input to avoid injections; validate using Joi or Yup.

- Log auth events suspiciously (failed logins) and use monitoring.

- Consider account lockouts or exponential backoff after repeated failures.

- If using cookies, set httpOnly, sameSite, and secure attributes.

### Packages

- `bcrypt` (hashing)

- `jsonwebtoken` (JWT)

- `express-session`, `connect-redis` (session persistence)

- `passport`, `passport-local`, `passport-google-oauth20` (strategies)

- `helmet` (secure headers)

- `express-rate-limit` (rate limiting)

---

## 11 — Example folder structure & quick implementation snippets

```js
02_Auth_Authorization/
├── src/
│   ├── controllers/
│   │   └── authController.js
│   ├── middlewares/
│   │   ├── protect.js
│   │   └── restrictTo.js
│   ├── models/
│   │   └── userModel.js
│   ├── utils/
│   │   ├── AppError.js
│   │   └── catchAsync.js
│   ├── routes/
│   │   └── authRoutes.js
│   ├── app.js
│   └── server.js
└── package.json
```

### userModel (simplified; mongoose)

```js
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email:{ type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 8, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
});

// Hash password before save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance method to compare passwords
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
export default User;
```

### authController (signup/login using JWT)

```js
import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/AppError.js';
import User from '../models/userModel.js';

const signToken = (id) =>
  jwt.sign({ sub: id }, process.env.JWT_SECRET, { expiresIn: '15m' });

export const signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password });
  const token = signToken(user._id);
  res.status(201).json({ status: 'success', token, data: { user } });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new AppError('Provide email and password', 400));

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  const token = signToken(user._id);
  res.status(200).json({ status: 'success', token });
});
```

---

## 12 — Further reading & resources

- JWT RFC: <https://tools.ietf.org/html/rfc7519>

- OWASP Authentication Cheat Sheet: <https://cheatsheetseries.owasp.org/>

- Passport.js docs: <http://www.passportjs.org/>

- bcrypt vs argon2: consider argon2 for higher security (npm package argon2)
