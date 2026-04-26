# Managerial Intelligence Dashboard

## Objective
The `Dashboard.tsx` view acts as the global system bird's-eye view. It renders role-specific dashboards: `ManagerDashboard` for `MANAGER` sessions and `InvestigatorDashboard` for `INVESTIGATOR` sessions.

## Manager Dashboard (`ManagerDashboard.tsx`)
* **Metric Overview:** Tracks ingested datasets from upstream (Q Platform) and parses aggregate telemetry, including `Total Incoming`, `Active Analyses`, and `Disseminated` logs.
* **Dynamic 7-Day Traffic Chart:** Computes report type counts (STR, CTR, CMR) dynamically from `cases.flatMap(c => c.reports)` using `r.type` field. Renders three Area components with weighted 7-day distribution. CMR line uses dedicated `colorMgrCmr` gradient.
* **Typology Distribution Pie:** Dynamically computed from `cases.subjects.crimeTypologies`, reflecting actual case data rather than hardcoded values.
* **Manager Approvals Widget:** An amber priority panel summarizing the number of `PENDING_APPROVAL` cases. Provides a one-click shortcut to the **Approvals Queue**.
* **Priority Workbench Sync:** Deep-links directly into the `PRIORITY` workspace for urgent, high-score alerts identified by the automated triage engine.

## Investigator Dashboard (`InvestigatorDashboard.tsx`)
* **5-Card Stat Grid:** Displays 5 clickable metric cards in a `lg:grid-cols-5` layout: **Triage Queue** (navigates to TRIAGE), **Awaiting Approval** (navigates to TRIAGE/APPROVALS), **Active Cases** (navigates to DIRECTORY), **Disseminated** (navigates to DIRECTORY), and **Closed Cases** (navigates to DIRECTORY). All cards are interactive with hover effects.
* **Dynamic Resolution Trend:** Computes trend data from actual case statistics — closed/disseminated case counts and average resolution time drive the chart values rather than hardcoded mock arrays.
* **Typology-Filtered Metrics:** Dashboard metrics reflect only cases matching the investigator's declared crime typology specialization.
* **Access Scope:** The default landing view for investigators shifts dynamically to `TRIAGE` (not the Dashboard).

## Graph Rendering
Employs the `recharts` library for all chart components (Area, Pie, Bar). Chart data is recomputed on every render from the live `cases` array in AppContext.
