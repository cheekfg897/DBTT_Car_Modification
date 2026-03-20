"""
analysis.py — Notebook logic (analysis.ipynb sections 4–11) as callable functions.
All data is synthetic/extrapolated for academic analysis.
"""

import numpy as np
import pandas as pd

# ---------------------------------------------------------------------------
# Helpers (from notebook)
# ---------------------------------------------------------------------------

def _round_half_up(value: float) -> int:
    """Round halves up (e.g. 238.5 → 239) for cleaner business projections."""
    return int(np.floor(value + 0.5))


# ---------------------------------------------------------------------------
# Section 3 — Assumptions
# ---------------------------------------------------------------------------

_ASSUMPTIONS = {
    "estimated_current_annual_customers": 200,
    "average_order_value_sgd": 1500,
    "baseline_organic_growth_rate": 0.06,
    "digital_additional_growth_rate": 0.15,
    "conversion_lift_rate": 0.05,
    "analytics_upsell_lift_rate": 0.08,
}

# ---------------------------------------------------------------------------
# Section 4 — Synthetic historical data (2020-2024)
# ---------------------------------------------------------------------------

_HISTORICAL = [
    {"year": 2020, "customers": 150, "aov": 1300, "revenue": 195000,  "serviceMix": "Car Wrap, Solar Film Tinting"},
    {"year": 2021, "customers": 175, "aov": 1360, "revenue": 238000,  "serviceMix": "Car Wrap, Paint Protection Film"},
    {"year": 2022, "customers": 200, "aov": 1420, "revenue": 284000,  "serviceMix": "Solar Film Tinting, Spray"},
    {"year": 2023, "customers": 220, "aov": 1470, "revenue": 323400,  "serviceMix": "Paint Protection Film, Car Wrap"},
    {"year": 2024, "customers": 255, "aov": 1500, "revenue": 382500,  "serviceMix": "Car Wrap, PPF, Bodykits"},
]

# ---------------------------------------------------------------------------
# Sections 5–7 — Projections & comparison
# ---------------------------------------------------------------------------

def get_projections() -> dict:
    """
    Returns historical, baseline, digital projections and comparison
    (sections 4–7 of the notebook).
    """
    projection_years = [2025, 2026, 2027, 2028, 2029]
    aov              = _ASSUMPTIONS["average_order_value_sgd"]
    baseline_growth  = _ASSUMPTIONS["baseline_organic_growth_rate"]
    extra_digital    = _ASSUMPTIONS["digital_additional_growth_rate"]
    conv_lift        = _ASSUMPTIONS["conversion_lift_rate"]
    upsell_lift      = _ASSUMPTIONS["analytics_upsell_lift_rate"]
    total_digital    = baseline_growth + extra_digital

    # Baseline
    baseline = []
    prev = _HISTORICAL[-1]["customers"]   # 255
    for year in projection_years:
        customers = _round_half_up(prev * (1 + baseline_growth))
        baseline.append({"year": year, "customers": customers, "revenue": customers * aov})
        prev = customers

    # Digital
    digital = []
    prev = _HISTORICAL[-1]["customers"]
    for year in projection_years:
        customers       = _round_half_up(prev * (1 + total_digital))
        base_rev        = customers * aov
        conv_uplift     = _round_half_up(base_rev * conv_lift)
        rev_after_conv  = base_rev + conv_uplift
        upsell_uplift   = _round_half_up(rev_after_conv * upsell_lift)
        digital_rev     = base_rev + conv_uplift + upsell_uplift
        digital.append({
            "year": year,
            "customers": customers,
            "revenue": digital_rev,
            "baseRevenue": base_rev,
            "conversionUplift": conv_uplift,
            "analyticsUplift": upsell_uplift,
        })
        prev = customers

    # Comparison
    comparison = [
        {
            "year":              b["year"],
            "baselineCustomers": b["customers"],
            "digitalCustomers":  d["customers"],
            "customerDiff":      d["customers"] - b["customers"],
            "baselineRevenue":   b["revenue"],
            "digitalRevenue":    d["revenue"],
            "revenueDiff":       d["revenue"] - b["revenue"],
        }
        for b, d in zip(baseline, digital)
    ]

    total_customer_uplift = sum(c["customerDiff"] for c in comparison)
    total_revenue_uplift  = sum(c["revenueDiff"]  for c in comparison)

    return {
        "historical":          _HISTORICAL,
        "baseline":            baseline,
        "digital":             digital,
        "comparison":          comparison,
        "totalCustomerUplift": total_customer_uplift,
        "totalRevenueUplift":  total_revenue_uplift,
    }


# ---------------------------------------------------------------------------
# Section 9 — Synthetic transaction analytics (320 customers)
# ---------------------------------------------------------------------------

def _generate_transactions() -> pd.DataFrame:
    """Reproduce the synthetic transaction dataset from notebook section 9."""
    services         = ["Widebody Kit", "Cat-Back Exhaust", "Ducktail Spoiler", "Sport Side Skirts", "Carbon Fiber Hood", "GT Wing"]
    car_segments     = ["sedan", "hatchback", "SUV", "luxury"]
    seg_probs        = np.array([0.38, 0.20, 0.30, 0.12])
    style_prefs      = ["sporty", "premium", "minimalist", "family"]
    style_probs      = np.array([0.30, 0.22, 0.23, 0.25])

    svc_weights = {
        "sporty":    {"Widebody Kit": 0.25, "Cat-Back Exhaust": 0.22, "Ducktail Spoiler": 0.18, "Sport Side Skirts": 0.15, "Carbon Fiber Hood": 0.10, "GT Wing": 0.10},
        "premium":   {"Widebody Kit": 0.20, "Cat-Back Exhaust": 0.10, "Ducktail Spoiler": 0.15, "Sport Side Skirts": 0.12, "Carbon Fiber Hood": 0.28, "GT Wing": 0.15},
        "minimalist":{"Widebody Kit": 0.10, "Cat-Back Exhaust": 0.18, "Ducktail Spoiler": 0.30, "Sport Side Skirts": 0.22, "Carbon Fiber Hood": 0.12, "GT Wing": 0.08},
        "family":    {"Widebody Kit": 0.12, "Cat-Back Exhaust": 0.20, "Ducktail Spoiler": 0.25, "Sport Side Skirts": 0.25, "Carbon Fiber Hood": 0.10, "GT Wing": 0.08},
    }

    secondary_map = {
        "Widebody Kit":     (["Sport Side Skirts", "Cat-Back Exhaust", "GT Wing", "Carbon Fiber Hood"], [0.35, 0.30, 0.20, 0.15]),
        "Cat-Back Exhaust": (["Widebody Kit", "Sport Side Skirts", "Ducktail Spoiler"],                 [0.40, 0.35, 0.25]),
        "Ducktail Spoiler": (["Cat-Back Exhaust", "Sport Side Skirts", "Carbon Fiber Hood"],            [0.40, 0.35, 0.25]),
        "Sport Side Skirts":(["Widebody Kit", "Cat-Back Exhaust", "Ducktail Spoiler"],                  [0.40, 0.35, 0.25]),
        "Carbon Fiber Hood":(["Widebody Kit", "GT Wing", "Cat-Back Exhaust"],                           [0.45, 0.30, 0.25]),
        "GT Wing":          (["Widebody Kit", "Carbon Fiber Hood", "Cat-Back Exhaust"],                 [0.45, 0.30, 0.25]),
    }

    base_price = {"Widebody Kit": 5000, "Cat-Back Exhaust": 800, "Ducktail Spoiler": 450, "Sport Side Skirts": 600, "Carbon Fiber Hood": 2000, "GT Wing": 1200}
    seg_mult   = {"sedan": 1.00, "hatchback": 0.92, "SUV": 1.10, "luxury": 1.25}
    style_mult = {"sporty": 1.06, "premium": 1.10, "minimalist": 0.97, "family": 1.00}

    rng  = np.random.default_rng(42)
    rows = []

    for cid in range(1, 321):
        segment = rng.choice(car_segments, p=seg_probs)
        style   = rng.choice(style_prefs,  p=style_probs)

        pw = np.array([svc_weights[style][s] for s in services], dtype=float)
        pw /= pw.sum()
        primary = rng.choice(services, p=pw)

        secondary = None
        if rng.random() < 0.72:
            sec_opts, sec_probs = secondary_map[primary]
            secondary = rng.choice(sec_opts, p=sec_probs)

        order_val = base_price[primary]
        if secondary:
            order_val += base_price[secondary] * rng.uniform(0.55, 0.80)
        order_val *= seg_mult[segment]
        order_val *= style_mult[style]
        order_val *= rng.uniform(0.92, 1.08)
        order_val = _round_half_up(order_val)

        if order_val <= 1800:
            band = "Value (<= SGD 1,800)"
        elif order_val <= 3200:
            band = "Mid (SGD 1,801-3,200)"
        else:
            band = "Premium (> SGD 3,200)"

        rows.append({
            "customer_id":      f"C{cid:03d}",
            "car_segment":      segment,
            "primary_service":  primary,
            "secondary_service": secondary,
            "order_value":      order_val,
            "budget_band":      band,
            "style_preference": style,
        })

    return pd.DataFrame(rows)


# Cache — generated once at first call, deterministic so safe to reuse
_TX_CACHE: pd.DataFrame | None = None

def _get_transactions() -> pd.DataFrame:
    global _TX_CACHE
    if _TX_CACHE is None:
        _TX_CACHE = _generate_transactions()
    return _TX_CACHE


def get_service_stats() -> dict:
    """Section 9 analytics: popular services, bundles, AOV by service, budget bands, style preferences."""
    df = _get_transactions()

    # Popular services (primary + secondary mentions combined)
    mentions = pd.concat([df["primary_service"], df["secondary_service"].dropna()], ignore_index=True)
    popular = mentions.value_counts().reset_index()
    popular.columns = ["service", "count"]

    # Top service bundles
    bdf = df.dropna(subset=["secondary_service"]).copy()
    bdf["bundle"] = bdf.apply(lambda r: " + ".join(sorted([r["primary_service"], r["secondary_service"]])), axis=1)
    bundles = bdf["bundle"].value_counts().reset_index()
    bundles.columns = ["bundle", "count"]

    # AOV by primary service (descending)
    aov = (
        df.groupby("primary_service")["order_value"]
        .mean()
        .reset_index()
        .rename(columns={"primary_service": "service", "order_value": "avgOrderValue"})
    )
    aov["avgOrderValue"] = aov["avgOrderValue"].round(0).astype(int)
    aov = aov.sort_values("avgOrderValue", ascending=False)

    # Budget band distribution
    budget = (
        df.groupby("budget_band")
        .agg(avgOrderValue=("order_value", "mean"), count=("order_value", "size"))
        .reset_index()
        .rename(columns={"budget_band": "band"})
    )
    budget["avgOrderValue"] = budget["avgOrderValue"].round(0).astype(int)

    # Style preference distribution
    styles = df["style_preference"].value_counts().reset_index()
    styles.columns = ["style", "count"]

    return {
        "popularServices":  popular.to_dict("records"),
        "topBundles":       bundles.head(10).to_dict("records"),
        "aovByService":     aov.to_dict("records"),
        "budgetBands":      budget.to_dict("records"),
        "stylePreferences": styles.to_dict("records"),
    }


# ---------------------------------------------------------------------------
# Section 10 — Cross-sell recommendation rules
# ---------------------------------------------------------------------------

def get_recommendations() -> list:
    """Section 10: association rule mining on synthetic transactions."""
    df       = _get_transactions()
    services = ["Widebody Kit", "Cat-Back Exhaust", "Ducktail Spoiler", "Sport Side Skirts", "Carbon Fiber Hood", "GT Wing"]

    order_sets = df.apply(
        lambda r: {r["primary_service"]} | ({r["secondary_service"]} if r["secondary_service"] else set()),
        axis=1,
    )

    rows = []
    for sx in services:
        buyers_x = order_sets[order_sets.apply(lambda p: sx in p)]
        support_x = len(buyers_x)
        if support_x < 15:
            continue

        best_svc, best_conf, best_sup = None, 0.0, 0
        for sy in services:
            if sy == sx:
                continue
            sup_xy = buyers_x.apply(lambda p: sy in p).sum()
            conf   = sup_xy / support_x
            if conf > best_conf:
                best_conf, best_svc, best_sup = conf, sy, int(sup_xy)

        if best_svc:
            rows.append({
                "ifBuys":           sx,
                "recommendNext":    best_svc,
                "confidence":       round(best_conf * 100, 1),
                "supportCustomers": best_sup,
            })

    return sorted(rows, key=lambda r: (-r["confidence"], -r["supportCustomers"]))


# ---------------------------------------------------------------------------
# Section 11 — Key business findings / uplift KPIs
# ---------------------------------------------------------------------------

def get_uplift_kpis() -> dict:
    """Section 11: headline business findings derived from projection + analytics."""
    proj    = get_projections()
    stats   = get_service_stats()
    recs    = get_recommendations()

    comparison          = proj["comparison"]
    total_cust_uplift   = proj["totalCustomerUplift"]
    total_rev_uplift    = proj["totalRevenueUplift"]
    avg_annual_uplift   = round(sum(c["revenueDiff"] for c in comparison) / len(comparison))

    top_bundle    = stats["topBundles"][0]["bundle"]    if stats["topBundles"]    else "N/A"
    top_service   = stats["popularServices"][0]["service"] if stats["popularServices"] else "N/A"
    top_rule      = recs[0] if recs else {}
    top_crosssell = (
        f"{top_rule['ifBuys']} → {top_rule['recommendNext']} ({top_rule['confidence']}%)"
        if top_rule else "N/A"
    )

    return {
        "totalCustomerUplift": total_cust_uplift,
        "totalRevenueUplift":  total_rev_uplift,
        "avgAnnualUplift":     avg_annual_uplift,
        "topBundle":           top_bundle,
        "topService":          top_service,
        "topCrossSell":        top_crosssell,
    }
