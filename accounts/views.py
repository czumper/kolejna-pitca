from rest_framework import viewsets, permissions, status, generics
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from .models import User, Address
from .serializers import UserSerializer, AddressSerializer, UserRegistrationSerializer, PasswordChangeSerializer, ChangeEmailSerializer
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_str
from django.http import HttpResponseRedirect
from django.core.mail import send_mail
from django.conf import settings

class CheckUsernameView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        if not username:
            return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=username).exists():
            return Response({'available': False}, status=status.HTTP_200_OK)
        return Response({'available': True}, status=status.HTTP_200_OK)

class ActivateAccountView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            # Przekieruj na frontend z błędem
            return HttpResponseRedirect('https://pitcernia.ninja/activation?status=error')

        if default_token_generator.check_token(user, token):
            if user.is_active:
                return HttpResponseRedirect('https://pitcernia.ninja/activation?status=already_activated')
            user.is_active = True
            user.save()
            return HttpResponseRedirect('https://pitcernia.ninja/activation?status=success')
        return HttpResponseRedirect('https://pitcernia.ninja/activation?status=invalid')

class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return User.objects.filter(id=self.request.user.id)
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['put', 'patch'])
    def update_profile(self, request):
        user = request.user
        serializer = self.get_serializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def change_password(self, request):
        user = request.user
        serializer = PasswordChangeSerializer(data=request.data)
        if serializer.is_valid():
            if not user.check_password(serializer.data['old_password']):
                return Response({'old_password': 'Wrong password.'}, status=status.HTTP_400_BAD_REQUEST)
            
            user.set_password(serializer.data['new_password'])
            user.save()
            return Response({'status': 'password changed'})
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ChangeEmailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangeEmailSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            new_email = serializer.validated_data['email']
            # Wysłanie emaila z potwierdzeniem
            send_mail(
                'Potwierdź nowy adres email',
                f'Proszę potwierdzić nowy adres email: {new_email}',
                settings.DEFAULT_FROM_EMAIL,
                [new_email],
                fail_silently=False,
            )
            user.email = new_email
            user.save()
            return Response({"detail": "Email zmieniony pomyślnie. Sprawdź skrzynkę, aby potwierdzić."}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]

class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        # If this is the first address or is_default is True, make it the default
        is_default = serializer.validated_data.get('is_default', False)
        if is_default or not Address.objects.filter(user=self.request.user).exists():
            # Set all other addresses to not default
            Address.objects.filter(user=self.request.user).update(is_default=False)
        
        serializer.save(user=self.request.user)