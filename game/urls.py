from django.urls import path
from . import views


urlpatterns = [
    path('', views.game, name='game'),
    path('update_balance/', views.update_balance, name='update_balance'),
    path('index', views.index, name='game-index'),
    path('quest', views.quest, name='game-quest'),
    path('tasks', views.tasks, name='game-tasks'),
    path('tasks/filter/', views.filter_tasks, name='filter_tasks'),
    path('tasks/create/task', views.create_task_post, name='create_task_near'),  # POST-запрос
    path('tasks/create/', views.create_task, name='create_task'),  # GET-запрос для рендера HTML
    path('quests/see_quest/', views.quest_info, name='see_quest'),
    path('progress/', views.progress, name='progress'),
    path('progress/near_games/', views.progress_near_games, name='progress_near_games'),
    path('progress/future_games/', views.progress_future_games, name='progress_future_games'),
    path('progress/top_games/', views.progress_top_games, name='progress_top_games'),
    path('progress/filter/', views.progress_tasks, name='filter_progress'),
]