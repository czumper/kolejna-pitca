from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Pizza, Topping
from orders.models import Order, OrderItem  # Zmiana importu
from .serializers import (
    CategorySerializer, PizzaListSerializer, PizzaDetailSerializer,
    ToppingSerializer, OrderSerializer, OrderCreateSerializer
)

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class PizzaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Pizza.objects.filter(available=True)
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_vegetarian', 'is_spicy', 'is_featured']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'price_medium']
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PizzaDetailSerializer
        return PizzaListSerializer
    
    @action(detail=False)
    def featured(self, request):
        featured_pizzas = Pizza.objects.filter(is_featured=True, available=True)
        page = self.paginate_queryset(featured_pizzas)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(featured_pizzas, many=True)
        return Response(serializer.data)
    
    @action(detail=False)
    def vegetarian(self, request):
        vegetarian_pizzas = Pizza.objects.filter(is_vegetarian=True, available=True)
        page = self.paginate_queryset(vegetarian_pizzas)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(vegetarian_pizzas, many=True)
        return Response(serializer.data)
    
    @action(detail=False, url_path='category/(?P<category_slug>[-\w]+)')
    def by_category(self, request, category_slug=None):
        category = get_object_or_404(Category, slug=category_slug)
        pizzas = self.get_queryset().filter(category=category)
        page = self.paginate_queryset(pizzas)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(pizzas, many=True)
        return Response(serializer.data)

class ToppingViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Topping.objects.filter(available=True)
    serializer_class = ToppingSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['is_vegetarian']

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return Order.objects.all()
        elif user.is_authenticated:
            return Order.objects.filter(user=user)
        return Order.objects.none()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        if request.user.is_authenticated:
            serializer.validated_data['user'] = request.user
        order = serializer.save()
        headers = self.get_success_headers(serializer.data)
        return Response(
            self.get_serializer_class()(order).data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )
    
    @action(detail=False, methods=['get'])
    def my_orders(self, request):
        if not request.user.is_authenticated:
            return Response(
                {"error": "Authentication required"},
                status=status.HTTP_401_UNAUTHORIZED
            )
        orders = Order.objects.filter(user=request.user)
        page = self.paginate_queryset(orders)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'], url_path='track/(?P<email>[^/.]+)')
    def track_order(self, request, pk=None, email=None):
        try:
            order = Order.objects.get(pk=pk, customer_email=email)
            serializer = self.get_serializer(order)
            return Response(serializer.data)
        except Order.DoesNotExist:
            return Response(
                {"error": "Order not found with the provided email."},
                status=status.HTTP_404_NOT_FOUND
            )