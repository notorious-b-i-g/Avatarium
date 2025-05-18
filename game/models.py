from email.policy import default

from django.db import models


class TaskCategory(models.Model):
    class Meta:
        verbose_name = 'Категория задачи'
        verbose_name_plural = 'Категории задач'

    category_name = models.CharField(max_length=255)
    title = models.CharField(max_length=255, blank=True, null=True)
    logo = models.FileField(upload_to='tasks/logos', blank=True, null=True)

    def __str__(self):
        return self.category_name


class Task(models.Model):
    title = models.CharField(max_length=25)
    cost = models.IntegerField()
    category = models.ForeignKey(
        TaskCategory,
        on_delete=models.CASCADE,
        blank=True,
        null=True,
        related_name='tasks'
    )
    top = models.BooleanField(default=False)
    far = models.BooleanField(default=False)
    post_time = models.DateField(auto_now_add=True, blank=True, null=True)
    complete_time = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.title


class TaskItem(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='items')
    description = models.TextField()
    order = models.PositiveIntegerField()
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"Пункт {self.description} для задачи {self.task.title}"


class TaskComment(models.Model):
    task = models.OneToOneField(Task, on_delete=models.CASCADE, blank=True, null=True, related_name='comment')
    user_comment = models.TextField()

    def __str__(self):
        if self.task:
            return f"Comment for {self.task.title}"
        else:
            return self.user_comment


class TaskCommentImages(models.Model):
    comment = models.ForeignKey(TaskComment, on_delete=models.CASCADE, blank=True, null=True, related_name='images')
    image = models.ImageField(upload_to='tasks/comment_images/', blank=True, null=True)

    def __str__(self):
        return f"Image for comment {self.comment.id}"


class TaskImage(models.Model):
    task = models.ForeignKey(Task, related_name='images', on_delete=models.CASCADE)
    image = models.ImageField(upload_to='tasks/images/')


class Quest(models.Model):
    class Meta:
        verbose_name = 'Квест'
        verbose_name_plural = 'Квесты'

    title = models.CharField(max_length=255)
    description = models.TextField()
    sub_description = models.TextField(blank=True, null=True)
    top = models.BooleanField(default=False)
    cost = models.IntegerField()
    logo = models.FileField(upload_to='quests/logos/', blank=True, null=True)  # Поле для логотипа
    info_image = models.ImageField(upload_to='quests/images/', blank=True, null=True)  # Поле для логотипа

    def __str__(self):
        return self.title


class Users(models.Model):
    class Meta:
        verbose_name = 'Пользователь'
        verbose_name_plural = 'Пользователи'

    name = models.CharField(max_length=255)
    telegram_name = models.CharField(max_length=255, blank=True, null=True)
    nickname = models.CharField(max_length=255, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    reg_time = models.DateTimeField(auto_now_add=True)
    balance = models.IntegerField(default=0)
    streak = models.IntegerField(default=0)
    week_start_date = models.DateField(null=True, blank=True)
    avatarka = models.ImageField(
        upload_to='avatars/',
        default='avatars/def_ava.png'
    )

    # Новые поля
    GENDER_CHOICES = [
        ('male', 'Мужчина'),
        ('female', 'Женщина'),
        ('attack_helicopter', 'Боевой вертолет')
    ]
    gender = models.CharField(
        max_length=20,
        choices=GENDER_CHOICES,
        blank=True,
        null=True,
        default=None
    )
    date_of_birth = models.DateField(blank=True, null=True)

    def __str__(self):
        return self.telegram_name if self.telegram_name else self.name


class UserQuest(models.Model):
    user = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        related_name='user_quests'
    )
    quest = models.ForeignKey(
        Quest,
        on_delete=models.CASCADE,
        related_name='user_quests_relations'
    )
    completed = models.BooleanField(default=False)

    def __str__(self):
        status = "Выполнено" if self.completed else "Не выполнено"
        return f"{self.user.name} - {self.quest.title} - {status}"


class UserTask(models.Model):
    user = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        related_name='user_tasks_relations'
    )
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name='user_tasks'
    )
    completed = models.BooleanField(default=False)
    active = models.BooleanField(default=True)

    def __str__(self):
        status = "Выполнено" if self.completed else "Не выполнено"
        active = "Активно" if self.active else "Не активно"
        return f"{self.user.name} - {self.task.title} - {status} - {active}"


class UserVisit(models.Model):
    user = models.ForeignKey(
        Users,
        on_delete=models.CASCADE,
        related_name='visits'
    )
    day_index = models.IntegerField(blank=True, null=True)

    visit_time = models.DateField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.name} - {self.visit_time.strftime('%Y-%m-%d %H:%M:%S')}"


class Promo(models.Model):
    class Meta:
        verbose_name = 'Акция'
        verbose_name_plural = 'Акции'

    SHOW_PLACE_CHOICES = {
        "library": 'Библиотека',
        "main": 'Главная'
    }

    name = models.CharField(max_length=255, blank=True, null=True)
    show_place = models.CharField(
        max_length=50,
        choices=list(SHOW_PLACE_CHOICES.items()),
        default="main",
    )
    promo_img = models.FileField(upload_to='promo', blank=True, null=True)
    url = models.TextField(blank=True, null=True)

    def __str__(self):
        # Получаем русское представление значения `show_place`
        show_place_display = self.SHOW_PLACE_CHOICES.get(str(self.show_place), 'Неизвестно')
        return f"{self.name} в {show_place_display}"


# class Presentation(models.Model):
#     class Meta:
#         verbose_name = 'Слайдер'
#         verbose_name_plural = 'Слайдер'
#     promo = models.ForeignKey(Promo, null=True, blank=True, on_delete=models.CASCADE)
#
#     def __str__(self):
#         if self.promo is not None:
#             return f"Promo: {self.promo.name}"
#         return "Promo: None"

#
# class VideoUrls(models.Model):
#     class Meta:
#         verbose_name = 'Ютуб видео'
#         verbose_name_plural = 'Ютуб видео'
#     video_url = models.TextField(blank=True, null=True)
#
#     def __str__(self):
#         return "videos"


class OtherUrls(models.Model):
    class Meta:
        verbose_name = 'Дополнительные ссылки'
        verbose_name_plural = 'Дополнительные ссылки'

    post_url = models.TextField(blank=True, null=True)
    post_img = models.FileField(blank=True, null=True, upload_to='library')
    practice_url = models.TextField(blank=True, null=True)
    practice_img = models.FileField(blank=True, null=True, upload_to='library')

    def __str__(self):
        return "other"


class Questions(models.Model):
    class Meta:
        verbose_name = 'Вопрос и ответ'
        verbose_name_plural = 'Вопросы и ответы'

    question = models.CharField(max_length=255)
    answer = models.CharField(max_length=255)

    def __str__(self):
        return self.question


class UserWeeklyChallenge(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='weekly_challenges')
    week_start_date = models.DateField()
    challenge_text = models.CharField(max_length=255, blank=True, null=True)
    completed = models.BooleanField(default=False)

    monday_count = models.IntegerField(default=0)
    tuesday_count = models.IntegerField(default=0)
    wednesday_count = models.IntegerField(default=0)
    thursday_count = models.IntegerField(default=0)
    friday_count = models.IntegerField(default=0)
    saturday_count = models.IntegerField(default=0)
    sunday_count = models.IntegerField(default=0)

    class Meta:
        unique_together = ('user', 'week_start_date')

    def __str__(self):
        return f"{self.user.name} - {self.week_start_date} - {self.challenge_text}"


class UserChallengeDailyTask(models.Model):
    week = models.ForeignKey(UserWeeklyChallenge, on_delete=models.CASCADE, related_name='UserChallengeDailyTask')
    user = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='challenge_daily_tasks')
    date = models.DateField()
    task_number = models.IntegerField()  # 1..7
    title = models.CharField(max_length=255, blank=True, null=True)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.name} - Week: {self.week.week_start_date} - задача {self.task_number} - {('Выполнено' if self.completed else 'Не выполнено')}"


class Counter(models.Model):
    user = models.ForeignKey(Users, on_delete=models.CASCADE, related_name='counter_object')
    name = models.CharField(max_length=16)
    target = models.IntegerField()
    score = models.IntegerField(default=0)
    completed = models.BooleanField(default=False)
