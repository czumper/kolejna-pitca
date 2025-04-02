from django.contrib import admin
from django.urls import path, include, re_path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from accounts.views import UserViewSet, AddressViewSet, RegisterView, ActivateAccountView
from menu.views import CategoryViewSet, ToppingViewSet, PizzaViewSet
from orders.views import OrderViewSet, OrderTrackingView
from reviews.views import ReviewViewSet
from django.views.generic import TemplateView
from django.views.static import serve

# API Router
router = DefaultRouter()
router.register(r'auth/user', UserViewSet, basename='user')
router.register(r'addresses', AddressViewSet, basename='address')
router.register(r'menu/categories', CategoryViewSet, basename='category')
router.register(r'menu/toppings', ToppingViewSet, basename='topping')
router.register(r'menu/pizzas', PizzaViewSet, basename='pizza')
router.register(r'orders', OrderViewSet, basename='order')
router.register(r'reviews', ReviewViewSet, basename='review')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/auth/', include('djoser.urls')),
    path('api/auth/', include('djoser.urls.jwt')),
    path('api/auth/register/', RegisterView.as_view(), name='register'),
    path('api/auth/activation/<str:uidb64>/<str:token>/', ActivateAccountView.as_view(), name='account-activate'),
    path('api/orders/track/', OrderTrackingView.as_view(), name='order-tracking'),
    path('', TemplateView.as_view(template_name='index.html')),
    re_path(r'^(?!api/).*$', TemplateView.as_view(template_name='index.html'), name='index'),
#    path('', serve, {'document_root': settings.STATICFILES_DIRS[0], 'path': 'index.html'}),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)