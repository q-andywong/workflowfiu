# Industrial User Story: The End-to-End Investigation Lifecycle

This narrative outlines the modernized investigative lifecycle on the **FIU STR Analysis Platform** (v3.0.0). It serves as a comprehensive demo script for stakeholders.

---

## 1. Operational Entry & Persona-Driven Triage
**Persona: Investigator (e.g., Insp. Lim)**

*   **Login & Ingestion**: The investigator logs in and lands on their **Investigator Dashboard**. The "Triages in Queue" metric reflects live data ingested from the central registry, filtered automatically by the investigator's assigned typology (e.g., *Money Laundering*).
*   **Intelligent Discovery**: The analyst navigates to the **Triage Queue**. They identify a high-risk lead (e.g., `TASK-2026-GEN00`) with an **Aggregated Max Risk** score of **82**. 
*   **Case Inception**: After reviewing the initial "Risk Scorecard & Investigation Findings", the analyst determines the lead warrants a formal case. They click **Escalate Lead** and then **Submit for Approval**.
*   **Governance Status**: The task's status transitions to `PENDING_APPROVAL`, locking the analyst view until a director provides sign-off.

## 2. Managerial Oversight: Case Creation
**Persona: Operations Manager (e.g., Director Shen)**

*   **Approvals Pipeline**: The manager accesses the **Approvals Queue**. They see the new request from Insp. Lim.
*   **Verification**: The manager clicks **Review Assessment** to inspect the analyst's findings inside the analytical workbench.
*   **Promotion**: Satisfied with the evidence, the manager clicks **Approve Case Creation**. 
*   **Digital Sign-Off**: The task is formally promoted into the **Case Directory** as a structured investigation (e.g., `CASE-2026-001`). The manager then uses the **Re-assign Analyst** tool to formally delegate ownership to Insp. Lim.

## 3. Analytical Deep-Dive & Multi-Entity Linking
**Persona: Investigator (Insp. Lim)**

*   **Workbench Readiness**: insp. Lim opens the promoted case from the **Case Directory**. 
*   **Entity Clustering**: To broaden the intelligence net, the analyst uses the **Search & Link Subject** tool to find and link related corporate entities (e.g., *Apex Holdings LLC*) to the primary subject. 
*   **Evidence Chain**: The analyst reviews the **Linked Regulatory Reports** (STRs/CTRs) and uses the **Evidence Locker** to upload cross-border bank statements. The system maintains a unified evidence chain across all linked entities.
*   **Intelligence Profiling**: The analyst pivots between subjects using the **Subject Switcher**, reviewing crime typologies and risk profile overrides.

## 4. Governance Finalization & Referral
**Persona: Investigator (Insp. Lim)**

*   **Operation Finalization**: With a completed intelligence package, the analyst clicks the **Finalize Investigation** button in the header.
*   **Pathway Selection**: They select **Disseminate & Refer** as the operational outcome.
*   **Executive Rationale**: The analyst selects a target agency (e.g., **CAD - Commercial Affairs Dept**) and drafts a high-level **Dissemination Rationale**.
*   **Governance Request**: Upon clicking **Finalize Operation**, the case enters the second governance gate: `PENDING_APPROVAL` (Dissemination Referral).

## 5. Director Sign-off: Intelligence Impact
**Persona: Operations Manager (Director Shen)**

*   **Impact Authorization**: The manager returns to the **Approvals Queue**. They spot the new **Dissemination Referral** badge.
*   **Executive Review**: The manager reviews the dissemination rationale and the specific agency referral details.
*   **Authorize Dissemination**: The manager clicks **Authorize Dissemination**. The case's status formally transitions to `DISSEMINATED`.

## 6. Intelligence Impact Tracking (The Feedback Loop)
**Persona: Investigator / Manager**

*   **Tracker Verification**: The case now appears in the **Dissemination Tracker**. 
*   **Operational Connectivity**: The tracker identifies the specific agency (CAD) and the date of referral.
*   **Intelligence Impact**: Months later, as feedback from Law Enforcement (LEA) arrives, the user clicks **View Intelligence** in the tracker to jump back into the workbench and record the outcome (e.g., **Asset Seizure** or **Conviction**).
*   **Closing the Loop**: This success data is aggregated into the **Global Performance Stats** (e.g., *78.4% Intelligence Utility Rate*), completing the FIU lifecycle.

---

> [!IMPORTANT]
> This workflow ensures that no intelligence leaves the FIU without executive authorization, maintaining strict audit trails and data integrity.
