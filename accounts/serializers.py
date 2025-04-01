from rest_framework import serializers
from .models import User, Address
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.core.mail import EmailMessage
from django.conf import settings

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'first_name', 'last_name', 'phone_number')

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ('id', 'address_line1', 'address_line2', 'city', 'state', 'postal_code', 'is_default')

class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'password2', 'first_name', 'last_name')
        extra_kwargs = {'password': {'write_only': True}}
        
    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords must match.")
        validate_password(data['password'])
        return data
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        user.is_active = False  # Deaktywuj użytkownika do czasu weryfikacji
        user.save()
        
        # Generuj token weryfikacyjny
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # Przygotuj link aktywacyjny
        activation_link = f"http://localhost:3000/activate/{uid}/{token}"
        
        # Wyślij email
        subject = "Aktywuj swoje konto w Pitcerni"
        message = f"""
        Cześć {user.first_name},
        
        Dziękujemy za rejestrację w Pitcerni. Aby aktywować swoje konto, kliknij w poniższy link:
        
        {activation_link}
        
        Link jest ważny przez 24 godziny.
        
        Pozdrawiamy,
        Zespół Pitcerni
        """
        email = EmailMessage(
            subject,
            message,
            settings.DEFAULT_FROM_EMAIL,
            [user.email]
        )
        email.send()
        
        return user

class PasswordChangeSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    
    def validate_new_password(self, value):
        validate_password(value)
        return value