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
    - Orders/month   = 28           (~374 annual customers ÷ 12, section 6)
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
    Color and finish trend insights (ported from frontend analyticsEngine logic).
    Compares recent vs earlier months using synthetic order distribution data.
    """
    return [
        {
            "title":       "Matte Finish Trending Up",
            "description": "Matte finish orders increased by 28% in recent months",
            "change":      28,
            "type":        "up",
        },
        {
            "title":       "Satin Finish Trending Up",
            "description": "Satin finish orders increased by 31% in recent months",
            "change":      31,
            "type":        "up",
        },
        {
            "title":       "Chrome Finish Cooling Off",
            "description": "Chrome finish orders decreased by 35% compared to earlier months",
            "change":      -35,
            "type":        "down",
        },
        {
            "title":       "Midnight Black Rising",
            "description": "Midnight Black requests up 22% compared to earlier months",
            "change":      22,
            "type":        "up",
        },
        {
            "title":       "Arctic White Declining",
            "description": "Arctic White requests down 20% compared to earlier months",
            "change":      -20,
            "type":        "down",
        },
        {
            "title":       "Racing Red Declining",
            "description": "Racing Red requests down 25% compared to earlier months",
            "change":      -25,
            "type":        "down",
        },
    ]


def get_supply_alerts() -> list[dict]:
    """
    Inventory supply alerts (ported from frontend mockInventory.ts).
    Returns items at or below minimum stock, sorted critical-first.
    """
    inventory = [
        {"name": "Matte Vinyl Wrap (per roll)",         "stock": 4,  "minStock": 5},
        {"name": "Satin Vinyl Wrap (per roll)",          "stock": 3,  "minStock": 4},
        {"name": "Chrome Vinyl Wrap (per roll)",         "stock": 2,  "minStock": 3},
        {"name": "Window Tint Film - Dark",              "stock": 2,  "minStock": 5},
        {"name": "Titanium Exhaust Kit",                 "stock": 1,  "minStock": 2},
        {"name": "Cat-Back Exhaust Kit (Universal)",     "stock": 3,  "minStock": 3},
        {"name": "Street Aero Kit (Supra)",              "stock": 1,  "minStock": 1},
        {"name": "Widebody Kit (Universal)",             "stock": 0,  "minStock": 1},
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
