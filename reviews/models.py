from django.db import models
from accounts.models import User
from menu.models import Pizza

class Review(models.Model):
    pizza = models.ForeignKey(Pizza, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    rating = models.PositiveSmallIntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('pizza', 'user')
        
    def __str__(self):
        return f"{self.user.username} rated {self.pizza.name} {self.rating}/5"