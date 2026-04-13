# Feature: Case Analysis Workbench

The Case Analysis workbench is the primary investigative workspace of the FIU STR analysis platform platform. It provides a high-density, modular interface for evaluating risk, documenting findings, and managing evidence.

## Key Capabilities

### 1. Context-Aware Navigation Handshake
The analysis workbench is integrated with a stateful navigation system that ensures investigators never lose their place.
* **Logic**: The system captures the `previousView` (e.g., Triage, Case Directory) before opening the analysis panel.
* **Return Trigger**: Closing the analysis panel automatically triggers a navigation handshake back to the original starting point, bypassing the Dashboard.

### 2. Multi-Entity Intelligence Hub
The workbench is engineered for investigating complex networks within a single operational folder.
- **Subject-Switcher Infrastructure**: A dedicated entity pivot navigation allows investigators to switch between different subjects (Individuals or Companies) in real-time. Each subject maintains its own risk profile, typologies, and companies-associated map.
- **Unified Operational Findings**: While mitigation notes are subject-specific, the final investigative conclusion is consolidated at the case level in the **Findings** narrative.

### 3. Cross-Entity Discovery Engine & Integration
The platform automatically scans the entire historical registry for connections involving any subjects in the investigation.
- **Related Cases Tracker**: Identifies historical investigations where subjects overlapped.
- **Intelligence Attribution**: Cards now explicitly label the source of the hit, ensuring transparency in multi-subject investigations.
- **Regulatory Report Mapping**: Aggregates all linked STRs/CTRs. Clicking on any linked report immediately opens the high-fidelity `STRViewer` modal for direct context evaluation.
- **Manual Discovery Triggers**: Investigators can manually attach existing entities and regulatory reports directly via primary action buttons located in the synopsis grid.

### 4. Interactive Risk Mitigation & Exposure Governance
A real-time evaluation framework for documenting mitigation factors against identified risk indicators.
- **Expandable Risk Workbench**: Investigators can drill down into specific risk factors within an interactive scorecard.
- **Categorical Governance**: Offers formal drop-down selections (e.g., "RFI sent to bank") combined with a high-density narrative field for mitigation rationale.
- **Visual Audit System**: Saves immediately collapse the active panel and grant an emerald "Mitigated" badge, establishing a clear visual progression state.

### 5. Evidence Locker (Firebase Cloud Storage)
Integrates direct evidentiary asset management within the investigation flow.
- **Capabilities**: Direct file upload, secure cloud URL mapping, and attachment removal.
- **Evidence Association**: Every asset is stamped with the analytical context and Case ID.

## Layout & Design Specifications
- **Modal Architecture**: A full-screen backdrop-blur (`backdrop-blur-md`) modal design to focus the investigator's visual attention.
- **Header Aesthetics**: Dark-mode header (`bg-[#100628]`) with high-contrast text and pulsing status indicators.
- **Scroll Logic**: The modal features an independent `custom-scrollbar` to manage long investigation finding texts and large evidence lists.
