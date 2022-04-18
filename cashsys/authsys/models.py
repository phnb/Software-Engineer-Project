from django.db import models
from django.contrib.auth.models import User

# user profile
# if modifying this: modify register, 
class UserProfile(models.Model):
    user   = models.OneToOneField('auth.User',on_delete=models.CASCADE, related_name='user_profile')
    username = models.CharField(max_length=100, blank=True, unique=True)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    email = models.EmailField(max_length=100, blank=True, unique=True)
    avatar = models.ImageField(default="default_img.png", null=False, blank=False)
    avatar_back_up = models.CharField(max_length=100, blank=True)
    is_reset_active = models.BooleanField(default=False)
    created_time = models.DateTimeField(auto_now_add=True)
    modified_time = models.DateTimeField(auto_now=True)
# add field->change form->change modification interfaces in views












