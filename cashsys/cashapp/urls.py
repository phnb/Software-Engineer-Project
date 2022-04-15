from cashapp.views import views
from django.contrib import admin
from django.urls import path, include



urlpatterns = [
    # page requests
    # path('', ),
    path('record/', views.RecordModify.as_view()),
    path('account/', views.AccountModify.as_view()),
    path('plan/', views.PlanModify.as_view()),
]
