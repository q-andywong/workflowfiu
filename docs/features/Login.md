# Authentication & RBAC

## Objective
The `Login.tsx` pipeline serves as the primary gateway into the FIU STR analysis platform matrix, intercepting unauthorized users and strictly defining rendering conditions.

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
* **Dynamic Binding:** Investigators must declare an operational mandate at login. Available typologies: *Money Laundering*, *Sanctions Evasion*, *Terrorism Financing*, *Cybercrime*, *Tax Evasion*, *Fraud*.
* **Access Scope:** 
  * The `Dashboard` view renders the `InvestigatorDashboard` (not the Manager's Command Center).
  * The default landing view shifts dynamically to `TRIAGE`.
  * `AppContext` filters ingestion points based on the selected typology.
  * **Escalation Permission:** Can recommend an entity for case-creation, triggering the **Awaiting Director Sign-off** state.
