# Changelog & Version History

This document tracks major architectural deviations and deployments across the FIU STR analysis platform framework. Use this ledger as a reference if functional reversions are required.

## [v3.0.4] - Unified Governance & Documentation
### Added
*   **Comprehensive Story Documentation**: Created a detailed End-to-End User Story Flow documenting every operational gate, including the **Unified Governance Pulse-Sync** points.
*   **Audit-Ready Roadmap**: Audited and checked off core functional requirements (Manual inception, Reporting, Reassignment) in the project framework.

## [v3.0.3] - Managerial Approvals Consolidation
### Added
*   **Integrated Governance Registry**: Fully consolidated the "Approvals Queue" into a specialized sub-view within the **Triage Command Center**. Managers can now handle Triage, Priority Bypasses, and Intelligence Sign-offs from a single, context-aware dashboard.
*   **Deep-Linked Sign-offs**: Redesigned the Executive Dashboard to deep-link directly into the 'APPROVALS' sub-view, enabling instantaneous access to pending escalations.
*   **Advanced Approval UI**: Implemented high-fidelity, table-based viewing for modification requests, including Handshake merges and Dissemination referrals.

### Changed
*   **Navigational Modernization**: Removed the redundant top-level "Approvals Queue" navigation tab to simplify the managerial user journey.
*   **Codebase Optimization**: Deleted `ApprovalsQueue.tsx` and removed associated application routes, reducing architectural complexity while preserving all governance features.

## [v3.0.0] - Industrialized Synchronization & Command Center
### Added
*   **Kafka Sync Simulation (Broadcasting)**: Implemented high-fidelity, 1s synchronization simulations across the entire lifecycle. Includes a backdrop-blurred progress modal and a "Red Tick" success confirmation for:
    - Analyst **Sign-off and Escalate** (Triage).
    - Manager **Sign-off and Escalate** (Approvals).
    - Investigator **Save Changes** (Operational Narrative).
    - Investigator **Package & Disseminate** (Report Builder). [v3.0.1]
    - Investigator **Manual Case Inception** (Modal Trigger). [v3.0.2]
    - Investigator **Confirm Finalization** (Disposal).
*   **Managerial Command Center**: Overhauled the Triage Queue into an operational dashboard for Directors/Managers. Features a 4-grid executive summary (Pending Triage, Awaiting Sign-off, Priority Bypasses, Hibernated Registry).
*   **Pending Approvals Workspace**: Dedicated listing for managers to perform direct, row-level sign-offs and escalations with integrated sync simulation.
*   **Quantexa Pulse-Sync Ingestion**: Added a multi-phase "Scan for latest tasks" simulation (Connecting → Retrieving → Triaging) to provide visual feedback for background data ingestion.


### Changed
*   **Intelligent Navigation Flow**:
    - **Return to Queue**: Successful escalations and finalizations now automatically return the user to the list view for high-throughput processing.
    - **Continue Analysis**: Saving findings now allows investigators to stay in the workbench, maintaining investigative continuity.
*   **Conditional Finalization**: The "Finalize Case" button is now governed by strict requirements (Assigned status and Presence of operational narrative).

### Fixed
*   **Simulation Stability**: Resolved a structure-level JSX error that temporarily disabled the simulation modal during high-concurrency UI updates.

## [v2.6.1] - Interactive Risk Mitigation & UI Polishing

### Added
* **Interactive Risk Mitigation**: Transformed the static Risk Scorecard into an expandable workbench. Analysts can now drill down into specific risk factors to append formal categorical actions (e.g. "RFI sent to bank") and narrative descriptions.
* **Direct STR/CTR Integration**: Clicking on linked regulatory intelligence tokens within the analytical grid now immediately deploys the high-fidelity `STRViewer` modal for instantaneous cross-referencing.

### Changed
* **Workbench Rebalancing**: Refactored the core investigation grid into a strict 50/50 horizontal split to ensure the new interactive Risk Scorecard is given adequate breathing room.
* **Streamlined UI Focus**: Aggressively pruned redundant UI elements:
    * Removed the heavy "Operational Integrity & Governance" bottom bar from the Case Analysis panel.
    * Removed secondary manual linking buttons from the analysis area to force users toward the primary header-level "+" triggers.
    * Polished header separators for a cleaner visual flow towards the "Reassign Case" command.

### Fixed
* **Data Context Synchronization**: Implemented an automated listener (`useEffect`) in `AppContext` that instantly forces the active case to refresh its display when a new entity or report is manually linked to the master registry, removing the need to restart the session.
* **Search Context Stability**: Resolved a critical runtime `ReferenceError` during empty entity/report searches by restoring the `Info` lucide-react icon import.

## [v2.6.0] - Manual Intelligence Enrichment & Discovery
 
### Added
* **Manual Subject & STR Addition**: Analysts can now proactively search and append additional entities or regulatory reports to an active investigation.
* **Audit Lineage**: Manually added subjects and reports are tagged with a "MANUAL" badge and a "Tagged" timestamp for robust audit tracking.
* **Discovery Quick Actions**: Integrated "Link Additional Subject" and "Link Regulatory Report" triggers directly within the Investigation Analysis & Evidence panel to streamline the data enrichment workflow.
* **Global Master Registry Search**: Implemented a global search modal that searches across all available mock entities and transaction reports.

## [v2.5.1] - Multi-Entity Attribution & Stability

### Added
* **Intelligence Attribution Hub**: Introduced visual indicators in Case Analysis to show which specific subject triggered a related case or regulatory report. Includes blue source tags (e.g., `LINKED TO: IGOR DIMITROV`) and attribution labels on historical cards.

### Fixed
* **Investigator Dashboard Stability**: Resolved a critical runtime crash on the Investigator login path caused by legacy property access in the multi-entity domain model.
* **Typology Isolation**: Refined typology-based visibility rules in the Case Directory to ensure Investigators only see relevant operational assets.

## [v2.5.0] - Multi-Entity Case Management Industrialization

### Added
* **Investigator-Specific Triage Stack**: Decoupled the triage view to provide a full-width, vertical workbench for investigators. Removed managerial statistics to maximize screen real-estate for lead assessment.
* **Priority Bypass Registry**: Dedicated high-risk bypass section (Risk > 150) featuring a dark-mode detection registry for critical hit analysis.
* **Context-Aware Navigation Handshake**: Implemented stateful background-view preservation. Closing a Case Analysis panel now automatically restores the investigator to their previous tab (Triage, Directory, etc.) instead of resetting to the Dashboard.
* **Firebase Evidence Locker**: Integrated high-speed evidentiary asset management within Case Analysis, supporting direct file uploads and secure cloud URL mapping.
* **Hibernation Handshake**: Added a real-time hibernation summary and pivot link in the Triage footer for auto-resolved low-risk subjects.

### Changed
* **Router Modernization**: Refactored `App.tsx` router to support background persistence during analytical overlays.
* **Managerial Telemetry**: Restricted Triage Statistics and operational efficiency charts to the Director/Manager role views.

### Fixed
* **Rendering Stability**: Fixed a critical "Blank Screen" crash in Case Analysis caused by a missing `BadgeCheck` icon import.
* **Type Alignment**: Corrected property mismatches in `MitigationScorecard` and `STRViewer` to ensure analytical data persistence.

## [v2.3.0] - Proactive Intelligence & Bulk Operations

### Added
* **Manual Case Creation**: Introduced the ability for investigators to proactively instantiate cases from the **Case Directory** or by bridging disparate reports in the **STR Master Registry**.
* **Bulk Action Toolbar**: Implemented a context-aware floating toolbar (`BulkActionToolbar.tsx`) that triggers upon multi-selection in registries. Supports batch operations including **Escalate**, **Hibernate**, and **Dismiss**.
* **Clustered Investigation Support**: The `createCase` logic now automatically populates the subject's intelligence dossier (`linkedSTRs`) when multiple reports are bridged together.
* **Proactive Governance**: Manual cases are tagged with `[MANUAL]` and automatically routed to `PENDING_APPROVAL` for Director sign-off, ensuring strict governance over analyst-initiated investigations.

### Changed
* **Case Directory Visualization**: Overhauled the directory display to prioritize the **Investigation Title** over the subject name, enabling visibility of cluster names and manual tags.
* **Registry Multi-Selection**: Added bulk-selection checkboxes and "Select All" logic to `TriageQueue.tsx` and `STRDirectory.tsx`.

### Fixed
* **Data Layer Synchronization**: Resolved a bug where bridged reports from the STR Registry were not surfacing in the "Linked Regulatory Reports" panel of the Analysis Workspace.

## [v2.2.0] - Operational Silos & Q Platform Registry

### Added
* **Hibernated Registry**: Introduced a dedicated operational silo (`HibernatedList.tsx`) for low-risk entities (Score < 10). Subjects like Sarah Jenkins are now moved to background monitoring, reducing noise in the active Triage Queue.
* **STR Master Directory**: Implemented a globally searchable registry (`STRDirectory.tsx`) for all ingested reports (STR, CTR, CMR). Feature includes real-time filtering by Report ID (e.g., '993-8822') and direct links to the formal STR Viewer.
* **Q Platform CTR Integration**: Researched and documented the full 9-page **Form NP 784 (CTR)** standard for PSMD. Integrated high-fidelity mock CTR data (Gems, Gold, AML-Tokens) for subjects like Michael Greene (Project Shadow).
* **Automated Hibernation KPIs**: Updated Investigator and Manager dashboards with live "Hibernation Activity" alerts and registry oversight widgets.

### Changed
* **Navigation Overhaul**: Removed the legacy "Priority Alerts" tab. High-risk entities (Score > 150) are now transitioned directly into the primary **Case Directory** as prioritised investigations.
* **Intelligence Registry Consolidation**: Migrated scattered report data into a unified `MOCK_STRS` master array in `constants.ts` for consistent cross-referenced search.

### Fixed
* **Data Integrity**: Enforced strict type-casting for transaction report types (CTR/CMR/STR) to prevent UI rendering errors in the global directory.

## [v2.1.0] - Intelligence Lifecycle Management

### Added
* **Director Sign-off Pipeline**: Implemented a formalized `PENDING_APPROVAL` case state. Investigator escalations are now held in an amber "Awaiting Director Sign-off" lock-screen until cleared by a Manager.
* **Manager Approvals Queue**: Dedicated `ApprovalsQueue.tsx` module for Operations Managers to inspect, approve, or reject escalated Tasks with mandatory feedback notes.
* **Master Case Directory**: Centralized intelligence oversight view (`CaseDirectory.tsx`) displaying all active cases, assigned analysts, and live risk scores. Explicitly filters out `TRIAGE`, `DISMISSED`, and `HIBERNATED` noise.
* **Quantexa Deep-Link Integration**: Approved cases now feature a native, Quantexa-branded secure routing button mapping internal Case IDs to external network analysis graphs at `demo.quantexa.com`.
* **Dashboard Manager Widget**: Dynamic dashboard panel for Managerial roles summarizing outstanding sign-offs with direct navigation shortcuts.

### Fixed
* **State Persistence**: Refactored `App.tsx` and `AppContext.tsx` to hoist state above the authentication layer. Intelligence cases and mutations now survive session swaps (Investigator ↔ Manager).
* **Modal Positioning Context**: Resolved a CSS coordinate system bug where parent transform-based animations were cutting off popup headers. All modals (Historic Cases, STR Viewer) are now truly viewport-centered.
* **Escalate Race Condition**: Fixed a React state synchronization bug in `assessEntity` where concurrent state updates would sometimes fail to trigger the UI lock-screen.

### Changed
* **SVG Branding**: Replaced generic lucide icons with a high-fidelity SVG reconstruction of the Quantexa 'Q' logo on integration touchpoints.
* **Animation System**: Transitioned from `transform`-based fades to pure `opacity`-based transitions in `index.css` to prevent local positioning context interference.

## [v2.0.0] - Phase 2 Pivot (Downstream Intelligence)

### Added
* **Digitized Legacy Ingestion:** Full 15-page Suspicious Transaction Report (STR) PDF mapping recreated as dynamic, read-only HTML layouts under `STRViewer.tsx`.
* **Dynamic RBAC (Role-Based Access Control):** Migrated to a dual-pipeline authorization schema (`AuthContext.tsx`).
* **Typology Constraints:** Embedded deep data array filtering mechanisms parsing `MOCK_CASES` to securely limit exposed UI profiles based on Investigator selection.
* **Wiki Architecture:** Populated exhaustive feature-level modular documentation.

### Changed
* **System Designation:** The platform's objective formally shifted from replacing Q Platform entirely to acting as a **downstream analysis & case management** system ingesting Q Platform outputs.
* **Aesthetic Refactor:** Completely stripped previous aggressive Glassmorphism elements (`index.css` overrides). Migrated entirely to a high-contrast, clean-card Enterprise UI leveraging `bg-gray-50`.
* **Sidebar Removal:** Stripped vertical navigation architecture in favor of a compressed `Header.tsx` horizontal tab bar.
* **Component Renaming:** Refactored entire global data scope from `SIMSContext` to `AppContext`.

### Deprecated
* Legacy Dark-mode Tailwind overlays.
* Unbound mock data generators.
