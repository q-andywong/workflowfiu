# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FIU (Financial Intelligence Unit) Workflow — an enterprise-grade STR (Suspicious Transaction Report) analysis and case management platform. It acts as the downstream intelligence analysis endpoint for analysts digesting intelligence ingested upstream by the FIU Q Platform (Quantexa).

## Commands

```bash
npm install      # Install dependencies
npm run dev      # Start Vite dev server (localhost:5173)
npm run build    # Production build → dist/
npm run preview  # Preview production build locally
firebase deploy --only hosting  # Deploy to Firebase Hosting (serves from dist/)
```

No test runner, linter, or formatter is configured. There is no `tsconfig.json` — TypeScript is configured through Vite.

## Environment

Firebase config is loaded from `VITE_FIREBASE_*` env vars in `.env.local` (see `src/lib/firebase.ts`). Only Firebase Storage is used (no Firestore, no Auth). Hosting serves from `dist/` with SPA rewrites.

## Architecture

**Stack:** React 18 + TypeScript + Vite + Tailwind CSS v4 + Firebase (Storage only). No router library — navigation is state-driven.

### State & Navigation

- **No React Router.** Navigation uses a `view` string in `AppContext` (`DASHBOARD`, `TRIAGE`, `ANALYSIS`, etc.). The `Header` component drives view switches. `CaseAnalysis` renders as a modal overlay on top of the current view.
- **`AuthContext`** (`src/contexts/AuthContext.tsx`) — Simple role-based login (no real auth). Two roles: `MANAGER` (Director Shen) and `INVESTIGATOR` (Insp. Lim). Investigators also have a crime typology specialization.
- **`AppContext`** (`src/contexts/AppContext.tsx`) — Central data store holding all cases, selected case, view state, and every mutation function. All case data is initialized from mock constants in `src/constants.ts` (no backend database). Firebase is only used for file attachment upload/download via Storage.
- **Provider order:** `AuthProvider` wraps `AppProvider` wraps `RootRouter` (see `App.tsx`). Case mutations survive role switches within the same browser session.

### Data Model (src/types.ts)

- `IntelligenceCase` — core entity. Has N subjects (`PersonProfile[]`) and N reports (`SuspiciousTransactionReport[]`). N-to-N relationship between cases and subjects.
- `PersonProfile` — can be `INDIVIDUAL` or `COMPANY`. Individuals map to `companiesAssociated`; companies carry `ubos`, `shareholders`, `directors`, `involvedProjects`. Each profile contains a `Scorecard` with `RiskFactor[]`.
- `SuspiciousTransactionReport` — covers types `STR`, `CTR`, `CMR`. Carries `crimeTypes` and `suspicionCategories` keyed to the code tables `STR_CRIME_TYPES` and `STR_SUSPICION_CATEGORIES` in constants. STR `tabII_accountInformation` includes enriched bank account data — the FIU receives account information only through the STR filing, not as a separate data feed.
- Case statuses: `TRIAGE` → `PENDING_APPROVAL` → `ANALYSIS` → `DISSEMINATED` → `CLOSED`, with branches to `PRIORITY`, `HIBERNATED`, `DISMISSED`, `PENDING_DELETION`, `STAGING`.
- Case-level `findings` field holds the unified operational narrative (not per-subject).

### Mock Data (src/constants.ts)

All data is mock — there is no backend database. `MOCK_CASES`, `MOCK_STRS`, and `MOCK_ENTITIES` are the three seed datasets, initialized into `AppContext` on load. `AppContext.initializeCases()` auto-routes cases by score: <10 → HIBERNATED, >150 → PRIORITY. Analyst assignment is randomized for non-triage/non-hibernated cases. The flagship demo case is **CASE-2026-001 "Operation Highland"** (3 subjects, PRIORITY status, full lifecycle with disseminations and feedback loops).

### Upstream Mock Data (samples/upstream/)

Raw data simulating multi-institution intake from 5 Singapore banks, ICA checkpoints (CMR filers), and non-bank institutions (CTR filers). See `samples/upstream/README.md` for full documentation.

### Risk Scoring (src/utils/scoringEngine.ts)

Score thresholds drive automatic routing: <10 → `HIBERNATED`, >150 → `PRIORITY`. Risk levels: `GREEN LOW` (<50), `AMBER 4` (50-74), `AMBER 1` (75-99), `RED BRAVO HIGH` (100+).

### User Story Lifecycle

The platform demonstrates a 4-phase investigative lifecycle (see `docs/features/USER_STORY_FLOW.md`):

1. **Inception & Sync** (Manager) — Manager lands on Command Center, triggers Quantexa Pulse-Sync scan to ingest latest tasks.
2. **Triage & Evidence Building** (Investigator) — Analyst reviews leads filtered by their crime typology specialization, mitigates risk factors, records narrative, escalates via "Sign-off and Escalate".
3. **Executive Review** (Manager) — Manager approves/rejects escalations from the Approvals registry. Approved leads become formal Cases with investigation IDs.
4. **Investigation & Dissemination** (Investigator) — Deep-dive analysis, entity linking, STR linking, report compilation via Dissemination Report Compiler, and final case disposal.

Every critical state transition triggers a simulated **Kafka Pulse-Sync** broadcast (1s simulation) for audit transparency. Topics: `case.event.manual_inception`, `update.event.narrative`, `decision.event.triage`, `report.event.disseminate`, `update.event.disposal`.

### RBAC & Role-Aware Behavior

- **MANAGER** (Director Shen) — sees the Managerial Command Center dashboard (4-grid: Pending Triage, Awaiting Sign-off, Priority Bypasses, Hibernated Registry). Sole authority to approve/reject case escalations.
- **INVESTIGATOR** (Insp. Lim) — must declare a crime typology at login (e.g., "Fraud", "Tax Evasion"). Default landing view is TRIAGE (not Dashboard). `AppContext` filters cases by typology. Can escalate but not approve.

### Key Pages (src/pages/)

| Page | Purpose |
|------|---------|
| `Dashboard` | Role-aware: renders `ManagerDashboard` or `InvestigatorDashboard` |
| `TriageQueue` | Tabbed command center with sub-views: Summary, Triage, Priority, Hibernated, Approvals |
| `CaseAnalysis` | Full-screen modal overlay for deep investigation of a selected case |
| `CaseDirectory` | Master listing of all cases |
| `STRDirectory` | Master listing of all STRs/CTRs/CMRs |
| `Dissemination` | Outbound intelligence dissemination to agencies (CAD, MAS, ICA, AGC) |

### Key Components (src/components/)

- `Header` — Top nav bar with role-aware menu items
- `ManualCaseModal` — 3-step wizard for case inception
- `BulkActionToolbar` — Floating toolbar for multi-select operations
- `STRViewer`/`CTRViewer`/`CMRViewer` — Report detail viewers
- `Scorecard`/`MitigationScorecard` — Risk scoring display and mitigation workflows
- `ReportBuilder`/`ChartComposer` — Analytics and reporting tools

### Styling

Tailwind CSS v4 integrated via `@tailwindcss/vite` plugin (no `tailwind.config.js` — v4 uses CSS-based config). Enterprise clean light palette with Inter font. Styles entry point: `src/styles/index.css`. Utility libraries `clsx` and `tailwind-merge` are available for conditional class composition. Icons from `lucide-react`. Charts via `recharts`.
