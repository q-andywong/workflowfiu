# Outstanding Strategic Roadmap

This document captures the prioritized technical and functional debt remaining in the FIU STR analysis platform operational expansion.

## Completed: Industrialization & Functional Depth
- [x] **Multi-Entity Intelligence Framework**: Refactored the core domain model to support N-to-N relationships between investigations and subjects (`subjects: []`).
- [x] **Industrialized Case Inception Wizard**: Implemented a professional 3-step wizard (Metadata → Discovery → Verification) for creating complex investigations.
- [x] **Cross-Entity Discovery Engine**: Added an automated scanner for identifying historical relationships across all subjects in a case folder.
- [x] **Dissemination Report Builder**: Implemented the "Packaging" interface to compile analyst findings, evidence attachments, and network diagrams into standardized referral outputs.
- [x] **User-Generated Charts**: Enabled investigators to generate and embed bar charts and time-series transaction visualizations native to the analysis workspace.
- [x] **Case Re-assignment**: Implemented managerial controls to dynamically re-distribute case loads across the analyst pool.

## Completed: Operational Consolidation
- [x] **Integrated Governance Registry**: Consolidated the Approvals Queue into the Triage command center for high-velocity sign-offs.
- [x] **Kafka Pulse-Sync Everywhere**: Integrated high-fidelity synchronization feedback across all critical operational gates.

## Completed: Data Alignment & UI Standardization (v3.1)
- [x] **Dynamic Dashboard Charts**: Manager and Investigator dashboard charts now compute from live case data (report type counts, typology distribution, resolution trends) instead of hardcoded mock arrays.
- [x] **Live Pulse-Sync Ingestion**: Scan button fetches `NewTasksToIngest.json` and shows "New Items Discovered" panel with new-only counts. Re-scan deduplicates by case ID.
- [x] **Case Directory Card Layout**: Converted from table layout to standardized 3-line card format matching Triage Queue listing style. Sort controls as compact bar. Standalone reassignment modal.
- [x] **Upstream Data Alignment**: Staggered task `createdAt` dates (Feb 10 – Mar 1, 2026). Created `MockTasksToLoad(Addition).json` with 2 new Cybercrime/Tax Evasion tasks in full upstream schema.
- [x] **CaseDocument Export Schema**: Defined Scala case class structure (`CaseDocument`, `CaseSubject`, `Individual`, `Business`) for Kafka export back to Quantexa. Sample JSON in `samples/CaseDocumentExport.json`.

## Completed: Investigative Lifecycle & Data Enrichment (v3.2)
- [x] **Investigator Dashboard 5-Card Grid**: Replaced 4-card layout with 5 clickable stat cards (Triage Queue, Awaiting Approval, Active Cases, Disseminated, Closed Cases) in `lg:grid-cols-5`. Removed Performance Audit button.
- [x] **PRIORITY Case Finalization**: PRIORITY cases now show the "Finalize Case" button (same as ANALYSIS status), since priority bypass means auto-escalation to a formal case.
- [x] **Dissemination Record on Finalize**: When finalizing with DISSEMINATE outcome, a proper `DisseminationRecord` (agency, date, intelligenceSummary) is created so the case appears in the Dissemination tracker.
- [x] **Agency Feedback Flow**: DISSEMINATED cases show "Record Agency Feedback" (5 outcomes: CONVICTION, ASSET_SEIZURE, ONGOING, NO_OFFENCE_FOUND, DISMISSED) and "Close Case" (after terminal feedback). Uses existing `addFeedback` from AppContext.
- [x] **Dissemination Card Redesign**: Redesigned listing to use 3-line card format matching Case Directory and Triage Queue. Removed Egmont Group Connectivity section. "Awaiting Feedback" badge uses amber with pulse animation.
- [x] **Risk Scorecard Labels**: Risk Factor Description column shows human-readable `scoreId` labels. Expanded rows display entity-specific descriptions. Tighter row padding (py-3).
- [x] **Upstream Score Hit Enrichment**: Added `id`, `scoreId`, `category`, `description` fields to each score hit in `MockTasksToLoad(New).json` and `MockTasksToLoad(Addition).json`.
- [x] **SubjectProfile Schema Cleanup**: Removed `maidenName` from `parsedName` and `cityName` from address in both upstream mock data and `constants.ts` INDIVIDUAL entries.
- [x] **Historical Mock Data Generation**: Created `src/constants-historical.ts` with 20 completed cases (Oct 2025 – Mar 2026) showing full lifecycle outcomes. 11 cases have dissemination records with agency feedback across CAD, MAS, AGC, CPIB, ICA, FOREIGN_FIU. Historical cases bypass auto-routing and preserve final statuses.
- [x] **Dissemination Page Analytics**: Stats cards now compute from actual data (Feedback Response Rate, Actionable Outcomes, Avg Feedback Latency, Pending LEA Responses). Tabs renamed to "Active Items (N)" and "Closed Items (N)".
- [x] **CaseAnalysis Dissemination Section**: Added "Dissemination & Agency Feedback" section below Evidence Locker showing all dissemination records with agency badges, dates, status, intelligence summaries, and agency response narratives.

## Mid Priority: System Interconnectivity
- [ ] **Entity Resolution Request**: Add functional triggers to request formal entity resolution across the centralized intelligence registry.
- [ ] **eSONAR Integration Hook**: Enable direct communication channels with report filers via the external eSONAR portal.

## Mid Priority: STR Viewer Enhancement
- [ ] **Full STR Tab Implementation**: Wire STR Viewer tabs 2 (Account Information), 3 (Entity Information), and 5 (Suspicious Transactions) to full upstream data from `MockSTRsToLoad.json`. Currently showing placeholder content.
- [ ] **Entity Profile Enhancement**: Expand CaseAnalysis "Vital Particulars" section with rich `subjectProfile` data (parsed names, addresses, ID details) for both INDIVIDUAL and COMPANY entity types.

## Data & Compliance
- [ ] **Export Approval Loop**: Route all analytical exports through a mandatory Managerial approval gate to ensure regulatory data governance.
- [ ] **COMPANY-type SubjectProfile**: Add COMPANY-type entries to upstream `MockTasksToLoad(New).json` subjectProfile data (currently all entries are INDIVIDUAL type).
