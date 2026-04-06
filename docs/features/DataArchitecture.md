# Data Architecture & Context Injection

## AppContext Topology
Because STRO STARS avoids complex State Managers (e.g., Redux Toolkit) in favor of lightweight speed, absolute system bounds are enforced via React Context APIs at the root level.

## MOCK_DATA
All core configurations, risk profiles, and active subjects run centrally from `src/constants.ts` under the `MOCK_CASES` object.

This is heavily utilized:
1. `AuthContext.tsx` generates the session.
2. `AppContext.tsx` (`src/contexts/AppContext.tsx`) immediately evaluates the Auth token. Based strictly on the clearance and typography definition attached to the user, AppContext dynamically truncates `MOCK_CASES` down. 
3. Component layers (like Triage or Priority Viewer) fetch explicitly from `useApp()`, blindly assuming data bounds have been constrained at the parent envelope successfully. 

Future production upgrades should connect `AppContext.tsx` `useEffect` mounts directly to Kafka or live API streams rather than the `constants.ts` mock variables.
