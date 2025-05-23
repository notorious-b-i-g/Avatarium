# Generated by Django 5.1.2 on 2024-10-14 20:29

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0013_remove_task_category_remove_task_image_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='game.taskcategory'),
        ),
        migrations.AddField(
            model_name='task',
            name='user_comment',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AlterField(
            model_name='task',
            name='cost',
            field=models.IntegerField(),
        ),
    ]
