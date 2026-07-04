from django.shortcuts import render
from .models import Product
from .serializers import ProductSerializer
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.postgres.search import (SearchVector,SearchQuery,SearchRank)
from django.contrib.postgres.search import TrigramSimilarity
from django.db.models import Case, When, Value, FloatField
from django.db.models.functions import Greatest

class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    filter_backends=[DjangoFilterBackend]
    filterset_fields = ['category', 'available', 'stock']
    
    def get_queryset(self):
        qs = Product.objects.all()
        q = self.request.query_params.get('search', '').strip()
        if q:
            if len(q) < 3:
                qs = qs.filter(name__icontains=q)
            else:
                try:
                    threshold = float(self.request.query_params.get('threshold', 0.2))
                    threshold = max(0.1, min(threshold, 0.8))
                except ValueError:
                    threshold = 0.2

                qs = (
                    qs.annotate(
                        similarity=Greatest(
                            TrigramSimilarity("name", q),
                            TrigramSimilarity("description", q),
                        ),
                        exact_match_weight=Case(
                            When(name__iexact=q, then=Value(1.0)),
                            When(name__istartswith=q, then=Value(0.5)),
                            default=Value(0.0),
                            output_field=FloatField(),
                        ),
                    )
                    .filter(similarity__gt=threshold)
                    .order_by("-exact_match_weight", "-similarity")
                )
            
        return qs

class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'
