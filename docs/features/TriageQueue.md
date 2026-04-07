# Triage Queue

## Objective
The `TriageQueue.tsx` workspace is the default landing hub for operational Investigators once they clear the dual-track login pipeline. 

## Flow Control
* **Auto-Routing:** Investigators bypassing the Main Dashboard default directly into this view via `src/contexts/AppContext.tsx` routing mutations.
* **Manager Rejection Logic [NEW]:** If a Manager rejects a Case creation request, the Task is returned to the Triage Queue.
* **Feedback Banners:** Rejected tasks are flagged with a red **High Priority** banner at the top of the entity list, displaying the Manager's direct comments (e.g., "Insufficient shipping docs", "Clarify UBO relationship").
* **Data Targeting:** Because the AppContext actively applies standard `Array.filter` conditions bounding user bounds against case typologies securely at the state engine load-level, the Triage Queue component requires no localized filtration modifications. Whatever array of cases is presented here has already been vetted against the current session token's clearance level.
* **Typology Constraints:** Cases are strictly segmented by type (e.g., Tax, AML, PEP) based on the analyst's selected specialization during the login flow.
