from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, DeliveryAddressViewSet, RegisterView, VerifyEmailView

router = DefaultRouter()
router.register(r'profile', UserViewSet)
router.register(r'addresses', DeliveryAddressViewSet, basename='address')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-email/<str:uidb64>/<str:token>/', VerifyEmailView.as_view(), name='verify_email'),
]