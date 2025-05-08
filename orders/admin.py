from django.contrib import admin
from .models import Order, OrderItem, OrderItemTopping

class OrderItemToppingInline(admin.TabularInline):
    model = OrderItemTopping
    extra = 1
    readonly_fields = ('topping_name', 'price')

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ('total_price', 'pizza_name', 'pizza_price')
    show_change_link = True

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer_name', 'status', 'total_amount', 'created_at', 'is_paid')
    list_filter = ('status', 'created_at', 'is_paid')
    search_fields = ('customer_name', 'customer_email', 'customer_phone')
    inlines = [OrderItemInline]
    readonly_fields = ('total_amount', 'created_at', 'updated_at', 'subtotal', 'delivery_fee', 'tax')
    fieldsets = (
        ('Customer Information', {
            'fields': ('customer_name', 'customer_email', 'customer_phone', 'delivery_address', 'delivery_instructions')
        }),
        ('Order Details', {
            'fields': ('order_notes', 'status', 'payment_method', 'is_paid', 'estimated_delivery_time')
        }),
        ('Financial Information', {
            'fields': ('subtotal', 'delivery_fee', 'tax', 'total_amount')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    actions = ['mark_as_preparing', 'mark_as_out_for_delivery', 'mark_as_delivered', 'mark_as_paid']

    def mark_as_preparing(self, request, queryset):
        queryset.update(status='preparing')
    mark_as_preparing.short_description = "Mark selected orders as preparing"

    def mark_as_out_for_delivery(self, request, queryset):
        queryset.update(status='out_for_delivery')
    mark_as_out_for_delivery.short_description = "Mark selected orders as out for delivery"

    def mark_as_delivered(self, request, queryset):
        queryset.update(status='delivered')
    mark_as_delivered.short_description = "Mark selected orders as delivered"

    def mark_as_paid(self, request, queryset):
        queryset.update(is_paid=True)
    mark_as_paid.short_description = "Mark selected orders as paid"