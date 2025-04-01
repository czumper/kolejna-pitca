from rest_framework import viewsets, generics, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from django.conf import settings
from django.core.mail import send_mail
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.urls import reverse
from .models import DeliveryAddress
from .serializers import (UserSerializer, DeliveryAddressSerializer, 
                         RegisterUserSerializer, ChangePasswordSerializer,
                         ChangeEmailSerializer)

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        # Regular users can only access their own profile
        if self.request.user.is_staff:
            return User.objects.all()
        return User.objects.filter(id=self.request.user.id)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put'], serializer_class=ChangePasswordSerializer)
    def change_password(self, request):
        user = request.user
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            # Check old password
            if not user.check_password(serializer.validated_data['old_password']):
                return Response({"old_password": ["Wrong password."]}, 
                               status=status.HTTP_400_BAD_REQUEST)
            
            # Set new password
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({"status": "password changed successfully"})
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=False, methods=['put'], serializer_class=ChangeEmailSerializer)
    def change_email(self, request):
        user = request.user
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            new_email = serializer.validated_data['new_email']
            
            # Store the current email
            old_email = user.email
            
            # Update the user's email
            user.email = new_email
            user.is_active = False  # Deactivate until verified
            user.save()
            
            # Send verification email
            self.send_verification_email(request, user)
            
            return Response({
                "status": "An email verification has been sent to your new email address.",
                "message": "Your account will be deactivated until you verify your new email."
            })
            
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def send_verification_email(self, request, user):
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        domain = request.build_absolute_uri('/').rstrip('/')
        
        verification_url = f"{domain}/verify-email/{uid}/{token}/"
        
        send_mail(
            'Verify your email address',
            f'Please click the link to verify your email: {verification_url}',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = RegisterUserSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Send verification email
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        domain = request.build_absolute_uri('/').rstrip('/')
        
        verification_url = f"{domain}/verify-email/{uid}/{token}/"
        
        send_mail(
            'Verify your email address',
            f'Please click the link to verify your email: {verification_url}',
            settings.DEFAULT_FROM_EMAIL,
            [user.email],
            fail_silently=False,
        )
        
        return Response({
            "message": "User registered successfully. Please check your email to verify your account."
        }, status=status.HTTP_201_CREATED)

class VerifyEmailView(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
            
            if default_token_generator.check_token(user, token):
                user.is_active = True
                user.save()
                return Response({
                    "message": "Email verified successfully. You can now login."
                }, status=status.HTTP_200_OK)
            
            return Response({
                "error": "Verification link is invalid or expired."
            }, status=status.HTTP_400_BAD_REQUEST)
            
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({
                "error": "Invalid user ID or token."
            }, status=status.HTTP_400_BAD_REQUEST)

class DeliveryAddressViewSet(viewsets.ModelViewSet):
    serializer_class = DeliveryAddressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return DeliveryAddress.objects.filter(user=self.request.user)
    
    @action(detail=True, methods=['put'])
    def set_default(self, request, pk=None):
        address = self.get_object()
        
        # Unset any existing default addresses
        DeliveryAddress.objects.filter(
            user=request.user, is_default=True
        ).update(is_default=False)
        
        # Set this address as default
        address.is_default = True
        address.save()
        
        serializer = self.get_serializer(address)
        return Response(serializer.data)