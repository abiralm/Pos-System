from django.urls import path
from .views import (
    DashboardStatsView,
    DashboardChartsView,
    DashboardTopProductsView,
    DashboardLowStockView,
    DashboardRecentOrdersView,
)

urlpatterns = [
    path('stats/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('charts/', DashboardChartsView.as_view(), name='dashboard-charts'),
    path('top-products/', DashboardTopProductsView.as_view(), name='dashboard-top-products'),
    path('low-stock/', DashboardLowStockView.as_view(), name='dashboard-low-stock'),
    path('recent-orders/', DashboardRecentOrdersView.as_view(), name='dashboard-recent-orders'),
]