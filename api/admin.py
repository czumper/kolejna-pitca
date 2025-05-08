from django.contrib import admin
from .models import Category, Pizza, Ingredient, Topping

class IngredientInline(admin.TabularInline):
    model = Pizza.ingredients.through
    extra = 1

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