from django.contrib import admin
from .models import Category, Pizza, Ingredient, Topping, Order, OrderItem, OrderItemTopping

class IngredientInline(admin.TabularInline):
    model = Pizza.ingredients.through
    extra = 1

class OrderItemToppingInline(admin.TabularInline):
    model = OrderItemTopping
    extra = 1

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    readonly_fields = ['total_price']
    show_change_link = True

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'display_order']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']

@admin.register(Pizza)
class PizzaAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'price_medium', 'is_vegetarian', 'is_spicy', 'is_featured', 'available']
    list_filter = ['category', 'is_vegetarian', 'is_spicy', 'is_featured', 'available']
    search_fields = ['name', 'description']
    prepopulated_fields = {'slug': ('name',)}
    inlines = [IngredientInline]
    filter_horizontal = ['ingredients']

@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    list_display = ['name', 'is_vegetarian']
    list_filter = ['is_vegetarian']
    search_fields = ['name']

@admin.register(Topping)
class ToppingAdmin(admin.ModelAdmin):
    list_display = ['name', 'price_small', 'price_medium', 'price_large', 'is_vegetarian', 'available']
    list_filter = ['is_vegetarian', 'available']
    search_fields = ['name']

@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ['order', 'pizza', 'size', 'quantity', 'item_price', 'total_price']
    list_filter = ['size']
    search_fields = ['pizza__name', 'order__customer_name']
    inlines = [OrderItemToppingInline]
    readonly_fields = ['total_price']

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'customer_name', 'status', 'total_amount', 'created_at', 'is_paid']
    list_filter = ['status', 'created_at', 'is_paid']
    search_fields = ['customer_name', 'customer_email', 'customer_phone']
    inlines = [OrderItemInline]
    readonly_fields = ['subtotal', 'tax', 'total_amount', 'created_at', 'updated_at']
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