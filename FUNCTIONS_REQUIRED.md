# FUNCTIONS_REQUIRED.md

This document serves as the implementation roadmap for the STRO STARS functional expansion, based on the Success Criteria scorecard.

## Phase 1: Case & Entity Lifecycle Management
- [x] **Manual Case Creation** (S/N 5-7): Add functionality to manually create a case by inputting entity details or selecting disparate reports.
- [x] **Case Modification/Deletion Workflow** (S/N 1, 11): Implement the ability to request changes or deletions to cases with an approval routing to the Manager.
- [ ] **Entity Resolution Request** (S/N 2): Add a feature to request entity resolution across the system.
- [x] **Link Attachments** (S/N 9): Add file upload and attachment management within the Case Analysis workspace via Firebase.

## Phase 2: Bulk Operations & Permissions
- [x] **Bulk Link/Update** (S/N 8, 12): Implement multi-select functionality in Triage and Case Directory for batch status updates or bulk report linking.
- [ ] **Case Re-assignment** (S/N 13): Allow Managers to re-assign cases to different analysts.
- [x] **RBAC Enforcement** (S/N 14): Implement strict permissions so only assigned analysts or Managers can edit specific cases, including role-based UI branching.

## Phase 3: Advanced Analysis & Reporting
- [ ] **User-Generated Charts** (S/N 15): Enable investigators to generate and embed bar charts or time-series data within their case analysis.
- [ ] **Dissemination Report Builder** (S/N 16-17): Create a "Packaging" interface to compile synopses, long text, images, and network diagrams into a shareable report.

## Phase 4: External Connectivity
- [ ] **eSONAR Integration Hook** (S/N 10): Implement a functional request button to communicate with filers of reports via the eSONAR external system portal.
- [ ] **Export Approval Loop** (S/N 3): Route data export requests (PDF/XML) for Manager approval before they are processed.

---
*Note: This list is derived from the "STRO STARS Case Management" Success Criteria scorecard.*
