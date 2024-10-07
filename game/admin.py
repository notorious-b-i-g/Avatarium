from django.contrib import admin
from .models import *

class UsersAdmin(admin.ModelAdmin):
    filter_horizontal = ('tasks', )  # Позволяет удобнее выбирать задачи для пользователя


admin.site.register(Users, UsersAdmin)
admin.site.register(Quest)
admin.site.register(Task)
admin.site.register(UserQuest)