# Authentication & RBAC

## Objective
The `Login.tsx` pipeline serves as the primary gateway into the STRO STARS matrix, intercepting unauthorized users and strictly defining rendering conditions.

## Mechanism
The `App.tsx` root wraps the entire execution thread inside an `<AuthProvider>` (`src/contexts/AuthContext.tsx`).
If a session lacks an active authorization token (`user === null`), the router intercepts execution and paints the Login card.

## Cross-Session Persistence [NEW]
The `AppProvider` context is now hoisted above the `AuthProvider` layer in `App.tsx`. This ensures that Case mutations, Director Sign-offs, and triage decisions are preserved in the session's state even if an analyst logs out and a Manager logs in (or vice versa).

## Supported Roles
### Tier 1: Operations Manager
* **Identifier:** `MANAGER`
* **Access Scope:** Overarching platform visibility.
* **Approval Responsibility [NEW]:** The sole role authorized to transition a **Task** into a **Case**. Managers review all `PENDING_APPROVAL` escalations and provide final authorization or rejection notes.

### Tier 2: Typology Investigator
* **Identifier:** `INVESTIGATOR`
* **Dynamic Binding:** Investigators must declare an operational mandate (e.g. "Tax Evasion", "Cybercrime") at login.
* **Access Scope:** 
  * The `Dashboard` view is explicitly restricted.
  * The default landing view shifts dynamically to `TRIAGE`.
  * `AppContext` filters ingestion points based on the selected typology.
  * **Escalation Permission:** Can recommend an entity for case-creation, triggering the **Awaiting Director Sign-off** state.
