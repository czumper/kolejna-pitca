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
    filterset_fields = {
        'category': ['exact'],
        'is_vegetarian': ['exact'],
        'is_spicy': ['exact'],
        'is_featured': ['exact'],
        'price_small': ['gte', 'lte'],
        'price_medium': ['gte', 'lte'],
        'price_large': ['gte', 'lte'],
    }
    search_fields = ['name', 'description']
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PizzaDetailSerializer
        return PizzaSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        size = self.request.query_params.get('size', 'medium')

        # Walidacja parametru size
        if size not in ['small', 'medium', 'large']:
            size = 'medium'

        # Sortowanie według ceny dla wybranego rozmiaru
        if size == 'small':
            queryset = queryset.order_by('price_small')
        elif size == 'medium':
            queryset = queryset.order_by('price_medium')
        elif size == 'large':
            queryset = queryset.order_by('price_large')

        # Filtrowanie po cenie dla wybranego rozmiaru
        price_min = self.request.query_params.get(f'price_{size}_min', None)
        price_max = self.request.query_params.get(f'price_{size}_max', None)

        try:
            if price_min:
                price_min = float(price_min)
                if size == 'small':
                    queryset = queryset.filter(price_small__gte=price_min)
                elif size == 'medium':
                    queryset = queryset.filter(price_medium__gte=price_min)
                elif size == 'large':
                    queryset = queryset.filter(price_large__gte=price_min)

            if price_max:
                price_max = float(price_max)
                if size == 'small':
                    queryset = queryset.filter(price_small__lte=price_max)
                elif size == 'medium':
                    queryset = queryset.filter(price_medium__lte=price_max)
                elif size == 'large':
                    queryset = queryset.filter(price_large__lte=price_max)
        except ValueError:
            # Jeśli cena nie jest liczbą, ignoruj parametr
            pass

        return queryset

    @action(detail=False)
    def featured(self, request):
        featured_pizzas = Pizza.objects.filter(is_featured=True)
        serializer = self.get_serializer(featured_pizzas, many=True)
        return Response(serializer.data)