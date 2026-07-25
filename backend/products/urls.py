from django.urls import path
from .views import ProductDetailView,ProductListView
from .views import ProductDetailView, ProductListView, CategoryListView

app_name = 'products'

urlpatterns = [
    path(
        'categories/',
        CategoryListView.as_view(),
        name='category_list',
    ),
    path(
        '',
        ProductListView.as_view(),
        name='product_list',
    ),
    path(
        '<slug:slug>/',
        ProductDetailView.as_view(),
        name='product_detail',
    )
]