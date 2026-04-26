# STR Downstream Viewer

## Objective
The `STRViewer.tsx` is one of the heaviest components in the architecture, designed specifically to enforce the system's role as a downstream viewer. 

## Digital Reconstruction Constraints
We mapped the structure of an inherited 15-page legacy PDF document containing upstream Suspicious Transaction Reports natively into the React environment.
* **Read-Only Rigidity:** To preserve absolute integrity from upstream Q Platform pipelines, no component inside the viewer allows modification. Standard text-area inputs were redesigned into crisp, tabular grids spanning 7 explicit tabs.

## Form Structure Breakdown
The STR Viewer renders 7 tabs aligned to the regulatory form structure. Upstream data from `MockSTRsToLoad.json` provides full content for tabs I, II, III, and V. The mapping:

| Tab | Part | Content | Data Source |
|-----|------|---------|-------------|
| 1 | Part I: Reporting Institution | Institution name, UEN, contact officer | `tabI_reportingInstitution` |
| 2 | Part II: Account Information | Account cards with AML alert flags, prior filing counts | `tabII_accountInformation` |
| 3 | Part III: Entity Information | Natural Person vs Legal Entity with screening results | `tabIII_entityInformation` |
| 4 | Part IV: Policy Information | Placeholder — no upstream data | GenericPart |
| 5 | Part V: Suspicious Transactions | Transaction table with period, totals, counterparties | `tabIV_suspiciousTransactions` |
| 6 | Part VI: Reasons for Suspicion | Crime types, suspicion categories, narrative | `report.crimeTypes` / `report.suspicionCategories` / `report.narrative` |
| 7 | Part VII: Validation Summary | Placeholder — no upstream data | GenericPart |

## Report Type Routing
The viewer system routes to type-specific components based on `report.type`:
- **STR** → `STRViewer.tsx` (7-tab form, blue theme)
- **CMR** → `CMRViewer.tsx` (teal theme, ICA checkpoint data)
- **CTR** → `CTRViewer.tsx` (purple theme, PSMD/pawnbroker data)
