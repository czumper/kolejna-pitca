from rest_framework import viewsets, permissions, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Ingredient, Topping, Pizza
from .serializers import CategorySerializer, IngredientSerializer, ToppingSerializer, PizzaSerializer, PizzaDetailSerializer

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]

class ToppingViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Topping.objects.all()
    serializer_class = ToppingSerializer
    permission_classes = [permissions.AllowAny]

class PizzaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Pizza.objects.all()
    serializer_class = PizzaSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['category', 'is_vegetarian', 'is_spicy', 'is_featured']
    search_fields = ['name', 'description']
    lookup_field = 'slug'
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PizzaDetailSerializer
        return PizzaSerializer
    
    @action(detail=False)
    def featured(self, request):
        featured_pizzas = Pizza.objects.filter(is_featured=True)
        serializer = self.get_serializer(featured_pizzas, many=True)
        return Response(serializer.data)