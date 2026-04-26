#!/usr/bin/env python3
"""
Generate mock TasksToLoad entries covering 8 different financial crime types,
fusing in scores from the Reference_Scores_DRAFT catalog.
Also generates an associated STR (Suspicious Transaction Report) document.
"""

import json

mock_tasks = [
  # ─────────────────────────────────────────────────────────
  # Task 1: STRUCTURING
  # Scores: StructuringRelationship, RoundAmountsCustomer,
  #          NumericIrregularitiesCustomer
  # ─────────────────────────────────────────────────────────
  {
    "_1": {
      "subjectScorecard": {
        "subjectId": {"type": "customer", "value": "1001"},
        "scorecardVersion": {"name": "2.6.0", "index": 12, "description": None},
        "overallScore": 52.0,
        "scoreSummary": [
          [
            {"value": "StructuringRelationship"},
            {
              "severity": 3.0,
              "candidateContribution": 6.0,
              "contribution": 6.0,
              "contributionIndicator": "Max contribution in group",
              "contributesToOverallScore": True,
              "weighting": 2.0,
              "scoreHitId": {
                "scoreId": {"value": "StructuringRelationship"},
                "uniqueKeyOfScoredDataAsString": "customer-1001"
              },
              "version": {"name": "2.6.0", "index": 12, "description": None},
              "relatedStrings": [
                ["scoreBand", "High"],
                ["customerIdAndName__name", "Ahmad Bin Sulaiman"],
                ["customerIdAndName__id__type", "customer"],
                ["customerIdAndName__id__value", "1001"],
                ["windowRatio", "0.82"],
                ["group", "RelationshipStructuring"]
              ],
              "relatedDates": [],
              "relatedNumbers": [
                ["windowRatio", 0.82],
                ["transactionCount", 31.0],
                ["averageTransactionValue", 9800.0]
              ],
              "relatedScoreHits": [],
              "relatedDocuments": [{"type": "customer", "value": "1001"}],
              "relatedEntities": [],
              "relatedEntitiesRecords": None,
              "relatedEdges": [],
              "relatedPaths": [],
              "rankedPaths": None,
              "relatedForeignDocuments": None
            }
          ],
          [
            {"value": "RoundAmountsCustomer"},
            {
              "severity": 2.0,
              "candidateContribution": 3.0,
              "contribution": 3.0,
              "contributionIndicator": "Max contribution in group",
              "contributesToOverallScore": True,
              "weighting": 1.5,
              "scoreHitId": {
                "scoreId": {"value": "RoundAmountsCustomer"},
                "uniqueKeyOfScoredDataAsString": "customer-1001"
              },
              "version": {"name": "2.6.0", "index": 12, "description": None},
              "relatedStrings": [
                ["scoreBand", "High"],
                ["customerIdAndName__name", "Ahmad Bin Sulaiman"],
                ["windowRatio", "0.76"],
                ["group", "CustomerRoundAmount"]
              ],
              "relatedDates": [],
              "relatedNumbers": [["windowRatio", 0.76], ["roundTransactionCount", 24.0]],
              "relatedScoreHits": [],
              "relatedDocuments": [{"type": "customer", "value": "1001"}],
              "relatedEntities": [],
              "relatedEntitiesRecords": None,
              "relatedEdges": [],
              "relatedPaths": [],
              "rankedPaths": None,
              "relatedForeignDocuments": None
            }
          ],
          [
            {"value": "NumericIrregularitiesCustomer"},
            {
              "severity": 2.0,
              "candidateContribution": 2.0,
              "contribution": 2.0,
              "contributionIndicator": "No grouping applied",
              "contributesToOverallScore": True,
              "weighting": 1.0,
              "scoreHitId": {
                "scoreId": {"value": "NumericIrregularitiesCustomer"},
                "uniqueKeyOfScoredDataAsString": "customer-1001"
              },
              "version": {"name": "2.6.0", "index": 12, "description": None},
              "relatedStrings": [
                ["scoreBand", "High"],
                ["confidenceLevel", "0.025"],
                ["group", "CustomerIrregularity"]
              ],
              "relatedDates": [],
              "relatedNumbers": [["confidenceLevel", 0.025], ["benfordDeviation", 0.18]],
              "relatedScoreHits": [],
              "relatedDocuments": [{"type": "customer", "value": "1001"}],
              "relatedEntities": [],
              "relatedEntitiesRecords": None,
              "relatedEdges": [],
              "relatedPaths": [],
              "rankedPaths": None,
              "relatedForeignDocuments": None
            }
          ]
        ],
        "relatedScoresSummary": [],
        "relatedScores": []
      },
      "related1": [],
      "alertingRunTime": "2026-03-03T00:40:56.089168"
    },
    "_2": {
      "subjectId": "customer-1001",
      "jurisdiction": "SG",
      "name": "Ahmad Bin Sulaiman",
      "scorecardOverallScore": 52.0,
      "alertingAuditDetails": {
        "subjectId": "customer-1001",
        "alertingRunTime": "2026-03-03 at 08:40:56 SGT",
        "subjectAlert": True,
        "subjectMostRecentAlertTime": "2026-03-03 at 08:40:56 SGT",
        "alertReason": [
          {
            "stepReference": "RedFlagScenarioTriggeredAndNotRecentlyAlerted",
            "moduleDecision": "Alert",
            "decisionReason": "Subject level score(s) StructuringRelationship (from the selected scores) were found in this Scorecard meeting the following condition: there is no historical Scorecard which raised an Alert and included the score.",
            "subjectLevelScores": ["StructuringRelationship\u00ac\u00accustomer-1001"],
            "relatedScores": []
          }
        ],
        "alertDescription": "Customer is making repeated cash transactions consistently below the SGD 10,000 reporting threshold (avg SGD 9,800). Structuring window ratio 82%, round amounts ratio 76% across 24 transactions, with Benford's Law deviation of 0.18 (confidence level 0.025). Indicators consistent with deliberate cash structuring to avoid reporting requirements."
      }
    },
    "_3": "BINARY_GRAPH_PLACEHOLDER_CUSTOMER_1001"
  },

  # ─────────────────────────────────────────────────────────
  # Task 2: HIGH RISK GEOGRAPHY / SANCTIONS EVASION
  # Scores: CustomerFromHighRiskCountry,
  #          CustomerHasTransactionWithDifferentJurisdictions,
  #          CustomerHasTransactionWithListedCurrency
  # ─────────────────────────────────────────────────────────
  {
    "_1": {
      "subjectScorecard": {
        "subjectId": {"type": "customer", "value": "1002"},
        "scorecardVersion": {"name": "2.6.0", "index": 12, "description": None},
        "overallScore": 45.0,
        "scoreSummary": [
          [
            {"value": "CustomerFromHighRiskCountry"},
            {
              "severity": 3.0,
              "candidateContribution": 6.0,
              "contribution": 6.0,
              "contributionIndicator": "Max contribution in group",
              "contributesToOverallScore": True,
              "weighting": 2.0,
              "scoreHitId": {
                "scoreId": {"value": "CustomerFromHighRiskCountry"},
                "uniqueKeyOfScoredDataAsString": "customer-1002"
              },
              "version": {"name": "2.6.0", "index": 12, "description": None},
              "relatedStrings": [
                ["scoreBand", "High"],
                ["residenceCountry", "IRN"],
                ["customerIdAndName__name", "Natalia Petrova"],
                ["customerIdAndName__id__type", "customer"],
                ["customerIdAndName__id__value", "1002"],
                ["riskCategory", "FATF High Risk"]
              ],
              "relatedDates": [],
              "relatedNumbers": [],
              "relatedScoreHits": [],
              "relatedDocuments": [{"type": "customer", "value": "1002"}],
              "relatedEntities": [],
              "relatedEntitiesRecords": None,
              "relatedEdges": [],
              "relatedPaths": [],
              "rankedPaths": None,
              "relatedForeignDocuments": None
            }
          ],
          [
            {"value": "CustomerHasTransactionWithDifferentJurisdictions"},
            {
              "severity": 3.0,
              "candidateContribution": 4.5,
              "contribution": 4.5,
              "contributionIndicator": "No grouping applied",
              "contributesToOverallScore": True,
              "weighting": 1.5,
              "scoreHitId": {
                "scoreId": {"value": "CustomerHasTransactionWithDifferentJurisdictions"},
                "uniqueKeyOfScoredDataAsString": "customer-1002"
              },
              "version": {"name": "2.6.0", "index": 12, "description": None},
              "relatedStrings": [
                ["scoreBand", "High"],
                ["jurisdictionRiskCategory", "FATF Black Listed"],
                ["counterpartyCountry", "PRK"],
                ["group", "CrossBorderTransaction"]
              ],
              "relatedDates": [],
              "relatedNumbers": [["transactionCount", 5.0], ["totalValue", 287500.0]],
              "relatedScoreHits": [],
              "relatedDocuments": [{"type": "aggregatedtransaction", "value": "104|20831"}],
              "relatedEntities": [],
              "relatedEntitiesRecords": None,
              "relatedEdges": [],
              "relatedPaths": [],
              "rankedPaths": None,
              "relatedForeignDocuments": None
            }
          ],
          [
            {"value": "CustomerHasTransactionWithListedCurrency"},
            {
              "severity": 2.0,
              "candidateContribution": 2.0,
              "contribution": 2.0,
              "contributionIndicator": "No grouping applied",
              "contributesToOverallScore": True,
              "weighting": 1.0,
              "scoreHitId": {
                "scoreId": {"value": "CustomerHasTransactionWithListedCurrency"},
                "uniqueKeyOfScoredDataAsString": "customer-1002"
              },
              "version": {"name": "2.6.0", "index": 12, "description": None},
              "relatedStrings": [
                ["scoreBand", "Medium"],
                ["currency", "USD"],
                ["currencyRiskCategory", "Listed Currency"],
                ["group", "ListedCurrency"]
              ],
              "relatedDates": [],
              "relatedNumbers": [["transactionValue", 287500.0]],
              "relatedScoreHits": [],
              "relatedDocuments": [{"type": "aggregatedtransaction", "value": "104|20831"}],
              "relatedEntities": [],
              "relatedEntitiesRecords": None,
              "relatedEdges": [],
              "relatedPaths": [],
              "rankedPaths": None,
              "relatedForeignDocuments": None
            }
          ]
        ],
        "relatedScoresSummary": [],
        "relatedScores": []
      },
      "related1": [],
      "alertingRunTime": "2026-03-03T00:40:56.089168"
    },
    "_2": {
      "subjectId": "customer-1002",
      "jurisdiction": "SG",
      "name": "Natalia Petrova",
      "scorecardOverallScore": 45.0,
      "alertingAuditDetails": {
        "subjectId": "customer-1002",
        "alertingRunTime": "2026-03-03 at 08:40:56 SGT",
        "subjectAlert": True,
        "subjectMostRecentAlertTime": "2026-03-03 at 08:40:56 SGT",
        "alertReason": [
          {
            "stepReference": "RedFlagScenarioTriggeredAndNotRecentlyAlerted",
            "moduleDecision": "Alert",
            "decisionReason": "Customer from high-risk FATF-listed country (Iran) conducting 5 transactions totalling SGD 287,500 with counterparties in North Korea (FATF Blacklisted jurisdiction). Currency denomination in USD (Listed Currency).",
            "subjectLevelScores": ["CustomerFromHighRiskCountry\u00ac\u00accustomer-1002"],
            "relatedScores": []
          }
        ],
        "alertDescription": "Customer Natalia Petrova is domiciled in Iran (FATF High Risk). She has conducted 5 transactions totalling SGD 287,500 with counterparties in North Korea (FATF Blacklisted). All transactions denominated in USD (Listed Currency). Pattern indicative of sanctions evasion through Singapore as a conduit jurisdiction."
      }
    },
    "_3": "BINARY_GRAPH_PLACEHOLDER_CUSTOMER_1002"
  },

  # ─────────────────────────────────────────────────────────
  # Task 3: RAPID MOVEMENT OF FUNDS / HUB AND SPOKE (Layering)
  # Scores: RapidMovementOfFundsCustomer, HubAndSpoke,
  #          TransactionReturnedInShortTime
  # ─────────────────────────────────────────────────────────
  {
    "_1": {
      "subjectScorecard": {
        "subjectId": {"type": "customer", "value": "1003"},
        "scorecardVersion": {"name": "2.6.0", "index": 12, "description": None},
        "overallScore": 63.5,
        "scoreSummary": [
          [
            {"value": "RapidMovementOfFundsCustomer"},
            {
              "severity": 3.0,
              "candidateContribution": 7.5,
              "contribution": 7.5,
              "contributionIndicator": "Max contribution in group",
              "contributesToOverallScore": True,
              "weighting": 2.5,
              "scoreHitId": {
                "scoreId": {"value": "RapidMovementOfFundsCustomer"},
                "uniqueKeyOfScoredDataAsString": "customer-1003"
              },
              "version": {"name": "2.6.0", "index": 12, "description": None},
              "relatedStrings": [
                ["scoreBand", "High"],
                ["customerIdAndName__name", "Dragon Gate Pte Limited"],
                ["customerIdAndName__id__type", "customer"],
                ["customerIdAndName__id__value", "1003"],
                ["windowRatio", "0.89"],
                ["group", "CustomerRapidMovement"]
              ],
              "relatedDates": [],
              "relatedNumbers": [
                ["windowRatio", 0.89],
                ["averageTurnoverHours", 6.2],
                ["netFundRetained", 1200.0]
              ],
              "relatedScoreHits": [],
              "relatedDocuments": [{"type": "customer", "value": "1003"}],
              "relatedEntities": [],
              "relatedEntitiesRecords": None,
              "relatedEdges": [],
              "relatedPaths": [],
              "rankedPaths": None,
              "relatedForeignDocuments": None
            }
          ],
          [
            {"value": "HubAndSpoke"},
            {
              "severity": 3.0,
              "candidateContribution": 6.0,
              "contribution": 6.0,
              "contributionIndicator": "Max contribution in group",
              "contributesToOverallScore": True,
              "weighting": 2.0,
              "scoreHitId": {
                "scoreId": {"value": "HubAndSpoke"},
                "uniqueKeyOfScoredDataAsString": "customer-1003"
              },
              "version": {"name": "2.6.0", "index": 12, "description": None},
              "relatedStrings": [
                ["scoreBand", "High"],
                ["hubPattern", "Inward Aggregation Outward Dispersion"],
                ["spokeCount", "14"],
                ["group", "CustomerHubSpoke"]
              ],
              "relatedDates": [],
              "relatedNumbers": [
                ["spokeCount", 14.0],
                ["totalInflowValue", 1850000.0],
                ["totalOutflowValue", 1847500.0],
                ["retentionRatio", 0.0014]
              ],
              "relatedScoreHits": [],
              "relatedDocuments": [{"type": "customer", "value": "1003"}],
              "relatedEntities": [],
              "relatedEntitiesRecords": None,
              "relatedEdges": [],
              "relatedPaths": [],
              "rankedPaths": None,
              "relatedForeignDocuments": None
            }
          ],
          [
            {"value": "TransactionReturnedInShortTime"},
            {
              "severity": 1.0,
              "candidateContribution": 1.0,
              "contribution": 1.0,
              "contributionIndicator": "No grouping applied",
              "contributesToOverallScore": True,
              "weighting": 1.0,
              "scoreHitId": {
                "scoreId": {"value": "TransactionReturnedInShortTime"},
                "uniqueKeyOfScoredDataAsString": "customer-1003|aggregatedtransaction-556|89"
              },
              "version": {"name": "2.6.0", "index": 12, "description": None},
              "relatedStrings": [
                ["scoreBand", "Medium"],
                ["returnedWithinHours", "3.5"],
                ["group", "ReturnedBehaviour"]
              ],
              "relatedDates": [],
              "relatedNumbers": [["returnedWithinHours", 3.5], ["transactionValue", 95000.0]],
              "relatedScoreHits": [],
              "relatedDocuments": [{"type": "aggregatedtransaction", "value": "556|20887"}],
              "relatedEntities": [],
              "relatedEntitiesRecords": None,
              "relatedEdges": [],
              "relatedPaths": [],
              "rankedPaths": None,
              "relatedForeignDocuments": None
            }
          ]
        ],
        "relatedScoresSummary": [],
        "relatedScores": []
      },
      "related1": [],
      "alertingRunTime": "2026-03-03T00:40:56.089168"
    },
    "_2": {
      "subjectId": "customer-1003",
      "jurisdiction": "SG",
      "name": "Dragon Gate Pte Limited",
      "scorecardOverallScore": 63.5,
      "alertingAuditDetails": {
        "subjectId": "customer-1003",
        "alertingRunTime": "2026-03-03 at 08:40:56 SGT",
        "subjectAlert": True,
        "subjectMostRecentAlertTime": "2026-03-03 at 08:40:56 SGT",
        "alertReason": [
          {
            "stepReference": "RedFlagScenarioTriggeredAndNotRecentlyAlerted",
            "moduleDecision": "Alert",
            "decisionReason": "Subject level score(s) RapidMovementOfFundsCustomer and HubAndSpoke (from the selected scores) were found in this Scorecard meeting the following condition: there is no historical Scorecard which raised an Alert and included the score.",
            "subjectLevelScores": [
              "RapidMovementOfFundsCustomer\u00ac\u00accustomer-1003",
              "HubAndSpoke\u00ac\u00accustomer-1003"
            ],
            "relatedScores": []
          }
        ],
        "alertDescription": "Corporate entity Dragon Gate Pte Limited displays hub-and-spoke pattern across 14 spoke accounts with rapid fund turnover averaging 6.2 hours. Total inflow SGD 1,850,000, outflow SGD 1,847,500, retaining only 0.14%. One transaction of SGD 95,000 was returned within 3.5 hours. Pattern consistent with layering through corporate account structure."
      }
    },
    "_3": "BINARY_GRAPH_PLACEHOLDER_CUSTOMER_1003"
  },

  # ─────────────────────────────────────────────────────────
  # Task 4: SANCTIONS / HOTLIST MATCH
  # Scores: CustomerIndirectLinkToHotlistRanked,
  #         HighRiskCustomerDiscrete
  # ─────────────────────────────────────────────────────────
  {
    "_1": {
      "subjectScorecard": {
        "subjectId": {"type": "customer", "value": "1004"},
        "scorecardVersion": {"name": "2.6.0", "index": 12, "description": None},
        "overallScore": 78.0,
        "scoreSummary": [
          [
            {"value": "CustomerIndirectLinkToHotlistRanked"},
            {
              "severity": 3.0,
              "candidateContribution": 9.0,
              "contribution": 9.0,
              "contributionIndicator": "Max contribution in group",
              "contributesToOverallScore": True,
              "weighting": 3.0,
              "scoreHitId": {
                "scoreId": {"value": "CustomerIndirectLinkToHotlistRanked"},
                "uniqueKeyOfScoredDataAsString": "customer-1004|hotlist-UAE2291"
              },
              "version": {"name": "2.6.0", "index": 12, "description": None},
              "relatedStrings": [
                ["scoreBand", "High"],
                ["hotlistSource", "OFAC SDN"],
                ["hotlistEntityName", "Mohammed Al-Rashid Trading LLC"],
                ["customerIdAndName__name", "Lee Wei Jian"],
                ["customerIdAndName__id__type", "customer"],
                ["customerIdAndName__id__value", "1004"],
                ["linkedPath", "customer-1004 -> business-559 -> hotlist-UAE2291"]
              ],
              "relatedDates": [],
              "relatedNumbers": [["pathLength", 2.0], ["pathInfluenceScore", 0.87]],
              "relatedScoreHits": [],
              "relatedDocuments": [{"type": "customer", "value": "1004"}],
              "relatedEntities": [],
              "relatedEntitiesRecords": None,
              "relatedEdges": [],
              "relatedPaths": [],
              "rankedPaths": None,
              "relatedForeignDocuments": None
            }
          ],
          [
            {"value": "HighRiskCustomerDiscrete"},
            {
              "severity": 3.0,
              "candidateContribution": 6.0,
              "contribution": 6.0,
              "contributionIndicator": "No grouping applied",
              "contributesToOverallScore": True,
              "weighting": 2.0,
              "scoreHitId": {
                "scoreId": {"value": "HighRiskCustomerDiscrete"},
                "uniqueKeyOfScoredDataAsString": "customer-1004"
              },
              "version": {"name": "2.6.0", "index": 12, "description": None},
              "relatedStrings": [
                ["scoreBand", "High"],
                ["customerRiskRating", "High"],
                ["customerIdAndName__name", "Lee Wei Jian"]
              ],
              "relatedDates": [],
              "relatedNumbers": [["internalRiskScore", 4.0]],
              "relatedScoreHits": [],
              "relatedDocuments": [{"type": "customer", "value": "1004"}],
              "relatedEntities": [],
              "relatedEntitiesRecords": None,
              "relatedEdges": [],
              "relatedPaths": [],
              "rankedPaths": None,
              "relatedForeignDocuments": None
            }
          ]
        ],
        "relatedScoresSummary": [],
        "relatedScores": []
      },
      "related1": [],
      "alertingRunTime": "2026-03-03T00:40:56.089168"
    },
    "_2": {
      "subjectId": "customer-1004",
      "jurisdiction": "SG",
      "name": "Lee Wei Jian",
      "scorecardOverallScore": 78.0,
      "alertingAuditDetails": {
        "subjectId": "customer-1004",
        "alertingRunTime": "2026-03-03 at 08:40:56 SGT",
        "subjectAlert": True,
        "subjectMostRecentAlertTime": "2026-03-03 at 08:40:56 SGT",
        "alertReason": [
          {
            "stepReference": "RedFlagScenarioTriggeredAndNotRecentlyAlerted",
            "moduleDecision": "Alert",
            "decisionReason": "Customer has indirect link (path length 2, influence score 0.87) to OFAC SDN listed entity Mohammed Al-Rashid Trading LLC, via business associate business-559. Customer holds internal High Risk rating (score 4).",
            "subjectLevelScores": ["CustomerIndirectLinkToHotlistRanked\u00ac\u00accustomer-1004|hotlist-UAE2291"],
            "relatedScores": []
          }
        ],
        "alertDescription": "Customer Lee Wei Jian is indirectly linked (2 hops, influence 0.87) to OFAC SDN-listed Mohammed Al-Rashid Trading LLC via business-559. Customer independently carries internal High Risk rating (score 4/5). Potential sanctions evasion or beneficial ownership concealment."
      }
    },
    "_3": "BINARY_GRAPH_PLACEHOLDER_CUSTOMER_1004"
  },

  # ─────────────────────────────────────────────────────────
  # Task 5: TRADE-BASED MONEY LAUNDERING (TBML)
  # Scores: TransactionWithConnectedPartyWithMirroredTrading,
  #          CustomerHasTransactionWithNewAccount,
  #          TransactionWithLoss
  # ─────────────────────────────────────────────────────────
  {
    "_1": {
      "subjectScorecard": {
        "subjectId": {"type": "customer", "value": "1005"},
        "scorecardVersion": {"name": "2.6.0", "index": 12, "description": None},
        "overallScore": 49.5,
        "scoreSummary": [
          [
            {"value": "TransactionWithConnectedPartyWithMirroredTrading"},
            {
              "severity": 2.0,
              "candidateContribution": 4.0,
              "contribution": 4.0,
              "contributionIndicator": "Max contribution in group",
              "contributesToOverallScore": True,
              "weighting": 2.0,
              "scoreHitId": {
                "scoreId": {"value": "TransactionWithConnectedPartyWithMirroredTrading"},
                "uniqueKeyOfScoredDataAsString": "customer-1005|aggregatedtransaction-789|90"
              },
              "version": {"name": "2.6.0", "index": 12, "description": None},
              "relatedStrings": [
                ["scoreBand", "High"],
                ["counterpartyName", "Global Trade Resources Ltd"],
                ["mirrorTradeType", "Buy-Sell Mirror"],
                ["securityCode", "SGX:G1A"],
                ["group", "OppositeBehaviour"]
              ],
              "relatedDates": [],
              "relatedNumbers": [
                ["mirrorTransactionValue", 450000.0],
                ["mirrorTimeDifferenceHours", 18.0]
              ],
              "relatedScoreHits": [],
              "relatedDocuments": [{"type": "aggregatedtransaction", "value": "789|30215"}],
              "relatedEntities": [],
              "relatedEntitiesRecords": None,
              "relatedEdges": [],
              "relatedPaths": [],
              "rankedPaths": None,
              "relatedForeignDocuments": None
            }
          ],
          [
            {"value": "CustomerHasTransactionWithNewAccount"},
            {
              "severity": 2.0,
              "candidateContribution": 3.0,
              "contribution": 3.0,
              "contributionIndicator": "No grouping applied",
              "contributesToOverallScore": True,
              "weighting": 1.5,
              "scoreHitId": {
                "scoreId": {"value": "CustomerHasTransactionWithNewAccount"},
                "uniqueKeyOfScoredDataAsString": "customer-1005|aggregatedtransaction-789|91"
              },
              "version": {"name": "2.6.0", "index": 12, "description": None},
              "relatedStrings": [
                ["scoreBand", "High"],
                ["newAccountPosition", "secondAccount"],
                ["counterpartyAccountAge", "12 days"],
                ["group", "NewAccount"]
              ],
              "relatedDates": [],
              "relatedNumbers": [
                ["transactionValue", 450000.0],
                ["accountAgeDays", 12.0]
              ],
              "relatedScoreHits": [],
              "relatedDocuments": [{"type": "aggregatedtransaction", "value": "789|30215"}],
              "relatedEntities": [],
              "relatedEntitiesRecords": None,
              "relatedEdges": [],
              "relatedPaths": [],
              "rankedPaths": None,
              "relatedForeignDocuments": None
            }
          ],
          [
            {"value": "TransactionWithLoss"},
            {
              "severity": 1.0,
              "candidateContribution": 1.0,
              "contribution": 1.0,
              "contributionIndicator": "No grouping applied",
              "contributesToOverallScore": True,
              "weighting": 1.0,
              "scoreHitId": {
                "scoreId": {"value": "TransactionWithLoss"},
                "uniqueKeyOfScoredDataAsString": "customer-1005|aggregatedtransaction-789|92"
              },
              "version": {"name": "2.6.0", "index": 12, "description": None},
              "relatedStrings": [
                ["scoreBand", "Medium"],
                ["lossPercentage", "12.4%"],
                ["group", "LossBehaviour"]
              ],
              "relatedDates": [],
              "relatedNumbers": [
                ["lossPercentage", 0.124],
                ["lossValue", 55800.0]
              ],
              "relatedScoreHits": [],
              "relatedDocuments": [{"type": "aggregatedtransaction", "value": "789|30215"}],
              "relatedEntities": [],
              "relatedEntitiesRecords": None,
              "relatedEdges": [],
              "relatedPaths": [],
              "rankedPaths": None,
              "relatedForeignDocuments": None
            }
          ]
        ],
        "relatedScoresSummary": [],
        "relatedScores": []
      },
      "related1": [],
      "alertingRunTime": "2026-03-03T00:40:56.089168"
    },
    "_2": {
      "subjectId": "customer-1005",
      "jurisdiction": "SG",
      "name": "Synergy Asia Trading Pte Ltd",
      "scorecardOverallScore": 49.5,
      "alertingAuditDetails": {
        "subjectId": "customer-1005",
        "alertingRunTime": "2026-03-03 at 08:40:56 SGT",
        "subjectAlert": True,
        "subjectMostRecentAlertTime": "2026-03-03 at 08:40:56 SGT",
        "alertReason": [
          {
            "stepReference": "RedFlagScenarioTriggeredAndNotRecentlyAlerted",
            "moduleDecision": "Alert",
            "decisionReason": "Mirror trading pattern (Buy-Sell) detected with connected party Global Trade Resources Ltd via SGX security G1A worth SGD 450,000. Counterparty account only 12 days old. Economic loss of 12.4% (SGD 55,800) accepted - economically irrational, consistent with laundering objective.",
            "subjectLevelScores": [
              "TransactionWithConnectedPartyWithMirroredTrading\u00ac\u00accustomer-1005|aggregatedtransaction-789|90"
            ],
            "relatedScores": []
          }
        ],
        "alertDescription": "Trade-Based Money Laundering indicators detected. Synergy Asia Trading Pte Ltd executed a SGX mirror trade (Buy-Sell) of SGX:G1A worth SGD 450,000 with connected party Global Trade Resources Ltd, whose receiving account was only 12 days old. An economic loss of 12.4% (SGD 55,800) was accepted, which is economically irrational and consistent with fund placement through capital markets."
      }
    },
    "_3": "BINARY_GRAPH_PLACEHOLDER_CUSTOMER_1005"
  },

  # ─────────────────────────────────────────────────────────
  # Task 6: DORMANCY REACTIVATION + UNUSUAL BEHAVIOUR
  # Scores: CustomerHasTransactionAfterPeriodOfDormancy,
  #          HighAverageValueTransaction,
  #          MultipleHighValueTransactionDays
  # ─────────────────────────────────────────────────────────
  {
    "_1": {
      "subjectScorecard": {
        "subjectId": {"type": "customer", "value": "1006"},
        "scorecardVersion": {"name": "2.6.0", "index": 12, "description": None},
        "overallScore": 38.0,
        "scoreSummary": [
          [
            {"value": "CustomerHasTransactionAfterPeriodOfDormancy"},
            {
              "severity": 3.0,
              "candidateContribution": 6.0,
              "contribution": 6.0,
              "contributionIndicator": "Max contribution in group",
              "contributesToOverallScore": True,
              "weighting": 2.0,
              "scoreHitId": {
                "scoreId": {"value": "CustomerHasTransactionAfterPeriodOfDormancy"},
                "uniqueKeyOfScoredDataAsString": "customer-1006"
              },
              "version": {"name": "2.6.0", "index": 12, "description": None},
              "relatedStrings": [
                ["scoreBand", "High"],
                ["customerIdAndName__name", "Rajan Krishnamurthy"],
                ["customerIdAndName__id__type", "customer"],
                ["customerIdAndName__id__value", "1006"],
                ["dormantPeriodBand", "High"],
                ["group", "ReActivation"]
              ],
              "relatedDates": [],
              "relatedNumbers": [["dormantPeriodDays", 612.0]],
              "relatedScoreHits": [],
              "relatedDocuments": [{"type": "customer", "value": "1006"}],
              "relatedEntities": [],
              "relatedEntitiesRecords": None,
              "relatedEdges": [],
              "relatedPaths": [],
              "rankedPaths": None,
              "relatedForeignDocuments": None
            }
          ],
          [
            {"value": "HighAverageValueTransaction"},
            {
              "severity": 2.0,
              "candidateContribution": 3.0,
              "contribution": 3.0,
              "contributionIndicator": "No grouping applied",
              "contributesToOverallScore": True,
              "weighting": 1.5,
              "scoreHitId": {
                "scoreId": {"value": "HighAverageValueTransaction"},
                "uniqueKeyOfScoredDataAsString": "customer-1006"
              },
              "version": {"name": "2.6.0", "index": 12, "description": None},
              "relatedStrings": [
                ["scoreBand", "High"],
                ["customerIdAndName__name", "Rajan Krishnamurthy"]
              ],
              "relatedDates": [],
              "relatedNumbers": [
                ["significanceThreshold", 110.0],
                ["averageValueTransaction", 185000.0]
              ],
              "relatedScoreHits": [],
              "relatedDocuments": [{"type": "customer", "value": "1006"}],
              "relatedEntities": [],
              "relatedEntitiesRecords": None,
              "relatedEdges": [],
              "relatedPaths": [],
              "rankedPaths": None,
              "relatedForeignDocuments": None
            }
          ],
          [
            {"value": "MultipleHighValueTransactionDays"},
            {
              "severity": 5.0,
              "candidateContribution": 5.0,
              "contribution": 5.0,
              "contributionIndicator": "No grouping applied",
              "contributesToOverallScore": True,
              "weighting": 1.0,
              "scoreHitId": {
                "scoreId": {"value": "MultipleHighValueTransactionDays"},
                "uniqueKeyOfScoredDataAsString": "customer-1006"
              },
              "version": {"name": "2.6.0", "index": 12, "description": None},
              "relatedStrings": [
                ["scoreBand", "High"],
                ["highValueDaysCount", "5"]
              ],
              "relatedDates": [],
              "relatedNumbers": [
                ["highValueDaysCount", 5.0],
                ["maxSingleDayValue", 370000.0]
              ],
              "relatedScoreHits": [],
              "relatedDocuments": [{"type": "customer", "value": "1006"}],
              "relatedEntities": [],
              "relatedEntitiesRecords": None,
              "relatedEdges": [],
              "relatedPaths": [],
              "rankedPaths": None,
              "relatedForeignDocuments": None
            }
          ]
        ],
        "relatedScoresSummary": [],
        "relatedScores": []
      },
      "related1": [],
      "alertingRunTime": "2026-03-03T00:40:56.089168"
    },
    "_2": {
      "subjectId": "customer-1006",
      "jurisdiction": "SG",
      "name": "Rajan Krishnamurthy",
      "scorecardOverallScore": 38.0,
      "alertingAuditDetails": {
        "subjectId": "customer-1006",
        "alertingRunTime": "2026-03-03 at 08:40:56 SGT",
        "subjectAlert": True,
        "subjectMostRecentAlertTime": "2026-03-03 at 08:40:56 SGT",
        "alertReason": [
          {
            "stepReference": "OverallScoreAboveThreshold",
            "moduleDecision": "Continue",
            "decisionReason": "The overall score was above the alerting threshold (5.0).",
            "subjectLevelScores": [],
            "relatedScores": []
          },
          {
            "stepReference": "PreviousAlerts",
            "moduleDecision": "Alert",
            "decisionReason": "There are no historical Scorecards which raised an Alert for this subject.",
            "subjectLevelScores": [],
            "relatedScores": []
          }
        ],
        "alertDescription": "Account dormant for 612 days suddenly reactivated with markedly elevated transaction activity. Average transaction value SGD 185,000 (vs negligible pre-dormancy). Five high-value transaction days with single-day maximum of SGD 370,000. Unusual change of behaviour following extended dormancy consistent with account takeover or money mule use."
      }
    },
    "_3": "BINARY_GRAPH_PLACEHOLDER_CUSTOMER_1006"
  },

  # ─────────────────────────────────────────────────────────
  # Task 7: PROLIFERATION FINANCING
  # Scores: CustomerFromHighRiskCountry,
  #          CustomerHasTransactionWithDifferentJurisdictions,
  #          CustomerIndirectLinkToHotlistRanked (UNSC)
  # ─────────────────────────────────────────────────────────
  {
    "_1": {
      "subjectScorecard": {
        "subjectId": {"type": "customer", "value": "1007"},
        "scorecardVersion": {"name": "2.6.0", "index": 12, "description": None},
        "overallScore": 85.0,
        "scoreSummary": [
          [
            {"value": "CustomerFromHighRiskCountry"},
            {
              "severity": 3.0,
              "candidateContribution": 9.0,
              "contribution": 9.0,
              "contributionIndicator": "Max contribution in group",
              "contributesToOverallScore": True,
              "weighting": 3.0,
              "scoreHitId": {
                "scoreId": {"value": "CustomerFromHighRiskCountry"},
                "uniqueKeyOfScoredDataAsString": "customer-1007"
              },
              "version": {"name": "2.6.0", "index": 12, "description": None},
              "relatedStrings": [
                ["scoreBand", "High"],
                ["residenceCountry", "PRK"],
                ["customerIdAndName__name", "Pyongyang Tech Export Co."],
                ["customerIdAndName__id__type", "customer"],
                ["customerIdAndName__id__value", "1007"],
                ["riskCategory", "FATF Black Listed"]
              ],
              "relatedDates": [],
              "relatedNumbers": [],
              "relatedScoreHits": [],
              "relatedDocuments": [{"type": "customer", "value": "1007"}],
              "relatedEntities": [],
              "relatedEntitiesRecords": None,
              "relatedEdges": [],
              "relatedPaths": [],
              "rankedPaths": None,
              "relatedForeignDocuments": None
            }
          ],
          [
            {"value": "CustomerHasTransactionWithDifferentJurisdictions"},
            {
              "severity": 3.0,
              "candidateContribution": 7.5,
              "contribution": 7.5,
              "contributionIndicator": "No grouping applied",
              "contributesToOverallScore": True,
              "weighting": 2.5,
              "scoreHitId": {
                "scoreId": {"value": "CustomerHasTransactionWithDifferentJurisdictions"},
                "uniqueKeyOfScoredDataAsString": "customer-1007"
              },
              "version": {"name": "2.6.0", "index": 12, "description": None},
              "relatedStrings": [
                ["scoreBand", "High"],
                ["jurisdictionRiskCategory", "UNSC Sanctioned"],
                ["counterpartyCountry", "IRN"],
                ["group", "CrossBorderTransaction"]
              ],
              "relatedDates": [],
              "relatedNumbers": [["transactionCount", 3.0], ["totalValue", 1250000.0]],
              "relatedScoreHits": [],
              "relatedDocuments": [{"type": "aggregatedtransaction", "value": "211|31008"}],
              "relatedEntities": [],
              "relatedEntitiesRecords": None,
              "relatedEdges": [],
              "relatedPaths": [],
              "rankedPaths": None,
              "relatedForeignDocuments": None
            }
          ],
          [
            {"value": "CustomerIndirectLinkToHotlistRanked"},
            {
              "severity": 3.0,
              "candidateContribution": 9.0,
              "contribution": 9.0,
              "contributionIndicator": "Max contribution in group",
              "contributesToOverallScore": True,
              "weighting": 3.0,
              "scoreHitId": {
                "scoreId": {"value": "CustomerIndirectLinkToHotlistRanked"},
                "uniqueKeyOfScoredDataAsString": "customer-1007|hotlist-UNSC1718"
              },
              "version": {"name": "2.6.0", "index": 12, "description": None},
              "relatedStrings": [
                ["scoreBand", "High"],
                ["hotlistSource", "UN Security Council Resolution 1718"],
                ["hotlistEntityName", "Korea Ryonbong General Corporation"],
                ["customerIdAndName__name", "Pyongyang Tech Export Co."],
                ["linkedPath", "customer-1007 -> hotlist-UNSC1718"]
              ],
              "relatedDates": [],
              "relatedNumbers": [["pathLength", 1.0], ["pathInfluenceScore", 1.0]],
              "relatedScoreHits": [],
              "relatedDocuments": [{"type": "customer", "value": "1007"}],
              "relatedEntities": [],
              "relatedEntitiesRecords": None,
              "relatedEdges": [],
              "relatedPaths": [],
              "rankedPaths": None,
              "relatedForeignDocuments": None
            }
          ]
        ],
        "relatedScoresSummary": [],
        "relatedScores": []
      },
      "related1": [],
      "alertingRunTime": "2026-03-03T00:40:56.089168"
    },
    "_2": {
      "subjectId": "customer-1007",
      "jurisdiction": "SG",
      "name": "Pyongyang Tech Export Co.",
      "scorecardOverallScore": 85.0,
      "alertingAuditDetails": {
        "subjectId": "customer-1007",
        "alertingRunTime": "2026-03-03 at 08:40:56 SGT",
        "subjectAlert": True,
        "subjectMostRecentAlertTime": "2026-03-03 at 08:40:56 SGT",
        "alertReason": [
          {
            "stepReference": "RedFlagScenarioTriggeredAndNotRecentlyAlerted",
            "moduleDecision": "Alert",
            "decisionReason": "CRITICAL: Customer is directly linked (path length 1) to UNSC Resolution 1718 designated entity Korea Ryonbong General Corporation (WMD proliferator). Customer domiciled in FATF Blacklisted jurisdiction (North Korea / PRK). Transactions with Iran (UNSC Sanctioned) totalling SGD 1,250,000 across 3 transactions.",
            "subjectLevelScores": ["CustomerIndirectLinkToHotlistRanked\u00ac\u00accustomer-1007|hotlist-UNSC1718"],
            "relatedScores": []
          }
        ],
        "alertDescription": "PROLIFERATION FINANCING - CRITICAL PRIORITY: Pyongyang Tech Export Co. is directly linked to UNSC Res. 1718 designated Korea Ryonbong General Corporation (known WMD materiel supplier). Entity domiciled in North Korea (FATF Blacklisted). 3 transactions totalling SGD 1,250,000 with Iranian counterparties (UNSC Sanctioned). Immediate escalation required."
      }
    },
    "_3": "BINARY_GRAPH_PLACEHOLDER_CUSTOMER_1007"
  },

  # ─────────────────────────────────────────────────────────
  # Task 8: FRAUD / IDENTITY MANIPULATION / MULE
  # Scores: CancelledCustomerScore, SeveralAccountsScore,
  #          SeveralAccountsAndCancelledScore,
  #          CustomerWithHighNumberOfRoundAmountTransactions
  # ─────────────────────────────────────────────────────────
  {
    "_1": {
      "subjectScorecard": {
        "subjectId": {"type": "customer", "value": "1008"},
        "scorecardVersion": {"name": "2.6.0", "index": 12, "description": None},
        "overallScore": 41.0,
        "scoreSummary": [
          [
            {"value": "CancelledCustomerScore"},
            {
              "severity": 2.0,
              "candidateContribution": 3.0,
              "contribution": 3.0,
              "contributionIndicator": "Max contribution in group",
              "contributesToOverallScore": True,
              "weighting": 1.5,
              "scoreHitId": {
                "scoreId": {"value": "CancelledCustomerScore"},
                "uniqueKeyOfScoredDataAsString": "customer-1008"
              },
              "version": {"name": "2.6.0", "index": 12, "description": None},
              "relatedStrings": [
                ["scoreBand", "High"],
                ["customerIdAndName__name", "Tan Mei Ling"],
                ["customerIdAndName__id__type", "customer"],
                ["customerIdAndName__id__value", "1008"],
                ["cancelledReason", "Fraud Flag"]
              ],
              "relatedDates": [],
              "relatedNumbers": [],
              "relatedScoreHits": [],
              "relatedDocuments": [{"type": "customer", "value": "1008"}],
              "relatedEntities": [],
              "relatedEntitiesRecords": None,
              "relatedEdges": [],
              "relatedPaths": [],
              "rankedPaths": None,
              "relatedForeignDocuments": None
            }
          ],
          [
            {"value": "SeveralAccountsScore"},
            {
              "severity": 1.0,
              "candidateContribution": 1.0,
              "contribution": None,
              "contributionIndicator": "Does not contribute to overall score",
              "contributesToOverallScore": False,
              "weighting": 1.0,
              "scoreHitId": {
                "scoreId": {"value": "SeveralAccountsScore"},
                "uniqueKeyOfScoredDataAsString": "customer-1008"
              },
              "version": {"name": "2.6.0", "index": 12, "description": None},
              "relatedStrings": [
                ["scoreBand", "High"],
                ["customerIdAndName__name", "Tan Mei Ling"]
              ],
              "relatedDates": [],
              "relatedNumbers": [["numberOfAccounts", 7.0]],
              "relatedScoreHits": [],
              "relatedDocuments": [{"type": "customer", "value": "1008"}],
              "relatedEntities": [],
              "relatedEntitiesRecords": None,
              "relatedEdges": [],
              "relatedPaths": [],
              "rankedPaths": None,
              "relatedForeignDocuments": None
            }
          ],
          [
            {"value": "SeveralAccountsAndCancelledScore"},
            {
              "severity": 2.0,
              "candidateContribution": 3.0,
              "contribution": 3.0,
              "contributionIndicator": "Max contribution in group",
              "contributesToOverallScore": True,
              "weighting": 1.5,
              "scoreHitId": {
                "scoreId": {"value": "SeveralAccountsAndCancelledScore"},
                "uniqueKeyOfScoredDataAsString": "customer-1008"
              },
              "version": {"name": "2.6.0", "index": 12, "description": None},
              "relatedStrings": [
                ["customerIdAndName__name", "Tan Mei Ling"]
              ],
              "relatedDates": [],
              "relatedNumbers": [],
              "relatedScoreHits": [
                {"scoreId": {"value": "SeveralAccountsScore"}, "uniqueKeyOfScoredDataAsString": "customer-1008"},
                {"scoreId": {"value": "CancelledCustomerScore"}, "uniqueKeyOfScoredDataAsString": "customer-1008"}
              ],
              "relatedDocuments": [{"type": "customer", "value": "1008"}],
              "relatedEntities": [],
              "relatedEntitiesRecords": None,
              "relatedEdges": [],
              "relatedPaths": [],
              "rankedPaths": None,
              "relatedForeignDocuments": None
            }
          ],
          [
            {"value": "CustomerWithHighNumberOfRoundAmountTransactions"},
            {
              "severity": 1.0,
              "candidateContribution": 1.0,
              "contribution": 1.0,
              "contributionIndicator": "No grouping applied",
              "contributesToOverallScore": True,
              "weighting": 1.0,
              "scoreHitId": {
                "scoreId": {"value": "CustomerWithHighNumberOfRoundAmountTransactions"},
                "uniqueKeyOfScoredDataAsString": "customer-1008"
              },
              "version": {"name": "2.6.0", "index": 12, "description": None},
              "relatedStrings": [
                ["scoreBand", "Medium"],
                ["roundAmountTransactionRatio", "0.65"]
              ],
              "relatedDates": [],
              "relatedNumbers": [
                ["roundAmountTransactionRatio", 0.65],
                ["roundAmountCount", 19.0]
              ],
              "relatedScoreHits": [],
              "relatedDocuments": [{"type": "customer", "value": "1008"}],
              "relatedEntities": [],
              "relatedEntitiesRecords": None,
              "relatedEdges": [],
              "relatedPaths": [],
              "rankedPaths": None,
              "relatedForeignDocuments": None
            }
          ]
        ],
        "relatedScoresSummary": [
          [
            {
              "scoreId": {"value": "SeveralAccountsScore"},
              "uniqueKeyOfScoredDataAsString": "customer-1008"
            },
            {
              "severity": 1.0,
              "candidateContribution": 1.5,
              "contributesToScoreIds": [{"value": "SeveralAccountsAndCancelledScore"}]
            }
          ],
          [
            {
              "scoreId": {"value": "CancelledCustomerScore"},
              "uniqueKeyOfScoredDataAsString": "customer-1008"
            },
            {
              "severity": 2.0,
              "candidateContribution": 1.5,
              "contributesToScoreIds": [{"value": "SeveralAccountsAndCancelledScore"}]
            }
          ]
        ],
        "relatedScores": []
      },
      "related1": [],
      "alertingRunTime": "2026-03-03T00:40:56.089168"
    },
    "_2": {
      "subjectId": "customer-1008",
      "jurisdiction": "SG",
      "name": "Tan Mei Ling",
      "scorecardOverallScore": 41.0,
      "alertingAuditDetails": {
        "subjectId": "customer-1008",
        "alertingRunTime": "2026-03-03 at 08:40:56 SGT",
        "subjectAlert": True,
        "subjectMostRecentAlertTime": "2026-03-03 at 08:40:56 SGT",
        "alertReason": [
          {
            "stepReference": "OverallScoreAboveThreshold",
            "moduleDecision": "Continue",
            "decisionReason": "The overall score was above the alerting threshold (5.0).",
            "subjectLevelScores": [],
            "relatedScores": []
          },
          {
            "stepReference": "PreviousAlerts",
            "moduleDecision": "Alert",
            "decisionReason": "There are no historical Scorecards which raised an Alert for this subject.",
            "subjectLevelScores": [],
            "relatedScores": []
          }
        ],
        "alertDescription": "Customer account cancelled due to Fraud Flag. Customer holds 7 bank accounts across 3 institutions (SeveralAccountsAndCancelledScore: compound risk). 65% of transactions (19 out of 29) are exact round amounts. Pattern consistent with money mule activity - account opened for receiving and disbursing fraud/scam proceeds."
      }
    },
    "_3": "BINARY_GRAPH_PLACEHOLDER_CUSTOMER_1008"
  }
]

# Save MockTasksToLoad.json
output_path = "MockTasksToLoad.json"
with open(output_path, "w") as f:
    json.dump(mock_tasks, f, indent=2)

print(f"Generated {len(mock_tasks)} mock tasks -> {output_path}")
for t in mock_tasks:
    scores = [pair[0]["value"] for pair in t["_1"]["subjectScorecard"]["scoreSummary"]]
    print(f"  [{t['_2']['name']:35s}] score={t['_2']['scorecardOverallScore']:5.1f} | {', '.join(scores)}")
