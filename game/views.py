from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Count, Q
from .models import *
from .forms import *


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
                                                           'top_quests': top_quests, 'user': user,
                                                           'initial_balance': user.balance})


def progress(request):
    user = Users.objects.get(id=1)  # Используйте request.user, если настроена аутентификация
    return render(request, 'game/progress_html/progress.html', {'user': user})

def progress_near_games(request):
    user = Users.objects.get(id=1)
    task_categories = TaskCategory.objects.annotate(
        total_tasks=Count(
            'task',
            filter=Q(task__usertask__user=user, task__far=False)
        ),
        completed_tasks=Count(
            'task',
            filter=Q(task__usertask__user=user, task__far=False, task__usertask__completed=True)
        )
    )

    return render(request, 'game/progress_html/progress_categories_partial.html', {'task_categories': task_categories})

def progress_future_games(request):
    user = Users.objects.get(id=1)
    task_categories = TaskCategory.objects.annotate(
        total_tasks=Count(
            'task',
            filter=Q(task__usertask__user=user, task__far=True)
        ),
        completed_tasks=Count(
            'task',
            filter=Q(task__usertask__user=user, task__far=True, task__usertask__completed=True)
        )
    )

    return render(request, 'game/progress_html/progress_categories_partial.html', {'task_categories': task_categories})

def progress_top_games(request):
    user = Users.objects.get(id=1)
    user_tasks = UserTask.objects.filter(user=user, task__top=True)
    tasks = [user_task.task for user_task in user_tasks]

    return render(request, 'game/progress_html/progress_top_games_partial.html', {'tasks': tasks})

def progress_tasks(request):
    category_name = request.GET.get('category')
    far_value = request.GET.get('far')  # 'true' или 'false'
    user = Users.objects.get(id=1)
    far = True if far_value == 'true' else False

    if category_name:
        user_tasks = UserTask.objects.filter(
            user=user,
            task__category__category_name=category_name,
            task__far=far
        )
    else:
        user_tasks = UserTask.objects.filter(
            user=user,
            task__far=far
        )

    tasks = [user_task.task for user_task in user_tasks]

    # Получаем логотип категории
    category_logo = None
    if category_name:
        category = TaskCategory.objects.filter(category_name=category_name).first()
        if category:
            category_logo = category.logo

    return render(request, 'game/progress_html/progress_list_partial.html', {
        'tasks': tasks,
        'task_category': category_name,
        'category_logo': category_logo
    })

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
    user = Users.objects.get(id=1)

    # Получаем задачи пользователя, связанные через UserTask, фильтруем по категории и сортируем по полю top
    user_tasks = UserTask.objects.filter(user=user, task__category__category_name=category_name).order_by('-task__top')
    tasks = [user_task.task for user_task in user_tasks]  # Извлекаем объекты Task из UserTask

    # Получаем выполненные задачи
    completed_tasks = UserTask.objects.filter(user=user, completed=True)

    # Получаем логотип категории
    category = TaskCategory.objects.filter(category_name=category_name).first()
    category_logo = category.logo if category else None
    russian_title = category.title

    return render(request, 'game/tasks_html/tasks_list_partial.html', {
        'tasks': tasks,
        'task_category': category_name,
        'category_logo': category_logo,
        'complete_tasks': completed_tasks,
        'russian_title': russian_title
    })



def tasks(request):
    user = Users.objects.get(id=1)  # Пример получения пользователя, здесь лучше использовать request.user
    task_categories = TaskCategory.objects.all()  # Получение всех категорий задач

    return render(request, 'game/tasks_html/tasks.html', {
        'user': user,
        'task_categories': task_categories
    })


def create_task(request):
    task_category = request.GET.get('task_category', None)
    form_near = TaskFormNear()
    form_far = TaskFormFar()
    user_avatar = Users.objects.get(id=1).avatarka.url

    return render(request, 'game/tasks_html/create_task.html',
                  {'form_near': form_near, 'form_far': form_far, 'task_category': task_category,
                   'user_avatar': user_avatar})


def create_task_post(request):
    if request.method == 'POST':
        form = TaskFormNear(request.POST, request.FILES)
        if form.is_valid():
            task = form.save(commit=False)
            task_category = request.POST.get('task_category')
            task_type = request.POST.get('task_type')
            task_cost = request.POST.get('cost')

            if task_category:
                try:
                    category = TaskCategory.objects.get(category_name=task_category)
                    task.category = category
                except TaskCategory.DoesNotExist:
                    return JsonResponse({'success': False, 'errors': 'Invalid category'})

            task.far = task_type
            task.cost = task_cost
            task.save()

            images = request.FILES.getlist('images')
            for img in images:
                TaskImage.objects.create(task=task, image=img)

            try:
                user = Users.objects.get(id=1)
            except Users.DoesNotExist:
                return JsonResponse({'success': False, 'errors': 'User not found'})

            UserTask.objects.create(user=user, task=task)

            return JsonResponse({'success': True})
        else:
            return JsonResponse({'success': False, 'errors': form.errors})
    return JsonResponse({'success': False, 'errors': 'Invalid request method'})



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
