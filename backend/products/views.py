from django.shortcuts import render
from .models import Product,Category
from .serializers import ProductSerializer,CategorySerializer
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.postgres.search import (SearchVector,SearchQuery,SearchRank)
from django.contrib.postgres.search import TrigramSimilarity

class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    filter_backends=[DjangoFilterBackend]
    filterset_fields = ['category', 'available']
    
    def get_queryset(self):
        qs = Product.objects.all()
        q = self.request.query_params.get('search')
        if q:
            qs = (qs.annotate(similarity=TrigramSimilarity("name", q),).filter(similarity__gt=0.1).order_by( "-similarity"))
            
        return qs

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'
