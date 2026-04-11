# FIU Case Management - End-to-End (E2E) Functionality Verification

This checklist serves as your formal verification script for User Acceptance Testing (UAT). Work through these scenarios to functionally validate that all UI layers, data integrations, and state boundaries hold up securely.

---

## 🔍 Module A: The Investigator Desktop 
*(Simulated User: Sgt. Wong or Standard Analyst)*

### Scenario 1: Interacting with the Automated Triage Engine
1. At the login portal, click **"Login as Investigator"** and definitively select your formally assigned **Operational Domain** (e.g., *Money Laundering* or *Cybercrime*).
2. **Verification:** You will automatically land on your unified **Investigator Dashboard**. Note your customized 'Triage Queue' metric card count visually (this count is dynamically constrained by your domain selection).
3. Navigate to the **Triage Queue** via the sidebar navigation.
4. **Verify Data Logic:** Scan the prioritized lists. Verify that:
   - The aggregate number of available Mock Tasks perfectly matches the metric displayed on your dashboard.
   - Tasks 0 to 9 showcase Individuals (e.g., *Tan Wei Ming*).
   - Tasks 10 to 14 showcase Company profiles.
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

## 🏛 Module B: The Managerial Command Center 
*(Simulated User: Insp. Lim or Command Authority)*

### Scenario 4: The Approvals Queue Bootup
1. Leverage the Top-Right nav Header to swap contexts from Investigator over to `MANAGER` mode. 
2. Enter the **Approvals Queue**.
3. **Verification:** The screen MUST boot cleanly without returning a React undefined crash (This validates our deep `.subjects` null-safety patches).
4. Verify your newly escalated test case (e.g., *Operation E2E Phoenix*) is parked cleanly in the directory, reflecting its correct sum Risk Score and assigned Target Entities.

### Scenario 5: Formal Intelligence Push-Back (Rejection Loop)
1. On your designated test case in the Approvals Queue, click **"REJECT"**.
2. **Verification:** The nested feedback modal appears. Key in a systemic rationale (e.g., "Insufficient nexus attribution. Request further screening.").
3. Execute **Confirm Reject**.
4. **Verification:** Swap back to your **Investigator** profile. Navigate back to the raw **Triage Queue** and locate the file. Upon clicking it, verify that a red Managerial Rejection rationale banner is loudly displayed to the Analyst!

### Scenario 6: Hard Sign-Off & Escrow Translation
1. As the Investigator, re-escalate the task to the Manager. 
2. As the Manager, locate the returned module inside the **Approvals Queue** and click **"SIGN-OFF & ESCALATE"**.
3. **Verification:** The item has been completely scrubbed from Approvals. 

---

## 🌐 Module C: Intelligence Operational Directories

### Scenario 7: Verifying Active Operations Status
1. Open the primary **Case Directory**.
2. **Verification:** "Operation E2E Phoenix" should now securely manifest inside the active registry as `ANALYSIS` or `PRIORITY` mode (depending on if its score > 150). It should boast fully operable tags indicating its mapped crime types.
3. Utilize the textual search bar and type in elements of your entity's name. Check that multi-entity traversal highlights the correct container.

### Scenario 8: STR / Dissemination Post-Processing
1. Open the **STR Directory** tab. 
2. **Verification:** Expand the Suspicious Transaction Reports registry to ensure global mapping connects correctly to Target cases. Use the "Link to Case" capability to dynamically wire an STR into a current operation.
3. Open the **Dissemination & Feedback** tab.
4. **Verification:** Check that legacy structure anomalies do not crash this page (Validating our `c.subjects[0]` patching). Review the Active & Archived visual trackers. Check that dynamically bound metric cards function nicely (e.g., Intelligence Utility Rate).

---

### End Test Matrix
If all 8 steps traverse cleanly, the underlying React contextual arrays, UI component logic bounds, and global orchestration rules are functionally validated for deployment.
