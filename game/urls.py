from django.urls import path
from . import views


urlpatterns = [
    path('', views.game, name='game'),
    path('update_balance/', views.update_balance, name='update_balance'),

]
