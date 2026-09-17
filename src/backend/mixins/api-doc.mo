mixin () {
  public query func getApiDoc() : async Text {
    "# OurHome — Backend API

OurHome (\"บ้านที่ทุกคนใฝ่ฝัน\") is a modern real-estate platform managed by NIC GROUP 95 (THAILAND). It connects customers, agents, and housing projects. This backend exposes the persisted catalogue (projects, houses, agents, reviews, posts), per-user data (favorites, appointments, notifications), an admin metrics endpoint, an Internet Identity based role system, and an OQL query layer over the persisted data.

## Authentication & Authorization

The app uses Internet Identity (II) through the `MixinAuthorization` mixin. A caller is identified by its principal. Roles are `#admin`, `#user`, and `#guest`.

### Registration prerequisite

Access is gated by registration. A direct API caller must register once by calling `_initialize_access_control()` as a signed-in (non-anonymous) caller before any role-guarded call (guarded queries included). The **first** caller to register becomes `#admin`; every subsequent caller becomes `#user`. Anonymous callers are always treated as `#guest` and are never registered.

A caller can be unregistered even when the app \"already knows\" it: registration happens only when a caller signs in through the app's own frontend. A principal that never did so is unregistered even if it belongs to the app's owner, and a signed-in caller derived against a different origin is a different principal than the one the frontend registered.

### Identity derivation

The app's frontend pins an Internet Identity derivation origin, published at `/.well-known/ii-derivation-origin` when available. An agent already holding the user's Internet Identity authorization derives the correct per-app principal against that origin, for example:

    icp identity link web <name> --app <host>

Such a delegation acts with the user's full authority in this app until it expires.

### Role-guarded endpoints

- `getCallerUserRole() : async UserRole` — returns the caller's role. Anonymous returns `#guest`. A registered caller returns their role. An **unregistered** non-anonymous caller traps with `User is not registered`.
- `isCallerAdmin() : async Bool` — true only for `#admin`. Anonymous returns `false`; an unregistered non-anonymous caller traps with `User is not registered`.
- `assignCallerUserRole(user : Principal, role : UserRole) : async ()` — assigns a role. **Admin-only**; a non-admin caller traps with `Unauthorized: Only admins can assign user roles`.
- `_initialize_access_control() : async ()` — registers the caller (first becomes admin, later become users). No-op for anonymous callers.
- `_internet_identity_sign_in_start() : async Blob` — begins an II sign-in, returning a challenge blob.
- `_internet_identity_sign_in_finish() : async Result.Result<(), Verify.Error>` — completes the II sign-in and registers the caller.

### Domain endpoints and the caller

Most domain endpoints do not trap on an anonymous caller; they use the caller only to scope per-user data:

- `getFavorites()`, `addFavoriteProject`, `removeFavoriteProject`, `addFavoriteHouse`, `removeFavoriteHouse`, `addFavoriteHouseType`, `removeFavoriteHouseType`, `addFavoriteAgent`, `removeFavoriteAgent`, `addSavedPost`, `removeSavedPost` — operate on the caller's own favorite record. An anonymous caller reads/writes an empty favorite under the anonymous principal.
- `listAppointments()` — returns only the caller's own appointments (filtered by `userId`).
- `listNotifications()` — returns only the caller's own notifications (filtered by `userId`).
- `getAdminMetrics()` — currently has no caller guard in source; it returns aggregate counts.
- `smartSearch(query : Text) : async [Project]` — public smart search over the project catalogue. It parses the natural-language Thai query for a province/district name, a house-type keyword (`บ้านเดี่ยว`, `บ้านแฝด`, `ทาวน์โฮม`, `ทาวน์เฮาส์`, `บ้านชั้นเดียว`, `บ้านสองชั้น`), and a budget amount (a number followed by `ล้าน` = 1,000,000 or `แสน` = 100,000). It then returns projects matching the parsed location, house type, and max price. If no parseable terms are found, it returns all projects.

## OQL Query Layer

`schema()` and `execute()` expose the persisted (non-transient) data as queryable tables. Authorization is per table:

- `project`, `house`, `agent`, `review`, `post` — `#public_`: anyone (including anonymous) reads every row.
- `favorite`, `appointment`, `notification` — `#controllerOrScoped`: the platform controller reads every row; a signed-in caller reads only rows whose `userId` equals its own principal; anonymous is denied.

`execute(qJson : Text)` takes a JSON query and returns a typed Candid result. `schema()` returns the JSON schema document. An invalid query traps with `OQL: invalid query — <reason>`.

## Units & Encodings

- **Timestamps** (`createdAt`, `date`, `time`) are `Int` nanoseconds since the Unix epoch (`Time.now()`).
- **Identifiers** (`id`, `projectId`, `agentId`, `houseId`, `userId`) are `Nat`, except `userId`/`authorId`/`reviewerId` which are `Principal` (rendered as text in OQL).
- **Optional values** (`?Text`, `?Nat`, `?Location`) are `null` when absent. In OQL, optional numeric columns use `0` as the sentinel for `null` (e.g. `post.projectId`, `post.price`).
- **Appointment booking payload** (`bookAppointment`) carries the customer's `name` and `phone` as `Text`, alongside the project/house selection, `date`/`time` (nanoseconds), `visitors`, and optional `agentId`. These are persisted on the appointment record.
- **Variants** are rendered as text in OQL: `projectStatus` ∈ `new|ongoing|completed`; `verificationStatus` ∈ `none|verified|official`; `house.status` ∈ `readyToMove|underConstruction`; `appointment.status` ∈ `pending|confirmed|cancelled|completed`.

## Lifecycle & Polling

- Appointments are created via `bookAppointment` with status `#pending`, then transition to `#confirmed` (`confirmAppointment`), `#cancelled` (`cancelAppointment`), or `#completed`. There is no background worker; transitions happen only through explicit calls.
- Notifications are created when an appointment is booked (`bookAppointment` also writes a notification to the caller). `markNotificationRead(id)` flips `read` to `true`.
- There are no long-running jobs; polling is not required. Read endpoints are safe to call repeatedly.

## Mutation Retry Safety & Idempotency

- `addProject`, `addHouse`, `addAgent`, `addPost`, `bookAppointment` each allocate a fresh id from a monotonically increasing counter, so a retried call creates a **new** record rather than overwriting. They are not idempotent.
- `addReview` allocates a fresh id on first review, but is idempotent per reviewer per agent: a second review from the same reviewer for the same agent returns the existing review's id and creates nothing new.
- `updateProject`, `updateHouse`, `updateAgent` replace the record with the given id; calling with an id that does not exist is a no-op (no error).
- `deleteProject`, `deleteHouse`, `deleteAgent` remove the record with the given id; a missing id is a no-op.
- Favorite add/remove helpers are idempotent per element: adding an already-present id is a no-op, and removing an absent id is a no-op.
- `likePost`, `commentPost`, `sharePost`, `savePost` increment the corresponding counter; repeated calls increment repeatedly (not idempotent).
- `confirmAppointment`/`cancelAppointment`/`markNotificationRead` are idempotent: re-applying the same transition is a no-op.

## Errors, Traps & Gotchas

- Role-guarded endpoints trap (reject) rather than returning an error value; see the trap messages quoted above.
- `getCallerUserRole` and `isCallerAdmin` trap for an unregistered non-anonymous caller — register first with `_initialize_access_control`.
- `execute` traps on malformed JSON queries.
- `addReview` prevents duplicate reviews: a reviewer may review a given agent only once. A repeated `addReview` from the same reviewer for the same agent returns the existing review's id and does not create a new review or change the agent's rating.
- OQL `favorite`/`appointment`/`notification` tables are `#controllerOrScoped`: an anonymous caller cannot read them, and a signed-in caller sees only its own rows.
"
  };
};
