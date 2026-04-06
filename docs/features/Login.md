# Authentication & RBAC

## Objective
The `Login.tsx` pipeline serves as the primary gateway into the STRO STARS matrix, intercepting unauthorized users and strictly defining rendering conditions.

## Mechanism
The `App.tsx` root wraps the entire execution thread inside an `<AuthProvider>` (`src/contexts/AuthContext.tsx`).
If a session lacks an active authorization token (`user === null`), the router intercepts execution and paints the Login card.

## Supported Roles
### Tier 1: Operations Manager
* **Identifier:** `MANAGER`
* **Access Scope:** The overarching application layer, triggering default rendering to the Intelligence Dashboard with full visibility over the un-mutated `MOCK_CASES` schema.

### Tier 2: Typology Investigator
* **Identifier:** `INVESTIGATOR`
* **Dynamic Binding:** Investigators do not possess broad clearance. When logging in, they must declare their operational mandate (e.g. "Tax Evasion", "Cybercrime").
* **Access Scope:** 
  * The `Dashboard` view is explicitly hidden on the Header.
  * The default landing view shifts dynamically from `DASHBOARD` to `TRIAGE`.
  * `AppContext` intercepts the explicit typology selection and immediately filters backend case ingestion points, preventing cross-typology exposure.
