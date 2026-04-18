# HollaEx Network email vs kit user email

## Current behavior

- Kit user records are created on the **network** with `createUserOnNetwork(email)` using the kit email (including synthetic phone-signup addresses such as `digits_sms@hostname`).
- Admin and operator tools that change email (e.g. `changeKitUserEmail`, `server/tools/dbs/changeEmail.js`) update the **kit database only**.
- There is **no automatic sync** in this codebase from a kit email change to the HollaEx Network user record.

## Phone signup → `POST /user/set-email`

After a user confirms a real email via `/user/set-email/confirm`, the kit `Users.email` field is updated and sessions are revoked. The **network** may still show the historical synthetic email until:

- a network API exists to update user email and the kit is updated to call it, or
- operators reconcile accounts manually.

When planning product behavior, treat network identity as keyed by `network_id`; email on the network side may diverge until sync is implemented.
