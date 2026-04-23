# Managerial Intelligence Dashboard

## Objective
The `Dashboard.tsx` view acts as the global system bird's-eye view, accessible exclusively by Tier 1 administrators (`MANAGER`). 

## Functionality
* **Metric Overview:** Tracks ingested datasets from upstream (Q Platform) and parses aggregate telemetry, including `Total Incoming`, `Active Analyses`, and `Disseminated` logs.
* **Manager Approvals Widget [NEW]:** For sessions with `MANAGER` clearance, the dashboard injects an amber priority panel summarizing the number of `PENDING_APPROVAL` cases. This widget is globally interactive, providing a one-click shortcut to the **Approvals Queue**.
* **Graph Rendering:** Employs the `recharts` library to cast visual data aggregations, evaluating cross-border vs domestic traffic density over time.
* **Access Bounds:** As per system specs, `TAX_ANALYST` or standard Investigator roles will never mount this component because their session tokens trigger an immediate bypass, routing them to the Triage pool.
* **Priority Workbench Sync:** Deep-links directly into the `PRIORITY` workspace for urgent, high-score alerts identified by the automated triage engine.
