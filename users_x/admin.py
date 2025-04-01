from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser, DeliveryAddress

class DeliveryAddressInline(admin.TabularInline):
    model = DeliveryAddress
    extra = 0

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_active', 'is_staff')
    search_fields = ('email', 'first_name', 'last_name')
    ordering = ('email',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('username', 'first_name', 'last_name', 'phone_number', 'date_of_birth')}),
        ('Address', {'fields': ('address', 'city', 'postal_code')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 'first_name', 'last_name'),
        }),
    )
    
    inlines = [DeliveryAddressInline]

@admin.register(DeliveryAddress)
class DeliveryAddressAdmin(admin.ModelAdmin):
    list_display = ('user', 'address_name', 'city', 'is_default')
    list_filter = ('is_default', 'city')
    search_fields = ('user__email', 'street_address', 'city')