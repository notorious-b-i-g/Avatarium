from django.urls import path
from . import views


urlpatterns = [
    path('', views.game, name='game'),
    path('update_balance/', views.update_balance, name='update_balance'),
    path('index', views.index, name='game-index'),
    path('quest', views.quest, name='game-quest'),
    path('tasks', views.tasks, name='game-tasks'),
    path('tasks/filter/', views.filter_tasks, name='filter_tasks'),
    path('tasks/create/near', views.create_task_near, name='create_task_near'),  # POST-запрос
    path('tasks/create/far', views.create_task_near, name='create_task_far'),  # POST-запрос

    path('tasks/create/', views.create_task, name='create_task'),  # GET-запрос для рендера HTML
    path('quests/see_quest/', views.quest_info, name='see_quest'),
]