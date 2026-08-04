from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny  # Adjust permission policy if auth is required

from .services import DashboardService


def _parse_range(raw_range, default_days=7):
    """
    Parses a query param like '7d' / '30d' into an int day count.
    Falls back to default_days on anything malformed.
    """
    if not raw_range:
        return default_days
    try:
        return int(raw_range.rstrip('dD'))
    except (TypeError, ValueError):
        return default_days


class DashboardStatsView(APIView):
    """GET /dashboard/stats — KPI cards + order status breakdown."""
    permission_classes = [AllowAny]

    def get(self, request):
        data = {
            'kpis': DashboardService.get_kpis(),
            'order_status': DashboardService.get_order_status(),
        }
        return Response(data, status=status.HTTP_200_OK)


class DashboardChartsView(APIView):
    """GET /dashboard/charts?range=7d — sales trend chart."""
    permission_classes = [AllowAny]

    def get(self, request):
        days = _parse_range(request.query_params.get('range'))
        data = {
            'sales_chart': DashboardService.get_sales_chart(days=days),
        }
        return Response(data, status=status.HTTP_200_OK)


class DashboardTopProductsView(APIView):
    """GET /dashboard/top-products"""
    permission_classes = [AllowAny]

    def get(self, request):
        data = {
            'top_selling_products': DashboardService.get_top_products(),
        }
        return Response(data, status=status.HTTP_200_OK)


class DashboardLowStockView(APIView):
    """GET /dashboard/low-stock"""
    permission_classes = [AllowAny]

    def get(self, request):
        data = {
            'low_stock_products': DashboardService.get_low_stock(),
        }
        return Response(data, status=status.HTTP_200_OK)


class DashboardRecentOrdersView(APIView):
    """GET /dashboard/recent-orders"""
    permission_classes = [AllowAny]

    def get(self, request):
        data = {
            'recent_orders': DashboardService.get_recent_orders(),
        }
        return Response(data, status=status.HTTP_200_OK)