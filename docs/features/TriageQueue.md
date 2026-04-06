# Triage Queue

## Objective
The `TriageQueue.tsx` workspace is the default landing hub for operational Investigators once they clear the dual-track login pipeline. 

## Flow Control
* **Auto-Routing:** Investigators bypassing the Main Dashboard default directly into this view via `src/contexts/AppContext.tsx` routing mutations.
* **Data Targeting:** Because the AppContext actively applies standard `Array.filter` conditions bounding user bounds against case typologies securely at the state engine load-level, the Triage Queue component requires no localized filtration modifications. Whatever array of cases is presented here has already been vetted against the current session token's clearance level.
