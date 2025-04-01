from rest_framework import serializers
from .models import Category, Pizza, Ingredient, Topping, Order, OrderItem, OrderItemTopping
from django.db import transaction

class IngredientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ingredient
        fields = ['id', 'name', 'is_vegetarian']

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image', 'display_order']

class ToppingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Topping
        fields = ['id', 'name', 'price_small', 'price_medium', 'price_large', 'is_vegetarian', 'available']

class PizzaListSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    
    class Meta:
        model = Pizza
        fields = [
            'id', 'name', 'slug', 'description', 'price_small', 'price_medium', 
            'price_large', 'image', 'category', 'category_name', 
            'is_vegetarian', 'is_spicy', 'is_featured', 'available'
        ]

class PizzaDetailSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    ingredients = IngredientSerializer(many=True, read_only=True)
    
    class Meta:
        model = Pizza
        fields = [
            'id', 'name', 'slug', 'description', 'price_small', 'price_medium', 
            'price_large', 'image', 'category', 'ingredients', 
            'is_vegetarian', 'is_spicy', 'is_featured', 'available'
        ]

class OrderItemToppingSerializer(serializers.ModelSerializer):
    topping_name = serializers.ReadOnlyField(source='topping.name')
    
    class Meta:
        model = OrderItemTopping
        fields = ['topping', 'topping_name', 'price']

class OrderItemSerializer(serializers.ModelSerializer):
    pizza_name = serializers.ReadOnlyField(source='pizza.name')
    pizza_image = serializers.ImageField(source='pizza.image', read_only=True)
    toppings = OrderItemToppingSerializer(source='orderitemtopping_set', many=True, read_only=True)
    topping_details = serializers.SerializerMethodField()
    
    class Meta:
        model = OrderItem
        fields = [
            'id', 'pizza', 'pizza_name', 'pizza_image', 'size', 'quantity',
            'item_price', 'toppings', 'topping_details', 'special_instructions',
            'total_price'
        ]
    
    def get_topping_details(self, obj):
        toppings_data = []
        for item_topping in obj.orderitemtopping_set.all():
            toppings_data.append({
                'id': item_topping.topping.id,
                'name': item_topping.topping.name,
                'price': item_topping.price
            })
        return toppings_data

class OrderCreateItemSerializer(serializers.ModelSerializer):
    toppings = serializers.PrimaryKeyRelatedField(
        queryset=Topping.objects.filter(available=True),
        many=True,
        required=False
    )
    
    class Meta:
        model = OrderItem
        fields = ['pizza', 'size', 'quantity', 'toppings', 'special_instructions']

    def validate(self, attrs):
        pizza = attrs['pizza']
        if not pizza.available:
            raise serializers.ValidationError(f"Pizza '{pizza.name}' is currently unavailable")
        
        # Check if all toppings are available if any are specified
        if 'toppings' in attrs:
            unavailable = [t.name for t in attrs['toppings'] if not t.available]
            if unavailable:
                raise serializers.ValidationError(f"These toppings are unavailable: {', '.join(unavailable)}")
        
        return attrs

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_id = serializers.IntegerField(write_only=True, required=False)
    
    class Meta:
        model = Order
        fields = [
            'id', 'user_id', 'customer_name', 'customer_email', 'customer_phone',
            'delivery_address', 'delivery_instructions', 'order_notes', 
            'status', 'created_at', 'updated_at', 'subtotal', 'delivery_fee',
            'tax', 'total_amount', 'payment_method', 'is_paid',
            'estimated_delivery_time', 'items'
        ]
        read_only_fields = ['status', 'created_at', 'updated_at', 'is_paid',
                           'estimated_delivery_time', 'subtotal', 'tax',
                           'total_amount']

class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderCreateItemSerializer(many=True)
    
    class Meta:
        model = Order
        fields = [
            'customer_name', 'customer_email', 'customer_phone',
            'delivery_address', 'delivery_instructions', 'order_notes', 
            'payment_method', 'items'
        ]
    
    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        
        # Calculate totals
        subtotal = 0
        tax_rate = 0.08  # 8% tax rate
        delivery_fee = 5.00  # Fixed delivery fee
        
        # Create order
        order = Order.objects.create(
            **validated_data,
            subtotal=0,  # Temporary, will update
            tax=0,  # Temporary, will update
            total_amount=0,  # Temporary, will update
            delivery_fee=delivery_fee
        )
        
        # Create order items and toppings
        for item_data in items_data:
            toppings = item_data.pop('toppings', [])
            size = item_data['size']
            pizza = item_data['pizza']
            quantity = item_data['quantity']
            
            # Get the price based on size
            if size == 'small':
                item_price = pizza.price_small
            elif size == 'medium':
                item_price = pizza.price_medium
            else:  # large
                item_price = pizza.price_large
            
            # Create order item
            order_item = OrderItem.objects.create(
                order=order,
                item_price=item_price,
                **item_data
            )
            
            # Add toppings if any
            for topping in toppings:
                if size == 'small':
                    topping_price = topping.price_small
                elif size == 'medium':
                    topping_price = topping.price_medium
                else:  # large
                    topping_price = topping.price_large
                
                OrderItemTopping.objects.create(
                    order_item=order_item,
                    topping=topping,
                    price=topping_price
                )
                
                subtotal += topping_price * quantity
            
            # Add base price to subtotal
            subtotal += item_price * quantity
        
        # Update order totals
        tax = subtotal * tax_rate
        total = subtotal + tax + delivery_fee
        
        order.subtotal = subtotal
        order.tax = tax
        order.total_amount = total
        order.save()
        
        return order