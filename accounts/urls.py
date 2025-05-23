from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, RegisterView, ActivateAccountView, ChangeEmailView

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/activate/<str:uidb64>/<str:token>/', ActivateAccountView.as_view(), name='account-activate'),
    path('auth/password/change/', UserViewSet.as_view({'post': 'change_password'}), name='password-change'),
    path('auth/email/change/', ChangeEmailView.as_view(), name='change-email'),
    path('auth/', include('djoser.urls')),
    path('auth/', include('djoser.urls.jwt')),
    path('auth/user/', UserViewSet.as_view({'get': 'me', 'put': 'update_profile', 'patch': 'update_profile'}), name='user-profile'),
]