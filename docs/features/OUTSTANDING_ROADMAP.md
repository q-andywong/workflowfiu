# Outstanding Strategic Roadmap

This document captures the prioritized technical and functional debt remaining in the FIU STR analysis platform operational expansion.

## Completed: Industrialization & Functional Depth
- [x] **Multi-Entity Intelligence Framework**: Refactored the core domain model to support N-to-N relationships between investigations and subjects (`subjects: []`).
- [x] **Industrialized Case Inception Wizard**: Implemented a professional 3-step wizard (Metadata → Discovery → Verification) for creating complex investigations.
- [x] **Cross-Entity Discovery Engine**: Added an automated scanner for identifying historical relationships across all subjects in a case folder.
- [x] **Dissemination Report Builder**: Implemented the "Packaging" interface to compile analyst findings, evidence attachments, and network diagrams into standardized referral outputs.
- [x] **User-Generated Charts**: Enabled investigators to generate and embed bar charts and time-series transaction visualizations native to the analysis workspace.
- [x] **Case Re-assignment**: Implemented managerial controls to dynamically re-distribute case loads across the analyst pool.

## High Priority: Operational Consolidation
- [x] **Integrated Governance Registry**: Consolidated the Approvals Queue into the Triage command center for high-velocity sign-offs.
- [x] **Kafka Pulse-Sync Everywhere**: Integrated high-fidelity synchronization feedback across all critical operational gates.

## Mid Priority: System Interconnectivity
- [ ] **Entity Resolution Request**: Add functional triggers to request formal entity resolution across the centralized intelligence registry.
- [ ] **eSONAR Integration Hook**: Enable direct communication channels with report filers via the external eSONAR portal.

## Data & Compliance
- [ ] **Export Approval Loop**: Route all analytical exports through a mandatory Managerial approval gate to ensure regulatory data governance.
