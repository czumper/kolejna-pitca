from django.db import models
from django.conf import settings

class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    display_order = models.IntegerField(default=0)
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['display_order', 'name']

class Pizza(models.Model):
    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    description = models.TextField()
    price_small = models.DecimalField(max_digits=6, decimal_places=2)
    price_medium = models.DecimalField(max_digits=6, decimal_places=2)
    price_large = models.DecimalField(max_digits=6, decimal_places=2)
    image = models.ImageField(upload_to='pizzas/', blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='pizzas')
    ingredients = models.ManyToManyField('Ingredient', related_name='pizzas')
    is_vegetarian = models.BooleanField(default=False)
    is_spicy = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']

class Ingredient(models.Model):
    name = models.CharField(max_length=100)
    is_vegetarian = models.BooleanField(default=False)
    
    def __str__(self):
        return self.name

class Topping(models.Model):
    name = models.CharField(max_length=100)
    price_small = models.DecimalField(max_digits=5, decimal_places=2)
    price_medium = models.DecimalField(max_digits=5, decimal_places=2)
    price_large = models.DecimalField(max_digits=5, decimal_places=2)
    is_vegetarian = models.BooleanField(default=False)
    available = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name