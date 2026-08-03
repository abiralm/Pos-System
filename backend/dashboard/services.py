from collections import defaultdict
from datetime import timedelta

from django.db.models import Sum, Count, F
from django.db.models.functions import TruncDate
from django.utils import timezone

from orders.models import Order, OrderItem
from products.models import Product


class DashboardService:
    """
    Aggregates all data needed for the dashboard. Views should stay thin
    and simply call get_dashboard() (or an individual method for the
    split-endpoint approach described in the guide).
    """

    LOW_STOCK_THRESHOLD = 10
    RECENT_ORDERS_LIMIT = 5
    TOP_PRODUCTS_LIMIT = 5
    CHART_DAYS = 7

    # ---- top level -------------------------------------------------

    @classmethod
    def get_dashboard(cls):
        now = timezone.now()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)

        return {
            'kpis': cls.get_kpis(today_start),
            'order_status': cls.get_order_status(),
            'sales_chart': cls.get_sales_chart(now),
            'top_selling_products': cls.get_top_products(),
            'low_stock_products': cls.get_low_stock(),
            'recent_orders': cls.get_recent_orders(),
        }

    # ---- individual widgets (also usable as split endpoints) -------

    @classmethod
    def get_kpis(cls, today=None):
        today_start = today or timezone.now().replace(
            hour=0, minute=0, second=0, microsecond=0
        )

        todays_paid_orders = Order.objects.filter(
            status='paid', created__gte=today_start
        )
        todays_sales = sum(o.get_grand_total() for o in todays_paid_orders)

        # NOTE: still Python-side summation via get_grand_total(), per the
        # guide this is acceptable until Order gets a stored `total` field.
        # Once it exists, swap both of these for:
        #   Order.objects.filter(status='paid').aggregate(total=Sum('total'))
        all_paid_orders = Order.objects.filter(status='paid')
        total_revenue = sum(o.get_grand_total() for o in all_paid_orders)

        return {
            'todays_sales': float(todays_sales),
            'total_orders': Order.objects.count(),
            'total_revenue': float(total_revenue),
            'pending_orders': Order.objects.filter(status='pending').count(),
        }

    @classmethod
    def get_order_status(cls):
        status_dict = {'paid': 0, 'pending': 0, 'cancelled': 0}
        status_counts = Order.objects.values('status').annotate(count=Count('id'))
        for item in status_counts:
            if item['status'] in status_dict:
                status_dict[item['status']] = item['count']
        return status_dict

    @classmethod
    def get_sales_chart(cls, now=None, days=None):
        now = now or timezone.now()
        days = days or cls.CHART_DAYS
        range_start = (now - timedelta(days=days - 1)).replace(
            hour=0, minute=0, second=0, microsecond=0
        )

        # Single query for the whole range instead of one query per day.
        orders = Order.objects.filter(
            status='paid', created__gte=range_start
        ).annotate(day=TruncDate('created'))

        by_day = defaultdict(lambda: {'revenue': 0, 'orders': 0})
        for order in orders:
            bucket = by_day[order.day]
            bucket['revenue'] += order.get_grand_total()
            bucket['orders'] += 1

        chart = []
        for i in range(days - 1, -1, -1):
            day_date = (now - timedelta(days=i)).date()
            bucket = by_day.get(day_date, {'revenue': 0, 'orders': 0})
            chart.append({
                'date': day_date.strftime('%b %d'),
                'revenue': float(bucket['revenue']),
                'orders': bucket['orders'],
            })
        return chart

    @classmethod
    def get_top_products(cls, limit=None):
        limit = limit or cls.TOP_PRODUCTS_LIMIT
        top_selling = (
            OrderItem.objects.filter(order__status='paid')
            .values('product_id', 'product_name')
            .annotate(
                total_quantity=Sum('quantity'),
                total_revenue=Sum(F('price') * F('quantity')),
            )
            .order_by('-total_quantity')[:limit]
        )
        return [
            {
                'product_id': item['product_id'],
                'name': item['product_name'] or f"Product #{item['product_id']}",
                'total_quantity': item['total_quantity'] or 0,
                'total_revenue': float(item['total_revenue'] or 0),
            }
            for item in top_selling
        ]

    @classmethod
    def get_low_stock(cls, limit=None):
        limit = limit or cls.TOP_PRODUCTS_LIMIT
        low_stock_qs = Product.objects.filter(
            stock__lte=cls.LOW_STOCK_THRESHOLD
        ).order_by('stock')[:limit]
        return [
            {'id': p.id, 'name': p.name, 'stock': p.stock, 'price': float(p.price)}
            for p in low_stock_qs
        ]

    @classmethod
    def get_recent_orders(cls, limit=None):
        limit = limit or cls.RECENT_ORDERS_LIMIT
        recent_orders_qs = (
            Order.objects.all()
            .annotate(items_count=Count('items'))
            .order_by('-created')[:limit]
        )
        return [
            {
                'id': o.id,
                'customer_name': o.customer_name,
                'email': o.email,
                'status': o.status,
                'items_count': o.items_count,
                'total': float(o.get_grand_total()),
                'created': o.created.isoformat(),
            }
            for o in recent_orders_qs
        ]