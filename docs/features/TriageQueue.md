# Feature: Automated Triage Queue

The Triage Queue is the ingestion endpoint for upstream intelligence. It provides a specialized role-based interface for evaluating raw tasks before they are formally escalated into investigations.

## Role-Based View Logic

### 1. Investigator View (Vertical Workbench)
The Investigator view is optimized for high-speed intake, removing managerial "noise" like statistics to maximize screen real estate.
* **Layout**: Single-column vertical stack.
* **Core Components**:
    - **Ingestion Queue**: Full-width list of pending items sorted by risk score.
    - **Priority Bypass Registry**: A high-fidelity section for critical hits (Risk > 150) that bypassed the triage queue.
    - **Hibernation Registry Footer**: A summary card showing auto-resolved low-risk counts with a pivot link to baseline monitoring.

### 2. Director View (Managerial Oversight)
The Director view focuses on operational volume and triage efficiency.
* **Layout**: Two-column layout with fixed sidebar telemetry.
* **Core Components**:
    - **Triage Statistics**: Real-time breakdown of pending intake, average time-to-triage, and risk distribution charts.
    - **Priority Alerts**: Integrated sidebar notification for items that bypassed the queue.

## Layout & Design Specifications
- **Palette**: Clean Light Enterprise (`bg-gray-50`) with high-contrast type.
- **Micro-Animations**: Hover-scale effects on Priority cards (`hover:scale-[1.02]`) and pulsing critical detection indicators.
- **Role Toggle**: UI structure branches dynamically based on `user.role === 'INVESTIGATOR'`.

## Operational Workflows
1. **Bulk Escalation**: Users can select multiple items to "Escalate", "Hibernate", or "Dismiss" via the floating `BulkActionToolbar`.
2. **Merge & Link**: Ability to merge multiple triage items into a single active Investigation via the "Link to Investigation" overlay.
3. **Priority Bypass**: Critical intelligence is automatically routed to the Priority Registry, triggering a "Critical Hit Detection" status.
