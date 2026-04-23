# Master Case Directory

## Objective
The `CaseDirectory.tsx` component serves as the central source of truth for all active and historical intelligence investigations. It provides a macro-view of the platform's operational output, moving beyond the fragmented "Task" view of the Triage Queue.

## Functional Capabilities
* **Intelligence Consolidation:** Displays all entities with a status of `ANALYSIS`, `PRIORITY`, `PENDING_APPROVAL`, or `CLOSED`.
* **Automated Noise Reduction:** Explicitly filters out `TRIAGE`, `DISMISSED`, and `HIBERNATED` records to ensure the directory remains focused on actionable intelligence.
* **Direct Navigation:** Analysts can click any record to instantly mount the **Analysis Workspace** pre-loaded with that specific Case file.
* **Manual Instantiation:** Features a "Create New Case" action to proactively start investigations on entities not yet flagged by automation.
* **Search & Filter:** Support for multi-column filtering by Case ID, Investigation Title (including [MANUAL] tags), Analyst Assignment, and Live Risk Score.

## Logic Implementation
The directory consumes the `activeCases` derivation from `AppContext.tsx`. It prioritizes the `title` field for primary display, ensuring that custom investigation names and manual tags are visible. The target entity name remains visible as sub-text for quick reference.
