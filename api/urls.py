from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, PizzaViewSet, ToppingViewSet, OrderViewSet

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'pizzas', PizzaViewSet)
router.register(r'toppings', ToppingViewSet)
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('', include(router.urls)),
]