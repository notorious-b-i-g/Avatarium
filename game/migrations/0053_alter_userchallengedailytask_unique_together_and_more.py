# Generated by Django 5.1.2 on 2024-12-19 13:53

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0052_alter_taskitem_completed_and_more'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='userchallengedailytask',
            unique_together=set(),
        ),
        migrations.AddField(
            model_name='userchallengedailytask',
            name='week',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='UserChallengeDailyTask', to='game.userweeklychallenge'),
        ),
        migrations.AlterField(
            model_name='userchallengedailytask',
            name='date',
            field=models.DateField(blank=True, null=True),
        ),
        migrations.RemoveField(
            model_name='userchallengedailytask',
            name='week_start_date',
        ),
    ]
