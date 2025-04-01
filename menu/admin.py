from django.contrib import admin
from .models import Category, Ingredient, Topping, Pizza

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_vegetarian')
    list_filter = ('is_vegetarian',)
    search_fields = ('name',)

@admin.register(Topping)
class ToppingAdmin(admin.ModelAdmin):
    list_display = ('name', 'price_small', 'price_medium', 'price_large', 'is_vegetarian')
    list_filter = ('is_vegetarian',)
    search_fields = ('name',)

@admin.register(Pizza)
class PizzaAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price_small', 'price_medium', 'price_large', 'is_vegetarian', 'is_spicy', 'is_featured')
    list_filter = ('category', 'is_vegetarian', 'is_spicy', 'is_featured')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}