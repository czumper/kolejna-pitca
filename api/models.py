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

class Order(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('preparing', 'Preparing'),
        ('out_for_delivery', 'Out for Delivery'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, 
                             null=True, blank=True, related_name='api_orders')
    customer_name = models.CharField(max_length=100)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=15)
    delivery_address = models.TextField()
    delivery_instructions = models.TextField(blank=True)
    order_notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    subtotal = models.DecimalField(max_digits=8, decimal_places=2)
    delivery_fee = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)
    tax = models.DecimalField(max_digits=6, decimal_places=2)
    total_amount = models.DecimalField(max_digits=8, decimal_places=2)
    payment_method = models.CharField(max_length=50, default='cash')
    is_paid = models.BooleanField(default=False)
    estimated_delivery_time = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Order #{self.id} - {self.customer_name}"
        
    class Meta:
        ordering = ['-created_at']

class OrderItem(models.Model):
    SIZE_CHOICES = [
        ('small', 'Small'),
        ('medium', 'Medium'),
        ('large', 'Large'),
    ]
    
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    pizza = models.ForeignKey(Pizza, on_delete=models.CASCADE)
    size = models.CharField(max_length=10, choices=SIZE_CHOICES)
    quantity = models.PositiveIntegerField(default=1)
    item_price = models.DecimalField(max_digits=7, decimal_places=2)  # Price per unit
    toppings = models.ManyToManyField(Topping, through='OrderItemTopping', blank=True)
    special_instructions = models.TextField(blank=True)
    
    def __str__(self):
        return f"{self.quantity} x {self.pizza.name} ({self.size})"
        
    @property
    def total_price(self):
        base_price = self.item_price * self.quantity
        topping_price = sum(item.price for item in self.orderitemtopping_set.all())
        return base_price + topping_price

class OrderItemTopping(models.Model):
    order_item = models.ForeignKey(OrderItem, on_delete=models.CASCADE)
    topping = models.ForeignKey(Topping, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=6, decimal_places=2)  # Price at time of order
    
    class Meta:
        unique_together = ('order_item', 'topping')