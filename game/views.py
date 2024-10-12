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
    return render(request, 'game/quests_html/quest.html', {'completed_quests': completed_quests,
                                                           'incomplete_quests': incomplete_quests,
                                                           'top_quests': top_quests, 'user': user, 'initial_balance': user.balance})


def quest_info(request):
    quest_id = request.GET.get('quest_id')

    # Получаем информацию о квесте из таблицы UserQuest
    user_quest = UserQuest.objects.get(id=quest_id)  # Получаем UserQuest по ID
    quest = user_quest.quest  # Получаем сам объект квеста

    title = quest.title
    description = quest.description
    sub_description = quest.sub_description
    image = quest.info_image
    print(image)
    price = quest.cost
    completed = user_quest.completed

    # Получаем аватарку пользователя
    user_avatar = user_quest.user.avatarka.url

    # Проверка наличия изображения
    image_send = image.url if image else ''

    return render(request, 'game/quests_html/quest_info.html', {
        'title': title,
        'description': description,
        'sub_description': sub_description,
        'image': image_send,
        'price': price,
        'completed': completed,
        'user_avatar': user_avatar
    })



def filter_tasks(request):
    category_name = request.GET.get('category')
    user = Users.objects.get(id=1)  # Предполагается, что вы знаете ID текущего пользователя

    if category_name:
        tasks = user.tasks.filter(category__category_name=category_name)
        # Получаем логотип категории напрямую из TaskCategories
        category_logo = TaskCategory.objects.filter(category_name=category_name).first().logo
    else:
        tasks = user.tasks.all()
        category_logo = None  # Логотип выводим только при выбранной категории

    return render(request, 'game/tasks_html/tasks_list_partial.html', {
        'tasks': tasks,
        'task_category': category_name,
        'category_logo': category_logo
    })


def tasks(request):
    user = Users.objects.get(id=1)  # Пример получения пользователя, здесь лучше использовать request.user
    task_categories = TaskCategory.objects.all()  # Получение всех категорий задач

    return render(request, 'game/tasks_html/tasks.html', {
        'user': user,
        'task_categories': task_categories
    })


def create_task(request):
    if request.method == 'POST':
        form = TaskForm(request.POST)
        if form.is_valid():
            task = form.save(commit=False)
            # Получаем task_category из POST данных
            task_category = request.POST.get('task_category')
            if task_category:
                # Устанавливаем категорию задачи
                category = TaskCategory.objects.get(category_name=task_category)
                task.category = category
            task.save()
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'errors': form.errors})
    else:
        task_category = request.GET.get('task_category', None)
        form = TaskForm()
        return render(request, 'game/tasks_html/create_task.html', {'form': form, 'task_category': task_category})


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
