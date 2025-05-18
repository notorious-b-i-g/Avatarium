# game/urls.py

from django.urls import path
from . import views

urlpatterns = [
    path('', views.game, name='game'),
    path('log', views.log, name='log'),
    path('update_balance/', views.update_balance, name='update_balance'),
    path('index/', views.index, name='game-index'),
    path('quest/', views.quest, name='game-quest'),
    path('tasks/', views.tasks, name='game-tasks'),
    path('tasks/filter/', views.filter_tasks, name='filter_tasks'),
    path('tasks/create/task', views.create_task_post, name='create_task_near'),
    path('tasks/create/', views.create_task, name='create_task'),
    path('tasks/see_task/', views.task_info, name='see_task'),
    path('tasks/complete/', views.complete_task, name='complete_task'),
    path('tasks/edit_task/', views.edit_task, name='edit_task'),
    path('tasks/create/user_comment/', views.complete_task_post, name='complete_task'),
    path('tasks/info/load_images/', views.load_images, name='load_images'),
    path('tasks/update_paragraph_status/', views.update_paragraph_status, name='update_paragraph_status'),
    path('quests/see_quest/', views.quest_info, name='see_quest'),
    path('quests/complete/', views.complete_quest, name='complete_quest'),
    path('progress/', views.progress, name='progress'),
    path('progress/tasks/', views.progress_tasks, name='progress_tasks'),
    path('update_avatar/', views.update_avatar, name='update_avatar'),
    path('library/', views.library, name='library'),
    path('update_task_priority', views.update_task_priority, name='update_task_priority'),
    path('profile/', views.profile, name='profile'),
    path('update_profile/', views.update_profile, name='update_profile'),
    path('challenge/', views.challenge, name='challenge'),
    path('challenge/update_task_name/', views.update_task_name, name='update_task_name'),
    path('challenge/toggle_task_status/', views.toggle_task_status, name='toggle_task_status'),
    path('challenge/update_weekly_challenge/', views.update_weekly_challenge, name='update_weekly_challenge'),
    path('counter/', views.counter, name='counter'),
    path('create_counter/', views.create_counter, name='create_counter'),
    path('increment_counter/', views.increment_counter, name='increment_counter'),
    path('update_counter/', views.update_counter, name='update_counter'),
    path('delete_counter/', views.delete_counter, name='delete_counter'),

]
