# forms.py
from django.forms import ModelForm, Textarea, TextInput, NumberInput, modelformset_factory, HiddenInput
from .models import Task, TaskComment, TaskItem, Counter


class TaskForm(ModelForm):
    class Meta:
        model = Task
        fields = ['title', 'cost', 'top', 'category', 'far']
        widgets = {
            "title": TextInput(attrs={'class': 'task-title-input', 'placeholder': 'Введи название'}),
            "cost": NumberInput(attrs={'class': 'task-cost-input'}),
            "top": HiddenInput(),
            "category": HiddenInput(),
            "far": HiddenInput()
        }


class TaskItemForm(ModelForm):
    class Meta:
        model = TaskItem
        fields = ['description', 'completed']
        widgets = {
            'description': TextInput(attrs={
                'class': 'task-item-desc-input',
                'placeholder': 'Введите описание пункта',
                'maxlength': '40'
            }),
            'completed': HiddenInput()
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['description'].label = ''  # Убираем лейбл для описания


# Создание формсета для TaskItem
TaskItemFormSet = modelformset_factory(
    TaskItem,
    form=TaskItemForm,
    extra=1  # Добавляем одну пустую форму
)


class UserCommentForm(ModelForm):
    class Meta:
        model = TaskComment
        fields = ['user_comment']

        widgets = {
            "user_comment": Textarea(
                attrs={'class': 'user-comment-desc-input', 'placeholder': 'Введите текст благодарности',
                       'style': 'height: 100px;'}),

        }


class CounterForm(ModelForm):
    class Meta:
        model = Counter
        fields = ['name']

        widgets = {
            "name": TextInput(attrs={'class': 'input-counter-name', 'placeholder': 'Название счётчика'})

        }
