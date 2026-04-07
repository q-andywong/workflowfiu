# Data Architecture & Context Injection

## AppContext Topology
Because STRO STARS avoids complex State Managers (e.g., Redux Toolkit) in favor of lightweight speed, absolute system bounds are enforced via React Context APIs at the root level.

## MOCK_DATA & Entity Mapping
All core configurations, risk profiles, and active subjects run centrally from `src/constants.ts` under the `MOCK_CASES` object.

This is heavily utilized:
1. `AuthContext.tsx` generates the session.
2. `AppContext.tsx` (`src/contexts/AppContext.tsx`) immediately evaluates the Auth token. Based strictly on the clearance and typography definition attached to the user, AppContext dynamically truncates `MOCK_CASES` down. 
3. Component layers (like Triage or Priority Viewer) fetch explicitly from `useApp()`, blindly assuming data bounds have been constrained at the parent envelope successfully. 

### Advanced Entity Profiling
The system maps two discrete variations of generic Entities inside tasks:
- **INDIVIDUAL**: Maps natural persons mapping explicitly to `companiesAssociated`, identifying the individual's role inside related networks.
- **COMPANY**: Structurally mapped corporational models housing relation arrays for `ubos`, `shareholders`, `directors`, and `involvedProjects`.

All tasks (`TASK-xxx`) natively host historic traversal arrays (`previousCases` & `linkedSTRs`) that render interactively within the Task Assessment Workbench grid, allowing analysts to immediately reference related case materials against the profile logic.

### Context Mitigation Engine
`AppContext.tsx` natively tracks deep data manipulations across structured tasks without saving them entirely back to a database. Utilizing `saveMitigation`, analysts can drop targeted categorical notes mapped against a specific `factorId` located deep inside the `RiskScorecard` object model.

## Future Hooks
Future production upgrades should connect `AppContext.tsx` `useEffect` mounts directly to Kafka or live API streams rather than the `constants.ts` mock variables.
