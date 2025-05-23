# Generated by Django 5.1.2 on 2024-10-12 21:32

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0010_quest_sub_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='task',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='tasks/images/'),
        ),
        migrations.AlterField(
            model_name='users',
            name='avatarka',
            field=models.ImageField(default='avatars/def_ava.png', upload_to='avatars'),
        ),
    ]
