from operator import mod
from statistics import mode
from django.db import models
from authsys.models import *
from datetime import datetime

# Account 
# It can be considered as a very long plan, with the initialized balance as budget 
class Account(models.Model):
    name = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    balance = models.FloatField(default=0)
    created_time = models.DateTimeField(auto_now_add=True)
    modified_time = models.DateTimeField(auto_now=True)
    userProfile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="accounts")
    is_default = models.BooleanField(default=False)

# Plan
# create plan under a given account on a given user
class Plan(models.Model):
    name = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    start_time = models.DateTimeField(default=datetime.utcnow())
    end_time = models.DateTimeField(default=datetime.utcnow())
    created_time = models.DateTimeField(auto_now_add=True)
    modified_time = models.DateTimeField(auto_now=True)
    budget = models.FloatField(default=0)
    remaining = models.FloatField(default=0) # every update of record changes remaining
    failed = models.BooleanField(default=False) # every update of record changes failed
    is_default = models.BooleanField(default=False)
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="plans") 
    userProfile = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="plans")

# Record
class Record(models.Model):
    amount = models.FloatField(default=0)
    name = models.CharField(max_length=200, blank=True)
    description = models.TextField(blank=True)
    is_income = models.BooleanField(default=True)
    start_time = models.DateTimeField(null=True, blank=True, default=datetime.utcnow())
    created_time = models.DateTimeField(auto_now_add=True)
    modified_time = models.DateTimeField(auto_now=True)
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    plans = models.ManyToManyField(Plan, related_name="records")

