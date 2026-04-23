# Mock Data Narrative — FIU Investigative Workflow Walkthrough
> Batch Run: 2026-03-03 · FIU Multi-Institution Intake · 12 cases from 5 reporting institutions

---

## FIU Intelligence Intake Model

The FIU (Financial Intelligence Unit) is the central government body that **collects regulatory reports from all regulated financial institutions** in Singapore. Unlike a single bank's compliance department, the FIU sees the full picture — STRs from different banks, CMRs from immigration checkpoints, and CTRs from precious metals dealers and pawnbrokers — and can cross-reference intelligence that no single institution could produce alone.

### Reporting Institutions in This Batch

**Banks (STR filers):**

| Code | Institution | STR Filed | Case |
|------|-----------|-----------|------|
| MCB | Meridian Capital Bank Pte Ltd | STR-2026-MCB-1001 | Ahmad Bin Sulaiman |
| SFG | Sentosa Financial Group Pte Ltd | STR-2026-SFG-1002 | Natalia Petrova |
| PTB | Pacific Trade Bank Pte Ltd | STR-2026-PTB-1003 | Dragon Gate Pte Limited |
| SFG | Sentosa Financial Group Pte Ltd | STR-2026-SFG-1004 | Lee Wei Jian |
| PTB | Pacific Trade Bank Pte Ltd | STR-2026-PTB-1005 | Synergy Asia Trading Pte Ltd |
| MCB | Meridian Capital Bank Pte Ltd | STR-2026-MCB-1006 | Rajan Krishnamurthy |
| CCB | Changi Commercial Bank Pte Ltd | STR-2026-CCB-1007 | PT Global Trade Solutions |
| RBC | Raffles Banking Corporation Pte Ltd | STR-2026-RBC-1008 | Tan Mei Ling |
| MCB | Meridian Capital Bank Pte Ltd | STR-2026-MCB-1009 | Ong Bee Lian |
| SFG | Sentosa Financial Group Pte Ltd | STR-2026-SFG-1010 | Sunrise Wellness Pte Ltd |
| CCB | Changi Commercial Bank Pte Ltd | STR-2026-CCB-1011 | Viktor Lazarev |
| PTB | Pacific Trade Bank Pte Ltd | STR-2026-PTB-1012 | Golden Phoenix International Ltd |

**ICA Checkpoints (CMR filers):**

| Checkpoint | CMR Filed | Declarant | Case |
|------------|-----------|-----------|------|
| ICA Woodlands | CMR-2026-0101 | Ahmad Bin Sulaiman | 1001 |
| ICA Changi | CMR-2026-0102 | Natalia Petrova | 1002 |
| ICA Changi | CMR-2026-0103 | Chen Jian Wei | 1003 |
| ICA Changi | CMR-2026-0107 | Kim Sung Jin | 1007 |
| ICA Changi | CMR-2026-0111 | Viktor Lazarev | 1011 |
| ICA Changi | CMR-2026-0112 | Zaw Min Tun | 1012 |

**Non-Bank Institutions (CTR filers):**

| Institution | Type | CTR Filed | Case |
|-------------|------|-----------|------|
| Meridian Precious Assets Pte Ltd | PSMD — Precious Metals Dealer | CTR-2026-0105 | 1005 |
| Golden Link Pawnbrokers Pte Ltd | Pawnbroker | CTR-2026-0108 | 1008 |

---

## How the Flow Works

Every case follows the same chain — but the reports can originate from **different institutions** and are correlated by the FIU's Quantexa platform:

```
Multiple Banks (MCB, SFG, PTB, CCB, RBC)
  └── file STRs to STRO ──────────────────────────┐
                                                    │
ICA Checkpoints (Woodlands, Changi)                 │
  └── file CMRs (cross-border cash declarations) ──┤
                                                    ▼
PSMDs & Pawnbrokers                          FIU Quantexa Platform
  └── file CTRs (cash transactions) ───────► (scoring, correlation,
                                               network analysis)
                                                    │
                                                    ▼
                                              Task (_1 + _2 + _3)
                                              ├── _1: Scorecard
                                              ├── _2: Metadata + linkedReportIds
                                              └── _3: Graph
                                                    │
                                                    ▼
                                              FIU Workflow App
                                              (triage, investigation,
                                               dissemination)
```

The FIU's unique value is **cross-institutional intelligence fusion**: linking a bank's STR with an ICA checkpoint CMR or a pawnbroker's CTR to build a picture no single institution could see.

### What the FIU Receives in Each STR

Each bank's STR filing includes enriched account data in `tabII_accountInformation` — this is the **only source** of account information available to the FIU. The FIU does not have direct access to bank account systems. Tab II includes: account numbers, holder names, branch district, relationship manager, bank risk rating, AML alert flags, prior filing count, and contact numbers. This enriched Tab II enables the FIU to assess the bank's own risk posture on the account without issuing an RFI.

---

## Case 1 — Ahmad Bin Sulaiman
**customer-1001 · Score 45.0 · Structuring / Smurfing**
**Reporting Bank: Meridian Capital Bank (MCB)**

### The Story
Ahmad is a management executive who has been a customer of MCB since 2019. Over 6 months, the AML engine notices something subtle but systematic: **29 cash deposits, every single one below SGD 10,000**. The biggest is SGD 9,900. Classic structuring — deliberate splitting to fly under the CDD radar.

### Scores That Fired (`_1.subjectScorecard.scoreSummary`)
| Score | What it detected | Contribution |
|-------|-----------------|:---:|
| `HighValueCashTransaction` | Total cash deposits SGD 303,800 across 31 transactions | 7.0 |
| `RapidMovementOfFundsCustomer` | Average holding period 18.4 hours — cash deposited and moved rapidly | 6.0 |
| `StructuringRelationship` | Deposit pattern below threshold across multiple dates (window ratio 0.82) | 5.0 |
| `UnusualTransactionPattern` | Deposit amounts calibrated just below SGD 10,000 threshold | 5.0 |
| `CustomerHasTransactionWithDifferentJurisdictions` | SG → MY → ID cross-border flow across 3 jurisdictions | 5.0 |
| `CustomerFromHighRiskCountry` | Bordering jurisdiction risk — Malaysia nexus | 5.0 |
| `GeographicRiskCountry` | Cross-border link to Malaysia | 4.0 |
| `RoundAmountsCustomer` | High proportion of round-number deposits (76% ratio, 24 transactions) | 4.0 |
| `ThirdPartyTransactions` | Consolidation outflow to unrelated Malaysian real estate entity | 4.0 |

### Alert Trigger (`_2.alertingAuditDetails`)
> *"No historical scorecard raised an alert including `StructuringRelationship` — first-time flag triggers triage."*

### Linked Reports
- **STR-2026-MCB-1001** (filed by MCB) — 13 transactions, SGD 303,800 total. Consolidation event: single FAST outflow of SGD 285,000 to Malaysian real estate entity (Mutiara Hartanah Sdn Bhd) on 03/03/2026 triggers STR.
- **CMR-2026-0101** (filed at ICA Woodlands) — Ahmad declared SGD 49,000 + MYR 15,000 (equiv SGD 53,500) carrying cash from Malaysia on 03/12/2025. The CMR proves the cash was physically transported before being deposited below threshold. The cross-border entry date (Dec 2025) and the spike in deposits immediately after are the smoking gun.

### Narrative Thread
> Mule courier pattern: cash physically couriered from Malaysia → deposited in sub-threshold tranches at MCB → consolidated into single real estate outflow to Malaysia. The CMR is the physical evidence layer that the STR's statistical pattern alone couldn't establish.

### Multi-Institution Value
> The FIU correlates MCB's bank STR (electronic pattern) with ICA's CMR (physical cash declaration) — two separate institutions reporting independently, fused at the FIU level to complete the picture.

---

## Case 2 — Natalia Petrova
**customer-1002 · Score 51.0 · Cross-Border Layering / Sanctions Evasion**
**Reporting Bank: Sentosa Financial Group (SFG)**

### The Story
A Russian national living in Tehran, working for an Iranian trading company, opens a USD account at SFG in August 2024. Over 18 months, the account processes SWIFT wires from Iranian and Cypriot entities — and sends money to a North Korean counterparty. Then she physically carries USD 207,500 in cash from Iran into Singapore, declaring the source as her Iranian employer and the recipient as a North Korean entity.

### Scores That Fired
| Score | What it detected | Contribution |
|-------|-----------------|:---:|
| `SanctionsProximity` | DPRK sanctions proximity via wire counterparties | 9.0 |
| `PEPAssociation` | Russian national with government-linked connections | 7.0 |
| `HighValueCashTransaction` | Total cash value SGD 287,500 — CMR physical cash declaration | 7.0 |
| `CustomerFromHighRiskCountry` | Permanently resident in Iran — FATF High Risk | 5.0 |
| `UnusualTransactionPattern` | Anomaly score 0.61, deviation 2.3x from baseline | 5.0 |
| `CustomerHasTransactionWithDifferentJurisdictions` | IRN → SGD → PRK — 3 FATF-risk jurisdictions | 5.0 |
| `ComplexOwnershipStructure` | 2-layer ownership across 2 jurisdictions | 5.0 |
| `GeographicRiskCountry` | Iran geographic risk | 4.0 |
| `ThirdPartyTransactions` | Third-party ratio 0.28, 3 unrelated counterparties | 4.0 |

### Linked Reports
- **STR-2026-SFG-1002** (filed by SFG) — USD 2,455,000 across 7 transactions. The IRN→SGD→PRK triangulation: Iranian inflows transit the Singapore account and exit to DPRK within 7 days. Filed under CDSA s.39 + TSOFA.
- **CMR-2026-0102** (filed at ICA Changi) — USD 207,500 physical cash declared at Changi Airport. **The declared source on the CMR form exactly matches the SWIFT wire counterparty (Caspian Trade Partners LLC) and the declared recipient exactly matches the SWIFT outflow destination (North Star Resources Co., DPRK)**. This is the key corroborating link: electronic wires + physical cash couriering = coordinated evasion strategy.

### Narrative Thread
> Iran uses Singapore as a laundering node: Iranian LLC sends both wire transfers AND physical cash (via Russian courier) through Singapore, with DPRK as the ultimate recipient. The CMR declaration is self-incriminating — she wrote the source and recipient on the form.

### Multi-Institution Value
> SFG sees the wire transfers but not the physical cash. ICA sees the cash declaration but not the wire history. Only the FIU, receiving both the STR and the CMR, can connect the electronic and physical channels into a single coordinated sanctions evasion operation.

---

## Case 3 — Dragon Gate Pte Limited
**customer-1003 · Score 60.0 · Hub-and-Spoke / Corporate ML**
**Reporting Bank: Pacific Trade Bank (PTB)**

### The Story
Dragon Gate is incorporated in February 2023 and banks at PTB — a brand new company. Within 47 days of incorporation, it receives USD 1.2M from China. The AML system identifies 23 inflow-outflow cycles over 3 years: money arrives from Chinese/HK entities on one side, and 95–98% of it exits within 8 days to BVI/Cayman nominees on the other. Dragon Gate itself retains almost nothing — it's a transit shell.

### Scores That Fired
| Score | What it detected | Contribution |
|-------|-----------------|:---:|
| `ShellCompanyIndicators` | Minimal employees, nominee directors — shell score 0.85 | 8.0 |
| `HighValueCashTransaction` | Total cash value SGD 2,850,000 across 18 transactions | 7.0 |
| `RapidMovementOfFundsCustomer` | Average holding period 4.2 hours — classic pass-through | 6.0 |
| `TradeBasedLaundering` | Invoice discrepancy 22%, over-invoicing ratio 1.28x | 6.0 |
| `ComplexOwnershipStructure` | 4-layer ownership across 3 jurisdictions | 5.0 |
| `HubAndSpoke` | 7 spokes, centrality score 0.89 | 5.0 |
| `CustomerFromHighRiskCountry` | BVI — Tax Haven jurisdiction | 5.0 |
| `UnusualTransactionPattern` | Anomaly score 0.55, rapid turnaround 0.78 | 5.0 |
| `CustomerHasTransactionWithDifferentJurisdictions` | SG, HK, VG, BZ — 4 jurisdictions | 5.0 |
| `GeographicRiskCountry` | British Virgin Islands geographic risk | 4.0 |
| `ThirdPartyTransactions` | Third-party ratio 0.62, 9 counterparties | 4.0 |

### Linked Reports
- **STR-2026-PTB-1003** (filed by PTB) — SGD 18,500,000 cumulative over 23 cycles. Company has no GST filings, no verifiable supply chain, no customer base.
- **CMR-2026-0103** (filed at ICA Changi) — Director Chen Jian Wei declared CNY 830,000 cash + HKD 1,200,000 **bearer cheque** on entry from China (15/02/2026). The bearer cheque instrument is itself a high-risk ML vehicle. Cash deposited 5 days later — physical supplement to the electronic hub-and-spoke network.

### Narrative Thread
> Classic Singapore Shell pattern: legitimate-looking company (UEN, address, bank accounts) provides the infrastructure. The actual mechanics run through SWIFT wires. When wire volumes get too large, the director personally couriers physical cash and bearer cheques across the border.

### Multi-Institution Value
> PTB reports the wire cycling pattern. ICA independently records the director's cash and bearer cheque declaration. The FIU links the two to show that the electronic and physical cash channels are operated by the same corporate network.

---

## Case 4 — Lee Wei Jian
**customer-1004 · Score 68.0 · Sanctions Evasion — OFAC SDN Match**
**Reporting Bank: Sentosa Financial Group (SFG)**

### The Story
Lee Wei Jian banks at SFG and operates multiple entities (LWJ Holdings, Tanaka Precision, shell-linked PRC entities). His USD account processes circular flows: PRC technology companies → Singapore → back to PRC. On 03/03/2026, a routine OFAC screening update flags him as SDN-LEE-WJ-2025-0441 under EO13694 (cyber sanctions). Account frozen same day.

### Scores That Fired
| Score | What it detected | Contribution |
|-------|-----------------|:---:|
| `CustomerIndirectLinkToHotlistRanked` | OFAC SDN — Mohammed Al-Rashid Trading LLC, 2-hop path | 12.0 |
| `SanctionsProximity` | Proximity score 0.87 to sanctioned entity | 9.0 |
| `PEPAssociation` | PEP-linked network connections | 7.0 |
| `HighValueCashTransaction` | Total cash value USD 1,850,000, max single SGD 425,000 | 7.0 |
| `AdverseMediaHits` | 3 adverse media hits | 6.0 |
| `CustomerHasTransactionWithDifferentJurisdictions` | SG, AE, LB, CY, VG — 5 jurisdictions | 5.0 |
| `UnusualTransactionPattern` | Anomaly score 0.68, deviation 2.4x from peer group | 5.0 |
| `CustomerFromHighRiskCountry` | Singapore residence but linked to FATF Grey List (Lebanon) | 5.0 |
| `GeographicRiskCountry` | Lebanon — FATF Grey List | 4.0 |
| `ThirdPartyTransactions` | Third-party ratio 0.45, 4 unknown source counterparties | 4.0 |
| `RoundAmountsCustomer` | Window ratio 0.58, 7 round-amount transactions | 4.0 |

### Linked Reports
- **STR-2026-SFG-1004** (filed by SFG) — USD 7,850,000 across 7 cycles. Filed simultaneously with MAS referral under UN Act Cap.339A Financial Sanctions regime. No CMR/CTR — this is a pure electronic sanctions case.

### Narrative Thread
> SDN cases have a binary trigger: screening match → immediate account freeze → STR filed on the same day. The investigation is retrospective — reconstructing all prior flows to determine whether any transactions were already sanctioned-entity transactions that should never have been processed.

---

## Case 5 — Synergy Asia Trading Pte Ltd
**customer-1005 · Score 55.0 · TBML / Precious Metals Mirror Trading**
**Reporting Bank: Pacific Trade Bank (PTB)**

### The Story
Synergy Asia is a securities trading company banking at PTB, with a Labuan-based 40% shareholder. The wires are already suspicious (round-trip Labuan ↔ Singapore ↔ Shanghai), but the decisive evidence comes from the PSMD: the company walks into Meridian Precious Assets, pays SGD 450,000 cash for gold bars, comes back the **next day** with different bars, and accepts a SGD 55,800 loss with zero commercial explanation. Classic mirror trade — the gold is the ML mechanism, not the commodity.

### Scores That Fired
| Score | What it detected | Contribution |
|-------|-----------------|:---:|
| `ShellCompanyIndicators` | Recently incorporated, minimal operations — shell score 0.71 | 8.0 |
| `HighValueCashTransaction` | Total cash value SGD 844,200 — PSMD mirror trade | 7.0 |
| `RapidMovementOfFundsCustomer` | Average holding period 6.8 hours | 6.0 |
| `TradeBasedLaundering` | Mirror trade value SGD 450,000, economic loss 12.4% | 6.0 |
| `UnusualTransactionPattern` | Mirror trading confidence 0.81 | 5.0 |
| `ComplexOwnershipStructure` | 2-layer ownership across 2 jurisdictions | 5.0 |
| `CustomerFromHighRiskCountry` | Singapore residence | 5.0 |
| `HubAndSpoke` | 4 spokes, centrality score 0.62 | 5.0 |
| `GeographicRiskCountry` | Hong Kong geographic risk | 4.0 |
| `ThirdPartyTransactions` | Third-party ratio 0.56, 3 counterparties | 4.0 |

### Linked Reports
- **STR-2026-PTB-1005** (filed by PTB) — USD 4,500,000 in wire cycles + SGD 450,000 PSMD cash component.
- **CTR-2026-0105** (filed by Meridian Precious Assets Pte Ltd) — Two transactions: purchase SGD 450,000 cash for 5×1kg gold bars (14 Feb), sale SGD 394,200 for 4×500g bars (15 Feb). Different bars — the 5th bar (≈SGD 90,000) destination unknown. Cross-reference between the bank STR and the PSMD CTR gives the full picture.

### Narrative Thread
> A two-institution ML scheme: bank handles the wire cycling (electronic layer), PSMD handles the physical commodity conversion (physical layer). Neither institution alone sees the full picture — the STR+CTR cross-reference completes it.

### Multi-Institution Value
> PTB sees suspicious wire cycling but has no visibility into the gold trades. Meridian Precious Assets sees the irrational gold mirror trade but doesn't know about the wire cycling. Only the FIU, receiving both the bank STR and the PSMD CTR, can connect the two layers into a single TBML operation.

---

## Case 6 — Rajan Krishnamurthy
**customer-1006 · Score 45.0 · Dormant Account Reactivation / Trust Layering**
**Reporting Bank: Meridian Capital Bank (MCB)**

### The Story
Rajan's account at MCB has been dormant for 59 months — nearly 5 years of silence. Then in August 2025, a SGD 450,000 wire arrives from a Mauritius family trust. Over the next 6 months, SGD 2,880,000 arrives from the same trust, and 97% of every inflow is immediately wired to an unnamed Indian beneficiary. The trust has no verifiable deed, no trustee identity, and no documented source of assets.

### Scores That Fired
| Score | What it detected | Contribution |
|-------|-----------------|:---:|
| `HighValueCashTransaction` | Total cash value SGD 520,000, max single SGD 185,000 | 7.0 |
| `RapidMovementOfFundsCustomer` | Average holding period 22 hours — mechanical turnaround | 6.0 |
| `UnusualTransactionPattern` | Anomaly score 0.58, dormancy months 14 | 5.0 |
| `StructuringRelationship` | Window ratio 0.38, 9 transactions | 5.0 |
| `CustomerHasTransactionWithDifferentJurisdictions` | SG, IN, AE — 3 jurisdictions | 5.0 |
| `CustomerFromHighRiskCountry` | Singapore residence | 5.0 |
| `GeographicRiskCountry` | India — FATF Grey List | 4.0 |
| `ThirdPartyTransactions` | Third-party ratio 0.38, 5 counterparties | 4.0 |
| `RoundAmountsCustomer` | Window ratio 0.52, 6 round-amount transactions | 4.0 |

### Linked Reports
- **STR-2026-MCB-1006** (filed by MCB) — SGD 2,880,000 across 8 events. No CMR/CTR. Pure wire layering through trust vehicle.

### Narrative Thread
> Three-hop trust layering: India (origin) → Mauritius trust (first hop) → Singapore dormant account (second hop) → India (return). The Singapore account exists purely to create a legitimate-looking international transfer in/out record. The dormancy period is deliberate — the account was "parked" until needed.

---

## Case 7 — Pyongyang Tech Export Co. ⚠️ CRITICAL
**customer-1007 · Score 79.0 · Proliferation Financing — WMD-Related**
**Reporting Bank: Changi Commercial Bank (CCB)**

### The Story
An account at CCB opened under the alias "PT Global Trade Solutions" receives wires from a Chinese forwarding agent (Dalian) and sends to a UAE entity (Gulf Technology Holdings). Intelligence identifies this as a DPRK dual-use goods procurement channel: China supplies components → UAE ships → Iran receives WMD-related technology. On 19/10/2025, the company's North Korean agent physically carries USD 250,000 cash into Singapore and **declares on the CMR form** that the source is Korea Ryonbong General Corporation — a UNSC Resolution 1718 designated WMD proliferator.

### Scores That Fired
| Score | What it detected | Contribution |
|-------|-----------------|:---:|
| `CustomerIndirectLinkToHotlistRanked` | UNSC Res 1718 — Korea Ryonbong General Corporation, 1-hop | 12.0 |
| `SanctionsProximity` | Proximity score 0.95 to Korea Ryonbong | 9.0 |
| `ShellCompanyIndicators` | State-linked entity, opaque ownership — front company score 0.92 | 8.0 |
| `PEPAssociation` | DPRK state-linked politically exposed network | 7.0 |
| `HighValueCashTransaction` | Total cash value USD 1,250,000 across 3 transactions | 7.0 |
| `TradeBasedLaundering` | Precision machining equipment — invoice discrepancy 35%, over-invoicing 1.45x | 6.0 |
| `AdverseMediaHits` | 7 adverse media hits | 6.0 |
| `CustomerFromHighRiskCountry` | DPRK — FATF Blacklisted | 5.0 |
| `CustomerHasTransactionWithDifferentJurisdictions` | SG, CN, IR, PRK — 4 jurisdictions | 5.0 |
| `ComplexOwnershipStructure` | 5-layer ownership across 4 jurisdictions | 5.0 |
| `UnusualTransactionPattern` | Anomaly score 0.74, unusual shipping route 0.82 | 5.0 |
| `GeographicRiskCountry` | North Korea geographic risk | 4.0 |

### Linked Reports
- **STR-2026-CCB-1007** (filed by CCB) — USD 3,900,000 across 7 events. Filed under CDSA s.39 + TSOFA + UN Act Cap.339A. Simultaneous referrals to SPF-CAD Proliferation Financing Unit and MAS.
- **CMR-2026-0107** (filed at ICA Changi) — **CRITICAL flag.** Kim Sung Jin declares USD 250,000 cash at Changi. Box 3 of the CMR form (Source of CBNI) shows: *Korea Ryonbong General Corporation — UNSC Resolution 1718 DESIGNATED ENTITY*. ICA detained the subject same day. This is the only case where the CMR declaration itself constitutes direct evidence of a sanctions violation.

### Narrative Thread
> The most severe case in the batch. The CMR declaration is a self-confessed sanctions violation — the carrier named a UNSC-designated entity as the fund source on a government form. Electronic wires use layers of intermediaries (Chinese forwarding agents, UAE front companies) to obscure the DPRK origin; the cash movement cuts through all that with a direct declaration.

### Multi-Institution Value
> CCB sees the wire flows through the alias company but may not know the DPRK connection. ICA detains the carrier after the CMR declaration names a UNSC-designated entity. The FIU correlates CCB's STR with ICA's CMR to build the complete proliferation financing case — connecting the electronic procurement pipeline with the physical cash courier network.

---

## Case 8 — Tan Mei Ling
**customer-1008 · Score 40.0 · Fraud / Money Mule — Scam Proceeds Layering**
**Reporting Bank: Raffles Banking Corporation (RBC)**

### The Story
Tan Mei Ling, banking at RBC, receives round-amount PayNow/FAST transfers from 7 unrelated individuals across 4 banks over 4 months. Within 1–5 days of each receipt, 97% of the funds are withdrawn as cash. Separately, she visits a pawnbroker twice, pawning multiple high-value gold jewellery items for round-amount cash loans totalling SGD 16,500. Her RBC accounts are cancelled with Fraud Flag after SPF CID opens a scam investigation.

### Scores That Fired
| Score | What it detected | Contribution |
|-------|-----------------|:---:|
| `HighValueCashTransaction` | Total cash value SGD 185,000 across 12 transactions | 7.0 |
| `CancelledCustomerScore` | 2 cancelled accounts with Fraud Flag across 7 total accounts | 6.0 |
| `UnusualTransactionPattern` | Anomaly score 0.55, deviation 1.8x from baseline | 5.0 |
| `StructuringRelationship` | Window ratio 0.65, 29 transactions | 5.0 |
| `CustomerFromHighRiskCountry` | Singapore residence | 5.0 |
| `GeographicRiskCountry` | Geographic risk flag | 4.0 |
| `ThirdPartyTransactions` | Third-party ratio 0.41, 7 unrelated counterparties | 4.0 |
| `RoundAmountsCustomer` | Round-amount ratio 0.65, 19 round transactions | 4.0 |

### Linked Reports
- **STR-2026-RBC-1008** (filed by RBC) — SGD 247,500 in receive-and-withdraw cycles. SPF CID referral CID-SCAM-2026-REF-8812 attached. One confirmed scam victim (Individual C, UOB transfer SGD 25,000, investment scam).
- **CTR-2026-0108** (filed by Golden Link Pawnbrokers Pte Ltd) — 3 pawn transactions totalling SGD 16,500. The jewellery characteristics (22K necklace sets, 18K diamond bracelets, 24K bar pendants) are inconsistent with the financial profile of an administrative assistant. The luxury goods are consistent with mule recruitment via romance/investment scam operators.

### Narrative Thread
> The scam proceeds flow into the mule account (bank), which is immediately cashed out. The jewellery at the pawnbroker represents a second liquidation channel — goods received as recruitment payment are converted to cash. Both the bank STR and the pawnbroker CTR capture different parts of the same mule's asset liquidation cycle.

### Multi-Institution Value
> RBC sees the round-amount inflows and immediate cash-outs but has no visibility into the pawnbroker activity. Golden Link Pawnbrokers sees the luxury jewellery pawning but doesn't know about the bank fraud flag. The FIU links the bank STR with the pawnbroker CTR to reveal both liquidation channels of the same mule operation.

---

## Case 9 — Ong Bee Lian
**customer-1009 · Score 4.0 · Low Risk — Geographic Flag**
**Reporting Bank: Meridian Capital Bank (MCB)**

### The Story
Ong Bee Lian is a retired Singaporean schoolteacher who has been sending regular monthly remittances of SGD 6,000 to her sister (Ong Mei Hua) in Jakarta, Indonesia. The pattern has been consistent for over 2 years. The geographic risk flag for Indonesia is the sole trigger — there are no behavioural anomalies, no structuring patterns, no adverse media. This is a precautionary filing.

### Scores That Fired
| Score | What it detected | Contribution |
|-------|-----------------|:---:|
| `GeographicRiskCountry` | Cross-border remittance destination Indonesia | 4.0 |

### Alert Trigger
> *"Minimal risk. Single geographic flag for routine cross-border remittance to Indonesia. No behavioural anomalies detected. Score below active triage threshold."*

### Linked Reports
- **STR-2026-MCB-1009** (filed by MCB) — SGD 12,000 across 2 transactions. Two monthly SGD 6,000 remittances to sister in Jakarta via online banking.

### Narrative Thread
> Routine family remittance pattern by a retired individual. The geographic flag alone (Indonesia) triggered a minimal alert. No investigation indicators present. Expected auto-route to HIBERNATED (score 4.0 < 10 threshold).

---

## Case 10 — Sunrise Wellness Pte Ltd
**customer-1010 · Score 8.0 · Low Risk — Minor Geographic + Round Amount**
**Reporting Bank: Sentosa Financial Group (SFG)**

### The Story
Sunrise Wellness Pte Ltd is a Singapore-incorporated health supplements wholesaler with a 6-year operating history, directed by Koh Chee Wai. The company makes regular quarterly payments of exactly SGD 12,000 to its established Cambodian supplier (Khmer Health Supplies Co. in Phnom Penh). The mild geographic flag (Cambodia) and minor round-amount pattern (31% ratio, 4 transactions) are the only triggers. No structuring, no layering, no adverse media, no sanctions matches.

### Scores That Fired
| Score | What it detected | Contribution |
|-------|-----------------|:---:|
| `GeographicRiskCountry` | Cambodia — mild geographic risk | 4.0 |
| `RoundAmountsCustomer` | 31% round-amount ratio, 4 round transactions (quarterly payments) | 4.0 |

### Alert Trigger
> *"Low risk. Mild geographic flag (Cambodia) and minor round-amount pattern (31% ratio, 4 transactions). Consistent with normal wholesale supplier payments. Score below active triage threshold."*

### Linked Reports
- **STR-2026-SFG-1010** (filed by SFG) — SGD 48,000 across 4 transactions. Four quarterly SGD 12,000 payments to Cambodian supplier via online banking.

### Narrative Thread
> Routine business payments by an established wholesaler to a known supplier. The round amounts are consistent with fixed contractual pricing, not structuring. Expected auto-route to HIBERNATED (score 8.0 < 10 threshold).

---

## Case 11 — Viktor Lazarev ⚠️ CRITICAL
**customer-1011 · Score 156.0 · Sanctions Evasion / Proliferation Financing / PEP Corruption**
**Reporting Bank: Changi Commercial Bank (CCB)**

### The Story
Viktor Andreyevich Lazarev is a Russian national and former Deputy Minister of Industry and Trade — a confirmed Politically Exposed Person. His spouse, Irina Lazareva, sits on the board of a Gazprom subsidiary (PEP family). He maintains two accounts: a personal USD account at CCB (Marina Bay) and a corporate EUR account under Lazarev Holdings Pte Ltd at MCB (Orchard).

The AML system flagged direct financial flows linked to two sanctioned entities: (1) **Rostec State Corporation** (OFAC SDN — Russian state defence conglomerate), traced through a Cypriot shell company (Volga Industrial Holdings SA), and (2) **Promtechnologia LLC** (EU Consolidated Sanctions — Russian defence subcontractor), which sent EUR 1,800,000 directly into the corporate account.

Fund movements exhibit a classic multi-layered sanctions evasion pattern: inflows from sanctioned/opaque sources → brief transit through Singapore (average holding period 1.8 hours) → outflows to shell entities in BVI, UAE free zones, and Hong Kong. The UAE recipient (Precision Dynamics FZE) received cumulative transfers of USD 1,580,000 for "precision machining components" — dual-use export control goods.

Lazarev was named in the OCCRP investigation (2025) into Russian oligarch asset networks and appeared in the Pandora Papers leak (ICIJ), revealing a 7-layer ownership structure spanning Russia, Cyprus, BVI, Switzerland, UAE, Hong Kong, and Singapore.

### Scores That Fired
| Score | What it detected | Contribution |
|-------|-----------------|:---:|
| `CustomerIndirectLinkToHotlistRanked` | OFAC SDN — Rostec State Corporation, 1-hop (×2: also Promtechnologia LLC via EU list) | 12.0 + 12.0 |
| `SanctionsProximity` | Proximity score 0.96 to Rostec (×2: also 0.91 to Promtechnologia) | 9.0 + 9.0 |
| `ShellCompanyIndicators` | Nominee directors, no physical office, BVI registered — shell score 0.94 | 8.0 |
| `HighValueCashTransaction` | Total cash value USD 4,250,000 (×2: secondary account USD 2,150,000) | 7.0 + 7.0 |
| `PEPAssociation` | Former Deputy Minister (×2: spouse on Gazprom subsidiary board) | 7.0 + 7.0 |
| `TradeBasedLaundering` | Titanium alloy components — invoice discrepancy 62%, over-invoicing 2.15x | 6.0 |
| `AdverseMediaHits` | 12 hits (×2: secondary source 5 hits) | 6.0 + 6.0 |
| `CancelledCustomerScore` | 4 cancelled accounts across 11 total accounts | 6.0 |
| `RapidMovementOfFundsCustomer` | Average holding period 1.8 hours (×2: secondary 2.1 hours) | 6.0 + 6.0 |
| `ComplexOwnershipStructure` | 7-layer ownership across 5 jurisdictions | 5.0 |
| `CustomerFromHighRiskCountry` | Russia — FATF High Risk | 5.0 |
| `CustomerHasTransactionWithDifferentJurisdictions` | SG, RU, CY, BVI, AE, CH, HK — 7 jurisdictions | 5.0 |
| `HubAndSpoke` | 14 spokes, centrality score 0.97 | 5.0 |
| `StructuringRelationship` | Window ratio 0.88, 42 transactions averaging SGD 9,950 | 5.0 |
| `UnusualTransactionPattern` | Anomaly score 0.91, deviation 4.8x from peer group | 5.0 |
| `GeographicRiskCountry` | Russia geographic risk | 4.0 |
| `RoundAmountsCustomer` | Window ratio 0.79, 33 round-amount transactions | 4.0 |
| `ThirdPartyTransactions` | Third-party ratio 0.71, 18 counterparties | 4.0 |

> **Note:** Score exceeds 150 due to duplicate score hits from different data sources — realistic in Quantexa's multi-graph scoring model where the same score type fires independently on different evidence clusters.

### Alert Trigger
> *"CRITICAL: Russian national with direct links to 2 OFAC/EU sanctioned defence entities (Rostec, Promtechnologia). Former Deputy Minister (PEP). Named in OCCRP and Pandora Papers investigations. 7-layer ownership structure across 7 jurisdictions. Fund throughput of SGD 8.5M with 1.8hr average holding period. Immediate priority escalation required."*

### Linked Reports
- **STR-2026-CCB-1011** (filed by CCB) — USD 8,500,000 across 9 transactions. Filed under CDSA s.39 and TSOFA. Includes: USD 1,250,000 from Rostec-linked Cypriot shell, EUR 1,800,000 direct from EU-sanctioned Promtechnologia, USD 1,580,000 cumulative to UAE dual-use goods entity, CHF 620,000 from opaque Swiss family trust.
- **CMR-2026-0111** (filed at ICA Changi) — Viktor Lazarev declared USD 185,000 cash arriving from Moscow via Dubai (Emirates EK 354). Purpose stated: "personal funds — investment purposes." Transit via UAE is consistent with Russian sanctions evasion routing.

### Narrative Thread
> The most complex multi-jurisdictional sanctions evasion case in the batch. Lazarev operates a 7-layer ownership structure across 7 jurisdictions to channel sanctioned Russian defence funds through Singapore. The electronic layer (SWIFT wires from Rostec/Promtechnologia) is supplemented by physical cash couriering (CMR at Changi). The dual-use goods nexus (titanium alloy components via UAE) raises proliferation financing concerns.

### Multi-Institution Value
> CCB sees the wire flows through Lazarev's personal account but may not see the CMR declaration. ICA records the cash carried from Moscow via Dubai. MCB holds the corporate EUR account receiving Promtechnologia funds. The FIU correlates all three institution reports into a single sanctions evasion operation spanning electronic wires, physical cash, and trade-based laundering channels.

---

## Case 12 — Golden Phoenix International Ltd ⚠️ CRITICAL
**customer-1012 · Score 151.0 · Sanctions Evasion / Military-Linked Shell Network / Trade-Based ML**
**Reporting Bank: Pacific Trade Bank (PTB)**

### The Story
Golden Phoenix International Ltd is a Labuan-registered jade and timber trading company incorporated in November 2023. The UBO is **Gen. (Ret.) Aung Kyaw Moe**, a retired Myanmar military general identified in Justice for Myanmar reports as linked to the Tatmadaw's commercial interests — a confirmed PEP.

The entity has received direct financial flows from two sanctioned Myanmar entities: (1) **Myanmar Economic Holdings Ltd (MEHL)** — OFAC SDN-listed military conglomerate, which sent USD 1,200,000, and (2) **Myanmar Gems Enterprise** — UNSC-sanctioned state-owned gems monopoly, which sent USD 850,000. Combined sanctioned-entity exposure: USD 2,050,000.

The fund flow pattern demonstrates trade-based money laundering through the jade and timber sectors: inflows from sanctioned Myanmar entities transit the Singapore accounts and move to jade processors in Yunnan (China) and timber traders in Thailand, with invoice discrepancies averaging 55% on jade and 48% on timber. A subsidiary — **Phoenix Jade Trading Pte Ltd** — was incorporated in Singapore with the same nominee director and BVI beneficial ownership, receiving inter-company transfers of SGD 650,000.

### Scores That Fired
| Score | What it detected | Contribution |
|-------|-----------------|:---:|
| `CustomerIndirectLinkToHotlistRanked` | OFAC SDN — MEHL, 1-hop (×2: also Myanmar Gems Enterprise via UNSC, 2-hop) | 12.0 + 12.0 |
| `SanctionsProximity` | Proximity score 0.93 to MEHL (×2: also 0.85 to Myanmar Gems Enterprise) | 9.0 + 9.0 |
| `ShellCompanyIndicators` | Labuan registered, dormant then reactivated (×2: subsidiary Phoenix Jade Trading, BVI) | 8.0 + 8.0 |
| `HighValueCashTransaction` | Total cash value USD 3,800,000 (×2: secondary USD 1,950,000) | 7.0 + 7.0 |
| `PEPAssociation` | UBO is retired Myanmar military general | 7.0 |
| `TradeBasedLaundering` | Jade — invoice discrepancy 55%, over-invoicing 1.85x (×2: teak timber 48%, 1.62x) | 6.0 + 6.0 |
| `AdverseMediaHits` | 8 adverse media hits (Justice for Myanmar, OCCRP) | 6.0 |
| `CancelledCustomerScore` | 3 cancelled accounts across 9 total accounts | 6.0 |
| `RapidMovementOfFundsCustomer` | Average holding period 2.4 hours | 6.0 |
| `ComplexOwnershipStructure` | 6-layer ownership across 4 jurisdictions (Myanmar, Labuan, Singapore, BVI) | 5.0 |
| `CustomerFromHighRiskCountry` | Myanmar — FATF Blacklisted | 5.0 |
| `CustomerHasTransactionWithDifferentJurisdictions` | SG, MM, TH, CN, HK, MY — 6 jurisdictions | 5.0 |
| `HubAndSpoke` | 11 spokes, centrality score 0.94 | 5.0 |
| `StructuringRelationship` | Window ratio 0.84, 38 transactions averaging SGD 9,900 | 5.0 |
| `UnusualTransactionPattern` | Anomaly score 0.87, deviation 4.2x from peer group | 5.0 |
| `GeographicRiskCountry` | Myanmar geographic risk | 4.0 |
| `RoundAmountsCustomer` | Window ratio 0.82, 31 round-amount transactions | 4.0 |
| `ThirdPartyTransactions` | Third-party ratio 0.65, 15 counterparties | 4.0 |

> **Note:** Score exceeds 150 due to duplicate score hits from different data sources — two sanctioned entities (MEHL, Myanmar Gems Enterprise) and subsidiary shell company fire multiple independent score instances.

### Alert Trigger
> *"CRITICAL: Myanmar-linked shell company with direct ties to 2 sanctioned military-controlled entities (MEHL, Myanmar Gems Enterprise). UBO is retired military general (PEP). 6-layer ownership across 4 jurisdictions. Jade and gemstone trade with 55% invoice discrepancies. Fund throughput SGD 6.2M with 2.4hr holding period. Immediate priority escalation required."*

### Linked Reports
- **STR-2026-PTB-1012** (filed by PTB) — USD 6,200,000 across 9 transactions. Filed under CDSA s.39 and TSOFA. Includes: USD 850,000 from UNSC-sanctioned Myanmar Gems Enterprise, USD 1,200,000 from OFAC SDN-listed MEHL, and USD 1,220,000 cumulative to Yunnan jade processors with no customs documentation.
- **CMR-2026-0112** (filed at ICA Changi) — Company representative Zaw Min Tun declared USD 250,000 cash arriving from Yangon via Bangkok (Thai Airways TG 404). Source: Golden Phoenix International Ltd (Labuan). Recipient: Phoenix Jade Trading Pte Ltd (Singapore subsidiary). Purpose: "jade auction settlement — Naypyidaw Gems Emporium 2024." The Gems Emporium is controlled by the Myanmar military.

### Narrative Thread
> A military-linked trade-based ML operation using Singapore as a sanctions evasion node. Myanmar military entities (MEHL, Myanmar Gems Enterprise) channel funds through a Labuan shell company into Singapore, then layer through jade processors in China and timber traders in Thailand. The physical cash component (CMR) supplements the electronic flows. The subsidiary (Phoenix Jade Trading) with identical nominee director and BVI ownership provides an additional layering layer within Singapore.

### Multi-Institution Value
> PTB sees the trade finance flows but doesn't know about the CMR declaration. ICA records the cash carried by the company representative from Yangon via Bangkok. MCB holds the subsidiary's account receiving inter-company transfers. The FIU correlates all three into a single military-linked sanctions evasion and trade-based ML operation.

---

## Cross-Case Patterns

| Pattern | Cases | Multi-Institution Insight |
|---------|-------|--------------------------|
| CMR + STR compound (electronic + physical cash) | 1001, 1002, 1003, 1007, 1011, 1012 | Bank STR + ICA CMR fused at FIU level |
| CTR + STR compound (PSMD/pawnbroker + bank) | 1005, 1008 | Non-bank CTR + bank STR fused at FIU level |
| STR only (pure electronic) | 1004, 1006, 1009, 1010 | Single bank reporting, no cross-institution linkage needed |
| FATF-listed jurisdiction exposure | 1002, 1007, 1011, 1012 | Multiple banks flag FATF High-Risk/Blacklisted jurisdictions independently |
| UNSC/OFAC sanctions nexus | 1002, 1004, 1007, 1011, 1012 | Five cases across four banks (SFG, CCB, PTB) flag sanctions-related subjects |
| Physical cash couriering | 1001, 1002, 1003, 1007, 1011, 1012 | ICA checkpoint CMRs provide physical evidence layer |
| Corporate shell / front entity | 1003, 1005, 1007, 1011, 1012 | Shell company indicators across multiple banks |
| Trust / offshore layering | 1003, 1006, 1011 | BVI nominees, Mauritius trust, Swiss family trust |
| Trade-based money laundering | 1003, 1005, 1007, 1011, 1012 | Invoice discrepancies, over-invoicing, commodity-based ML |
| PEP exposure | 1002, 1004, 1007, 1011, 1012 | Politically exposed persons across 5 cases |
| Fraud / scam proceeds | 1008 | RBC bank + Golden Link pawnbroker, two institution types |
| Dormant account trigger | 1006 | MCB detects dormancy reactivation internally |
| PRIORITY auto-route (score >150) | 1011, 1012 | Duplicate score hits from multiple data sources exceed threshold |
| HIBERNATED auto-route (score <10) | 1009, 1010 | Minimal risk — geographic flags only, below active triage threshold |
| Structuring below threshold | 1001 | 13 deposits, all < SGD 10,000 |
