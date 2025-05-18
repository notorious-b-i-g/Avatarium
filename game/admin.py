from django.contrib.admin import AdminSite
from .models import *
from django.contrib.contenttypes.models import ContentType
from django import forms
from django.contrib import admin
from django.contrib.admin import AdminSite
from django.contrib.auth.models import Group, User
from django.contrib.auth.admin import GroupAdmin, UserAdmin
class UsersAdmin(admin.ModelAdmin):
    list_display = ('display_name', 'reg_time', 'balance')  # Изменено 'name' на 'display_name'
    search_fields = ('name', 'telegram_name')  # Добавил 'telegram_name' для поиска

    def display_name(self, obj):
        return str(obj)  # Использует метод __str__

    display_name.short_description = 'Имя пользователя'  # Название столбца в админке


class MyAdminSite(AdminSite):

    def get_app_list(self, request):
        """
        Return a sorted list of all the installed apps that have been
        registered in this site.
        """
        app_dict = self._build_app_dict(request)

        # Sort the apps alphabetically.
        app_list = sorted(app_dict.values(), key=lambda x: x['name'].lower())

        # Sort the models alphabetically within each app.
        #for app in app_list:
        #    app['models'].sort(key=lambda x: x['name'])

        return app_list


admin.site = MyAdminSite()


admin.site.register(Quest)
admin.site.register(Promo)
# admin.site.register(Presentation)
# admin.site.register(VideoUrls)
admin.site.register(OtherUrls)
admin.site.register(Questions)
admin.site.register(TaskCategory)
admin.site.register(Users, UsersAdmin)
admin.site.register(Counter)

admin.site.register(TaskItem)
admin.site.register(Task)

admin.site.register(UserQuest)
admin.site.register(TaskImage)
admin.site.register(UserTask)
admin.site.register(UserVisit)

admin.site.register(TaskComment)
admin.site.register(TaskCommentImages)

admin.site.register(UserWeeklyChallenge)
admin.site.register(UserChallengeDailyTask)


