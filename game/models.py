from django.db import models


class TaskCategory(models.Model):
    category_name = models.CharField(max_length=255)
    title = models.CharField(max_length=255, blank=True, null=True)
    logo = models.ImageField(upload_to='tasks/logos', blank=True, null=True)

    def __str__(self):
        return self.category_name


class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    user_comment = models.TextField(blank=True , null=True)
    cost = models.IntegerField()
    category = models.ForeignKey(TaskCategory, on_delete=models.CASCADE, blank=True, null=True)
    top = models.BooleanField(default=False)
    far = models.BooleanField(default=False)

    def __str__(self):
        return self.title


class TaskImage(models.Model):
    task = models.ForeignKey(Task, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='tasks/images/')


class Quest(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    sub_description = models.TextField(blank=True, null=True)
    top = models.BooleanField(default=False)
    cost = models.IntegerField()
    logo = models.ImageField(upload_to='quests/logos/', blank=True, null=True)  # Поле для логотипа
    info_image = models.ImageField(upload_to='quests/images/', blank=True, null=True)  # Поле для логотипа

    def __str__(self):
        return self.title


class Users(models.Model):
    name = models.CharField(max_length=255)
    reg_time = models.DateTimeField()
    balance = models.IntegerField()
    avatarka = models.ImageField(upload_to='avatars', default='avatars/def_ava.png')

    def __str__(self):
        return self.name


class UserQuest(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    quest = models.ForeignKey(Quest, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.name} - {self.quest.title} - {'Completed' if self.completed else 'Not Completed'}"


class UserTask(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.name} - {self.task.title} - {'Completed' if self.completed else 'Not Completed'}"
