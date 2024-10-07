from django.shortcuts import render
from django.http import HttpResponse


# Create your views here.
def index(request):
    data = {'title': 'Главная'}
    return render(request, 'main/index.html', data)


def about(request):
    data = {'title': 'О нас'}
    return render(request, 'main/artak.html', data)




