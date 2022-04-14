from django.contrib import admin

# Register your models here.
from .models import UserProfile


class UserProfileAdmin(admin.ModelAdmin):
    # list_display = ['id', 'url', 'file_size', 'FK_Comment_id']

    search_fields = ['id']

    # list_per_page设置每页显示多少条记录，默认是100条
    list_per_page = 50

    # ordering设置默认排序字段，负号表示降序排序
    ordering = ['id']

# Register your models here.
admin.site.register(UserProfile, UserProfileAdmin)