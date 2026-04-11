# Outstanding Strategic Roadmap

This document captures the prioritized technical and functional debt remaining in the FIU STR analysis platform operational expansion.

## Completed: Industrialization & Operational Polish
- [x] **Multi-Entity Intelligence Framework**: Refactored the core domain model to support N-to-N relationships between investigations and subjects (`subjects: []`).
- [x] **Industrialized Case Inception Wizard**: Implemented a professional 3-step wizard (Metadata → Discovery → Verification) for creating complex investigations.
- [x] **Cross-Entity Discovery Engine**: Added an automated scanner for identifying historical relationships across all subjects in a case folder.
- [x] **Registry Design Unification**: Standardized all operational registries (Triage, Priority, Hibernation, Case Directory) with unified horizontal card layouts and multi-entity indicators.
- [x] **Managed Analysis Switcher**: Reconfigured the Analysis Workbench with a dedicated subject switcher for multi-subject investigations.

## High Priority: Analytical Depth
- [ ] **Dissemination Report Builder**: Implement the "Packaging" interface to compile analyst findings, evidence attachments, and network diagrams into standardized PDF/XML outputs.
- [ ] **User-Generated Charts**: Enable investigators to generate and embed bar charts and time-series transaction visualizations native to the analysis workspace.

## Mid Priority: System Interconnectivity
- [ ] **Entity Resolution Request**: Add functional triggers to request formal entity resolution across the centralized intelligence registry.
- [ ] **eSONAR Integration Hook**: Enable direct communication channels with report filers via the external eSONAR portal.
- [ ] **Case Re-assignment**: Implement managerial controls to dynamically re-distribute case loads across the analyst pool.

## Data & Compliance
- [ ] **Export Approval Loop**: Route all analytical exports through a mandatory Managerial approval gate to ensure regulatory data governance.
