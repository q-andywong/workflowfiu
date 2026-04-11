# Data Architecture & Context Injection

## AppContext Topology
Because FIU STR analysis platform avoids complex State Managers (e.g., Redux Toolkit) in favor of lightweight speed, absolute system bounds are enforced via React Context APIs at the root level.

## MOCK_DATA & Entity Mapping
All core configurations, risk profiles, and active subjects run centrally from `src/constants.ts` under the `MOCK_CASES` object.

This is heavily utilized:
1. `AuthContext.tsx` generates the session.
2. `AppContext.tsx` (`src/contexts/AppContext.tsx`) immediately evaluates the Auth token. Based strictly on the clearance and typography definition attached to the user, AppContext dynamically truncates `MOCK_CASES` down. 
3. Component layers (like Triage or Priority Viewer) fetch explicitly from `useApp()`, blindly assuming data bounds have been constrained at the parent envelope successfully. 

### Industrialized Multi-Entity Schema
The system has transitioned from a single-subject model to a robust N-to-N architecture:
- **`subjects: PersonProfile[]`**: Every `IntelligenceCase` (and legacy task) now carries an array of subjects. This enables investigations into complex money laundering rings or multi-director corporate vehicles.
- **Unified Operational Narrative**: Analysts now document investigation results in a case-level `findings` attribute, rather than subject-specific notes. This ensures a single cohesive story for the entire operational unit.

### Advanced Entity Profiling
The system maps two discrete variations of generic Entities inside investigations:
- **INDIVIDUAL**: Mapping natural persons explicitly to `companiesAssociated`, identifying the individual's role inside related networks.
- **COMPANY**: Structurally mapped corporational models housing relation arrays for `ubos`, `shareholders`, `directors`, and `involvedProjects`.

### Historical Intelligence Discovery
All investigations natively support historic traversal across the entire platform registry:
- **Case Relationships**: The "Cross-Entity Discovery Engine" identifies historical cases where any subject in the current case appeared previously.
- **Regulatory Attribution**: Regulatory reports (STRs, CTRs) remain associated with their source entity, ensuring clear attribution when multiple subjects are investigated in a single folder.

### Metadata & Mitigation
- **Operational Metadata**: Cases now include mandatory `title` and `description` fields to define investigating intent beyond raw subject names.
- **Context Mitigation Engine**: analysts can drop targeted categorical notes mapped against specific risk factors within a subject's profile, providing high-resolution audit trails for risk assessment.

## Quality Engineering
Future production upgrades should connect `AppContext.tsx` `useEffect` mounts directly to Kafka or live API streams rather than the `constants.ts` mock variables. The schema handles both real-time ingestion tasks and analyst-created investigations using the same standardized domain model.
