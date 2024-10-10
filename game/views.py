from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import *
from .forms import TaskForm


def game(request):
    user = Users.objects.get(id=1)
    # Передаем начальный баланс пользователя и квесты в шаблон
    return render(request, 'game/layout.html', {

        'button_indices': range(5)})


def index(request):
    user = Users.objects.get(id=1)  # Предполагается, что вы знаете ID текущего пользователя
    return render(request, 'game/index.html', {'user': user, 'initial_balance': user.balance
                                               })


def quest(request):
    user = Users.objects.get(id=1)  # Предполагается, что вы знаете ID текущего пользователя

    # Получаем текущего авторизованного пользователя
    user_quests = UserQuest.objects.filter(user=user)  # Получаем все UserQuests для пользователя
    completed_quests = user_quests.filter(completed=True)
    incomplete_quests = user_quests.filter(completed=False)
    top_quests = user_quests.filter(quest__top=True, completed=False)  # Только топ квесты, которые еще не выполнены
    return render(request, 'game/quest.html', {'completed_quests': completed_quests,
                                               'incomplete_quests': incomplete_quests,
                                               'top_quests': top_quests, })


def filter_tasks(request):
    category_name = request.GET.get('category')
    user = Users.objects.get(id=1)  # Предполагается, что вы знаете ID текущего пользователя

    if category_name:
        tasks = user.tasks.filter(category__category_name=category_name)
    else:
        tasks = user.tasks.all()
    return render(request, 'game/tasks_list_partial.html', {'tasks': tasks, 'task_category': category_name})

def tasks(request):
    user = Users.objects.get(id=1)  # Пример получения пользователя, здесь лучше использовать request.user
    task_categories = TaskCategory.objects.all()  # Получение всех категорий задач

    return render(request, 'game/tasks.html', {
        'user': user,
        'task_categories': task_categories
    })



def create_task(request):
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            form.save()
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'error': 'Неверное заполнение'})

    form = TaskForm()
    return render(request, 'game/create_task.html', {'form': form})


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
