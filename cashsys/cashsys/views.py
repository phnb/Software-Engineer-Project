from django.shortcuts import render
from django.http import HttpResponse
from django.http.response import JsonResponse

def home(request):
    return render(request, "auth/sgin.html")


