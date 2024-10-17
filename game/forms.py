# forms.py
from django.forms import ModelForm, Textarea, TextInput, NumberInput, ClearableFileInput, HiddenInput
from .models import Task


class TaskFormNear(ModelForm):
    class Meta:
        model = Task
        fields = ['title', 'description', 'top', 'category', 'far']  # Добавлено поле 'category'
        widgets = {
            "title": TextInput(attrs={'class': 'task-title-input', 'placeholder': 'Введи название'}),
            "description": Textarea(attrs={'class': 'task-desc-input', 'placeholder': 'Введите текст описания', 'style': 'height: 100px;'}),
            "cost": HiddenInput(),
            "top": HiddenInput(),
            "category": HiddenInput(),
            "far": HiddenInput()
        }



class TaskFormFar(ModelForm):
    class Meta:
        model = Task
        fields = ['title', 'description', 'top', 'category', 'far']  # Добавлено поле 'category'
        widgets = {
            "title": TextInput(attrs={'class': 'task-title-input', 'placeholder': 'Введи название'}),
            "description": Textarea(attrs={'class': 'task-desc-input', 'placeholder': 'Введите текст описания', 'style': 'height: 100px;'}),
            "cost": HiddenInput(),
            "top": HiddenInput(),
            "category": HiddenInput(),
            "far": HiddenInput()
        }
