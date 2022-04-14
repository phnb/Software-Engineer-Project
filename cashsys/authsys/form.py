from django.forms import ModelForm
# from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django import forms
from authsys.models import *

class UserProfileForm(ModelForm):
    class Meta:
        model = UserProfile
        fields = '__all__'
        exclude = ["user", "is_reset_active", "created_time", "modified_time"]

class UserForm(ModelForm):
    class Meta:
        model = User
        fields = ["username", "first_name", "last_name", "email"]
