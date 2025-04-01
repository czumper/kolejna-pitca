from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, ActivateAccountView

# Tworzymy router dla viewsetów
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    # Endpointy generowane przez router
    path('', include(router.urls)),
    
    # Endpointy uwierzytelniania
    path('auth/register/', ActivateAccountView.as_view(), name='register'),
    path('auth/activate/', ActivateAccountView.as_view(), name='account-activate'),
    path('auth/token/', include('rest_framework_simplejwt.urls')),
    path('auth/password/reset/', ActivateAccountView.as_view(), name='password-reset'),
    path('auth/password/reset/confirm/', ActivateAccountView.as_view(), name='password-reset-confirm'),
    path('auth/password/change/', ActivateAccountView.as_view(), name='password-change'),
    path('auth/email/change/', ActivateAccountView.as_view(), name='email-change'),
    path('auth/user/', UserViewSet.as_view({'get': 'me', 'put': 'update_profile', 'patch': 'update_profile'}), name='user-profile'),
]