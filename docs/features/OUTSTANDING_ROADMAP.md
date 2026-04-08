# Outstanding Strategic Roadmap

This document captures the prioritized technical and functional debt remaining in the STRO STARS operational expansion.

## Completed: Industrialization & Operational Polish
- [x] **Managerial UI Refinement**: Conducted a component-level audit and cleanup of the Case Analysis Panel and Triage Queue. Implemented high-fidelity spacing, unified card designs (horizontal list format), and standardized nomenclature (Registry → List) across all registries.
- [x] **Registry Design Unification**: Refactored Triage, Priority, and Hibernation task cards into a unified horizontal list layout for better mental modeling and operational scanning.
- [x] **Nomenclature Standardization**: Globally renamed all "Registry" instances to "List" (e.g. *Hibernated List*, *Priority Bypass List*).

## High Priority: Analytical Depth
- [ ] **Dissemination Report Builder**: Implement the "Packaging" interface to compile analyst findings, evidence attachments, and network diagrams into standardized PDF/XML outputs.
- [ ] **User-Generated Charts**: Enable investigators to generate and embed bar charts and time-series transaction visualizations native to the analysis workspace.

## Mid Priority: System Interconnectivity
- [ ] **Entity Resolution Request**: Add functional triggers to request formal entity resolution across the centralized intelligence registry.
- [ ] **eSONAR Integration Hook**: Enable direct communication channels with report filers via the external eSONAR portal.
- [ ] **Case Re-assignment**: Implement managerial controls to dynamically re-distribute case loads across the analyst pool.

## Data & Compliance
- [ ] **Export Approval Loop**: Route all analytical exports through a mandatory Managerial approval gate to ensure regulatory data governance.
