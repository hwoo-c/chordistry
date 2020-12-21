from django.urls import path

from . import views

app_name = 'piano'
urlpatterns = [
    path('', views.index, name='index'),
]
