# Authentication and Passport in this backend

This note describes the implementation in `src/iam` as it exists today. It explains both the working login path and the unfinished JWT request-authentication path.

## The moving parts

| Piece | Role here |
| --- | --- |
| `IamModule` | Groups the authentication service, controller, local strategy, JWT signing module, users module, and hashing module. |
| `LocalStrategy` | Implements Passport's `local` strategy. It reads the email/password fields and asks `AuthenticationService` to verify them. |
| `LocalAuthenticationGuard` | Runs Passport's `local` strategy before the login controller. |
| `AuthenticationService` | Looks up/checks credentials and creates a signed JWT for successful login. |
| `CurrentUser` | Reads `request.user`, which Passport sets after successful authentication. |
| `JwtStrategy` | Configures JWT extraction from the `Authentication` cookie, but its validation method is unfinished and it is not registered. |

Passport separates *how credentials are checked* (a strategy) from *where that check is enforced* (a guard). Nest's `@nestjs/passport` adapts Passport strategies and guards to Nest's dependency injection and request lifecycle. The guard name (`'local'`) must match the strategy name; the JWT strategy's default name is `'jwt'`.

## Current login request, step by step

The endpoint is `POST /auth/login` in `AuthenticationController`.

1. Nest sees `@UseGuards(LocalAuthenticationGuard)` and runs the guard before calling `login()`.
2. `AuthGuard('local')` invokes the registered `LocalStrategy` on the request body. The strategy maps Passport's `username` input to the `email` field via `super({ usernameField: 'email' })`; `password` retains Passport Local's default field name.
3. Passport calls `LocalStrategy.validate(email, password)`. This delegates to `AuthenticationService.verifyUser()`.
4. `verifyUser()` looks up the user by email and compares the supplied password with the stored hash via `HashingService`. On success, the strategy returns the user. On failure it throws `UnauthorizedException` (the catch currently converts any lookup/compare error to the same email/password error).
5. Nest Passport puts the returned value on `request.user`. The `@CurrentUser()` parameter decorator reads that property, so the controller receives the authenticated user without parsing the body again.
6. The controller calls `AuthenticationService.login(user, response)`. It signs `{ userId: user.id }` with `JwtService`, sets an `Authentication` cookie, and responds with `{ tokenPayload: { userId } }`.

The cookie is configured `httpOnly: true` (browser JavaScript cannot read it) and `secure: true` (the browser only sends it over HTTPS). There is no `sameSite`, `path`, or domain option currently specified. `@Res({ passthrough: true })` allows Nest to keep producing the normal return-value response while the service sets a cookie on the Express response.

## How cookie-based JWT authentication is meant to work

`main.ts` installs `cookie-parser`, which parses incoming cookies into `request.cookies`. `JwtStrategy` is set to extract `request.cookies.Authentication`, then `passport-jwt` verifies the token signature with `JWT_SECRET` and checks its expiry. After that, Passport calls the strategy's `validate(payload)` method. A completed implementation should validate the payload (here the expected shape is `{ userId: number }`) and return the user or an appropriate principal; Passport will put that returned value on `request.user`.

A route protected with `AuthGuard('jwt')` would then follow this path: guard → extract cookie → verify JWT → strategy `validate()` → set `request.user` → controller. The cookie is a transport for the bearer token; it does not make the token a server-side session. Signing out normally requires clearing the cookie; immediate revocation also needs a server-side mechanism such as a token version, denylist, or short expiry plus refresh flow.

## Current implementation gaps and correctness issues

- **JWT protection is not active.** `JwtStrategy` is not in `IamModule.providers`, no JWT guard exists, and no route uses `AuthGuard('jwt')`. The login endpoint issues a JWT cookie, but the app currently has no registered Passport strategy to authenticate later requests from it.
- **JWT validation is a stub.** `JwtStrategy.validate()` throws `Method not implemented.` It needs to validate the payload and return the principal (often by loading the user from `UsersService`).
- **Password comparison is not awaited.** `HashingService.compare()` returns `Promise<boolean>`, but `verifyUser()` assigns its promise to `isPasswordCorrect` without `await`. A promise is truthy, so the current check does not reliably reject a wrong password. Await the comparison before testing the boolean.
- **Cookie expiry uses milliseconds within the current second.** `new Date(now.getMilliseconds() + ms(expiry))` should use the epoch time, e.g. `new Date(now.getTime() + ms(expiry))`. As written, the cookie expiry can be near the Unix epoch and already expired.
- **JWT module configuration warrants a check.** `JwtModule.registerAsync()` lists `ConfigModule` in `inject` but the factory parameter is typed as `ConfigService`. The injected token should be the service (`ConfigService`), with `ConfigModule` available in `imports` (or global configuration already initialized). The mismatch can prevent expected config injection.
- **Environment example has a duplicate key.** `.env.example` declares `JWT_SECRET` twice; the second line appears intended to be `JWT_EXPIRATION`.
- **Cookie-authenticated requests need CSRF consideration.** Browsers attach cookies automatically. If this API is called cross-site, choose an appropriate `SameSite` policy and add CSRF protections where needed; CORS alone is not a CSRF defense. `secure: true` also means local plain-HTTP browser testing will not persist/send the cookie.

## Configuration and code locations

- `src/iam/iam.module.ts` — module wiring and JWT signing configuration.
- `src/iam/authentication/authentication.controller.ts` — `POST /auth/login` and local guard.
- `src/iam/authentication/guards/local-authentication.guard.ts` — Passport local guard.
- `src/iam/authentication/strategies/local.strategy.ts` — email/password strategy.
- `src/iam/authentication/strategies/jwt.strategy.ts` — intended cookie JWT strategy, currently incomplete.
- `src/iam/authentication/authentication.service.ts` — credential verification and token/cookie issuance.
- `src/iam/authentication/decorators/current-user.decorator.ts` — accessor for Passport's `request.user`.
- `src/iam/interfaces/token-payload.interface.ts` — JWT payload shape.
- `src/main.ts` — installs `cookie-parser`, required before extracting cookies.

The JWT signer/verifier configuration reads `JWT_SECRET` and `JWT_EXPIRATION`. Keep the secret private and consistent between signing and verification. The expiration should be a valid duration understood by `@nestjs/jwt`/`ms` (for example `15m` or `1h`).
