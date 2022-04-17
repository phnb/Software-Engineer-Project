from cashapp.views import views
from django.contrib import admin
from django.urls import path, include



urlpatterns = [
    # page requests
    # path('', ),
    path('record/', views.RecordModify.as_view(), name="recordViews"),
    path('account/', views.AccountModify.as_view(), name="accountViews"),
    path('plan/', views.PlanModify.as_view(), name="planViews"),
]
