# Amara — Frontend

A React + Tailwind CSS frontend built to match the Spring Boot `Dating-App` backend
(package `com.dta.Dating_App`, default port **9395**).

## Setup

```bash
npm install
cp .env.example .env
# edit .env: set VITE_API_BASE_URL to your backend URL,
# and VITE_RAZORPAY_KEY_ID to your Razorpay public key id
npm run dev
```

Make sure the backend is running (`mvn spring-boot:run` or the packaged jar) and that
its CORS config allows your frontend origin — the backend already sets
`@CrossOrigin(origins = "*")` on most controllers.

## What's implemented, and which controller it talks to

| Screen | Backend controller(s) |
|---|---|
| Login / Register (OTP) / Forgot password | `AuthController`, `MsgOtpController`, `ForgotPasswordController` |
| Onboarding wizard | `ProfileController#setupProfile` |
| Discover — "For you" deck, Online now, Recently joined tabs | `HomeController`, `DashboardController` |
| Browse (advanced filters, paginated) | `UserFilterController` |
| Quick search | `SearchController` |
| Nearby (current location, location history, nearby users) | `LocationController` |
| Connections (requests/sent/matches), report a user | `ConnectionController`, `ReportController` |
| Notifications | `NotificationController` |
| My profile + gallery | `ProfileController`, `UserImageController` |
| Edit profile | `ProfileController` (`update-basic`, `update-details`, `update-preferences`) |
| Subscription + Razorpay checkout | `SubscriptionController`, `RazorpayController` |
| Settings (password, telegram, deactivate/delete, terms status) | `ChangePasswordController`, `TelegramController`, `AccountController`, `PrivacyController` |
| Support tickets | `SupportController` |

Every controller now has a screen. One real gap remains on the backend side, not fixable
from the frontend alone: `HomeController` and `SearchController` return DTOs
(`UserCardDTO`, `UserSearchResponse`) with **no id field**, so a real connection request
can't be sent from the Discover "For you" deck or Quick search results — those screens
nudge people to Browse/Nearby/Online/Recent instead, which do return a real id.

### Backend bugs found during integration (fixed in `amara-backend-fixes.zip`)

While wiring up Browse / Discover's Online-Recent tabs / Connections, three real
backend issues turned up (separate download, apply to the backend project):

1. **Circular JSON serialization.** `User` and `UserProfile` reference each other
   (`User.profile` / `UserProfile.user`) with no `@JsonIgnore` on either side, and
   several other entities (`Payment`, `UserLocation`, `TermsAcceptance`, `Support`,
   `Notification`) have the same unguarded back-reference to `User`. Any endpoint that
   serializes a raw `User`/`UserProfile` (Browse, Connections, Discover's Online/Recent
   tabs) would recurse forever and crash. Fixed by adding `@JsonIgnore` to the
   back-reference side of each relation.
2. **Password/mobile leak.** `User.password` and `UserProfile.password` /
   `UserProfile.mobile` had no `@JsonIgnore`, so any endpoint returning a raw `User` or
   `UserProfile` (again: Browse, Connections, Online/Recent) would include another
   person's bcrypt hash and phone number in the response. Fixed with `@JsonIgnore`.
3. Because `UserProfile.user` is now hidden, a small `userDbId` field was added
   (`UserProfile.getUserDbId()`, serialized via `@JsonProperty`) so the frontend can
   still get a real `Long` id to send a connection request from Discover's Online/Recent
   tabs — `Discover.jsx` reads `p.userDbId`.

**Not fixed (flagging for awareness, bigger change):** no controller checks that the
`userId`/`byUserId`/etc. in a request actually belongs to the authenticated JWT — every
endpoint just trusts whatever id the client sends. `JwtFilter` validates the token but
never uses the identity it extracts. This means, for example, anyone with any valid
token can currently deactivate/delete/message as *any* `userId`, not just their own —
and `/account/**` is fully `permitAll` (no token needed at all) on top of that. Worth
addressing before this goes anywhere near production; out of scope for this pass.

### Important: two different "user id" shapes

The backend is inconsistent about what it calls `userId`:

- Most endpoints (`ConnectionController`, `ProfileController`, `NotificationController`,
  `AccountController`, etc.) take the **Long database primary key** (`User.id`).
- A few endpoints take the **String user code** (`User.userId`) instead:
  `HomeController` (`/home/{userId}`), `UserImageController`'s upload/list endpoints
  (`/users/{userId}/images`), `SubscriptionController`, and
  `LocationController#getNearbyUsers`.

`AuthContext` stores both (`user.id` = Long PK, `user.userId` = string code) from the
login/register response, and every API call in `src/pages` and `src/components` uses
whichever one the target endpoint actually expects — check `src/api/*.js` comments
before adding a new call.

## Notes on the backend contract

- Most routes require a `Bearer` JWT (see `SecurityConfig.java`); the axios client in
  `src/api/client.js` attaches the token from `localStorage` automatically after login.
- `POST /register` returns a `sessionId`, which is then used with an OTP in
  `POST /verify-register/otp` to complete signup and receive the JWT — the Register
  page implements this two-step flow.
- File uploads (`profile setup`, gallery images) use `multipart/form-data`.
- Uploaded images are served by the backend from `/amara/**` (see `StaticConfig.java`);
  `src/utils/imageUrl.js` resolves relative paths returned by the API against
  `VITE_API_BASE_URL`.
- Razorpay: the backend creates and verifies orders, but the checkout widget on the
  frontend needs the **public** key id, which isn't returned by `create-order` — put it
  in `VITE_RAZORPAY_KEY_ID`.

## Design

Visual identity is intentionally distinct from the typical pink/red "swipe app" look:
a deep-plum & warm cream palette (`ink` / `cream` / `ember` / `gold`), Fraunces for
display type paired with Inter for body text, and a recurring "thread" motif (a thin
gold curve connecting two points) used sparingly as the app's signature — echoing the
idea of two people being connected. Tokens live in `tailwind.config.js`.

## Structure

```
src/
  api/            one file per backend controller group
  components/     shared UI (AppShell, ProtectedRoute, UserCard, PersonTile,
                   ReportModal, Toast, Loader…)
  context/        AuthContext (JWT + user session)
  pages/          one file per screen (Discover, Browse, Nearby, Search,
                   Connections, Notifications, Subscription, Settings, Support…),
                   pages/profile/ for profile sub-pages
```
