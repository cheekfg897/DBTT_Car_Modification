"""
main.py — FastAPI backend for the Vos Automotive dashboard.

Start with:
    pip install -r requirements.txt
    uvicorn main:app --reload --port 8000

Endpoints from analysis.py (notebook logic, sections 4-11):
  GET /api/projections       — historical + baseline vs digital (2020-2029)
  GET /api/service-stats     — popular services, bundles, AOV, budget bands, style prefs
  GET /api/recommendations   — cross-sell rules
  GET /api/uplift-kpis       — headline business findings

Endpoints from mock_data.py (ported frontend-only items):
  GET /api/kpis              — 4 operational KPI cards
  GET /api/monthly-revenue   — monthly revenue chart data (2025)
  GET /api/service-breakdown — service category pie chart
  GET /api/trend-insights    — color/finish trend insights
  GET /api/supply-alerts     — inventory stock alerts
  GET /api/service-bundles   — top service bundles (for worker PopularCombos)
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from analysis import get_projections, get_service_stats, get_recommendations, get_uplift_kpis, get_inventory_predictions
from mock_data import get_monthly_revenue, get_kpi_stats, get_service_breakdown, get_trend_insights, get_supply_alerts

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


@app.get("/api/supply-alerts")
def supply_alerts():
    return get_supply_alerts()


@app.get("/api/service-bundles")
def service_bundles():
    """Top service bundles — used by the worker PopularCombos component."""
    stats = get_service_stats()
    return stats["topBundles"]
