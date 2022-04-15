from django.contrib import admin
from .models import *

class AccountAdmin(admin.ModelAdmin):
    search_fields = ['id']

    list_per_page = 50

    ordering = ['id']

class RecordAdmin(admin.ModelAdmin):
    search_fields = ['id']

    list_per_page = 50

    ordering = ['id']

class PlanAdmin(admin.ModelAdmin):
    search_fields = ['id']

    list_per_page = 50

    ordering = ['id']

# Register your models here.
admin.site.register(Account, AccountAdmin)
admin.site.register(Record, RecordAdmin)
admin.site.register(Plan, PlanAdmin)