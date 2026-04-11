# Manual Case Creation

## Objective
The Manual Case Creation feature transforms the platform from a reactive triage system into a proactive intelligence workbench. Investigators can now instantiate investigations based on external intelligence or by clustering disparate transaction reports that have not yet triggered automated thresholds.

## Industrialized Case Inception Wizard
The platform features a professional, 3-step wizard for initiating manual investigations, moving beyond simple entity creation into a structured intelligence inception process.

### Step 1: Operational Intent (Metadata)
- **Investigation Title**: Define the operational name (e.g., "Operation Project Shadow").
- **Case Description**: Provide high-level context regarding the investigation's objectives and initial intelligence triggers.

### Step 2: Intelligence Discovery (Entities)
This step focuses on seeding the case folder with relevant subjects:
- **Registry Search**: Real-time searching across the **Global Master Registry** (MOCK_ENTITIES) and historical investigations.
- **Entity Identification**: Surface existing risk profiles, nationality, and known typologies.
- **Manual Seeding**: Ability to create and link entirely new entities (Natural Persons or Corporates) directly into the inception flow.
- **Multi-Entity Aggregation**: Link N-number of subjects to a single investigation folder in one operation.

### Step 3: Operational Review (Verification)
- **Consolidated Summary**: Review the aggregated subject list and operational metadata.
- **Validation**: Ensure all required fields (typology, ID numbers) are populated before operational inception.

## Governance & Lifecycle
- **Initial State**: All manually initiated cases are created in the `STAGING` or `PENDING_APPROVAL` status.
- **Managerial Sign-off**: Cases remain locked for deep-analysis features (e.g., external network exporting) until an Operations Manager formally approves the inception.
- **Automatic Multi-Entity Badge**: The system automatically adds a `+X Entities` badge to these cases in all triage lists to signify complex investigations.

## Component Infrastructure
- `ManualCaseModal.tsx`: The wizard-based React interface managing step transitions and state local to the inception flow.
- `AppContext.tsx (createCase)`: The core logic that persists the multi-entity bundle, generates the Case ID, and broadcasts the new investigation to the global registry.
