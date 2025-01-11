from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    name = models.CharField(max_length=100)
    #date = models.DateField(auto_now_add=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    category = models.ForeignKey(Category, related_name="products", on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    items = models.IntegerField()
    mrp = models.FloatField()
    discount = models.FloatField()
    

    def __str__(self):
        return self.name
