from rest_framework import serializers
from .models import Order, OrderItem, OrderItemTopping
from menu.models import Pizza, Topping
from menu.serializers import PizzaSerializer, ToppingSerializer
from django.utils import timezone
from datetime import timedelta

class OrderItemToppingSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItemTopping
        fields = ('id', 'topping', 'topping_name', 'price')

class OrderItemSerializer(serializers.ModelSerializer):
    toppings = OrderItemToppingSerializer(many=True, read_only=True, source='orderitemtopping_set')
    
    class Meta:
        model = OrderItem
        fields = ('id', 'pizza', 'pizza_name', 'pizza_price', 'size', 
                  'quantity', 'special_instructions', 'toppings', 'total_price')

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    
    class Meta:
        model = Order
        fields = ('id', 'user', 'customer_name', 'customer_email', 'customer_phone',
                 'delivery_address', 'delivery_instructions', 'order_notes',
                 'status', 'payment_method', 'total_amount', 'created_at',
                 'estimated_delivery_time', 'delivered_at', 'items')
        read_only_fields = ('user', 'total_amount', 'created_at',
                           'estimated_delivery_time', 'delivered_at')

class OrderItemCreateSerializer(serializers.Serializer):
    pizza = serializers.PrimaryKeyRelatedField(queryset=Pizza.objects.all())
    size = serializers.ChoiceField(choices=OrderItem.SIZE_CHOICES)
    quantity = serializers.IntegerField(min_value=1)
    special_instructions = serializers.CharField(required=False, allow_blank=True)
    toppings = serializers.PrimaryKeyRelatedField(queryset=Topping.objects.all(), many=True, required=False)

class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemCreateSerializer(many=True)
    
    class Meta:
        model = Order
        fields = ('customer_name', 'customer_email', 'customer_phone',
                 'delivery_address', 'delivery_instructions', 'order_notes',
                 'payment_method', 'items')
    
    def create(self, validated_data):
        items_data = validated_data.pop('items')
        # Set estimated delivery time to 45 minutes from now
        estimated_delivery = timezone.now() + timedelta(minutes=45)
        
        # Calculate total amount and create order
        total_amount = 0
        order = Order.objects.create(
            **validated_data,
            status='received',
            total_amount=total_amount,  # Temporary, will update
            estimated_delivery_time=estimated_delivery,
            user=self.context['request'].user if self.context['request'].user.is_authenticated else None
        )
        
        # Process each order item
        for item_data in items_data:
            pizza = item_data['pizza']
            size = item_data['size']
            quantity = item_data['quantity']
            special_instructions = item_data.get('special_instructions', '')
            toppings = item_data.get('toppings', [])
            
            # Get the price based on size
            if size == 'small':
                pizza_price = pizza.price_small
            elif size == 'medium':
                pizza_price = pizza.price_medium
            else:  # large
                pizza_price = pizza.price_large
            
            # Calculate item total price (before toppings)
            item_total = pizza_price * quantity
            
            # Create the order item
            order_item = OrderItem.objects.create(
                order=order,
                pizza=pizza,
                pizza_name=pizza.name,
                pizza_price=pizza_price,
                size=size,
                quantity=quantity,
                special_instructions=special_instructions,
                total_price=item_total  # Will update after adding toppings
            )
            
            # Add toppings if any
            topping_total = 0
            for topping in toppings:
                # Get topping price based on size
                if size == 'small':
                    topping_price = topping.price_small
                elif size == 'medium':
                    topping_price = topping.price_medium
                else:  # large
                    topping_price = topping.price_large
                
                # Create order item topping
                OrderItemTopping.objects.create(
                    order_item=order_item,
                    topping=topping,
                    topping_name=topping.name,
                    price=topping_price
                )
                
                topping_total += topping_price * quantity
            
            # Update order item total price with toppings
            order_item.total_price = item_total + topping_total
            order_item.save()
            
            # Add to order total
            total_amount += order_item.total_price
        
        # Update order total amount
        order.total_amount = total_amount
        order.save()
        
        return order

class OrderTrackingSerializer(serializers.Serializer):
    orderId = serializers.IntegerField()
    email = serializers.EmailField()