from django.db import models
from accounts.models import User, Address
from menu.models import Pizza, Topping

class Order(models.Model):
    STATUS_CHOICES = (
        ('received', 'Received'),
        ('preparing', 'Preparing'),
        ('out_for_delivery', 'Out for Delivery'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    )
    PAYMENT_CHOICES = (
        ('cash', 'Cash on Delivery'),
        ('card', 'Credit Card'),
    )
    
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    customer_name = models.CharField(max_length=100)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=15)
    delivery_address = models.TextField()
    delivery_instructions = models.TextField(blank=True)
    order_notes = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='received')
    payment_method = models.CharField(max_length=10, choices=PAYMENT_CHOICES, default='cash')
    total_amount = models.DecimalField(max_digits=8, decimal_places=2)
    subtotal = models.DecimalField(max_digits=8, decimal_places=2, default=0.00)  # Dodane
    delivery_fee = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)  # Dodane
    tax = models.DecimalField(max_digits=6, decimal_places=2, default=0.00)  # Dodane
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)  # Dodane, bo jest w serializers.py
    estimated_delivery_time = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    is_paid = models.BooleanField(default=False)  # Dodane, bo jest w admin.py
    
    def __str__(self):
        return f"Order #{self.id} - {self.customer_name}"

class OrderItem(models.Model):
    SIZE_CHOICES = (
        ('small', 'Small'),
        ('medium', 'Medium'),
        ('large', 'Large'),
    )
    
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    pizza = models.ForeignKey(Pizza, on_delete=models.SET_NULL, null=True, related_name='order_items')
    pizza_name = models.CharField(max_length=100)  # Store name at time of order
    pizza_price = models.DecimalField(max_digits=6, decimal_places=2)
    size = models.CharField(max_length=10, choices=SIZE_CHOICES, default='medium')
    quantity = models.PositiveIntegerField(default=1)
    toppings = models.ManyToManyField(Topping, through='OrderItemTopping')
    special_instructions = models.TextField(blank=True)
    total_price = models.DecimalField(max_digits=8, decimal_places=2)
    
    def __str__(self):
        return f"{self.quantity}x {self.pizza_name} ({self.size})"

class OrderItemTopping(models.Model):
    order_item = models.ForeignKey(OrderItem, on_delete=models.CASCADE)
    topping = models.ForeignKey(Topping, on_delete=models.SET_NULL, null=True)
    topping_name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    
    def __str__(self):
        return f"{self.topping_name} on {self.order_item}"