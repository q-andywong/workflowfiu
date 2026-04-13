# Feature: Dissemination Report Compiler

The Dissemination Report Compiler is a high-fidelity intelligence modeling tool designed to package investigative findings, evidentiary assets, and visual models into a standardized dissemination package for Law Enforcement Agencies (LEA).

## Key Capabilities

### 1. Intelligence Modeling (ChartComposer)
Investigators can instantiate real-time visual models of financial activity directly within the compiler.
- **Visual Types**: Bar charts (Volume), Line charts (Risk/Velocity), and Pie charts (Typology distribution).
- **Data Source**: Automatically mapped from linked STRs and transaction registries.
- **Customizable Selection**: Investigators can choose which models are critical for the final brief.

### 2. Evidentiary Asset Packaging
Enables the inclusion of specific high-value evidence from the **Evidence Locker**.
- **Contextual Selection**: Checkbox-based selection of cloud-hosted attachments (Statements, ID Verifications, etc.).
- **Automatic Metadata**: Reports include file sizes, upload timestamps, and analytical contexts.

### 3. Synchronized Dissemination (Kafka) [v3.0]
The act of final packaging is governed by the platform's industrialized synchronization layer.
- **Broadcast Node**: Triggers a 1s Kafka Sync simulation upon "Finalize & Disseminate".
- **Technical Event**: Broadcasts the `report.event.disseminate` topic to the Quantexa Platform.
- **Persistence**: Ensures that the final signed-off brief is permanent and synchronized across all ecosystem nodes.

## User Workflow
1. **Selection**: Analyst chooses which attachments and charts to include in the package.
2. **Review**: High-density preview mode to verify the visual coherence of the report.
3. **Synchronization**: Final "Sign-off" triggers the Kafka broadcast simulation.
4. **Conclusion**: Report is officially disseminated, and the record is permanently appended to the Case ID.

## Layout & Design Specifications
- **High-Contrast Dark Header**: Uses `bg-[#100628]` to indicate a formal administrative process.
- **Interactive Previews**: Charts and documents utilize hover states and transition-all animations for a premium desktop experience.
- **Backdrop Polish**: Utilizes `backdrop-blur-xl` and animated mesh gradients during synchronization.
