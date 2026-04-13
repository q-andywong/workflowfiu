# Industrial User Story: The End-to-End Investigative Lifecycle (v3.0.0)

This comprehensive journey outlines how the **FIU STR Analysis Platform** bridges the gap between raw financial intelligence and actionable law enforcement referrals through industry-standard synchronization and managerial governance.

---

## 🟢 Phase 1: Operational Inception & Platform Sync
**Persona: Operations Manager (e.g., Director Shen)**

1.  **Command Center Oversight**: The Manager logs in and lands on the **Managerial Command Center**. They observe a 4-grid executive summary:
    - **Pending Triage**: New leads from ingestion pipelines.
    - **Awaiting Sign-off**: Case escalations requiring executive review.
    - **Priority Bypasses**: Critical alerts identified by the Quantexa Risk Engine.
    - **Hibernated Registry**: Entities moved to background monitoring.
2.  **Quantexa Pulse-Sync**: To ensure the morning's latest intelligence is available, the Manager clicks **"Scan for latest tasks"**.
3.  **Simulation Feedback**: A high-fidelity progress modal plays:
    - Establishing a secure handshake with the **Quantexa Platform**.
    - Retrieving graph-triangulated tasks from the master registry.
    - Distributing tasks into analyst specialization buckets based on crime typologies.
4.  **Operational Readiness**: The sync completes, and the Manager confirms the ingestion count is up-to-date.

---

## 🔵 Phase 2: Investigative Triage & Evidence Building
**Persona: FIU Analyst (e.g., Insp. Lim)**

1.  **Specialized Intake**: The Analyst navigates to the **Triage Queue**. The system automatically filters for **'Fraud'** tasks to match their specialization.
2.  **Workbench Engagement**: The Analyst opens a lead (e.g., `IGOR DIMITROV`). They enter the **Case Analysis Workbench**.
3.  **Analytical Mitigation**:
    - The Analyst reviews the **Interactive Risk Scorecard**.
    - They mitigation the *"High Transaction Velocity"* risk indicator by recording a formal action: *"RFI sent to bank for source of wealth validation"*.
    - They click **Save Changes**. The **Kafka Sync Modal** triggers with the specific status: *"Syncing Analysis to Quantexa Platform"* follows by a **Red-Tick** success state.
    - The Analyst clicks **"Continue Analysis"** and remains in the workbench to record their final narrative.
4.  **Escalation Broadcast**:
    - Once the **Operational Narrative** is complete, the Analyst clicks **"Sign-off and Escalate"**.
    - The simulation broadcasts the `decision.event.triage` topic.
    - The Analyst clicks **"Return to Queue"**, and the task disappears from their triage list.

---

## 🟡 Phase 3: Executive Review & Case Promotion
**Persona: Operations Manager (Director Shen)**

1.  **Approvals Registry**: The Manager sees the new escalation in the **Awaiting Sign-off** tile.
2.  **High-Velocity Review**:
    - The Manager views the **Pending Approvals** list.
    - For lower-complexity tasks, they click **"Sign-off and Escalate"** directly in the table row.
    - The system plays the Kafka Sync simulation, confirming the decision has been synchronized with the platform.
3.  **Investigation Instantiation**: The subject is officially promoted to an active **Case** and assigned a unique Investigation ID (e.g., `CASE-2026-001`).

---

## 🔴 Phase 4: Full Field Investigation & Retrieval
**Persona: Lead Investigator (Insp. Lim)**

1.  **Deep-Dive Analysis**: The Investigator opens the case in the **Case Directory**.
2.  **Industrial Data Enrichment**:
    - They use the **Global Discovery Registry** to manually link related subjects identified during the deep-dive.
    - They link several high-value **STR Regulatory Reports** from the master directory to bridge disparate data points.
3.  **Intelligence Modeling & Packaging**:
    - The Investigator opens the **Dissemination Report Compiler**.
    - They instantiate **Intelligence Models** (Bar/Line charts) to visualize complex transaction patterns.
    - They click **"Finalize & Disseminate"**. The **Kafka Sync Modal** triggers (topic: `report.event.disseminate`), verifying the package is synchronized with the platform records.
    - They click **"Complete Dissemination"** to finalize the briefing package.
4.  **Administrative Disposal**:
    - Once the brief is disseminated, the Investigator clicks **"Finalize Case"**.
    - In the **Finalize Modal**, they select a disposal outcome (e.g., *Disseminate to Law Enforcement*).
    - They click **"Confirm Finalization"**.
    - The final Kafka Sync modal plays: *"Broadcasting Final Disposal to Platform"* (topic: `update.event.disposal`).
5.  **Archival Handshake**: The Investigator clicks **"Return to Queue"**. The case is transitioned out of the active directory and securely archived in the **Administrative Registry**.

---

## 🏁 Summary of Governing Logic
- **Always Synchronized**: Every decision point includes a 1s Kafka synchronization simulation to verify platform connectivity.
- **Role-Awareness**: Managers have command-level dashboards; Analysts have high-volume triage workbenches.
- **Contextual Continuity**: The system distinguishes between "Progress Saves" (Stay in Workbench) and "Status Decisions" (Return to Queue).

## 🧩 Advanced Workflow: Proactive Inception
**Persona: Lead Investigator**

1.  **Manual Discovery**: The investigator identifies a related cluster of STRs in the **STR Master Directory** or identify a missing entity in the **Global Registry**.
2.  **Cluster Inception**: They click **"Initiate Manual Case"** from the Case Directory.
3.  **Governance & Sync**: Upon clicking **"Confirm Case Creation"**, the **Kafka Pulse-Sync** simulation triggers (topic: `case.event.manual_inception`).
4.  **Instant Alignment**: Once the sync completes, the investigator clicks **"Continue to Investigation"** to begin their deep-dive analysis in the workbench with all entities pre-linked and synchronized.
