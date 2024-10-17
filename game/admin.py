from django.contrib import admin
from .models import *

class UsersAdmin(admin.ModelAdmin):
    # Удаляем filter_horizontal для tasks, так как его больше нет в Users
    # Вы можете добавить другие поля, которые хотите видеть в админке
    list_display = ('name', 'reg_time', 'balance')  # Пример отображения полей
    search_fields = ('name',)  # Поля для поиска

admin.site.register(Users, UsersAdmin)
admin.site.register(Quest)
admin.site.register(Task)
admin.site.register(UserQuest)
admin.site.register(TaskCategory)
admin.site.register(TaskImage)
admin.site.register(UserTask)
