from django.contrib import admin
from .models import Order, OrderItem, OrderItemTopping

class OrderItemToppingInline(admin.TabularInline):
    model = OrderItemTopping
    extra = 1
    readonly_fields = ('topping_name', 'price')

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('pizza_name', 'pizza_price', 'total_price')
    inlines = [OrderItemToppingInline]

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer_name', 'status', 'payment_method', 'total_amount', 'created_at')
    list_filter = ('status', 'payment_method')
    search_fields = ('customer_name', 'customer_email', 'customer_phone')
    readonly_fields = ('total_amount', 'created_at')
    inlines = [OrderItemInline]
    date_hierarchy = 'created_at'