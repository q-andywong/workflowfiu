# Feature: Case Analysis Workbench

The Case Analysis workbench is the primary investigative workspace of the STRO STARS platform. It provides a high-density, modular interface for evaluating risk, documenting findings, and managing evidence.

## Key Capabilities

### 1. Context-Aware Navigation Handshake
The analysis workbench is integrated with a stateful navigation system that ensures investigators never lose their place.
* **Logic**: The system captures the `previousView` (e.g., Triage, Case Directory) before opening the analysis panel.
* **Return Trigger**: Closing the analysis panel automatically triggers a navigation handshake back to the original starting point, bypassing the Dashboard.

### 2. Risk Mitigation Scorecard
A real-time evaluation framework for documenting mitigation factors against identified risk indicators.
* **Layout**: Dynamic grid of risk factors with native status indicators (Verified, Mitigated, High Risk).
* **Persistence**: Every mitigation note is formally recorded against the entity's risk profile in the global context.

### 3. Evidence Locker (Firebase Cloud Storage)
Integrates direct evidentiary asset management within the investigation flow.
* **Capabilities**: Direct file upload, secure cloud URL mapping, and attachment removal.
* **Audit Trail**: Every attachment is linked to the case ID with an "Uploaded By" analyst stamp.

### 4. Direct Dissemination Interface
Formally escalate draft investigations to the review pipeline.
* **Staging Mode**: Cases remain in a "Private Draft" state (STAGING) visible only to the analyst until submitted.
* **Submission Loop**: Triggers an operational transition to "PENDING_APPROVAL" for Manager review.

## Layout & Design Specifications
- **Modal Architecture**: A full-screen backdrop-blur (`backdrop-blur-md`) modal design to focus the investigator's visual attention.
- **Header Aesthetics**: Dark-mode header (`bg-[#100628]`) with high-contrast text and pulsing status indicators.
- **Scroll Logic**: The modal features an independent `custom-scrollbar` to manage long investigation finding texts and large evidence lists.
