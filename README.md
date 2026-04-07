# STRO STARS

### Restricted Case Management System
STRO STARS is an enterprise-grade, downstream intelligence analysis and case management platform. It acts as the operational endpoint for analysts digesting intelligence ingested upstream by STRO SONAR. 

## Core Capabilities
* **Intelligence Lifecycle Workflow:** Formally manages the transition of a raw **Task** into an active **Case** via a mandatory **Director Sign-off** pipeline.
* **Director Oversight Workbench:** Dedicated **Approvals Queue** for Managers to review investigator escalations with support for rejections, feedback notes, and risk-score analysis.
* **Hibernated Registry & Automated Triage:** Operational silo for low-risk subjects (Score < 10) featuring background monitoring and "Green" state automation.
* **STR Master Directory:** Centralized, globally searchable registry for STR, CTR, and CMR reports with real-time filtering and linked-subject identification.
* **Digital STR/CTR Ingestion:** High-fidelity digitized read-only constructor for evaluating original regulator reports (including PSMD Form NP 784) natively over the workbench.
* **Quantexa Integration:** Approved cases feature native, secure-routing to external Quantexa network analysis graphs for deep-link investigation.

## Architecture
The platform is built strictly utilizing React context and structural layouts devoid of heavy framework overhead.
* **Frontend:** React + Vite
* **Styling Framework:** Tailwind CSS v4 (Enterprise Clean Light Palette)
* **Global Access:** `AuthContext.tsx`
* **Data Context:** `AppContext.tsx` (Hoisted persistence for cross-session state survival)

## Documentation Wiki
For extensive modular documentation regarding features and state behavior, please refer to the `/docs/features/` repository:

1. [Data Architecture](./docs/features/DataArchitecture.md)
2. [Login & RBAC Paths](./docs/features/Login.md)
3. [Managerial & Director Oversight](./docs/features/Dashboard.md)
4. [Triage Queue & Rejection Loops](./docs/features/TriageQueue.md)
5. [Master Case Directory](./docs/features/CaseDirectory.md)
6. [STR & CTR Registry Architecture](./docs/features/STRViewer.md)
7. [Quantexa Integration](./docs/features/Quantexa.md)
8. [SONAR Reporting Guidelines (Singapore)](./docs/compliance/SONAR_Reporting_Guidelines.md) [NEW]

## Deployment Run
```bash
npm install
npm run dev
```
