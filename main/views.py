from django.shortcuts import render , redirect
from django.http import HttpResponse, JsonResponse
from game.models import *

# Create your views here.
def index(request):
    print(request)
    usern = request.GET.get('username')
    usertn = request.GET.get('usertelegramname')

    data = {'title': 'Главная', 'username': usern, 'usertelegramname': usertn}
    return render(request, 'main/index.html', data)


def check_user(request):
    username = request.GET.get('userId')
    user_telegram_name = request.GET.get('username')

    user, created = Users.objects.get_or_create(name=username)
    if not created:
        request.session['username'] = username
        request.session['usertelegramname'] = user_telegram_name

        # Вместо редиректа возвращаем JSON с флагом успеха и URL
        return JsonResponse({'success': True, 'redirect_url': f'/game/?username={username}&usertelegramname={user_telegram_name}'})
    else:
        user.telegram_name = user_telegram_name
        user.save()
        return JsonResponse({'success': False, 'message': 'Пользователь не найден'}, status=404)

def about(request):
    data = {'title': 'О нас'}
    return render(request, 'main/artak.html', data)




