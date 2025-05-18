from django.shortcuts import render, redirect, get_object_or_404
from django.http import JsonResponse
from .models import *
from .forms import *
from urllib.parse import unquote
import json
from django.utils import timezone
from datetime import timedelta, date, datetime
from django.core.files.images import get_image_dimensions
import re
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST


def log(request):
    data = request.POST
    print(data, flush=True)
    return JsonResponse({'result': data})


def game(request):
    username = request.GET.get('username')
    request.session['username'] = username

    print(username)
    user = Users.objects.filter(name=username).first()
    user_nickname = (user.nickname.split(' ')[0][:11] if user.nickname else None)
    user_telegram_name = (user.telegram_name[:11] if user.telegram_name else user.name)

    # Передаем начальный баланс пользователя и квесты в шаблон
    return render(request, 'game/layout.html', {
        'button_indices': range(5),
        'user': user,
        'user_nickname': user_nickname,
        'user_telegram_name': user_telegram_name
    })


@csrf_exempt
def update_task_name(request):
    print("update_task_name called", flush=True)
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        task_id = data.get('task_id')
        title = data.get('title', '')
        username = request.session.get('username')
        user = Users.objects.filter(name=username).first()
        if not user:
            return JsonResponse({'success': False, 'message': 'User not found'})

        user_task = UserChallengeDailyTask.objects.filter(user=user, id=task_id).first()
        if user_task and title != '':
            user_task.title = title if title else f'задача {user_task.task_number}'
            user_task.save()
            return JsonResponse({'success': True})
        return JsonResponse({'success': False, 'message': 'Task not found'})
    return JsonResponse({'success': False, 'message': 'Invalid request method'})


def toggle_task_status(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        completed = data.get('completed', False)
        username = request.session.get('username')
        user = Users.objects.filter(name=username).first()
        if not user:
            return JsonResponse({'success': False, 'message': 'User not found'})
        challenge_week = UserWeeklyChallenge.objects.get(user=user, week_start_date=user.week_start_date)

        if data['dayly_task_update']:
            task_id = data.get('task_id')
            user_task = UserChallengeDailyTask.objects.filter(user=user, id=task_id).first()
            if user_task:
                user_task.completed = bool(completed)
                user_task.save()
            else:
                return JsonResponse({'success': False, 'message': 'Task not found'})
            set_status = user_task.completed
        else:
            challenge_week.completed = bool(completed)
            challenge_week.save()
            set_status = completed

        completed_tasks_count = UserChallengeDailyTask.objects.filter(user=user, completed=True).count()

        if challenge_week.completed:
            completed_tasks_count += 1

        today = date.today()
        current_day = today.isoweekday()

        days_map = {
            1: "monday_count",
            2: "tuesday_count",
            3: "wednesday_count",
            4: "thursday_count",
            5: "friday_count",
            6: "saturday_count",
            7: "sunday_count",
        }

        day_field = days_map[current_day]
        current_value = getattr(challenge_week, day_field, 0)  # Получаем текущее значение
        if completed:
            setattr(challenge_week, day_field, current_value + 1)  # Увеличиваем его на 1
        else:
            setattr(challenge_week, day_field, current_value - 1)

        # После изменения не забудьте сохранить объект
        challenge_week.save()

        week_data = []
        today = date.today()
        current_weekday_number = today.isoweekday()

        for i in range(1, 8):
            if i == current_weekday_number:
                week_data.append({'day_number': i, 'completed_count': completed_tasks_count})
            else:
                week_data.append({'day_number': i, 'completed_count': 0})

        return JsonResponse({'success': True, 'completed': set_status, 'week_data': week_data})
    return JsonResponse({'success': False, 'message': 'Invalid request method'})


def toggle_week_challenge_status(request):
    username = request.session.get('username')
    user = Users.objects.filter(name=username).first()
    data = json.loads(request.body.decode('utf-8'))
    completed = data.get('completed', False)

    today = date.today()
    current_day = today.isoweekday()

    days_map = {
        1: "monday_count",
        2: "tuesday_count",
        3: "wednesday_count",
        4: "thursday_count",
        5: "friday_count",
        6: "saturday_count",
        7: "sunday_count",
    }
    challenge_week = UserWeeklyChallenge.objects.get(user=user, week_start_date=user.week_start_date)
    completed_tasks_count = UserChallengeDailyTask.objects.filter(user=user, completed=True).count()

    day_field = days_map[current_day]
    current_value = getattr(challenge_week, day_field, 0)  # Получаем текущее значение
    if completed:
        setattr(challenge_week, day_field, current_value + 1)  # Увеличиваем его на 1
    else:
        setattr(challenge_week, day_field, current_value - 1)

    # После изменения не забудьте сохранить объект
    challenge_week.save()

    week_data = []
    today = date.today()
    current_weekday_number = today.isoweekday()

    for i in range(1, 8):
        if i == current_weekday_number:
            week_data.append({'day_number': i, 'completed_count': completed_tasks_count})
        else:
            week_data.append({'day_number': i, 'completed_count': 0})


def update_weekly_challenge(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        challenge_text = data.get('challenge_text', '')
        username = request.session.get('username')
        user = Users.objects.filter(name=username).first()
        if not user:
            return JsonResponse({'success': False, 'message': 'User not found'})

        weekly_challenge, created = UserWeeklyChallenge.objects.get_or_create(user=user,
                                                                              week_start_date=user.week_start_date)
        weekly_challenge.challenge_text = challenge_text if challenge_text else ''
        weekly_challenge.save()
        return JsonResponse({'success': True})
    return JsonResponse({'success': False, 'message': 'Invalid request method'})


def index(request):
    username = request.session.get('username')
    print(username)
    user = Users.objects.filter(name=username).first()
    slider = Promo.objects.filter(show_place='main')
    user_quests_top_noncompleted = UserQuest.objects.filter(user=user, quest__top=True, completed=False).select_related(
        'quest')

    top_uncompleted_quest = user_quests_top_noncompleted[0] if user_quests_top_noncompleted else None

    # user_tasks_top_noncompleted = UserTask.objects.filter(user=user, task__top=True, completed=False).select_related(
    #     'task')
    # top_uncompleted_task = user_tasks_top_noncompleted[0] if user_tasks_top_noncompleted else None

    top_uncompleted_task = None
    user_tasks_not_completed = []
    total_user_tasks = []
    tasks = UserTask.objects.filter(user=user)


    # Проверяем, если неделя закончилась или еще не началась
    today = date.today()
    monday_of_current_week = today - timedelta(days=today.weekday())

    if user.week_start_date is None or today > user.week_start_date + timedelta(days=6):
        # Начинаем новую неделю
        user.week_start_date = monday_of_current_week
        user.streak = 0  # Сбрасываем стрик для новой недели
        user.save()
        # При необходимости можно удалить старые визиты
        UserVisit.objects.filter(user=user, visit_time__lt=user.week_start_date).delete()
        for task in tasks:
            if task.completed:
                task.active = False
                task.save()

    UserWeeklyChallenge.objects.get_or_create(user=user, week_start_date=user.week_start_date)

    # Проверяем, был ли уже визит сегодня
    visit, created = UserVisit.objects.get_or_create(user=user, visit_time=today)
    if created:
        user.streak += 1
        user.last_visit = today
        user.save()

        # Добавляем индекс текущего дня недели в поле day_index
        visit.day_index = today.weekday()  # 0 - понедельник, 6 - воскресенье
        visit.save()
    for task in tasks:
        if task.active:
            if not task.task.far:
                if not task.completed:
                    if task.task.top:
                        top_uncompleted_task = task
                    user_tasks_not_completed.append(task)
                total_user_tasks.append(task)

    calendar_progress_percent = (
        round((1 - len(user_tasks_not_completed) / len(total_user_tasks)) * 100) if len(total_user_tasks) != 0 else 0
    )
    context = {
        'user': user,
        'initial_balance': user.balance,
        'top_uncompleted_quest': top_uncompleted_quest,
        'top_uncompleted_task': top_uncompleted_task,
        'slider': slider,
        'calendar_progress_percent': calendar_progress_percent
    }
    return render(request, 'game/index.html', context)


import phonenumbers
from phonenumbers import PhoneNumberFormat


def profile(request):
    username = request.session.get('username')
    user = Users.objects.filter(name=username).first()

    if not user:
        return render(request, 'game/profile.html', {'error': 'Пользователь не найден'})

    if user.phone is None or user.date_of_birth is None or user.email is None:
        activate = False
    else:
        activate = True

    if user.phone:
        try:
            parsed_phone = phonenumbers.parse(user.phone, "RU")
            national_number = phonenumbers.format_number(parsed_phone, PhoneNumberFormat.NATIONAL)
            user.phone = f"+7 {national_number[2:]}"
        except phonenumbers.NumberParseException:
            user.phone = ""
    else:
        user.phone = ""

    questions = Questions.objects.all()

    return render(request, 'game/profile.html', {
        'user': user,
        'activate': activate,
        'questions': questions
    })


def update_profile(request):
    if request.method == 'POST':
        username = request.session.get('username')
        user = Users.objects.filter(name=username).first()

        if user:
            user.nickname = request.POST.get('name')
            user.phone = request.POST.get('phone')
            user.email = request.POST.get('email')
            user.gender = request.POST.get('gender')
            user.date_of_birth = request.POST.get('date_of_birth')
            user.save()
            return JsonResponse({'success': True})

        return JsonResponse({'success': False, 'message': 'Пользователь не найден'}, status=404)

    return JsonResponse({'success': False, 'message': 'Некорректный запрос'}, status=400)


def extract_video_id(url):
    match = re.search(r"(?:v=|\/)([0-9A-Za-z_-]{11})", url)
    if match:
        return match.group(1)
    else:
        return None


def library(request):
    username = request.session.get('username')
    user = Users.objects.filter(name=username).first()
    # videos_urls_w = VideoUrls.objects.all()
    videos_urls = []
    slider = Promo.objects.filter(show_place='library')


    # for url in videos_urls_w:
    #     videos_urls.append(extract_video_id(url.video_url))
    other_urls = OtherUrls.objects.all()
    if len(other_urls) - 1 >= 0:
        other_urls = other_urls[len(other_urls) - 1]
    else:
        other_urls = []
    return render(request, 'game/library/library.html', context={
        'user': user,
        'other_urls': other_urls,
        'slider': slider
    })


def quest(request):
    username = request.session.get('username')
    user = Users.objects.filter(name=username).first()
    top_uncompleted_task = None
    user_tasks_not_completed = []
    total_user_tasks = []
    tasks = UserTask.objects.filter(user=user)
    for task in tasks:
        if task.active:
            if not task.task.far:
                if not task.completed:
                    if task.task.top:
                        pass
                    user_tasks_not_completed.append(task)
                total_user_tasks.append(task)

    calendar_progress_percent = (
        round((1 - len(user_tasks_not_completed) / len(total_user_tasks)) * 100) if len(total_user_tasks) != 0 else 0
    )
    # Получаем текущего авторизованного пользователя
    user_quests = UserQuest.objects.filter(user=user)  # Получаем все UserQuests для пользователя
    completed_quests = user_quests.filter(completed=True)
    incomplete_quests = user_quests.filter(completed=False)
    top_quests = user_quests.filter(quest__top=True, completed=False)  # Только топ квесты, которые еще не выполнены
    return render(request, 'game/quests_html/quest.html', {
        'completed_quests': completed_quests,
        'incomplete_quests': incomplete_quests,
        'top_quests': top_quests,
        'user': user,
        'initial_balance': user.balance,
        'calendar_progress_percent': calendar_progress_percent
    })


def complete_quest(request):
    quest_id = request.POST.get('quest_id')

    try:
        user_quest = UserQuest.objects.get(id=quest_id)

        if user_quest.completed:
            return JsonResponse({'status': 'error', 'message': 'Квест уже завершён.'})

        # Обновляем статус квеста
        user_quest.completed = True
        user_quest.save()

        return JsonResponse({'status': 'success', 'message': 'Квест успешно завершён.'})
    except UserQuest.DoesNotExist:
        return JsonResponse({'status': 'error', 'message': 'Квест не найден.'})


def quest_info(request):
    quest_id = request.GET.get('quest_id')

    # Получаем информацию о квесте из таблицы UserQuest
    user_quest = UserQuest.objects.get(id=quest_id)  # Получаем UserQuest по ID
    quest = user_quest.quest  # Получаем сам объект квеста
    title = quest.title
    description = quest.description
    sub_description = quest.sub_description
    image = quest.info_image
    price = quest.cost
    completed = user_quest.completed

    # Получаем аватарку пользователя
    user = user_quest.user

    # Проверка наличия изображения
    image_send = image.url if image else ''

    return render(request, 'game/quests_html/quest_info.html', {
        'title': title,
        'description': description,
        'sub_description': sub_description,
        'image': image_send,
        'price': price,
        'completed': completed,
        'user': user,
        'quest_id': quest_id
    })


def progress(request):
    username = request.session.get('username')
    user = Users.objects.filter(name=username).first()

    user_visits = UserVisit.objects.filter(user=user)
    days_range = [i for i in range(1, 8)]
    completed_days = [visit.day_index for visit in user_visits]
    completed_days.sort()
    completed_days.append(99)
    completed_days.insert(0, 99)

    for i, num in enumerate(completed_days):
        completed_days[i] += 1

    j = 1
    for i in range(len(days_range)):
        if completed_days[j] == i:
            days_range[i - 1] = j
            j += 1

    if completed_days[j] == len(days_range):
        days_range[len(days_range) - 1] = j

    # Создаем словарь для сопоставления индексов с порядковыми номерами
    day_counter = 1
    completed_days_with_counter = {}
    for day in sorted(completed_days):
        completed_days_with_counter[day] = day_counter
        day_counter += 1

    # Fetch all task categories
    task_categories = list(TaskCategory.objects.all())

    # Calculate calendar progress
    top_uncompleted_task = None
    user_tasks_not_completed = []
    total_user_tasks = []

    tasks = UserTask.objects.filter(user=user, active=True)  # Учитываем только активные задачи

    for task in tasks:
        if task.active:
            if not task.task.far:
                if not task.completed:
                    if task.task.top:
                        pass
                    user_tasks_not_completed.append(task)
                total_user_tasks.append(task)

    calendar_progress_percent = (
        round((1 - len(user_tasks_not_completed) / len(total_user_tasks)) * 100) if len(total_user_tasks) != 0 else 0
    )

    decorative_container_count = range(1, 8 - user.streak)

    # Fetch all UserTasks for the user, along with related Task and Category
    user_tasks = UserTask.objects.filter(user=user, active=True).select_related('task', 'task__category')

    # Get top tasks and separate them into completed and non-completed
    user_tasks_top = [ut for ut in user_tasks if ut.task.top]
    user_tasks_top_completed = [ut for ut in user_tasks_top if ut.completed]
    user_tasks_top_noncompleted = [ut for ut in user_tasks_top if not ut.completed]

    tasks_decoration_count = max(0, 6 - len(user_tasks_top))
    tasks_decoration_range = range(tasks_decoration_count)

    # Initialize dictionaries to hold counts per category
    category_data_near = {category.id: {'category': category, 'total_tasks': 0, 'completed_tasks': 0} for category in
                          task_categories}
    category_data_future = {category.id: {'category': category, 'total_tasks': 0, 'completed_tasks': 0} for category in
                            task_categories}

    # Process user_tasks to populate counts
    for ut in user_tasks:
        category_id = ut.task.category.id
        if ut.task.far:
            data = category_data_future[category_id]
        else:
            data = category_data_near[category_id]
        data['total_tasks'] += 1
        if ut.completed:
            data['completed_tasks'] += 1

    # Prepare the data structures for the template
    task_categories_near = []
    task_categories_future = []
    for category in task_categories:
        # Near tasks
        data_near = category_data_near[category.id]
        total_tasks_near = data_near['total_tasks']
        completed_tasks_near = data_near['completed_tasks']
        progress_percent_near = str((completed_tasks_near / total_tasks_near) * 100) if total_tasks_near > 0 else '0'
        task_categories_near.append({
            'category': category,
            'total_tasks': total_tasks_near,
            'completed_tasks': completed_tasks_near,
            'progress_percent': progress_percent_near
        })
        # Future tasks
        data_future = category_data_future[category.id]
        total_tasks_future = data_future['total_tasks']
        completed_tasks_future = data_future['completed_tasks']
        progress_percent_future = str(
            (completed_tasks_future / total_tasks_future) * 100) if total_tasks_future > 0 else '0'
        task_categories_future.append({
            'category': category,
            'total_tasks': total_tasks_future,
            'completed_tasks': completed_tasks_future,
            'progress_percent': progress_percent_future
        })

    return render(request, 'game/progress_html/progress.html', {
        'user': user,
        'task_categories_near': task_categories_near,
        'task_categories_future': task_categories_future,
        'tasks_top_completed': user_tasks_top_completed,
        'tasks_top_noncompleted': user_tasks_top_noncompleted,
        'tasks_decoration_range': tasks_decoration_range,
        'days_range': days_range,
        'completed_days': completed_days,
        'decorative_container_count': decorative_container_count,
        'calendar_progress_percent': calendar_progress_percent,
        'completed_days_with_counter': completed_days_with_counter
    })


def progress_tasks(request):
    category_id = request.GET.get('category_id')
    far = request.GET.get('far')  # 'true' или 'false'
    far = True if far == 'true' else False
    username = request.session.get('username')
    user = Users.objects.filter(name=username).first()
    user_tasks = UserTask.objects.filter(user=user, task__category__id=category_id, task__far=far)
    filtered_user_tasks = []
    for task in user_tasks:
        if task.active:
            filtered_user_tasks.append(task)
    category = TaskCategory.objects.filter(id=category_id).first()
    category_logo = category.logo
    category_name = category.title
    return render(request, 'game/progress_html/progress_list_partial.html', {
        'tasks': filtered_user_tasks,
        'task_category': category_name,
        'category_logo': category_logo
    })


def update_task_priority(request):
    task_id = request.POST.get('task_id')
    priority = request.POST.get('priority')
    priority = True if priority == 'true' else False
    task = UserTask.objects.get(id=task_id).task
    task.top = priority
    task.save()
    return JsonResponse({'status': 'ok'})


def tasks(request):
    username = request.session.get('username')
    user = Users.objects.filter(name=username).first()

    top_uncompleted_task = None
    user_tasks_not_completed = []
    total_user_tasks = []
    tasks = UserTask.objects.filter(user=user)
    for task in tasks:
        if task.active:
            if not task.task.far:
                if not task.completed:
                    if task.task.top:
                        pass
                    user_tasks_not_completed.append(task)
                total_user_tasks.append(task)

    calendar_progress_percent = (
        round((1 - len(user_tasks_not_completed) / len(total_user_tasks)) * 100) if len(total_user_tasks) != 0 else 0
    )
    task_categories = TaskCategory.objects.all()  # Получение всех категорий задач

    return render(request, 'game/tasks_html/tasks.html', {
        'user': user,
        'task_categories': task_categories,
        'calendar_progress_percent': calendar_progress_percent
    })


def filter_tasks(request):
    category_name = request.GET.get('category')
    username = request.session.get('username')
    user = Users.objects.filter(name=username).first()

    # Получаем задачи пользователя, связанные через UserTask, фильтруем по категории и сортируем по полю top
    near_tasks = UserTask.objects.filter(user=user, task__category__category_name=category_name, task__far=False, active=True)
    far_tasks = UserTask.objects.filter(user=user, task__category__category_name=category_name, task__far=True, active=True)



    # Получаем выполненные задачи
    completed_tasks = UserTask.objects.filter(user=user, task__category__category_name=category_name, completed=True)
    filtered_completed_tasks = []
    for task in completed_tasks:
        if task.active:
            filtered_completed_tasks.append(task)
    # Получаем логотип категории
    category = TaskCategory.objects.filter(category_name=category_name).first()
    category_logo = category.logo if category else None
    russian_title = category.title

    return render(request, 'game/tasks_html/tasks_list_partial.html', {
        'user': user,
        'task_category': category_name,
        'near_tasks': near_tasks,
        'far_tasks': far_tasks,
        'category_logo': category_logo,
        'complete_tasks': filtered_completed_tasks,
        'russian_title': russian_title
    })


def create_task(request):
    task_category = request.GET.get('task_category', None)
    task_form = TaskForm()  # Создаём экземпляр формы TaskForm
    form_set = TaskItemFormSet(queryset=TaskItem.objects.none())  # Создаём пустой формсет
    username = request.session.get('username')
    user = Users.objects.filter(name=username).first()  # Получаем пользователя

    top_uncompleted_task = None
    user_tasks_not_completed = []
    total_user_tasks = []
    tasks = UserTask.objects.filter(user=user)
    for task in tasks:
        if task.active:
            if not task.task.far:
                if not task.completed:
                    if task.task.top:
                        top_uncompleted_task = task
                    user_tasks_not_completed.append(task)
                total_user_tasks.append(task)

    calendar_progress_percent = (
        round((1 - len(user_tasks_not_completed) / len(total_user_tasks)) * 100) if len(total_user_tasks) != 0 else 0
    )
    return render(request, 'game/tasks_html/create_task.html', {
        'task_form': task_form,
        'task_category': task_category,
        'form_set': form_set,
        'user': user,
        'calendar_progress_percent': calendar_progress_percent
    })


def task_info(request):
    user_task_id = request.GET.get('task_id')
    username = request.session.get('username')
    user = Users.objects.filter(name=username).first()
    form_user_comment = UserCommentForm()
    user_task = UserTask.objects.get(id=user_task_id)
    task = user_task.task

    task_paragraphs = TaskItem.objects.filter(task=task)

    comment = TaskComment.objects.filter(task=task).first()
    image_list = task.images.all()
    image_urls = [image.image.url for image in image_list]
    if comment:
        comment_images = comment.images.all()
        comment_image_urls = [image.image.url for image in comment_images]

        return render(request, 'game/tasks_html/task_info.html', {
            'user': user,
            'form_user_comment': form_user_comment,
            'task': task,
            'image_urls': image_urls,
            'user_task_id': user_task_id,
            'is_completed': True,
            'comment': comment.user_comment,
            'comment_images': comment_image_urls,
            'task_paragraphs': task_paragraphs
        })
    else:
        return render(request, 'game/tasks_html/task_info.html', {
            'user': user,
            'form_user_comment': form_user_comment,
            'task': task,
            'image_urls': image_urls,
            'user_task_id': user_task_id,
            'is_completed': False,
            'task_paragraphs': task_paragraphs

        })


def complete_task(request):
    username = request.session.get('username')
    task_id = request.POST.get('task_id')
    if not username or not task_id:
        return JsonResponse({'status': 'error', 'message': 'Недостаточно данных для завершения задачи.'})

    user_task = UserTask.objects.get(id=task_id)

    if user_task.completed:
        return JsonResponse({'status': 'error', 'message': 'Задача уже завершёна.'})

    # Обновляем статус квеста
    user_task.completed = True
    user_task.complete_time = datetime.now()
    user_task.save()

    return JsonResponse({'status': 'success', 'message': 'Задача успешно завершёна.'})


def create_task_post(request):
    if request.method == 'POST':
        form = TaskForm(request.POST, request.FILES)
        form_set = TaskItemFormSet(request.POST)  # Получаем данные формсета

        if form.is_valid() and form_set.is_valid():  # Проверяем валидность обеих форм
            # Сохраняем Task
            task = form.save(commit=False)
            task_category = request.POST.get('task_category')
            task_type = request.POST.get('task_type')

            if task_category:
                category = TaskCategory.objects.get(category_name=task_category)
                task.category = category

            # Присваиваем булевое значение полю task_type
            task.far = task_type
            task.save()

            # Сохраняем связанные TaskItem
            for index, item_form in enumerate(form_set):
                if item_form.cleaned_data:  # Проверяем, заполнена ли форма
                    task_item = item_form.save(commit=False)
                    task_item.task = task  # Связываем TaskItem с Task
                    task_item.order = index + 1  # Устанавливаем порядок
                    task_item.save()

            # Сохраняем изображения
            images = request.FILES.getlist('images')
            for img in images:
                TaskImage.objects.create(task=task, image=img)

            # Привязываем Task к пользователю
            username = request.session.get('username')
            user = Users.objects.filter(name=username).first()
            UserTask.objects.create(user=user, task=task)

            return JsonResponse({'success': True})
        else:
            # Возвращаем ошибки форм
            errors = {**form.errors, **form_set.errors}
            return JsonResponse({'success': False, 'errors': errors})
    return JsonResponse({'success': False, 'errors': 'Invalid request method'})


from django.conf import settings


def edit_task(request):
    data = request.POST
    title = data.get('title')
    paragraphs_text = data.get('paragraphTexts').split(',')

    task_id = data.get('task_id')
    image_urls = data.getlist('image_urls')  # Список URL-адресов изображений (возможно, в байтовом формате)
    image_files = request.FILES.getlist('task-images')  # Список загруженных файлов

    task = UserTask.objects.get(id=task_id).task
    paragraphs = TaskItem.objects.filter(task=task)

    if title and title != task.title:
        task.title = title

    # Проверка и обновление description
    for paragraph, new_paragraph in zip(paragraphs, paragraphs_text):
        if paragraph.description != new_paragraph and new_paragraph != '':
            paragraph.description = new_paragraph
            paragraph.save()

    # Приводим image_urls к относительным строкам (удаляем '/media/' и декодируем байтовые строки)
    relative_image_urls = [
        unquote(url.replace(settings.MEDIA_URL, '')) for url in image_urls
    ]
    # Проверка текущих изображений задачи
    task_images = TaskImage.objects.filter(task=task)

    for image_obj in task_images:
        if image_obj.image.name not in relative_image_urls:
            print(f"Удаляем изображение: {image_obj.image}")
            image_obj.delete()

    # Добавление новых изображений из image_files (если есть)
    for file in image_files:
        TaskImage.objects.create(task=task, image=file)
    task.save()

    return JsonResponse({'success': True})


def complete_task_post(request):
    task_id = request.GET.get('taskId')
    if request.method == 'POST':
        form = UserCommentForm(request.POST, request.FILES)
        if form.is_valid():
            try:
                # Извлечение задачи
                task = UserTask.objects.get(id=task_id).task  # Извлекаем связанную задачу

                # Завершение всех связанных параграфов задачи
                paragraphs = TaskItem.objects.filter(task=task)
                for paragraph in paragraphs:
                    paragraph.completed = True
                    paragraph.save()

                # Создание объекта TaskComment без дублирования
                comment_form = form.save(commit=False)  # Не сохраняем в БД сразу
                comment_form.task = task  # Устанавливаем внешний ключ на задачу
                comment_form.save()  # Теперь сохраняем в БД

                # Сохранение фотографий
                images = request.FILES.getlist('images')
                for img in images:
                    TaskCommentImages.objects.create(comment=comment_form, image=img)

                return JsonResponse({'success': True})

            except UserTask.DoesNotExist:
                return JsonResponse({'success': False, 'errors': 'Task not found'})
            except Exception as e:
                return JsonResponse({'success': False, 'errors': str(e)})
        else:
            return JsonResponse({'success': False, 'errors': form.errors})
    return JsonResponse({'success': False, 'errors': 'Invalid request method'})


def update_paragraph_status(request):
    paragraph_status = request.POST.get('paragraphStatus')
    paragraph_status = True if paragraph_status == 'true' else False
    paragraph_order = request.POST.get('paragraphOrder')
    task_id = request.POST.get('task_id')

    task = UserTask.objects.get(id=task_id).task
    paragraph = TaskItem.objects.get(task=task, order=paragraph_order)
    paragraph.completed = paragraph_status
    paragraph.save()
    return JsonResponse({'success': True})


def update_balance(request):
    if request.method == 'POST':
        username = request.session.get('username')
        balance_change = request.POST.get('balance_change')

        try:
            user = Users.objects.get(name=username)
            user.balance += int(balance_change)
            user.save()
            return JsonResponse({'status': 'success'})
        except Users.DoesNotExist:
            return JsonResponse({'status': 'error', 'message': 'User not found'})
    return JsonResponse({'status': 'error', 'message': 'Invalid request'})


def update_avatar(request):
    if request.method == 'POST':
        username = request.session.get('username')
        user = Users.objects.filter(name=username).first()
        avatar_file = request.FILES.get('avatar')

        if avatar_file:
            # Проверка размера файла (например, не более 5 МБ)
            if avatar_file.size > 5 * 1024 * 1024:
                return JsonResponse({'success': False, 'message': 'Файл слишком большой (максимум 5 МБ)'})

            # Проверка формата изображения
            try:
                width, height = get_image_dimensions(avatar_file)
            except Exception:
                return JsonResponse({'success': False, 'message': 'Неверный формат изображения'})

            user.avatarka = avatar_file
            user.save()
            avatar_url = user.avatarka.url
            return JsonResponse({'success': True, 'avatar_url': avatar_url})
        else:
            return JsonResponse({'success': False, 'message': 'Файл не получен'})
    return JsonResponse({'success': False, 'message': 'Неверный метод запроса'})


def load_images(request):
    user_task_id = request.GET.get('task_id')
    try:
        user_task = UserTask.objects.get(id=user_task_id)
        task = user_task.task
        image_list = task.images.all()
        image_urls = [image.image.url for image in image_list]

        # Возвращаем JSON-ответ
        return JsonResponse({"status": "success", "image_urls": image_urls})
    except UserTask.DoesNotExist:
        return JsonResponse({"status": "error", "message": "Задача не найдена"})


def challenge(request):
    username = request.session.get('username')
    user = Users.objects.get(name=username)

    today = date.today()
    # Находим понедельник текущей недели
    monday_of_this_week = today - timedelta(days=today.weekday())



    # Создаем 7 ежедневных задач, если они отсутствуют
    today_date = date.today()
    challenge_week = UserWeeklyChallenge.objects.get(user=user, week_start_date=user.week_start_date)

    completed_by_day = [challenge_week.monday_count, challenge_week.tuesday_count, challenge_week.wednesday_count,
                             challenge_week.thursday_count, challenge_week.friday_count,
                             challenge_week.saturday_count,
                             challenge_week.sunday_count]

    # print(challenge_week, 'challenge_week')

    # Извлечь все задачи пользователя
    daily_tasks = UserChallengeDailyTask.objects.filter(user=user).order_by('date')
    if len(daily_tasks) < 7:
        for i in range(7):
            UserChallengeDailyTask.objects.create(user=user, week=challenge_week, date=today_date, task_number=i+1)
    # Обновить дату и статус задач, если они не соответствуют сегодняшней дате
    if daily_tasks.count() != 7 or any(task.date != today_date for task in daily_tasks):
        daily_tasks.update(date=today_date, completed=False)
        challenge_week.completed = False
        challenge_week.save()

    # Заново получить задачи для сегодняшней даты
    daily_tasks = UserChallengeDailyTask.objects.filter(user=user, date=today_date).order_by('date')
    week_task_completed = challenge_week.completed
    now = datetime.now()
    current_month_num = now.month
    months = [
        "январь", "февраль", "март", "апрель", "май", "июнь",
        "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"
    ]
    current_month = months[current_month_num - 1]
    current_year = now.year

    day_of_year = now.timetuple().tm_yday
    percent_day_year = round(day_of_year / 365 * 100)

    completed_user_daily_tasks_count = 0
    for daily_task in daily_tasks:
        if daily_task.completed:
            completed_user_daily_tasks_count += 1


    today_weekday_index = today.weekday() + 1
    weekdays = [
        {'number': i, 'name': n, 'short_name': s, 'completed_count': completed_by_day[i-1]}
        for i, n, s in [
            (1, 'Понедельник', 'Пн'),
            (2, 'Вторник', 'Вт'),
            (3, 'Среда', 'Ср'),
            (4, 'Четверг', 'Чт'),
            (5, 'Пятница', 'Пт'),
            (6, 'Суббота', 'Сб'),
            (7, 'Воскресенье', 'Вс')
        ]
    ]

    context = {
        'user': user,
        'user_daily_tasks': daily_tasks,
        'weekdays': weekdays,
        'current_weekday_number': now.isoweekday(),
        'weekly_challenge_text': challenge_week.challenge_text,
        'day_of_year': day_of_year,
        'percent_day_year': percent_day_year,
        'today_weekday_index': today_weekday_index,
        'completed_user_daily_tasks_count': completed_user_daily_tasks_count,
        'current_month': current_month,
        'current_year': current_year,
        'week_task_completed': week_task_completed
    }

    return render(request, 'game/challenge.html', context)


def counter(request):
    username = request.session.get('username')
    user = Users.objects.get(name=username)
    counters = Counter.objects.filter(user=user, completed=False)
    context = {
        'counters': counters,
    }
    return render(request, 'game/counter/counter.html', context)


def create_counter(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except Exception:
            return JsonResponse({'error': 'Неверные данные'}, status=400)
        name = data.get('name')
        try:
            target = int(data.get('target'))
        except (ValueError, TypeError):
            return JsonResponse({'error': 'Некорректное количество'}, status=400)
        username = request.session.get('username')
        user = Users.objects.get(name=username)
        counter = Counter.objects.create(user=user, name=name, target=target)
        return JsonResponse({
            'id': counter.id,
            'name': counter.name,
            'score': counter.score,
            'target': counter.target,
        })
    return JsonResponse({'error': 'Неверный метод запроса'}, status=400)


def increment_counter(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except Exception:
            return JsonResponse({'error': 'Неверные данные'}, status=400)
        counter_id = data.get('counter_id')
        username = request.session.get('username')
        user = Users.objects.get(name=username)
        counter = get_object_or_404(Counter, id=counter_id, user=user)
        counter.score += 1
        if counter.score >= counter.target:
            counter.completed = True
            counter.save()
            # Если достигли цели – отправляем признак выполнения
            return JsonResponse({'completed': True, 'counter_id': counter.id})
        else:
            counter.save()
            return JsonResponse({
                'completed': False,
                'counter_id': counter.id,
                'score': counter.score,
                'target': counter.target
            })
    return JsonResponse({'error': 'Неверный метод запроса'}, status=400)


def update_counter(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except Exception:
            return JsonResponse({'error': 'Неверные данные'}, status=400)
        counter_id = data.get('counter_id')
        new_name = data.get('name')
        try:
            new_target = int(data.get('target'))
        except (ValueError, TypeError):
            return JsonResponse({'error': 'Некорректное количество'}, status=400)
        username = request.session.get('username')
        user = Users.objects.get(name=username)
        counter = get_object_or_404(Counter, id=counter_id, user=user)
        counter.name = new_name
        counter.target = new_target
        counter.save()
        return JsonResponse({
            'counter_id': counter.id,
            'name': counter.name,
            'target': counter.target,
        })
    return JsonResponse({'error': 'Неверный метод запроса'}, status=400)


def delete_counter(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
        except Exception:
            return JsonResponse({'error': 'Неверные данные'}, status=400)
        counter_id = data.get('counter_id')
        username = request.session.get('username')
        user = Users.objects.get(name=username)
        counter = get_object_or_404(Counter, id=counter_id, user=user)
        counter.delete()
        return JsonResponse({'deleted': True, 'counter_id': counter_id})
    return JsonResponse({'error': 'Неверный метод запроса'}, status=400)
