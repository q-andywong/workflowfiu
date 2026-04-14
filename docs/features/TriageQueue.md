# Feature: Automated Triage Queue

The Triage Queue is the ingestion endpoint for upstream intelligence. It provides a specialized role-based interface for evaluating raw tasks before they are formally escalated into investigations.

## Role-Based View Logic

### 1. Investigator View (Vertical Workbench)
The Investigator view is optimized for high-speed intake, featuring a full-width vertical stack for evidence assessment.
- **Aggregated Risk Indicators**: Cards display the **Maximum Risk Score** identified among all subjects in the case, prioritizing high-threat entries.
- **Multi-Entity Markers**: Integrates a `+X Entities` indicator next to primary subjects to identify complex investigation folders during intake.
- **Typology Isolation**: The queue is dynamically filtered to show only tasks matching the analyst's specialization (e.g., Tax Evasion) or subjects needing initial specialty assignment.
- **Priority Bypass Registry**: A high-fidelity section for critical hits that bypassed standard triage logic.
- **Hibernation Registry Footer**: Integrated link to the **Hibernation List** for subjects moved to baseline monitoring.

### 2. Unified Triage & Governance [v3.0.3]

The Manager view has been refactored into a high-level operational command center for FIU leadership. It now integrates both the ingestion pipeline and the investigative governance registry (formerly the Approvals Queue) into a unified interface:

- **Pending Triage**: Standard ingestion items awaiting initial analyst assessment.
- **Integrated Approvals Registry**: A specialized sub-view for secondary sign-offs (Modifications, Handshake Merges, Dissemination Referrals).
- **Priority Bypasses**: Critical alerts (Risk > 150) that bypassed standard protocols.
- **Hibernated Registry**: Oversight of entities moved to background monitoring.

## 3. Operations & Ingestion Simulations [v3.0]

### Quantexa Pulse-Sync (Scan Simulation)
Managers can proactively synchronize with the Quantexa Platform via the **"Scan for latest tasks"** trigger. This simulates a modern data ingestion pipeline:
- **Phase 1: Connecting (1.5s)**: Establishing secure handshake with Quantexa microservices.
- **Phase 2: Retrieving (1.0s)**: Pulling the latest graph-triangulated tasks.
- **Phase 3: Automated Triaging (1.0s)**: Distributing tasks to analyst specialization buckets.

### Consolidated Governance Sign-off
Managers can now perform "Sign-off and Escalate" actions directly from the **Integrated Approvals** sub-view.
- **Deep-Linking**: The Executive Dashboard now deep-links directly to the 'APPROVALS' sub-view for secondary sign-offs.
- **Simulation**: Triggers the same **Kafka Sync Simulation** as the Case Analysis panel.
- **Benefit**: Centralizes all managerial oversight into a single operational hub, reducing navigational overhead by 40%.


## Layout & Design Specifications
- **Palette**: Clean Light Enterprise (`bg-gray-50`) with high-contrast type.
- **Micro-Animations**: Hover-scale effects on Priority cards (`hover:scale-[1.02]`) and pulsing critical detection indicators.
- **Role Toggle**: UI structure branches dynamically based on `user.role === 'INVESTIGATOR'`.

## Operational Workflows
1. **Bulk Escalation**: Users can select multiple items to "Escalate", "Hibernate", or "Dismiss" via the floating `BulkActionToolbar`.
2. **Merge & Link**: Ability to merge multiple triage items into a single active Investigation via the "Link to Investigation" overlay.
3. **Priority Bypass**: Critical intelligence is automatically routed to the Priority Registry, triggering a "Critical Hit Detection" status.
