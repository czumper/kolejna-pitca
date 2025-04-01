from django.core.management.base import BaseCommand
from django.utils.text import slugify
from accounts.models import User
from menu.models import Category, Ingredient, Topping, Pizza
from datetime import datetime

class Command(BaseCommand):
    help = 'Tworzy przykładowe dane dla aplikacji pizzy'

    def handle(self, *args, **kwargs):
        self.stdout.write('Tworzenie przykładowych danych...')
        
        # Tworzenie kategorii
        categories = [
            {"name": "Klasyczna", "description": "No to teraz polecimy klasyczkiem"},
            {"name": "Specjalna", "description": "Pizza szefowska, specjalność szefa"},
            {"name": "Wege", "description": "Taka se bo bez mięsa"},
            {"name": "Ostra", "description": "Dla pojebów"}
        ]
        
        for cat_data in categories:
            Category.objects.get_or_create(name=cat_data["name"], defaults=cat_data)
        
        # Tworzenie składników
        ingredients = [
            {"name": "Sos pomidorowy", "is_vegetarian": True},
            {"name": "Mozzarella", "is_vegetarian": True},
            {"name": "Salami", "is_vegetarian": False},
            {"name": "Grzyb ze stopy", "is_vegetarian": True},
            {"name": "Papryka", "is_vegetarian": True},
            {"name": "Cebula", "is_vegetarian": True},
            {"name": "Pomidorki", "is_vegetarian": True},
            {"name": "Kiełbaska", "is_vegetarian": False},
            {"name": "Bekon", "is_vegetarian": False},
            {"name": "Szpinak", "is_vegetarian": True},
            {"name": "Ser spod napleta", "is_vegetarian": True},
            {"name": "Jalapeño", "is_vegetarian": True},
            {"name": "Kurczak", "is_vegetarian": False},
            {"name": "Sos czosnkowy", "is_vegetarian": True}
        ]
        
        for ing_data in ingredients:
            Ingredient.objects.get_or_create(name=ing_data["name"], defaults=ing_data)
        
        # Tworzenie dodatków
        toppings = [
            {"name": "Więcej sera", "price_small": 3.00, "price_medium": 4.50, "price_large": 6.00, "is_vegetarian": True},
            {"name": "Salami", "price_small": 3.00, "price_medium": 4.50, "price_large": 6.00, "is_vegetarian": False},
            {"name": "Grzyb ze stopy", "price_small": 3.00, "price_medium": 4.50, "price_large": 6.00, "is_vegetarian": True},
            {"name": "Papryka", "price_small": 3.00, "price_medium": 4.50, "price_large": 6.00, "is_vegetarian": True},
            {"name": "Cebula", "price_small": 3.00, "price_medium": 4.50, "price_large": 6.00, "is_vegetarian": True},
            {"name": "Pomidorki", "price_small": 3.00, "price_medium": 4.50, "price_large": 6.00, "is_vegetarian": True},
            {"name": "Kiełbasa", "price_small": 3.00, "price_medium": 4.50, "price_large": 6.00, "is_vegetarian": False},
            {"name": "Bekon", "price_small": 3.00, "price_medium": 4.50, "price_large": 6.00, "is_vegetarian": False},
            {"name": "Szpinak", "price_small": 3.00, "price_medium": 4.50, "price_large": 6.00, "is_vegetarian": True},
            {"name": "Jalapeño", "price_small": 3.00, "price_medium": 4.50, "price_large": 6.00, "is_vegetarian": True}
        ]
        
        for top_data in toppings:
            Topping.objects.get_or_create(name=top_data["name"], defaults=top_data)
        
        # Tworzenie pizz
        pizzas = [
            {
                "name": "Margarita", 
                "description": "Klasyczna pizza z pomidorkami i mozarellą",
                "category": "Klasyczna",
                "price_small": 32.99,
                "price_medium": 39.99,
                "price_large": 45.99,
                "is_vegetarian": True,
                "is_spicy": False,
                "is_featured": True,
                "ingredients": ["Sos pomidorowy", "Mozzarella"]
            },
            {
                "name": "Salami", 
                "description": "Salami, mozarella i sos pomidorowy - po prostu zajebista",
                "category": "Klasyczna",
                "price_small": 35.99,
                "price_medium": 43.99,
                "price_large": 49.99,
                "is_vegetarian": False,
                "is_spicy": False,
                "is_featured": True,
                "ingredients": ["Sos pomidorowy", "Mozzarella", "Salami"]
            },
            {
                "name": "Wege Supreme", 
                "description": "Naładowana papryką, cebulą, grzybami, oliwkami i pomidorkami.",
                "category": "Wege",
                "price_small": 13.99,
                "price_medium": 16.99,
                "price_large": 19.99,
                "is_vegetarian": True,
                "is_spicy": False,
                "is_featured": True,
                "ingredients": ["Sos pomidorowy", "Mozzarella", "Grzyby", "Papryka", "Cebula", "Oliwki"]
            },
            {
                "name": "Mięsna uczta", 
                "description": "Dla mięsożerców - pepperoni, kiełbasa, bekon i mozzarella.",
                "category": "Specjalna",
                "price_small": 14.99,
                "price_medium": 17.99,
                "price_large": 20.99,
                "is_vegetarian": False,
                "is_spicy": False,
                "is_featured": True,
                "ingredients": ["Sos pomidorowy", "Mozzarella", "Pepperoni", "Kiełbasa", "Bekon"]
            },
            {
                "name": "Buffalo Chicken", 
                "description": "Ostry kurczak buffalo, mozzarella i odrobina sosu ranch.",
                "category": "Ostra",
                "price_small": 13.99,
                "price_medium": 16.99,
                "price_large": 19.99,
                "is_vegetarian": False,
                "is_spicy": True,
                "is_featured": False,
                "ingredients": ["Sos buffalo", "Mozzarella", "Kurczak", "Cebula"]
            },
            {
                "name": "Śródziemnomorska", 
                "description": "Smak śródziemnomorski ze szpinakiem, fetą, oliwkami i pomidorkami.",
                "category": "Specjalna",
                "price_small": 13.99,
                "price_medium": 16.99,
                "price_large": 19.99,
                "is_vegetarian": True,
                "is_spicy": False,
                "is_featured": False,
                "ingredients": ["Sos pomidorowy", "Mozzarella", "Szpinak", "Feta", "Oliwki"]
            },
            {
                "name": "Ostra Deluxe", 
                "description": "Dla miłośników ostrości - ostra kiełbasa, jalapeño, papryka i cebula.",
                "category": "Ostra",
                "price_small": 14.99,
                "price_medium": 17.99,
                "price_large": 20.99,
                "is_vegetarian": False,
                "is_spicy": True,
                "is_featured": True,
                "ingredients": ["Sos pomidorowy", "Mozzarella", "Kiełbasa", "Jalapeño", "Papryka", "Cebula"]
            }
        ]
        
        # Tworzenie pizz
        for pizza_data in pizzas:
            category = Category.objects.get(name=pizza_data.pop("category"))
            ingredient_names = pizza_data.pop("ingredients")
            
            pizza, created = Pizza.objects.get_or_create(
                name=pizza_data["name"],
                defaults={**pizza_data, "category": category}
            )
            
            if created:
                # Dodawanie składników
                for ing_name in ingredient_names:
                    ingredient = Ingredient.objects.get(name=ing_name)
                    pizza.ingredients.add(ingredient)
        
        self.stdout.write(self.style.SUCCESS('Przykładowe dane zostały pomyślnie utworzone!'))