# Quantexa Integration

## Objective
Approved cases with a status of `ANALYSIS` or `PRIORITY` feature a deep-link integration to the **Quantexa** platform for advanced network visualization and entity resolution.

## Branding & UX
* **Official Iconography:** The integration button's SVG has been custom-reconstructed to match the official Quantexa brand guidelines, featuring the signature dark-navy/teal primary palette.
* **Call to Action:** Located in the bottom "Case Actions" panel of the **Analysis Workspace**.

## Functional Logic
* **Dynamic Routing:** Each case maps its internal `TaskID` or `CaseID` directly to a corresponding investigation link.
* **Target Environment:** `https://demo.quantexa.com/banking/share/investigation?id={CASE_ID}`.
* **Secure Transit:** The link is rendered as a clean, target-blank button ensuring the analyst maintains their session in FIU STR analysis platform while pivoting to the topological graph.

## State Constraints
The **Open in Quantexa** capability is strictly locked until a Manager has authorized the Case creation. If an analyst attempts to view a raw `TRIAGE` or `PENDING_APPROVAL` entity, the button is hidden or replaced by the "Escalation Status" panel.
