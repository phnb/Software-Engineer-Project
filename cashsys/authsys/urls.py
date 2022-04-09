from django.contrib import admin
from django.urls import path, include
from authsys.views.views import *

urlpatterns = [
    # page requests
    path('', signin),
    # path('getregister/', get_register),
    # path('signinpage/', signinpage),

    # data requests
    path('register/', register),
    path('signin/', signin),
    path('signout/', signout),
    path('activate/<uid64d>/<token>/', activate, name="activation"),
]
