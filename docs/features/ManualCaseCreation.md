# Manual Case Creation

## Objective
The Manual Case Creation feature transforms the platform from a reactive triage system into a proactive intelligence workbench. Investigators can now instantiate investigations based on external intelligence or by clustering disparate transaction reports that have not yet triggered automated thresholds.

## Workflow
There are two primary ways to create a manual case:

### 1. Registry Bridging (STR Registry)
*   **Action**: Select multiple reports (STR, CTR, CMR) in the **STR Master Registry**.
*   **Result**: The **"Create Case from Selection"** action in the Bulk Toolbar triggers the `ManualCaseModal`.
*   **Data Aggregation**: The system automatically bridges all selected reports into the new case's intelligence dossier (`linkedSTRs`).

### 2. Proactive Instantiation (Case Directory)
*   **Action**: Click **"Create New Case"** in the Master Case Directory.
*   **Result**: Allows the investigator to define a target subject (Individual or Company) from scratch.

## Governance & Labeling
*   **Automatic Tagging**: All analyst-initiated cases are prefixed with `[MANUAL]` in the investigation title.
*   **Approval Loop**: To ensure strict governance, manually created cases are initially locked in the `PENDING_APPROVAL` status. They must be reviewed and approved by an Operations Manager before full investigation capabilities (e.g., Quantexa deep-linking) are unlocked.

## Component Architecture
*   `ManualCaseModal.tsx`: The primary interface for data entry, supporting pre-filled intelligence bundles.
*   `AppContext.tsx (createCase)`: The state engine logic responsible for generating Case IDs, mapping linked reports, and enforcing the initial approval state.
