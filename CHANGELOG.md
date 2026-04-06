# Changelog & Version History

This document tracks major architectural deviations and deployments across the STRO STARS framework. Use this ledger as a reference if functional reversions are required.

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
