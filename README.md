* **Managerial Command Center Dashboard:** [v3.0.3] A unified operational oversight hub integrating Triage, Governance (Approvals), Bypasses, and Hibernated registries for real-time traffic monitoring.
* **Consolidated Governance Workflow:** [v3.0.3] Investigative sign-offs and modification requests have been successfully ported into the Triage Command Center, reducing navigational complexity.
* **Industrialized Synchronization (Kafka Simulation):** [v3.0.3] High-fidelity 1s synchronization simulations integrated across all critical gates, including Manual Inceptions, Operational Saves, and Final Disposals.
* **Quantexa Pulse-Sync Ingestion:** [v3.0] Multi-phase progress simulation for manual data ingestion scans (Establishing Link → Data Retrieval → Specialization Triage).
* **Direct Side-car Signing:** [v3.0] Rapid managerial sign-off from listing views without entering the full workbench.
* **Multi-Entity Intelligence Framework:** A robust data model standardizing investigations on N-to-N relationships between cases and subjects. Supports complex networks involving both **Individuals** and **Companies**.
* **Industrialized Case Inception:** A professional 3-step wizard for initiating investigations. Features operational metadata definition, multi-entity discovery (seeding from master lists), and operational review.
* **Investigator-Centric Triage:** A streamlined, full-width ingestion stack designed for high-speed evidence assessment. Features **Aggregated Max Risk** indicators and **Multi-Entity Indicators (+X)**.
* **Cross-Entity Discovery Engine:** Automated scanner built into the Analysis workspace that identifies historical investigations across the entire platform involving any currently selected subjects.
* **Stateful Analytical Registry:** Context-aware navigation system with an integrated **Subject-Switcher** for pivoting between entity profiles within a single investigation.
* **Unified Operational Narrative:** Consolidates scattered subject notes into a single, case-level **Findings** ledger for standardized operational reporting.
* **Bulk Intelligence Operations:** Multi-select framework enabled via a context-aware floating `BulkActionToolbar`.
* **Quantexa Integration:** Approved cases feature native, secure-routing to external Quantexa network analysis graphs for deep-link investigation.

### Restricted Case Management System
FIU STR analysis platform is an enterprise-grade, downstream intelligence analysis and case management platform. It acts as the operational endpoint for analysts digesting intelligence ingested upstream by FIU Q Platform. 

## Core Capabilities
* **Integrated Governance Hub:** Consolidated all sign-off pipelines into the Triage Command Center. 
* **Multi-Entity Intelligence Framework:** A robust data model standardizing investigations on N-to-N relationships between cases and subjects. Supports complex networks involving both **Individuals** and **Companies**.
* **Industrialized Case Inception:** A professional 3-step wizard for initiating investigations. Features operational metadata definition, multi-entity intelligence discovery (seeding from master lists), and operational review.
* **Investigator-Centric Triage:** A streamlined, full-width ingestion stack designed for high-speed evidence assessment. Features **Aggregated Max Risk** indicators and **Multi-Entity Indicators (+X)**.
* **Cross-Entity Discovery Engine:** Automated scanner built into the Analysis workspace that identifies historical investigations across the entire platform involving any currently selected subjects.
* **Stateful Analytical Registry:** Context-aware navigation system with an integrated **Subject-Switcher** for pivoting between entity profiles within a single investigation.
* **Unified Operational Narrative:** Consolidates scattered subject notes into a single, case-level **Findings** ledger for standardized operational reporting.
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
6. [Hibernated Registry](./docs/features/HibernatedList.md) - [NEW]
7. [STR & CTR Master Directory](./docs/features/STRDirectory.md) - [NEW]
8. [Manual Case Creation](./docs/features/ManualCaseCreation.md)
9. [Data Architecture](./docs/features/DataArchitecture.md)
10. [Login & RBAC Paths](./docs/features/Login.md)
11. [Quantexa Integration](./docs/features/Quantexa.md)
12. [Report Compiler & Modeling](./docs/features/ReportBuilder.md) [NEW]


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
