# forms.py
from django.forms import ModelForm, Textarea, TextInput, NumberInput
from .models import Task


class TaskForm(ModelForm):
    class Meta:
        model = Task
        fields = ['title', 'description', 'cost']

        widgets = {"title": TextInput(attrs={'class': 'task-title-input', 'placeholder': 'Введи название'}),
                   "description": Textarea(attrs={'class': 'task-desc-input', 'placeholder': 'Введите текст описания'}),
                   "cost": NumberInput(attrs={'class': 'task-cost-input'})}
