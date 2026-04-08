# STRO STARS

### Restricted Case Management System
STRO STARS is an enterprise-grade, downstream intelligence analysis and case management platform. It acts as the operational endpoint for analysts digesting intelligence ingested upstream by STRO SONAR. 

## Core Capabilities
* **Investigator-Centric Triage:** A streamlined, full-width ingestion stack designed for high-speed evidence assessment. Features a **Priority Bypass Registry** for critical hit detection and a **Hibernation Handshake** for auto-resolved low-risk subjects.
* **Director Oversight Workbench:** Dedicated managerial telemetry for reviewing operational efficiency and oversight of the **Approvals Queue**.
* **Stateful Analytical Registry:** Context-aware navigation system that ensures investigators never lose their place when pivoting between primary tabs and the **Case Analysis** workbench.
* **Intelligence Lifecycle Workflow:** Formally manages the transition of a raw **Task** into an active **Case** via a mandatory **Director Sign-off** pipeline.
* **STR Master Directory:** Centralized, globally searchable registry for STR, CTR, and CMR reports with real-time filtering and linked-subject identification.
* **Proactive Case Management:** Features "Manual Case Creation" triggers and "Entity Information" mapping to instantiate investigations from the Master Registry or manual subject input.
* **Bulk Intelligence Operations:** Multi-select framework enabled via a context-aware floating `BulkActionToolbar`.
* **Quantexa Integration:** Approved cases feature native, secure-routing to external Quantexa network analysis graphs for deep-link investigation.

## Architecture
The platform is built strictly utilizing React context and structural layouts devoid of heavy framework overhead.
* **Frontend:** React + Vite
* **Styling Framework:** Tailwind CSS v4 (Enterprise Clean Light Palette)
* **Storage & Evidence:** Firebase Storage Integration
* **Global Access:** `AuthContext.tsx`
* **Data Context:** `AppContext.tsx` (Hoisted persistence with Context-Aware Navigation Handshake)

## Documentation Wiki
For extensive modular documentation regarding features and layout designs, please refer to the `/docs/features/` repository:

1. [Intelligence Triage Stack](./docs/features/TriageQueue.md) - [UPDATED]
2. [Director Dashboard](./docs/features/Dashboard.md) - [UPDATED]
3. [Priority Workbench](./docs/features/PriorityWorkbench.md) - [NEW]
4. [Case Analysis & Navigation](./docs/features/CaseAnalysis.md) - [UPDATED]
5. [Master Case Directory](./docs/features/CaseDirectory.md)
6. [Approvals Queue](./docs/features/ApprovalsQueue.md) - [NEW]
7. [Hibernated Registry](./docs/features/HibernatedList.md) - [NEW]
8. [STR & CTR Master Directory](./docs/features/STRDirectory.md) - [NEW]
9. [Manual Case Creation](./docs/features/ManualCaseCreation.md)
10. [Data Architecture](./docs/features/DataArchitecture.md)
11. [Login & RBAC Paths](./docs/features/Login.md)
12. [Quantexa Integration](./docs/features/Quantexa.md)

## Deployment Run
```bash
npm install
npm run dev
# Deploy to Production
firebase deploy --only hosting
```

## Post-Industrialization Narratives
13. [Strategic Roadmap](./docs/features/OUTSTANDING_ROADMAP.md) [NEW]
14. [User Story Flow](./docs/features/USER_STORY_FLOW.md) [NEW]
