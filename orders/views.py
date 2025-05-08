from rest_framework import viewsets, permissions, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Order
from .serializers import OrderSerializer, OrderCreateSerializer, OrderTrackingSerializer

class OrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

    def retrieve(self, request, *args, **kwargs):
        # Pobierz zamówienie
        instance = get_object_or_404(Order, pk=kwargs.get('pk'))
        # Sprawdź, czy użytkownik jest właścicielem lub adminem
        if instance.user != request.user and not request.user.is_staff:
            return Response(
                {"detail": "Nie masz uprawnień do wyświetlenia tego zamówienia."},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def user(self, request):
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        page = self.paginate_queryset(orders)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(orders, many=True)
        return Response(serializer.data)

class OrderTrackingView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = OrderTrackingSerializer

    def get(self, request):
        orderId = request.query_params.get('id')
        email = request.query_params.get('email')

        if not orderId or not email:
            return Response(
                {"error": "Both order ID and email are required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            order = Order.objects.get(id=orderId, customer_email=email)
        except Order.DoesNotExist:
            return Response(
                {"error": "No order found with the provided details"},
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(OrderSerializer(order).data)