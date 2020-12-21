import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.urls import reverse

# Create your views here.

def index(request):
    return render(request, 'piano/index.html')
