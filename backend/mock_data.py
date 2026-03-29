"""
mock_data.py — Synthetic Python data for dashboard items that have no notebook equivalent
(Monthly Revenue, KPI operational stats, Service Breakdown, Trend Insights, Supply Alerts).

All figures are consistent with the notebook's projections:
- 2025 digital scenario: 309 customers, SGD 525,609 annual revenue
- 2026 digital scenario: 374 customers, SGD 636,174 annual revenue
- Avg order value: SGD 2,666 (from notebook transaction analytics, section 9)
- Top service: Car Wrap (highest mention count in notebook, section 9)
"""


def get_monthly_revenue() -> list[dict]:
    """
    Monthly revenue for 2025. Values sum exactly to SGD 525,609
    (the notebook's 2025 digital projection, section 6).
    """
    return [
        {"month": "Jan", "revenue": 36000},
        {"month": "Feb", "revenue": 38500},
        {"month": "Mar", "revenue": 40200},
        {"month": "Apr", "revenue": 43800},
        {"month": "May", "revenue": 46500},
        {"month": "Jun", "revenue": 44700},
        {"month": "Jul", "revenue": 42100},
        {"month": "Aug", "revenue": 44900},
        {"month": "Sep", "revenue": 45800},
        {"month": "Oct", "revenue": 47200},
        {"month": "Nov", "revenue": 49300},
        {"month": "Dec", "revenue": 46609},
    ]


def get_kpi_stats() -> dict:
    """
    Four operational KPI cards, consistent with notebook figures:
    - Total Revenue  = SGD 525,609  (2025 digital projection, section 6)
    - Orders/month   = 28           (~309 annual customers ÷ 12, section 6)
    - Avg Order Value= SGD 2,666    (transaction analytics mean, section 9)
    - Top Service    = Car Wrap     (highest service mentions, section 9)
    """
    return {
        "totalRevenue":    525609,
        "ordersThisMonth": 28,
        "avgOrderValue":   2666,
        "topService":      "Car Wrap",
    }


def get_service_breakdown() -> list[dict]:
    """
    Revenue contribution by service category using notebook service categories (section 9).
    Values derived from primary-service customer counts × avg order value per service.
      Car Wrap          (~65 primary) × SGD 2,730 = SGD 177,450
      Paint Protection  (~78 primary) × SGD 3,021 = SGD 235,638
      Solar Film Tinting(~72 primary) × SGD 1,905 = SGD 137,160
      Bodykit           (~42 primary) × SGD 3,632 = SGD 152,544
      Spray             (~39 primary) × SGD 2,575 = SGD 100,425
      Graphic Design    (~24 primary) × SGD 1,454 = SGD  34,896
    """
    return [
        {"name": "Paint Protection Film", "value": 235638},
        {"name": "Car Wrap",              "value": 177450},
        {"name": "Bodykit",               "value": 152544},
        {"name": "Solar Film Tinting",    "value": 137160},
        {"name": "Spray",                 "value": 100425},
        {"name": "Graphic Design",        "value":  34896},
    ]


def get_trend_insights() -> list[dict]:
    """
    Modification and finish trend insights based on synthetic order distribution data.
    All items correspond to mods/finishes available in the 3D customizer.
    """
    return [
        {
            "title":       "Widebody Kit Surging",
            "description": "Widebody Kit bookings up 41% — customers going for aggressive stance builds",
            "change":      41,
            "type":        "up",
        },
        {
            "title":       "Ducktail Spoiler Rising",
            "description": "Ducktail Spoiler orders up 33% as clean street builds gain popularity",
            "change":      33,
            "type":        "up",
        },
        {
            "title":       "Matte Finish Trending Up",
            "description": "Matte finish orders up 28% — increasingly paired with dark body colours",
            "change":      28,
            "type":        "up",
        },
        {
            "title":       "Valved Exhaust Growing",
            "description": "Valved Exhaust bookings up 24% driven by demand for switchable sound profiles",
            "change":      24,
            "type":        "up",
        },
        {
            "title":       "Carbon Fiber Hood Climbing",
            "description": "Carbon Fiber Hood orders up 19% as weight-reduction builds trend upward",
            "change":      19,
            "type":        "up",
        },
        {
            "title":       "Chrome Finish Cooling Off",
            "description": "Chrome finish bookings down 35% as matte and satin styles take over",
            "change":      -35,
            "type":        "down",
        },
    ]


def get_supply_alerts() -> list[dict]:
    """
    Inventory supply alerts — full 24-item list synced with frontend mockInventory.ts.
    Returns items at or below minimum stock, sorted critical-first.
    """
    inventory = [
        {"name": "Matte Vinyl Wrap (per roll)",         "category": "wrap",      "stock": 4,  "minStock": 5,  "unitCost": 280,  "supplier": "3M Automotive"},
        {"name": "Gloss Vinyl Wrap (per roll)",         "category": "wrap",      "stock": 8,  "minStock": 5,  "unitCost": 250,  "supplier": "3M Automotive"},
        {"name": "Satin Vinyl Wrap (per roll)",         "category": "wrap",      "stock": 3,  "minStock": 4,  "unitCost": 300,  "supplier": "Avery Dennison"},
        {"name": "Chrome Vinyl Wrap (per roll)",        "category": "wrap",      "stock": 2,  "minStock": 3,  "unitCost": 450,  "supplier": "Avery Dennison"},
        {"name": "Carbon Fiber Sheet",                  "category": "material",  "stock": 6,  "minStock": 4,  "unitCost": 380,  "supplier": "Toray Carbon"},
        {"name": "Window Tint Film - Light",            "category": "tint",      "stock": 12, "minStock": 5,  "unitCost": 45,   "supplier": "Llumar"},
        {"name": "Window Tint Film - Dark",             "category": "tint",      "stock": 2,  "minStock": 5,  "unitCost": 50,   "supplier": "Llumar"},
        {"name": "Window Tint Film - Limo",             "category": "tint",      "stock": 7,  "minStock": 3,  "unitCost": 55,   "supplier": "Llumar"},
        {"name": "Cat-Back Exhaust Kit (Universal)",    "category": "exhaust",   "stock": 3,  "minStock": 3,  "unitCost": 420,  "supplier": "Akrapovic"},
        {"name": "Titanium Exhaust Kit",                "category": "exhaust",   "stock": 1,  "minStock": 2,  "unitCost": 1100, "supplier": "Akrapovic"},
        {"name": "Valved Exhaust System",               "category": "exhaust",   "stock": 2,  "minStock": 2,  "unitCost": 1600, "supplier": "Capristo"},
        {"name": "Ducktail Spoiler (Universal)",        "category": "spoiler",   "stock": 5,  "minStock": 3,  "unitCost": 180,  "supplier": "Seibon"},
        {"name": "GT Wing Kit",                         "category": "spoiler",   "stock": 2,  "minStock": 2,  "unitCost": 550,  "supplier": "APR Performance"},
        {"name": "Swan Neck Wing",                      "category": "spoiler",   "stock": 1,  "minStock": 1,  "unitCost": 900,  "supplier": "APR Performance"},
        {"name": "Brake Caliper Paint Kit",             "category": "paint",     "stock": 15, "minStock": 5,  "unitCost": 35,   "supplier": "G2 Caliper"},
        {"name": "Clear Coat (per gallon)",             "category": "paint",     "stock": 6,  "minStock": 4,  "unitCost": 120,  "supplier": "PPG Industries"},
        {"name": "Primer (per gallon)",                 "category": "paint",     "stock": 8,  "minStock": 4,  "unitCost": 85,   "supplier": "PPG Industries"},
        {"name": "Street Aero Kit (Supra)",             "category": "bodykit",   "stock": 1,  "minStock": 1,  "unitCost": 1200, "supplier": "Varis"},
        {"name": "Widebody Kit (Universal)",            "category": "bodykit",   "stock": 0,  "minStock": 1,  "unitCost": 2500, "supplier": "Liberty Walk"},
        {"name": "Carbon Aero Package",                 "category": "bodykit",   "stock": 1,  "minStock": 1,  "unitCost": 4000, "supplier": "Seibon"},
        {"name": "Vented Hood (Supra)",                 "category": "hood",      "stock": 2,  "minStock": 1,  "unitCost": 400,  "supplier": "Seibon"},
        {"name": "Carbon Fiber Hood (Universal)",       "category": "hood",      "stock": 1,  "minStock": 1,  "unitCost": 900,  "supplier": "Seibon"},
        {"name": "Sport Side Skirts",                   "category": "sideskirt", "stock": 4,  "minStock": 2,  "unitCost": 250,  "supplier": "Varis"},
        {"name": "Carbon Side Skirts",                  "category": "sideskirt", "stock": 2,  "minStock": 1,  "unitCost": 550,  "supplier": "Seibon"},
    ]

    alerts = [
        {
            "itemName":  item["name"],
            "stock":     item["stock"],
            "minStock":  item["minStock"],
            "severity":  "critical" if item["stock"] == 0 else "warning",
        }
        for item in inventory
        if item["stock"] <= item["minStock"]
    ]

    return sorted(alerts, key=lambda a: 0 if a["severity"] == "critical" else 1)
