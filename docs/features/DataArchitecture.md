# Data Architecture & Context Injection

## AppContext Topology
Because FIU STR analysis platform avoids complex State Managers (e.g., Redux Toolkit) in favor of lightweight speed, absolute system bounds are enforced via React Context APIs at the root level.

## MOCK_DATA & Entity Mapping
All core configurations, risk profiles, and active subjects run centrally from `src/constants.ts` under the `MOCK_CASES` object. The base batch contains **12 tasks** (customer-1001 through customer-1012) with staggered `createdAt` dates across Feb 10 – Mar 1, 2026. An additional **2 tasks** (customer-1013, customer-1014) are served from `public/samples/NewTasksToIngest.json` for live scan ingestion.

### Historical Case Dataset (`src/constants-historical.ts`)
The platform includes **20 historical cases** (`MOCK_CASES_HISTORICAL`) that have completed the full FIU workflow lifecycle between October 2025 and March 2026. These cases provide realistic operational context for dashboard analytics, dissemination tracking, and case directory listings:

- **Distribution by Final Status:**
  - 6 cases: `CLOSED` (disseminated with terminal agency feedback)
  - 3 cases: `CLOSED` (closed at analysis without dissemination)
  - 3 cases: `DISSEMINATED` (awaiting agency feedback)
  - 3 cases: `DISMISSED` (dismissed at triage)
  - 3 cases: `HIBERNATED` (auto-routed low risk)
  - 2 cases: `CLOSED` (priority bypass route)

- **Dissemination & Agency Feedback:**
  - 11 cases have dissemination records with agency feedback
  - Agency distribution: CAD (4), MAS (3), AGC (2), FOREIGN_FIU (1), ICA (1)
  - Feedback outcomes: CONVICTION (3), ASSET_SEIZURE (2), ONGOING (1), NO_OFFENCE_FOUND (2), DISMISSED (1), awaiting (2)
  - Average feedback latency: 12-45 days

- **Report Density:**
  - ~30 skinny STR/CTR/CMR reports (no full tab data)
  - Each case carries 1-3 linked reports

- **Data Characteristics:**
  - All risk factor scores correctly aggregate to `totalScore`
  - Cases bypass `initializeCases()` auto-routing — final statuses are preserved as-is
  - Historical cases are appended to `AppContext` state without processing
  - Appear in all views: Case Directory, Dissemination tracker, Dashboard stats

This is heavily utilized:
1. `AuthContext.tsx` generates the session.
2. `AppContext.tsx` (`src/contexts/AppContext.tsx`) immediately evaluates the Auth token. Based strictly on the clearance and typology definition attached to the user, AppContext dynamically truncates `MOCK_CASES` down. Historical cases from `MOCK_CASES_HISTORICAL` are appended directly without auto-routing.
3. Component layers (like Triage or Priority Viewer) fetch explicitly from `useApp()`, blindly assuming data bounds have been constrained at the parent envelope successfully. 

### Ingestion Pipeline (`ingestCases`)
The `AppContext` exposes an `ingestCases(rawCases)` function that enables live intake of new tasks:
- Runs each raw case through `initializeCases()` for auto-routing (score <10 → HIBERNATED, >150 → PRIORITY)
- Deduplicates by case ID before merging into state
- Returns the count of newly added cases
- Consumed by the Pulse-Sync scan in `TriageQueue.tsx`, which fetches `/samples/NewTasksToIngest.json`

### Industrialized Multi-Entity Schema
The system has transitioned from a single-subject model to a robust N-to-N architecture:
- **`subjects: PersonProfile[]`**: Every `IntelligenceCase` (and legacy task) now carries an array of subjects. This enables investigations into complex money laundering rings or multi-director corporate vehicles.
- **Unified Operational Narrative**: Analysts now document investigation results in a case-level `findings` attribute, rather than subject-specific notes. This ensures a single cohesive story for the entire operational unit.

### Advanced Entity Profiling
The system maps two discrete variations of generic Entities inside investigations:
- **INDIVIDUAL**: Mapping natural persons explicitly to `companiesAssociated`, identifying the individual's role inside related networks. 10 of the 14 subjects are individuals.
- **COMPANY**: Structurally mapped corporational models housing relation arrays for `ubos`, `shareholders`, `directors`, and `involvedProjects`. 4 of the 14 subjects are companies.

### Historical Intelligence Discovery
All investigations natively support historic traversal across the entire platform registry:
- **Case Relationships**: The "Cross-Entity Discovery Engine" identifies historical cases where subjects overlapped.
- **Intelligence Attribution**: Cards now explicitly label the source of the hit, ensuring transparency in multi-subject investigations.
- **Regulatory Report Mapping**: Aggregates all linked STRs/CTRs. Clicking on any linked report immediately opens the high-fidelity `STRViewer` modal for direct context evaluation.
- **Manual Discovery Triggers**: Investigators can manually attach existing entities and regulatory reports directly via primary action buttons located in the synopsis grid.

### Metadata & Mitigation
- **Operational Metadata**: Cases now include mandatory `title` and `description` fields to define investigating intent beyond raw subject names.
- **Context Mitigation Engine**: analysts can drop targeted categorical notes mapped against specific risk factors within a subject's profile, providing high-resolution audit trails for risk assessment.

### Account Data in STR Tab II
Bank account information is embedded within each STR's `tabII_accountInformation` rather than maintained as a separate upstream data source. This reflects the FIU's operational reality: the FIU has no direct access to bank account systems. Everything the FIU knows about an account arrives through the STR filing submitted by the reporting bank. Tab II includes bank-internal account IDs (`bankInternalAccountId`), account holder names, branch district, relationship manager, bank risk ratings, AML alert flags, prior filing counts, and contact numbers — enabling FIU analysts to assess the bank's own risk posture without issuing a Request for Information (RFI).

### Upstream Scorecard Schema (`samples/MockTasksToLoad(New).json`)
Each task from the Quantexa platform arrives as a 3-part structure:
- **`_1`**: Subject scorecard — `subjectId`, `scorecardVersion`, `overallScore`, `scoreSummary[]` (score hit tuples), `relatedScores`, `relatedScoresSummary`, `alertingRunTime`
- **`_2`**: Alert and profile data — `subjectId`, `jurisdiction`, `name`, `scorecardOverallScore`, `alertingAuditDetails` (linked report IDs, alert reasons), `subjectProfile` (parsed names, DOB, address, ID)
- **`_3`**: Binary graph placeholder for network visualization

Each score hit in `scoreSummary` carries 4 enriched fields:
- **`id`**: camelCase identifier (e.g., `HighValueCashTransaction`)
- **`scoreId`**: Human-readable label (e.g., `High Value Cash Transaction`)
- **`category`**: Human-readable category (e.g., `Cash Activity`)
- **`description`**: Entity-specific narrative sentence describing the hit context

The Addition file (`samples/MockTasksToLoad(Addition).json`) contains 2 additional tasks (customer-1013 Cybercrime, customer-1014 Tax Evasion) in the same schema.

### CaseDocument Export Schema (Kafka Export)
Completed cases can be exported back to the Quantexa FIU platform via Kafka using the `CaseDocument` case class structure. Sample data is in `samples/CaseDocumentExport.json`. The schema maps:
- **`CaseDocument`**: `caseId`, `caseTitle`, `assignedAnalyst`, `status`, `quantexaInvestigationId`, `relatedStrIds[]`, `relatedCmrIds[]`, `relatedCtrIds[]`, `findings`, `subjects[]`
- **`CaseSubject`**: `caseSubjectId`, `subjectType` (Individual/Business), `roleInCase` (Subject/Related Party), with either an `Individual` or `Business` child
- **`Individual`**: `fullName`, `parsedIndividualNames[]` (Lens format), `countryOfOrigin`, `dateOfBirth`, `parsedDateOfBirth`, `identificationNumber`, `identificationCountryOfRegistration`, `identificationNumberType`
- **`Business`**: `legalName`, `parsedBusinessNames[]`, `countryOfIncorporation`, `incorporationDate`, `parsedIncorporationDate`, `businessRegistrationNumber`, `countryOfRegistration`

### Person Case Class (Upstream)
Individual customer records (7 of 10 individual subjects in the base batch) are maintained in a structured Person case class format (`samples/upstream/customer/raw/json/person.json`) following the Quantexa data model schema. The Person model provides:
- **Parsed name components**: `parsedIndividualName` with `initials`, `forename`, `familyName`
- **Date decomposition**: `parsedDateOfBirth` with `year`, `month`, `day`
- **Structured addresses**: `address[]` with parsed `blockNumber`, `streetName`, `floorNumber`, `unitNumber`, `postalCode`, `country`
- **Identity enrichment**: `countryOfBirth`, `taxResidency`, `identificationNumberType` (NRIC/PASSPORT)

The `SubjectProfileIndividual` interface in `constants.ts` mirrors this schema: `parsedName` contains `initials`, `forename`, `familyName` (no `maidenName`), and `address` contains `blockNumber`, `streetName`, `floorNumber`, `unitNumber`, `postalCode`, `country`, `parsedAddress` (no `cityName`).

Corporate entities (4 companies in the base batch) are not included in Person — they require a separate Business case class model.

## Quality Engineering
Future production upgrades should connect `AppContext.tsx` `useEffect` mounts directly to Kafka or live API streams rather than the `constants.ts` mock variables. The schema handles both real-time ingestion tasks and analyst-created investigations using the same standardized domain model.
