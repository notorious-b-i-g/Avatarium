# Generated by Django 5.1.2 on 2024-12-23 11:27

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0054_alter_userweeklychallenge_week_start_date'),
    ]

    operations = [
        migrations.AddField(
            model_name='userweeklychallenge',
            name='friday_cont',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='userweeklychallenge',
            name='monday_cont',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='userweeklychallenge',
            name='saturday_cont',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='userweeklychallenge',
            name='sunday_cont',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='userweeklychallenge',
            name='thursday_cont',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='userweeklychallenge',
            name='tuesday_cont',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='userweeklychallenge',
            name='wednesday_count',
            field=models.IntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='userchallengedailytask',
            name='date',
            field=models.DateField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='userchallengedailytask',
            name='week',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='UserChallengeDailyTask', to='game.userweeklychallenge'),
        ),
        migrations.AlterField(
            model_name='userweeklychallenge',
            name='week_start_date',
            field=models.DateField(),
        ),
    ]
