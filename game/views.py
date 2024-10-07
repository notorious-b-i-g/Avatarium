from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import *


def game(request):
    # Получаем текущего авторизованного пользователя
    user = Users.objects.get(id=1)  # Предполагается, что вы знаете ID текущего пользователя
    user_quests = UserQuest.objects.filter(user=user)  # Получаем все UserQuests для пользователя
    completed_quests = user_quests.filter(completed=True)
    incomplete_quests = user_quests.filter(completed=False)
    top_quests = user_quests.filter(quest__top=True, completed=False)  # Только топ квесты, которые еще не выполнены

    # Передаем начальный баланс пользователя и квесты в шаблон
    return render(request, 'game/index.html', {
        'user': user,
        'completed_quests': completed_quests,
        'incomplete_quests': incomplete_quests,
        'top_quests': top_quests,
        'button_indices': range(5),
        'initial_balance': user.balance
    })



def update_balance(request):
    if request.method == 'POST':
        user_id = request.POST.get('user_id')
        new_balance = request.POST.get('new_balance')

        try:
            user = Users.objects.get(id=user_id)
            user.balance = new_balance
            user.save()
            return JsonResponse({'status': 'success'})
        except Users.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'User not found'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request'})