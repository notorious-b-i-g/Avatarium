from django.urls import path
from . import views
urlpatterns = [
    path('', views.index, name='home'),
    path('artak', views.about, name='artak'),
    path('check_user_exist/', views.check_user, name='check_user')
]
