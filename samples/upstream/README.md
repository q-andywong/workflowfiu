# Upstream Mock Data — FIU Multi-Institution Intake

> **Batch Run:** 2026-03-03 · **Jurisdiction:** Singapore (SG)
> **Purpose:** Simulated raw data from multiple Singapore financial institutions, ingested by the FIU's Quantexa AML platform upstream. This is the foundation data that generates the alerts, tasks, and linked reports (STR/CMR/CTR) consumed by the FIU downstream workflow.

---

## How This Data Fits the Pipeline

```
Multiple Banks / Institutions (upstream — this folder)
  ├── person.json (individuals)                        ──┐
  ├── transactions.csv                                    │
  ├── hotlist.csv                                       │
  └── opencorporates/ (companies, officers, etc.)       │
                                                        ▼
                                        Quantexa AML Platform
                                        (scoring, network analysis)
                                                        │
                                                        ▼
                                        Tasks + Linked Reports
                                        ├── MockTasksToLoad.json
                                        ├── MockSTRsToLoad.json  ← includes account data in Tab II
                                        ├── MockCMRsToLoad.json
                                        └── MockCTRsToLoad.json
                                                        │
                                                        ▼
                                        FIU Workflow App (src/)
```

> **Note on account data:** Bank account information (account number, holder name, branch, relationship manager, risk rating, AML alert flags, prior filing count, contact number) is embedded within each STR's `tabII_accountInformation` section — not as a separate upstream file. This reflects the FIU's perspective: the FIU never has direct access to bank account systems. Everything the FIU knows about an account comes through the STR filing submitted by the reporting bank.

---

## Reporting Institutions

### Banks (STR filers)

| Code | Full Name | UEN | Cases | Contact Officer |
|------|-----------|-----|-------|-----------------|
| MCB | Meridian Capital Bank Pte Ltd | 201209001G | 1001, 1006, 1009 | Lim Siew Ching |
| SFG | Sentosa Financial Group Pte Ltd | 201512088H | 1002, 1004, 1010 | Raj Kumar |
| PTB | Pacific Trade Bank Pte Ltd | 201703145K | 1003, 1005, 1012 | Angela Tan |
| CCB | Changi Commercial Bank Pte Ltd | 201809234M | 1007, 1011 | David Wong |
| RBC | Raffles Banking Corporation Pte Ltd | 201604177J | 1008 | Michelle Koh |

### Non-Bank Institutions (CTR filers)

| Institution | Type | Report |
|-------------|------|--------|
| Meridian Precious Assets Pte Ltd | PSMD — Precious Metals Dealer | CTR-2026-0105 |
| Golden Link Pawnbrokers Pte Ltd | Pawnbroker (Pawnbrokers Act 2015 s.74A) | CTR-2026-0108 |

### Government (CMR filers)

| Institution | Reports |
|-------------|---------|
| ICA Checkpoint (Woodlands) | CMR-2026-0101 |
| ICA Checkpoint (Changi) | CMR-2026-0102, CMR-2026-0103, CMR-2026-0107, CMR-2026-0111, CMR-2026-0112 |

---

## Report Registry

### STRs — Suspicious Transaction Reports (filed by banks)

| Report ID | Bank | Subject | Amount | Crime Typology |
|-----------|------|---------|-------:|----------------|
| STR-2026-MCB-1001 | MCB | Ahmad Bin Sulaiman | SGD 303,800 | Structuring / Smurfing |
| STR-2026-SFG-1002 | SFG | Natalia Petrova | USD 2,455,000 | Cross-Border Layering / Sanctions |
| STR-2026-PTB-1003 | PTB | Dragon Gate Pte Limited | SGD 18,500,000 | Hub-and-Spoke ML |
| STR-2026-SFG-1004 | SFG | Lee Wei Jian | USD 7,850,000 | Sanctions Evasion (OFAC SDN) |
| STR-2026-PTB-1005 | PTB | Synergy Asia Trading Pte Ltd | USD 4,500,000 | TBML / Precious Metals |
| STR-2026-MCB-1006 | MCB | Rajan Krishnamurthy | SGD 2,880,000 | Dormant Reactivation / Trust Layering |
| STR-2026-CCB-1007 | CCB | PT Global Trade Solutions | USD 3,900,000 | Proliferation Financing (WMD) |
| STR-2026-RBC-1008 | RBC | Tan Mei Ling | SGD 247,500 | Fraud / Money Mule |
| STR-2026-MCB-1009 | MCB | Ong Bee Lian | SGD 12,000 | Low Risk — Geographic Flag |
| STR-2026-SFG-1010 | SFG | Sunrise Wellness Pte Ltd | SGD 48,000 | Low Risk — Minor Geographic + Round Amount |
| STR-2026-CCB-1011 | CCB | Viktor Lazarev | USD 8,500,000 | Sanctions Evasion / Proliferation Financing / PEP |
| STR-2026-PTB-1012 | PTB | Golden Phoenix International Ltd | USD 6,200,000 | Sanctions Evasion / Military-Linked Shell / TBML |

### CMRs — Cash Movement Reports (filed at ICA checkpoints)

| Report ID | Declarant | Entry From | Cash Declared | Linked STR |
|-----------|-----------|------------|:------------:|------------|
| CMR-2026-0101 | Ahmad Bin Sulaiman | Malaysia (Bus) | SGD 53,500 | STR-2026-MCB-1001 |
| CMR-2026-0102 | Natalia Petrova | Iran (Mahan Air) | USD 207,500 | STR-2026-SFG-1002 |
| CMR-2026-0103 | Chen Jian Wei | China (Cathay Pacific) | SGD 362,000 | STR-2026-PTB-1003 |
| CMR-2026-0107 | Kim Sung Jin | China (Air China) | USD 250,000 | STR-2026-CCB-1007 |
| CMR-2026-0111 | Viktor Lazarev | UAE (Emirates) | USD 185,000 | STR-2026-CCB-1011 |
| CMR-2026-0112 | Zaw Min Tun | Thailand (Thai Airways) | USD 250,000 | STR-2026-PTB-1012 |

### CTRs — Cash Transaction Reports (filed by PSMDs / Pawnbrokers)

| Report ID | Filing Institution | Subject | Cash Amount | Linked STR |
|-----------|-------------------|---------|:-----------:|------------|
| CTR-2026-0105 | Meridian Precious Assets Pte Ltd | Synergy Asia Trading | SGD 450,000 | STR-2026-PTB-1005 |
| CTR-2026-0108 | Golden Link Pawnbrokers Pte Ltd | Tan Mei Ling | SGD 16,500 | STR-2026-RBC-1008 |

---

## Data Summary

### Upstream File Inventory

| File | Path | Rows | Description |
|------|------|:----:|-------------|
| `person.json` | `customer/raw/json/` | 7 | Person case class records for 7 individual customers (structured name, DOB, address parsing) |
| `transactions.csv` | `transaction/raw/csv/` | 102 | All debit/credit transactions across the 12 cases |
| `hotlist.csv` | `hotlist/raw/csv/` | 9 | Sanctions & watchlist entries (OFAC, UNSC) |
| `companies.csv` | `opencorporates/raw/csv/` | 9 | Corporate registry records |
| `officers.csv` | `opencorporates/raw/csv/` | 7 | Company directors/officers |
| `relationships.csv` | `opencorporates/raw/csv/` | 4 | Ownership & shareholding links |
| `alternative_names.csv` | `opencorporates/raw/csv/` | 1 | Corporate aliases |
| `additional_identifiers.csv` | `opencorporates/raw/csv/` | 0 | Header only |
| `non_reg_addresses.csv` | `opencorporates/raw/csv/` | 0 | Header only |

> **Retired:** `customer.csv` — Individual customer data has been migrated to `person.json` (Person case class). Corporate customer data is covered by `opencorporates/companies.csv` and STR `tabIII_entityInformation`.
>
> **Retired:** `account.csv` — Bank account data has been migrated into the STR JSON (`tabII_accountInformation`). The FIU receives account information only through the STR filing, not as a separate data feed. See [Account Data in STR Tab II](#account-data-in-str-tab-ii) below.
>
> **Retired:** `acc_to_cus.csv` (11 rows from original 8 cases) — Customer-to-account linkage is now embedded in STR Tab II (`bankInternalAccountId`). Retained for backward compatibility with the original 8 cases but not extended for cases 1009–1012.

### ID Ranges (non-overlapping with `pe_data/`)

| Entity | ID Range |
|--------|----------|
| Person IDs (personId) | 1001, 1002, 1004, 1006, 1008, 1009, 1011 (individuals only) |
| Account IDs (bankInternalAccountId in STR Tab II) | 301–311, 401–402, 501–502, 601–602 |
| Transaction IDs | 10001–10102 |
| Hotlist IDs | 33–41 |
| Company Numbers | 700001–700009 |
| Officer IDs | 201–207 |

---

## Customer Overview

| ID | Name | Type | Bank | Nationality | Residence | Risk Rating | Person JSON | Crime Typology |
|----|------|------|------|-------------|-----------|:-----------:|:----------:|----------------|
| 1001 | Ahmad Bin Sulaiman | Individual | MCB | SG | SG | 4,500 | Yes | Structuring / Smurfing |
| 1002 | Natalia Petrova | Individual | SFG | RU | IR | 5,100 | Yes | Cross-Border Layering / Sanctions |
| 1003 | Dragon Gate Pte Limited | Corporate | PTB | SG | SG | 6,000 | — | Hub-and-Spoke ML |
| 1004 | Lee Wei Jian | Individual | SFG | SG | SG | 6,800 | Yes | Sanctions Evasion (OFAC SDN) |
| 1005 | Synergy Asia Trading Pte Ltd | Corporate | PTB | SG | SG | 5,500 | — | TBML / Precious Metals |
| 1006 | Rajan Krishnamurthy | Individual | MCB | IN | SG | 4,500 | Yes | Dormant Reactivation / Trust Layering |
| 1007 | PT Global Trade Solutions | Corporate | CCB | KP | SG | 7,900 | — | Proliferation Financing (WMD) |
| 1008 | Tan Mei Ling | Individual | RBC | SG | SG | 4,000 | Yes | Fraud / Money Mule |
| 1009 | Ong Bee Lian | Individual | MCB | SG | SG | 400 | Yes | Low Risk — Geographic Flag |
| 1010 | Sunrise Wellness Pte Ltd | Corporate | SFG | SG | SG | 800 | — | Low Risk — Minor Geographic + Round Amount |
| 1011 | Viktor Lazarev | Individual | CCB | RU | RU | 15,600 | Yes | Sanctions Evasion / Proliferation Financing / PEP |
| 1012 | Golden Phoenix International Ltd | Corporate | PTB | MM | MY | 15,100 | — | Sanctions Evasion / Military-Linked Shell / TBML |

> Account details (account numbers, holder names, branch, RM, risk ratings, AML flags) are in each STR's `tabII_accountInformation` — see [Account Data in STR Tab II](#account-data-in-str-tab-ii).

---

## Transaction Summary

| Case | Customer | Bank | # Txns | Total Volume | Currency | Flow Pattern |
|------|----------|------|:------:|-------------:|----------|--------------|
| 1001 | Ahmad Bin Sulaiman | MCB | 14 | 411,300 | SGD | 13 structured cash deposits + 1 FAST outflow |
| 1002 | Natalia Petrova | SFG | 7 | 2,455,000 | USD | IRN/CY inflows → SG → KP outflows |
| 1003 | Dragon Gate Pte Limited | PTB | 10 | 10,661,900 | USD | CN/HK inflows → SG → BVI/KY outflows |
| 1004 | Lee Wei Jian | SFG | 7 | 8,850,000 | USD | PRC inflows → SG → PRC circular flows |
| 1005 | Synergy Asia Trading | PTB | 8 | 5,299,200 | USD/SGD | Labuan↔SG↔Shanghai wire cycles + PSMD |
| 1006 | Rajan Krishnamurthy | MCB | 12 | 5,285,600 | SGD | Mauritius trust → SG → India pass-through |
| 1007 | PT Global Trade Solutions | CCB | 10 | 5,056,400 | USD | CN forwarding → SG → UAE front company |
| 1008 | Tan Mei Ling | RBC | 13 | 465,750 | SGD | 7 PayNow/FAST inflows + 6 ATM withdrawals |
| 1009 | Ong Bee Lian | MCB | 2 | 12,000 | SGD | Monthly outward remittances to Indonesia |
| 1010 | Sunrise Wellness Pte Ltd | SFG | 4 | 48,000 | SGD | Quarterly supplier payments to Cambodia |
| 1011 | Viktor Lazarev | CCB | 8 | 8,500,000 | USD | Sanctioned entity inflows → BVI/UAE/HK/CH outflows |
| 1012 | Golden Phoenix International Ltd | PTB | 8 | 6,200,000 | USD | Myanmar sanctioned entity inflows → CN/TH/SG layering |

**Grand Total: 102 transactions · ~SGD 53M equivalent across 5 banks**

---

## Hotlist Entries

| ID | Name | Designation | Case Link |
|----|------|-------------|-----------|
| 33 | Caspian Trade Partners LLC | Iranian trading entity; SWIFT wire originator | 1002 |
| 34 | North Star Resources Co. | DPRK entity; SWIFT wire recipient | 1002 |
| 35 | Lee Wei Jian | OFAC SDN-LEE-WJ-2025-0441 (EO13694 Cyber Sanctions) | 1004 |
| 36 | Korea Ryonbong General Corporation | UNSC Res 1718 designated WMD proliferator | 1007 |
| 37 | Kim Sung Jin | Director of PT Global Trade Solutions; DPRK national | 1007 |
| 38 | Rostec State Corporation | Russian state defence conglomerate; OFAC SDN | 1011 |
| 39 | Promtechnologia LLC | EU Consolidated Sanctions; Russian defence subcontractor | 1011 |
| 40 | Myanmar Economic Holdings Ltd (MEHL) | OFAC SDN; Myanmar military conglomerate | 1012 |
| 41 | Myanmar Gems Enterprise | UNSC Sanctioned; state-owned gems monopoly | 1012 |

---

## Corporate Network

| Company # | Entity | Jurisdiction | Key Officer | Case Link |
|-----------|--------|:------------:|-------------|-----------|
| 700001 | Dragon Gate Pte Limited | SG | Chen Jian Wei (Dir, 85%) | 1003 |
| 700002 | LWJ Holdings Pte Ltd | SG | Lee Wei Jian (Dir, 100%) | 1004 |
| 700003 | Tanaka Precision Engineering KK | JP | — | 1004 |
| 700004 | Synergy Asia Trading Pte Ltd | SG | Michael Tan Eng Huat (Dir) | 1005 |
| 700005 | PT Global Trade Solutions | SG | Kim Sung Jin (Dir) | 1007 |
| 700006 | Gulf Technology Holdings LLC | AE | — | 1007 |
| 700007 | Sunrise Wellness Pte Ltd | SG | Koh Chee Wai (Dir) | 1010 |
| 700008 | Golden Phoenix International Ltd | MY (Labuan) | Gen. (Ret.) Aung Kyaw Moe (Dir) | 1012 |
| 700009 | Phoenix Jade Trading Pte Ltd | SG | Zaw Min Tun (Dir, nominee) | 1012 |

### Ownership Chain (Case 1004)
```
Lee Wei Jian (Individual)
  └── 100% → LWJ Holdings Pte Ltd (700002, SG)
                └── 60% → Tanaka Precision Engineering KK (700003, JP)
```

### Alias (Case 1007)
```
PT Global Trade Solutions (700005) ← formerly "Pyongyang Tech Export Co."
```

### Ownership Chain (Case 1012)
```
Golden Phoenix International Ltd (700008, Labuan)
  ├── UBO: Gen. (Ret.) Aung Kyaw Moe (Myanmar military PEP)
  └── Subsidiary: Phoenix Jade Trading Pte Ltd (700009, SG)
        └── Same nominee director, BVI beneficial ownership
```

---

## Case Storylines

---

### Case 1 — Ahmad Bin Sulaiman (customer-1001)
**Bank: Meridian Capital Bank (MCB) · Typology: Structuring / Smurfing · Score: 45.0**

Ahmad Bin Sulaiman is a Singaporean management executive, customer of MCB since March 2019. He holds two accounts: a current account (301) and a fixed deposit (302).

Starting September 2025, Ahmad makes 13 consecutive cash deposits at the MCB counter, each carefully calibrated below the SGD 10,000 CDD reporting threshold. The deposits range from SGD 9,500 to SGD 9,900 — never rounding up to SGD 10,000. They arrive weekly, like clockwork, across 3 months (Sep 15 – Dec 8, 2025). The total deposited is SGD 126,300.

On 3 March 2026 — the alert batch date — the entire accumulated balance consolidates into a single FAST transfer of SGD 285,000 to **Mutiara Hartanah Sdn Bhd**, a Malaysian real estate entity in Kuala Lumpur.

**The pattern:** Cash is physically couriered from Malaysia (evidenced by CMR-2026-0101 declaring SGD 49,000 + MYR 15,000 at ICA Woodlands in December 2025), deposited in sub-threshold tranches to avoid detection, then consolidated and sent back to Malaysia as a real estate payment. The round-trip laundering circuit uses the Singapore banking system as the wash cycle.

**Key evidence:**
- 13 cash deposits, all < SGD 10,000 — 76% round numbers, Benford's Law deviation 0.18
- 1 FAST outflow SGD 285,000 to Malaysian real estate entity
- **STR-2026-MCB-1001** (filed by MCB) + **CMR-2026-0101** (filed at ICA Woodlands)

---

### Case 2 — Natalia Petrova (customer-1002)
**Bank: Sentosa Financial Group (SFG) · Typology: Cross-Border Layering / Sanctions Evasion · Score: 51.0**

Natalia Petrova is a Russian national permanently resident in Tehran, Iran. She opened a USD account (303) at SFG in August 2024 — an immediate red flag given her FATF High-Risk country residency combined with a different FATF-listed nationality.

Between October 2024 and June 2025, the account processes 7 SWIFT wire transfers totalling USD 2,455,000. The flow is a triangulation pattern spanning three FATF-risk jurisdictions:

- **Inflows (4 wires, USD 1,445,000):** From **Caspian Trade Partners LLC** (hotlist #33, Iran), **Persian Gulf Trading FZE** (Dubai), and **EuroAsia Commodities Ltd** (Cyprus). The Iranian entity is the dominant source.
- **Outflows (3 wires, USD 1,010,000):** All three sent to **North Star Resources Co.** (hotlist #34, Pyongyang, DPRK). Each inflow is followed by a DPRK-bound outflow within 7 days.

The Singapore account exists purely as a layering node: IRN → SGD → PRK. The CMR (CMR-2026-0102) adds a physical cash dimension — USD 207,500 declared at Changi Airport with the source (Caspian Trade Partners) and recipient (North Star Resources) matching the electronic wire counterparties exactly.

**Key evidence:**
- IRN → SG → PRK triangulation across 3 FATF jurisdictions
- Hotlist-linked counterparties on both inflow and outflow sides
- **STR-2026-SFG-1002** (filed by SFG) + **CMR-2026-0102** (filed at ICA Changi)

---

### Case 3 — Dragon Gate Pte Limited (customer-1003)
**Bank: Pacific Trade Bank (PTB) · Typology: Hub-and-Spoke / Corporate ML · Score: 60.0**

Dragon Gate Pte Limited (UEN 202300567W) was incorporated in February 2023. Its sole director, **Chen Jian Wei** (officer #201, 85% shareholder), is a Chinese national resident in Singapore. The company holds one operating account (304) at PTB.

The transaction data reveals a textbook hub-and-spoke pattern across 10 representative transactions (from a narrative total of 23 cycles):

**Spoke In (CN/HK → SG):** Shenzhen Golden Bridge Trading Co (3 inflows), HK Prosperity Ventures Ltd (2 inflows), Beijing Orient Capital Co Ltd (1 inflow)

**Spoke Out (SG → BVI/KY):** Crown Nominees BVI Ltd (3 outflows), Grand Cayman Holdings Ltd (2 outflows)

The retention rate is minimal: 95–98% of each inflow exits within 3–8 business days. The first inflow (USD 1,200,000) arrives just 47 days after incorporation. Total volume: USD 10,661,900 (narrative cumulative: SGD 18,500,000 over 23 cycles). No GST filings, no supply chain, no customer base — a transit shell.

**Key evidence:**
- 95–98% pass-through rate, 3–8 day turnover
- First transaction 47 days post-incorporation
- **STR-2026-PTB-1003** (filed by PTB) + **CMR-2026-0103** (filed at ICA Changi — director carried CNY 830k cash + HKD 1.2M bearer cheque)

---

### Case 4 — Lee Wei Jian (customer-1004)
**Bank: Sentosa Financial Group (SFG) · Typology: Sanctions Evasion — OFAC SDN Match · Score: 68.0**

Lee Wei Jian is a Singaporean national who operates a network of entities: **LWJ Holdings Pte Ltd** (company #700002, 100% owned) which holds a 60% stake in **Tanaka Precision Engineering KK** (company #700003, Japan). He holds a USD account (305) and an SGD account (306) at SFG.

The USD account processes 7 transactions totalling USD 8,850,000 between January and November 2025 in a circular pattern — PRC technology companies send money to Lee's account, and Lee sends it back to different PRC entities or to his own subsidiary:

| Direction | Counterparty | Volume |
|-----------|-------------|--------|
| Inflow | Dalian Precision Components Co (CN) | USD 1,250,000 |
| Outflow | Tanaka Precision Engineering (his 60% subsidiary) | USD 1,200,000 |
| Inflow | Guangzhou Tech Solutions Ltd (CN) | USD 1,100,000 |
| Outflow | Dalian Precision Components Co (CN) | USD 1,080,000 |
| Inflow | Shanghai United Trading Co (CN) | USD 1,350,000 |
| Outflow | Guangzhou Tech Solutions Ltd (CN) | USD 1,320,000 |
| Inflow | Shenzhen Microtech Co Ltd (CN) | USD 1,550,000 |

On 3 March 2026, an OFAC screening update flags Lee Wei Jian as **SDN-LEE-WJ-2025-0441** under Executive Order 13694 (Cyber-Related Sanctions). He appears on the hotlist as entry #35. Account frozen same day.

**Key evidence:**
- Circular PRC ↔ SG flows via 4 Chinese counterparties
- LWJ Holdings (100%) → Tanaka Precision (60%) ownership chain
- **STR-2026-SFG-1004** (filed by SFG) — pure electronic case, no CMR/CTR

---

### Case 5 — Synergy Asia Trading Pte Ltd (customer-1005)
**Bank: Pacific Trade Bank (PTB) · Typology: TBML / Precious Metals Mirror Trading · Score: 55.0**

Synergy Asia Trading Pte Ltd (UEN 201988432N) is a securities trading company, directed by **Michael Tan Eng Huat** (officer #203), with a Labuan-based 40% shareholder. It holds one trading account (307) at PTB.

Two distinct layers of suspicious activity:

**Layer 1 — Wire Cycling (6 transactions, USD 4,455,000):**
Three round-trip cycles between Labuan and Shanghai, with Singapore as transit:
- Cycle 1 (Apr 2025): Labuan USD 750k → SG → Shanghai USD 735k
- Cycle 2 (Jul 2025): Labuan USD 820k → SG → Shanghai USD 803.6k
- Cycle 3 (Nov 2025): Labuan USD 680k → SG → **Labuan** USD 666.4k (return to originator — circular nature exposed)

**Layer 2 — PSMD Mirror Trade (2 transactions, SGD 844,200):**
- 14 Feb 2026: Synergy pays SGD 450,000 cash to Meridian Precious Assets for 5 x 1kg gold bars
- 15 Feb 2026: Synergy sells 4 x 500g gold bars (different bars) back for SGD 394,200

The company accepts a SGD 55,800 loss (12.4%) with no commercial rationale. The 5th bar (~SGD 90,000) disappears. Buy/sell of different bars within 24 hours is a classic mirror trade.

**Key evidence:**
- Dual mechanism: electronic wire cycling + physical commodity conversion
- **STR-2026-PTB-1005** (filed by PTB) + **CTR-2026-0105** (filed by Meridian Precious Assets Pte Ltd)
- Neither institution alone sees the full picture — the STR+CTR cross-reference completes it

---

### Case 6 — Rajan Krishnamurthy (customer-1006)
**Bank: Meridian Capital Bank (MCB) · Typology: Dormant Account Reactivation / Trust Layering · Score: 45.0**

Rajan Krishnamurthy is an Indian national (passport Z4821957), retired, permanently resident in Singapore since 2017. His savings account (308) at MCB was opened in May 2017 and lay dormant for approximately 59 months.

After nearly 5 years of complete inactivity, account 308 springs to life in August 2025 with a SGD 450,000 SWIFT wire from the **Krishnamurthy Family Trust** in Port Louis, Mauritius. Over the next 7 months:

- **6 inflows** from Krishnamurthy Family Trust (Mauritius): SGD 450k, 380k, 420k, 350k, 480k, 400k = **SGD 2,480,000**
- **6 outflows** to an **Unnamed Indian Beneficiary** (Mumbai): SGD 436.5k, 368.6k, 407.4k, 339.5k, 465.6k, 388k = **SGD 2,405,600**

Pass-through rate: 97%. Each inflow is followed by an outflow to India within 3–5 business days. The Mauritius trust has no verifiable trust deed, no identified trustee, and no documented source of assets.

**Three-hop layering chain:** India (origin) → Mauritius trust (first hop) → Singapore dormant account (second hop) → India (return). The dormancy period was deliberate — the account was parked until needed.

**Key evidence:**
- 59 months dormancy → sudden SGD 2.48M inflow
- 97% pass-through, mechanical 3–5 day turnaround
- **STR-2026-MCB-1006** (filed by MCB) — pure wire layering, no CMR/CTR

---

### Case 7 — PT Global Trade Solutions / Pyongyang Tech Export Co. (customer-1007)
**Bank: Changi Commercial Bank (CCB) · Typology: Proliferation Financing — WMD-Related · Score: 79.0 · CRITICAL**

PT Global Trade Solutions is a Singapore-registered front entity for **Pyongyang Tech Export Co.**, a DPRK state-linked procurement operation. Business registration number KP-2019-88412 — the "KP" prefix indicates North Korean origin. Its director is **Kim Sung Jin** (officer #204, hotlist #37), a DPRK national.

Between June 2024 and October 2025, account 309 at CCB processes 10 SWIFT transactions totalling USD 5,056,400 in a procurement pipeline:

- **Inflows (5 wires, USD 2,850,000):** All from **Dalian Orient Forwarding Agent** (Dalian, Liaoning, China) — a known hub for DPRK-linked trade given its proximity to the North Korean border.
- **Outflows (5 wires, USD 2,206,400):** All to **Gulf Technology Holdings LLC** (company #700006, Dubai) — the intermediate procurement layer before components reach Iran.

Retention rate (2% per cycle) is consistent with commission, not legitimate trading. The hotlist contains two directly relevant entries:
- **#36 — Korea Ryonbong General Corporation** (UNSC Res 1718 designated WMD proliferator) — the ultimate source of funds
- **#37 — Kim Sung Jin** — the company director who physically carried USD 250,000 into Singapore and declared Ryonbong as the source on the CMR form

This is the most severe case in the batch. The CMR declaration constitutes direct evidence of a sanctions violation.

**Key evidence:**
- CN (Dalian) → SG → UAE (Dubai) procurement pipeline
- Company alias: Pyongyang Tech Export Co. (alternative_names.csv)
- **STR-2026-CCB-1007** (filed by CCB) + **CMR-2026-0107** (filed at ICA Changi — carrier named UNSC-designated entity as fund source on government form)

---

### Case 8 — Tan Mei Ling (customer-1008)
**Bank: Raffles Banking Corporation (RBC) · Typology: Fraud / Money Mule — Scam Proceeds Layering · Score: 40.0**

Tan Mei Ling is a Singaporean administrative assistant (NRIC S9504872D, born 1995). She holds two accounts at RBC — current (310) and savings (311) — both now **Cancelled** with Fraud Flag after SPF CID opened a scam investigation.

Between October 2025 and January 2026, account 310 processes 13 transactions totalling SGD 465,750:

**Inflows (7 transfers, SGD 247,500):** Round-amount PayNow and FAST transfers from 7 unrelated individuals across 4 banks:

| Sender | Channel | Amount |
|--------|---------|-------:|
| Individual A | PayNow | SGD 35,000 |
| Individual B | FAST | SGD 40,000 |
| Individual C | UOB (confirmed scam victim) | SGD 25,000 |
| Individual D | PayNow | SGD 30,000 |
| Individual E | FAST | SGD 45,000 |
| Individual F | DBS | SGD 50,000 |
| Individual G | OCBC | SGD 22,500 |

**Outflows (6 ATM withdrawals, SGD 218,250):** Within 1–5 days of each receipt, ~97% is withdrawn as cash.

Every inflow is a round number. The senders span multiple banks with no connection to each other or to Tan Mei Ling — consistent with scam victims directed to send money to a mule account.

The CTR adds a second liquidation channel: 3 pawn transactions at Golden Link Pawnbrokers totalling SGD 16,500 for luxury jewellery inconsistent with an administrative assistant's income profile, likely received as mule recruitment payment.

**Key evidence:**
- 7 unrelated senders, all round amounts → 97% immediate cash-out
- Accounts cancelled with Fraud Flag, SPF CID referral CID-SCAM-2026-REF-8812
- **STR-2026-RBC-1008** (filed by RBC) + **CTR-2026-0108** (filed by Golden Link Pawnbrokers Pte Ltd)

---

### Case 9 — Ong Bee Lian (customer-1009)
**Bank: Meridian Capital Bank (MCB) · Typology: Low Risk — Geographic Flag · Score: 4.0**

Ong Bee Lian is a retired Singaporean schoolteacher (NRIC S7534210B, born 1975). She holds one savings account (401) at MCB's Jurong East branch.

The sole trigger is a geographic risk flag for Indonesia — she sends regular monthly remittances of SGD 6,000 to her sister (Ong Mei Hua) in Jakarta via online banking. The pattern has been consistent for over 2 years. No behavioural anomalies, no structuring patterns, no adverse media, no sanctions matches. Score of 4.0 is well below the active triage threshold.

**Key evidence:**
- 2 monthly remittances of SGD 6,000 each — routine family support
- **STR-2026-MCB-1009** (filed by MCB) — precautionary filing, minimal risk
- Expected auto-route: HIBERNATED (score 4.0 < 10)

---

### Case 10 — Sunrise Wellness Pte Ltd (customer-1010)
**Bank: Sentosa Financial Group (SFG) · Typology: Low Risk — Minor Geographic + Round Amount · Score: 8.0**

Sunrise Wellness Pte Ltd (UEN 202008876W) is a Singapore-incorporated health supplements wholesaler with a 6-year operating history. Director **Koh Chee Wai** (officer #205). It holds one business current account (402) at SFG's Toa Payoh branch.

The company makes regular quarterly payments of exactly SGD 12,000 to its established Cambodian supplier (Khmer Health Supplies Co. in Phnom Penh). The mild geographic flag (Cambodia) and minor round-amount pattern (31% ratio, 4 transactions) are the only triggers. No structuring, no layering, no adverse media, no sanctions matches. Score of 8.0 is below the active triage threshold.

**Key evidence:**
- 4 quarterly payments of SGD 12,000 to Cambodian supplier — normal wholesale trade
- **STR-2026-SFG-1010** (filed by SFG) — precautionary filing, minimal risk
- Expected auto-route: HIBERNATED (score 8.0 < 10)

---

### Case 11 — Viktor Lazarev (customer-1011)
**Bank: Changi Commercial Bank (CCB) · Typology: Sanctions Evasion / Proliferation Financing / PEP Corruption · Score: 156.0 · CRITICAL**

Viktor Andreyevich Lazarev is a Russian national and former Deputy Minister of Industry and Trade — a confirmed PEP. His spouse Irina Lazareva sits on the board of a Gazprom subsidiary. He holds two accounts: a personal USD account (501) at CCB's Marina Bay branch and a corporate EUR account (502) under Lazarev Holdings Pte Ltd at MCB's Orchard branch.

The AML system flagged direct financial flows linked to two sanctioned entities: (1) **Rostec State Corporation** (OFAC SDN, hotlist #38) traced through Cypriot shell Volga Industrial Holdings SA, and (2) **Promtechnologia LLC** (EU Consolidated Sanctions, hotlist #39) which sent EUR 1,800,000 directly into the corporate account.

Fund movements exhibit multi-layered sanctions evasion: inflows from sanctioned/opaque sources → brief transit (avg 1.8hr holding) → outflows to BVI, UAE free zones, Hong Kong, and Swiss family trust. The UAE recipient (Precision Dynamics FZE) received cumulative USD 1,580,000 for "precision machining components" — dual-use goods. Named in OCCRP investigation (2025) and Pandora Papers, revealing 7-layer ownership across Russia, Cyprus, BVI, Switzerland, UAE, Hong Kong, and Singapore.

Score exceeds 150 due to duplicate score hits from two sanctioned entities firing independently.

**Key evidence:**
- Direct flows from 2 sanctioned entities (Rostec, Promtechnologia) — cumulative exposure
- 7-layer ownership, 14-spoke hub-and-spoke network, centrality 0.97
- **STR-2026-CCB-1011** (filed by CCB) + **CMR-2026-0111** (filed at ICA Changi — USD 185,000 from Moscow via Dubai)
- Expected auto-route: PRIORITY (score 156.0 > 150)

---

### Case 12 — Golden Phoenix International Ltd (customer-1012)
**Bank: Pacific Trade Bank (PTB) · Typology: Sanctions Evasion / Military-Linked Shell / TBML · Score: 151.0 · CRITICAL**

Golden Phoenix International Ltd (Labuan reg LL-2023-18876) is a jade and timber trading company incorporated November 2023. UBO is **Gen. (Ret.) Aung Kyaw Moe** (officer #206), a retired Myanmar military general (PEP). It holds a trade finance account (601) at PTB's Shenton Way branch, and its subsidiary Phoenix Jade Trading Pte Ltd (company #700009) holds a business current account (602) at MCB's Chinatown branch.

Direct financial flows from two sanctioned entities: (1) **MEHL** (OFAC SDN, hotlist #40) sent USD 1,200,000, and (2) **Myanmar Gems Enterprise** (UNSC, hotlist #41) sent USD 850,000. Combined sanctioned exposure: USD 2,050,000.

Trade-based ML through jade and timber: sanctioned Myanmar inflows transit Singapore → jade processors in Yunnan (China) and timber traders in Thailand. Invoice discrepancies: jade 55%, timber 48%. Subsidiary (Phoenix Jade Trading) with same nominee director (Zaw Min Tun, officer #207) and BVI ownership provides layering. 11-spoke hub-and-spoke network, centrality 0.94.

Score exceeds 150 due to duplicate hits from two sanctioned entities and subsidiary shell company.

**Key evidence:**
- Direct flows from 2 sanctioned entities (MEHL, Myanmar Gems Enterprise)
- 6-layer ownership across 4 jurisdictions, subsidiary shell with BVI ownership
- **STR-2026-PTB-1012** (filed by PTB) + **CMR-2026-0112** (filed at ICA Changi — USD 250,000 from Yangon via Bangkok)
- Expected auto-route: PRIORITY (score 151.0 > 150)

---

## Cross-Case Patterns

| Pattern | Cases | Evidence |
|---------|-------|---------|
| CMR + STR (physical cash + electronic wires) | 1001, 1002, 1003, 1007, 1011, 1012 | CMR declarations at ICA corroborate SWIFT flows filed by banks |
| CTR + STR (PSMD/pawnbroker + bank) | 1005, 1008 | CTR from non-bank institution links to bank-filed STR |
| STR only (pure electronic) | 1004, 1006, 1009, 1010 | No physical cash component |
| Multi-institution intelligence | 1005, 1008, 1011, 1012 | FIU cross-references reports from different institution types |
| FATF high-risk jurisdiction | 1002, 1007, 1011, 1012 | Customer residence (IR, KP, RU, MM) or registration |
| UNSC/OFAC sanctions nexus | 1002, 1004, 1007, 1011, 1012 | Hotlist entries #33–41 |
| Corporate shell / front entity | 1003, 1005, 1007, 1011, 1012 | Companies with shell indicators across multiple banks |
| Circular flow / round-trip | 1004, 1005 | Same counterparties appear on both sides |
| Trust / offshore layering | 1003, 1006, 1011 | Mauritius trust, BVI/KY nominees, Swiss family trust |
| Trade-based money laundering | 1003, 1005, 1007, 1011, 1012 | Invoice discrepancies, over-invoicing, commodity-based ML |
| PEP exposure | 1002, 1004, 1007, 1011, 1012 | Politically exposed persons across 5 cases |
| Dormant account trigger | 1006 | 59 months inactivity → sudden high-value reactivation |
| Money mule / scam proceeds | 1008 | Multiple unrelated senders → immediate cash-out |
| Structuring below threshold | 1001 | 13 deposits, all < SGD 10,000 |
| PRIORITY auto-route (score >150) | 1011, 1012 | Duplicate score hits from multiple data sources |
| HIBERNATED auto-route (score <10) | 1009, 1010 | Minimal risk — geographic flags only |

---

## Account Data in STR Tab II

Bank account information is **not** a separate upstream file. From the FIU's perspective, account details arrive embedded within the STR filing submitted by each reporting bank. Each STR's `tabII_accountInformation` contains:

| Field | Source (original CSV column) | Description |
|-------|------------------------------|-------------|
| `accountNumber` | — | Bank's regulatory reference (e.g., `MCB-001-00441122`) |
| `bankInternalAccountId` | `prim_acc_no` | Bank's internal account ID (301–311) for RFI traceability |
| `accountHolderName` | `composite_acc_name` | Account holder name as registered |
| `accountType` | — | Current, Savings, Fixed Deposit, FCA |
| `currency` | — | SGD, USD |
| `openingDate` | `acc_opened_dt` | Account opening date |
| `closingDate` | `acc_closed_dt` | Account closing date (if applicable) |
| `accountStatus` | `acc_stat` | Active, Cancelled, Blocked — enriched with regulatory context |
| `productType` | — | Product classification |
| `branch` | `acc_district` | Servicing branch district |
| `relationshipManager` | `rel_mngr_name` | RM name (for RFI contact) |
| `bankRiskRating` | `acc_risk_rtng` | Bank's internal risk rating of the account |
| `amlAlertTriggered` | `aml_alr_flg` | Whether the bank's AML system flagged this account |
| `priorFilingCount` | `sar_count` | Number of previous STRs/SARs filed on this account |
| `contactNumber` | `tel_no` | Customer contact number |

### Account-to-STR Mapping

| Bank Internal ID | STR | Role | Bank |
|:---:|---|---|---|
| 301 | STR-2026-MCB-1001 | Primary | MCB |
| 302 | STR-2026-MCB-1001 | Additional (FD) | MCB |
| 303 | STR-2026-SFG-1002 | Primary | SFG |
| 304 | STR-2026-PTB-1003 | Primary (×2 accounts) | PTB |
| 305 | STR-2026-SFG-1004 | Primary (USD) | SFG |
| 306 | STR-2026-SFG-1004 | Additional (SGD) | SFG |
| 307 | STR-2026-PTB-1005 | Primary (×2 accounts) | PTB |
| 308 | STR-2026-MCB-1006 | Primary | MCB |
| 309 | STR-2026-CCB-1007 | Primary | CCB |
| 310 | STR-2026-RBC-1008 | Current | RBC |
| 311 | STR-2026-RBC-1008 | Savings | RBC |
| 401 | STR-2026-MCB-1009 | Primary | MCB |
| 402 | STR-2026-SFG-1010 | Primary | SFG |
| 501 | STR-2026-CCB-1011 | Primary (USD) | CCB |
| 502 | STR-2026-CCB-1011 | Additional (EUR) | MCB |
| 601 | STR-2026-PTB-1012 | Primary (Trade Finance) | PTB |
| 602 | STR-2026-PTB-1012 | Additional (Subsidiary) | MCB |

---

## Person Case Class (person.json)

The 7 individual customers (excluding 5 corporates) are also represented in `customer/raw/json/person.json` following the Quantexa Person case class schema. This provides structured name parsing, date-of-birth decomposition, and address parsing that the flat CSV cannot express.

| Field | Description |
|-------|-------------|
| `personId` | Customer ID (1001–1011) |
| `individualName` | Full name as `Seq[String]` |
| `parsedIndividualName` | Structured: `initials`, `forename`, `familyName`, `maidenName` |
| `gender` | M / F |
| `countryOfBirth` | ISO country code (added — not in original CSV) |
| `nationality` | ISO country code |
| `taxResidency` | Inferred from `residence_ctry` |
| `dateOfBirth` | ISO date string |
| `parsedDateOfBirth` | Decomposed: `year`, `month`, `day` |
| `identificationNumber` | NRIC / Passport number |
| `identificationCountryOfRegistration` | Country of ID issuance |
| `identificationNumberType` | `NRIC` or `PASSPORT` |
| `address` | `Seq[Address]` with parsed block, street, floor, unit, postal code |

Corporates (1003, 1005, 1007, 1010, 1012) are not included — they require a separate Business case class model.

---

## Schema Reference

All CSV files follow the exact column schemas from `pe_data/` (the Quantexa platform's production data format):

| File | Schema Source | Columns |
|------|-------------|:-------:|
| `acc_to_cus.csv` | `pe_data/customer/raw/csv/acc_to_cus.csv` | 9 |
| `transactions.csv` | `pe_data/transaction/raw/csv/transactions.csv` | 26 |
| `hotlist.csv` | `pe_data/hotlist/raw/csv/hotlist.csv` | 6 |
| `companies.csv` | `pe_data/opencorporatesFixtures/raw/csv/companies.csv` | 42 |
| `officers.csv` | `pe_data/opencorporatesFixtures/raw/csv/officers.csv` | 26 |
| `relationships.csv` | `pe_data/opencorporatesFixtures/raw/csv/relationships.csv` | 19 |
| `alternative_names.csv` | `pe_data/opencorporatesFixtures/raw/csv/alternative_names.csv` | 6 |
| `additional_identifiers.csv` | `pe_data/opencorporatesFixtures/raw/csv/additional_identifiers.csv` | 4 |
| `non_reg_addresses.csv` | `pe_data/opencorporatesFixtures/raw/csv/non_reg_addresses.csv` | 12 |

> **Retired schemas:**
> - `customer.csv` (21 columns from `pe_data/customer/raw/csv/customer.csv`) — replaced by `person.json` for individuals + `opencorporates/companies.csv` for corporates + STR Tab III for entity information.
> - `account.csv` (18 columns from `pe_data/customer/raw/csv/account.csv`) — embedded in STR Tab II. See [Account Data in STR Tab II](#account-data-in-str-tab-ii).
