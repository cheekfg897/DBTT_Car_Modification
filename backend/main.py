"""
main.py — FastAPI backend for the Vos Automotive dashboard.

Start with:
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000

Endpoints from analysis.py (computed):
  GET /api/projections        — historical + baseline vs digital (2020-2029)
  GET /api/service-stats      — popular services, bundles, AOV, budget bands, style prefs
  GET /api/recommendations    — cross-sell rules
  GET /api/uplift-kpis        — headline business findings
  GET /api/inventory-predictions — predictive stock alerts + reorder quantities
  GET /api/kpis               — 4 operational KPI cards
  GET /api/monthly-revenue    — 2025 revenue distributed seasonally
  GET /api/service-breakdown  — revenue contribution per service
  GET /api/service-bundles    — top service bundles (for worker PopularCombos)

  GET /api/trend-insights     — H1 vs H2 2024 service demand trends
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from analysis import (
    get_projections, get_service_stats, get_recommendations, get_uplift_kpis,
    get_inventory_predictions, get_kpi_stats, get_monthly_revenue, get_service_breakdown,
    get_trend_insights,
)

app = FastAPI(title="Vos Automotive Analytics API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


# ---------------------------------------------------------------------------
# Notebook-derived endpoints
# ---------------------------------------------------------------------------

@app.get("/api/projections")
def projections():
    return get_projections()


@app.get("/api/service-stats")
def service_stats():
    return get_service_stats()


@app.get("/api/recommendations")
def recommendations():
    return get_recommendations()


@app.get("/api/uplift-kpis")
def uplift_kpis():
    return get_uplift_kpis()


@app.get("/api/inventory-predictions")
def inventory_predictions():
    return get_inventory_predictions()


# ---------------------------------------------------------------------------
# Mock-data endpoints (frontend-only items, ported to Python)
# ---------------------------------------------------------------------------

@app.get("/api/kpis")
def kpis():
    return get_kpi_stats()


@app.get("/api/monthly-revenue")
def monthly_revenue():
    return get_monthly_revenue()


@app.get("/api/service-breakdown")
def service_breakdown():
    return get_service_breakdown()


@app.get("/api/trend-insights")
def trend_insights():
    return get_trend_insights()


@app.get("/api/service-bundles")
def service_bundles():
    """Top service bundles — used by the worker PopularCombos component."""
    stats = get_service_stats()
    return stats["topBundles"]
