# FIU Case Management - End-to-End (E2E) Functionality Verification

This checklist serves as your formal verification script for User Acceptance Testing (UAT). Work through these scenarios to functionally validate that all UI layers, data integrations, and state boundaries hold up securely.

---

## Module A: The Investigator Desktop 
*(Simulated User: Insp. Lim or Standard Analyst)*

### Scenario 1: Interacting with the Automated Triage Engine
1. At the login portal, click **"Login as Investigator"** and definitively select your formally assigned **Operational Domain** (e.g., *Money Laundering*, *Sanctions Evasion*, *Terrorism Financing*, *Cybercrime*, *Tax Evasion*, or *Fraud*).
2. **Verification:** You will automatically land on your unified **Investigator Dashboard** with 5 clickable stat cards (Triage Queue, Awaiting Approval, Active Cases, Disseminated, Closed Cases). Note your customized 'Triage Queue' metric card count visually (this count is dynamically constrained by your domain selection). Click each stat card to verify navigation to the correct view.
3. Navigate to the **Triage Queue** via the sidebar navigation.
4. **Verify Data Logic:** Scan the prioritized lists. Verify that:
   - The aggregate number of available Tasks matches the metric displayed on your dashboard.
   - The base batch contains **12 tasks** (TASK-2026-MCB-1001 through 1012). After a scan, up to **14 tasks** are visible.
   - Tasks display a mix of Individual and Company profiles across the batch.
   - The tasks display **multiple threat typologies**, but at least ONE matches your domain.
   - The quantitative **"Risk Score"** metric on the cards accurately matches the arithmetic sum of the internal factors.
5. Click into any `TASK` item to open the **Case Analysis Workbench**.
   - **Verification:** Ensure the component cleanly mounts without crashing.

### Scenario 2: Intelligence Curation & Evidence Uploading
1. Inside the **Workbench**, interact with the textual findings area. Add customized text mapping your rationale. 
   - **Verification:** Verify the green 'autosaving' beacon pulses at the bottom boundary, confirming the `saveFindings` loop is triggering.
2. Scroll to the **Evidence Locker** and click "Upload Document". Attach a dummy PDF or JPEG image.
   - **Verification:** Ensure the Firebase integration succeeds and the file properly pins to the case index.
3. **Draft Mode Context:** If inspecting a manually generated case (STG- prefix), verify that the "Draft Intelligence Mode" warning guardrail correctly appears.

### Scenario 3: Formal Escalation & The Interception Window
1. On your open task, locate the primary organizational action selector block. Select **"Escalate to Case"**.
2. Click **"Confirm Action"**.
3. **Verification:** Ensure the brand new interception modal pops up (**"Configure Case Name"**). 
4. Override the systemic task label and punch in a new Intelligence Operation identifier (e.g., "Operation E2E Phoenix").
5. Execute the **Confirm Escalation** action.
   - **Verification:** Observe the workbench hard-lock with a formal banner: "Submitted for Managerial Review".

---

## Module B: The Managerial Command Center 
*(Simulated User: Director Shen or Command Authority)*

### Scenario 4: Pulse-Sync Scan & Live Ingestion
1. Leverage the Top-Right nav Header to swap contexts from Investigator over to `MANAGER` mode.
2. Navigate to the **Triage Queue** (Manager's Command Center view).
3. Click **"Scan for latest tasks"**.
4. **Verification:** The progress modal plays through 3 phases (Connecting → Retrieving → Triaging).
5. **Verification:** On completion, the **"New Items Discovered"** panel shows counts for newly ingested tasks/STRs/CMRs/CTRs.
6. **Verification:** Re-clicking the scan shows **"No new tasks found"** (deduplication by case ID is working).
7. **Verification:** The 2 new tasks (Chen Hao Yang — Cybercrime, Margaret Tan Siew Bee — Tax Evasion) appear in the Pending Triage list.

### Scenario 5: The Approvals Queue Bootup
1. Enter the **Approvals** sub-view within the Triage Command Center.
2. **Verification:** The screen MUST boot cleanly without returning a React undefined crash (This validates our deep `.subjects` null-safety patches).
3. Verify your newly escalated test case (e.g., *Operation E2E Phoenix*) is parked cleanly in the directory, reflecting its correct sum Risk Score and assigned Target Entities.

### Scenario 6: Formal Intelligence Push-Back (Rejection Loop)
1. On your designated test case in the Approvals Queue, click **"REJECT"**.
2. **Verification:** The nested feedback modal appears. Key in a systemic rationale (e.g., "Insufficient nexus attribution. Request further screening.").
3. Execute **Confirm Reject**.
4. **Verification:** Swap back to your **Investigator** profile. Navigate back to the raw **Triage Queue** and locate the file. Upon clicking it, verify that a red Managerial Rejection rationale banner is loudly displayed to the Analyst!

### Scenario 7: Hard Sign-Off & Escrow Translation
1. As the Investigator, re-escalate the task to the Manager. 
2. As the Manager, locate the returned module inside the **Approvals Queue** and click **"SIGN-OFF & ESCALATE"**.
3. **Verification:** The item has been completely scrubbed from Approvals. 

---

## Module C: Intelligence Operational Directories

### Scenario 8: Verifying Active Operations Status
1. Open the primary **Case Directory**.
2. **Verification:** "Operation E2E Phoenix" should now securely manifest inside the active registry as `ANALYSIS` or `PRIORITY` mode (depending on if its score > 150). Both statuses display the "Finalize Case" button when findings are present. It should boast fully operable tags indicating its mapped crime types.
3. **Verification:** The directory uses the standardized 3-line card format (icon + entity name, case ID + report count + analyst, status + typology badges).
4. Utilize the textual search bar and type in elements of your entity's name. Check that multi-entity traversal highlights the correct container.

### Scenario 9: STR / Dissemination Post-Processing
1. Open the **STR Directory** tab. 
2. **Verification:** Expand the Suspicious Transaction Reports registry to ensure global mapping connects correctly to Target cases. Use the "Link to Case" capability to dynamically wire an STR into a current operation.
3. Open the **Dissemination & Feedback** tab.
4. **Verification:** The Dissemination listing uses the standardized 3-line card format (subject name + agency/date/feedback status, case ID + report count + analyst, status badge + typology tags). Verify that "Awaiting Feedback" badges display in amber with a pulse animation. Review the Active & Archived visual trackers. Check that dynamically bound metric cards function nicely (e.g., Intelligence Utility Rate).

### Scenario 9b: Agency Feedback & Case Closure Flow
1. Finalize an ANALYSIS or PRIORITY case with the **"Disseminate Intelligence"** outcome and target agency.
2. **Verification:** The case moves to `DISSEMINATED` status and appears in the Dissemination tracker with the correct agency and date.
3. Open the disseminated case in the Analysis Workbench.
4. **Verification:** The header shows **"Record Agency Feedback"** and no "Close Case" button yet.
5. Click **"Record Agency Feedback"** and select **"Ongoing Investigation"**. Submit.
6. **Verification:** The case remains in `DISSEMINATED` status. "Close Case" button does NOT appear (ONGOING is non-terminal).
7. Record feedback again with a terminal outcome (e.g., **"Conviction"**).
8. **Verification:** The **"Close Case"** button now appears. Click it to close the case.

### Scenario 10: Dynamic Dashboard Verification
1. Return to the **Manager Dashboard**.
2. **Verification:** The 7D Traffic Chart shows 3 lines (STR, CTR, CMR) with non-zero values computed from actual case data.
3. **Verification:** The Typology Distribution pie chart reflects the actual crime typology mix across cases.
4. Switch to **Investigator** mode.
5. **Verification:** The Investigator Dashboard shows 5 clickable stat cards (Triage Queue, Awaiting Approval, Active Cases, Disseminated, Closed Cases) in a 5-column grid. Click each card to verify it navigates to the correct view. The resolution trend chart shows data computed from case statistics.

---

## Module D: Historical Data & Analytics Verification

### Scenario 11: Historical Case Dataset Integrity
1. Navigate to the **Case Directory**.
2. **Verification:** The directory should contain 32+ cases total (12 base tasks + 2 scan tasks + 20 historical cases, minus any actively filtered).
3. **Verification:** Historical cases display proper completion dates between Oct 2025 – Mar 2026.
4. **Verification:** Filter or scroll to find cases with `CLOSED`, `DISMISSED`, and `DISSEMINATED` statuses from historical batch.
5. Open a historical `CLOSED` case with dissemination records (e.g., a case with CONVICTION feedback).
6. **Verification:** The "Dissemination & Agency Feedback" section appears below the Evidence Locker.
7. **Verification:** The dissemination card shows: agency badge, dissemination date, status badge (with outcome), intelligence summary, agency response narrative, and official reference number.

### Scenario 12: Dissemination Analytics Verification
1. Navigate to the **Dissemination & Feedback** page.
2. **Verification:** Stats cards display computed values from actual data:
   - **Feedback Response Rate**: Should show percentage based on cases with feedback vs total disseminated
   - **Actionable Outcomes**: Count of CONVICTION + ASSET_SEIZURE outcomes
   - **Avg Feedback Latency**: Average days between dissemination and feedback receipt
   - **Pending LEA Responses**: Count of cases with "Awaiting Feedback" status
3. **Verification:** "Active Items" tab shows `DISSEMINATED` cases (including historical cases awaiting feedback).
4. **Verification:** "Closed Items" tab shows `CLOSED` and `DISMISSED` cases with dissemination records.
5. **Verification:** Cards display agency badges (CAD, MAS, AGC, CPIB, ICA, FOREIGN_FIU) correctly.
6. **Verification:** "Awaiting Feedback" badges display in amber with pulse animation.

### Scenario 13: Dashboard Historical Integration
1. As **Manager**, view the Dashboard.
2. **Verification:** The 7D Traffic Chart and Typology Distribution pie chart include historical data in their calculations.
3. As **Investigator**, view the Dashboard.
4. **Verification:** The 5 stat cards reflect accurate counts including historical cases:
   - "Closed Cases" count should include historical CLOSED cases
   - "Disseminated" count should include historical DISSEMINATED cases
5. **Verification:** Click each stat card to navigate to the corresponding view and confirm historical cases appear.

---

### End Test Matrix
If all 13 scenarios traverse cleanly, the underlying React contextual arrays, UI component logic bounds, historical data integration, and global orchestration rules are functionally validated for deployment.
