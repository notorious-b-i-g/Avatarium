# forms.py
from django.forms import ModelForm, Textarea, TextInput, NumberInput, ClearableFileInput
from .models import Task


class TaskFormNear(ModelForm):
    class Meta:
        model = Task
        fields = ['title', 'description', 'cost', 'image']

        widgets = {"title": TextInput(attrs={'class': 'task-title-input', 'placeholder': 'Введи название'}),
                   "description": Textarea(attrs={'class': 'task-desc-input', 'placeholder': 'Введите текст описания'}),
                   "image": ClearableFileInput(attrs={'class': 'task-img-input'}),  # Устанавливаем класс
                   "cost": NumberInput(attrs={'class': 'task-cost-input'})}


class TaskFormFar(ModelForm):
    class Meta:
        model = Task
        fields = ['title', 'description', 'cost', 'image']

        widgets = {"title": TextInput(attrs={'class': 'task-title-input', 'placeholder': 'Введи название'}),
                   "description": Textarea(attrs={'class': 'task-desc-input', 'placeholder': 'Введите текст описания'}),
                   "image": ClearableFileInput(attrs={'class': 'task-img-input'}),  # Устанавливаем класс
                   "cost": NumberInput(attrs={'class': 'task-cost-input'})}