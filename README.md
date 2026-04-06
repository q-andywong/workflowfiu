# STRO STARS

### Restricted Case Management System
STRO STARS is an enterprise-grade, downstream intelligence analysis and case management platform. It acts as the operational endpoint for analysts digesting intelligence ingested upstream by STRO SONAR. 

## Core Capabilities
* **Role-Based Access Control (RBAC):** Strict filtration matrices. Sub-tier investigators (e.g. Tax Investigators) are sandboxed to specific operational typologies, while Tier-1 Managers gain overarching intelligence visibility.
* **Digitized Ingestion Mapping:** Employs a comprehensive 15-page digitized read-only constructor for evaluating imported Suspicious Transaction Reports (STRs) dynamically over the Priority Workspace without losing data integrity.

## Architecture
The platform is built strictly utilizing React context and structural layouts devoid of heavy framework overhead.
* **Frontend:** React + Vite
* **Styling Framework:** Tailwind CSS v4 (Enterprise Clean Light Palette)
* **Global Access:** `AuthContext.tsx`
* **Data Context:** `AppContext.tsx`

## Documentation Wiki
For extensive modular documentation regarding features and state behavior, please refer to the `/docs/features/` repository:

1. [Data Architecture](./docs/features/DataArchitecture.md)
2. [Login & RBAC Paths](./docs/features/Login.md)
3. [Managerial Dashboard](./docs/features/Dashboard.md)
4. [Triage Queue Workflow](./docs/features/TriageQueue.md)
5. [STR Viewer Architecture](./docs/features/STRViewer.md)

## Deployment Run
```bash
npm install
npm run dev
```
