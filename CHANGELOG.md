# Changelog & Version History

This document tracks major architectural deviations and deployments across the STRO STARS framework. Use this ledger as a reference if functional reversions are required.

## [v2.2.0] - Operational Silos & SONAR Registry (Current)

### Added
* **Hibernated Registry**: Introduced a dedicated operational silo (`HibernatedList.tsx`) for low-risk entities (Score < 10). Subjects like Sarah Jenkins are now moved to background monitoring, reducing noise in the active Triage Queue.
* **STR Master Directory**: Implemented a globally searchable registry (`STRDirectory.tsx`) for all ingested reports (STR, CTR, CMR). Feature includes real-time filtering by Report ID (e.g., '993-8822') and direct links to the formal STR Viewer.
* **SONAR CTR Integration**: Researched and documented the full 9-page **Form NP 784 (CTR)** standard for PSMD. Integrated high-fidelity mock CTR data (Gems, Gold, AML-Tokens) for subjects like Michael Greene (Project Shadow).
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
* **System Designation:** The platform's objective formally shifted from replacing SONAR entirely to acting as a **downstream analysis & case management** system ingesting SONAR outputs.
* **Aesthetic Refactor:** Completely stripped previous aggressive Glassmorphism elements (`index.css` overrides). Migrated entirely to a high-contrast, clean-card Enterprise UI leveraging `bg-gray-50`.
* **Sidebar Removal:** Stripped vertical navigation architecture in favor of a compressed `Header.tsx` horizontal tab bar.
* **Component Renaming:** Refactored entire global data scope from `SIMSContext` to `AppContext`.

### Deprecated
* Legacy Dark-mode Tailwind overlays.
* Unbound mock data generators.
