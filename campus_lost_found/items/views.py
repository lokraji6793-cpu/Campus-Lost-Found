from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count
from .models import LostFoundItem
from .serializers import LostFoundItemSerializer

class LostFoundItemViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling CRUD operations on LostFoundItem records.
    Provides complete REST API behavior:
    - list, create, retrieve, update, partial_update, destroy
    - custom search across item_name, location, category, reported_by
    - custom filtering by status and category
    - custom actions: mark_returned and stats
    """
    queryset = LostFoundItem.objects.all()
    serializer_class = LostFoundItemSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['item_name', 'location', 'category', 'reported_by', 'description']
    ordering_fields = ['created_at', 'id', 'date_lost_found']
    ordering = ['-created_at', '-id']

    def get_queryset(self):
        """
        Custom filter logic for status and category query params
        """
        queryset = super().get_queryset()
        status_param = self.request.query_params.get('status', None)
        category_param = self.request.query_params.get('category', None)
        search_param = self.request.query_params.get('search', None)

        if status_param and status_param != 'All':
            queryset = queryset.filter(status=status_param)

        if category_param and category_param != 'All':
            queryset = queryset.filter(category=category_param)

        if search_param:
            queryset = queryset.filter(
                Q(item_name__icontains=search_param) |
                Q(location__icontains=search_param) |
                Q(category__icontains=search_param) |
                Q(reported_by__icontains=search_param) |
                Q(description__icontains=search_param)
            )

        return queryset

    @action(detail=True, methods=['post'], url_path='mark_returned')
    def mark_returned(self, request, pk=None):
        """
        Custom action to mark an item as Returned.
        POST /api/items/{id}/mark_returned/
        """
        item = self.get_object()
        item.status = 'Returned'
        item.save()
        serializer = self.get_serializer(item)
        return Response({
            "message": "Item marked as returned successfully.",
            "item": serializer.data
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='stats')
    def stats(self, request):
        """
        Aggregate statistics for the dashboard.
        GET /api/items/stats/
        """
        total = LostFoundItem.objects.count()
        lost = LostFoundItem.objects.filter(status='Lost').count()
        found = LostFoundItem.objects.filter(status='Found').count()
        returned = LostFoundItem.objects.filter(status='Returned').count()

        category_counts = (
            LostFoundItem.objects.values('category')
            .annotate(count=Count('id'))
            .order_by('-count')
        )
        by_category = {item['category']: item['count'] for item in category_counts}

        return Response({
            "total": total,
            "lost": lost,
            "found": found,
            "returned": returned,
            "by_category": by_category
        }, status=status.HTTP_200_OK)
