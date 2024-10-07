from django.urls import path
from . import views
urlpatterns = [
    path('', views.index, name='home'),
    path('artak', views.about, name='artak')
]
