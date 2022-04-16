from django.contrib import admin
from django.urls import path, include
from authsys.views.views import *

urlpatterns = [
    # page requests
    path('', signin),
    path('profile/', profile),
    # path('getregister/', get_register),
    # path('signinpage/', signinpage),

    # data requests
    path('resetSend/', reset_send_mail),
    path('resetPw/', reset_pw),
    path('register/', register),
    path('signin/', signin),
    path('signout/', signout),
    path('activate/<uid64d>/<token>/', register_activate, name="activation"), # /auth/activate
    path('resetActivate/<uid64d>/<token>/', reset_activate, name="reset_act"),
]
