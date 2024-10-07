from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import UserQuest, Quest, Users

# Сигнал для добавления всех существующих квестов новому пользователю
@receiver(post_save, sender=Users)
def create_user_quests(sender, instance, created, **kwargs):
    if created:
        quests = Quest.objects.all()
        for quest in quests:
            UserQuest.objects.create(user=instance, quest=quest)

# Сигнал для добавления нового квеста всем пользователям
@receiver(post_save, sender=Quest)
def assign_quest_to_all_users(sender, instance, created, **kwargs):
    if created:
        users = Users.objects.all()
        for user in users:
            UserQuest.objects.create(user=user, quest=instance)
