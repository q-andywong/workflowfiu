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

### 2. Director View (Managerial Intelligence)
The Director view provides high-level telemetry on operational volume and throughput.
- **Operational Summary Blocks**: Interactive tiles for **Pending Triage**, **Priority Bypasses**, and **Auto-Hibernated** registries.
- **Traffic Intelligence**: Real-time breakdown of ingestion pipelines (STRs vs CTRs) and average time-to-triage.

## Layout & Design Specifications
- **Palette**: Clean Light Enterprise (`bg-gray-50`) with high-contrast type.
- **Micro-Animations**: Hover-scale effects on Priority cards (`hover:scale-[1.02]`) and pulsing critical detection indicators.
- **Role Toggle**: UI structure branches dynamically based on `user.role === 'INVESTIGATOR'`.

## Operational Workflows
1. **Bulk Escalation**: Users can select multiple items to "Escalate", "Hibernate", or "Dismiss" via the floating `BulkActionToolbar`.
2. **Merge & Link**: Ability to merge multiple triage items into a single active Investigation via the "Link to Investigation" overlay.
3. **Priority Bypass**: Critical intelligence is automatically routed to the Priority Registry, triggering a "Critical Hit Detection" status.
