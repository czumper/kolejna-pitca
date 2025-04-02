from rest_framework import serializers
from .models import Category, Ingredient, Topping, Pizza

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'image']

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'is_vegetarian']

class ToppingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topping
        fields = ['id', 'name', 'price_small', 'price_medium', 'price_large', 'is_vegetarian']

class PizzaSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    ingredients = IngredientSerializer(many=True, read_only=True)
    
    class Meta:
        model = Pizza
        fields = [
            'id', 'name', 'slug', 'description', 'category', 'category_name',
            'price_small', 'price_medium', 'price_large', 'image',
            'ingredients', 'is_vegetarian', 'is_spicy', 'is_featured'
        ]

class PizzaDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    ingredients = IngredientSerializer(many=True, read_only=True)
    
    class Meta:
        model = Pizza
        fields = [
            'id', 'name', 'slug', 'description', 'category',
            'price_small', 'price_medium', 'price_large', 'image',
            'ingredients', 'is_vegetarian', 'is_spicy', 'is_featured'
        ]